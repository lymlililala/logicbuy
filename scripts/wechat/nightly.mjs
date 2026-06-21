#!/usr/bin/env node
/**
 * nightly.mjs —— logicbuy 公众号 → 双语选购指南 自动生成流水线（单文件编排，适合 CI）。
 *
 * 流程（全程内存，无中间文件，适合 GitHub Action 无状态运行）：
 *   1) 采集：从 accounts.json 抽样若干公众号，取其近期发文（标题）作候选源
 *   2) 聚类：DeepSeek 把候选按「可写成常青选购/避坑/体验指南」的主题归并（标题级，省 token）
 *   3) 查重：候选主题与 Supabase 已发布文章比对（slug/标题/LLM 近似），重复则丢
 *   4) 合成：逐主题拉源文正文 → DeepSeek 合成**英文原创** → 再本地化为**中文**（双语对齐、同 slug）
 *   5) 闸门：每语种过质量闸门 + DeepSeek 自评分；过线 draft=false，否则 draft=true（仍入库待人工放行）
 *   6) 配图：正文 ![alt](IMG: kw) 占位 → Pexels 真实图（双语共图）
 *   7) 落库：upsert pitfallfree_guides（onConflict slug,locale）
 *
 * 合规：源正文仅作合成素材、不外传、不全文转载；产出为多源综合 + 翻译的原创内容。
 *
 * 用法：
 *   node --env-file=.env.local scripts/wechat/nightly.mjs --dry-run
 *   node --env-file=.env.local scripts/wechat/nightly.mjs --limit 3
 *   node --env-file=.env.local scripts/wechat/nightly.mjs --limit 4 --accounts 12 --threshold 80
 *   CI：用 env 传 SUPABASE / PEXELS_API_KEY / DEEPSEEK_API_KEY / CIMIDATA 凭证
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CimiClient } from './cimidata/client.mjs'
import { DeepSeek } from './deepseek.mjs'
import { htmlToText, truncate } from './lib/clean-html.mjs'
import { uniqueSlug, slugify } from './lib/slug.mjs'
import { checkQuality } from './lib/quality.mjs'
import { isDuplicate } from './lib/dedup.mjs'
import {
  fetchPublishedGuides,
  upsertGuide,
  fetchSeenSns,
  markSourcesSeen,
} from './lib/supabase.mjs'
import { ImageFinder } from '../lib/pexels.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))

function arg(name, def) {
  const i = process.argv.indexOf(name)
  if (i === -1) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const DRY = process.argv.includes('--dry-run')
const LIMIT = Number(arg('--limit', 3)) // 本轮目标发布篇数
const N_ACCOUNTS = Number(arg('--accounts', 12)) // 本轮抽样公众号数
const THRESHOLD = Number(arg('--threshold', 80)) // 自评分过线阈值
const DATE = new Date().toISOString().slice(0, 10)

// logicbuy 站内常用大类 tag（提示模型 tags 向其靠拢，便于 RelatedGuides 自动互链）
const SITE_TAGS = [
  'buying-guide',
  'home-appliances',
  'tech-electronics',
  'home-living',
  'kitchen',
  'home-renovation',
  'furniture',
  'smart-home',
  'parenting',
  'baby-maternity',
  'skincare-science',
  'skincare-personal-care',
  'outdoor-fitness',
  'pet-care',
  'cleaning',
  'air-quality',
  'home-entertainment',
  'computers-peripherals',
]

// ── 0) 账号 ─────────────────────────────────────────────────────────────────
const accounts = JSON.parse(readFileSync(join(__dir, 'accounts.json'), 'utf8')).filter(
  (a) => a.wxid
)
if (!accounts.length) {
  console.error('accounts.json 无可用 wxid，先跑 accounts.mjs')
  process.exit(1)
}

// 抽样（轮换）：按日期偏移取一段，跨天覆盖不同号
const offset = new Date().getDate() % accounts.length
const picked = []
for (let i = 0; i < Math.min(N_ACCOUNTS, accounts.length); i++) {
  picked.push(accounts[(offset + i) % accounts.length])
}

const cimi = new CimiClient()
const ds = new DeepSeek()
const finder = new ImageFinder()

const stripTags = (s) => (s || '').replace(/<[^>]+>/g, '').trim()
const snOf = (url) => url.match(/[?&]sn=([0-9a-f]+)/i)?.[1] || url

// ── 1) 采集候选源（标题级）─────────────────────────────────────────────────
console.log(`抽样 ${picked.length}/${accounts.length} 个公众号，拉近期发文…`)
const candidates = [] // { account, wxid, title, url, sn }
const seenSn = new Set()
for (const a of picked) {
  try {
    const { items } = await cimi.accountHistory(a.wxid, { nickname: a.nickname })
    for (const it of items || []) {
      const url = it.content_url
      if (!url) continue
      const sn = snOf(url)
      if (seenSn.has(sn)) continue
      seenSn.add(sn)
      const title = stripTags(it.title)
      if (title.length < 6) continue
      candidates.push({ account: a.nickname || a.name, wxid: a.wxid, title, url, sn })
    }
    console.log(`  ${a.nickname || a.name}: +${(items || []).length}`)
  } catch (e) {
    console.log(`  ✗ ${a.nickname || a.name}: ${e.message}`)
  }
}
console.log(`候选源 ${candidates.length} 篇，余额 ${cimi.balance}`)

// 跨轮去重：过滤掉已消费过的源文 sn（wx_sources_seen）。表不存在则降级跳过。
const seen = await fetchSeenSns()
if (seen.ok) {
  const before = candidates.length
  for (let i = candidates.length - 1; i >= 0; i--) {
    if (seen.set.has(candidates[i].sn)) candidates.splice(i, 1)
  }
  console.log(
    `源文跨轮去重：库内已消费 ${seen.set.size} 篇，过滤掉 ${before - candidates.length}，剩 ${candidates.length}`
  )
} else {
  console.log(
    `⚠️ wx_sources_seen 表不存在，跳过源文跨轮去重（先建表：scripts/wechat/create-wx-sources-seen.mjs）`
  )
}

if (candidates.length < 4) {
  console.error('候选源太少，结束')
  process.exit(0)
}

// ── 2) 聚类（标题级，选购语境）──────────────────────────────────────────────
const list = candidates.map((c, i) => ({ id: i, account: c.account, title: c.title }))
const CLUSTER_SYS = `You are a senior editor at a bilingual (English + Chinese) product-buying-guide site (logicbuy).
Below is a batch of article titles crawled from Chinese consumer/review/buying WeChat accounts.
Cluster them into themes that can each become an EVERGREEN buying guide, "common mistakes" guide, or long-term ownership/experience guide for a product category.

Requirements:
1. Each cluster picks 2-5 related source ids that cover the same product category.
2. Exclude time-sensitive deals/news/ads/recruitment and anything with no lasting buying-decision value.
3. Prefer angles: how to choose (specs/parameters that matter), common buying mistakes, or what owning it is really like. NO brand names.
4. Tags should map to these on-site tags where relevant: ${SITE_TAGS.join(', ')}.
5. Return at most ${LIMIT * 2} clusters, best first. Quality over quantity.

Return ONLY JSON:
{"clusters":[{
  "topic":"short english topic (product category + angle)",
  "working_title":"proposed English article title (specific, not clickbait)",
  "angle":"one sentence: what the reader gets",
  "source_ids":[ints],
  "suggested_tags":["english lowercase tags, prefer on-site tags above"]
}]}`

console.log(`聚类 ${list.length} 个标题（最多 ${LIMIT * 2} 簇）…`)
let clusters = []
try {
  const out = await ds.chatJSON(
    [
      { role: 'system', content: CLUSTER_SYS },
      { role: 'user', content: JSON.stringify(list) },
    ],
    { maxTokens: 4000 }
  )
  clusters = (out.clusters || []).filter(
    (c) => Array.isArray(c.source_ids) && c.source_ids.length >= 2
  )
} catch (e) {
  console.error('聚类失败:', e.message)
  process.exit(1)
}
console.log(`得到 ${clusters.length} 个候选主题`)

// ── 3) 查重（对已发布 EN 文章）────────────────────────────────────────────
const existing = await fetchPublishedGuides({ locale: 'en', select: 'slug,title' })
const existingSlugs = new Set(existing.map((p) => p.slug))
console.log(`库内已发布 EN 文章 ${existing.length} 篇，用于查重`)

const fresh = []
for (const c of clusters) {
  if (fresh.length >= LIMIT) break
  const dup = await isDuplicate(c, existing, ds)
  if (dup.dup) {
    console.log(`  ⊘ 查重跳过: ${c.working_title} [${dup.reason}] ↔ ${dup.match || ''}`)
    continue
  }
  fresh.push(c)
}
console.log(`待合成主题 ${fresh.length} 个`)
if (!fresh.length) {
  console.log('无新主题，结束')
  console.log('DeepSeek 用量:', ds.costEstimate())
  process.exit(0)
}

// ── 4/5/6/7) 逐主题：拉正文 → 合成 EN → 本地化 ZH → 闸门 → 配图 → 落库 ─────────
const EN_SYS = `You are a meticulous product researcher writing for logicbuy, an English buying-guide site.
You receive several Chinese WeChat articles on one product category as REFERENCE MATERIAL. Synthesize them into a brand-new, ORIGINAL ENGLISH buying guide.

IRON RULES:
1. Original synthesis, NOT a translation or rewrite of any one source. Re-organise, distil the consensus, add your own logical framework. Native English, no leftover Chinese, no "本文/小编/公众号".
2. NO brand names or specific model numbers. Teach by parameters, specs, mechanisms, trade-offs — what to look for and why. This is evergreen, vendor-neutral guidance.
3. Markdown body dialect:
   - Start with a 2-3 sentence intro paragraph (no heading).
   - Sections use ## and ###; bullets use - ; tables use | pipes |. Bold key terms with **...**.
   - Include a "## Quick Checklist" style section near the end summarising what to check.
   - End with "## FAQ" containing 3+ "### question\\nanswer" pairs relevant to buyers.
   - No fabricated specific prices, model names, or URLs.
4. Insert 2-3 inline images at natural points using EXACTLY this placeholder (real URLs filled later):
   ![specific descriptive alt](IMG: short english visual keywords)
   Keywords name the product/scene, e.g. (IMG: robot vacuum cleaning floor). Not inside tables or FAQ.
5. Include 1-2 internal links as Markdown links to on-site tag hubs you actually used, format /en/tags/<one-of-your-tags> , e.g. see more [home appliance guides](/en/tags/home-appliances). Do NOT invent /en/guides/<slug> paths.
6. Length: 1000-1600 English words. Genuinely useful depth, no padding.

Return ONLY JSON:
{
 "slug":"clean-lowercase-hyphenated, max 6 words, product+angle, NO date/brand (e.g. air-fryer-buying-guide)",
 "title":"English title (45-70 chars, specific)",
 "summary":"English meta description, 90-155 chars, one sentence, no trailing ellipsis",
 "content":"full Markdown body with 2-3 ![alt](IMG: ...) and 1-2 /en/tags/ links and a ## FAQ section",
 "tags":["english lowercase tags incl 'buying-guide' + product subtag + a big on-site tag"],
 "faq":[{"question":"...","answer":"..."}]
}`

const ZH_SYS = `你是 logicbuy 中文站的资深选购编辑。下面给你一篇英文选购指南（JSON）。
把它**改写为面向中国读者的地道中文选购指南**（不是逐字翻译，是本地化改写）。

铁律：
1. 地道中文，结构与英文版对应（同样的小节、清单、FAQ）。不得出现品牌名/型号，纯参数/原理/取舍。
2. Markdown：开头 2-3 句引言（无标题）；小节用 ## / ###；要点用 - ；表格用 | 竖线 |；关键词 **加粗**。
   结尾用 "## 常见问题"，含 3+ 个 "### 问题\\n答案"。
3. 图片占位**原样保留英文关键词**，只把 alt 改成中文描述：![中文描述](IMG: 同样的英文关键词)。位置与英文版一致，2-3 张。
4. 站内链接改成 /zh/tags/<同一个 tag>，1-2 条，例如 参见更多[家电选购指南](/zh/tags/home-appliances)。不要编造 /zh/guides/<slug>。
5. 篇幅 800-1400 字，信息扎实不灌水。

只返回 JSON：{"title":"中文标题","summary":"中文 meta 描述 40-80 字，一句话","content":"完整中文 Markdown 正文","faq":[{"question":"...","answer":"..."}]}`

const SCORE_SYS = `You are a strict content quality grader for a buying-guide site. Grade the ENGLISH article 0-100 on:
originality (not generic AI filler), depth (specific, parameter-level usefulness), accuracy (no fabricated facts/brands), readability.
Return ONLY JSON: {"originality":int,"depth":int,"accuracy":int,"readability":int,"overall":int,"notes":"short"}`

// IMG 占位解析：同篇相同关键词只搜一次，双语共图，未命中删占位
const IMG_RE = /!\[([^\]]*)\]\(\s*IMG:\s*([^)]+)\)/g
async function resolveImages(docs) {
  const kws = new Set()
  for (const d of docs) {
    IMG_RE.lastIndex = 0
    let m
    while ((m = IMG_RE.exec(d.content))) kws.add(m[2].trim())
  }
  const map = {}
  for (const kw of kws) {
    const r = finder.enabled ? await finder.find(kw, kw) : null
    map[kw] = r ? r.url : null
  }
  for (const d of docs) {
    d.content = d.content
      .replace(IMG_RE, (full, alt, kw) => {
        const url = map[kw.trim()]
        return url ? `![${alt}](${url})` : ''
      })
      .replace(/\n{3,}/g, '\n\n')
  }
  return Object.values(map).filter(Boolean).length
}

let published = 0,
  drafted = 0,
  failed = 0
const consumed = [] // 本轮实际拉取正文用于合成的源文 → 轮末登记进 wx_sources_seen
for (const c of fresh) {
  console.log(`\n=== ${c.working_title} ===`)
  // 拉正文
  const members = c.source_ids.map((id) => candidates[id]).filter(Boolean)
  const material = []
  for (const m of members) {
    try {
      const body = htmlToText(await cimi.articleBody(m.url))
      if (body && body.length >= 200) material.push({ ...m, body })
    } catch (e) {
      console.log(`  正文失败 ${m.title.slice(0, 16)}: ${e.message}`)
    }
  }
  if (material.length < 2) {
    console.log('  ✗ 可用源文不足，跳过')
    continue
  }

  const refMaterial = material
    .map(
      (m, i) =>
        `### Source ${i + 1}: ${m.title}（account: ${m.account}）\n${truncate(m.body, 4000)}`
    )
    .join('\n\n---\n\n')
  const userEN = `Topic: ${c.topic}\nWorking title: ${c.working_title}\nAngle: ${c.angle}\nSuggested tags: ${(c.suggested_tags || []).join(', ')}\n\nReference material (Chinese):\n\n${refMaterial}`

  try {
    // 4) 英文合成
    const en = await ds.chatJSON(
      [
        { role: 'system', content: EN_SYS },
        { role: 'user', content: userEN },
      ],
      { maxTokens: 8000, temperature: 0.6 }
    )
    en.slug = uniqueSlug(en.slug || c.working_title, existingSlugs)
    en.tags =
      Array.isArray(en.tags) && en.tags.length ? en.tags : c.suggested_tags || ['buying-guide']
    if (!en.tags.includes('buying-guide')) en.tags.push('buying-guide')
    en.faq = Array.isArray(en.faq) ? en.faq : []

    // 标记这些源文为「已消费」（无论后续过没过闸门，都不再重复读取/合成）
    for (const m of material)
      consumed.push({ sn: m.sn, account: m.account, title: m.title, used_in_slug: en.slug })

    // 4) 中文本地化
    const zh = await ds.chatJSON(
      [
        { role: 'system', content: ZH_SYS },
        {
          role: 'user',
          content: JSON.stringify({
            title: en.title,
            summary: en.summary,
            content: en.content,
            faq: en.faq,
          }),
        },
      ],
      { maxTokens: 8000, temperature: 0.5 }
    )
    zh.faq = Array.isArray(zh.faq) ? zh.faq : []

    // 5) 质量闸门
    const qEn = checkQuality({ ...en }, { locale: 'en' })
    const qZh = checkQuality({ ...zh }, { locale: 'zh' })

    // 5) 自评分（英文）
    let score = 0,
      notes = ''
    try {
      const s = await ds.chatJSON(
        [
          { role: 'system', content: SCORE_SYS },
          { role: 'user', content: `Title: ${en.title}\n\n${en.content}` },
        ],
        { maxTokens: 300 }
      )
      score = Number(s.overall) || 0
      notes = s.notes || ''
    } catch {
      /* 评分失败按 0 处理 → 进草稿 */
    }

    const pass = qEn.pass && qZh.pass && score >= THRESHOLD
    const draft = !pass
    console.log(
      `  EN ${qEn.pass ? 'OK' : 'NG ' + qEn.reasons.join(',')} | ZH ${qZh.pass ? 'OK' : 'NG ' + qZh.reasons.join(',')} | score ${score} → ${draft ? 'draft' : 'PUBLISH'}`
    )

    // 6) 配图（双语共图）
    const imgN = await resolveImages([en, zh])
    console.log(`  配图 ${imgN} 张；来源: ${material.map((m) => m.account).join(' / ')}`)

    if (DRY) {
      console.log(`  [dry] slug=${en.slug} tags=${en.tags.join(',')}`)
      console.log(`        EN: ${en.title}`)
      console.log(`        ZH: ${zh.title}`)
      if (draft) drafted++
      else published++
      continue
    }

    // 7) 落库（双语）
    const base = {
      slug: en.slug,
      tags: en.tags,
      layout: 'PostLayout',
      authors: ['default'],
      published_at: DATE,
      lastmod: DATE,
      draft,
    }
    await upsertGuide({
      ...base,
      locale: 'en',
      title: en.title,
      summary: en.summary,
      content: en.content,
    })
    await upsertGuide({
      ...base,
      locale: 'zh',
      title: zh.title || en.title,
      summary: zh.summary || en.summary,
      content: zh.content,
    })
    console.log(`  ✓ upsert ${en.slug} (en+zh) draft=${draft}`)
    if (draft) drafted++
    else published++
  } catch (e) {
    console.log(`  ✗ 合成失败: ${e.message}`)
    failed++
  }
}

// 登记本轮已消费源文（跨轮去重）。dry-run 不写。
if (!DRY && consumed.length) {
  const r = await markSourcesSeen(consumed)
  console.log(
    r.ok
      ? `源文登记：${r.n} 篇标记为已消费（下轮不再重复读取/合成）`
      : `⚠️ 源文登记失败（不影响已发布内容；多半是 wx_sources_seen 表未建）：${r.error}`
  )
}

console.log(`\n完成：发布 ${published}，草稿 ${drafted}，失败 ${failed}`)
console.log(
  'DeepSeek 用量:',
  ds.costEstimate(),
  '| cimidata 余额:',
  cimi.balance,
  '| 配图:',
  finder.stats
)
if (drafted)
  console.log(
    '⚠️ 有文章未过闸门，已存为 draft=true（不公开），可在 Supabase 人工审后改 false 放行。'
  )

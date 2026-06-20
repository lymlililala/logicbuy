#!/usr/bin/env node
/**
 * seo-backfill-images.mjs
 *
 * 全站「无图文章」自动补封面图（Supabase pitfallfree_guides）：
 * - 扫描 draft=false 且正文无图的文章，按 slug 派生英文商品关键词，用 Pexels 搜图，
 *   在介绍段后（第一个 ## 前）插入一张封面图，upsert 回库、刷新 lastmod。
 * - 双语（同 slug 的 en/zh）共用同一张图。
 * - 安全：pexels.mjs 带相关性校验，搜不到/不相关返回 null → 该文本轮跳过（绝不塞错图）。
 * - 幂等：已有图的文章跳过。--limit 限制本轮处理的 slug 数（控 API 用量）。
 *
 * 适合做成 GitHub Action（手动 + 每日定时）：随新文章持续补图。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-backfill-images.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-backfill-images.mjs --limit 25
 *   # CI：用 env 传 SUPABASE_URL / SUPABASE_SECRET_KEY / PEXELS_API_KEY
 */
import { createClient } from '@supabase/supabase-js'
import { ImageFinder } from './lib/pexels.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（本地用 node --env-file=.env.local；CI 用 env 传入）')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)

const DRY = process.argv.includes('--dry-run')
function argNum(name, def) {
  const i = process.argv.indexOf(name)
  return i === -1 ? def : Number(process.argv[i + 1]) || def
}
const LIMIT = argNum('--limit', 25)
const DATE = new Date().toISOString().slice(0, 10)

// slug → 英文商品关键词：剥离选购/角度类后缀 token，留商品主体词。
// 即使留下噪音词也安全——pexels 相关性校验会让搜不到的直接跳过，不会塞错图。
const SUFFIX_STOP = new Set([
  'buying',
  'guide',
  'guides',
  'mistakes',
  'mistake',
  'advanced',
  'explained',
  'explain',
  'long',
  'term',
  'experience',
  'vs',
  'best',
  'top',
  'review',
  'reviews',
  'specs',
  'spec',
  'rating',
  'types',
  'type',
  'complete',
  'ultimate',
  'how',
  'to',
  'choose',
  'the',
  'a',
])
function slugToKeyword(slug) {
  const toks = slug
    .split('-')
    .filter(
      (t) =>
        t && !SUFFIX_STOP.has(t) && !/^\d+$/.test(t) && !/^zh\d+$/.test(t) && !/^\d{4}$/.test(t)
    )
  return toks.slice(0, 3).join(' ')
}

const hasImage = (c) => /!\[[^\]]*\]\(https?:\/\/[^)]*(pexels|unsplash)/.test(c || '')

function insertCover(content, alt, url) {
  const md = `![${alt}](${url})`
  let i = content.indexOf('\n## ')
  if (i === -1) {
    // 无 H2：插在第一段（首个空行）后；再不行就接在末尾
    const p = content.indexOf('\n\n')
    i = p === -1 ? content.length : p
  }
  return content.slice(0, i) + `\n\n${md}\n` + content.slice(i)
}

const finder = new ImageFinder()
if (!finder.enabled) {
  console.error('未配置 PEXELS_API_KEY（CI: Secrets；本地: scripts/wechat/.env），无法配图。')
  process.exit(1)
}

// 拉全部已发布文章（1k+ 行可一次取回），找无图的 slug
const { data: rows, error } = await sb
  .from('pitfallfree_guides')
  .select('slug,locale,title,content')
  .eq('draft', false)
if (error) {
  console.error('查询失败:', error.message)
  process.exit(1)
}

// 按 slug 分组
const bySlug = new Map()
for (const r of rows) {
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, [])
  bySlug.get(r.slug).push(r)
}

// 待处理：至少有一条 locale 无图的 slug
const targets = [...bySlug.entries()].filter(([, rs]) => rs.some((r) => !hasImage(r.content)))
console.log(`无图文章 slug 共 ${targets.length} 个，本轮处理上限 ${LIMIT}`)

let ok = 0,
  skip = 0,
  miss = 0,
  fail = 0
let processed = 0
for (const [slug, rs] of targets) {
  if (processed >= LIMIT) break
  processed++

  const kw = slugToKeyword(slug)
  const enRow = rs.find((r) => r.locale === 'en') || rs[0]
  const found = await finder.find(kw, enRow.title || kw)
  if (!found) {
    console.log(`· 未命中(跳过) ${slug}  kw="${kw}"`)
    miss++
    continue
  }

  for (const r of rs) {
    if (hasImage(r.content)) {
      skip++
      continue
    }
    const alt = r.title || kw
    const newContent = insertCover(r.content, alt, found.url)
    if (DRY) {
      console.log(`[dry] ${r.locale} ${slug}  kw="${kw}"  → ${found.url.slice(0, 55)}`)
      ok++
      continue
    }
    const { error: e2 } = await sb
      .from('pitfallfree_guides')
      .update({ content: newContent, lastmod: DATE, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .eq('locale', r.locale)
    if (e2) {
      console.log(`ERR ${r.locale} ${slug}: ${e2.message}`)
      fail++
    } else {
      console.log(`OK  ${r.locale} ${slug}  → ${found.url.slice(0, 50)}`)
      ok++
    }
  }
}
console.log(
  `\n完成：写入/计划 ${ok}，已有图跳过 ${skip}，未命中 ${miss}，失败 ${fail}。配图 stats`,
  finder.stats
)

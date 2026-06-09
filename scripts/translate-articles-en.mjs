#!/usr/bin/env node
/**
 * translate-articles-en.mjs
 *
 * 从数据库读取 locale='zh' 的文章，调用 DeepSeek 翻译成英文，
 * 以 locale='en' 写回数据库（slug 相同，内容为英文）。
 *
 * 支持断点续传：已翻译的文章会跳过（通过检查 locale='en' 是否存在）
 *
 * Usage:
 *   node scripts/translate-articles-en.mjs
 *   node scripts/translate-articles-en.mjs --limit=20   # 只翻译20篇
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_SERVICE_KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（请在 .env.local 配置；运行用 npm run db:translate 会自动加载）')
  process.exit(1)
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const MODEL = 'deepseek-chat' // deepseek-v4-flash 对应 deepseek-chat

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── CLI 参数 ──────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.slice(2).split('=')
      return [k, v !== undefined ? (isNaN(v) ? v : parseInt(v, 10)) : true]
    })
)
const LIMIT = args.limit || Infinity

// ── 工具 ──────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const jitter = (ms) => Math.floor(ms + Math.random() * ms * 0.3)

// ── 翻译提示词 ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional technical writer specializing in consumer product buying guides.

Translate the following Chinese buying guide article into natural, fluent English.

Rules:
1. Keep ALL Markdown formatting exactly as-is (headers ##, tables |, bold **, bullet points -, horizontal rules ---)
2. Translate Chinese product terms to standard English equivalents (面板→panel, 响应时间→response time, 压缩机→compressor)
3. Keep technical specs, numbers, units, and parameter names in English as-is (GTG, PWM, OLED, IPS, TDP, Hz, W, dB, etc.)
4. The tone must be informative and direct — like a knowledgeable friend explaining specs, NOT marketing copy
5. Preserve all paragraph structure and article length — do NOT shorten or summarize
6. Output ONLY the translated article — no preamble, no commentary, no explanation`

// ── 调用 DeepSeek API ─────────────────────────────────────────────────────────
async function translateWithDeepSeek(zhText, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: zhText },
          ],
          temperature: 0.2,
          max_tokens: 8192,
        }),
        signal: AbortSignal.timeout(120000), // 2分钟超时
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`)
      }

      const data = await res.json()
      return data.choices[0].message.content.trim()
    } catch (e) {
      if (attempt === maxRetries) throw e
      const waitMs = jitter(3000 * attempt)
      process.stdout.write(
        `\n      ⏳ Retry ${attempt}/${maxRetries} after ${Math.round(waitMs / 1000)}s: ${e.message.slice(0, 80)}\n`
      )
      await sleep(waitMs)
    }
  }
}

// ── 提取英文标题（H1）────────────────────────────────────────────────────────
function extractTitle(content) {
  for (const line of content.split('\n')) {
    const m = line.match(/^#\s+(.+)/)
    if (m) return m[1].trim()
  }
  return ''
}

// ── 提取摘要（第一段正文）────────────────────────────────────────────────────
function extractSummary(content, maxLen = 220) {
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#') || t === '---' || t.startsWith('|') || t.startsWith('>'))
      continue
    const clean = t
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    if (clean.length > 30) return clean.slice(0, maxLen)
  }
  return ''
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌍 LogicBuy — Translate ZH → EN via DeepSeek\n')

  // 1. 取所有中文文章
  const { data: zhArticles, error } = await supabase
    .from('pitfallfree_guides')
    .select('*')
    .eq('locale', 'zh')
    .eq('draft', false)
    .order('published_at', { ascending: true })

  if (error) {
    console.error('❌ Fetch ZH failed:', error.message)
    process.exit(1)
  }
  console.log(`📚 ZH total: ${zhArticles.length}`)

  // 2. 取已有英文文章（断点续传）
  const { data: existingEn } = await supabase
    .from('pitfallfree_guides')
    .select('slug')
    .eq('locale', 'en')
  const doneSet = new Set((existingEn || []).map((r) => r.slug))
  console.log(`✅ Already done: ${doneSet.size}`)
  console.log(`🔄 To translate: ${zhArticles.length - doneSet.size}\n`)

  let success = 0,
    skip = 0,
    fail = 0,
    processed = 0

  for (let i = 0; i < zhArticles.length; i++) {
    if (processed >= LIMIT) break
    const zh = zhArticles[i]
    const tag = `[${i + 1}/${zhArticles.length}]`

    if (doneSet.has(zh.slug)) {
      skip++
      continue
    }

    console.log(`\n${tag} 🔄 ${zh.slug}`)
    console.log(`      ZH: ${zh.title.slice(0, 60)}`)
    processed++

    try {
      // 整篇文章（标题+摘要+正文合并）一次翻译，DeepSeek 支持长上下文
      const fullZh = `# ${zh.title}\n\n${zh.summary ? zh.summary + '\n\n' : ''}${zh.content}`
      const enFull = await translateWithDeepSeek(fullZh)

      const finalTitle = extractTitle(enFull) || zh.title
      const finalSummary = extractSummary(enFull)
      // 正文去掉第一行 H1 标题（避免重复）
      const enContent = enFull.replace(/^#\s+.+\n{0,2}/, '').trim()

      const { error: upsertErr } = await supabase.from('pitfallfree_guides').upsert(
        {
          slug: zh.slug,
          locale: 'en',
          title: finalTitle,
          summary: finalSummary,
          tags: zh.tags,
          layout: zh.layout,
          published_at: zh.published_at,
          lastmod: new Date().toISOString().split('T')[0],
          draft: false,
          authors: zh.authors,
          content: enContent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug,locale' }
      )

      if (upsertErr) {
        console.log(`      ❌ DB: ${upsertErr.message}`)
        fail++
      } else {
        console.log(`      ✅ EN: "${finalTitle.slice(0, 72)}"`)
        success++
        doneSet.add(zh.slug)
      }

      // 篇间暂停 1s（DeepSeek 无严格频率限制）
      await sleep(jitter(1000))
    } catch (e) {
      console.log(`      ❌ ${e.message.slice(0, 100)}`)
      fail++
      await sleep(jitter(5000))
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`✅ Translated: ${success}  ⏭  Skipped: ${skip}  ❌ Failed: ${fail}`)
  console.log(`📊 EN total: ${doneSet.size} / ${zhArticles.length}`)
}

main().catch((e) => {
  console.error('💥', e.message)
  process.exit(1)
})

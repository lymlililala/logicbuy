#!/usr/bin/env node
/**
 * translate-articles-en.mjs
 *
 * 从数据库读取 locale='zh' 的58篇文章，调用 OpenAI 翻译成英文，
 * 以 locale='en' 写回数据库（slug 相同，内容为英文）。
 *
 * Usage:
 *   OPENAI_API_KEY=xxx node scripts/translate-articles-en.mjs
 *
 * 支持断点续传：已翻译的文章会跳过（通过检查 locale='en' 是否存在）
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── 翻译提示词 ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional technical writer and translator specializing in consumer product buying guides.

Translate the following Chinese buying guide article into natural, fluent English.

Rules:
1. Keep ALL Markdown formatting exactly (headers, tables, bold, bullet points, horizontal rules)
2. Translate Chinese product terms to standard English equivalents (e.g., 面板 → panel, 响应时间 → response time)
3. Keep technical specs, numbers, units, and parameter names in English (e.g., GTG, PWM, OLED, IPS, TDP)
4. The tone should be informative and direct — like a knowledgeable friend explaining specs, not marketing copy
5. Preserve paragraph structure and article length
6. Do NOT add any commentary, preamble, or explanation — output only the translated article`

// ── 调用 OpenAI ─────────────────────────────────────────────────────────────
async function translateToEnglish(zhContent, zhTitle) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: zhContent },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${err.slice(0, 200)}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

// ── 从翻译后的内容提取英文标题 ──────────────────────────────────────────────
function extractTitle(content) {
  for (const line of content.split('\n')) {
    const m = line.match(/^#\s+(.+)/)
    if (m) return m[1].trim()
  }
  return ''
}

// ── 从翻译后的内容提取 summary ───────────────────────────────────────────────
function extractSummary(content, maxLen = 200) {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue
    const clean = trimmed.replace(/\*\*/g, '').replace(/`/g, '')
    if (clean.length > 20) return clean.slice(0, maxLen)
  }
  return ''
}

// ── 主流程 ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌍 PitfallFree — Translate ZH → EN\n')

  // 1. 取所有中文文章
  const { data: zhArticles, error } = await supabase
    .from('pitfallfree_guides')
    .select('*')
    .eq('locale', 'zh')
    .eq('draft', false)
    .order('published_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch zh articles:', error.message)
    process.exit(1)
  }
  console.log(`📚 Found ${zhArticles.length} zh articles\n`)

  // 2. 取已有英文文章（断点续传用）
  const { data: existingEn } = await supabase
    .from('pitfallfree_guides')
    .select('slug')
    .eq('locale', 'en')
  const existingEnSlugs = new Set((existingEn || []).map((r) => r.slug))
  console.log(`✅ Already translated: ${existingEnSlugs.size} articles\n`)

  // 3. 翻译并入库
  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (let i = 0; i < zhArticles.length; i++) {
    const zh = zhArticles[i]
    const progress = `[${i + 1}/${zhArticles.length}]`

    if (existingEnSlugs.has(zh.slug)) {
      console.log(`${progress} ⏭  Skipping (already translated): ${zh.slug}`)
      skipCount++
      continue
    }

    process.stdout.write(`${progress} 🔄 Translating: ${zh.slug} ... `)

    try {
      const enContent = await translateToEnglish(zh.content, zh.title)
      const enTitle = extractTitle(enContent) || zh.title
      const enSummary = extractSummary(enContent)

      const enArticle = {
        slug: zh.slug,
        locale: 'en',
        title: enTitle,
        summary: enSummary,
        tags: zh.tags,          // tags 保持一致（已是英文 slug）
        layout: zh.layout,
        published_at: zh.published_at,
        lastmod: zh.lastmod,
        draft: false,
        authors: zh.authors,
        content: enContent,
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('pitfallfree_guides')
        .upsert(enArticle, { onConflict: 'slug,locale' })

      if (upsertError) {
        console.log('❌')
        console.error(`   Error: ${upsertError.message}`)
        errorCount++
      } else {
        console.log(`✅ "${enTitle.slice(0, 60)}"`)
        successCount++
        existingEnSlugs.add(zh.slug)
      }

      // 每篇之间暂停 0.5s，避免速率限制
      await new Promise((r) => setTimeout(r, 500))
    } catch (e) {
      console.log('❌')
      console.error(`   Error: ${e.message.slice(0, 100)}`)
      errorCount++
      // 遇到错误暂停 2s 再继续
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log('🎉 Done!')
  console.log(`   ✅ Translated : ${successCount}`)
  console.log(`   ⏭  Skipped   : ${skipCount}`)
  console.log(`   ❌ Errors    : ${errorCount}`)

  if (successCount > 0) {
    console.log('\n📊 Verify in Supabase:')
    console.log(`   SELECT slug, locale, title FROM pitfallfree_guides WHERE locale='en' ORDER BY published_at LIMIT 5;`)
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message)
  process.exit(1)
})

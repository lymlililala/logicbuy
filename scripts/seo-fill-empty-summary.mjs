#!/usr/bin/env node
/**
 * seo-fill-empty-summary.mjs
 *
 * 批量补全空 meta description（summary）：从正文首个正文段落提炼，
 * 清理 markdown、按完整句子截断（en ~155 字符 / zh ~78 字），更新 lastmod。
 * 仅处理 summary 为空的记录，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-fill-empty-summary.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-fill-empty-summary.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)
const DRY = process.argv.includes('--dry-run')
const TODAY = '2026-06-09'

// 提取正文首个实义段落（跳过标题/引用/表格/列表/空行/分隔线/图片）
function firstParagraph(md) {
  const lines = md.split('\n')
  for (const raw of lines) {
    const ln = raw.trim()
    if (!ln) continue
    if (/^#{1,6}\s/.test(ln)) continue // 标题
    if (/^>/.test(ln)) continue // 引用
    if (/^[|]/.test(ln)) continue // 表格
    if (/^[-*+]\s/.test(ln)) continue // 列表
    if (/^\d+\.\s/.test(ln)) continue // 有序列表
    if (/^!\[/.test(ln)) continue // 图片
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(ln)) continue // 分隔线
    return ln
  }
  return ''
}

function clean(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// 按完整句子截断到目标长度附近
function truncate(text, locale) {
  const maxLen = locale === 'zh' ? 80 : 158
  if (text.length <= maxLen) return text
  const slice = text.slice(0, maxLen)
  // 找最后一个句末标点
  const enders = locale === 'zh' ? /[。！？；]/g : /[.!?]\s/g
  let lastEnd = -1
  let m
  while ((m = enders.exec(slice)) !== null) lastEnd = m.index + (locale === 'zh' ? 1 : 1)
  if (lastEnd > maxLen * 0.5) return slice.slice(0, lastEnd + (locale === 'zh' ? 0 : 0)).trim()
  // 否则在词/字边界截断
  if (locale === 'zh') return slice.trim()
  return slice.slice(0, slice.lastIndexOf(' ')).trim()
}

// 拉全量、筛空 summary
let all = [],
  from = 0
while (true) {
  const { data, error } = await sb
    .from('pitfallfree_guides')
    .select('slug,locale,title,summary,content')
    .range(from, from + 999)
  if (error) {
    console.error(error.message)
    process.exit(1)
  }
  all = all.concat(data)
  if (data.length < 1000) break
  from += 1000
}
const targets = all.filter((r) => !r.summary || !r.summary.trim())
console.log(`空 summary 记录：${targets.length}`)

let ok = 0,
  skip = 0,
  fail = 0
for (const r of targets) {
  const para = firstParagraph(r.content || '')
  if (!para) {
    console.log(`skip ${r.locale} ${r.slug}（无可用首段）`)
    skip++
    continue
  }
  const summary = truncate(clean(para), r.locale)
  if (!summary || summary.length < 20) {
    console.log(`skip ${r.locale} ${r.slug}（首段过短）`)
    skip++
    continue
  }
  if (DRY) {
    console.log(`[dry] ${r.locale} ${r.slug}\n      → ${summary}`)
    continue
  }
  const { error } = await sb
    .from('pitfallfree_guides')
    .update({ summary, lastmod: TODAY })
    .eq('slug', r.slug)
    .eq('locale', r.locale)
  if (error) {
    console.log(`ERR ${r.locale} ${r.slug}: ${error.message}`)
    fail++
  } else {
    ok++
  }
}
console.log(`\n完成：补全 ${ok}，跳过 ${skip}，失败 ${fail}`)

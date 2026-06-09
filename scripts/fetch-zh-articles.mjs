/**
 * 从数据库抓取所有 zh 文章，输出 JSON 供翻译使用
 */
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const sb = createClient(
  'https://tixgzezefjjsyuzgdhcd.supabase.co',
  (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
)

const { data, error } = await sb
  .from('pitfallfree_guides')
  .select('slug,locale,title,summary,tags,content,published_at,lastmod,draft,authors,layout')
  .eq('locale', 'zh')
  .order('published_at')

if (error) {
  console.error(error.message)
  process.exit(1)
}

// 检查已有英文
const { data: existingEn } = await sb
  .from('pitfallfree_guides')
  .select('slug')
  .eq('locale', 'en')

const existingSlugs = new Set((existingEn || []).map((r) => r.slug))
const needTranslate = data.filter((r) => !existingSlugs.has(r.slug))

console.log(`Total zh: ${data.length}, Already en: ${existingSlugs.size}, Need translate: ${needTranslate.length}`)

writeFileSync('/tmp/zh-articles.json', JSON.stringify(needTranslate, null, 2))
console.log('Written to /tmp/zh-articles.json')

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const sb = createClient(
  'https://tixgzezefjjsyuzgdhcd.supabase.co',
  (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
)

const { data } = await sb.from('pitfallfree_guides').select('*').eq('locale','zh').order('published_at').range(30,39)

let out = ''
for (const a of data) {
  out += `=== SLUG: ${a.slug}\n=== TITLE: ${a.title}\n=== CONTENT:\n${a.content}\n---END---\n`
}
writeFileSync('/tmp/articles-30-39.txt', out)
console.log('Written', data.length, 'articles to /tmp/articles-30-39.txt')

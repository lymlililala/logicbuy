import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'

const sb = createClient(
  'https://tixgzezefjjsyuzgdhcd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E'
)

const { data } = await sb.from('pitfallfree_guides').select('*').eq('locale','zh').order('published_at').range(40,49)

let out = ''
for (const a of data) {
  out += `=== SLUG: ${a.slug}\n=== TITLE: ${a.title}\n=== CONTENT:\n${a.content}\n---END---\n`
}
writeFileSync('/tmp/articles-40-49.txt', out)
console.log('Written', data.length, 'articles to /tmp/articles-40-49.txt')

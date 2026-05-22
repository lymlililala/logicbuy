import { createClient } from '@supabase/supabase-js'
const sb = createClient('https://tixgzezefjjsyuzgdhcd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E')
const {data,error} = await sb.from('pitfallfree_guides').select('slug,locale,title,content').order('published_at')
if(error) { console.error(error.message); process.exit(1) }
console.log('Total:', data.length)
for(const r of data) {
  console.log(`${r.locale} | ${r.slug} | ${r.title.slice(0,50)}`)
}

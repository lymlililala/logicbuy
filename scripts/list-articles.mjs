import { createClient } from '@supabase/supabase-js'
const sb = createClient('https://tixgzezefjjsyuzgdhcd.supabase.co', (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY))
const {data,error} = await sb.from('pitfallfree_guides').select('slug,locale,title,content').order('published_at')
if(error) { console.error(error.message); process.exit(1) }
console.log('Total:', data.length)
for(const r of data) {
  console.log(`${r.locale} | ${r.slug} | ${r.title.slice(0,50)}`)
}

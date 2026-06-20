// Supabase 客户端封装（logicbuy）—— 供 nightly 采集流水线查重 + 落库 pitfallfree_guides。
// key 来源优先级：① 已注入的 process.env（CI Secrets / `node --env-file=.env.local`）；
//                ② 项目根 .env.local 兜底。

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dir = dirname(fileURLToPath(import.meta.url))
// scripts/wechat/lib → 项目根
const ROOT = join(__dir, '..', '..', '..')

function loadRootEnv() {
  for (const f of ['.env.local', '.env']) {
    try {
      const txt = readFileSync(join(ROOT, f), 'utf8')
      for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
      }
    } catch {
      // 文件不存在则跳过（CI 用真实环境变量）
    }
  }
}

function key() {
  if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) loadRootEnv()
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
}

export function supabaseUrl() {
  if (!process.env.SUPABASE_URL) loadRootEnv()
  return process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
}

/** 是否具备走 Supabase 的条件。 */
export function hasSupabase() {
  return !!key()
}

let _client = null
/** 取（懒加载）Supabase 客户端；缺 key 抛错。 */
export function getSupabase() {
  if (_client) return _client
  const k = key()
  if (!k) throw new Error('缺少 SUPABASE_SECRET_KEY（CI 用 Secrets，本地用 --env-file=.env.local）')
  _client = createClient(supabaseUrl(), k)
  return _client
}

const TABLE = 'pitfallfree_guides'

/** 取已发布文章（默认 en、draft=false）的若干字段，分页取全。 */
export async function fetchPublishedGuides({ locale = 'en', select = 'slug,title,tags' } = {}) {
  const sb = getSupabase()
  const out = []
  for (let from = 0; ; from += 1000) {
    let q = sb
      .from(TABLE)
      .select(select)
      .eq('draft', false)
      .range(from, from + 999)
    if (locale) q = q.eq('locale', locale)
    const { data, error } = await q
    if (error) throw new Error(`${TABLE} 读取失败: ${error.message}`)
    out.push(...(data || []))
    if (!data || data.length < 1000) break
  }
  return out
}

/** upsert 一行（onConflict slug,locale）。 */
export async function upsertGuide(row) {
  const sb = getSupabase()
  const { error } = await sb
    .from(TABLE)
    .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'slug,locale' })
  if (error) throw new Error(error.message)
}

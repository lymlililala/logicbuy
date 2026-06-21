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

const SEEN_TABLE = 'logicbuy_wx_sources_seen'

/**
 * 取已消费源文 sn 集合（跨轮去重）。表不存在则返回 { ok:false, set:空 }，调用方据此降级跳过。
 */
export async function fetchSeenSns() {
  const sb = getSupabase()
  const set = new Set()
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from(SEEN_TABLE)
      .select('sn')
      .range(from, from + 999)
    if (error) {
      // 42P01 = 表不存在 / PostgREST 找不到表 → 降级
      return { ok: false, set, error: error.message }
    }
    for (const r of data || []) set.add(r.sn)
    if (!data || data.length < 1000) break
  }
  return { ok: true, set }
}

/** 登记已消费源文（onConflict sn）。表不存在等错误吞掉，不阻断主流程。 */
export async function markSourcesSeen(rows) {
  if (!rows || !rows.length) return { ok: true, n: 0 }
  const sb = getSupabase()
  const { error } = await sb.from(SEEN_TABLE).upsert(rows, { onConflict: 'sn' })
  if (error) return { ok: false, n: 0, error: error.message }
  return { ok: true, n: rows.length }
}

const SOURCES_TABLE = 'logicbuy_wx_sources'

/**
 * 把抓到的源文（标题级）落库。**不写 body_text** → 已有正文不被覆盖（懒加载回填用）。
 * 表不存在则返回 ok:false，调用方降级为「仅用本轮抓取聚类」。
 */
export async function upsertSources(rows) {
  if (!rows || !rows.length) return { ok: true, n: 0 }
  const sb = getSupabase()
  const payload = rows.map((r) => ({
    sn: r.sn,
    account: r.account,
    wxid: r.wxid,
    title: r.title,
    content_url: r.content_url,
    published_at: r.published_at ?? null,
  }))
  const { error } = await sb.from(SOURCES_TABLE).upsert(payload, { onConflict: 'sn' })
  if (error) return { ok: false, n: 0, error: error.message }
  return { ok: true, n: payload.length }
}

/** 读「最近 sinceDays 天」入库的源文池（按入库时间倒序，限 limit 条）。 */
export async function fetchSourcePool({ sinceDays = 14, limit = 300 } = {}) {
  const sb = getSupabase()
  const since = new Date(Date.now() - sinceDays * 86400 * 1000).toISOString()
  const { data, error } = await sb
    .from(SOURCES_TABLE)
    .select('sn,account,wxid,title,content_url,body_text')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return { ok: false, rows: [], error: error.message }
  return { ok: true, rows: data || [] }
}

/** 回填某源文的正文（懒加载缓存）。失败吞掉不阻断。 */
export async function updateSourceBody(sn, body_text) {
  const sb = getSupabase()
  const { error } = await sb.from(SOURCES_TABLE).update({ body_text }).eq('sn', sn)
  return error ? { ok: false, error: error.message } : { ok: true }
}

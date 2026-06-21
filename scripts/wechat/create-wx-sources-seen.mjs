/**
 * create-wx-sources-seen.mjs
 *
 * 通过 PostgreSQL 直连在 Supabase 建立 wx_sources_seen 表（nightly 源文跨轮去重用）。
 * 仿 scripts/create-pitfallfree-table.mjs。
 *
 * Usage:
 *   DB_PASSWORD="你的数据库密码" node scripts/wechat/create-wx-sources-seen.mjs
 *
 * DB_PASSWORD 获取：Supabase Dashboard → Settings → Database → Connection string
 * 也可直接把 create-wx-sources-seen.sql 贴进 Supabase SQL Editor 执行。
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pkg from 'pg'
const { Client } = pkg

const DB_PASSWORD = process.env.DB_PASSWORD
if (!DB_PASSWORD) {
  console.error(`❌ 需要 DB_PASSWORD 环境变量。
  Supabase Dashboard → Settings → Database → Connection string 里取数据库密码，然后：
    DB_PASSWORD="..." node scripts/wechat/create-wx-sources-seen.mjs
  或把 scripts/wechat/create-wx-sources-seen.sql 贴进 Supabase SQL Editor 执行。`)
  process.exit(1)
}

const __dir = dirname(fileURLToPath(import.meta.url))
const SQL = readFileSync(join(__dir, 'create-wx-sources-seen.sql'), 'utf8')
const REF = 'tixgzezefjjsyuzgdhcd'

async function run(host) {
  const client = new Client({
    connectionString: `postgresql://postgres.${REF}:${DB_PASSWORD}@${host}:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  await client.query(SQL)
  const res = await client.query(
    `SELECT column_name, data_type FROM information_schema.columns
     WHERE table_name = 'logicbuy_wx_sources_seen' ORDER BY ordinal_position`
  )
  await client.end()
  return res.rows
}

async function main() {
  console.log('🔗 连接 Supabase PostgreSQL…')
  try {
    const cols = await run('aws-0-ap-southeast-1.pooler.supabase.com')
    console.log('✅ wx_sources_seen 已创建/已存在。字段：')
    cols.forEach((r) => console.log(`  - ${r.column_name}: ${r.data_type}`))
  } catch (err) {
    console.warn('⚠️ 东南亚 pooler 失败，尝试 US East…', err.message)
    try {
      const cols = await run('aws-0-us-east-1.pooler.supabase.com')
      console.log('✅ 通过 US East 创建成功。字段：')
      cols.forEach((r) => console.log(`  - ${r.column_name}: ${r.data_type}`))
    } catch (err2) {
      console.error('❌ 两个区域都失败:', err2.message)
      console.log(
        '请把 scripts/wechat/create-wx-sources-seen.sql 贴进 Supabase SQL Editor 手动执行：'
      )
      console.log(`  https://supabase.com/dashboard/project/${REF}/sql/new`)
      process.exit(1)
    }
  }
}

main()

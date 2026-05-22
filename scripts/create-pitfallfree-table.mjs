/**
 * create-pitfallfree-table.mjs
 *
 * 通过 PostgreSQL 直连在 Supabase 中建立 pitfallfree_guides 表。
 *
 * Usage:
 *   DB_PASSWORD="your_db_password" node scripts/create-pitfallfree-table.mjs
 *
 * 如何获取 DB_PASSWORD:
 *   Supabase Dashboard → Settings → Database → Connection string
 *   (密码就是你创建项目时设置的数据库密码)
 *
 * 项目: https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd
 */

import pkg from 'pg'
const { Client } = pkg

const DB_PASSWORD = process.env.DB_PASSWORD

if (!DB_PASSWORD) {
  console.error(`
❌ 需要提供 DB_PASSWORD 环境变量！

获取方式:
  Supabase Dashboard → Settings → Database → Connection string
  (点击 "Copy" 按钮，密码在 postgresql://postgres:[PASSWORD]@...)

然后运行:
  DB_PASSWORD="your_password" node scripts/create-pitfallfree-table.mjs
  `)
  process.exit(1)
}

// Supabase Session Mode Pooler（推荐）
const DATABASE_URL = `postgresql://postgres.tixgzezefjjsyuzgdhcd:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS pitfallfree_guides (
  id            BIGSERIAL     PRIMARY KEY,
  slug          TEXT          NOT NULL UNIQUE,
  title         TEXT          NOT NULL,
  summary       TEXT          NOT NULL DEFAULT '',
  tags          TEXT[]        NOT NULL DEFAULT '{}',
  layout        TEXT          NOT NULL DEFAULT 'PostLayout',
  published_at  DATE          NOT NULL,
  lastmod       DATE,
  draft         BOOLEAN       NOT NULL DEFAULT false,
  authors       TEXT[]        NOT NULL DEFAULT '{default}',
  content       TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_slug
  ON pitfallfree_guides (slug);

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_tags
  ON pitfallfree_guides USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_published_at
  ON pitfallfree_guides (published_at DESC);

ALTER TABLE pitfallfree_guides ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'pitfallfree_guides'
      AND policyname = 'pitfallfree_guides_public_read'
  ) THEN
    CREATE POLICY pitfallfree_guides_public_read
      ON pitfallfree_guides FOR SELECT TO anon USING (true);
  END IF;
END $$;
`

async function main() {
  console.log('🔗 Connecting to Supabase PostgreSQL...')
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('✅ Connected!')

    console.log('📦 Creating pitfallfree_guides table...')
    await client.query(CREATE_TABLE_SQL)
    console.log('✅ Table created / already exists!')

    // 验证
    const res = await client.query(
      `SELECT column_name, data_type
       FROM information_schema.columns
       WHERE table_name = 'pitfallfree_guides'
       ORDER BY ordinal_position`
    )
    console.log('\n📋 Table columns:')
    res.rows.forEach((r) => console.log(`  - ${r.column_name}: ${r.data_type}`))

    console.log('\n🎉 Now run the seed script to upload articles:')
    console.log('   node scripts/seed-pitfallfree-guides.mjs')
  } catch (err) {
    // 尝试备用地区
    if (err.message.includes('ECONNREFUSED') || err.message.includes('timeout')) {
      console.warn('⚠️  Southeast Asia pooler failed, trying US East...')
      client.end().catch(() => {})
      await tryAltRegion(DB_PASSWORD)
    } else {
      console.error('❌ Error:', err.message)
      process.exit(1)
    }
  } finally {
    client.end().catch(() => {})
  }
}

async function tryAltRegion(password) {
  const altUrl = `postgresql://postgres.tixgzezefjjsyuzgdhcd:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
  const client = new Client({ connectionString: altUrl, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    await client.query(CREATE_TABLE_SQL)
    console.log('✅ Table created via US East region!')
    await client.end()
  } catch (err2) {
    console.error('❌ Alt region also failed:', err2.message)
    console.log('\n📋 Please run the SQL manually in Supabase SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new')
    console.log('   (SQL is in: scripts/create-pitfallfree-table.sql)')
    await client.end().catch(() => {})
    process.exit(1)
  }
}

main()

#!/usr/bin/env node
/**
 * migrate-locale-column.mjs
 *
 * 通过 pg 直连执行迁移，添加 locale 列支持多语言。
 * 需要提供数据库密码：
 *   DB_PASSWORD="your_password" node scripts/migrate-locale-column.mjs
 *
 * 或者直接在 Supabase SQL Editor 执行 scripts/migrate-add-locale.sql
 */

import pg from 'pg'
const { Client } = pg

const DB_PASSWORD = process.env.DB_PASSWORD
const PROJECT_REF = 'tixgzezefjjsyuzgdhcd'

const MIGRATION_SQL = `
-- Step 1: Add locale column
ALTER TABLE pitfallfree_guides
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'zh';

-- Step 2: Update existing English articles
UPDATE pitfallfree_guides
  SET locale = 'en'
  WHERE slug IN ('how-to-choose-mattress-specs', 'how-to-choose-robot-vacuum-specs');

-- Step 3: Drop old unique constraint
ALTER TABLE pitfallfree_guides
  DROP CONSTRAINT IF EXISTS pitfallfree_guides_slug_key;

-- Step 4: Add composite unique constraint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pitfallfree_guides_slug_locale_key'
  ) THEN
    ALTER TABLE pitfallfree_guides
      ADD CONSTRAINT pitfallfree_guides_slug_locale_key UNIQUE (slug, locale);
  END IF;
END $$;

-- Step 5: Update indexes
DROP INDEX IF EXISTS idx_pitfallfree_guides_slug;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_pitfallfree_guides_slug_locale'
  ) THEN
    CREATE UNIQUE INDEX idx_pitfallfree_guides_slug_locale
      ON pitfallfree_guides (slug, locale);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pitfallfree_guides_locale
  ON pitfallfree_guides (locale);
`

const CONNECTION_STRINGS = [
  `postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
  `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
]

async function runMigration(connStr) {
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  })

  await client.connect()
  console.log('  🔗 Connected to database')

  await client.query(MIGRATION_SQL)
  console.log('  ✅ Migration SQL executed')

  // Verify
  const result = await client.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'pitfallfree_guides'
    ORDER BY ordinal_position
  `)
  console.log('\n📋 Current table columns:')
  for (const row of result.rows) {
    console.log(`   ${row.column_name.padEnd(20)} ${row.data_type}  default=${row.column_default || 'none'}`)
  }

  const countResult = await client.query(`
    SELECT locale, COUNT(*) as count
    FROM pitfallfree_guides
    GROUP BY locale
  `)
  console.log('\n📊 Articles by locale:')
  for (const row of countResult.rows) {
    console.log(`   [${row.locale}] ${row.count} articles`)
  }

  await client.end()
}

async function main() {
  if (!DB_PASSWORD) {
    console.log('⚠️  DB_PASSWORD not provided.')
    console.log('\n方法一: 提供数据库密码自动迁移:')
    console.log('  DB_PASSWORD="your_password" node scripts/migrate-locale-column.mjs')
    console.log('\n  获取密码: https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/settings/database')
    console.log('\n方法二: 在 Supabase SQL Editor 手动执行:')
    console.log('  👉 https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new')
    console.log('  执行文件: scripts/migrate-add-locale.sql\n')
    process.exit(1)
  }

  console.log('🔧 Running locale column migration...\n')

  for (const connStr of CONNECTION_STRINGS) {
    const host = connStr.match(/@([^:]+):/)?.[1] || 'unknown'
    process.stdout.write(`  ⏳ Trying ${host}... `)
    try {
      await runMigration(connStr)
      console.log('\n🎉 Migration complete! Run: node scripts/seed-xhs-articles.mjs\n')
      return
    } catch (e) {
      if (e.message.includes('password authentication')) {
        console.log('❌ Wrong password')
        process.exit(1)
      }
      console.log(`⚠️  ${e.message.slice(0, 60)}`)
    }
  }

  console.log('\n❌ Could not connect to any database endpoint.')
  console.log('Please run scripts/migrate-add-locale.sql manually in Supabase SQL Editor.')
  process.exit(1)
}

main().catch((err) => {
  console.error('💥 Fatal:', err.message)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * seed-pitfallfree-guides.mjs
 *
 * 建表 + 上传 PitfallFree 博客文章到 Supabase pitfallfree_guides 表。
 *
 * 流程:
 *  1. 读取 data/blog/*.mdx（非 draft）
 *  2. 解析 frontmatter + 正文
 *  3. 建表（需要 DB_PASSWORD，或先在 Dashboard 手动建表）
 *  4. upsert 数据到 pitfallfree_guides
 *
 * Usage（如果表已存在）:
 *   node scripts/seed-pitfallfree-guides.mjs
 *
 * Usage（表不存在，需要建表）:
 *   DB_PASSWORD="your_supabase_db_password" node scripts/seed-pitfallfree-guides.mjs
 *
 * 获取 DB_PASSWORD:
 *   Supabase Dashboard → Settings → Database → Connection string
 *   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/settings/database
 */

import { createClient } from '@supabase/supabase-js'
import matter from 'gray-matter'
import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── Supabase 配置 ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_SERVICE_KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（请在 .env.local 配置；运行用 npm run db:* 会自动加载）')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── 建表 SQL（表名前缀 pitfallfree_ 避免与 tools 项目表名冲突）──────────
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

// ── 读取 MDX 文件 ──────────────────────────────────────────────────────────
function readBlogDir(dir) {
  const results = []
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = path.join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        results.push(...readBlogDir(fullPath))
      } else if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
        results.push(fullPath)
      }
    }
  } catch (e) {
    console.warn(`  ⚠️  Cannot read dir ${dir}: ${e.message}`)
  }
  return results
}

function parseSlugFromPath(filePath, blogDir) {
  const rel = path.relative(blogDir, filePath)
  return rel.replace(/\.(mdx|md)$/, '').replace(/\\/g, '/')
}

function parseMdxFile(filePath, blogDir) {
  const raw = readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)

  // 跳过 draft
  if (fm.draft === true) return null

  const slug = parseSlugFromPath(filePath, blogDir)

  return {
    slug,
    title:        fm.title    || slug,
    summary:      fm.summary  || '',
    tags:         Array.isArray(fm.tags) ? fm.tags : [],
    layout:       fm.layout   || 'PostLayout',
    published_at: fm.date
      ? new Date(fm.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    lastmod: fm.lastmod
      ? new Date(fm.lastmod).toISOString().split('T')[0]
      : null,
    draft:   false,
    authors: Array.isArray(fm.authors) ? fm.authors : ['default'],
    content: content.trim(),
  }
}

// ── 建表：通过 pg 直连（直连端口 5432）────────────────────────────────────
async function createTableViaDirectPg(password) {
  const { default: pkg } = await import('pg')
  const { Client } = pkg

  // 优先尝试直连
  const urls = [
    `postgresql://postgres:${password}@db.tixgzezefjjsyuzgdhcd.supabase.co:5432/postgres`,
    `postgresql://postgres.tixgzezefjjsyuzgdhcd:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.tixgzezefjjsyuzgdhcd:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
  ]

  for (const url of urls) {
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 })
    try {
      await client.connect()
      console.log('  🔗 pg connected!')
      await client.query(CREATE_TABLE_SQL)
      await client.end()
      console.log('  ✅ Table created via pg direct connection!')
      return true
    } catch (e) {
      await client.end().catch(() => {})
      if (e.message.includes('password authentication')) {
        console.error('  ❌ Wrong DB_PASSWORD:', e.message)
        return false
      }
      // 连接失败，尝试下一个 URL
      console.warn(`  ⚠️  ${e.message.slice(0, 60)}... trying next endpoint`)
    }
  }
  return false
}

// ── 检查表是否存在 ─────────────────────────────────────────────────────────
async function ensureTable() {
  console.log('📦 Checking pitfallfree_guides table...')

  const { error } = await supabase
    .from('pitfallfree_guides')
    .select('id')
    .limit(1)

  if (!error) {
    console.log('  ✅ Table already exists')
    return true
  }

  // PGRST116 = 0 rows（表存在但为空）
  if (error.code === 'PGRST116') {
    console.log('  ✅ Table exists (empty)')
    return true
  }

  // 表不存在
  console.log('  ⚠️  Table not found, attempting to create...')

  const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DATABASE_URL

  if (DB_PASSWORD) {
    // 如果传入的是完整 URL，提取 password
    let password = DB_PASSWORD
    if (DB_PASSWORD.startsWith('postgresql://') || DB_PASSWORD.startsWith('postgres://')) {
      const m = DB_PASSWORD.match(/:([^:@]+)@/)
      password = m ? m[1] : DB_PASSWORD
    }
    return await createTableViaDirectPg(password)
  }

  // 没有 DB_PASSWORD — 打印手动建表说明
  console.log('\n' + '═'.repeat(70))
  console.log('⚠️  无法自动建表 — 需要数据库密码')
  console.log('═'.repeat(70))
  console.log('\n方法一: 提供 DB_PASSWORD 自动建表:')
  console.log('  DB_PASSWORD="your_db_password" node scripts/seed-pitfallfree-guides.mjs')
  console.log('\n  获取密码: Supabase Dashboard → Settings → Database → Connection string')
  console.log('  https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/settings/database')
  console.log('\n方法二: 在 Supabase SQL Editor 手动执行 SQL 建表:')
  console.log('  👉 https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new')
  console.log('  执行文件: scripts/create-pitfallfree-table.sql')
  console.log('\n  建表完成后，再次运行: node scripts/seed-pitfallfree-guides.mjs')
  console.log('═'.repeat(70) + '\n')
  return false
}

// ── 主流程 ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 PitfallFree — Supabase Seed Script')
  console.log(`   Supabase: ${SUPABASE_URL}`)
  console.log(`   Table:    pitfallfree_guides\n`)

  // Step 1: 确认表存在
  const tableReady = await ensureTable()
  if (!tableReady) {
    process.exit(1)
  }

  // Step 2: 读取 MDX 文件
  const blogDir = path.join(ROOT, 'data', 'blog')
  const files = readBlogDir(blogDir)
  console.log(`\n📂 Found ${files.length} file(s) in data/blog/`)

  const articles = []
  for (const file of files) {
    const rel = path.relative(blogDir, file)
    try {
      const parsed = parseMdxFile(file, blogDir)
      if (!parsed) {
        console.log(`  ⏭  Skipped (draft=true): ${rel}`)
        continue
      }
      articles.push(parsed)
      const words = parsed.content.split(/\s+/).length
      console.log(`  📄 Parsed: ${parsed.slug} (${words} words, tags: [${parsed.tags.join(', ')}])`)
    } catch (e) {
      console.error(`  ❌ Failed to parse ${rel}: ${e.message}`)
    }
  }

  if (articles.length === 0) {
    console.log('\n⚠️  No publishable articles found.')
    process.exit(0)
  }

  console.log(`\n⬆️  Uploading ${articles.length} article(s) to Supabase...\n`)

  // Step 3: Upsert
  let successCount = 0
  let errorCount = 0

  for (const article of articles) {
    const { error } = await supabase
      .from('pitfallfree_guides')
      .upsert(
        { ...article, updated_at: new Date().toISOString() },
        { onConflict: 'slug' }
      )

    if (error) {
      console.error(`  ❌ "${article.slug}": ${error.message}`)
      errorCount++
    } else {
      const words = article.content.split(/\s+/).length
      console.log(`  ✅ ${article.slug} (${words} words)`)
      successCount++
    }
  }

  // Step 4: 结果
  console.log('\n' + '─'.repeat(50))
  console.log('🎉 Done!')
  console.log(`   ✅ Upserted : ${successCount}`)
  console.log(`   ❌ Errors   : ${errorCount}`)

  if (successCount > 0) {
    console.log('\n📊 Verify in Supabase Table Editor:')
    console.log(`   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/editor`)
    console.log('\n   SELECT slug, title, published_at, tags')
    console.log('   FROM pitfallfree_guides ORDER BY published_at DESC;')
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message)
  process.exit(1)
})

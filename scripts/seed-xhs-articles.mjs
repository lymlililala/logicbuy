#!/usr/bin/env node
/**
 * seed-xhs-articles.mjs
 *
 * 将 /Volumes/WenshuSpace/下载/xhs-knowledge-articles/ 下的 58 篇 MD 文章
 * 上传到 Supabase pitfallfree_guides 表（locale='zh'）。
 *
 * 同时会：
 * 1. 给表增加 locale 列（如不存在）
 * 2. 将唯一约束改为 (slug, locale)
 * 3. 生成语义化英文 slug（从文件名编号 + 关键词）
 * 4. upsert 中文文章数据
 *
 * Usage:
 *   node scripts/seed-xhs-articles.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import path from 'path'

// ── Supabase 配置 ──────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── 文章目录 ──────────────────────────────────────────────────────────────
const ARTICLES_DIR = '/Volumes/WenshuSpace/下载/xhs-knowledge-articles'

// ── 中文标题 → 英文 slug 映射表 ─────────────────────────────────────────
// 基于文件名语义手工映射，保证 SEO 友好的英文 URL
const SLUG_MAP = {
  '01': 'monitor-panel-guide-ips-va-oled',
  '02': 'laptop-performance-tdp-guide',
  '03': 'mechanical-keyboard-switch-guide',
  '04': 'tv-buying-guide-miniled-oled',
  '05': 'robot-vacuum-navigation-guide',
  '06': 'refrigerator-buying-guide-cooling-system',
  '07': 'water-purifier-guide-ro-ultrafiltration',
  '08': 'sunscreen-guide-physical-chemical',
  '09': 'mattress-guide-spring-comfort-layer',
  '10': 'cat-food-ingredients-nutrition-guide',
  '11': 'child-car-seat-buying-guide',
  '12': 'hardshell-jacket-waterproof-breathable-guide',
  '13': 'flooring-guide-four-materials-compared',
  '14': 'camping-sleeping-bag-tent-guide',
  '15': 'noise-cancelling-headphone-anc-audio-guide',
  '16': 'phone-screen-eye-care-pwm-dc-dimming',
  '17': 'ergonomic-chair-buying-guide',
  '18': 'treadmill-guide-horsepower-cushioning',
  '19': 'used-car-inspection-complete-guide',
  '20': 'projector-guide-light-source-brightness',
  '21': 'skin-whitening-guide-niacinamide-vitamin-c',
  '22': 'retinol-anti-aging-guide-concentration',
  '23': 'espresso-machine-guide-pump-pid',
  '24': 'air-conditioner-guide-energy-efficiency-refrigerant',
  '25': 'smart-toilet-seat-buying-guide',
  '26': 'sofa-guide-foam-density-frame',
  '27': 'high-speed-hair-dryer-buying-guide',
  '28': 'apartment-rental-pitfall-guide',
  '29': 'dog-food-ingredients-guide',
  '30': 'yoga-mat-guide-material-thickness',
  '31': 'baby-stroller-buying-guide',
  '32': 'air-purifier-guide-cadr-hepa',
  '33': 'used-phone-inspection-complete-guide',
  '34': 'home-audio-theater-buying-guide',
  '35': 'floor-washer-buying-guide',
  '36': 'dehumidifier-humidifier-buying-guide',
  '37': 'window-door-guide-profile-glass',
  '38': 'interior-paint-guide-voc-mold',
  '39': 'shower-head-guide-valve-thermostatic',
  '40': 'electric-toothbrush-water-flosser-guide',
  '41': 'beauty-device-guide-rf-led-microcurrent',
  '42': 'cat-litter-guide-four-materials',
  '43': 'pet-freeze-dried-treat-buying-guide',
  '44': 'baby-mattress-buying-guide',
  '45': 'hyaluronic-acid-peptide-skincare-guide',
  '46': 'secondhand-trading-scam-prevention-guide',
  '47': 'baby-food-tool-buying-guide',
  '48': 'smart-litter-box-buying-guide',
  '49': 'smartwatch-guide-fitness-health-monitoring',
  '50': 'dishwasher-buying-guide',
  '51': 'baby-bottle-guide-material-anti-colic',
  '52': 'gaming-monitor-peripherals-guide',
  '53': 'fresh-air-system-guide-heat-exchange-filter',
  '54': 'digital-camera-guide-sensor-lens-mount',
  '55': 'gym-equipment-guide-dumbbell-exercise-bike',
  '56': 'backpack-luggage-buying-guide',
  '57': 'kids-learning-tablet-buying-guide',
  '58': 'smartphone-guide-processor-battery-charging',
}

// ── 文章分类标签映射 ─────────────────────────────────────────────────────
const TAGS_MAP = {
  '01': ['tech-specs', 'monitor', 'display'],
  '02': ['tech-specs', 'laptop', 'performance'],
  '03': ['tech-specs', 'keyboard', 'peripheral'],
  '04': ['tech-specs', 'tv', 'display'],
  '05': ['home-living', 'robot-vacuum', 'smart-home'],
  '06': ['home-living', 'refrigerator', 'appliance'],
  '07': ['home-living', 'water-purifier', 'appliance'],
  '08': ['skincare-science', 'sunscreen', 'ingredients'],
  '09': ['home-living', 'mattress', 'sleep'],
  '10': ['pet-nutrition', 'cat-food', 'ingredients'],
  '11': ['home-living', 'baby', 'safety'],
  '12': ['home-living', 'outdoor', 'clothing'],
  '13': ['home-living', 'flooring', 'renovation'],
  '14': ['home-living', 'outdoor', 'camping'],
  '15': ['tech-specs', 'headphone', 'audio'],
  '16': ['tech-specs', 'phone', 'eye-care'],
  '17': ['home-living', 'chair', 'ergonomic'],
  '18': ['home-living', 'fitness', 'treadmill'],
  '19': ['home-living', 'car', 'buying-guide'],
  '20': ['tech-specs', 'projector', 'display'],
  '21': ['skincare-science', 'whitening', 'ingredients'],
  '22': ['skincare-science', 'anti-aging', 'retinol'],
  '23': ['home-living', 'coffee', 'appliance'],
  '24': ['home-living', 'air-conditioner', 'appliance'],
  '25': ['home-living', 'smart-toilet', 'bathroom'],
  '26': ['home-living', 'sofa', 'furniture'],
  '27': ['home-living', 'hair-dryer', 'personal-care'],
  '28': ['home-living', 'rental', 'buying-guide'],
  '29': ['pet-nutrition', 'dog-food', 'ingredients'],
  '30': ['home-living', 'fitness', 'yoga'],
  '31': ['home-living', 'baby', 'stroller'],
  '32': ['home-living', 'air-purifier', 'appliance'],
  '33': ['tech-specs', 'phone', 'buying-guide'],
  '34': ['home-living', 'audio', 'home-theater'],
  '35': ['home-living', 'floor-washer', 'appliance'],
  '36': ['home-living', 'humidity', 'appliance'],
  '37': ['home-living', 'window', 'renovation'],
  '38': ['home-living', 'paint', 'renovation'],
  '39': ['home-living', 'shower', 'bathroom'],
  '40': ['home-living', 'oral-care', 'personal-care'],
  '41': ['skincare-science', 'beauty-device', 'personal-care'],
  '42': ['pet-nutrition', 'cat-litter', 'pet'],
  '43': ['pet-nutrition', 'pet-food', 'freeze-dried'],
  '44': ['home-living', 'baby', 'mattress'],
  '45': ['skincare-science', 'ingredients', 'anti-aging'],
  '46': ['home-living', 'secondhand', 'buying-guide'],
  '47': ['home-living', 'baby', 'feeding'],
  '48': ['pet-nutrition', 'smart-home', 'cat'],
  '49': ['tech-specs', 'smartwatch', 'wearable'],
  '50': ['home-living', 'dishwasher', 'appliance'],
  '51': ['home-living', 'baby', 'bottle'],
  '52': ['tech-specs', 'gaming', 'monitor'],
  '53': ['home-living', 'ventilation', 'air-quality'],
  '54': ['tech-specs', 'camera', 'photography'],
  '55': ['home-living', 'fitness', 'equipment'],
  '56': ['home-living', 'travel', 'luggage'],
  '57': ['tech-specs', 'kids', 'tablet'],
  '58': ['tech-specs', 'phone', 'buying-guide'],
}

// ── 从 Markdown 中提取第一行标题作为 summary ─────────────────────────────
function extractSummary(content, maxLen = 200) {
  // 跳过标题行，取第一段正文
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue
    // 去掉 markdown 粗体标记
    const clean = trimmed.replace(/\*\*/g, '').replace(/`/g, '')
    if (clean.length > 20) {
      return clean.slice(0, maxLen)
    }
  }
  return ''
}

// ── 从 Markdown 中提取第一行 H1 标题 ────────────────────────────────────
function extractTitle(content) {
  for (const line of content.split('\n')) {
    const m = line.match(/^#\s+(.+)/)
    if (m) return m[1].trim()
  }
  return ''
}

// ── 解析文件 ─────────────────────────────────────────────────────────────
function parseArticle(filePath) {
  const filename = path.basename(filePath, '.md')
  // 格式: "01_显示器面板选购指南" 或 "01_显示器面板选购指南_IPS..."
  const numMatch = filename.match(/^(\d+)_/)
  if (!numMatch) return null

  const num = numMatch[1].padStart(2, '0')
  const slug = SLUG_MAP[num]
  if (!slug) {
    console.warn(`  ⚠️  No slug mapping for file: ${filename}`)
    return null
  }

  const rawContent = readFileSync(filePath, 'utf-8')
  const title = extractTitle(rawContent) || filename.replace(/^\d+_/, '')
  const summary = extractSummary(rawContent)
  const tags = TAGS_MAP[num] || ['buying-guide']

  // 生成发布日期（按文章序号，从 2026-01-01 起每天一篇）
  const baseDate = new Date('2026-01-01')
  baseDate.setDate(baseDate.getDate() + parseInt(num, 10) - 1)
  const published_at = baseDate.toISOString().split('T')[0]

  return {
    slug,
    locale: 'zh',
    title,
    summary,
    tags,
    layout: 'PostLayout',
    published_at,
    lastmod: null,
    draft: false,
    authors: ['default'],
    content: rawContent.trim(),
  }
}

// ── 迁移：添加 locale 列 + 更新唯一约束 ─────────────────────────────────
async function migrateTable() {
  console.log('🔧 Checking table schema for locale support...')

  // 检查 locale 列是否存在（通过查询一条数据带 locale 字段）
  const { data, error } = await supabase
    .from('pitfallfree_guides')
    .select('locale')
    .limit(1)

  if (!error) {
    console.log('  ✅ locale column already exists')
    return true
  }

  // locale 列不存在，需要迁移
  console.log('  📋 locale column missing — please run the following SQL in Supabase SQL Editor:')
  console.log('\n  👉 https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/sql/new\n')
  console.log('─'.repeat(70))
  console.log(`
-- Step 1: Add locale column
ALTER TABLE pitfallfree_guides
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'zh';

-- Step 2: Update existing rows to 'en' locale (legacy MDX files were English)
UPDATE pitfallfree_guides SET locale = 'en' WHERE locale = 'zh';

-- Step 3: Drop old unique constraint on slug
ALTER TABLE pitfallfree_guides DROP CONSTRAINT IF EXISTS pitfallfree_guides_slug_key;

-- Step 4: Add composite unique constraint (slug, locale)
ALTER TABLE pitfallfree_guides
  ADD CONSTRAINT pitfallfree_guides_slug_locale_key UNIQUE (slug, locale);

-- Step 5: Update the index
DROP INDEX IF EXISTS idx_pitfallfree_guides_slug;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pitfallfree_guides_slug_locale
  ON pitfallfree_guides (slug, locale);
`)
  console.log('─'.repeat(70))
  console.log('\n  After running the SQL, re-run: node scripts/seed-xhs-articles.mjs\n')
  return false
}

// ── 主流程 ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 PitfallFree — XHS Articles Seed Script')
  console.log(`   Supabase:  ${SUPABASE_URL}`)
  console.log(`   Source:    ${ARTICLES_DIR}`)
  console.log(`   Table:     pitfallfree_guides (locale=zh)\n`)

  // Step 1: 检查表结构
  const schemaOk = await migrateTable()
  if (!schemaOk) {
    process.exit(1)
  }

  // Step 2: 读取所有 .md 文件
  let files
  try {
    files = readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort()
      .map((f) => path.join(ARTICLES_DIR, f))
  } catch (e) {
    console.error(`❌ Cannot read directory: ${ARTICLES_DIR}`)
    console.error(`   ${e.message}`)
    process.exit(1)
  }

  console.log(`📂 Found ${files.length} .md file(s)\n`)

  // Step 3: 解析文章
  const articles = []
  for (const file of files) {
    const rel = path.basename(file)
    try {
      const parsed = parseArticle(file)
      if (!parsed) {
        console.log(`  ⏭  Skipped (no mapping): ${rel}`)
        continue
      }
      articles.push(parsed)
      const chars = parsed.content.length
      console.log(`  📄 Parsed: [${parsed.locale}] ${parsed.slug}`)
      console.log(`       Title: ${parsed.title.slice(0, 50)}`)
      console.log(`       Tags: [${parsed.tags.join(', ')}] | ${chars} chars`)
    } catch (e) {
      console.error(`  ❌ Failed to parse ${rel}: ${e.message}`)
    }
  }

  if (articles.length === 0) {
    console.log('\n⚠️  No articles parsed.')
    process.exit(0)
  }

  console.log(`\n⬆️  Uploading ${articles.length} article(s) to Supabase...\n`)

  // Step 4: Upsert（按 slug + locale 去重）
  let successCount = 0
  let errorCount = 0

  // 分批上传（每批10篇）
  const BATCH_SIZE = 10
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('pitfallfree_guides')
      .upsert(
        batch.map((a) => ({ ...a, updated_at: new Date().toISOString() })),
        { onConflict: 'slug,locale' }
      )

    if (error) {
      // 批量失败时逐条尝试
      console.warn(`  ⚠️  Batch ${i / BATCH_SIZE + 1} failed: ${error.message} — retrying one by one...`)
      for (const article of batch) {
        const { error: singleErr } = await supabase
          .from('pitfallfree_guides')
          .upsert(
            { ...article, updated_at: new Date().toISOString() },
            { onConflict: 'slug,locale' }
          )
        if (singleErr) {
          console.error(`  ❌ "${article.slug}" [${article.locale}]: ${singleErr.message}`)
          errorCount++
        } else {
          console.log(`  ✅ ${article.slug} [${article.locale}]`)
          successCount++
        }
      }
    } else {
      for (const a of batch) {
        console.log(`  ✅ ${a.slug} [${a.locale}]`)
      }
      successCount += batch.length
    }
  }

  // Step 5: 结果
  console.log('\n' + '─'.repeat(60))
  console.log('🎉 Done!')
  console.log(`   ✅ Upserted : ${successCount}`)
  console.log(`   ❌ Errors   : ${errorCount}`)

  if (successCount > 0) {
    console.log('\n📊 Verify in Supabase:')
    console.log(`   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/editor`)
    console.log(`\n   SELECT slug, locale, title, published_at`)
    console.log(`   FROM pitfallfree_guides`)
    console.log(`   WHERE locale = 'zh'`)
    console.log(`   ORDER BY published_at ASC LIMIT 10;`)
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message)
  process.exit(1)
})

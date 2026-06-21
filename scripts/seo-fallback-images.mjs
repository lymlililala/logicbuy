#!/usr/bin/env node
/**
 * seo-fallback-images.mjs
 *
 * 给「Pexels 按品类关键词都搜不到合适图」的冷门文章，按**品类兜底通用图**补封面，
 * 保证全站没有素面无图页。兜底图按文章 tags 映射到品类，用一组固定的通用 Pexels 图。
 *
 * - 仅处理仍无图（draft=false 且正文无 pexels/unsplash 图）的文章。
 * - 双语共用同一张兜底图；插在介绍段后（第一个 ## 前）。
 * - 幂等：已有图跳过。--dry-run 只看不写。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-fallback-images.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-fallback-images.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（用 node --env-file=.env.local 运行）')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)
const DRY = process.argv.includes('--dry-run')
const DATE = new Date().toISOString().slice(0, 10)

// 各品类兜底通用图（Pexels CDN 直链，2026-06-21 取，通用且与品类相关）。
const FALLBACK = {
  'tech-electronics':
    'https://images.pexels.com/photos/9784240/pexels-photo-9784240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'home-appliances':
    'https://images.pexels.com/photos/33686459/pexels-photo-33686459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'home-living':
    'https://images.pexels.com/photos/6980724/pexels-photo-6980724.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  office:
    'https://images.pexels.com/photos/19055620/pexels-photo-19055620.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  kitchen:
    'https://images.pexels.com/photos/7166645/pexels-photo-7166645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'pet-care':
    'https://images.pexels.com/photos/16395150/pexels-photo-16395150.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'outdoors-fitness':
    'https://images.pexels.com/photos/4716814/pexels-photo-4716814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  parenting:
    'https://images.pexels.com/photos/7055885/pexels-photo-7055885.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'skincare-science':
    'https://images.pexels.com/photos/27544691/pexels-photo-27544691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'air-quality':
    'https://images.pexels.com/photos/7907405/pexels-photo-7907405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'rental-living':
    'https://images.pexels.com/photos/19966788/pexels-photo-19966788.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'smart-home':
    'https://images.pexels.com/photos/22307556/pexels-photo-22307556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  default:
    'https://images.pexels.com/photos/5486161/pexels-photo-5486161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
}

// 兜底图的中英文 alt（通用，不写死品类名以免与图不符）
const ALT = { en: 'Product category overview', zh: '该品类选购参考' }

// tag → 品类键的归一（同义/近义 tag 收敛到有兜底图的品类）。按优先级匹配。
const TAG_TO_CAT = [
  [['air-quality', 'air-purifiers'], 'air-quality'],
  [['pet-care', 'pet-nutrition', 'pets', 'pet'], 'pet-care'],
  [['parenting', 'baby-maternity', 'baby'], 'parenting'],
  [['skincare-science', 'skincare-personal-care', 'skincare', 'beauty'], 'skincare-science'],
  [['outdoors-fitness', 'outdoor-fitness', 'fitness', 'home-gym', 'outdoor'], 'outdoors-fitness'],
  [['rental-living'], 'rental-living'],
  [['smart-home'], 'smart-home'],
  [['kitchen', 'kitchen-appliances', 'cooking'], 'kitchen'],
  [['office', 'computers-peripherals'], 'office'],
  [['home-appliances', 'home-appliance', 'appliances', 'cleaning'], 'home-appliances'],
  [
    ['tech-electronics', 'tech', 'tech-specs', 'electronics', 'audio', 'home-entertainment'],
    'tech-electronics',
  ],
  [['home-living', 'home-renovation', 'furniture', 'home', 'home-living'], 'home-living'],
]

function catOf(tags) {
  const set = new Set(tags || [])
  for (const [keys, cat] of TAG_TO_CAT) {
    if (keys.some((k) => set.has(k))) return cat
  }
  return 'default'
}

const hasImage = (c) => /!\[[^\]]*\]\(https?:\/\/[^)]*(pexels|unsplash)/.test(c || '')

function insertCover(content, alt, url) {
  const md = `![${alt}](${url})`
  let i = content.indexOf('\n## ')
  if (i === -1) {
    const p = content.indexOf('\n\n')
    i = p === -1 ? content.length : p
  }
  return content.slice(0, i) + `\n\n${md}\n` + content.slice(i)
}

// 拉全部已发布文章
const rows = []
for (let f = 0; ; f += 1000) {
  const { data, error } = await sb
    .from('pitfallfree_guides')
    .select('slug,locale,tags,content')
    .eq('draft', false)
    .range(f, f + 999)
  if (error) {
    console.error('查询失败:', error.message)
    process.exit(1)
  }
  rows.push(...data)
  if (data.length < 1000) break
}

const bySlug = new Map()
for (const r of rows) {
  if (!bySlug.has(r.slug)) bySlug.set(r.slug, [])
  bySlug.get(r.slug).push(r)
}

let ok = 0,
  skip = 0
const catStat = {}
for (const [slug, rs] of bySlug) {
  if (!rs.some((r) => !hasImage(r.content))) continue // 该 slug 已都有图
  const tags = rs.find((r) => r.tags?.length)?.tags || []
  const cat = catOf(tags)
  const url = FALLBACK[cat] || FALLBACK.default
  catStat[cat] = (catStat[cat] || 0) + 1
  for (const r of rs) {
    if (hasImage(r.content)) {
      skip++
      continue
    }
    const newContent = insertCover(r.content, ALT[r.locale] || ALT.en, url)
    if (DRY) {
      console.log(`[dry] ${r.locale} ${slug}  → [${cat}] ${url.slice(0, 48)}`)
      ok++
      continue
    }
    const { error } = await sb
      .from('pitfallfree_guides')
      .update({ content: newContent, lastmod: DATE, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .eq('locale', r.locale)
    if (error) console.log(`ERR ${r.locale} ${slug}: ${error.message}`)
    else {
      console.log(`OK  ${r.locale} ${slug}  → [${cat}]`)
      ok++
    }
  }
}
console.log(`\n完成：写入/计划 ${ok}，已有图跳过 ${skip}。品类分布:`, catStat)

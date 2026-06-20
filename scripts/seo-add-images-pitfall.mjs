#!/usr/bin/env node
/**
 * seo-add-images-pitfall.mjs
 *
 * 给现有 10 篇「踩坑」文（tag pitfall-guide，slug *-buying-mistakes）补配图：
 * - 每篇按结构位置插 2 张图：封面（介绍段后、第一个 ## 前）+ 中段（核对清单 / FAQ 前）。
 * - 图用 Pexels 按品类英文关键词搜（热链 CDN，不下载），EN/ZH 共用同一组图。
 * - 相关性校验 + 缓存（scripts/lib/pexels.mjs）；未命中则跳过该位置（不留死占位）。
 * - 幂等：正文已含 pexels/unsplash 图则跳过（--force 强制重插）。
 * - upsert 回 Supabase，刷新 lastmod / updated_at。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-add-images-pitfall.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-add-images-pitfall.mjs
 *   node --env-file=.env.local scripts/seo-add-images-pitfall.mjs --force
 */
import { createClient } from '@supabase/supabase-js'
import { ImageFinder } from './lib/pexels.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（请用 node --env-file=.env.local 运行）')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)
const DRY = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const DATE = '2026-06-20'

// 每篇 2 个配图关键词：[封面, 中段]。英文关键词，EN/ZH 共用。
const IMG_KW = {
  'mattress-buying-mistakes': [
    {
      kw: 'memory foam mattress bedroom',
      en: 'A mattress on a bed in a bedroom',
      zh: '卧室里床上的床垫',
    },
    {
      kw: 'mattress firmness hand pressing',
      en: 'Testing mattress firmness by hand',
      zh: '用手按压测试床垫软硬',
    },
  ],
  'robot-vacuum-buying-mistakes': [
    {
      kw: 'robot vacuum cleaning floor',
      en: 'A robot vacuum cleaning a floor',
      zh: '扫地机器人在清洁地板',
    },
    {
      kw: 'robot vacuum charging dock',
      en: 'A robot vacuum at its charging dock',
      zh: '扫地机器人在充电基站',
    },
  ],
  'air-fryer-buying-mistakes': [
    {
      kw: 'air fryer kitchen counter',
      en: 'An air fryer on a kitchen counter',
      zh: '厨房台面上的空气炸锅',
    },
    {
      kw: 'air fryer basket fries food',
      en: 'Food in an air fryer basket',
      zh: '空气炸锅篮中的食物',
    },
  ],
  'monitor-buying-mistakes': [
    {
      kw: 'computer monitor desk setup',
      en: 'A computer monitor on a desk',
      zh: '桌面上的电脑显示器',
    },
    { kw: 'dual monitor workstation', en: 'A dual-monitor workstation', zh: '双屏工作台' },
  ],
  'ergonomic-chair-buying-mistakes': [
    { kw: 'ergonomic office chair', en: 'An ergonomic office chair', zh: '一把人体工学办公椅' },
    {
      kw: 'office chair armrest adjustment',
      en: 'Adjusting an office chair armrest',
      zh: '调节办公椅扶手',
    },
  ],
  'air-purifier-buying-mistakes': [
    {
      kw: 'air purifier living room',
      en: 'An air purifier in a living room',
      zh: '客厅里的空气净化器',
    },
    {
      kw: 'air purifier hepa filter',
      en: 'A HEPA filter from an air purifier',
      zh: '空气净化器的 HEPA 滤芯',
    },
  ],
  'noise-cancelling-headphone-buying-mistakes': [
    {
      kw: 'noise cancelling headphones',
      en: 'Over-ear noise-cancelling headphones',
      zh: '头戴式降噪耳机',
    },
    {
      kw: 'wireless earbuds case',
      en: 'Wireless earbuds in a charging case',
      zh: '充电盒中的无线耳机',
    },
  ],
  'laptop-buying-mistakes': [
    { kw: 'laptop computer desk', en: 'A laptop computer on a desk', zh: '桌上的笔记本电脑' },
    { kw: 'laptop keyboard closeup', en: 'A close-up of a laptop keyboard', zh: '笔记本键盘特写' },
  ],
  'electric-toothbrush-buying-mistakes': [
    {
      kw: 'electric toothbrush bathroom',
      en: 'An electric toothbrush in a bathroom',
      zh: '浴室里的电动牙刷',
    },
    {
      kw: 'toothbrush brushing teeth',
      en: 'Brushing teeth with an electric toothbrush',
      zh: '用电动牙刷刷牙',
    },
  ],
  'humidifier-buying-mistakes': [
    {
      kw: 'humidifier mist room',
      en: 'A humidifier releasing mist in a room',
      zh: '房间里喷雾的加湿器',
    },
    {
      kw: 'humidifier on bedside table',
      en: 'A humidifier on a bedside table',
      zh: '床头柜上的加湿器',
    },
  ],
}

const SLUGS = Object.keys(IMG_KW)
const finder = new ImageFinder()
if (!finder.enabled) {
  console.error('Pexels/Unsplash key 未配置（scripts/wechat/.env），无法配图。')
  process.exit(1)
}

const imgMd = (alt, url) => `![${alt}](${url})`

/** 在介绍段后（第一个 \n## 前）插封面，在核对清单/FAQ 前插中段图 */
function insertImages(content, locale, picks) {
  // picks: [{alt,url}|null, {alt,url}|null]
  let out = content
  const [cover, mid] = picks

  if (cover) {
    const i = out.indexOf('\n## ')
    if (i !== -1) out = out.slice(0, i) + `\n\n${imgMd(cover.alt, cover.url)}\n` + out.slice(i)
  }
  if (mid) {
    const markers =
      locale === 'zh'
        ? ['\n## 选购前快速核对清单', '\n## 常见问题']
        : ['\n## Quick Pre-Purchase Checklist', '\n## Quick ', '\n## FAQ']
    let j = -1
    for (const m of markers) {
      j = out.indexOf(m)
      if (j !== -1) break
    }
    if (j !== -1) out = out.slice(0, j) + `\n${imgMd(mid.alt, mid.url)}\n` + out.slice(j)
  }
  return out
}

const hasImage = (c) => /!\[[^\]]*\]\(https?:\/\/[^)]*(pexels|unsplash)/.test(c)

let ok = 0,
  skip = 0,
  fail = 0
for (const slug of SLUGS) {
  const { data: rows, error } = await sb
    .from('pitfallfree_guides')
    .select('slug,locale,content')
    .eq('slug', slug)
  if (error || !rows?.length) {
    console.log(`✗ 取文失败 ${slug}: ${error?.message || '无行'}`)
    fail++
    continue
  }

  // 解析两张图（双语共用）
  const specs = IMG_KW[slug]
  const resolved = []
  for (const s of specs) {
    const r = await finder.find(s.kw, s.en)
    resolved.push(r ? r.url : null)
  }

  for (const row of rows) {
    if (!FORCE && hasImage(row.content)) {
      console.log(`· 跳过(已有图) ${row.locale} ${slug}`)
      skip++
      continue
    }
    const picks = specs.map((s, idx) =>
      resolved[idx] ? { alt: s[row.locale] || s.en, url: resolved[idx] } : null
    )
    if (!picks.some(Boolean)) {
      console.log(`✗ 无可用图 ${row.locale} ${slug}`)
      fail++
      continue
    }
    const newContent = insertImages(row.content, row.locale, picks)
    if (DRY) {
      console.log(
        `[dry] ${row.locale} ${slug}: 插图 ${picks.filter(Boolean).length} 张 → ${picks
          .filter(Boolean)
          .map((p) => p.url.slice(0, 50))
          .join(' , ')}`
      )
      ok++
      continue
    }
    const { error: e2 } = await sb
      .from('pitfallfree_guides')
      .update({ content: newContent, lastmod: DATE, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .eq('locale', row.locale)
    if (e2) {
      console.log(`ERR ${row.locale} ${slug}: ${e2.message}`)
      fail++
    } else {
      console.log(`OK  ${row.locale} ${slug}: 插图 ${picks.filter(Boolean).length} 张`)
      ok++
    }
  }
}
console.log(`\n完成：写入/计划 ${ok}，跳过 ${skip}，失败 ${fail}。配图 stats`, finder.stats)

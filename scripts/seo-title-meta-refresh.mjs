#!/usr/bin/env node
/**
 * seo-title-meta-refresh.mjs
 *
 * 一次性 SEO 优化：基于 GSC 数据改写高展示页的标题/Meta（CTR + 关键词匹配），
 * 补全缺失的 meta description，并更新 lastmod 促使 Google 重新抓取。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-title-meta-refresh.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-title-meta-refresh.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!KEY) {
  console.error('缺少 SUPABASE_SECRET_KEY（请用 node --env-file=.env.local 运行）')
  process.exit(1)
}
const sb = createClient(SUPABASE_URL, KEY)
const DRY = process.argv.includes('--dry-run')
const TODAY = '2026-06-09'

// title：精简堆砌、更新年份、前置精确匹配 query、保留核心关键词
// summary：补全空缺的 meta description（150–160 字符为宜）
const updates = [
  // ── 补全缺失的 meta description（最严重）──
  {
    slug: 'fitness-mirror-smart-home-gym',
    locale: 'en',
    summary:
      'Smart fitness mirrors promise studio-quality workouts at home, but subscription costs, screen size, and content libraries vary widely. This guide compares the top fitness mirrors and smart home gym systems, what to check before buying, and whether a mirror really beats a tablet stand.',
  },
  {
    slug: 'fitness-mirror-smart-home-gym',
    locale: 'zh',
    summary:
      '智能健身魔镜主打在家也能上私教课，但订阅费、屏幕尺寸和课程内容差别很大。本指南对比主流健身魔镜与智能家庭健身系统，告诉你下单前要确认哪些参数，以及魔镜是否真的比平板支架更值得买。',
  },
  {
    slug: 'gaming-chair-buying-guide',
    locale: 'en',
    summary:
      'A good gaming chair is about lumbar support, seat depth, and build quality — not RGB or racing looks. This guide explains what actually matters for long sessions, how gaming chairs compare to ergonomic office chairs, and the best picks at every budget.',
  },
  {
    slug: 'gaming-chair-buying-guide',
    locale: 'zh',
    summary:
      '好的电竞椅关键在腰部支撑、坐深和做工，而不是 RGB 灯效或赛车造型。本指南讲清楚久坐真正重要的参数、电竞椅与人体工学办公椅怎么选，以及各价位最值得买的型号。',
  },

  // ── OLED/QLED：把精确匹配 query 前置到标题开头（该词排名 8.1、22 展示）──
  {
    slug: 'tv-oled-vs-qled-vs-miniled-panel-guide',
    locale: 'en',
    title:
      'OLED vs QLED vs Mini-LED (2026): What the Panel Tech Really Means for Picture Quality',
  },
  {
    slug: 'tv-oled-vs-qled-vs-miniled-panel-guide',
    locale: 'zh',
    title: 'OLED vs QLED vs Mini-LED 怎么选（2026）：面板技术对画质的真实影响',
  },

  // ── 文档扫描仪：精简堆砌标题 + 年份 2025→2026 ──
  {
    slug: 'document-scanner-buying-guide',
    locale: 'en',
    title:
      'Best Document Scanners 2026: Flatbed vs Sheet-Fed vs Portable (ScanSnap, Brother, Epson)',
  },
  {
    slug: 'document-scanner-buying-guide',
    locale: 'zh',
    title: '文件扫描仪选购指南 2026：平板 vs 馈纸式 vs 便携，附 OCR 与无纸化方案',
  },

  // ── 家用打印机：精简标题 + 年份 2025→2026（zh 排名 7.3，保留核心词）──
  {
    slug: 'home-printer-buying-guide',
    locale: 'en',
    title:
      'Best Home Printers 2026: Inkjet vs Laser, Ink Tank vs Cartridge & True Cost Per Page',
  },
  {
    slug: 'home-printer-buying-guide',
    locale: 'zh',
    title: '家用打印机选购指南 2026：喷墨 vs 激光、墨仓 vs 墨盒，附真实每页成本',
  },

  // ── 便携空调：加年份钩子 + 精简尾巴，保留 BTU/SACC/single dual hose（排名 10.6，谨慎）──
  {
    slug: 'portable-air-conditioner-btu-doe-single-dual-hose-guide',
    locale: 'en',
    title:
      'Portable Air Conditioner Buying Guide 2026: DOE SACC vs Old BTU Ratings, Single vs Dual Hose',
  },
  {
    slug: 'portable-air-conditioner-btu-doe-single-dual-hose-guide',
    locale: 'zh',
    title: '便携空调选购指南 2026：DOE SACC vs 旧 BTU 标准、单管 vs 双管怎么选',
  },

  // ── 机械键盘轴体：标题补 "Switch Types" 匹配 query，保留疑问钩子 ──
  {
    slug: 'mechanical-keyboard-switch-guide',
    locale: 'en',
    title: 'Mechanical Keyboard Switch Types Explained: Which One Should You Pick? (2026)',
  },
  {
    slug: 'mechanical-keyboard-switch-guide',
    locale: 'zh',
    title: '机械键盘轴体类型详解：打字和游戏到底该选哪个轴（2026）',
  },

  // ── 空气净化器：精简标题尾巴 + 年份，保留 HEPA/CADR/room size ──
  {
    slug: 'air-purifier-hepa-cadr-room-size-guide',
    locale: 'en',
    title: 'Air Purifier Buying Guide 2026: HEPA Standards, CADR Ratings & Room Size Matching',
  },
  {
    slug: 'air-purifier-hepa-cadr-room-size-guide',
    locale: 'zh',
    title: '空气净化器选购指南 2026：HEPA 标准、CADR 值与房间面积匹配',
  },
]

let ok = 0,
  fail = 0
for (const u of updates) {
  const patch = { lastmod: TODAY }
  if (u.title) patch.title = u.title
  if (u.summary) patch.summary = u.summary
  if (DRY) {
    console.log(`[dry] ${u.locale} ${u.slug}`)
    if (u.title) console.log('      title:', u.title)
    if (u.summary) console.log('      summary:', u.summary.slice(0, 80) + '…')
    continue
  }
  const { error } = await sb
    .from('pitfallfree_guides')
    .update(patch)
    .eq('slug', u.slug)
    .eq('locale', u.locale)
  if (error) {
    console.log(`ERR ${u.locale} ${u.slug}: ${error.message}`)
    fail++
  } else {
    console.log(`OK  ${u.locale} ${u.slug}`)
    ok++
  }
}
if (!DRY) console.log(`\n完成：成功 ${ok}，失败 ${fail}`)

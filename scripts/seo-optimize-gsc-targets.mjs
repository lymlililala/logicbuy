#!/usr/bin/env node
/**
 * seo-optimize-gsc-targets.mjs
 *
 * 针对 GSC「有谷歌展示、排名卡在第 2–8 页」的高展示主文做最小化关键词对齐 + 补 FAQ。
 * 依据 gsc_info/20250622/ 的实测查询词。只改 title/summary/content 的局部，不整篇重写。
 * 用 .update().eq('slug').eq('locale')，只动指定字段，不碰 draft/图片等其它列。幂等可重跑。
 *
 * 跳过（已覆盖/已第一页，按需修改原则不动）：
 *   - portable-air-conditioner...（FAQ 已含 ASHRAE vs SACC）
 *   - air-purifier-hepa-cadr...（FAQ 已含 What CADR do I need）
 *   - tv-oled-vs-qled...（rank≈8 已第一页，title 已命中 picture quality）
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-optimize-gsc-targets.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-optimize-gsc-targets.mjs
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

// ---- FAQ 文本（新增，均用 ### 问句 格式，才会被 lib/markdown.ts buildFaqJsonLd 解析进 FAQPage schema）----

const FAQ_PRINTER_EN = `

## FAQ

### Which printer should I buy for home use?
For most homes, an ink tank printer (Epson EcoTank or Canon MegaTank) is the best buy: a higher upfront price but a far lower cost per page. If you print mostly black text and rarely color, a mono laser is cheaper and more reliable. Match the printer to your print volume, not the sticker price.

### Inkjet or laser — which is cheaper?
Over the life of the printer, laser is cheaper for high-volume black-and-white text, while ink tank inkjets win for households that also print color or photos. Traditional cartridge inkjets are the most expensive per page despite the low hardware price.

### Which printer has the lowest cost per page?
Ink tank inkjets and mono laser printers have the lowest running costs. Refill bottles or toner spread over thousands of pages bring cost per page down to a few cents, versus 15–25 cents for cartridge inkjets.

### How do I compare printers fairly?
Compare printers on cost per page (not sticker price), the page yield of ink or toner, print speed, and whether you need all-in-one scanning. If you also digitize paper, see our [document scanner buying guide](/en/guides/document-scanner-buying-guide).`

const FAQ_PRINTER_ZH = `

## 常见问题

### 家用打印机到底买哪种？
多数家庭首选墨仓式打印机（爱普生 EcoTank、佳能 MegaTank）：购机价高一些，但每页成本低得多。如果你主要打印黑白文字、很少彩色，黑白激光更便宜也更可靠。按打印量选，而不是看标价。

### 喷墨和激光哪个更省钱？
长期来看，大量黑白文字打印激光更省；同时要打彩色或照片的家庭，墨仓喷墨更划算。传统墨盒喷墨虽然购机便宜，每页成本却最高。

### 哪种打印机每页成本最低？
墨仓喷墨和黑白激光运行成本最低。墨水瓶或硒鼓摊到数千页，每页只要几分钱，而墨盒喷墨每页要一两元。

### 怎么公平地比较打印机？
比较时看每页成本（而非标价）、墨水/硒鼓的页产量、打印速度，以及是否需要一体机扫描。如果同时要把纸质资料数字化，可参考我们的[文件扫描仪选购指南](/zh/guides/document-scanner-buying-guide)。`

const FAQ_CAMERA_EN = `

## FAQ

### What is the best aperture size for a mobile camera?
On phones, a wider aperture (a lower f-number such as f/1.6–f/1.8) lets in more light and helps in low light, but phone apertures are not comparable to camera lenses because the sensor is far smaller. Beyond roughly f/1.8, a larger sensor and better computational photography matter more than the aperture number alone.

### Do more megapixels mean a better phone camera?
No. A 200MP sensor is not automatically better than a 50MP one. Sensor size, pixel size, and image processing determine real quality, and most high-megapixel phones bin pixels down to about 12MP for everyday shots anyway.

### How do I judge a phone camera before buying?
Look at real sample photos in the conditions you actually shoot (low light, zoom, portraits) rather than spec sheets. Sensor size, optical image stabilization, and computational photography matter more than megapixel counts or aperture numbers.`

const FAQ_CAMERA_ZH = `

## 常见问题

### 手机摄像头光圈多大才好？
手机上光圈越大（f 值越小，如 f/1.6–f/1.8）进光越多、弱光表现越好，但手机光圈不能和相机镜头直接比，因为传感器小得多。超过约 f/1.8 之后，更大的传感器和更强的计算摄影比单纯的光圈数值更重要。

### 像素越高手机拍照越好吗？
不是。2 亿像素不一定比 5000 万像素好。真正决定画质的是传感器尺寸、单像素大小和图像处理，而且多数高像素手机日常拍摄也会把像素合并到约 1200 万。

### 买手机前怎么判断拍照好坏？
看你常拍场景（弱光、变焦、人像）的真实样张，而不是参数表。传感器尺寸、光学防抖和计算摄影比像素数和光圈数值更能决定成片质量。`

const FAQ_STEAMER_EN = `

## FAQ

### Steamer or iron — which should I buy?
Choose an iron for crisp results on cotton and linen, sharp creases, and dress shirts; choose a garment steamer for quick touch-ups, delicate fabrics, and items you can't lay flat. Many households end up wanting both, but if you buy just one, match it to the fabrics you wear most.

### Are handheld garment steamers any good?
Most handheld steamers are underpowered for routine use — they run out of steam quickly and struggle with thick fabric. They suit occasional travel touch-ups; for regular steaming, a standing unit with higher wattage and steam output is far more effective.

### Does a steamer replace an iron?
Not fully. A steamer relaxes wrinkles but can't press a sharp crease or flatten heavy cotton the way an iron and board can. For business shirts and trousers, an iron still wins.`

const FAQ_STEAMER_ZH = `

## 常见问题

### 挂烫机还是熨斗，到底买哪个？
追求棉麻平整、笔挺折痕和正装衬衫，选熨斗；想快速去皱、处理精细面料或不便平铺的衣物，选挂烫机。很多家庭最后两者都想要，但只买一个的话，按你最常穿的面料来选。

### 手持挂烫机好用吗？
多数手持挂烫机功率不足，难以日常使用——蒸汽很快用尽、对厚面料吃力。它适合偶尔出差快速整理；要经常使用，功率和蒸汽量更大的立式机器有效得多。

### 挂烫机能取代熨斗吗？
不能完全取代。挂烫机能松弛褶皱，但压不出笔挺折痕，也无法像熨斗加烫衣板那样把厚棉布完全压平。正装衬衫和西裤，熨斗仍然更胜一筹。`

// ---- 改动清单 ----
// 每项：{ slug, locale, title?, summary?, replaces: [[find, replace], ...], append?: {marker, text} }
const EDITS = [
  // 1. document-scanner —— 仅修正正文 H1 过时年份 2025→2026（title 字段已是 2026）
  {
    slug: 'document-scanner-buying-guide',
    locale: 'en',
    replaces: [['# Best Document Scanners 2025:', '# Best Document Scanners 2026:']],
  },
  {
    slug: 'document-scanner-buying-guide',
    locale: 'zh',
    replaces: [['# 文件扫描仪选购指南2025：', '# 文件扫描仪选购指南2026：']],
  },

  // 2. home-printer —— 年份修正 + 新增 FAQ（命中 which printer to buy / inkjet or laser / printers compared）
  {
    slug: 'home-printer-buying-guide',
    locale: 'en',
    replaces: [['# Best Home Printers 2025:', '# Best Home Printers 2026:']],
    append: { marker: '### Which printer should I buy for home use?', text: FAQ_PRINTER_EN },
  },
  {
    slug: 'home-printer-buying-guide',
    locale: 'zh',
    replaces: [['# 家用打印机选购指南2025：', '# 家用打印机选购指南2026：']],
    append: { marker: '### 家用打印机到底买哪种？', text: FAQ_PRINTER_ZH },
  },

  // 3. mechanical-keyboard —— EN H1 对齐 "switch types"（键盘相关查询均为英文，仅动 EN）
  {
    slug: 'mechanical-keyboard-switch-guide',
    locale: 'en',
    replaces: [
      [
        '# Mechanical Keyboard Switches: Which One Should You Pick?',
        '# Mechanical Keyboard Switch Types: Which One Should You Pick? (Linear, Tactile, Clicky)',
      ],
    ],
  },

  // 4. fitness-mirror —— EN 补 workout mirror 同义词 + 双语 FAQ 由 **加粗** 转 ### （让现有 FAQ 真正进 schema）+ 补同义问
  {
    slug: 'fitness-mirror-smart-home-gym',
    locale: 'en',
    title: 'Best Fitness Mirrors (Workout Mirrors) & Smart Home Gym Systems 2026',
    summary:
      'Smart fitness mirrors promise studio-quality workouts at home, but subscription costs, screen size, and content libraries vary widely. This guide compares the top fitness mirrors (also called workout mirrors) and smart home gym systems, what to check before buying, and whether a mirror really beats a tablet stand.',
    replaces: [
      [
        '# Best Fitness Mirrors & Smart Home Gym Systems 2026',
        '# Best Fitness Mirrors (Workout Mirrors) & Smart Home Gym Systems 2026',
      ],
      [
        'Fitness mirrors are one of the most innovative home gym developments in years',
        'Fitness mirrors — also called workout mirrors — are one of the most innovative home gym developments in years',
      ],
      [
        '**Can you use a fitness mirror without a subscription?**',
        '### Can you use a fitness mirror without a subscription?',
      ],
      [
        '**How much space does a fitness mirror need?**',
        '### How much space does a fitness mirror need?',
      ],
      [
        "**What's the best fitness mirror for small apartments?**",
        "### What's the best fitness mirror for small apartments?",
      ],
    ],
    append: {
      marker: '### Is a workout mirror the same as a fitness mirror?',
      text: `

### Is a workout mirror the same as a fitness mirror?
Yes — "workout mirror" and "fitness mirror" refer to the same product: a mirror with a built-in screen for live and on-demand classes. Brands and retailers use the terms interchangeably.`,
    },
  },
  {
    slug: 'fitness-mirror-smart-home-gym',
    locale: 'zh',
    replaces: [
      ['**不订阅可以使用健身魔镜吗？**', '### 不订阅可以使用健身魔镜吗？'],
      ['**健身魔镜需要多大空间？**', '### 健身魔镜需要多大空间？'],
      ['**小户型公寓最适合哪款健身魔镜？**', '### 小户型公寓最适合哪款健身魔镜？'],
    ],
    append: {
      marker: '### 健身魔镜和健身镜是一回事吗？',
      text: `

### 健身魔镜和健身镜是一回事吗？
是的，"健身魔镜""健身镜""运动魔镜"指的是同一类产品：内嵌屏幕、能跟练直播和点播课程的镜子，不同品牌和店铺叫法不同。`,
    },
  },

  // 5. smartphone-camera —— 新增 FAQ（命中 best aperture size for mobile camera）
  {
    slug: 'smartphone-camera-sensor-aperture-computational-photography',
    locale: 'en',
    append: { marker: '### What is the best aperture size for a mobile camera?', text: FAQ_CAMERA_EN },
  },
  {
    slug: 'smartphone-camera-sensor-aperture-computational-photography',
    locale: 'zh',
    append: { marker: '### 手机摄像头光圈多大才好？', text: FAQ_CAMERA_ZH },
  },

  // 6. garment-steamer —— 新增 FAQ（命中 steamer or iron）
  {
    slug: 'garment-steamer-vs-iron-fabric-care-guide',
    locale: 'en',
    append: { marker: '### Steamer or iron — which should I buy?', text: FAQ_STEAMER_EN },
  },
  {
    slug: 'garment-steamer-vs-iron-fabric-care-guide',
    locale: 'zh',
    append: { marker: '### 挂烫机还是熨斗，到底买哪个？', text: FAQ_STEAMER_ZH },
  },
]

function clip(s, n = 90) {
  s = String(s).replace(/\n/g, '\\n')
  return s.length > n ? s.slice(0, n) + '…' : s
}

let changed = 0
let skipped = 0
for (const e of EDITS) {
  const { data: rows, error } = await sb
    .from('pitfallfree_guides')
    .select('title, summary, content')
    .eq('slug', e.slug)
    .eq('locale', e.locale)
  if (error) {
    console.error('查询失败', e.slug, e.locale, error.message)
    continue
  }
  if (!rows || !rows.length) {
    console.error(`✗ 未找到记录: ${e.slug} [${e.locale}]`)
    continue
  }
  const row = rows[0]
  const patch = {}
  const log = []

  if (e.title && e.title !== row.title) {
    patch.title = e.title
    log.push(`  title: ${clip(row.title)}\n      →  ${clip(e.title)}`)
  }
  if (e.summary && e.summary !== row.summary) {
    patch.summary = e.summary
    log.push(`  summary 已更新`)
  }

  let content = row.content
  if (e.replaces) {
    for (const [find, repl] of e.replaces) {
      if (content.includes(find)) {
        content = content.replace(find, repl)
        log.push(`  replace: ${clip(find, 60)} → ${clip(repl, 60)}`)
      } else if (content.includes(repl)) {
        // 已应用过，幂等跳过
      } else {
        log.push(`  ⚠️ 未命中(find 与 repl 都不在): ${clip(find, 60)}`)
      }
    }
  }
  if (e.append) {
    if (content.includes(e.append.marker)) {
      // 已追加过，幂等跳过
    } else {
      content += e.append.text
      log.push(`  append FAQ: ${clip(e.append.marker, 60)} (+${e.append.text.length} 字)`)
    }
  }
  if (content !== row.content) patch.content = content

  if (!Object.keys(patch).length) {
    skipped++
    console.log(`= 无变化(已是最新): ${e.slug} [${e.locale}]`)
    continue
  }

  console.log(`\n● ${e.slug} [${e.locale}]`)
  log.forEach((l) => console.log(l))

  if (!DRY) {
    const { error: upErr } = await sb
      .from('pitfallfree_guides')
      .update(patch)
      .eq('slug', e.slug)
      .eq('locale', e.locale)
    if (upErr) {
      console.error('  ✗ 写入失败:', upErr.message)
      continue
    }
    console.log('  ✓ 已写入')
  }
  changed++
}

console.log(`\n${DRY ? '[DRY-RUN] ' : ''}完成：变更 ${changed} 条，跳过 ${skipped} 条。`)
if (DRY) console.log('确认无误后去掉 --dry-run 正式写入。')

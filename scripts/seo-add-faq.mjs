#!/usr/bin/env node
/**
 * seo-add-faq.mjs
 *
 * 给高展示页正文追加「## FAQ / ## 常见问题」段（双语），配合 page.tsx 的 FAQPage
 * 结构化数据生效。问题取自 GSC 真实查询变体，争取 PAA / 精选摘要曝光。
 * 已含 FAQ 段的文章自动跳过，幂等可重复运行。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seo-add-faq.mjs --dry-run
 *   node --env-file=.env.local scripts/seo-add-faq.mjs
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
const HAS_FAQ = /##\s*(FAQ|常见问题|常見問題|Frequently Asked)/i

const faqs = [
  {
    slug: 'portable-air-conditioner-btu-doe-single-dual-hose-guide',
    en: `## FAQ

### What is the difference between BTU and SACC BTU?
The old BTU figure is a lab rating measured without accounting for exhaust heat leaking back into the room, so it overstates real cooling. SACC (Seasonally Adjusted Cooling Capacity), required by the US DOE since 2017, factors in duct heat and infiltration and is typically 15–30% lower. Always compare SACC to SACC, not BTU to SACC.

### How does SACC compare to the ASHRAE rating?
ASHRAE 128 is the old test that produces the inflated "BTU" number; DOE SACC is the newer, realistic standard. A unit advertised as "14,000 BTU (ASHRAE)" often has a SACC of only about 9,000–10,000. The ASHRAE figure is marketing-friendly; SACC predicts real-room performance.

### Is a single-hose or dual-hose portable AC better?
Dual-hose units are more efficient: they draw outside air to cool the compressor and exhaust it separately, avoiding the negative room pressure that makes single-hose units pull hot, unconditioned air in through gaps. Single-hose is cheaper and fine for small, well-sealed rooms; dual-hose is better for larger or leaky spaces.

### How many BTU do I need for my room size?
As a rough guide, plan about 20 SACC BTU per square foot — roughly 8,000 SACC for a 300–400 sq ft room — then add capacity for sunny rooms, kitchens, or high ceilings. Because portable ACs lose efficiency through the exhaust hose, size up rather than down.`,
    zh: `## 常见问题

### BTU 和 SACC BTU 有什么区别？
旧的 BTU 数值是实验室测出的，没有计入排出的热风重新回到房间的影响，因此高估了实际制冷量。SACC（季节调整制冷量）是美国能源部 2017 年起强制的标准，计入了管道热量和空气渗入，通常比旧 BTU 低 15–30%。比较时务必拿 SACC 对 SACC，而不是 BTU 对 SACC。

### SACC 和 ASHRAE 标准怎么对应？
ASHRAE 128 是产生虚高「BTU」数字的旧测试，DOE SACC 是更真实的新标准。标称「14000 BTU（ASHRAE）」的机器，SACC 往往只有约 9000–10000。ASHRAE 数字好看，SACC 才反映真实房间表现。

### 单管和双管移动空调哪个更好？
双管更高效：它从室外取气冷却压缩机并单独排出，避免了单管机造成的房间负压——负压会把没经处理的热空气从缝隙吸进来。单管更便宜，适合密封良好的小房间；双管更适合较大或密封差的空间。

### 我的房间需要多少 BTU？
粗略可按每平方英尺约 20 SACC BTU 估算——约 300–400 平方英尺的房间需要约 8000 SACC——再为西晒房间、厨房或高层高加量。由于移动空调会因排气管损失效率，宁可往大选而不要往小选。`,
  },
  {
    slug: 'tv-oled-vs-qled-vs-miniled-panel-guide',
    en: `## FAQ

### OLED vs QLED vs Mini-LED — which has the best picture quality?
OLED has the best contrast and perfect blacks because each pixel emits its own light and can switch fully off. QLED (a quantum-dot LCD) is brighter and cheaper but can't match OLED's black levels. Mini-LED is a QLED with thousands of tiny backlight zones that narrow the contrast gap and get very bright — best for bright rooms, while OLED wins in dark rooms.

### Is Mini-LED better than OLED?
Not universally. Mini-LED gets brighter and has no burn-in risk, so it's better for very bright rooms and static content like gaming HUDs. OLED still has superior contrast, viewing angles, and motion, so it's better for movies and dark-room viewing.

### Does QLED suffer from burn-in?
No. QLED uses an LCD panel with a quantum-dot layer and an LED backlight, so it is not susceptible to the permanent burn-in that can affect self-emissive OLED panels — a safer pick for very long daily static images.

### Which panel is best for a bright living room?
Mini-LED or QLED, because they reach much higher peak brightness (often 1,500–2,000+ nits) and resist glare better than OLED. OLED is the better pick for controlled, dim lighting.`,
    zh: `## 常见问题

### OLED、QLED、Mini-LED 哪个画质最好？
OLED 对比度最佳、黑色最纯，因为每个像素自发光、可完全关闭。QLED（量子点 LCD）更亮也更便宜，但黑位比不过 OLED。Mini-LED 是带成千上万个背光分区的 QLED，缩小了对比度差距且非常亮——亮房间首选，而暗房间里 OLED 更胜。

### Mini-LED 比 OLED 更好吗？
不绝对。Mini-LED 更亮且无烧屏风险，更适合很亮的房间和静态画面（如游戏 HUD）。OLED 在对比度、可视角度和动态表现上仍占优，更适合看电影和暗室观看。

### QLED 会烧屏吗？
不会。QLED 用的是带量子点层和 LED 背光的 LCD 面板，不存在自发光 OLED 那种永久烧屏风险——长时间显示静态画面更安全。

### 明亮客厅适合哪种面板？
Mini-LED 或 QLED，因为峰值亮度高得多（常达 1500–2000+ 尼特），抗眩光也优于 OLED。OLED 更适合可控的昏暗光线环境。`,
  },
  {
    slug: 'air-purifier-hepa-cadr-room-size-guide',
    en: `## FAQ

### What is a CADR rating?
CADR (Clean Air Delivery Rate) measures how many cubic feet of filtered air a purifier delivers per minute, rated separately for smoke, dust, and pollen. A higher CADR means faster cleaning, and it's the single most useful spec for comparing purifier performance across brands.

### What CADR do I need for my room?
A common rule: the smoke CADR (in CFM) should be at least two-thirds of your room's area in square feet — so a 300 sq ft room wants a smoke CADR around 200. For allergy or wildfire-smoke use, size up to reach 4–5 air changes per hour (ACH).

### Is CADR or HEPA more important?
They measure different things. HEPA describes filter capture efficiency (99.97% at 0.3 microns for True HEPA); CADR describes how much clean air actually reaches the room. You want both — a True HEPA filter and a CADR matched to your room size.`,
    zh: `## 常见问题

### CADR 值是什么？
CADR（洁净空气输出率）衡量净化器每分钟输出多少立方英尺洁净空气，并对烟尘、灰尘、花粉分别评级。CADR 越高净化越快，是跨品牌比较净化性能最有用的单一参数。

### 我的房间需要多大 CADR？
常用经验：烟尘 CADR（CFM）至少应为房间面积（平方英尺）的三分之二——约 300 平方英尺的房间需要约 200 的烟尘 CADR。过敏或应对野火烟尘时应往大选，达到每小时 4–5 次换气（ACH）。

### CADR 和 HEPA 哪个更重要？
两者衡量不同维度。HEPA 描述滤网的捕获效率（真 HEPA 对 0.3 微米达 99.97%）；CADR 描述实际输送到房间的洁净空气量。两者都要——真 HEPA 滤网 + 与房间面积匹配的 CADR。`,
  },
  {
    slug: 'document-scanner-buying-guide',
    en: `## FAQ

### What's the difference between flatbed, sheet-fed, and portable scanners?
Flatbed scanners handle books, photos, and fragile documents with the best quality but are slow for stacks. Sheet-fed scanners with an automatic document feeder (ADF) pull pages through automatically — far faster for paperwork and the best choice for going paperless. Portable scanners trade speed and quality for travel size.

### Do I need a dedicated scanner if my printer already scans?
For occasional scanning, an all-in-one printer is fine. But dedicated document scanners like the Fujitsu ScanSnap are much faster, have reliable auto-document feeders, and include better OCR software — worth it if you scan regularly or want a paperless workflow.

### What is OCR and do I need it?
OCR (Optical Character Recognition) converts scanned images into searchable, editable text. If you want to search your archived documents or copy text out of them, choose a scanner whose bundled software includes OCR — most mid-range document scanners do.`,
    zh: `## 常见问题

### 平板式、馈纸式和便携式扫描仪有什么区别？
平板式扫描书籍、照片和易损文件画质最好，但扫整叠很慢。带自动进纸器（ADF）的馈纸式能自动逐页进纸——处理文档快得多，是无纸化的首选。便携式则以速度和画质换取便携体积。

### 打印机已经能扫描，还需要专用扫描仪吗？
偶尔扫描用一体机就够。但专用文档扫描仪（如富士通 ScanSnap）速度快得多、自动进纸更可靠、附带的 OCR 软件更好——如果你经常扫描或想做无纸化，值得入手。

### OCR 是什么，我需要吗？
OCR（光学字符识别）把扫描图像转成可搜索、可编辑的文字。如果你想检索归档文档或从中复制文字，就选附带 OCR 软件的扫描仪——多数中端文档扫描仪都支持。`,
  },
  {
    slug: 'mechanical-keyboard-switch-guide',
    en: `## FAQ

### What are the main types of mechanical keyboard switches?
They fall into three families: linear (smooth, no bump — e.g. red switches, popular for gaming), tactile (a bump on actuation — e.g. brown switches, good all-rounders for typing), and clicky (tactile plus an audible click — e.g. blue switches, satisfying but loud).

### Which switch is best for typing vs gaming?
For typing, tactile (brown) or clicky (blue) switches give feedback that improves accuracy. For gaming, linear (red) switches are popular because the smooth, fast actuation suits rapid repeated presses. There's no universally best switch — it depends on feel preference and noise tolerance.

### What's the difference between red, brown, and blue switches?
Red is linear and quiet; brown is tactile with a soft bump and moderate noise; blue is clicky and loud. Red suits gaming and shared spaces, brown is a versatile middle ground, and blue is favored by typists who like audible feedback.`,
    zh: `## 常见问题

### 机械键盘轴体主要有哪几类？
分三大家族：线性轴（顺滑无段落感，如红轴，游戏常用）、段落轴（触发时有一个小凸点，如茶轴，打字全能）、点击轴（段落感加清脆声响，如青轴，手感爽但吵）。

### 打字和游戏分别该选什么轴？
打字推荐段落轴（茶轴）或点击轴（青轴），反馈能提升准确性。游戏常用线性轴（红轴），顺滑快速的触发适合快速连按。没有绝对最好的轴，取决于手感偏好和对噪音的容忍度。

### 红轴、茶轴、青轴有什么区别？
红轴线性且安静；茶轴有轻微段落感、噪音中等；青轴有清脆点击声、较吵。红轴适合游戏和共用空间，茶轴是百搭中间项，青轴受喜欢声音反馈的打字党青睐。`,
  },
]

let updated = 0,
  skipped = 0,
  fail = 0
for (const f of faqs) {
  for (const locale of ['en', 'zh']) {
    const { data, error } = await sb
      .from('pitfallfree_guides')
      .select('content')
      .eq('slug', f.slug)
      .eq('locale', locale)
      .single()
    if (error || !data) {
      console.log(`MISS ${locale} ${f.slug}: ${error?.message || '无记录'}`)
      fail++
      continue
    }
    if (HAS_FAQ.test(data.content)) {
      console.log(`skip ${locale} ${f.slug}（已有 FAQ 段）`)
      skipped++
      continue
    }
    const faqMd = locale === 'zh' ? f.zh : f.en
    const newContent = data.content.trimEnd() + '\n\n' + faqMd + '\n'
    if (DRY) {
      console.log(`[dry] ${locale} ${f.slug} 追加 ${faqMd.split('###').length - 1} 个问答`)
      continue
    }
    const { error: upErr } = await sb
      .from('pitfallfree_guides')
      .update({ content: newContent, lastmod: TODAY })
      .eq('slug', f.slug)
      .eq('locale', locale)
    if (upErr) {
      console.log(`ERR ${locale} ${f.slug}: ${upErr.message}`)
      fail++
    } else {
      console.log(`OK  ${locale} ${f.slug}`)
      updated++
    }
  }
}
console.log(`\n完成：更新 ${updated}，跳过 ${skipped}，失败 ${fail}`)

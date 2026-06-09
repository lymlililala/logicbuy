#!/usr/bin/env node
/**
 * seed-portable-ac-cluster.mjs
 *
 * 便携空调 BTU 内容簇（3 篇双语），围绕全站最强页
 * portable-air-conditioner-btu-doe-single-dual-hose-guide 建立主题权威。
 * tags 与主页一致 → 通过 RelatedGuides 自动互链。每篇含 FAQ 段（吃 FAQPage schema）。
 * upsert onConflict 'slug,locale'，幂等可重跑。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-portable-ac-cluster.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-portable-ac-cluster.mjs
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
const DATE = '2026-06-09'
const TAGS = ['home', 'appliances', 'cooling', 'buying-guide', 'home-appliances']
const HUB_EN = '/en/guides/portable-air-conditioner-btu-doe-single-dual-hose-guide'
const HUB_ZH = '/zh/guides/portable-air-conditioner-btu-doe-single-dual-hose-guide'

const articles = [
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'portable-ac-sacc-vs-ashrae-btu-explained',
    en: {
      title: 'SACC vs ASHRAE BTU Explained: Why Portable AC Ratings Don’t Match',
      summary:
        'Portable air conditioners are sold with two very different BTU numbers: the old ASHRAE rating and the DOE SACC rating. This guide explains what each measures, why SACC is 15–30% lower, and how to compare units honestly.',
      content: `# SACC vs ASHRAE BTU Explained: Why Portable AC Ratings Don't Match

If you have shopped for a portable air conditioner, you have probably seen the same unit listed with two different BTU numbers. One is large and prominent; the other is smaller and buried in the spec sheet. They are not a mistake — they come from two different test standards, and understanding the difference is the single most important thing when comparing portable ACs.

## The Two Standards

### ASHRAE 128 (the old number)
ASHRAE 128 measures cooling output under idealized lab conditions that ignore the heat the exhaust hose dumps back near the unit and the warm air pulled into the room to replace exhausted air. The result is an inflated figure that makes the unit look more powerful than it is in a real room.

### DOE SACC (the realistic number)
Since 2017, the US Department of Energy has required portable ACs to publish a **Seasonally Adjusted Cooling Capacity (SACC)**. SACC blends performance across test conditions and accounts for duct heat transfer and infiltration air. It reflects what you will actually feel in the room.

## How Big Is the Gap?

SACC is typically **15–30% lower** than the old ASHRAE number. A unit marketed as "14,000 BTU (ASHRAE)" often carries a SACC of roughly 9,500–10,000 BTU. That is not a defect — it is simply the honest figure. The problem only appears when you compare one brand's ASHRAE number against another brand's SACC number, which makes the comparison meaningless.

## How to Compare Units Honestly

- **Always compare SACC to SACC.** Ignore the big ASHRAE headline number for cross-brand comparison.
- If a listing only shows a large BTU figure and no SACC, assume it is ASHRAE and mentally discount it by about 20%.
- Match the SACC figure — not the ASHRAE figure — to your room size.

For the full picture on single vs dual hose efficiency and matching capacity to your room, see our [main portable air conditioner buying guide](${HUB_EN}).

## FAQ

### What is the difference between BTU and SACC BTU?
The old BTU (ASHRAE) figure is measured without accounting for exhaust heat and infiltration, so it overstates cooling. SACC, required by the DOE since 2017, includes those losses and is typically 15–30% lower — the number that reflects real-room performance.

### Is SACC the same as ASHRAE?
No. ASHRAE 128 is the older, higher lab figure; SACC is the newer DOE standard that is lower and more realistic. The same unit will show a higher ASHRAE number and a lower SACC number.

### Which BTU number should I use to size my room?
Use the SACC number. Plan roughly 20 SACC BTU per square foot, then size up for sunny rooms, kitchens, or high ceilings.`,
    },
    zh: {
      title: 'SACC vs ASHRAE BTU 详解：移动空调两个标称为何对不上',
      summary:
        '移动空调常标两个差很多的 BTU：旧的 ASHRAE 值和 DOE 的 SACC 值。本文讲清两者各测什么、为什么 SACC 低 15–30%，以及如何公平地比较不同机型。',
      content: `# SACC vs ASHRAE BTU 详解：移动空调两个标称为何对不上

如果你选购过移动空调，大概见过同一台机器标着两个不同的 BTU 数字：一个又大又显眼，另一个小小地藏在参数表里。这不是标错，而是来自两套不同的测试标准。看懂它们的区别，是比较移动空调时最重要的一件事。

## 两套标准

### ASHRAE 128（旧数字）
ASHRAE 128 在理想化实验室条件下测制冷量，忽略了排气管在机器附近排出的热量，也忽略了为补充排出空气而被吸进室内的暖空气。结果是一个虚高的数字，让机器看起来比在真实房间里更强。

### DOE SACC（真实数字）
2017 年起，美国能源部要求移动空调标注**季节调整制冷量（SACC）**。SACC 综合了多种测试条件，并计入管道传热和渗入空气，反映你在房间里实际能感受到的效果。

## 差距有多大？

SACC 通常比旧的 ASHRAE 数字**低 15–30%**。标称「14000 BTU（ASHRAE）」的机器，SACC 往往只有约 9500–10000 BTU。这不是缺陷，只是更诚实的数字。问题只在于：拿一个品牌的 ASHRAE 去比另一个品牌的 SACC，比较就完全失去意义。

## 如何公平比较

- **永远拿 SACC 比 SACC。** 跨品牌比较时忽略那个又大又显眼的 ASHRAE 数字。
- 如果商品页只给了一个大 BTU 数而没有 SACC，就当它是 ASHRAE，心里打八折。
- 用 SACC（而非 ASHRAE）去匹配你的房间面积。

关于单管与双管的效率差异、以及如何按房间匹配制冷量，详见我们的[移动空调选购主指南](${HUB_ZH})。

## 常见问题

### BTU 和 SACC BTU 有什么区别？
旧的 BTU（ASHRAE）数字测量时未计入排气热量和渗入空气，因此高估制冷量。SACC 是能源部 2017 年起要求的标准，计入了这些损失，通常低 15–30%——它才反映真实房间表现。

### SACC 和 ASHRAE 是一回事吗？
不是。ASHRAE 128 是较旧、较高的实验室数字；SACC 是较新、较低也更真实的 DOE 标准。同一台机器，ASHRAE 数字更高、SACC 数字更低。

### 选房间时该用哪个 BTU 数字？
用 SACC。按每平方英尺约 20 SACC BTU 估算，再为西晒房间、厨房或高层高往上加。`,
    },
  },
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'portable-ac-single-vs-dual-hose-comparison',
    en: {
      title: 'Single-Hose vs Dual-Hose Portable AC: The Efficiency Difference Explained',
      summary:
        'Single-hose and dual-hose portable ACs cool very differently. This guide explains negative room pressure, why dual-hose is more efficient, and when a single-hose unit is still the right choice.',
      content: `# Single-Hose vs Dual-Hose Portable AC: The Efficiency Difference Explained

Hose configuration is the biggest design difference between portable air conditioners, and it has a larger real-world impact than most BTU numbers. Here is what actually happens inside each type.

## How a Single-Hose Unit Works

A single-hose portable AC pulls air from the room, cools part of it, and uses the rest to cool the compressor before blowing that warm air out the single exhaust hose. The problem: every cubic foot of air sent outside has to be replaced — and it gets replaced by hot, unconditioned air pulled in through door gaps, windows, and cracks. This is called **negative pressure**, and it quietly fights against the cooling you paid for.

## How a Dual-Hose Unit Works

A dual-hose unit uses one hose to draw outside air specifically to cool the compressor and the second hose to exhaust it. Because it does not consume already-cooled room air for the compressor, it creates far less negative pressure and delivers more of its rated capacity to the room. The US Department of Energy's efficiency testing reflects this advantage.

## Which Should You Buy?

- **Choose dual-hose** for larger rooms, leaky/older rooms, hot climates, or whenever efficiency matters most.
- **Single-hose is fine** for small, well-sealed rooms and lower budgets — it is cheaper, lighter, and simpler to set up.
- In a tiny, tightly sealed bedroom the practical difference shrinks; in a large or drafty space it is significant.

Once you have picked a hose type, match the SACC capacity to your room — see our [main portable air conditioner buying guide](${HUB_EN}) and our [BTU-by-room-size chart](/en/guides/portable-ac-btu-room-size-chart).

## FAQ

### Is a single-hose or dual-hose portable AC better?
Dual-hose is more efficient because it cools the compressor with outside air, avoiding the negative room pressure that makes single-hose units draw hot air in through gaps. Single-hose is cheaper and acceptable for small, well-sealed rooms.

### What is negative pressure in a portable AC?
When a single-hose unit exhausts room air outside, that air is replaced by unconditioned outside air leaking in through gaps. This negative pressure reduces effective cooling, especially in larger or leaky rooms.

### Does dual-hose cool faster?
In most real rooms, yes — more of its rated capacity reaches the room because it is not pulling in hot replacement air. The advantage grows with room size and air leakage.`,
    },
    zh: {
      title: '单管 vs 双管移动空调：效率差异到底在哪',
      summary:
        '单管和双管移动空调的制冷方式很不一样。本文讲清房间负压、为什么双管更高效，以及什么情况下单管仍是更合适的选择。',
      content: `# 单管 vs 双管移动空调：效率差异到底在哪

排气管配置是移动空调之间最大的设计差异，对实际效果的影响往往比 BTU 数字还大。下面看看每种类型内部到底发生了什么。

## 单管机怎么工作

单管移动空调从房间抽气，冷却其中一部分，再用其余空气冷却压缩机，然后把这股热空气从唯一的排气管排出室外。问题在于：每排出一立方英尺空气，都得有空气来补充——而补进来的，是从门缝、窗缝、裂隙吸入的没经处理的热空气。这叫**负压**，它在悄悄抵消你花钱买来的制冷。

## 双管机怎么工作

双管机用一根管专门从室外取气来冷却压缩机，用第二根管把它排出。由于不消耗已经制冷过的室内空气来冷却压缩机，它造成的负压小得多，能把更多标称制冷量真正送进房间。美国能源部的能效测试也反映了这一优势。

## 你该买哪种？

- **较大房间、密封差/老旧房间、炎热气候，或最看重效率时，选双管。**
- **小而密封良好的房间、预算有限，单管也够用**——更便宜、更轻、安装更简单。
- 在又小又密封的卧室里，实际差距会缩小；在大或漏风的空间里，差距很明显。

选好排气管类型后，按房间匹配 SACC 制冷量——见我们的[移动空调选购主指南](${HUB_ZH})和[按房间面积选 BTU 对照表](/zh/guides/portable-ac-btu-room-size-chart)。

## 常见问题

### 单管和双管移动空调哪个更好？
双管更高效，因为它用室外空气冷却压缩机，避免了单管机造成的房间负压——负压会把热空气从缝隙吸进来。单管更便宜，对小而密封良好的房间可以接受。

### 移动空调的「负压」是什么？
单管机把室内空气排到室外时，会有未经处理的室外空气从缝隙补进来。这种负压会降低实际制冷效果，在较大或漏风的房间里尤其明显。

### 双管制冷更快吗？
在多数真实房间里是的——它不吸入热的补充空气，更多标称制冷量能到达房间。房间越大、漏风越多，优势越明显。`,
    },
  },
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: 'portable-ac-btu-room-size-chart',
    en: {
      title: 'Portable AC BTU by Room Size: SACC Sizing Chart (sq ft to BTU)',
      summary:
        'How many SACC BTU do you need for your room? This chart maps square footage to recommended portable AC capacity, with adjustments for sun, ceiling height, and kitchens.',
      content: `# Portable AC BTU by Room Size: SACC Sizing Chart

Sizing a portable air conditioner is about matching **SACC** capacity to your room — not the inflated ASHRAE headline number. Undersize and the room never gets comfortable; oversize and the unit short-cycles, leaving the air clammy. Use the chart below as a starting point.

## SACC Sizing Chart

| Room size | Baseline SACC BTU |
|---|---|
| 150 sq ft (small bedroom) | 5,000–6,000 |
| 250 sq ft (bedroom / office) | 7,000–8,000 |
| 350 sq ft (living room) | 8,000–10,000 |
| 450 sq ft (large living room) | 10,000–12,000 |
| 550+ sq ft (open plan) | 12,000–14,000+ |

The rule of thumb is roughly **20 SACC BTU per square foot**, then adjust.

## Adjustments

- **Sunny / west-facing room:** add about 10%.
- **Kitchen or heat-producing equipment:** add about 4,000 BTU.
- **High ceilings (above 8 ft):** add about 10–15%.
- **Heavily shaded room:** subtract about 10%.

## Why You Should Size Up, Not Down

Portable ACs lose real capacity to the exhaust hose and (for single-hose units) to negative pressure. Because the SACC figure already bakes in some of this, but real installations vary, it is safer to round up a tier than to undersize. An undersized unit runs constantly and still loses.

Remember to use the SACC number — see why in our [SACC vs ASHRAE explainer](/en/guides/portable-ac-sacc-vs-ashrae-btu-explained) — and consider [single vs dual hose](/en/guides/portable-ac-single-vs-dual-hose-comparison) before buying. Full context in the [main buying guide](${HUB_EN}).

## FAQ

### How many BTU do I need for a 300 sq ft room?
Around 8,000–9,000 SACC BTU for a standard 300 sq ft room, then add capacity if it is sunny, has high ceilings, or is a kitchen.

### Is it better to oversize or undersize a portable AC?
Round up rather than down. Portable ACs lose efficiency to the exhaust hose, so a slightly larger SACC rating gives margin. Extreme oversizing causes short-cycling and a clammy feel, so move up one tier, not several.

### Does ceiling height affect BTU needs?
Yes. Standard charts assume 8 ft ceilings. For higher ceilings add roughly 10–15% because there is more air volume to cool.`,
    },
    zh: {
      title: '移动空调按房间面积选 BTU：SACC 选型对照表（平方英尺对 BTU）',
      summary:
        '你的房间需要多少 SACC BTU？这张对照表把面积映射到推荐的移动空调制冷量，并给出西晒、层高和厨房的修正。',
      content: `# 移动空调按房间面积选 BTU：SACC 选型对照表

给移动空调选型，关键是把 **SACC** 制冷量匹配到房间——而不是那个虚高的 ASHRAE 标题数字。选小了房间凉不下来；选过大又会频繁启停，空气发闷。下面这张表可作为起点。

## SACC 选型对照表

| 房间面积 | 基准 SACC BTU |
|---|---|
| 150 平方英尺（小卧室） | 5000–6000 |
| 250 平方英尺（卧室/办公室） | 7000–8000 |
| 350 平方英尺（客厅） | 8000–10000 |
| 450 平方英尺（大客厅） | 10000–12000 |
| 550+ 平方英尺（开放式） | 12000–14000+ |

经验法则约为**每平方英尺 20 SACC BTU**，再做修正。

## 修正项

- **西晒/朝西房间：** 加约 10%。
- **厨房或有发热设备：** 加约 4000 BTU。
- **高层高（超过 8 英尺）：** 加约 10–15%。
- **遮阴良好的房间：** 减约 10%。

## 为什么宁可往大选

移动空调会因排气管（单管机还因负压）损失实际制冷量。SACC 数字虽已计入部分损失，但真实安装千差万别，所以往上选一档比选小更稳妥。选小的机器会一直满负荷运转却仍然不够。

记得用 SACC 数字——原因见我们的[SACC vs ASHRAE 详解](/zh/guides/portable-ac-sacc-vs-ashrae-btu-explained)——并在购买前了解[单管与双管的区别](/zh/guides/portable-ac-single-vs-dual-hose-comparison)。完整背景见[选购主指南](${HUB_ZH})。

## 常见问题

### 300 平方英尺的房间需要多少 BTU？
标准 300 平方英尺房间约需 8000–9000 SACC BTU，若西晒、层高高或是厨房则再往上加。

### 移动空调宁可选大还是选小？
宁可往上取整。移动空调会因排气管损失效率，略大的 SACC 留有余量。但过度选大会导致频繁启停、空气发闷，所以往上一档即可，不要跳好几档。

### 层高会影响 BTU 需求吗？
会。标准对照表假设 8 英尺层高。层高更高时加约 10–15%，因为要冷却的空气体积更大。`,
    },
  },
]

let ok = 0,
  fail = 0
for (const a of articles) {
  for (const locale of ['en', 'zh']) {
    const d = a[locale]
    const row = {
      slug: a.slug,
      locale,
      title: d.title,
      summary: d.summary,
      tags: TAGS,
      layout: 'PostLayout',
      authors: ['default'],
      published_at: DATE,
      lastmod: DATE,
      draft: false,
      content: d.content,
    }
    if (DRY) {
      const words = d.content.split(/\s+/).length
      console.log(`[dry] ${locale} ${a.slug}  (~${words} 词)`)
      continue
    }
    const { error } = await sb
      .from('pitfallfree_guides')
      .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'slug,locale' })
    if (error) {
      console.log(`ERR ${locale} ${a.slug}: ${error.message}`)
      fail++
    } else {
      console.log(`OK  ${locale} ${a.slug}`)
      ok++
    }
  }
}
if (!DRY) console.log(`\n完成：成功 ${ok}，失败 ${fail}`)

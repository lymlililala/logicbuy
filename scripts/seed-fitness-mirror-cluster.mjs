#!/usr/bin/env node
/**
 * seed-fitness-mirror-cluster.mjs
 *
 * 健身镜内容簇（3 篇双语），围绕主文 fitness-mirror-smart-home-gym 建主题权威。
 * GSC 信号：fitness mirror / fitness mirrors / workout mirror / workout mirrors 多变体、
 * 115 展示但排名靠后。tags 与主文一致 → RelatedGuides 自动互链。每篇含 FAQ。
 * upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-fitness-mirror-cluster.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-fitness-mirror-cluster.mjs
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
// 与主文 fitness-mirror-smart-home-gym 一致，触发 RelatedGuides 互链
const TAGS = ['健身', '家庭健身房', '智能家居', '选购指南', 'outdoors-fitness']
const HUB_EN = '/en/guides/fitness-mirror-smart-home-gym'
const HUB_ZH = '/zh/guides/fitness-mirror-smart-home-gym'

const articles = [
  {
    slug: 'fitness-mirror-vs-tablet-traditional-worth-it',
    en: {
      title: 'Is a Fitness Mirror Worth It? Mirror vs Tablet vs Gym Compared',
      summary:
        'A fitness mirror looks futuristic, but is it worth the price and subscription? This guide compares fitness mirrors to a tablet-and-app setup and a gym membership, and explains who actually benefits.',
      content: `# Is a Fitness Mirror Worth It? Mirror vs Tablet vs Gym

A fitness mirror is essentially a wall-mounted display behind a reflective panel, paired with a streaming class subscription. It looks impressive, but most of what it does can be replicated more cheaply — so the real question is whether the experience justifies the cost.

## What You're Actually Paying For

A fitness mirror bundles three things: the hardware (a large screen and often a camera), a content subscription (live and on-demand classes), and the "mirror" experience (watching your form next to the instructor). The hardware is a one-time cost; the subscription is ongoing and is where the long-term spend lives.

## Fitness Mirror vs Tablet + App

A tablet on a stand running the same style of class app costs a fraction of a fitness mirror and plays the same workouts. What you lose is screen size, the side-by-side mirror reflection, and (on some models) real-time form tracking via the built-in camera. For many people a tablet is 80% of the experience at 10% of the price.

## Fitness Mirror vs Gym

A gym offers heavy equipment, variety, and no living-room footprint, but requires travel and a recurring membership. A fitness mirror wins on convenience and privacy and loses on equipment range. It suits people who value working out at home and will actually use the classes.

## Who It's Actually Worth It For

- **Worth it:** you have the budget, limited time to travel, value guided classes, and will use it several times a week.
- **Skip it:** you mostly lift heavy, prefer free YouTube workouts, or aren't sure you'll stick with subscription classes.

If you decide a mirror fits, see our [fitness mirror & smart home gym guide](${HUB_EN}) for what to check, and our [how to choose a smart fitness mirror](/en/guides/smart-fitness-mirror-how-to-choose-specs) spec breakdown.

## FAQ

### Is a fitness mirror worth the money?
It's worth it if you'll use the guided classes several times a week, value working out at home, and can absorb the subscription cost. If you mostly lift heavy or prefer free workout videos, a tablet-and-app setup gives most of the benefit for far less.

### What's the difference between a fitness mirror and a tablet workout app?
Both stream classes, but a fitness mirror adds a large screen, a reflective panel to check your form beside the instructor, and sometimes a camera for real-time feedback. A tablet is much cheaper but smaller and usually without form tracking.

### Do fitness mirrors require a subscription?
Most do. The hardware is a one-time cost, but live and on-demand classes require an ongoing monthly subscription — factor this into the true cost before buying.`,
    },
    zh: {
      title: '健身镜值得买吗？健身镜 vs 平板 vs 健身房对比',
      summary:
        '健身镜看着很高级，但贵价加订阅到底值不值？本文把健身镜与「平板+App」方案、健身房会员做对比，讲清楚到底哪类人真正适合。',
      content: `# 健身镜值得买吗？健身镜 vs 平板 vs 健身房

健身镜本质上是一块挂墙显示屏 + 反光面板，再配一个流媒体课程订阅。它看起来很惊艳，但它做的大部分事情都能用更便宜的方式实现——所以真正的问题是：体验是否对得起价格。

## 你花的钱买的是什么

健身镜捆绑了三样东西：硬件（大屏，常带摄像头）、内容订阅（直播和点播课程）、以及「镜子」体验（在教练旁边看自己的动作）。硬件是一次性成本；订阅是持续支出，也是长期花费的大头。

## 健身镜 vs 平板 + App

把一台平板放在支架上、运行同类课程 App，花费只是健身镜的零头，却能放同样的课。你失去的是屏幕尺寸、并排的镜面反射、以及（部分型号的）摄像头实时动作追踪。对很多人来说，平板能以 10% 的价格提供 80% 的体验。

## 健身镜 vs 健身房

健身房有大型器械、种类丰富、不占客厅空间，但要通勤、要交会员费。健身镜赢在便利和私密，输在器械种类。它适合看重在家锻炼、且真的会用课程的人。

## 到底哪类人适合

- **适合：** 预算充足、没时间通勤、看重有人带练的课程、每周会用好几次。
- **跳过：** 主要练大重量、偏好免费的 YouTube 健身视频、或不确定能坚持订阅课程。

如果你决定健身镜适合自己，看我们的[健身镜与智能家庭健身系统指南](${HUB_ZH})了解要确认哪些点，以及[智能健身镜怎么选](/zh/guides/smart-fitness-mirror-how-to-choose-specs)的参数拆解。

## 常见问题

### 健身镜值得花这个钱吗？
如果你每周会用好几次有人带练的课程、看重在家锻炼、且能承担订阅费，就值得。如果你主要练大重量或偏好免费健身视频，「平板+App」方案能以低得多的成本提供大部分价值。

### 健身镜和平板健身 App 有什么区别？
两者都放课程，但健身镜多了大屏、能在教练旁边看自己动作的反光面板、以及部分型号的摄像头实时反馈。平板便宜得多，但屏幕小、通常没有动作追踪。

### 健身镜需要订阅吗？
多数需要。硬件是一次性花费，但直播和点播课程需要持续的月度订阅——购买前要把这笔费用算进真实成本。`,
    },
  },
  {
    slug: 'smart-fitness-mirror-how-to-choose-specs',
    en: {
      title: 'How to Choose a Smart Fitness Mirror: Screen, Camera, Classes & Cost',
      summary:
        'Not all fitness mirrors are equal. This guide breaks down the specs that matter — screen size and resolution, camera and form tracking, class library, subscription cost, and installation — so you pick the right one.',
      content: `# How to Choose a Smart Fitness Mirror

Once you've decided a fitness mirror fits your routine, the models vary more than the marketing suggests. Here are the specs that actually determine day-to-day satisfaction.

## Screen Size and Resolution

A larger, higher-resolution screen makes following classes easier, especially for floor work where you're looking up from a mat. Check the viewing angle too — you need a clear image whether standing or on the ground.

## Camera and Form Tracking

Some mirrors include a camera for real-time form feedback and rep counting; others are display-only. A camera adds genuine coaching value but raises privacy considerations — look for a physical shutter or disconnect option.

## Class Library and Live vs On-Demand

The content is the product. Check the range (strength, cardio, yoga, mobility), how often new classes drop, and whether live classes are included. A mirror with a thin or stagnant library gets boring fast.

## Subscription Cost — the Real Long-Term Spend

The monthly subscription often costs more over two years than the hardware itself. Compare subscription prices, whether multiple household members are included, and whether the mirror is usable at all without a subscription.

## Audio, Space and Installation

Built-in speakers vary widely; some need a soundbar. Confirm wall-mount vs freestanding, the footprint, and whether you have clear floor space in front for the full range of movements.

For whether a mirror is worth it at all, see our [fitness mirror vs tablet vs gym comparison](/en/guides/fitness-mirror-vs-tablet-traditional-worth-it); for the broader setup, the [smart home gym guide](${HUB_EN}).

## FAQ

### What specs matter most when choosing a fitness mirror?
Screen size and resolution, whether it has a camera for form tracking, the class library quality, and the subscription cost. The subscription is the biggest long-term expense, so weigh it heavily.

### Do I need a fitness mirror with a camera?
A camera enables real-time form feedback and rep counting, which adds real coaching value. If you want guidance on technique it's worth it; if you only follow along with classes, a display-only mirror is cheaper. Check for a privacy shutter.

### How much does a fitness mirror subscription cost over time?
It varies by brand, but over two years the subscription frequently exceeds the hardware price. Always calculate hardware plus 24 months of subscription to see the true cost.`,
    },
    zh: {
      title: '智能健身镜怎么选：屏幕、摄像头、课程与成本',
      summary:
        '健身镜并非都一样。本文拆解真正重要的参数——屏幕尺寸与分辨率、摄像头与动作追踪、课程库、订阅成本、安装方式，帮你选对那一台。',
      content: `# 智能健身镜怎么选

一旦你确定健身镜适合自己的习惯，各型号的差别其实比宣传说的更大。下面是真正决定日常满意度的参数。

## 屏幕尺寸与分辨率

更大、更高分辨率的屏幕让跟课更轻松，尤其是垫上动作时你要从地面抬头看。也要看可视角度——无论站着还是趴在地上都得看清画面。

## 摄像头与动作追踪

部分镜子带摄像头，提供实时动作反馈和计数；有的只是显示屏。摄像头带来真正的教练价值，但涉及隐私——找有物理挡板或可断开选项的型号。

## 课程库与直播 vs 点播

内容才是产品本身。看课程种类（力量、有氧、瑜伽、灵活性）、更新频率、是否含直播课。课程库单薄或长期不更新的镜子，很快就会让人腻。

## 订阅成本——真正的长期支出

两年算下来，月度订阅往往比硬件本身还贵。对比订阅价、是否含多个家庭成员、以及不订阅时镜子是否还能用。

## 音响、空间与安装

内置扬声器差别很大，有的需要外接音箱。确认是挂墙还是落地、占地面积、以及面前是否有足够空地做全幅度动作。

健身镜到底值不值，看我们的[健身镜 vs 平板 vs 健身房对比](/zh/guides/fitness-mirror-vs-tablet-traditional-worth-it)；整体搭建看[智能家庭健身指南](${HUB_ZH})。

## 常见问题

### 选健身镜最该看哪些参数？
屏幕尺寸与分辨率、是否带动作追踪摄像头、课程库质量、以及订阅成本。订阅是最大的长期支出，要重点权衡。

### 健身镜一定要带摄像头吗？
摄像头能提供实时动作反馈和计数，有真正的教练价值。如果你想要动作指导，值得；如果只是跟着课程做，纯显示屏更便宜。注意挑有隐私挡板的。

### 健身镜订阅长期要花多少？
因品牌而异，但两年下来订阅常常超过硬件价格。务必把硬件加 24 个月订阅一起算，才看得到真实成本。`,
    },
  },
  {
    slug: 'small-home-gym-setup-guide',
    en: {
      title: 'Small Home Gym Setup: How to Build One in Limited Space',
      summary:
        'You don’t need a spare room to train at home. This guide covers planning a small home gym — essential equipment, where a fitness mirror fits, flooring, and how to budget for a compact but complete setup.',
      content: `# Small Home Gym Setup in Limited Space

A complete home gym doesn't require a garage. With smart choices, a corner of a room or a few square meters is enough for effective strength and cardio training.

## Plan the Space First

Measure the floor area you can dedicate, including clearance for full-range movements (overhead presses, jumping, floor work). Vertical and wall space matters too — wall-mounted equipment frees up the floor.

## Essential Equipment for a Small Footprint

Prioritize versatile, compact gear: adjustable dumbbells (replacing a whole rack), a quality mat, resistance bands, and one cardio or guided-training centerpiece. Avoid bulky single-purpose machines unless you'll use them often.

## Where a Fitness Mirror Fits

A wall-mounted fitness mirror is ideal for small spaces because it adds guided classes and form feedback without any floor footprint — it doubles as a normal mirror when off. It pairs well with adjustable dumbbells and a mat for a complete compact setup. See our [smart fitness mirror spec guide](/en/guides/smart-fitness-mirror-how-to-choose-specs).

## Flooring and Protection

Rubber tiles or a thick mat protect your floor, reduce noise (important in apartments), and improve stability. This is easy to overlook but matters for both safety and downstairs neighbors.

## Budgeting a Compact Setup

Spend on the pieces you'll use most — usually adjustable dumbbells and your training centerpiece — and economize on accessories. A focused small gym you actually use beats a large one that collects dust.

For whether a mirror belongs in your setup, see [is a fitness mirror worth it](/en/guides/fitness-mirror-vs-tablet-traditional-worth-it) and the [smart home gym guide](${HUB_EN}).

## FAQ

### What equipment do I need for a small home gym?
Prioritize versatile, compact gear: adjustable dumbbells, a quality mat, resistance bands, and one cardio or guided-training centerpiece such as a fitness mirror. Avoid bulky single-purpose machines unless you'll use them regularly.

### Is a fitness mirror good for a small space?
Yes — a wall-mounted fitness mirror adds guided classes and form feedback with zero floor footprint and doubles as a normal mirror when off, making it well suited to compact home gyms.

### What flooring should I use for a home gym?
Rubber tiles or a thick exercise mat protect the floor, reduce noise (important in apartments), and improve stability during lifts and floor work.`,
    },
    zh: {
      title: '小户型家庭健身房怎么搭：有限空间也能练全',
      summary:
        '在家锻炼不需要一整间空房。本文讲小户型家庭健身房的规划——必备器械、健身镜的位置、地垫地面、以及如何在紧凑预算内搭出完整一套。',
      content: `# 小户型家庭健身房怎么搭

完整的家庭健身房不需要车库。选对装备，房间一角或几平方米就足以进行有效的力量和有氧训练。

## 先规划空间

量出你能腾出的地面面积，包括做全幅度动作（过头推举、跳跃、垫上动作）的余量。垂直和墙面空间也重要——挂墙器械能解放地面。

## 小空间的必备器械

优先选多用途、紧凑的装备：可调哑铃（替代一整排哑铃架）、一块好垫子、弹力带，以及一件有氧或带练核心设备。除非你会经常用，否则别买笨重的单一用途器械。

## 健身镜放哪

挂墙健身镜非常适合小空间，因为它在不占地面的前提下加入带练课程和动作反馈——关机时还能当普通镜子用。它和可调哑铃、垫子搭配，就是一套完整的紧凑配置。见我们的[智能健身镜参数指南](/zh/guides/smart-fitness-mirror-how-to-choose-specs)。

## 地面与保护

橡胶地垫或厚垫子能保护地板、降低噪音（公寓尤其重要）、提升稳定性。这点容易忽略，但对安全和楼下邻居都重要。

## 紧凑配置的预算分配

把钱花在最常用的部件上——通常是可调哑铃和你的核心训练设备——配件上省着来。一套你真的会用的小健身房，胜过一套积灰的大的。

健身镜是否该进你的配置，见[健身镜值得买吗](/zh/guides/fitness-mirror-vs-tablet-traditional-worth-it)和[智能家庭健身指南](${HUB_ZH})。

## 常见问题

### 小户型家庭健身房需要哪些器械？
优先多用途、紧凑的装备：可调哑铃、好垫子、弹力带，以及一件有氧或带练核心设备（如健身镜）。除非会经常用，否则别买笨重的单一用途器械。

### 健身镜适合小空间吗？
适合——挂墙健身镜零占地就能加入带练课程和动作反馈，关机时还能当普通镜子，很适合紧凑的家庭健身房。

### 家庭健身房该用什么地面？
橡胶地垫或厚运动垫能保护地板、降噪（公寓重要）、并在举重和垫上动作时提升稳定性。`,
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
      console.log(`[dry] ${locale} ${a.slug}`)
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

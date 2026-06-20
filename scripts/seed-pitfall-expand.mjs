#!/usr/bin/env node
/**
 * seed-pitfall-expand.mjs
 *
 * 「踩坑指南」专栏第二批：6 个新品类的"常见错误"角度（双语），扩 /pitfalls 专栏。
 * 与现有 *-buying-guide（讲该买什么）区隔，本专栏讲"别犯什么错"。
 * - tags 带 'pitfall-guide'（专栏归集 + 专栏内互链）+ 父文子类/大类 tag（自动互链）。
 * - 每篇含 ## FAQ / ## 常见问题（→ FAQPage schema）+ 选购前核对清单 + 内链父文。
 * - 正文含 2 个 ![alt](IMG: 关键词) 占位，upsert 前用 Pexels 解析为真实图（双语共图）。
 * - 全程无品牌名，纯参数 / 规格 / 原理。upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-pitfall-expand.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-pitfall-expand.mjs
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
const DATE = '2026-06-20'
const COLUMN_TAG = 'pitfall-guide'

const articles = [
  // ───────────────────────── 1. 电视 ─────────────────────────
  {
    slug: 'tv-buying-mistakes',
    tags: [
      COLUMN_TAG,
      'tvs',
      'televisions',
      'home-entertainment',
      'display-panels',
      'tech-electronics',
      'buying-guide',
    ],
    en: {
      title: `7 TV Buying Mistakes: Why "4K" and "HDR" Stickers Don't Mean a Good Picture`,
      summary: `A bright showroom, a meaningless "HDR" badge, and the wrong size for your room are how most TV regret starts. Here are the panel, brightness, and feature mistakes that actually decide picture quality.`,
      content: `# 7 TV Buying Mistakes: Why "4K" and "HDR" Stickers Don't Mean a Good Picture

Almost every TV today is "4K" and wears an "HDR" badge, so those words tell you almost nothing. The picture you'll actually live with is decided by panel technology, real brightness, and how the set handles motion and viewing angle — none of which are on the headline sticker.

![A flat-screen television mounted in a living room](IMG: flat screen television living room)

## Why the Showroom Is Designed to Fool You

Showrooms run TVs in a blazing "vivid" mode under bright lights, which flatters cheap panels and hides their weaknesses. The traits that matter at home — black levels in a dim room, brightness for a sunny one, color accuracy in a normal mode — are exactly what the showroom masks.

### Mistake 1: Trusting the "HDR" badge
HDR is only as good as the brightness and local dimming behind it. A panel that peaks at low nits with no dimming zones carries the same "HDR" label as a great one, but can look worse with HDR on than off. Look at **peak brightness and the number of dimming zones**, not the badge.

### Mistake 2: Ignoring panel technology and your room's light
OLED gives perfect blacks and wide viewing angles but lower peak brightness — superb in a dark room, weaker in a bright one. LED/QLED (LCD) gets brighter for sunny rooms but blacks depend on dimming. Mini-LED packs many dimming zones into LCD for deep blacks at high brightness. Match the panel to **your room's light**, not to the brand. See our [TV panel guide: OLED vs QLED vs Mini-LED](/en/guides/tv-oled-vs-qled-vs-miniled-panel-guide).

### Mistake 3: Buying the wrong size for your viewing distance
People almost always under-buy size. For 4K, you can sit closer than you think; a too-small screen wastes the resolution. Use your **seating distance** to pick the size, and when torn, size up. See [TV buying guide: Mini-LED & OLED](/en/guides/tv-buying-guide-miniled-oled).

### Mistake 4: Overlooking motion handling and refresh rate
A native **120Hz** panel with good motion processing matters for sports and gaming; many budget sets are 60Hz dressed up with "motion" marketing numbers. For console gaming, also check for **VRR and a low input-lag game mode** — and the right HDMI version to carry it.

### Mistake 5: Assuming the built-in speakers are fine
Thin TVs have no room for real speakers, so dialogue gets lost and bass is absent. Budget for a soundbar from the start rather than discovering the problem after install. See our [home audio & theater buying guide](/en/guides/home-audio-theater-buying-guide).

### Mistake 6: Forgetting viewing angle for a wide room
On many LCD panels, color and contrast wash out badly when you sit off to the side. If your seating is spread across a wide room, viewing angle (an OLED/IPS strength) matters more than a headline contrast number.

### Mistake 7: Paying for "8K" or gimmick features
There's almost no 8K content, so 8K mostly buys you a higher price today. Spend on a better panel, brightness, and dimming at 4K instead of a resolution you can't feed.

## Quick Pre-Purchase Checklist

- Peak brightness and dimming zones, not the "HDR" badge
- Panel type (OLED / QLED / Mini-LED) matched to your room's light
- Size chosen from your seating distance — when unsure, size up
- Native 120Hz + VRR + low-lag game mode if you game
- Budget for a soundbar; built-in speakers are an afterthought
- Viewing angle if seating is spread wide
- Skip 8K until there's content to watch on it

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Does an "HDR" label mean a TV has good HDR?
No. HDR quality depends on peak brightness and local dimming zones behind the label. A dim panel with no dimming carries the same "HDR" badge as an excellent one and can look worse with HDR enabled than with it off. Check the peak nits and dimming-zone count instead of the badge.

### Which TV panel type is best for a bright room?
A bright room favors LED/QLED or Mini-LED, which reach higher peak brightness to fight glare. OLED has perfect blacks and the best viewing angles but lower peak brightness, so it shines in darker rooms. Match the panel to your room's lighting rather than to a brand.

### What size TV should I buy?
Pick size from your seating distance — with 4K you can sit closer than older guidance suggested, so most people under-buy. A screen that's too small wastes the resolution. When you're torn between two sizes, choosing the larger one is the more common path to satisfaction.`,
    },
    zh: {
      title: `电视选购的 7 个误区：为什么"4K""HDR"标贴不代表好画质`,
      summary: `明亮的展厅、毫无意义的"HDR"徽标、对房间选错尺寸，是电视后悔的起点。本文讲清真正决定画质的面板、亮度与功能误区。`,
      content: `# 电视选购的 7 个误区：为什么"4K""HDR"标贴不代表好画质

如今几乎每台电视都是"4K"、都贴着"HDR"徽标，所以这些词几乎说明不了什么。你在家真正要面对的画质，由面板技术、真实亮度、以及它如何处理运动和可视角度决定——而这些都不在标题标贴上。

![客厅里壁挂的平板电视](IMG: flat screen television living room)

## 为什么展厅就是设计来骗你的

展厅让电视在刺眼的灯光下跑最亮的"鲜艳"模式，这会美化廉价面板、掩盖它们的弱点。真正在家重要的特性——暗房里的黑位、亮房里的亮度、普通模式下的色准——恰恰是展厅掩盖掉的。

### 误区一：相信"HDR"徽标
HDR 的好坏取决于它背后的亮度和局部调光。一块峰值亮度很低、没有调光分区的面板，和一块出色的面板贴着同样的"HDR"标，却可能开 HDR 比不开还难看。要看**峰值亮度和调光分区数量**，而非徽标。

### 误区二：忽略面板技术与你房间的光线
OLED 黑位纯净、可视角度宽，但峰值亮度较低——暗房里极佳，亮房里偏弱。LED/QLED（LCD）更亮、适合亮房，但黑位取决于调光。Mini-LED 在 LCD 里塞进大量调光分区，能在高亮度下实现深黑。按**你房间的光线**选面板，而非按品牌。见我们的[电视面板解析：OLED vs QLED vs Mini-LED](/zh/guides/tv-oled-vs-qled-vs-miniled-panel-guide)。

### 误区三：为观看距离选错尺寸
人们几乎总是买小了。4K 下你能坐得比想象中更近；屏幕太小就浪费了分辨率。用你的**观看距离**来定尺寸，纠结时就买大一号。见[电视选购指南：Mini-LED 与 OLED](/zh/guides/tv-buying-guide-miniled-oled)。

### 误区四：忽视运动处理与刷新率
原生 **120Hz** 面板加好的运动处理，对体育和游戏很重要；很多低价机型是 60Hz，靠"运动"营销数字装点。主机游戏还要看 **VRR 和低输入延迟的游戏模式**，以及能承载它的 HDMI 版本。

### 误区五：以为内置扬声器够用
薄电视放不下像样的扬声器，于是人声糊、低音缺失。一开始就把回音壁预算算进去，别等装好才发现问题。见我们的[家庭影音选购指南](/zh/guides/home-audio-theater-buying-guide)。

### 误区六：宽房间忘了可视角度
很多 LCD 面板在你侧坐时色彩和对比会严重发白。如果你的座位横跨一个宽房间，可视角度（OLED/IPS 的强项）比标题上的对比度数字更重要。

### 误区七：为"8K"或噱头功能买单
几乎没有 8K 片源，所以 8K 现在多半只是让你多花钱。把钱花在更好的 4K 面板、亮度和调光上，而非一个你喂不动的分辨率。

## 选购前快速核对清单

- 看峰值亮度和调光分区，而非"HDR"徽标
- 面板类型（OLED / QLED / Mini-LED）匹配你房间的光线
- 用观看距离定尺寸——纠结就买大一号
- 打游戏就看原生 120Hz + VRR + 低延迟游戏模式
- 把回音壁预算算进去；内置扬声器是事后补救
- 座位横跨宽房间就看可视角度
- 在有片源前别为 8K 买单

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 贴了"HDR"标的电视就有好 HDR 吗？
不是。HDR 的好坏取决于标签背后的峰值亮度和局部调光分区。一块没有调光的暗面板，和一块出色面板贴着同样的"HDR"标，开 HDR 可能比不开还难看。要看峰值亮度（nits）和调光分区数，而非徽标。

### 亮房间适合哪种电视面板？
亮房间更适合 LED/QLED 或 Mini-LED，它们峰值亮度更高、能对抗眩光。OLED 黑位纯净、可视角度最好，但峰值亮度较低，更适合较暗的房间。按你房间的光线选面板，而非按品牌。

### 该买多大尺寸的电视？
按观看距离选尺寸——4K 下你能坐得比旧建议更近，所以多数人都买小了。屏幕太小会浪费分辨率。在两个尺寸间纠结时，选大的那个通常更让人满意。`,
    },
  },

  // ───────────────────────── 2. 洗碗机 ─────────────────────────
  {
    slug: 'dishwasher-buying-mistakes',
    tags: [COLUMN_TAG, 'dishwasher', 'kitchen', 'appliances', 'home-appliances', 'buying-guide'],
    en: {
      title: `6 Dishwasher Buying Mistakes: Capacity, Drying & the Install You Forgot`,
      summary: `The wrong place setting count, a dishwasher that won't dry plastics, and an install your kitchen can't take are the classic regrets. Here are the spec and fit mistakes to avoid.`,
      content: `# 6 Dishwasher Buying Mistakes: Capacity, Drying & the Install You Forgot

A dishwasher is half appliance, half plumbing project. Most regret comes from picking the wrong size for your dishes, ignoring how (or whether) it dries, and discovering too late that your kitchen can't accommodate the install.

![An open dishwasher loaded with clean dishes](IMG: open dishwasher kitchen dishes)

## Why the Headline Numbers Hide the Real Decision

"Place settings" and decibels look comparable on paper, but a tall-tub model holds awkward pots a slim one can't, and a quiet rating means nothing if the drying method leaves plastics wet. The decision lives in capacity layout, drying technology, and the physical install — not the front-panel spec.

### Mistake 1: Choosing by place-setting count alone
A place-setting number assumes standard plates. Your real load is pots, bowls, and oddly shaped items. Look at the **rack flexibility** — adjustable or foldable tines, a height-adjustable upper rack, a third cutlery tray — which decides what actually fits far more than the headline count.

### Mistake 2: Ignoring the drying technology
Cheaper condensation drying struggles with plastics and can leave puddles. Look for **heated drying or a mineral (zeolite) / fan-assisted system** if dry dishes straight from the cycle matter to you. This is the single most common post-purchase complaint.

### Mistake 3: Forgetting to measure the install — including water and power
Built-in models need a cabinet opening of the right width and height, plus a water inlet, drain, and power within reach. Many kitchens lack the plumbing for a built-in, which is why a **countertop or freestanding** unit may be the realistic choice. Measure before you fall in love with a model.

### Mistake 4: Over-indexing on the quietest decibel number
Quiet is nice, but past a reasonable level the difference is small, and chasing the lowest dB often means paying for a premium tier. Weigh it against capacity and drying, which you'll notice every single load.

### Mistake 5: Overlooking cycle length and running cost
The most efficient "eco" cycles can run for hours. If you expect a quick turnaround, check the **normal cycle time**, not just the eco rating. Also factor water and energy use over years, plus detergent and rinse-aid as ongoing costs.

### Mistake 6: Skipping filter type and maintenance
Self-cleaning grinder filters are convenient but louder; manual filters are quieter but you must clean them regularly or performance drops and odors build. Know which you're buying and whether you'll keep up with it.

## Quick Pre-Purchase Checklist

- Rack flexibility (adjustable tines, third tray) over raw place-setting count
- Drying technology that handles plastics, if dry-from-cycle matters
- Install measured: cabinet size, water inlet, drain, and power
- Decibel rating weighed against capacity and drying, not maximized alone
- Normal cycle time, not just the eco rating
- Filter type and a maintenance habit you'll actually keep

Browse other categories in the [pitfall guides column](/en/pitfalls), or start with the [dishwasher buying guide](/en/guides/dishwasher-buying-guide).

## FAQ

### Are dishwasher "place settings" a reliable capacity measure?
Only loosely. A place-setting count assumes standard plates, but your real loads include pots, bowls, and odd shapes. Rack flexibility — adjustable or foldable tines, a height-adjustable upper rack, a third cutlery tray — determines what actually fits far more than the headline number.

### Why does my dishwasher leave plastics wet?
Because of the drying method. Budget condensation drying struggles to dry lightweight plastics and can leave puddles. If dry dishes straight from the cycle matter, look for heated drying or a mineral (zeolite) or fan-assisted drying system. It's the most common post-purchase complaint.

### Do I need a built-in dishwasher or a freestanding one?
It depends on your kitchen's plumbing and cabinetry. Built-in models need a correctly sized cabinet opening plus a water inlet, drain, and power within reach. Many kitchens lack that, making a countertop or freestanding unit the realistic choice. Measure and check utilities before deciding.`,
    },
    zh: {
      title: `洗碗机选购的 6 个误区：容量、烘干，和你忘了的安装`,
      summary: `套数选错、塑料件烘不干、厨房装不下，是洗碗机的经典后悔。本文讲清该避开的参数与适配误区。`,
      content: `# 洗碗机选购的 6 个误区：容量、烘干，和你忘了的安装

洗碗机一半是家电、一半是水电工程。后悔大多来自：为自家餐具选错尺寸、忽略它怎么烘干（或会不会烘干）、以及太晚才发现厨房装不下。

![打开的洗碗机里摆满洗净的餐具](IMG: open dishwasher kitchen dishes)

## 为什么标题数字藏住了真正的决策

"套数"和分贝在纸面上看着可比，但高深内腔能放下纤薄机型放不下的笨重锅具，而再低的噪音，若烘干方式让塑料件湿漉漉也毫无意义。决策在于容量布局、烘干技术和物理安装——而非前面板的参数。

### 误区一：只按套数挑
套数默认的是标准盘子。你真实的负载是锅、碗和各种异形件。要看**碗篮灵活度**——可调或可折叠的支架、可升降的上篮、独立餐具托盘——它决定什么真能装下，远比标题套数重要。

### 误区二：忽略烘干技术
便宜的冷凝烘干对塑料件吃力，可能留下积水。如果你在意洗完即干，就找**热风烘干或矿物（沸石）/ 风机辅助系统**。这是购买后最常见的抱怨。

### 误区三：忘了量安装——包括上下水和电源
嵌入式机型需要合适宽高的橱柜开口，外加够得着的进水、排水和电源。很多厨房没有嵌入式的水路，这正是**台式或独立式**可能更现实的原因。在爱上某个型号前先量好。

### 误区四：过度纠结最低分贝
安静是好事，但过了合理水平差别很小，而追最低分贝往往意味着为高端档买单。把它和容量、烘干权衡——后两者你每一缸都会感受到。

### 误区五：忽视洗涤时长和使用成本
最省的"节能"程序可能要跑好几个小时。如果你期待快速周转，就看**标准程序时长**，而非只看节能评级。还要算上多年的水电用量，以及洗涤块和亮碟剂这些持续开销。

### 误区六：跳过滤网类型与维护
自清洁研磨滤网方便但更吵；手动滤网更安静，但你必须定期清洗，否则性能下降、产生异味。要清楚你买的是哪种、以及你会不会坚持维护。

## 选购前快速核对清单

- 看碗篮灵活度（可调支架、第三托盘），而非纯套数
- 在意洗完即干，就看能处理塑料件的烘干技术
- 量好安装：橱柜尺寸、进水、排水、电源
- 分贝与容量、烘干权衡，而非单独最大化
- 看标准程序时长，而非只看节能评级
- 滤网类型，和你真能坚持的维护习惯

其他品类见[踩坑指南专栏](/zh/pitfalls)，或从[洗碗机选购指南](/zh/guides/dishwasher-buying-guide)开始。

## 常见问题

### 洗碗机的"套数"是可靠的容量衡量吗？
只是大致。套数默认的是标准盘子，但你真实的负载包括锅、碗和异形件。碗篮灵活度——可调或可折叠支架、可升降上篮、独立餐具托盘——决定什么真能装下，远比标题数字重要。

### 为什么我的洗碗机塑料件总是湿的？
因为烘干方式。低价冷凝烘干很难烘干轻质塑料，可能留下积水。如果在意洗完即干，就找热风烘干或矿物（沸石）/ 风机辅助烘干系统。这是购买后最常见的抱怨。

### 我该买嵌入式还是独立式洗碗机？
取决于你厨房的水路和橱柜。嵌入式需要尺寸合适的橱柜开口，外加够得着的进水、排水和电源。很多厨房没有这些，台式或独立式就成了更现实的选择。决定前先量尺寸、查水电。`,
    },
  },

  // ───────────────────────── 3. 吸尘器 ─────────────────────────
  {
    slug: 'vacuum-cleaner-buying-mistakes',
    tags: [
      COLUMN_TAG,
      'vacuum-cleaners',
      'cleaning',
      'home-appliance',
      'home-appliances',
      'buying-guide',
    ],
    en: {
      title: `6 Vacuum Cleaner Buying Mistakes: Why Suction Watts Aren't the Whole Story`,
      summary: `Wattage on the box, a battery that dies mid-clean, and a filter that leaks dust back into the air are common vacuum mistakes. Here's what actually decides how well it cleans.`,
      content: `# 6 Vacuum Cleaner Buying Mistakes: Why Suction Watts Aren't the Whole Story

Vacuums are sold on big wattage numbers, but watts describe power draw, not cleaning. What actually picks up dirt is the combination of airflow, the brush head, filtration, and — for cordless — honest runtime. Get those wrong and a "powerful" vacuum still disappoints.

![A cordless stick vacuum cleaning a floor](IMG: cordless stick vacuum cleaning floor)

## Why Wattage Misleads You

Wattage is how much electricity the motor consumes, not how much dirt the vacuum lifts. Real cleaning comes from **airflow and sealed suction at the nozzle**, plus a brush that agitates the surface. Two vacuums with the same watts can clean very differently depending on head design and how well the air path is sealed.

### Mistake 1: Shopping by watts instead of airflow and head design
Beyond a baseline, more watts mostly means more noise and (for cordless) faster battery drain. A well-designed **motorized brush head** matched to your floors does more than raw power. Match the head to carpet vs. hard floor.

### Mistake 2: Underestimating cordless battery reality
Quoted runtime is on the lowest power setting with no powered brush. On max power — what you need for carpet — real runtime can be a fraction of that. If you have a large home, check **runtime on the setting you'll use**, and whether the battery is removable/swappable.

### Mistake 3: Ignoring filtration (it ends up in your air)
A vacuum that isn't well sealed leaks fine dust back into the room. If anyone has allergies, look for a **sealed HEPA filtration system**, not just a "HEPA filter" inside a leaky body. The dust has to stay in the bin, not escape around the seams.

### Mistake 4: Forgetting the long-term cost of bags and filters
Bagless saves on bags but you empty dust clouds by hand and still replace filters. Bagged is cleaner to empty but bags are recurring. Factor **filters, bags, and brush rolls** over a couple of years, not just the purchase price.

### Mistake 5: Overlooking weight, maneuverability, and stairs
A heavy canister is miserable on stairs; a top-heavy stick strains your wrist. If you have multiple floors, weight and balance matter as much as suction. Pick the form factor (stick / canister / upright) for your home's layout.

### Mistake 6: Buying the wrong type for your floors and pets
Bristle brushes wrap long and pet hair into mats; thick carpet needs a stiff powered brush, while bare floors prefer a soft roller. If you have pets or long hair, prioritize an **anti-tangle brush**. For automated cleaning instead, see the [robot vacuum buying mistakes](/en/guides/robot-vacuum-buying-mistakes).

## Quick Pre-Purchase Checklist

- Airflow and sealed suction + a brush head matched to your floors, over watts
- Cordless runtime on the power setting you'll actually use; swappable battery
- Sealed HEPA filtration if anyone has allergies
- Two-year cost of filters, bags, and brush rolls
- Weight and balance for stairs and multi-floor homes
- Anti-tangle brush for pets or long hair

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Does higher wattage mean a vacuum cleans better?
No. Wattage measures the motor's electricity draw, not cleaning ability. Pickup depends on airflow, sealed suction at the nozzle, and a brush head that agitates the surface. Beyond a baseline, extra watts mainly add noise and, on cordless models, drain the battery faster.

### Why is my cordless vacuum's real runtime so much shorter than advertised?
Because quoted runtime is measured on the lowest power setting without a powered brush. On the high-power mode you need for carpet, real runtime can be a fraction of the headline figure. Check runtime on the setting you'll actually use, and whether the battery is swappable.

### What vacuum filtration should I look for with allergies?
Look for a fully sealed HEPA filtration system, not just a "HEPA filter" inside a body that leaks at the seams. If the vacuum isn't sealed, fine dust escapes back into the room around the joints, so the sealing matters as much as the filter rating.`,
    },
    zh: {
      title: `吸尘器选购的 6 个误区：为什么吸力瓦数不是全部`,
      summary: `盒子上的瓦数、清洁中途没电的电池、把灰尘漏回空气的滤网，都是常见的吸尘器误区。本文讲清真正决定它扫得干不干净的东西。`,
      content: `# 吸尘器选购的 6 个误区：为什么吸力瓦数不是全部

吸尘器靠大瓦数数字卖货，但瓦数描述的是功耗，不是清洁力。真正吸起脏污的，是气流、刷头、过滤——以及无线机型诚实的续航——的组合。这些搞错了，"大功率"吸尘器照样让你失望。

![无线手持吸尘器在清洁地板](IMG: cordless stick vacuum cleaning floor)

## 为什么瓦数会误导你

瓦数是电机消耗多少电，不是吸起多少脏污。真正的清洁来自**吸嘴处的气流和密封吸力**，加上能扰动表面的刷子。两台同瓦数的吸尘器，因刷头设计和气路密封不同，清洁效果可能差很多。

### 误区一：按瓦数挑，而非气流和刷头设计
过了基线，更多瓦数多半只是更吵、（无线机型）更费电。一个匹配你地面的**电动刷头**，作用大于纯功率。让刷头匹配地毯还是硬地板。

### 误区二：低估无线电池的真实情况
标称续航是在最低档、不带电动刷的情况下测的。在最大功率——地毯需要的——真实续航可能只是其零头。家大就看**你会用的档位下的续航**，以及电池能否拆卸/更换。

### 误区三：忽略过滤（它最后进了你的空气）
密封不好的吸尘器会把细灰漏回房间。家里有人过敏，就找**整机密封的 HEPA 过滤系统**，而非只是漏气机身里塞一张"HEPA 滤网"。灰尘要留在尘杯里，而非从缝隙逃逸。

### 误区四：忘了尘袋和滤网的长期成本
无气旋无袋省了尘袋，但你要手动倒出扬尘、滤网照样要换。有袋倒灰更干净，但尘袋是持续开销。算上两年的**滤网、尘袋、滚刷**，而非只看购买价。

### 误区五：忽视重量、灵活度和楼梯
笨重的桶式机上楼梯很痛苦；头重的杆式机伤手腕。家有多层，重量和平衡和吸力一样重要。按家里的格局选形态（杆式 / 桶式 / 立式）。

### 误区六：为地面和宠物选错类型
毛刷会把长发和宠物毛缠成团；厚地毯需要硬的电动刷，裸地板更适合软绒滚刷。有宠物或长发，就优先**防缠绕刷头**。想要自动清洁，见[扫地机器人选购误区](/zh/guides/robot-vacuum-buying-mistakes)。

## 选购前快速核对清单

- 看气流、密封吸力 + 匹配地面的刷头，而非瓦数
- 无线看你真正会用的档位下的续航；电池可换
- 有人过敏就要整机密封的 HEPA 过滤
- 算两年的滤网、尘袋、滚刷成本
- 多层住宅看重量和平衡（上楼梯）
- 宠物或长发选防缠绕刷头

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 瓦数越高吸尘器就扫得越干净吗？
不是。瓦数衡量的是电机功耗，不是清洁力。吸起脏污靠的是气流、吸嘴处的密封吸力、以及能扰动表面的刷头。过了基线，多出的瓦数主要是更吵，无线机型还更费电。

### 为什么我无线吸尘器的真实续航比宣传短那么多？
因为标称续航是在最低档、不带电动刷的情况下测的。在地毯需要的高功率档，真实续航可能只是标题数字的零头。要看你真正会用的档位下的续航，以及电池能否更换。

### 过敏的话该看吸尘器的什么过滤？
找整机完全密封的 HEPA 过滤系统，而非只是缝隙漏气的机身里塞一张"HEPA 滤网"。如果整机不密封，细灰会从接缝逃回房间，所以密封和滤网等级一样重要。`,
    },
  },

  // ───────────────────────── 4. 婴儿车 ─────────────────────────
  {
    slug: 'stroller-buying-mistakes',
    tags: [COLUMN_TAG, 'baby', 'parenting', 'baby-maternity', 'gear', 'buying-guide'],
    en: {
      title: `7 Stroller Buying Mistakes: Why the Folded Size Matters More Than the Features`,
      summary: `A stroller that won't fit your car boot, can't take a newborn, or weighs a ton at the bottom of stairs is the usual regret. Here are the fit and safety mistakes to avoid.`,
      content: `# 7 Stroller Buying Mistakes: Why the Folded Size Matters More Than the Features

Strollers are sold on cup holders and colors, but the things that make or break daily life are mundane: does it fit your car, can it carry a newborn safely, and can you fold it one-handed with a baby on your arm? Get those wrong and the feature list won't save you.

![A baby stroller folded next to a car boot](IMG: baby stroller folded car)

## Why the Boring Specs Decide Everything

You'll fold, lift, and load a stroller many times a day. The features in the brochure rarely matter as much as **folded dimensions, weight, and newborn compatibility**. These are the specs that determine whether the stroller fits your real life or lives in a closet.

### Mistake 1: Not checking the folded size against your car boot
This is the number-one regret. A stroller that won't fit your trunk is useless for outings. Measure your **boot space** and compare it to the folded dimensions — not just "compact" marketing words — before anything else.

### Mistake 2: Assuming any stroller is newborn-safe
Newborns need to lie flat or be in a near-flat recline to protect their developing spine and airway. Many lightweight strollers only recline partway. Check for a **flat recline, a bassinet mode, or car-seat compatibility** if you're starting from birth.

### Mistake 3: Ignoring one-handed fold and self-standing
You'll often fold with a baby in one arm. A two-handed, fiddly fold becomes a daily ordeal. Look for a **one-handed fold** that stands on its own, so it doesn't topple while you manage the child and bags.

### Mistake 4: Underestimating weight (especially with stairs or transit)
A heavy frame is fine on flat pavement but brutal up stairs or onto a bus. If you live without an elevator or use public transport, weight matters more than almost any feature. Lift the floor model before deciding.

### Mistake 5: Overlooking wheels and suspension for your terrain
Small hard wheels jolt on rough pavement and stick in gaps; air-filled or larger wheels with suspension roll smoother but add bulk. Match the **wheels and suspension** to where you'll actually walk.

### Mistake 6: Forgetting future siblings and growth
If a second child is likely, a frame that converts to double — or accepts a second seat / glider board — saves a full re-purchase later. Think a year or two ahead. See the [stroller buying guide](/en/guides/baby-stroller-buying-guide).

### Mistake 7: Skipping the safety basics
Confirm a **five-point harness**, a reliable brake you can operate by foot, and a certification standard for your region. Look for no sharp pinch points in the fold. Safety isn't a feature to trade away for style.

## Quick Pre-Purchase Checklist

- Folded dimensions measured against your car boot
- Newborn support (flat recline / bassinet / car-seat compatibility) if from birth
- One-handed fold that stands on its own
- Weight you can lift up stairs or onto transit
- Wheels and suspension matched to your terrain
- Convertibility if a second child is likely
- Five-point harness, foot brake, and regional safety certification

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### What's the most overlooked stroller spec?
The folded size relative to your car boot. A stroller that doesn't fit your trunk is the most common regret, because it makes outings impractical. Measure your boot space and compare it to the stroller's folded dimensions before considering any of the convenience features.

### Can any stroller be used from birth?
No. Newborns need to lie flat or in a near-flat recline to protect their spine and airway, and many lightweight strollers only recline partway. If you're starting from birth, choose one with a flat recline, a bassinet mode, or car-seat compatibility.

### How much does stroller weight really matter?
A lot if you face stairs or public transport. A heavy frame is manageable on flat pavement but becomes a daily struggle up stairs or onto a bus. If you don't have an elevator or you commute with the stroller, weight can matter more than almost any listed feature.`,
    },
    zh: {
      title: `婴儿车选购的 7 个误区：为什么收车尺寸比功能更重要`,
      summary: `塞不进后备箱、躺不了新生儿、在楼梯口重得要命，是婴儿车最常见的后悔。本文讲清该避开的适配与安全误区。`,
      content: `# 婴儿车选购的 7 个误区：为什么收车尺寸比功能更重要

婴儿车靠杯架和配色卖货，但真正决定日常体验的都很朴素：它塞得进你的车吗？能安全躺新生儿吗？你能单手抱着娃把它收起来吗？这些搞错了，功能清单救不了你。

![收好的婴儿车放在汽车后备箱旁](IMG: baby stroller folded car)

## 为什么朴素参数决定一切

你一天会折叠、搬抬、装卸婴儿车很多次。宣传册上的功能，往往不如**收车尺寸、重量和新生儿适配**重要。正是这些参数决定了它融入你的真实生活，还是被塞进储物间。

### 误区一：没拿收车尺寸对比你的后备箱
这是头号后悔。塞不进后备箱的婴儿车，出行时毫无用处。先量你的**后备箱空间**，对比收车后的尺寸——而非只看"轻便""紧凑"的营销词。

### 误区二：以为任何车都能躺新生儿
新生儿需要平躺或接近平躺，以保护发育中的脊柱和气道。很多轻便车只能半躺。从出生就用，就要看**平躺、睡篮模式、或提篮（安全座椅）兼容**。

### 误区三：忽视单手收车和自立
你常常要单手抱娃收车。需要双手、还很别扭的折叠会变成每日折磨。找**单手折叠**且能自己立住的，免得你在照看孩子和拎包时它倒下。

### 误区四：低估重量（尤其有楼梯或乘公交）
重车架在平路上没问题，但抬上楼梯或公交车上就很要命。如果你家没电梯或要坐公共交通，重量比几乎任何功能都重要。决定前先抬一抬样车。

### 误区五：为你的路面忽略轮子和悬挂
小硬轮在坑洼路面颠簸、易卡缝；充气或带悬挂的大轮更顺但更占地。让**轮子和悬挂**匹配你实际会走的路。

### 误区六：忘了二胎和成长
如果可能要二胎，能转双人——或加第二个座椅 / 站板——的车架，能省下日后整车重买。往前想一两年。见[婴儿车选购指南](/zh/guides/baby-stroller-buying-guide)。

### 误区七：跳过安全基本项
确认**五点式安全带**、脚踩可靠的刹车、以及你所在地区的认证标准。看折叠处没有夹手的尖锐点。安全不是可以为了造型而舍弃的功能。

## 选购前快速核对清单

- 收车尺寸对比你的后备箱量过
- 从出生就用，要有新生儿支撑（平躺 / 睡篮 / 提篮兼容）
- 单手折叠且能自立
- 你抬得动（上楼梯、上公交）的重量
- 轮子和悬挂匹配你的路面
- 可能二胎就看可转换性
- 五点式安全带、脚刹、地区安全认证

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 最被忽视的婴儿车参数是什么？
相对你后备箱的收车尺寸。塞不进后备箱是最常见的后悔，因为它让出行变得不现实。在考虑任何便利功能前，先量后备箱空间、对比婴儿车收起后的尺寸。

### 任何婴儿车都能从出生用吗？
不是。新生儿需要平躺或接近平躺以保护脊柱和气道，而很多轻便车只能半躺。从出生就用，就选有平躺、睡篮模式或提篮兼容的。

### 婴儿车重量到底有多重要？
有楼梯或公共交通时很重要。重车架在平路上还行，但抬上楼梯或公交就成了每日挣扎。如果你家没电梯、或带着车通勤，重量可能比几乎任何列出的功能都重要。`,
    },
  },

  // ───────────────────────── 5. 电竞椅 ─────────────────────────
  {
    slug: 'gaming-chair-buying-mistakes',
    tags: [
      COLUMN_TAG,
      'gaming',
      'office-furniture',
      'chair',
      'furniture',
      'home-renovation',
      'buying-guide',
    ],
    en: {
      title: `6 Gaming Chair Buying Mistakes: Racing Looks Aren't Ergonomics`,
      summary: `A bucket seat that looks fast but wrecks your back, foam that flattens in a year, and a size that doesn't fit you are the classic gaming-chair traps. Here's what actually matters.`,
      content: `# 6 Gaming Chair Buying Mistakes: Racing Looks Aren't Ergonomics

Gaming chairs sell a racing-cockpit look, but the bucket shape that looks fast was designed to hold a driver in place, not to support someone sitting for eight hours. The regrets come from buying the aesthetic and ignoring fit, materials, and adjustability.

![A gaming chair at a desk setup](IMG: gaming chair desk setup)

## Why the Racing Shape Can Work Against You

A pronounced bucket seat with tall side bolsters constrains your hips and shoulders to one position. That's fine in a car; over a long work or gaming session it can force a fixed posture and dig into your thighs. Comfort over hours comes from **adjustability and fit**, not the cockpit styling.

### Mistake 1: Buying the look instead of the fit
Side bolsters that are too aggressive for your build push your legs together and your elbows out. Make sure the **seat width and bolster spacing** suit your body — the dramatic shape is the point of failure for many people, not a feature.

### Mistake 2: Ignoring whether the lumbar and armrests adjust
A fixed lumbar pillow only helps if it happens to land on your spine's curve. Look for lumbar support that adjusts in height (built-in is better than a strap-on pillow that slides), and **4D armrests** so your forearms rest level. Without these, "ergonomic" is just a word.

### Mistake 3: Overlooking foam density and durability
Cheap, low-density foam feels fine in week one and packs down into a hard, uneven seat within a year. **High-density molded foam** holds its shape far longer. This is the difference between a chair that lasts and one you re-buy.

### Mistake 4: Misjudging size and weight rating
Gaming chairs come in size classes with real height and weight ranges. A chair too big swallows a smaller person (so the lumbar and bolsters miss entirely); too small and it's cramped. Check the **supported height/weight** against your body.

### Mistake 5: Forgetting the chair has to fit your desk and recline space
A high backrest that reclines needs clearance behind it, and the armrests must clear your desk to pull in close. Measure your space and desk height so the chair actually works at your station.

### Mistake 6: Assuming a gaming chair beats an ergonomic office chair
For long work hours, a proper ergonomic office chair often supports you better than a racing-style seat. If health and all-day sitting are the priority, compare against an [ergonomic chair](/en/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide) and read the [ergonomic chair buying mistakes](/en/guides/ergonomic-chair-buying-mistakes) first.

## Quick Pre-Purchase Checklist

- Seat width and bolster spacing that suit your build, not just the look
- Height-adjustable lumbar (built-in) and 4D armrests
- High-density molded foam for durability
- Supported height/weight range that matches your body
- Recline clearance and armrest-to-desk fit measured
- Compared against a true ergonomic chair if you sit all day

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Are gaming chairs actually ergonomic?
Not inherently. The racing-bucket shape was designed to hold a driver in place, not to support long sitting. Ergonomics come from adjustability and fit — height-adjustable lumbar, 4D armrests, and bolster spacing suited to your body. A dramatic shape without those adjustments is styling, not ergonomics.

### Why does my gaming chair feel hard after a year?
Low-density foam. Cheap foam feels fine at first but compresses into a hard, uneven seat within a year. High-density molded foam holds its shape far longer, so foam quality is the difference between a chair that lasts and one you end up replacing.

### Is a gaming chair or an ergonomic office chair better for long work hours?
For all-day work, a proper ergonomic office chair usually supports you better than a racing-style gaming chair. If health and long sitting sessions are your priority, compare the adjustability of both and lean toward the one that fits your body and adjusts where you need it.`,
    },
    zh: {
      title: `电竞椅选购的 6 个误区：赛车造型不等于人体工学`,
      summary: `看着很拽却伤腰的包裹座、一年就塌的海绵、不合你身材的尺寸，是电竞椅的经典陷阱。本文讲清真正重要的东西。`,
      content: `# 电竞椅选购的 6 个误区：赛车造型不等于人体工学

电竞椅卖的是赛车座舱的造型，但那个看着很快的包裹座，是为了把车手固定在位子上设计的，不是为了支撑一个连坐八小时的人。后悔来自买了外观、却忽略贴合、材质和可调性。

![桌前的电竞椅工位](IMG: gaming chair desk setup)

## 为什么赛车造型可能跟你作对

夸张的包裹座配高耸的侧翼，会把你的髋和肩束缚在一个姿势里。在车里没问题；长时间工作或游戏时，它会逼出固定姿势、硌进大腿。长时间的舒适来自**可调和贴合**，而非座舱造型。

### 误区一：买造型而非买贴合
对你身材过于激进的侧翼，会把你的腿夹拢、把手肘顶开。确保**座宽和侧翼间距**适合你的身体——夸张造型对很多人是失败点，而非卖点。

### 误区二：忽略腰托和扶手能否调
固定的腰枕，只在恰好落在你脊柱曲线上时才有用。要找高度可调的腰托（内置优于会滑动的绑带枕），以及让小臂水平搁放的 **4D 扶手**。没有这些，"人体工学"只是个词。

### 误区三：忽视海绵密度与耐用
廉价低密度海绵第一周手感不错，一年内就压成又硬又不平的座面。**高密度模塑海绵**保持形状的时间长得多。这是一把能用很久的椅子和一把要重买的椅子的区别。

### 误区四：看错尺寸和承重
电竞椅分尺码，有真实的身高体重范围。椅子太大会"吞掉"小个子（腰托和侧翼完全错位）；太小则局促。拿**适配身高/体重**对照你的身体。

### 误区五：忘了椅子要适配你的桌子和后仰空间
能后仰的高靠背需要身后留空，扶手也要能让你贴近桌子。量好你的空间和桌高，让椅子在你的工位真正好用。

### 误区六：以为电竞椅一定胜过人体工学办公椅
长时间工作，正经的人体工学办公椅往往比赛车造型座支撑得更好。如果健康和全天久坐是优先项，去对比[人体工学椅](/zh/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide)，并先读[人体工学椅选购误区](/zh/guides/ergonomic-chair-buying-mistakes)。

## 选购前快速核对清单

- 座宽和侧翼间距适合你的身材，而非只看造型
- 高度可调的腰托（内置）和 4D 扶手
- 高密度模塑海绵保证耐用
- 适配身高/体重范围对得上你的身体
- 量好后仰留空和扶手到桌面的贴合
- 全天久坐就对比真正的人体工学椅

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 电竞椅真的符合人体工学吗？
并非天生如此。赛车包裹造型是为把车手固定在位子上设计的，不是为长时间久坐支撑。人体工学来自可调和贴合——高度可调腰托、4D 扶手、适合你身体的侧翼间距。没有这些调节的夸张造型只是外观，不是人体工学。

### 为什么我的电竞椅一年后变硬了？
低密度海绵。廉价海绵起初手感不错，一年内压成又硬又不平的座面。高密度模塑海绵保持形状的时间长得多，所以海绵质量是椅子耐用与否的关键。

### 长时间工作选电竞椅还是人体工学办公椅？
全天工作，正经的人体工学办公椅通常比赛车造型电竞椅支撑得更好。如果健康和长时间久坐是优先项，对比两者的可调性，倾向那把贴合你身体、且在你需要处可调的。`,
    },
  },

  // ───────────────────────── 6. 防晒霜 ─────────────────────────
  {
    slug: 'sunscreen-buying-mistakes',
    tags: [COLUMN_TAG, 'sunscreen', 'skincare-science', 'skincare-personal-care', 'buying-guide'],
    en: {
      title: `6 Sunscreen Buying Mistakes: SPF Is Only Half the Protection`,
      summary: `A high SPF with no UVA protection, a formula you hate wearing, and using a fraction of the amount needed are why sunscreen quietly fails. Here are the label and usage mistakes to avoid.`,
      content: `# 6 Sunscreen Buying Mistakes: SPF Is Only Half the Protection

Sunscreen is one of the most effective skincare products and one of the most misused. A big SPF number on the front says nothing about UVA protection, how the formula feels, or whether you'll actually apply enough. The mistakes below are why "I wear sunscreen" often doesn't translate into real protection.

![A bottle of sunscreen on a beach towel](IMG: sunscreen bottle beach)

## Why SPF Alone Doesn't Protect You

SPF measures protection against UVB (the burning rays), not UVA (the deeper, aging rays that pass through cloud and glass). A high SPF with weak UVA defense leaves you exposed to long-term damage you can't feel. Real protection needs **broad-spectrum coverage**, plus a formula you'll wear and reapply.

### Mistake 1: Reading SPF and ignoring UVA
SPF only describes UVB. For UVA, look for **"broad spectrum"**, a **PA+++/PA++++** rating, or the circled **UVA** seal, depending on your region. Without it, a high SPF protects against burning while aging damage continues.

### Mistake 2: Chasing the highest SPF number
The jump from SPF 30 to 50 is small (about 97% to 98% of UVB blocked), and very high SPFs can create false confidence. A realistic **SPF 30–50 applied properly** beats an SPF 100 used sparingly. The number is not where the gains are.

### Mistake 3: Buying a texture you'll avoid wearing
The best sunscreen is the one you'll actually use every day. A heavy, greasy, or white-casting formula gets skipped. Match the **finish (matte, dewy), base (mineral vs. chemical), and feel** to your skin so daily use is effortless. See our [sunscreen buying guide](/en/guides/sunscreen-buying-guide-guide-upf-zh079).

### Mistake 4: Using far too little
Protection is rated at about **2 mg/cm²** — roughly two finger-lengths for the face and neck, a shot-glass for the body. Most people apply a third to a half of that, getting a fraction of the labeled SPF. Under-applying is the most common reason sunscreen "fails".

### Mistake 5: Forgetting to reapply
Sunscreen wears off with sweat, water, and time. A morning application is not all-day protection. Reapply roughly **every two hours** outdoors, and after swimming or toweling off — water resistance is time-limited, not permanent.

### Mistake 6: Assuming mineral and chemical are interchangeable
Mineral (zinc/titanium) sits on skin, starts working immediately, and suits sensitive skin but can leave a cast. Chemical filters absorb light, feel lighter, but may irritate some skin and need time to bind. Pick by your **skin type and use**, not by which is marketed as "cleaner".

## Quick Pre-Purchase Checklist

- Broad-spectrum / PA rating for UVA, not just SPF
- A realistic SPF 30–50 you'll apply generously
- A texture and finish you'll happily wear every day
- A willingness to apply the full rated amount (two finger-lengths for the face)
- A plan to reapply every ~2 hours outdoors
- Mineral vs. chemical chosen for your skin type, not marketing

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Does a high SPF mean full sun protection?
No. SPF only measures protection against UVB, the burning rays. UVA — the deeper rays that cause aging and pass through cloud and glass — needs broad-spectrum coverage or a PA rating. A high SPF without UVA protection leaves you exposed to long-term damage you can't feel.

### Is SPF 100 much better than SPF 50?
Not meaningfully. SPF 30 blocks about 97% of UVB, SPF 50 about 98%, and higher numbers add very little. Worse, a very high SPF can create false confidence. Applying SPF 30–50 properly and reapplying beats an SPF 100 used sparingly.

### How much sunscreen should I actually apply?
About 2 mg/cm² — roughly two finger-lengths for the face and neck, and a shot-glass amount for the body. Most people use a third to a half of that and get a fraction of the labeled SPF. Under-application is the most common reason sunscreen seems to fail.`,
    },
    zh: {
      title: `防晒霜选购的 6 个误区：SPF 只是一半的防护`,
      summary: `高 SPF 却没 UVA 防护、一款你讨厌涂的质地、用量只有需要的零头，是防晒悄悄失效的原因。本文讲清该避开的标签与使用误区。`,
      content: `# 防晒霜选购的 6 个误区：SPF 只是一半的防护

防晒是最有效的护肤品之一，也是最常被用错的之一。瓶身正面的大 SPF 数字，说明不了 UVA 防护、质地手感、或你会不会真的涂够。下面这些误区，正是"我有涂防晒"常常没换来真实防护的原因。

![沙滩巾上的一瓶防晒霜](IMG: sunscreen bottle beach)

## 为什么单看 SPF 防不住

SPF 衡量的是对 UVB（晒伤射线）的防护，不是 UVA（更深、致衰老、能穿过云层和玻璃的射线）。高 SPF 配弱 UVA 防御，会让你暴露在感觉不到的长期损伤里。真正的防护需要**广谱覆盖**，加上一款你愿意涂、愿意补的配方。

### 误区一：看 SPF 却忽略 UVA
SPF 只描述 UVB。对 UVA，要看**"广谱（broad spectrum）"**、**PA+++/PA++++** 评级、或带圈的 **UVA** 标（视地区而定）。没有它，高 SPF 防住晒伤，衰老损伤却在继续。

### 误区二：追最高的 SPF 数字
从 SPF 30 到 50 提升很小（UVB 拦截约 97% 到 98%），而过高的 SPF 会带来虚假的安全感。**正确涂够的 SPF 30–50**，胜过省着用的 SPF 100。增益不在数字上。

### 误区三：买了你会逃避涂的质地
最好的防晒是你每天真会用的那支。厚重、油腻、泛白的配方会被跳过。让**肤感（哑光、水润）、基底（物理 vs 化学）和质地**匹配你的皮肤，让每日使用毫不费力。见我们的[防晒霜选购指南](/zh/guides/sunscreen-buying-guide-guide-upf-zh079)。

### 误区四：用量远远不够
防护是按约 **2 mg/cm²** 测的——脸和脖子大约两指节长，身体一小杯。多数人只涂三分之一到一半，得到的只是标称 SPF 的零头。涂太少是防晒"失效"最常见的原因。

### 误区五：忘了补涂
防晒会随汗水、海水和时间流失。早上涂一次不是全天防护。户外大约**每两小时**补一次，游泳或擦干后也要补——防水是有时限的，不是永久的。

### 误区六：以为物理和化学可以互换
物理（锌/钛）停留在皮肤表面、立即起效、适合敏感肌，但可能泛白。化学滤剂吸收光线、肤感更轻，但可能刺激某些皮肤、且需要时间成膜。按你的**肤质和用途**选，而非按谁被宣传得更"干净"。

## 选购前快速核对清单

- 看广谱 / PA 评级（防 UVA），而非只看 SPF
- 一个你会大方涂够的、现实的 SPF 30–50
- 一个你乐意每天涂的质地和肤感
- 愿意涂够标称用量（脸约两指节长）
- 户外每约 2 小时补涂的计划
- 物理 vs 化学按肤质选，而非按营销

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 高 SPF 就代表全面防晒吗？
不是。SPF 只衡量对 UVB（晒伤射线）的防护。UVA——致衰老、能穿过云层和玻璃的更深射线——需要广谱覆盖或 PA 评级。没有 UVA 防护的高 SPF，会让你暴露在感觉不到的长期损伤里。

### SPF 100 比 SPF 50 好很多吗？
没有实质区别。SPF 30 拦截约 97% 的 UVB，SPF 50 约 98%，更高的数字增益极小。更糟的是过高 SPF 会带来虚假安全感。正确涂够并补涂 SPF 30–50，胜过省着用的 SPF 100。

### 防晒霜到底该涂多少？
约 2 mg/cm²——脸和脖子大约两指节长，身体一小杯的量。多数人只用三分之一到一半，得到的只是标称 SPF 的零头。涂太少是防晒看似失效最常见的原因。`,
    },
  },
]

// ── IMG: 占位解析（双语共图：同一篇的相同关键词只搜一次）──────────────────────
const finder = new ImageFinder()
const IMG_RE = /!\[([^\]]*)\]\(IMG:\s*([^)]+)\)/g

async function resolveArticleImages(a) {
  // 收集本篇所有关键词，逐个搜一次
  const kws = new Set()
  for (const loc of ['en', 'zh']) {
    let m
    IMG_RE.lastIndex = 0
    while ((m = IMG_RE.exec(a[loc].content))) kws.add(m[2].trim())
  }
  const map = {}
  for (const kw of kws) {
    const r = finder.enabled ? await finder.find(kw, kw) : null
    map[kw] = r ? r.url : null
  }
  // 替换：命中→真实图；未命中→删除占位行（不留死占位）
  for (const loc of ['en', 'zh']) {
    a[loc].content = a[loc].content
      .replace(IMG_RE, (full, alt, kw) => {
        const url = map[kw.trim()]
        return url ? `![${alt}](${url})` : ''
      })
      .replace(/\n{3,}/g, '\n\n')
  }
  return Object.values(map).filter(Boolean).length
}

let ok = 0,
  fail = 0
for (const a of articles) {
  const got = await resolveArticleImages(a)
  console.log(`图: ${a.slug} 命中 ${got}/${Object.keys(a.en).length ? '' : ''}关键词`)
  for (const locale of ['en', 'zh']) {
    const d = a[locale]
    const row = {
      slug: a.slug,
      locale,
      title: d.title,
      summary: d.summary,
      tags: a.tags,
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
console.log(
  `\n完成：成功 ${ok}，失败 ${fail}（共 ${articles.length} 篇 × 2 语言）。配图 stats`,
  finder.stats
)

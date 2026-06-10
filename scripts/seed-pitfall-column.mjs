#!/usr/bin/env node
/**
 * seed-pitfall-column.mjs
 *
 * 「踩坑指南」专栏：10 个高频日常品类的"常见错误"角度文章（双语）。
 * 角度差异化于已有 *-buying-guide（讲该买什么），本专栏讲"别犯什么错"。
 * - tags 带 'pitfall-guide'（专栏归集 + 专栏内互链）+ 子类/大类 slug（与对应主文自动互链）。
 * - 每篇含 ## FAQ / ## 常见问题（→ FAQPage schema）。
 * - 正文内链到对应品类已有主文，强化内容簇。
 * - 全程无品牌名，纯参数 / 规格 / 原理。
 * - upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-pitfall-column.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-pitfall-column.mjs
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
const DATE = '2026-06-10'

// 专栏标记 tag：用于 /pitfalls 聚合与专栏内互链；在可见 chip 中会被过滤
const COLUMN_TAG = 'pitfall-guide'

const articles = [
  // ───────────────────────── 1. 床垫 ─────────────────────────
  {
    slug: 'mattress-buying-mistakes',
    tags: [COLUMN_TAG, 'mattresses', 'home-renovation', 'furniture', 'buying-guide'],
    en: {
      title: '7 Mattress Buying Mistakes That Lead to Years of Bad Sleep',
      summary:
        'A mattress is an 8-year decision you test for two minutes. These are the spec mistakes — firmness, density, trial period, edge support — that turn into years of back pain and buyer regret.',
      content: `# 7 Mattress Buying Mistakes That Lead to Years of Bad Sleep

A mattress is something you use for roughly a third of your life, yet most people decide on it after lying down for two minutes in a showroom. The mistakes below are the ones that show up months later — as back pain, a sagging dip, or a sleep-hot summer you can't fix.

## Why Mattresses Are So Easy to Get Wrong

The feel of a mattress in a five-minute test says almost nothing about how your body will feel on it after eight hours, night after night. Worse, the specs that actually predict durability and support — foam density, coil gauge, ILD — are rarely on the showroom tag. So buyers fall back on price and brand-feel, which is exactly how you end up regretting the purchase.

### Mistake 1: Judging by a two-minute showroom test
Your muscles don't relax in two minutes, and a showroom is the wrong temperature, light, and posture. What matters is how the mattress feels in deep sleep. This is why the **sleep trial period is the single most important "spec"** — look for at least 100 nights, with a clearly stated return process that doesn't bury you in restocking fees.

### Mistake 2: Believing "firmer is better for your back"
Firmness is not support. A too-firm mattress leaves gaps under the lumbar curve for back sleepers and jams the shoulder and hip for side sleepers. Match firmness to **sleep position**: side sleepers usually need softer (to let shoulder and hip sink in and keep the spine straight), back and stomach sleepers need medium-firm. See our [mattress firmness & sleep position guide](/en/guides/mattress-firmness-sleep-position-guide).

### Mistake 3: Ignoring how body weight changes the feel
Firmness ratings assume an average body. A heavier person sinks deeper and perceives the same mattress as softer; a lighter person barely compresses it and finds it firmer. The "medium-firm" that reviewers loved can be the wrong feel entirely for your weight.

### Mistake 4: Buying the material name, not the density
"Memory foam" and "latex" are categories, not quality. Comfort-layer **foam density** (and ILD for firmness) predicts how long it resists body impressions; cheap low-density foam softens and sags within a year or two. For innersprings, **coil gauge** (lower number = thicker, more durable wire) and zoning matter more than coil count. See [foam vs spring vs hybrid explained](/en/guides/mattress-foam-vs-spring-vs-hybrid-explained).

### Mistake 5: Forgetting edge support and heat
Weak edges shrink your usable sleeping area and make sitting on the side feel like sliding off. And dense all-foam builds trap body heat — if you sleep hot, look for coils (better airflow) or open-cell / gel layers rather than a solid foam block.

### Mistake 6: Skipping the warranty's fine print
A "10-year warranty" is meaningless until you read the **sagging threshold**. Many only cover a permanent indentation deeper than 25 mm (about an inch) — sag less than that and you're on your own, even if it ruins your sleep.

## Quick Pre-Purchase Checklist

- Trial period of at least 100 nights, with a clear, low-friction return process
- Firmness matched to your dominant sleep position, not "firm = healthy"
- Comfort-layer foam density stated (higher resists sagging); coil gauge for innersprings
- Edge support if you sit on the edge or use the full width
- Cooling construction (coils / open-cell) if you sleep hot
- Warranty sagging threshold read and acceptable (ideally ≤ 25 mm)

For the full decision, start with our [mattress firmness & sleep position guide](/en/guides/mattress-firmness-sleep-position-guide), then browse the [pitfall guides column](/en/pitfalls) for other categories.

## FAQ

### Is a firmer mattress always better for back pain?
No. Support, not firmness, protects your back. A mattress that's too firm leaves a gap under the lower back for back sleepers and pushes the shoulder and hip out of line for side sleepers. The right firmness depends on your sleep position and body weight.

### What mattress spec actually predicts durability?
For foam, comfort-layer density is the best durability signal — low-density foam softens and develops body impressions within a year or two. For innersprings, a lower coil gauge number means thicker, more durable wire. Coil count and material names matter far less.

### How long should a mattress trial period be?
Aim for at least 100 nights, because it takes weeks for your body to adapt and reveal whether a mattress truly supports you. Just as important as the length is the return process — check for restocking or pickup fees that make returns impractical.`,
    },
    zh: {
      title: '床垫选购的 7 个误区：一个让你睡几年差觉的两分钟决定',
      summary:
        '床垫是用 8 年的决定，你却只躺两分钟就拍板。本文讲清软硬、密度、试睡期、边缘支撑这些参数误区——它们会变成几年的腰背痛和后悔。',
      content: `# 床垫选购的 7 个误区：一个让你睡几年差觉的两分钟决定

床垫几乎占用你人生三分之一的时间，但多数人在展厅躺两分钟就做了决定。下面这些误区，往往几个月后才显形——变成腰痛、一个塌陷的坑、或一个怎么都凉不下来的夏天。

## 为什么床垫特别容易买错

五分钟试躺的手感，几乎说明不了你的身体连续八小时、夜复一夜地睡在上面会是什么感觉。更麻烦的是，真正决定耐用和支撑的参数——泡沫密度、弹簧线规、ILD——展厅标签上几乎从不标。于是大家只能靠价格和"手感"，而这恰恰是后悔的开端。

### 误区一：靠两分钟展厅试躺下判断
肌肉两分钟内不会真正放松，展厅的温度、光线、姿势也都不对。真正重要的是深睡时的感受。所以**试睡期是最重要的"参数"**——找至少 100 晚、且退货流程写得清楚、不靠高额手续费劝退你的。

### 误区二：以为"越硬越护腰"
硬度不等于支撑。太硬的床垫，仰睡者腰曲下方会悬空，侧睡者的肩和髋会被硌住。软硬要匹配**睡姿**：侧睡通常需要偏软（让肩髋下沉、脊柱保持平直），仰睡和趴睡需要中等偏硬。见我们的[床垫软硬与睡姿指南](/zh/guides/mattress-firmness-sleep-position-guide)。

### 误区三：忽略体重对软硬感知的影响
软硬评级默认的是平均体型。体重大的人下沉更深，会觉得同一张床更软；体重轻的人压不下去，会觉得更硬。评测们盛赞的"中等偏硬"，对你的体重可能完全是另一种手感。

### 误区四：买材料名称，不看密度
"记忆棉""乳胶"是品类，不是品质。舒适层的**泡沫密度**（软硬看 ILD）才决定它多久会被压出身形印；廉价低密度泡沫一两年就会变软塌陷。弹簧床则要看**线规**（数字越小=钢丝越粗越耐用）和分区，比弹簧数量更重要。见[泡沫 vs 弹簧 vs 混合结构解析](/zh/guides/mattress-foam-vs-spring-vs-hybrid-explained)。

### 误区五：忽略边缘支撑与散热
边缘支撑弱，会缩小你实际能睡的面积，坐在床沿像要滑下去。而高密度全泡棉结构蓄热——如果你睡觉怕热，选弹簧（透气更好）或开孔/凝胶层，别选实心泡棉块。

### 误区六：跳过质保的小字
"十年质保"在你读懂**凹陷判定标准**之前毫无意义。很多只赔超过 25 毫米（约一寸）的永久凹陷——塌得没那么深，哪怕已经毁了你的睡眠，也得自己扛。

## 选购前快速核对清单

- 试睡期至少 100 晚，退货流程清晰、无劝退式费用
- 软硬匹配你的主要睡姿，而非"硬=健康"
- 标明舒适层泡沫密度（越高越抗塌）；弹簧床看线规
- 常坐床沿或要睡满整幅宽度，就看边缘支撑
- 睡觉怕热，选弹簧/开孔结构等散热设计
- 读懂质保凹陷判定标准并能接受（最好 ≤ 25 毫米）

完整决策从[床垫软硬与睡姿指南](/zh/guides/mattress-firmness-sleep-position-guide)开始，其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 床垫越硬越护腰吗？
不是。护腰靠的是支撑，不是硬度。太硬的床垫，仰睡者腰下会悬空，侧睡者的肩髋会被顶得偏离中线。合适的软硬取决于你的睡姿和体重。

### 哪个床垫参数才真正决定耐用？
泡沫床看舒适层密度最靠谱——低密度泡沫一两年内就变软、压出身形印。弹簧床看线规，数字越小钢丝越粗越耐用。弹簧数量和材料名称反而次要得多。

### 床垫试睡期应该多长？
至少 100 晚，因为身体要几周才能适应并显现这张床是否真的支撑住你。和时长同样重要的是退货流程——留意是否有让退货变得不现实的手续费或上门取件费。`,
    },
  },

  // ───────────────────────── 2. 扫地机器人 ─────────────────────────
  {
    slug: 'robot-vacuum-buying-mistakes',
    tags: [COLUMN_TAG, 'robot-vacuums', 'home-appliances', 'cleaning-appliances', 'buying-guide'],
    en: {
      title: `6 Robot Vacuum Buying Mistakes (It's Not About Suction Power)`,
      summary:
        'Most robot vacuum regret comes from chasing the suction number while ignoring navigation, mopping reality, and maintenance cost. Here are the spec traps that actually decide whether it cleans your home.',
      content: `# 6 Robot Vacuum Buying Mistakes (It's Not About Suction Power)

Robot vacuum marketing is a contest of ever-bigger suction numbers. But the units people actually regret usually had plenty of suction — they just couldn't navigate the room, faked the mopping, or buried the owner in maintenance. Here's where the real decision is.

## Why the Suction Number Misleads You

Suction (measured in Pa) only matters past a "good enough" threshold; beyond it, what determines whether your floors get clean is whether the robot can **systematically cover the room, get into the right places, and not strand itself**. A high-Pa robot that bounces around randomly and misses half the floor is worse than a moderate one that maps methodically.

### Mistake 1: Buying on the suction (Pa) number alone
Above a reasonable threshold, more Pa mostly means more noise and faster battery drain. Navigation is what cleans your home. A robot that maps the space and cleans in efficient rows beats a stronger one that wanders randomly.

### Mistake 2: Ignoring navigation type
Random-bounce robots miss spots and repeat others. **LiDAR or vSLAM mapping** lets the robot plan a complete path, remember rooms, and resume after charging. If you have more than one room, mapping navigation is close to essential — see [LiDAR vs vSLAM navigation explained](/en/guides/robot-vacuum-lidar-vs-vslam-navigation-explained).

### Mistake 3: Assuming "has a mop" means "mops well"
Many robots just drag a damp cloth, smearing dirt rather than cleaning. Look for **downward pressure**, a cloth that lifts or retracts on carpet (so it doesn't wet your rugs), and a base that washes and dries the pad. Without those, the mop is a marketing checkbox.

### Mistake 4: Underestimating maintenance and running cost
Every robot needs emptying, and consumables — filters, brushes, mop pads, and dust bags for self-empty docks — add up. A self-empty base is convenient but bags are an ongoing cost. Factor the **total cost of ownership**, not just the sticker price.

### Mistake 5: Not measuring your home first
Robots fail on details the spec sheet won't warn you about: a body too tall to fit under the sofa, thresholds higher than its climb rating, dark floors its cliff sensors misread, or cords and clutter it eats. Measure your lowest furniture clearance and tallest threshold before buying.

### Mistake 6: Forgetting pet hair and long hair tangle
Bristle brushes wrap long hair into a solid mat that you cut off weekly. If you have pets or long-haired household members, look for **anti-tangle rubber or comb-style brushes**. For deeper coverage, see our [robot vacuum advanced guide](/en/guides/robot-vacuum-advanced-guide).

## Quick Pre-Purchase Checklist

- Mapping navigation (LiDAR / vSLAM) if you have more than one room
- Mopping with real pressure + carpet lift, if you want actual mopping
- Body height vs your lowest furniture; climb rating vs your tallest threshold
- Anti-tangle brush if you have pets or long hair
- Total cost: consumables (filters, brushes, pads, dust bags) over 2 years
- Battery and resume-charging if your floor area is large

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Is higher suction (Pa) always better for a robot vacuum?
No. Past a "good enough" threshold, extra Pa mainly adds noise and drains the battery faster. What actually cleans your floors is systematic navigation — a mapping robot that covers every row beats a stronger one that bounces randomly and misses spots.

### Do robot vacuums with a mop actually mop?
Often poorly. Many simply drag a damp cloth and smear dirt around. Effective mopping needs downward pressure on the pad, a way to lift or retract the pad on carpet, and ideally a base that washes and dries it. Without those, the mop is mostly a marketing feature.

### What should I check about my home before buying a robot vacuum?
Measure the clearance under your lowest furniture against the robot's height, and your tallest threshold against its climb rating. Dark flooring can confuse cliff sensors, and loose cords can tangle the brush. These physical details cause more failures than suction ever will.`,
    },
    zh: {
      title: '扫地机器人的 6 个选购误区（关键根本不是吸力）',
      summary:
        '扫地机的后悔大多来自只盯吸力数字，却忽略导航、拖地真实性和维护成本。本文讲清真正决定它能否扫干净你家的参数陷阱。',
      content: `# 扫地机器人的 6 个选购误区（关键根本不是吸力）

扫地机的营销是一场吸力数字越堆越高的比赛。但真正让人后悔的机型，往往吸力都不缺——它们只是不会规划房间、假装拖地、或把你埋进无尽的维护里。真正的决策点在别处。

## 为什么吸力数字会误导你

吸力（单位 Pa）只在跨过"够用"的门槛前才重要；越过之后，决定你地板能否扫干净的，是它能否**系统地覆盖房间、进到该进的地方、且不把自己困住**。一台高 Pa 却乱撞、漏扫一半地面的机器，不如一台中规中矩但能规划路线的。

### 误区一：只看吸力（Pa）数字下单
越过合理门槛后，更高的 Pa 多半只意味着更吵、更费电。真正扫干净你家的是导航。会规划、走弓字形的机器，胜过乱逛的更强机型。

### 误区二：忽略导航类型
随机碰撞式的机器既漏扫又重复。**LiDAR 或 vSLAM 建图**让机器能规划完整路径、记住房间、充电后断点续扫。只要你家不止一个房间，建图导航几乎是必需——见[LiDAR vs vSLAM 导航解析](/zh/guides/robot-vacuum-lidar-vs-vslam-navigation-explained)。

### 误区三：以为"带拖布"就等于"拖得干净"
很多机器只是拖一块湿布，把脏东西抹开而非清走。要看**下压力**、地毯上能否抬升或回收拖布（以免打湿地毯）、以及基站能否自动洗拖布并烘干。没有这些，拖地只是个营销勾选项。

### 误区四：低估维护和使用成本
每台机器都要倒尘，而耗材——滤网、滚刷、拖布、自动集尘座的尘袋——会累积。自动集尘座方便，但尘袋是长期开销。要算**总持有成本**，不是只看标价。

### 误区五：没先量自己家
机器会败在规格表不会提醒你的细节上：机身太高钻不进沙发底、门槛高过它的越障能力、深色地板被悬崖传感器误判、或被电线和杂物缠住。买前先量你最低家具的离地高度和最高的门槛。

### 误区六：忽略宠物毛和长发缠绕
毛刷会把长发缠成一团硬垫，得每周剪一次。家里有宠物或长发成员，就找**防缠绕的胶刷或梳齿式滚刷**。更深入的内容见我们的[扫地机器人进阶指南](/zh/guides/robot-vacuum-advanced-guide)。

## 选购前快速核对清单

- 不止一个房间就选建图导航（LiDAR / vSLAM）
- 想真拖地，就要有真实下压力 + 地毯抬升
- 机身高度 vs 你最低的家具；越障高度 vs 你最高的门槛
- 有宠物或长发就选防缠绕滚刷
- 总成本：两年的耗材（滤网、滚刷、拖布、尘袋）
- 面积大就看电池容量和断点续扫

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 扫地机器人吸力（Pa）越高越好吗？
不是。越过"够用"门槛后，更高的 Pa 主要是更吵、更费电。真正扫干净地板的是系统化导航——会规划、覆盖每一行的建图机型，胜过乱撞漏扫的更强机器。

### 带拖布的扫地机器人真能拖干净吗？
往往拖不干净。很多只是拖一块湿布、把脏东西抹开。有效拖地需要拖布有下压力、在地毯上能抬升或回收、最好基站还能自动洗烘。没有这些，拖地多半只是营销功能。

### 买扫地机器人前该确认家里的哪些情况？
量一下最低家具的离地高度对比机身高度，最高门槛对比它的越障能力。深色地板可能让悬崖传感器误判，散落的电线会缠住滚刷。这些物理细节造成的失败，比吸力多得多。`,
    },
  },

  // ───────────────────────── 3. 空气炸锅 ─────────────────────────
  {
    slug: 'air-fryer-buying-mistakes',
    tags: [COLUMN_TAG, 'kitchen-appliances', 'home-appliances', 'buying-guide'],
    en: {
      title: '6 Air Fryer Buying Mistakes: Why Capacity in Liters Lies',
      summary:
        'The liter rating on an air fryer barely tells you how much food it actually cooks. These are the capacity, wattage, and cleaning mistakes that leave people disappointed after the first week.',
      content: `# 6 Air Fryer Buying Mistakes: Why Capacity in Liters Lies

An air fryer cooks by blowing hot air fast around food, so what matters is the surface you can spread food on — not the volume of the basket. Yet almost everyone shops by the liter number, which is exactly why so many end up cooking in frustrating little batches.

## Why the Liter Number Misleads You

Air frying needs airflow around each piece. A tall 5-liter basket and a wide 5-liter basket cook completely differently: food crisps in a **single layer**, so the usable **basket floor area** decides how much you can actually make at once. Stack food to "use the capacity" and it steams instead of crisps.

### Mistake 1: Shopping by liters instead of basket floor area
Two fryers with the same liter rating can have very different cooking surfaces. A deep, narrow basket wastes its volume because you can't pile food without blocking airflow. Look at the **floor dimensions**, and picture a single layer of fries or wings on it.

### Mistake 2: Underestimating wattage and preheat
Low-wattage models heat unevenly and preheat slowly, so results are inconsistent and "15-minute" recipes take 25. For a full-size basket, higher wattage means faster, more even cooking. If you cook for more than one or two people, don't go underpowered.

### Mistake 3: Not thinking about cleaning before buying
This is the #1 reason air fryers end up in a cupboard. Look for a **removable, non-stick, dishwasher-safe basket and tray**, and check whether the heating element is easy to wipe. A fryer that's a chore to clean is a fryer you stop using.

### Mistake 4: Forgetting counter space and ventilation
Air fryers are bulkier than they photograph, and they exhaust hot air from the back — they need clearance behind and above. Measure your counter and the gap under your cabinets before buying, or it lives on the floor.

### Mistake 5: Confusing basket-style with oven-style
Basket models crisp small batches fast and are easy to shake; oven-style (with racks) fit flat items and larger meals but cook less evenly across racks. Pick by what you actually cook. See [air fryer vs oven: capacity, wattage & use case](/en/guides/air-fryer-vs-oven-capacity-wattage-use-case-guide).

### Mistake 6: Paying for presets you'll never use
A dozen labeled buttons mostly just set a time and temperature you could set yourself. What matters is a usable **temperature range** and reliable, even heating — not the number of presets on the panel.

## Quick Pre-Purchase Checklist

- Basket **floor area** (single-layer space), not just liters
- Enough wattage for even cooking and reasonable preheat
- Removable, non-stick, dishwasher-safe basket and tray
- Counter footprint + rear/top clearance for hot exhaust
- Basket-style vs oven-style matched to what you cook
- A genuinely useful temperature range over a wall of presets

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Why is air fryer capacity in liters misleading?
Air frying crisps food in a single layer, so the usable basket floor area — not the liter volume — decides how much you can cook at once. A deep, narrow basket has a high liter rating but a small cooking surface, forcing you into small batches.

### Does air fryer wattage matter?
Yes. Low-wattage models preheat slowly and heat unevenly, so food cooks inconsistently and takes longer than recipes state. For a full-size basket or cooking for several people, higher wattage gives faster, more even results.

### What's the difference between a basket and an oven-style air fryer?
Basket models crisp small batches quickly and are easy to shake mid-cook. Oven-style models with racks fit flat items and larger meals but tend to cook less evenly across multiple racks. Choose based on the food you cook most.`,
    },
    zh: {
      title: '空气炸锅的 6 个选购误区：为什么"升数"会骗你',
      summary:
        '空气炸锅标的升数，几乎说明不了它实际能做多少菜。本文讲清容量、功率、清洗这些误区——它们让很多人用一周就失望。',
      content: `# 空气炸锅的 6 个选购误区：为什么"升数"会骗你

空气炸锅靠高速热风环绕食物加热，所以重要的是你能摊开食物的面积，而不是炸篮的体积。但几乎所有人都按升数挑，这正是为什么那么多人最后只能一小批一小批地炸、炸到心累。

## 为什么升数会误导你

空气炸需要每块食物周围都有气流。一个又高又窄的 5 升炸篮和一个又宽又矮的 5 升炸篮，做菜完全不同：食物要**单层平铺**才会脆，所以可用的**炸篮底面积**才决定你一次能做多少。把食物堆起来"凑满容量"，结果是被蒸软而不是炸脆。

### 误区一：按升数挑，而不是按炸篮底面积
两台升数相同的炸锅，烹饪面积可能差很多。又深又窄的篮子浪费容积，因为食物一堆就挡住气流。要看**篮底尺寸**，想象上面单层铺满薯条或鸡翅的样子。

### 误区二：低估功率和预热
低功率机型受热不均、预热慢，结果不稳定，"15 分钟"的菜谱要做 25 分钟。对全尺寸炸篮来说，更高功率意味着更快、更均匀。给两口人以上做饭，别选功率太低的。

### 误区三：买前不考虑清洗
这是空气炸锅最后被塞进橱柜的头号原因。要找**可拆、不粘、能进洗碗机的炸篮和托盘**，并确认发热管好不好擦。清洗费劲的炸锅，就是你会停用的炸锅。

### 误区四：忘了台面空间和散热
空气炸锅比照片上笨重，而且从背后排热风——背后和上方都要留空间。买前量好台面和吊柜下方的高度，否则它只能落地摆。

### 误区五：分不清篮式和烤箱式
篮式小批量出脆快、好摇匀；烤箱式（带烤架）能放平铺的大件和更大份量，但多层之间受热没那么均匀。按你实际做什么来选。见[空气炸锅 vs 烤箱：容量、功率与用途](/zh/guides/air-fryer-vs-oven-capacity-wattage-use-case-guide)。

### 误区六：为用不上的预设花钱
一排带标签的按键，多半只是帮你设了一个你自己也能设的时间和温度。真正重要的是好用的**温度范围**和稳定均匀的加热，而不是面板上预设的数量。

## 选购前快速核对清单

- 看炸篮**底面积**（单层铺开的空间），而非只看升数
- 功率足够，受热均匀、预热合理
- 炸篮和托盘可拆、不粘、能进洗碗机
- 台面占地 + 背后/上方的排热留空
- 篮式 vs 烤箱式，匹配你常做的菜
- 一个真正好用的温度范围，胜过一墙预设

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 为什么空气炸锅的升数会误导人？
空气炸是单层把食物炸脆，所以能炸多少由可用的篮底面积决定，而不是升数体积。又深又窄的篮子升数高但烹饪面积小，逼你一小批一小批做。

### 空气炸锅的功率重要吗？
重要。低功率机型预热慢、受热不均，食物做得不稳定，也比菜谱写的更费时。全尺寸炸篮或给几个人做饭时，更高功率出菜更快更均匀。

### 篮式和烤箱式空气炸锅有什么区别？
篮式小批量出脆快、中途好摇匀。带烤架的烤箱式能放平铺大件和更大份量，但多层之间受热没那么均匀。按你最常做的食物来选。`,
    },
  },

  // ───────────────────────── 4. 显示器 ─────────────────────────
  {
    slug: 'monitor-buying-mistakes',
    tags: [COLUMN_TAG, 'monitors', 'tech-electronics', 'computers-peripherals', 'buying-guide'],
    en: {
      title: '7 Monitor Buying Mistakes: When Big Specs Make a Worse Screen',
      summary: `A 27-inch 1080p panel and a 240Hz screen on an office PC are classic monitor mistakes. Here is how resolution, PPI, refresh rate, and panel type really interact — so a bigger number doesn't cost you.`,
      content: `# 7 Monitor Buying Mistakes: When Big Specs Make a Worse Screen

Monitors are sold on headline numbers — inches, Hz, "4K", "HDR". But those numbers only help in the right combination. The most common regrets come from maximizing one spec while ignoring how it interacts with the others.

## Why a Bigger Number Can Mean a Worse Screen

Sharpness isn't resolution — it's **pixel density (PPI)**, which is resolution spread over screen size. Smoothness isn't just refresh rate — it's refresh your GPU can actually feed. Buy one number in isolation and you can easily end up with a screen that looks fuzzy, runs sluggish, or shows colors you can't trust.

### Mistake 1: Mismatching resolution to screen size (low PPI)
A 27-inch 1080p panel spreads too few pixels over too much glass (~82 PPI), so text looks soft and edges fuzzy. Rough sweet spots: **1080p at 24", 1440p at 27", 4K at 32"**. Match the pair, not just the resolution.

### Mistake 2: Chasing refresh rate your GPU can't feed
A 240Hz monitor only helps if your hardware renders near 240 fps in what you actually run. For most non-competitive use, the jump from 60Hz to 144Hz is far more noticeable than 144Hz to 240Hz — spend the difference on resolution or color instead.

### Mistake 3: Ignoring panel type trade-offs
IPS gives the best color and viewing angles; VA gives deeper contrast but can smear in fast motion; OLED gives perfect blacks and speed but carries burn-in risk for static UI. There's no "best" — pick for your use. See [monitor panel guide: IPS vs VA vs OLED](/en/guides/monitor-panel-guide-ips-va-oled).

### Mistake 4: Falling for response-time marketing
A "1ms" claim is usually MPRT (a motion-blur trick), not the GtG pixel-transition that actually governs ghosting. A panel can advertise 1ms and still smear. Treat the headline response-time number with suspicion.

### Mistake 5: Overlooking color gamut and accuracy
If you edit photo or video, "covers sRGB" isn't enough — you may need DCI-P3 or Adobe RGB coverage and a factory color calibration. Conversely, a wide-gamut panel without sRGB clamping can make ordinary content look oversaturated.

### Mistake 6: Believing every "HDR" label
Most cheap monitors carry an HDR sticker but lack the brightness and local dimming to show it. Real HDR needs high peak nits and many dimming zones; without them, enabling HDR can look worse than SDR.

### Mistake 7: Forgetting ergonomics and ports
A screen you can't raise to eye level wrecks your neck. Check for height/tilt adjustment or a **VESA mount**, and confirm the ports (and whether USB-C carries enough power for a laptop).

## Quick Pre-Purchase Checklist

- Resolution matched to size for ~built-in sharpness (1080p/24", 1440p/27", 4K/32")
- Refresh rate your GPU can actually drive in your apps
- Panel type (IPS / VA / OLED) chosen for your use, not by default
- GtG response time, not just a "1ms" MPRT headline
- Color gamut (sRGB vs DCI-P3) matched to creative work, with sRGB mode
- Real HDR (peak nits + dimming zones), or ignore the HDR label
- Height adjustment or VESA mount, and the right ports / USB-C power

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Why does a 27-inch 1080p monitor look blurry?
Because pixel density is too low. Spreading 1080p over 27 inches gives roughly 82 PPI, so text and edges look soft. For sharp built-in clarity, pair resolution to size: 1080p around 24 inches, 1440p around 27 inches, 4K around 32 inches.

### Is a higher refresh rate always better?
Only if your GPU can render frames fast enough to use it. For most non-competitive work, 60Hz to 144Hz is a big, visible jump, while 144Hz to 240Hz is subtle. If your hardware can't feed 240 fps, that money is better spent on resolution or color quality.

### Does a "1ms" response time guarantee no ghosting?
No. A "1ms" claim is usually MPRT, a motion-blur measure, not the GtG pixel-transition time that actually controls ghosting. A monitor can advertise 1ms MPRT and still smear in fast motion, so check the GtG figure.`,
    },
    zh: {
      title: '显示器选购的 7 个误区：大参数为什么反而买到更差的屏',
      summary:
        '27 寸 1080p、给办公电脑配 240Hz，都是经典的显示器误区。本文讲清分辨率、PPI、刷新率、面板类型如何相互作用——别让更大的数字反而坑了你。',
      content: `# 显示器选购的 7 个误区：大参数为什么反而买到更差的屏

显示器靠标题数字卖货——寸数、Hz、"4K"、"HDR"。但这些数字只有在正确的组合里才有用。最常见的后悔，来自把某一个参数堆满，却忽略它和其他参数的相互作用。

## 为什么更大的数字可能是更差的屏

清晰度不等于分辨率——它是**像素密度（PPI）**，也就是分辨率摊在屏幕尺寸上的结果。流畅度也不只是刷新率——而是你显卡真正喂得动的刷新。孤立地买一个数字，你很容易买到一块发虚、卡顿、或颜色不可信的屏。

### 误区一：分辨率与尺寸不匹配（PPI 过低）
27 寸 1080p 是把太少的像素摊在太大的玻璃上（约 82 PPI），文字发虚、边缘毛糙。大致甜点位：**24 寸配 1080p，27 寸配 1440p，32 寸配 4K**。要匹配这一对，而不是只看分辨率。

### 误区二：追显卡喂不动的刷新率
240Hz 只有在你的硬件能把你实际跑的东西渲染到接近 240 帧时才有用。对多数非竞技用途，60Hz 到 144Hz 的提升远比 144Hz 到 240Hz 明显——把差价花在分辨率或色彩上更值。

### 误区三：忽略面板类型的取舍
IPS 色彩和可视角度最好；VA 对比度更深但快速画面易拖影；OLED 纯黑、响应快但静态界面有烧屏风险。没有"最好"——按用途选。见[显示器面板解析：IPS vs VA vs OLED](/zh/guides/monitor-panel-guide-ips-va-oled)。

### 误区四：被响应时间营销忽悠
"1ms"通常是 MPRT（一种运动模糊手法），不是真正决定拖影的 GtG 像素切换时间。一块屏可以标 1ms 却照样拖影。对标题上的响应时间数字保持怀疑。

### 误区五：忽视色域和色准
如果你修图修视频，"覆盖 sRGB"不够——你可能需要 DCI-P3 或 Adobe RGB 覆盖和出厂校色。反过来，没有 sRGB 钳制的广色域屏，会让普通内容看起来过饱和。

### 误区六：相信每一个"HDR"标
多数廉价显示器贴了 HDR 标，却没有展现它所需的亮度和局部调光。真 HDR 需要高峰值亮度（nits）和大量调光分区；没有它们，开 HDR 可能比 SDR 还难看。

### 误区七：忘了人体工学和接口
一块升不到视线高度的屏会毁你的颈椎。看是否能调高度/俯仰，或支持 **VESA 挂架**，并确认接口（以及 USB-C 是否能给笔记本供够电）。

## 选购前快速核对清单

- 分辨率匹配尺寸，自带清晰度（24寸/1080p、27寸/1440p、32寸/4K）
- 刷新率是你显卡在你应用里真正喂得动的
- 面板类型（IPS / VA / OLED）按用途选，而非默认
- 看 GtG 响应时间，而非只看"1ms"的 MPRT 标题
- 色域（sRGB vs DCI-P3）匹配创作需求，并有 sRGB 模式
- 真 HDR（峰值亮度 + 调光分区），否则忽略 HDR 标
- 能调高度或支持 VESA，接口/USB-C 供电对得上

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 为什么 27 寸 1080p 显示器看起来发虚？
因为像素密度太低。把 1080p 摊在 27 寸上大约只有 82 PPI，文字和边缘发软。要自带清晰度，就让分辨率匹配尺寸：1080p 约 24 寸、1440p 约 27 寸、4K 约 32 寸。

### 刷新率越高越好吗？
只有在显卡能渲染出足够帧率来用上它时才好。多数非竞技用途，60Hz 到 144Hz 是明显的大跳跃，而 144Hz 到 240Hz 很细微。硬件喂不动 240 帧，这钱花在分辨率或色彩上更值。

### 标"1ms"响应时间就保证不拖影吗？
不。"1ms"通常是 MPRT 这种运动模糊指标，不是真正控制拖影的 GtG 像素切换时间。一块屏可以标 1ms MPRT 却照样在快速画面拖影，所以要看 GtG 数值。`,
    },
  },

  // ───────────────────────── 5. 人体工学椅 ─────────────────────────
  {
    slug: 'ergonomic-chair-buying-mistakes',
    tags: [COLUMN_TAG, 'ergonomic-chairs', 'home-renovation', 'furniture', 'buying-guide'],
    en: {
      title: `6 Ergonomic Chair Mistakes: Why Price Doesn't Equal Ergonomic`,
      summary: `An expensive chair with nothing you can adjust is not ergonomic — it's just expensive. These are the adjustability and fit mistakes that decide whether a chair actually supports your body.`,
      content: `# 6 Ergonomic Chair Mistakes: Why Price Doesn't Equal Ergonomic

"Ergonomic" means the chair adapts to your body — not that it's pricey or has a dramatic gamer shape. The chairs people regret are usually the ones that look the part but can't be adjusted to fit the person actually sitting in them.

## Why "Ergonomic" Is About Adjustment, Not Price

Bodies differ in height, leg length, and torso width, so a fixed chair can only fit one body well — by luck, maybe not yours. A genuinely ergonomic chair has **independently adjustable** support points so you can dial it to your dimensions. Adjustability, not the price tag, is the spec that matters.

### Mistake 1: Assuming expensive equals ergonomic
A high price can buy nicer materials and a static shape that fits nobody in particular. Without adjustment, an expensive chair is just an expensive fixed chair. Judge it by what you can change, not what it costs.

### Mistake 2: Ignoring whether lumbar support adjusts
A lumbar bump that doesn't move only helps people whose back curve happens to line up with it. Look for lumbar support that adjusts in **both height and depth (firmness)**, so it meets your lower-back curve instead of fighting it.

### Mistake 3: Overlooking seat depth adjustment
If the seat is too deep for your legs, you either perch forward (losing back support) or your knees jam the front edge, cutting circulation. **Seat depth (slide) adjustment** lets you keep two-to-three fingers of clearance behind the knee — critical for taller and shorter people alike.

### Mistake 4: Settling for fixed or limited armrests
Armrests that don't move force your shoulders up or your wrists into a bad angle. The useful standard is **4D armrests** (height, depth, width, and pivot) so your forearms rest level and your shoulders relax. See [ergonomic chair: lumbar, armrest & seat depth](/en/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide).

### Mistake 5: Misjudging mesh vs cushion
Mesh breathes and supports evenly but a cheap, over-tight mesh cuts into your thighs; foam is cushioned but can trap heat and pack down over time. Neither is "best" — match it to your climate and how long you sit.

### Mistake 6: Not checking your size against the chair's range
Every chair has a height and weight range it actually fits well. A chair sized for an average adult won't support someone much taller or heavier. Check the supported range and the warranty (especially on the gas cylinder and mechanism) before buying.

## Quick Pre-Purchase Checklist

- Judge by adjustability, not price or "gaming" looks
- Lumbar support adjustable in height and depth
- Seat depth (slide) adjustment for your leg length
- 4D armrests (height / depth / width / pivot)
- Mesh vs cushion matched to your climate and sitting hours
- Your height/weight within the chair's supported range; check warranty

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Does a more expensive chair mean it's more ergonomic?
No. Ergonomic means the chair adjusts to fit your body. A high price may buy better materials or a fixed shape that suits no one in particular. Without adjustable lumbar, seat depth, and armrests, an expensive chair is just an expensive fixed chair.

### What adjustments actually matter on an ergonomic chair?
The high-impact ones are lumbar support that moves in height and depth, seat depth (slide) adjustment for your leg length, and 4D armrests so your forearms rest level. These let you fit the chair to your body rather than hoping a fixed shape matches it.

### Is a mesh chair better than a cushioned one?
Neither is universally better. Mesh breathes and distributes support evenly but a cheap, over-tight mesh can dig into your thighs. Foam cushions comfortably but can trap heat and compress over time. Choose based on your climate and how many hours you sit.`,
    },
    zh: {
      title: '人体工学椅的 6 个误区：为什么贵不等于符合人体工学',
      summary:
        '一把什么都不能调的贵椅子不是人体工学椅，只是贵而已。本文讲清可调性与贴合度这些误区——它们决定一把椅子是否真的支撑你的身体。',
      content: `# 人体工学椅的 6 个误区：为什么贵不等于符合人体工学

"人体工学"意味着椅子去适应你的身体——不是它贵、也不是它有夸张的电竞造型。让人后悔的椅子，往往是那种看着像、却没法调到贴合真正坐它的人的椅子。

## 为什么"人体工学"看的是可调，而非价格

人的身高、腿长、躯干宽度各不相同，所以固定造型的椅子只能贴合一种身体——碰运气，未必是你。真正的人体工学椅有**可独立调节**的支撑点，让你按自己的尺寸去调。可调性，而非价签，才是关键参数。

### 误区一：以为贵就等于人体工学
高价能买到更好的材质和一个谁都不特别贴合的固定造型。没有调节，贵椅子只是贵的固定椅。按你能改什么来判断它，而非它多少钱。

### 误区二：忽略腰托能否调节
不能动的腰托，只对那些腰曲恰好对得上它的人有用。要找**高度和深度（软硬）都能调**的腰托，让它去迎合你的腰曲，而不是和它较劲。

### 误区三：忽视座深调节
座面对你的腿太深，你要么前倾坐（失去背部支撑），要么膝盖顶住前沿、压迫血液循环。**座深（滑动）调节**让你在膝盖后保留两三指空隙——这对高个和矮个同样关键。

### 误区四：将就固定或受限的扶手
不能动的扶手会逼你耸肩或让手腕处于别扭角度。好用的标准是 **4D 扶手**（高度、前后、宽度、旋转），让小臂水平搁放、肩膀放松。见[人体工学椅：腰托、扶手与座深](/zh/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide)。

### 误区五：误判网布与海绵
网布透气、支撑均匀，但廉价、绷得过紧的网布会勒大腿；海绵有缓冲，却可能闷热、久了会塌陷。没有哪个"最好"——按你的气候和久坐时长来选。

### 误区六：没把自己的身材对照椅子的适配范围
每把椅子都有一个真正贴合的身高体重范围。按平均成人设计的椅子，撑不住明显更高或更重的人。买前看清适配范围和质保（尤其是气压棒和底盘机构）。

## 选购前快速核对清单

- 按可调性判断，而非价格或"电竞"外观
- 腰托高度和深度都能调
- 座深（滑动）调节，匹配你的腿长
- 4D 扶手（高度 / 前后 / 宽度 / 旋转）
- 网布 vs 海绵，匹配你的气候和久坐时长
- 你的身高体重在椅子适配范围内；看清质保

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 椅子越贵就越符合人体工学吗？
不是。人体工学意味着椅子能调节来贴合你的身体。高价或许买到更好的材质，或一个谁都不特别贴合的固定造型。没有可调的腰托、座深和扶手，贵椅子只是贵的固定椅。

### 人体工学椅上哪些调节才真正重要？
影响最大的是：高度和深度都能动的腰托、匹配腿长的座深（滑动）调节、以及让小臂水平搁放的 4D 扶手。它们让你把椅子调到贴合身体，而不是指望一个固定造型恰好合适。

### 网布椅比海绵椅好吗？
没有谁绝对更好。网布透气、支撑均匀，但廉价、绷得过紧的网布会勒大腿。海绵坐感舒适，却可能闷热、久了会压塌。按你的气候和每天久坐的时长来选。`,
    },
  },

  // ───────────────────────── 6. 空气净化器 ─────────────────────────
  {
    slug: 'air-purifier-buying-mistakes',
    tags: [COLUMN_TAG, 'air-purifiers', 'home-appliances', 'buying-guide'],
    en: {
      title: `6 Air Purifier Buying Mistakes: CADR, Room Size & Hidden Filter Costs`,
      summary: `An undersized purifier or a fake-HEPA filter quietly does nothing. These are the CADR, room-size, and filter-cost mistakes that decide whether a purifier actually cleans your air.`,
      content: `# 6 Air Purifier Buying Mistakes: CADR, Room Size & Hidden Filter Costs

An air purifier is one of the few appliances that can run for months while doing almost nothing — and you'd never see it. Whether it actually cleans your air comes down to a few specs that are easy to get wrong, and a running cost most people forget.

## Why an Air Purifier Can Look Like It Works but Doesn't

Purifying is invisible, so a unit that's too weak for the room, or uses a filter that doesn't really capture fine particles, gives you the comfort of a running machine without the result. The numbers that prevent this — **CADR matched to room size**, and **true HEPA** — are the ones to get right before anything else.

### Mistake 1: Buying a unit too small for the room
This is the most common regret. A purifier rated for a tiny room can't clean a large one no matter how long it runs. A common rule of thumb: the **CADR should be at least about two-thirds of the room's floor area** (e.g. a 30 m² / ~300 sq ft room wants a CADR around 200 in those units). Undersize it and the air never really turns over.

### Mistake 2: Trusting "HEPA-type" wording
True HEPA captures **99.97% of particles at 0.3 microns**. Labels like "HEPA-like", "HEPA-type", or "99% at 3 microns" are deliberately weaker and let through the fine particles you care about most. Read the exact wording, not just the word HEPA.

### Mistake 3: Ignoring the ongoing filter cost
The sticker price is only part of it. Replacement filters can cost a meaningful amount and need changing every 6–12 months. A cheap purifier with pricey, frequent filters can cost more over two years than a dearer unit with affordable ones — calculate the **2-year total**, not just the upfront price.

### Mistake 4: Buying ozone generators or relying on ionizers
Ozone generators can irritate your lungs and are not a safe substitute for filtration. Ionizers may make particles clump but can produce some ozone and don't remove much on their own. For particles, mechanical **HEPA filtration** is the dependable mechanism.

### Mistake 5: Overlooking noise on the setting you'll actually use
CADR is rated at the highest, loudest fan speed. If that speed is too loud for a bedroom, you'll run it on low — where its real-world CADR is much smaller. Check the noise level at the speed you'll actually live with, and size up so a quieter setting still clears the room.

### Mistake 6: Forgetting odors and VOCs need carbon
A HEPA filter captures particles but not smells or gases. If you want to reduce cooking odors, smoke, or VOCs, you need a meaningful **activated carbon** stage — and a token sprinkle of carbon won't do it. See our [air purifier CADR rating explained](/en/guides/air-purifier-cadr-rating-explained).

## Quick Pre-Purchase Checklist

- CADR sized to your room (roughly ≥ 2/3 of floor area in matching units)
- True HEPA (99.97% at 0.3 micron), not "HEPA-type" wording
- 2-year filter cost calculated, not just the purchase price
- Mechanical HEPA, not ozone generators or ionizers as the main method
- Noise at the speed you'll actually run, with headroom to size up
- A real activated-carbon stage if odors/VOCs matter

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### What CADR do I need for my room size?
A common rule of thumb is that the CADR should be at least about two-thirds of the room's floor area in matching units — for example a roughly 300 sq ft (28 m²) room wants a CADR near 200. An undersized purifier can't clean a large room no matter how long it runs.

### Is "HEPA-type" the same as true HEPA?
No. True HEPA captures 99.97% of particles at 0.3 microns. Terms like "HEPA-type", "HEPA-like", or "99% at 3 microns" are intentionally weaker and let through the fine particles that matter most. Always read the exact specification, not just the word HEPA.

### Why should I factor in filter replacement cost?
Because it can exceed the purifier's price over time. Replacement filters need changing every 6–12 months and vary widely in cost. A cheap unit with expensive, frequent filters can cost more over two years than a pricier one with affordable filters.`,
    },
    zh: {
      title: '空气净化器的 6 个选购误区：CADR、房间面积与隐藏滤芯成本',
      summary:
        '一台买小了的净化器、或一张假 HEPA 滤网，会悄无声息地什么都不干。本文讲清 CADR、房间面积、滤芯成本这些误区——它们决定净化器是否真在净化。',
      content: `# 空气净化器的 6 个选购误区：CADR、房间面积与隐藏滤芯成本

空气净化器是少数能开几个月却几乎什么都没干、而你完全看不出来的家电之一。它到底有没有在净化，取决于几个容易搞错的参数，以及一笔多数人会忘记的使用成本。

## 为什么净化器看着在工作、其实没用

净化是看不见的，所以一台对房间来说太弱、或用了根本抓不住细颗粒的滤网的机器，会给你"机器在转"的安慰，却没有结果。能防止这点的数字——**CADR 匹配房间面积**和**真 HEPA**——是最该先搞对的。

### 误区一：买的机器对房间来说太小
这是最常见的后悔。标称适用小房间的净化器，无论开多久都净化不了大房间。常用的经验法则：**CADR 至少约为房间面积的三分之二**（例如约 30 ㎡ 的房间，对应 CADR 在 200 上下，单位需一致）。买小了，空气永远没真正循环过一遍。

### 误区二：相信"HEPA 型"这类措辞
真 HEPA 能拦截 **0.3 微米颗粒的 99.97%**。"类 HEPA""HEPA 型""3 微米下 99%"这类标法是故意更弱的，会放过你最在意的细颗粒。读准确措辞，别只看到 HEPA 这个词。

### 误区三：忽略持续的滤芯成本
标价只是其中一部分。替换滤芯可能不便宜，且每 6–12 个月就要换。一台便宜但滤芯贵又换得勤的净化器，两年下来可能比贵一点、滤芯实惠的更花钱——算**两年总成本**，别只看前期价格。

### 误区四：买臭氧发生器或依赖负离子
臭氧发生器可能刺激肺部，不是安全的过滤替代品。负离子或许让颗粒团聚，但可能产生一些臭氧，自身去除能力也有限。对付颗粒，机械式 **HEPA 过滤**才是可靠机制。

### 误区五：忽略你实际会用的档位下的噪音
CADR 是在最高、最吵的风速下测的。如果那档对卧室太吵，你会开低档——而低档的实际 CADR 小得多。看你真正能接受的档位下的噪音，并买大一号，让更安静的档位也能净化整个房间。

### 误区六：忘了异味和 VOC 需要活性炭
HEPA 滤网拦截颗粒，但拦不住气味和气体。想减少油烟味、烟味或 VOC，你需要有分量的**活性炭**层——象征性撒一点炭是不够的。见我们的[空气净化器 CADR 解析](/zh/guides/air-purifier-cadr-rating-explained)。

## 选购前快速核对清单

- CADR 匹配你的房间（大致 ≥ 面积的 2/3，单位一致）
- 真 HEPA（0.3 微米 99.97%），而非"HEPA 型"措辞
- 算清两年滤芯成本，而非只看购买价
- 以机械 HEPA 为主，而非臭氧发生器或负离子
- 看你实际会开的档位下的噪音，并留余量买大一号
- 在意异味/VOC，就要有真正分量的活性炭层

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 我的房间需要多大的 CADR？
常用经验法则是 CADR 至少约为房间面积的三分之二（单位一致）——例如约 28 ㎡（300 平方英尺）的房间，对应 CADR 接近 200。买小了的净化器，无论开多久都净化不了大房间。

### "HEPA 型"和真 HEPA 一样吗？
不一样。真 HEPA 拦截 0.3 微米颗粒的 99.97%。"HEPA 型""类 HEPA""3 微米下 99%"这类说法是故意更弱的，会放过最关键的细颗粒。永远读准确规格，别只看 HEPA 这个词。

### 为什么要把滤芯更换成本算进去？
因为它长期下来可能超过净化器本身的价格。替换滤芯每 6–12 个月就要换，成本差异很大。一台便宜但滤芯贵又换得勤的机器，两年可能比贵一点、滤芯实惠的更花钱。`,
    },
  },

  // ───────────────────────── 7. 降噪耳机 ─────────────────────────
  {
    slug: 'noise-cancelling-headphone-buying-mistakes',
    tags: [COLUMN_TAG, 'anc-headphones', 'tech-electronics', 'buying-guide'],
    en: {
      title: `6 Noise-Cancelling Headphone Mistakes: ANC Isn't One Number`,
      summary: `Strong ANC on a spec sheet can still leave you hearing voices, or give you a pressure headache. These are the mistakes about ANC type, fit, codecs, and comfort that decide real-world quiet.`,
      content: `# 6 Noise-Cancelling Headphone Mistakes: ANC Isn't One Number

"Active noise cancelling" gets sold as a single strength rating, but quiet in the real world depends on what kind of noise you face, how well the headphone seals, and trade-offs the box never mentions. Here's where the money gets wasted.

## Why ANC Strength Alone Doesn't Predict Quiet

ANC works best on **low, steady drones** — engines, fans, AC hum — and far less on sudden, high-pitched sound like nearby speech. On top of that, a headphone that doesn't seal to your ears leaks noise no electronics can cancel. So the spec-sheet "strength" tells you only part of the story.

### Mistake 1: Expecting ANC to silence voices
ANC excels at constant low-frequency drone but struggles with irregular high-frequency sound — including the office chatter people most want gone. If voices are your problem, prioritize physical seal and isolation, and set realistic expectations for the electronics.

### Mistake 2: Ignoring fit and seal (especially in-ear)
For in-ear models, the ear-tip seal does much of the noise blocking and shapes the bass. The wrong tip size leaks both. For over-ear, glasses arms and clamp force break the seal. A great ANC chip can't fix a bad seal — fit is part of the spec.

### Mistake 3: Overlooking ANC "pressure" discomfort
Strong ANC can create a sensation of ear pressure or mild headache for some people on long wears. If you're sensitive, look for adjustable ANC levels or a model known for a gentler pressure feel, and try before committing to all-day use.

### Mistake 4: Misunderstanding Bluetooth codecs
A codec is just the compression used over Bluetooth; both your headphone and your device must support the same one. A high-resolution codec on the headphone does nothing if your phone doesn't speak it. Match the codec to your device — see [Bluetooth audio codecs explained](/en/guides/bluetooth-audio-codecs-explained).

### Mistake 5: Forgetting transparency mode and calls
If you'll wear these on a street or in an office, a good **transparency/ambient mode** (to hear traffic or a colleague without removing them) matters as much as ANC. Call quality depends on the mics, which is a separate thing from how well ANC blocks noise for you.

### Mistake 6: Buying on ANC and ignoring everything else you'll feel daily
Clamp comfort over hours, weight, battery life, and whether they fold to travel are what you actually live with. The best ANC is unpleasant if the headphone hurts after an hour. See our [noise-cancelling headphone ANC & audio guide](/en/guides/noise-cancelling-headphone-anc-audio-guide).

## Quick Pre-Purchase Checklist

- Realistic ANC expectations: great on drone, weaker on voices
- Correct ear-tip size (in-ear) or a seal that survives glasses (over-ear)
- ANC pressure comfort if you're sensitive; adjustable levels help
- Bluetooth codec supported by your actual device
- Useful transparency mode and decent call mics if you go outside
- All-day comfort: clamp, weight, battery, foldability

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Why does ANC block engine noise but not voices?
Active noise cancelling works best on constant, low-frequency drone like engines, fans, and AC hum. It struggles with sudden, high-frequency, irregular sound such as nearby speech. If blocking voices is your goal, prioritize physical seal and isolation, and keep realistic expectations of the electronics.

### Does the ear-tip or fit really affect noise cancelling?
Yes, a lot. Especially for in-ear models, the ear-tip seal does much of the actual noise blocking and shapes the bass. The wrong tip size leaks both noise and low end. For over-ear, anything that breaks the seal — like glasses arms — reduces isolation that no chip can recover.

### Does a high-end Bluetooth codec always improve sound?
Only if your playback device supports the same codec. A codec is the compression used over Bluetooth, and both headphone and source must speak it. A high-resolution codec on the headphone does nothing if your phone doesn't support it, so match the codec to your device.`,
    },
    zh: {
      title: '降噪耳机的 6 个选购误区：降噪不是一个数字',
      summary:
        '规格表上很强的降噪，仍可能让你听见人声，或带来压迫性头痛。本文讲清降噪类型、佩戴密封、编解码、舒适度这些决定真实安静的误区。',
      content: `# 降噪耳机的 6 个选购误区：降噪不是一个数字

"主动降噪"常被当成一个强度数字来卖，但现实中的安静取决于你面对的是哪种噪音、耳机的密封有多好、以及盒子上从不提的取舍。钱往往就浪费在这里。

## 为什么单看降噪强度预测不了安静

降噪对**低沉、稳定的轰鸣**最有效——引擎、风扇、空调嗡嗡声——对突发的高频声（如旁边的说话声）效果差得多。再加上，密封不到位的耳机会漏进任何电路都消不掉的噪音。所以规格表上的"强度"只说了一部分。

### 误区一：指望降噪消掉人声
降噪擅长持续的低频轰鸣，但对不规则的高频声很吃力——包括人们最想消掉的办公室交谈。如果你的困扰是人声，优先看物理密封和被动隔音，并对电路抱合理预期。

### 误区二：忽略佩戴和密封（尤其入耳式）
入耳式靠耳塞密封完成大部分隔音，也塑造低音。耳塞尺寸不对，两者都漏。头戴式则会被眼镜腿和夹力破坏密封。再好的降噪芯片也救不了糟糕的密封——贴合本身就是规格的一部分。

### 误区三：忽视降噪"压迫感"不适
强降噪会让一些人长时间佩戴时产生耳压感或轻微头痛。如果你敏感，找降噪强度可调、或以压迫感更柔和著称的型号，并在决定全天使用前先试戴。

### 误区四：误解蓝牙编解码
编解码只是蓝牙传输用的压缩方式；你的耳机和设备必须支持同一种。耳机支持高解析编解码，但你手机不支持，就毫无意义。让编解码匹配你的设备——见[蓝牙音频编解码解析](/zh/guides/bluetooth-audio-codecs-explained)。

### 误区五：忘了通透模式和通话
如果你会在街上或办公室戴，好的**通透/环境模式**（不摘耳机就能听见车流或同事）和降噪一样重要。通话质量取决于麦克风，这和降噪对你隔音的好坏是两回事。

### 误区六：只盯降噪，忽略你每天真正会感受的一切
长时间的夹力舒适度、重量、续航、能否折叠便携，才是你日常要承受的。如果耳机戴一小时就疼，再好的降噪也难受。见我们的[降噪耳机 ANC 与音质指南](/zh/guides/noise-cancelling-headphone-anc-audio-guide)。

## 选购前快速核对清单

- 对降噪抱合理预期：擅长轰鸣，对人声较弱
- 正确的耳塞尺寸（入耳）或经得起眼镜的密封（头戴）
- 敏感的话看降噪压迫感舒适度；可调强度有帮助
- 蓝牙编解码要被你的实际设备支持
- 常出门就看好用的通透模式和过得去的通话麦克
- 全天舒适度：夹力、重量、续航、可折叠

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 为什么降噪能挡引擎声、却挡不住人声？
主动降噪对引擎、风扇、空调嗡嗡这类持续低频轰鸣最有效，对突发、高频、不规则的声音（如旁边说话）很吃力。如果你的目标是挡人声，优先看物理密封和被动隔音，并对电路保持合理预期。

### 耳塞或佩戴真的影响降噪吗？
影响很大。尤其入耳式，耳塞密封完成大部分实际隔音，也塑造低音。耳塞尺寸不对，噪音和低频都会漏。头戴式则任何破坏密封的因素（如眼镜腿）都会削弱隔音，芯片无法弥补。

### 高端蓝牙编解码一定提升音质吗？
只有在你的播放设备也支持同一编解码时才会。编解码是蓝牙传输用的压缩方式，耳机和音源必须都支持。耳机支持高解析编解码，但手机不支持就毫无作用，所以要让编解码匹配你的设备。`,
    },
  },

  // ───────────────────────── 8. 笔记本电脑 ─────────────────────────
  {
    slug: 'laptop-buying-mistakes',
    tags: [COLUMN_TAG, 'laptops', 'tech-electronics', 'computers-peripherals', 'buying-guide'],
    en: {
      title: `7 Laptop Buying Mistakes: Specs That Look Good on Paper`,
      summary: `A high core count that throttles, 8GB of soldered RAM, a dim screen — laptops hide their worst traits behind good-looking spec lines. Here are the mistakes that bite months later.`,
      content: `# 7 Laptop Buying Mistakes: Specs That Look Good on Paper

Laptops are the easiest device to mis-buy, because the spec sheet hides exactly the things you'll feel every day: sustained performance, whether you can upgrade, screen quality, and battery reality. Here are the traps.

## Why the Spec Sheet Doesn't Tell You How It'll Feel

A laptop's listed chip, RAM, and storage are a starting point, not the experience. Two laptops with the "same" CPU can perform very differently depending on cooling and power limits, and the parts you can't upgrade later quietly cap the machine's lifespan. The experience lives in the details below.

### Mistake 1: Reading the CPU name without the power limit
The same chip name can run at very different sustained power (TDP) in different chassis. A thin laptop may throttle that chip to stay cool, so it loses to a thicker one with the "same" CPU under load. See [laptop performance & TDP explained](/en/guides/laptop-performance-tdp-guide).

### Mistake 2: Buying too little RAM — when it's soldered
8GB feels fine in the store and chokes a year later with a browser and a few apps. The trap is that much modern RAM is **soldered and not upgradeable**, so you must buy enough up front. Check whether RAM is socketed before deciding how much you need.

### Mistake 3: Ignoring storage type and upgradeability
A slow drive makes a fast CPU feel sluggish on every boot and load. Prefer **NVMe SSD** over slower storage, and check if there's a spare slot or a socketed drive you can expand later. See our [laptop upgrade & repair guide](/en/guides/laptop-upgrade-repair-guide).

### Mistake 4: Overlooking the screen you'll stare at all day
A dim, low-contrast panel is the spec people regret most after the novelty fades. Look at **brightness (nits)** for your environment, resolution for sharpness, and sRGB coverage if color matters — the panel is half your daily experience.

### Mistake 5: Trusting the headline battery figure
Quoted battery life is measured in gentle conditions that don't match your real brightness and workload. A big number on a power-hungry chip with a small battery still dies early. Weigh battery capacity (Wh) against the components' draw, not the marketing hours.

### Mistake 6: Forgetting weight, ports, and the charger
A powerful laptop you don't carry because it's heavy is the wrong laptop. Check real travel weight, whether it charges over USB-C (one less brick), and that it has the ports you need instead of a bag of dongles. Match the machine to use case — see [laptop buying guide by use case](/en/guides/laptop-buying-guide-by-use-case).

### Mistake 7: Paying for a discrete GPU you won't use
A gaming GPU adds cost, weight, heat, and fan noise, and shortens battery life. If you don't game or do GPU work, integrated graphics may serve you better on every other axis. Buy the GPU your actual workload needs.

## Quick Pre-Purchase Checklist

- CPU judged with its sustained power (TDP) in that chassis, not just the name
- Enough RAM up front — especially if it's soldered and non-upgradeable
- NVMe SSD, and a spare/socketed slot if you may expand later
- Screen brightness, resolution, and color for your daily environment
- Battery capacity (Wh) weighed against component draw, not quoted hours
- Real weight, USB-C charging, and the ports you actually need
- A discrete GPU only if your workload truly uses it

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Why can two laptops with the same CPU perform differently?
Because sustained power (TDP) and cooling differ by chassis. A thin laptop often throttles the chip to stay cool, so under sustained load it loses to a thicker laptop with the "same" CPU. Always read the power limit and cooling, not just the processor name.

### How much RAM should I buy if it's soldered?
Enough to last the life of the machine, because soldered RAM can't be upgraded later. 8GB can feel fine in a store but struggle within a year under a browser and several apps. If the RAM is socketed you have flexibility; if it's soldered, buy generously up front.

### Is the quoted battery life accurate?
Usually optimistic. Quoted hours come from gentle test conditions that don't match your real brightness and workload. A large number paired with a power-hungry chip and a small battery still ends early. Weigh battery capacity in watt-hours against the components' power draw.`,
    },
    zh: {
      title: '笔记本电脑的 7 个选购误区：纸面上很好看的参数',
      summary:
        '会降频的高核心数、焊死的 8GB 内存、一块暗屏——笔记本把最糟的特性藏在好看的参数行后面。本文讲清那些几个月后才咬你一口的误区。',
      content: `# 笔记本电脑的 7 个选购误区：纸面上很好看的参数

笔记本是最容易买错的设备，因为规格表恰好藏住了你每天都会感受到的东西：持续性能、能否升级、屏幕素质、真实续航。下面是这些陷阱。

## 为什么规格表说明不了它用起来什么样

笔记本标的芯片、内存、存储只是起点，不是体验。两台"同款"CPU 的笔记本，因散热和功耗墙不同，性能可能差很多；而那些之后没法升级的部件，会悄悄限制这台机器的寿命。体验藏在下面的细节里。

### 误区一：只看 CPU 名字，不看功耗墙
同一个芯片名，在不同机身里能跑出差很多的持续功耗（TDP）。轻薄本可能为压温度而把芯片降频，于是在重载下输给"同款"CPU 的厚机型。见[笔记本性能与 TDP 解析](/zh/guides/laptop-performance-tdp-guide)。

### 误区二：内存买太少——而它还是焊死的
8GB 在店里感觉够用，一年后开个浏览器加几个应用就卡。陷阱在于现在很多内存是**焊死、不可升级**的，所以你必须一次买够。先确认内存是不是板载，再决定要买多少。

### 误区三：忽略存储类型和可升级性
慢硬盘会让快 CPU 在每次开机和加载时都显得迟钝。优先选 **NVMe SSD** 而非更慢的存储，并看是否有空余插槽或可换的硬盘供日后扩容。见我们的[笔记本升级与维修指南](/zh/guides/laptop-upgrade-repair-guide)。

### 误区四：忽视你要盯一整天的屏幕
一块暗、低对比的屏，是新鲜感退去后最让人后悔的参数。看适合你环境的**亮度（nits）**、决定清晰度的分辨率、在意色彩就看 sRGB 覆盖——屏幕是你每日体验的一半。

### 误区五：相信标称续航数字
标称续航是在不符合你真实亮度和负载的温和条件下测的。一个大数字配上耗电芯片和小电池，照样早早没电。用电池容量（Wh）对比部件的功耗去权衡，而非营销里的小时数。

### 误区六：忘了重量、接口和充电器
一台因为重而你不带出门的强本，就是错的本。看真实出行重量、能否用 USB-C 充电（少一块砖）、以及有没有你需要的接口而不是一包转接头。让机器匹配用途——见[按用途的笔记本选购指南](/zh/guides/laptop-buying-guide-by-use-case)。

### 误区七：为用不上的独立显卡买单
游戏独显增加成本、重量、发热和风扇噪音，还缩短续航。如果你不打游戏、不做 GPU 工作，核显可能在其他每个维度都更适合你。按你实际的负载来买显卡。

## 选购前快速核对清单

- CPU 要结合它在该机身里的持续功耗（TDP）判断，而非只看名字
- 一次买够内存——尤其当它焊死、不可升级时
- NVMe SSD，若日后可能扩容就看空余/可换插槽
- 屏幕亮度、分辨率、色彩匹配你的日常环境
- 用电池容量（Wh）对比部件功耗去权衡，而非标称小时
- 真实重量、USB-C 充电、以及你真正需要的接口
- 只有负载真用得上时才上独立显卡

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 为什么两台同款 CPU 的笔记本性能会不同？
因为持续功耗（TDP）和散热因机身而异。轻薄本常为压温度而给芯片降频，于是在持续重载下输给"同款"CPU 的厚机型。永远读功耗墙和散热，而非只看处理器名字。

### 内存焊死的话该买多少？
要买够用整台机器寿命的量，因为焊死的内存之后无法升级。8GB 在店里可能够用，一年内开浏览器加几个应用就吃力。如果内存是板载可换，你有余地；如果焊死，就一次买足。

### 标称续航准确吗？
通常偏乐观。标称小时来自温和的测试条件，不符合你真实的亮度和负载。一个大数字配上耗电芯片和小电池，照样早早没电。用电池容量（瓦时）对比部件功耗来权衡。`,
    },
  },

  // ───────────────────────── 9. 电动牙刷 ─────────────────────────
  {
    slug: 'electric-toothbrush-buying-mistakes',
    tags: [COLUMN_TAG, 'oral-care', 'home-appliances', 'personal-care-devices', 'buying-guide'],
    en: {
      title: `6 Electric Toothbrush Mistakes: Pressure Sensors Over Speed Numbers`,
      summary: `More vibrations per minute won't clean your teeth better — and brushing too hard can hurt your gums. These are the spec mistakes that matter for an electric toothbrush.`,
      content: `# 6 Electric Toothbrush Mistakes: Pressure Sensors Over Speed Numbers

Electric toothbrushes are marketed on big movement-per-minute numbers, but the features that actually protect your teeth and gums are quieter ones. Here's what to weigh instead of the headline speed.

## Why a Bigger Speed Number Doesn't Mean Cleaner Teeth

Past a point, more movements per minute give diminishing returns; technique and coverage matter more. The features that genuinely change outcomes — a **pressure sensor** to stop you scrubbing too hard, a **timer** for even coverage, and the right brush head — rarely lead the marketing. Buy for those, not the speed.

### Mistake 1: Chasing the movements-per-minute number
Above a reasonable level, more vibrations or rotations don't clean meaningfully better. The big number is a marketing lever. Cleaning comes from consistent coverage and not pressing too hard — not from chasing the highest speed.

### Mistake 2: Skipping the pressure sensor
Brushing too hard wears enamel and recedes gums over time — and most people don't feel they're doing it. A **pressure sensor** that warns or eases off when you press too hard protects your gums far more than any speed spec. For many buyers this is the single most useful feature.

### Mistake 3: Ignoring the timer / quadrant pacing
A built-in timer (and a quadrant pacer that nudges you every 30 seconds) is what gets you to even, full coverage instead of over-brushing the front teeth and neglecting the back. It's a small feature that changes your actual results.

### Mistake 4: Forgetting the long-term brush-head cost
The handle is a one-time cost; **replacement brush heads every ~3 months are forever**. Proprietary heads can be expensive and lock you in. Check head availability and price before buying — it can dwarf the handle's cost over years. See our [electric toothbrush technology guide](/en/guides/electric-toothbrush-technology-guide).

### Mistake 5: Overpaying for app and mode gimmicks
Bluetooth tracking, a dozen modes, and a travel case sound nice but rarely change how clean your teeth get. The fundamentals — pressure sensor, timer, comfortable head — matter more than a long feature list.

### Mistake 6: Picking the wrong action or head for your mouth
Oscillating-rotating and sonic actions feel and perform differently; sensitive gums or dental work may favor one. Brush-head size and softness matter for reach and comfort. See [oscillating vs sonic & pressure](/en/guides/electric-toothbrush-oscillating-sonic-pressure-guide), and if you floss-by-water, [toothbrush + water flosser](/en/guides/electric-toothbrush-water-flosser-guide).

## Quick Pre-Purchase Checklist

- A pressure sensor (protects gums more than any speed number)
- A timer and quadrant pacing for even coverage
- Replacement head price and availability over years, not just handle price
- Action type (oscillating-rotating vs sonic) suited to your gums/teeth
- Brush-head size and softness for reach and comfort
- Skip paying mainly for app tracking and extra modes

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### Do more vibrations per minute clean teeth better?
Only up to a point. Past a reasonable level, extra movements per minute give diminishing returns, and the big number is mostly a marketing lever. Even coverage and not pressing too hard determine cleanliness far more than chasing the highest speed.

### Is a pressure sensor on an electric toothbrush worth it?
For most people, yes — it's one of the most useful features. Brushing too hard wears enamel and recedes gums over time, and most people don't notice they're doing it. A pressure sensor that warns or eases off protects your gums more than any speed spec.

### What's the real long-term cost of an electric toothbrush?
The replacement brush heads. The handle is a one-time purchase, but heads need replacing roughly every three months for the life of the brush. Proprietary heads can be pricey, so check their cost and availability before buying — over years they can exceed the handle's price.`,
    },
    zh: {
      title: '电动牙刷的 6 个选购误区：压力传感器比转速数字更重要',
      summary:
        '每分钟振动更多并不会把牙刷得更干净——而且刷太用力会伤牙龈。本文讲清电动牙刷真正该看的参数误区。',
      content: `# 电动牙刷的 6 个选购误区：压力传感器比转速数字更重要

电动牙刷靠每分钟运动次数的大数字卖货，但真正保护你牙齿和牙龈的功能，反而是那些不起眼的。下面是该权衡的东西，而非标题上的速度。

## 为什么更大的速度数字不等于刷得更干净

过了某个点，每分钟运动更多带来的收益递减；手法和覆盖更重要。真正改变结果的功能——提醒你别刷太用力的**压力传感器**、保证均匀覆盖的**计时器**、以及合适的刷头——很少出现在营销重点里。为这些买，而非为速度。

### 误区一：追每分钟运动次数
过了合理水平，更多振动或旋转并不会刷得明显更干净。大数字是营销杠杆。干净来自一致的覆盖和不过度施压——而非追求最高速度。

### 误区二：跳过压力传感器
刷太用力会磨损牙釉质、长期导致牙龈退缩——而多数人感觉不到自己在这么做。在你压太重时发出警示或自动减力的**压力传感器**，对牙龈的保护远胜任何速度参数。对很多人来说这是最有用的一个功能。

### 误区三：忽视计时器/分区提醒
内置计时器（以及每 30 秒提醒你换区的分区节拍）能让你做到均匀、完整的覆盖，而不是把门牙刷过头、后牙被冷落。这是个改变你实际效果的小功能。

### 误区四：忘了刷头的长期成本
手柄是一次性成本；**每约 3 个月换一次的替换刷头是永久开销**。专用刷头可能很贵并把你锁定。买前查刷头的供应和价格——多年累计可能远超手柄本身。见我们的[电动牙刷技术指南](/zh/guides/electric-toothbrush-technology-guide)。

### 误区五：为 App 和模式噱头多花钱
蓝牙追踪、一打模式、旅行盒听着不错，但很少改变你牙齿刷得有多干净。基本功——压力传感器、计时器、舒适的刷头——比一长串功能更重要。

### 误区六：选错适合你口腔的动作或刷头
旋转摆动式和声波式的手感与表现不同；敏感牙龈或有牙科修复可能更适合其中一种。刷头大小和软硬影响触及和舒适。见[旋转摆动 vs 声波与压力](/zh/guides/electric-toothbrush-oscillating-sonic-pressure-guide)，若你用冲牙器，见[牙刷 + 冲牙器](/zh/guides/electric-toothbrush-water-flosser-guide)。

## 选购前快速核对清单

- 压力传感器（对牙龈的保护胜过任何速度数字）
- 计时器和分区提醒，保证均匀覆盖
- 看多年的替换刷头价格与供应，而非只看手柄价
- 动作类型（旋转摆动 vs 声波）适合你的牙龈/牙齿
- 刷头大小和软硬，兼顾触及和舒适
- 别主要为 App 追踪和额外模式买单

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 每分钟振动更多就能把牙刷得更干净吗？
只在一定限度内。过了合理水平，每分钟多出的运动收益递减，大数字多半是营销杠杆。均匀覆盖和不过度施压对清洁度的影响，远大于追求最高速度。

### 电动牙刷的压力传感器值得吗？
对多数人值得——这是最有用的功能之一。刷太用力会磨损釉质、长期导致牙龈退缩，而多数人察觉不到自己在这么做。会警示或自动减力的压力传感器，对牙龈的保护胜过任何速度参数。

### 电动牙刷真正的长期成本是什么？
替换刷头。手柄是一次性购买，但刷头在牙刷的整个使用期里大约每三个月就要换。专用刷头可能很贵，所以买前查它的成本和供应——多年累计可能超过手柄的价格。`,
    },
  },

  // ───────────────────────── 10. 加湿器 ─────────────────────────
  {
    slug: 'humidifier-buying-mistakes',
    tags: [COLUMN_TAG, 'dehumidifiers-humidifiers', 'home-appliances', 'buying-guide'],
    en: {
      title: `6 Humidifier Buying Mistakes: White Dust, Mold & the Wrong Type`,
      summary: `The wrong humidifier coats your room in white dust, breeds mold, or can't keep up with the space. These are the type, sizing, and maintenance mistakes to avoid.`,
      content: `# 6 Humidifier Buying Mistakes: White Dust, Mold & the Wrong Type

A humidifier seems simple, but the wrong choice shows up fast: a film of white dust on your furniture, a musty mold smell, or a tank you're refilling three times a day. Most of it comes down to picking the wrong type and size for your situation.

## Why the Type and Maintenance Matter More Than the Price

Humidifiers differ in how they make mist, and each type has a specific failure mode — white dust, burns, noise, or mold. The right pick depends on your water, your room, and how much cleaning you'll actually do. Get the **type** and **sizing** right, and keep it clean, and most regrets disappear.

### Mistake 1: Ignoring white dust from hard water (ultrasonic)
Ultrasonic humidifiers are quiet and efficient but mist your tap water's minerals into the air as a fine **white dust** that settles on everything. With hard water, you'll need distilled water or a demineralization cartridge — or a different type. Don't overlook this if your water is hard.

### Mistake 2: Picking the wrong type for your needs
Evaporative (wick) types self-regulate humidity and won't over-humidify, but the wick needs regular replacement. Warm-mist (boiling) types are sterile and mineral-free but use more power and pose a **burn risk near children**. Ultrasonic is quiet and cheap to run but raises the white-dust issue. Match the mechanism to your priorities.

### Mistake 3: Buying the wrong size for the room
Too small and it can't raise humidity in a large room and you refill constantly; too large in a small room and you over-humidify, inviting condensation and mold. Match **tank size and output** to your room, and ideally pick one with a humidistat to hold a target level.

### Mistake 4: Skipping the humidistat — and over-humidifying
Running a humidifier blindly can push a room well past a healthy range (about **40–60% relative humidity**). Too-high humidity grows mold and dust mites. A built-in **humidistat** that holds a set level prevents both the dryness and the damp-mold extreme.

### Mistake 5: Underestimating cleaning and mold risk
Any humidifier left with standing water becomes a mold and bacteria source that it then sprays into your air. Look for a **wide tank opening** and simple shape you can actually scrub, and budget the time to clean it regularly — this is the maintenance people quit on.

### Mistake 6: Forgetting noise and filter/cartridge costs
A unit in a bedroom needs to be quiet on the setting you'll run overnight. And wicks, filters, or demineralization cartridges are recurring costs. As with [dehumidifiers and humidifiers](/en/guides/dehumidifier-humidifier-buying-guide), factor consumables and noise, not just the sticker price.

## Quick Pre-Purchase Checklist

- White-dust risk considered if you have hard water (ultrasonic)
- Type (evaporative / warm-mist / ultrasonic) matched to your priorities and safety
- Tank size and output sized to your room — not too big for a small space
- A humidistat to hold ~40–60% and avoid over-humidifying
- Wide opening / simple shape you can actually clean to prevent mold
- Quiet on the overnight setting; recurring wick/cartridge costs counted

Browse other categories in the [pitfall guides column](/en/pitfalls).

## FAQ

### What causes white dust from a humidifier?
Ultrasonic humidifiers mist the minerals in hard tap water into the air, where they settle as a fine white dust on surfaces. Using distilled water or a demineralization cartridge reduces it, or you can choose an evaporative or warm-mist type that doesn't disperse minerals the same way.

### What humidity level should I aim for?
Roughly 40–60% relative humidity is the healthy range. Below it, the air feels dry; above it, you risk condensation, mold, and dust mites. A built-in humidistat that holds a set level is the easiest way to stay in range and avoid over-humidifying.

### Which humidifier type is best?
There's no single best — each has a trade-off. Evaporative self-regulates but needs wick changes; warm-mist is sterile but uses more power and poses a burn risk near children; ultrasonic is quiet and cheap to run but can spread white dust with hard water. Match the type to your water, room, and safety needs.`,
    },
    zh: {
      title: '加湿器的 6 个选购误区：白粉、霉菌与选错类型',
      summary:
        '选错加湿器会给满屋家具铺一层白粉、滋生霉菌、或带不动房间。本文讲清类型、容量、维护这些该避开的误区。',
      content: `# 加湿器的 6 个选购误区：白粉、霉菌与选错类型

加湿器看着简单，但选错很快就显形：家具上一层白粉、一股发霉的味道、或一天要加三次水的水箱。这些大多归结于没为你的情况选对类型和容量。

## 为什么类型和维护比价格更重要

加湿器产生雾气的方式不同，每种类型都有特定的失败模式——白粉、烫伤、噪音或霉菌。正确的选择取决于你的水质、房间、以及你实际会做多少清洁。把**类型**和**容量**选对、并保持清洁，多数后悔就消失了。

### 误区一：忽略硬水带来的白粉（超声波式）
超声波加湿器安静、高效，但会把自来水里的矿物质雾化进空气，变成一层细**白粉**落在所有东西上。水硬的话，你得用蒸馏水或加除矿滤芯——或换个类型。如果你家水硬，别忽视这点。

### 误区二：为你的需求选错类型
蒸发（湿芯）式能自调湿度、不会过度加湿，但湿芯要定期更换。暖雾（煮沸）式无菌、无矿物，但更耗电，且**在儿童附近有烫伤风险**。超声波安静、运行便宜，但有白粉问题。让机制匹配你的优先级。

### 误区三：为房间买错容量
太小则在大房间提不起湿度、你得不停加水；在小房间用太大则过度加湿，招来冷凝和霉菌。让**水箱容量和雾量**匹配你的房间，最好选带湿度控制、能维持目标值的。

### 误区四：跳过湿度控制——结果过度加湿
盲目开加湿器会把房间推到远超健康范围（约 **40–60% 相对湿度**）。湿度过高会长霉菌和尘螨。内置、能维持设定值的**湿度控制器**，能同时避免干燥和潮湿发霉两个极端。

### 误区五：低估清洁和霉菌风险
任何留着积水的加湿器都会变成霉菌和细菌的来源，然后把它们喷进你的空气。找**宽水箱开口**和你真能刷洗的简单形状，并留出定期清洁的时间——这正是人们半途放弃的维护。

### 误区六：忘了噪音和滤芯/滤棒成本
卧室里的机器，在你整夜会用的档位下要够安静。而湿芯、滤网或除矿滤芯是持续开销。和[除湿/加湿器](/zh/guides/dehumidifier-humidifier-buying-guide)一样，要算上耗材和噪音，而非只看标价。

## 选购前快速核对清单

- 水硬就考虑白粉风险（超声波式）
- 类型（蒸发 / 暖雾 / 超声波）匹配你的优先级和安全
- 水箱容量和雾量匹配房间——别给小空间买太大
- 用湿度控制器维持约 40–60%，避免过度加湿
- 宽开口/简单形状，你真能清洁以防霉
- 整夜档位够安静；算上持续的湿芯/滤芯成本

其他品类见[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 加湿器的白粉是怎么来的？
超声波加湿器把硬自来水里的矿物质雾化进空气，落在表面变成细白粉。用蒸馏水或除矿滤芯能减少它，或者选蒸发式、暖雾式这类不会同样扩散矿物质的类型。

### 湿度该维持在多少？
大致 40–60% 相对湿度是健康范围。低于它空气发干；高于它则有冷凝、霉菌和尘螨的风险。内置、能维持设定值的湿度控制器，是保持在范围内、避免过度加湿最省事的方式。

### 哪种类型的加湿器最好？
没有唯一最好——每种都有取舍。蒸发式能自调但要换湿芯；暖雾式无菌但更耗电、在儿童附近有烫伤风险；超声波安静、运行便宜但硬水下会散白粉。让类型匹配你的水质、房间和安全需求。`,
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
if (!DRY) console.log(`\n完成：成功 ${ok}，失败 ${fail}（共 ${articles.length} 篇 × 2 语言）`)

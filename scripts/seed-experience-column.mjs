#!/usr/bin/env node
/**
 * seed-experience-column.mjs
 *
 * 「商品体验」角度文章（双语）：讲"长期使用/拥有它真实是什么样、到底值不值"，
 * 区隔于 *-buying-guide（买什么）与 *-buying-mistakes（别犯什么错）。吃 "long term
 * review / is X worth it / 用了一年" 长尾。
 * - tags 带标记 'experience-guide'（分组，供未来专栏；已并入 TAG_BLOCKLIST 不收录薄聚合页、
 *   且在可见 chip 中过滤）+ 父文子类/大类 tag（与主文 + 对应踩坑文自动互链）。
 * - 每篇含 ## FAQ / ## 常见问题（→ FAQPage schema）+ "适合谁/不适合谁" + 内链主文与踩坑文。
 * - 正文含 ![alt](IMG: 关键词) 占位，upsert 前用 Pexels 解析为真实图（双语共图）。
 * - 全程无品牌名，纯参数 / 原理 / 使用现实。upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-experience-column.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-experience-column.mjs
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
const COLUMN_TAG = 'experience-guide'

const articles = [
  // ───────────────────────── 1. 扫地机器人 ─────────────────────────
  {
    slug: 'robot-vacuum-long-term-experience',
    tags: [COLUMN_TAG, 'robot-vacuum', 'smart-home', 'home-appliances', 'home'],
    en: {
      title: `Living With a Robot Vacuum for a Year: What the Spec Sheet Doesn't Tell You`,
      summary: `Is a robot vacuum worth it? After daily use, the things that decide satisfaction are the dock, the maintenance, and how your home is laid out — not the suction number. Here's the real-world experience.`,
      content: `# Living With a Robot Vacuum for a Year: What the Spec Sheet Doesn't Tell You

A robot vacuum is one of those purchases that's either life-changing or quietly abandoned in a corner. The difference rarely comes down to the headline suction. After a year of daily use, what actually shapes the experience is the dock, the maintenance rhythm, and whether your home suits a robot at all.

![A robot vacuum on a living room floor](IMG: robot vacuum living room floor)

## What Daily Ownership Is Really Like

The promise is "set it and forget it". The reality is closer to "set it up well, then do small chores regularly". A robot vacuum genuinely keeps floors consistently tidier than most people manage by hand — but only if you've prepared your home and accepted a maintenance routine.

### The dock matters more than you expect
A self-emptying dock is the feature that turns a robot from "a gadget you tend" into "a thing that just runs". Without it, you empty a tiny bin every day or two. With a wash-and-dry mop dock, you avoid handling dirty pads — but you trade in a larger footprint and ongoing consumables. The dock, more than the robot, decides how hands-off it really is.

### Maintenance is the part nobody mentions
Brushes collect hair, filters clog, sensors need wiping, and mop pads need washing. Skip it and performance drops within weeks. It's a few minutes a week, but it's not zero. If you have pets or long hair, anti-tangle brushes make this dramatically easier — the same point we stress in the [robot vacuum buying mistakes](/en/guides/robot-vacuum-buying-mistakes).

### Your home decides the outcome
The biggest variable isn't the robot — it's your floor plan. Cluttered floors, cords, deep-pile rugs, dark flooring that confuses cliff sensors, and furniture the robot can't fit under all sabotage it. Homes that "robot-proof" their floors get great results; homes that don't end up rescuing a stuck robot.

### Navigation quality is felt every single day
A robot that maps your home (LiDAR/vSLAM) cleans in efficient rows, lets you send it to one room, and resumes after charging. A random-bounce model feels frustrating fast. This is where the [robot vacuum advanced guide](/en/guides/robot-vacuum-advanced-guide) earns its keep.

### Mopping is a bonus, not a replacement
Robot mopping handles daily light dust and footprints well. It does not replace an occasional proper mop for sticky spills. Set expectations here and you'll be happy; expect a deep clean and you won't.

## Who It's Worth It For

- **Worth it:** busy households, pet owners (with anti-tangle brushes), people with mostly hard floors and tidy-able rooms, anyone who values consistent daily upkeep.
- **Think twice:** very cluttered homes, lots of deep rugs and thresholds, or anyone expecting a deep clean with zero maintenance.

Before buying, read the [robot vacuum buying mistakes](/en/guides/robot-vacuum-buying-mistakes) and browse the [pitfall guides column](/en/pitfalls).

## FAQ

### Is a robot vacuum actually worth it?
For most people with hard floors and tidy-able rooms, yes — it keeps floors more consistently clean than hand-vacuuming between deep cleans. The value depends less on suction and more on a good dock, a small maintenance routine, and a home that's free of clutter and cords the robot can snag on.

### How much maintenance does a robot vacuum really need?
A few minutes a week: emptying the bin (or dust bag), clearing hair from brushes, wiping sensors, and washing mop pads if it mops. It's small but not zero, and skipping it causes performance to drop within weeks. Anti-tangle brushes greatly reduce the effort for pet owners and long hair.

### Does a robot vacuum replace a regular vacuum or mop?
Not entirely. It excels at consistent daily upkeep on accessible floors, but it can't deep-clean thick carpet, reach every corner, or scrub sticky spills like a proper mop. Most owners keep a handheld or stick vacuum for occasional deep cleans and edges.`,
    },
    zh: {
      title: `用了一年扫地机器人：规格表不会告诉你的事`,
      summary: `扫地机器人到底值不值？日常用下来，决定满意度的是基站、维护和你家的格局，而非吸力数字。这是真实的使用体验。`,
      content: `# 用了一年扫地机器人：规格表不会告诉你的事

扫地机器人是那种要么改变生活、要么被悄悄丢在角落的购买。差别很少在于标题吸力。日复一日用了一年后，真正塑造体验的，是基站、维护节奏、以及你家到底适不适合机器人。

![客厅地板上的扫地机器人](IMG: robot vacuum living room floor)

## 日常拥有它到底什么样

它承诺"设好就不用管"。现实更接近"设置好，然后定期做点小活"。扫地机器人确实能把地板维持得比多数人手扫更整洁——但前提是你为家做了准备、并接受一套维护流程。

### 基站比你以为的更重要
自动集尘基站，是把机器人从"需要你照看的小玩意"变成"自己就在跑的东西"的功能。没有它，你每一两天就要倒一次小尘盒。有自动洗烘拖布基站，你就不必碰脏拖布——但代价是更大的占地和持续耗材。决定它到底多省心的，是基站，而非机器人本身。

### 维护是没人提的那部分
滚刷缠毛、滤网堵塞、传感器要擦、拖布要洗。不做，几周内性能就下降。一周几分钟，但不是零。有宠物或长发，防缠绕滚刷会让这件事轻松得多——这也是我们在[扫地机器人选购误区](/zh/guides/robot-vacuum-buying-mistakes)里强调的点。

### 你家决定结果
最大的变量不是机器人，而是你的户型。杂乱的地面、电线、深毛地毯、让悬崖传感器误判的深色地板、以及机器人钻不进的家具，都会拖垮它。把地面"机器人友好化"的家能得到很好的结果；没做的家则不停在救一台卡住的机器人。

### 导航质量每天都能感受到
会建图（LiDAR/vSLAM）的机器人走弓字形、能定点去某个房间、充电后断点续扫。随机碰撞式很快就让人烦躁。这正是[扫地机器人进阶指南](/zh/guides/robot-vacuum-advanced-guide)的价值所在。

### 拖地是加分项，不是替代
机器人拖地能很好地处理日常浮尘和脚印，但替代不了偶尔一次的正经拖地来对付黏腻污渍。在这里设好预期你会满意；指望它深度清洁就不会。

## 适合谁

- **值得：** 忙碌家庭、养宠物者（配防缠绕滚刷）、以硬地板为主且房间能收拾整齐的人、看重日常持续维持的人。
- **三思：** 非常杂乱的家、大量深毛地毯和门槛、或期待零维护还要深度清洁的人。

购买前读[扫地机器人选购误区](/zh/guides/robot-vacuum-buying-mistakes)，并浏览[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 扫地机器人到底值不值得买？
对多数硬地板、房间能收拾整齐的人，值得——它能把地板维持得比两次深度清洁之间的手扫更稳定干净。价值更多取决于一个好基站、一套小小的维护流程、以及一个没有杂物和电线可缠的家，而非吸力。

### 扫地机器人到底需要多少维护？
一周几分钟：倒尘盒（或尘袋）、清滚刷上的毛发、擦传感器、会拖地的还要洗拖布。小，但不是零，不做几周内性能就下降。防缠绕滚刷能大幅减轻养宠物和长发用户的负担。

### 扫地机器人能替代普通吸尘器或拖把吗？
不能完全替代。它擅长在可达地面上做持续日常维持，但无法深度清洁厚地毯、触及每个角落、或像正经拖把那样擦掉黏腻污渍。多数用户会再留一台手持/杆式吸尘器应对偶尔的深度清洁和边角。`,
    },
  },

  // ───────────────────────── 2. 空气净化器 ─────────────────────────
  {
    slug: 'air-purifier-long-term-experience',
    tags: [COLUMN_TAG, 'air-purifiers', 'air-quality', 'home-appliances'],
    en: {
      title: `Do Air Purifiers Actually Work? What a Year of Ownership Reveals`,
      summary: `Air purifiers do something you can't see, which makes "is it worth it?" hard to judge. After living with one, the real answers are about sizing, filter cost, and noise — here's the honest experience.`,
      content: `# Do Air Purifiers Actually Work? What a Year of Ownership Reveals

Because clean air is invisible, an air purifier is uniquely hard to evaluate from feel alone. You can run one for months and not know whether it's doing anything. After a year of ownership — and ideally a cheap air-quality meter — the picture becomes clear, and it's mostly about sizing, running cost, and noise.

![An air purifier running in a bright living room](IMG: air purifier living room)

## What Ownership Actually Teaches You

A correctly sized purifier with a true HEPA filter does measurably clean the air — a particle meter drops within an hour of running. The catch is that "correctly sized" and "true HEPA" are doing all the work, and the ongoing reality is filters and fan noise.

### You only trust it once you can measure it
The single best upgrade to the experience is a small particle (PM2.5) meter. Watching the number fall after cooking or on a smoky day is what turns "I hope this works" into "I can see it working". Without measurement, ownership is an act of faith.

### Sizing for the room is everything
A unit that's underpowered for the room runs constantly and never quite clears the air. One sized with headroom clears the room quickly on a low, quiet setting. This is the difference between a purifier that feels effective and one that feels pointless — exactly the trap covered in the [air purifier buying mistakes](/en/guides/air-purifier-buying-mistakes).

### Filters are the real cost, and they sneak up on you
The purchase price is the small part. Replacement HEPA (and carbon) filters every 6–12 months are the ongoing cost, and a cheap unit with pricey filters can cost more over two years than a better one. Budget for filters before buying, and understand the [CADR rating](/en/guides/air-purifier-cadr-rating-explained) so you size it right the first time.

### Noise decides whether you actually run it
CADR is rated at the loudest speed. If that's too loud for a bedroom, you'll run it on low — where it clears far less. The purifiers people keep using are the ones quiet enough to run continuously at a level that still does the job.

### Odors and gases need carbon, and carbon depletes
A HEPA filter captures particles but not smells. A meaningful activated-carbon stage helps with cooking odors and VOCs — but carbon saturates and needs replacing, and a token amount does little.

## Who It's Worth It For

- **Worth it:** allergy and asthma households, homes near traffic or wildfire smoke, pet owners, anyone in a region with seasonal air-quality issues.
- **Think twice:** if you'd buy an undersized unit, ignore filter costs, or run it on low to avoid noise — in those cases it mostly provides reassurance, not results.

Before buying, read the [air purifier buying mistakes](/en/guides/air-purifier-buying-mistakes) and browse the [pitfall guides column](/en/pitfalls).

## FAQ

### Do air purifiers actually do anything?
Yes — a correctly sized unit with a true HEPA filter measurably reduces airborne particles, which you can confirm with an inexpensive PM2.5 meter. The benefit is real but conditional: it depends on sizing the CADR to the room, using genuine HEPA, and running it at a speed that actually clears the space.

### What's the biggest hidden cost of owning an air purifier?
Replacement filters. The purchase price is minor compared with HEPA and carbon filters changed every 6–12 months over the years you own it. A cheap purifier with expensive, frequent filters can cost more over two years than a pricier unit with affordable ones, so budget for filters up front.

### Why doesn't my air purifier seem to make a difference?
Usually it's undersized for the room, or you run it on a low, quiet setting that clears far less air than its rated CADR. Match the CADR to your room with headroom, run it at an effective speed, and use a particle meter — most "it does nothing" cases are really sizing or speed problems.`,
    },
    zh: {
      title: `空气净化器真的有用吗？用了一年才明白的事`,
      summary: `空气净化器做的是看不见的事，所以"值不值"很难判断。用了一年后，真实答案关于选型、滤芯成本和噪音——这是诚实的使用体验。`,
      content: `# 空气净化器真的有用吗？用了一年才明白的事

因为干净的空气看不见，空气净化器格外难凭感觉评价。你可能开了几个月也不知道它有没有在干活。用了一年后——最好再配一个便宜的空气质量检测仪——画面就清晰了，而它主要关于选型、使用成本和噪音。

![明亮客厅里运行的空气净化器](IMG: air purifier living room)

## 拥有它真正教给你的

一台选型正确、用真 HEPA 滤网的净化器，确实能可测量地净化空气——颗粒物检测仪在运行一小时内就会下降。关键在于"选型正确"和"真 HEPA"承担了全部作用，而日常的现实是滤芯和风噪。

### 你只有能测量时才会信它
对体验提升最大的一项，是一个小小的颗粒物（PM2.5）检测仪。做完饭或雾霾天看着数字下降，正是把"但愿它有用"变成"我能看见它在起作用"的东西。没有测量，拥有它就是一种信仰。

### 为房间选型就是一切
对房间功率不足的机器会一直转却始终清不干净空气。留有余量选型的机器，在安静的低档就能很快把房间净化。这就是"感觉有效"和"感觉没用"的区别——正是[空气净化器选购误区](/zh/guides/air-purifier-buying-mistakes)讲的陷阱。

### 滤芯才是真成本，而且会悄悄累积
购买价是小头。每 6–12 个月更换的 HEPA（和活性炭）滤芯才是持续开销，一台便宜但滤芯贵的机器，两年下来可能比更好的更花钱。买前把滤芯算进预算，并搞懂 [CADR 评级](/zh/guides/air-purifier-cadr-rating-explained)，一次选对。

### 噪音决定你到底会不会开它
CADR 是在最吵的档位测的。如果那档对卧室太吵，你会开低档——而低档净化得少得多。人们会一直用下去的净化器，是那种安静到能在仍然有效的档位持续运行的。

### 异味和气体需要活性炭，而活性炭会耗尽
HEPA 滤网拦截颗粒，但拦不住气味。有分量的活性炭层能帮上油烟味和 VOC——但活性炭会饱和、需要更换，象征性的一点几乎没用。

## 适合谁

- **值得：** 过敏和哮喘家庭、临街或受野火烟影响的家、养宠物者、所在地区有季节性空气质量问题的人。
- **三思：** 如果你会买一台偏小的机器、忽略滤芯成本、或为避噪音只开低档——那它多半只提供心理安慰，而非结果。

购买前读[空气净化器选购误区](/zh/guides/air-purifier-buying-mistakes)，并浏览[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 空气净化器真的有用吗？
有用——一台选型正确、用真 HEPA 滤网的机器能可测量地降低空气中的颗粒物，用便宜的 PM2.5 检测仪就能确认。好处真实但有条件：取决于 CADR 对房间选型、用真 HEPA、并以能真正净化空间的档位运行。

### 拥有空气净化器最大的隐藏成本是什么？
替换滤芯。相比你拥有它的这些年里每 6–12 个月更换的 HEPA 和活性炭滤芯，购买价是小头。一台便宜但滤芯贵又换得勤的机器，两年可能比贵一点、滤芯实惠的更花钱，所以买前就把滤芯算进预算。

### 为什么我的空气净化器感觉没区别？
通常是对房间选型偏小，或你开的是低档安静模式、净化的空气远少于标称 CADR。让 CADR 留余量匹配房间、用有效档位运行、再配一个颗粒物检测仪——多数"它没用"的情况其实是选型或档位问题。`,
    },
  },

  // ───────────────────────── 3. 意式咖啡机 ─────────────────────────
  {
    slug: 'espresso-machine-long-term-experience',
    tags: [COLUMN_TAG, 'coffee', 'espresso', 'brewing', 'home-appliances'],
    en: {
      title: `Is a Home Espresso Machine Worth It? A Year of Pulling Shots at Home`,
      summary: `A home espresso machine can save money or become an expensive shelf ornament. After a year, the deciding factors are the grinder, the learning curve, and daily cleaning — not the machine's pressure number.`,
      content: `# Is a Home Espresso Machine Worth It? A Year of Pulling Shots at Home

A home espresso setup is sold as a path to café-quality coffee and long-term savings. It can be exactly that — or it can be a frustrating gadget that gets shoved aside. After a year of daily shots, the truth is that the machine is only part of the equation, and the unglamorous parts decide whether you stick with it.

![A home espresso machine pulling a shot](IMG: espresso machine coffee shot)

## What a Year of Home Espresso Teaches You

Good espresso at home is absolutely achievable, and the per-cup cost drops far below café prices. But the experience is defined by three things almost nobody emphasizes when buying: the grinder, the learning curve, and the cleaning.

### The grinder matters as much as the machine
This is the lesson everyone learns late. A great machine fed by a poor grinder makes mediocre espresso; a modest machine with a good burr grinder makes great espresso. If your budget is fixed, **don't starve the grinder** — it's not an accessory, it's half the system.

### There's a real learning curve
The first weeks involve wasted coffee and inconsistent shots while you learn dose, grind size, tamping, and timing. This is normal, not a defect. People who expect a button-press miracle quit; people who treat it as a small craft get hooked. Budget patience, not just money.

### Daily cleaning is non-negotiable
Backflushing, wiping the group head, emptying the knock box, descaling on schedule — skip these and shots degrade and the machine suffers. It's a few minutes a day. The owners who love their machine are the ones who built the cleaning habit; the ones who didn't have a shiny paperweight.

### Pressure numbers are marketing
"15 bar" or "20 bar" on the box is a pump rating, not a quality indicator — good espresso is extracted around 9 bar. Don't choose on the pressure number; choose on temperature stability, the grinder pairing, and build. See the [espresso machine buying guide](/en/guides/espresso-machine-buying-guide-2026).

### Counter space and routine are part of the deal
A machine, a grinder, a tamper, a knock box, and beans take real counter space, and the routine adds a few minutes to your morning. If that fits your life, it's a joy; if your mornings are frantic, be honest about it.

## Who It's Worth It For

- **Worth it:** people who drink espresso daily, enjoy a small hands-on ritual, and will invest in a decent grinder and a cleaning habit.
- **Think twice:** if you want zero-effort, one-touch coffee, or won't budget for a proper grinder — a simpler brewer or a bean-to-cup machine may suit you better.

Before buying, start with the [espresso machine buying guide](/en/guides/espresso-machine-buying-guide-2026) and browse the [pitfall guides column](/en/pitfalls).

## FAQ

### Is a home espresso machine worth the money?
If you drink espresso daily and enjoy a small ritual, yes — the per-cup cost drops well below café prices and the quality can be excellent. The value hinges on pairing it with a good burr grinder, accepting a learning curve, and keeping up daily cleaning. Without those, it often becomes an expensive shelf ornament.

### Do I really need a separate grinder for espresso?
For good results, yes. The grinder is roughly half the system: a great machine with a poor grinder makes mediocre espresso, while a modest machine with a good burr grinder makes great espresso. If your budget is fixed, don't underspend on the grinder to afford a fancier machine.

### Does the "bar" pressure number on an espresso machine matter?
Not as a quality measure. A "15 bar" or "20 bar" figure is a pump rating, while espresso actually extracts around 9 bar. Choose based on temperature stability, build quality, and grinder pairing rather than the headline pressure number, which is mostly marketing.`,
    },
    zh: {
      title: `家用意式咖啡机值得吗？在家拉了一年浓缩`,
      summary: `家用意式咖啡机能省钱，也可能变成昂贵的摆设。用了一年后，决定因素是磨豆机、学习曲线和每日清洁——而非机器的压力数字。`,
      content: `# 家用意式咖啡机值得吗？在家拉了一年浓缩

家用意式套装被当作通往咖啡馆品质和长期省钱的路径来卖。它可以正是如此——也可能变成一个让人沮丧、被推到一边的小家电。每天拉浓缩用了一年后，真相是机器只是方程的一部分，而那些不光鲜的环节才决定你会不会坚持下去。

![家用意式咖啡机正在拉一杯浓缩](IMG: espresso machine coffee shot)

## 在家做一年意式咖啡教给你的

在家做出好浓缩完全可行，每杯成本远低于咖啡馆。但体验由三件几乎没人在购买时强调的事定义：磨豆机、学习曲线和清洁。

### 磨豆机和机器一样重要
这是所有人都学得很晚的一课。好机器配差磨豆机做出平庸的浓缩；普通机器配好的锥/平刀磨豆机做出很棒的浓缩。如果预算固定，**别亏待磨豆机**——它不是配件，是系统的一半。

### 确有真实的学习曲线
最初几周会浪费咖啡、出品不稳定，你在学粉量、研磨度、压粉和时间。这是正常的，不是缺陷。指望一键奇迹的人会放弃；把它当作一门小手艺的人会上瘾。要预留耐心，而不只是钱。

### 每日清洁没得商量
反冲洗、擦冲煮头、倒渣盒、按时除垢——不做，出品下降、机器受损。一天几分钟。爱自己机器的用户，是建立了清洁习惯的那些；没建立的，手里就是个亮闪闪的镇纸。

### 压力数字是营销
盒子上的"15 bar""20 bar"是泵的标称，不是品质指标——好浓缩在约 9 bar 萃取。别按压力数字选；按温度稳定性、磨豆机搭配和做工选。见[意式咖啡机选购指南](/zh/guides/espresso-machine-buying-guide-2026)。

### 台面空间和习惯也是交易的一部分
机器、磨豆机、压粉器、渣盒和咖啡豆要占实打实的台面，而这套流程会给你的早晨多加几分钟。如果这适合你的生活，它是种享受；如果你的早晨手忙脚乱，要对自己诚实。

## 适合谁

- **值得：** 每天喝浓缩、享受一点动手仪式、愿意投资一台像样磨豆机并养成清洁习惯的人。
- **三思：** 如果你想要零费力、一键出品，或不愿为正经磨豆机花钱——更简单的冲煮器或全自动咖啡机可能更适合你。

购买前从[意式咖啡机选购指南](/zh/guides/espresso-machine-buying-guide-2026)开始，并浏览[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 家用意式咖啡机值这个钱吗？
如果你每天喝浓缩、享受一点仪式，值——每杯成本远低于咖啡馆，品质也能很出色。价值取决于搭配一台好的锥/平刀磨豆机、接受学习曲线、并坚持每日清洁。没有这些，它常常变成昂贵的摆设。

### 做意式真的需要单独的磨豆机吗？
要做出好结果，需要。磨豆机约占系统的一半：好机器配差磨豆机做出平庸浓缩，普通机器配好磨豆机做出很棒的浓缩。如果预算固定，别为了更花哨的机器而在磨豆机上省钱。

### 意式咖啡机上的"bar"压力数字重要吗？
作为品质衡量不重要。"15 bar""20 bar"是泵的标称，而浓缩实际在约 9 bar 萃取。按温度稳定性、做工和磨豆机搭配来选，而非标题压力数字——后者多半是营销。`,
    },
  },

  // ───────────────────────── 4. 人体工学椅 ─────────────────────────
  {
    slug: 'ergonomic-chair-long-term-experience',
    tags: [COLUMN_TAG, 'ergonomic-chairs', 'furniture', 'office', 'ergonomics'],
    en: {
      title: `A Year in an Ergonomic Chair: What Actually Changed (and What Didn't)`,
      summary: `Does an ergonomic chair fix back pain? After a year of all-day sitting, the real benefits come from setup and habits as much as the chair. Here's the honest long-term experience.`,
      content: `# A Year in an Ergonomic Chair: What Actually Changed (and What Didn't)

An ergonomic chair is often bought as a cure for back pain after too many hours at a desk. A year in, the verdict is nuanced: a good, properly adjusted chair genuinely helps — but the chair alone isn't magic, and an expensive one you never adjust does surprisingly little.

![An ergonomic office chair at a desk](IMG: ergonomic office chair desk)

## What a Year of All-Day Sitting Reveals

The biggest realization is that "ergonomic" is a verb, not a noun. The benefit comes from a chair that fits you, set up correctly, combined with movement — not from the price tag or the marketing.

### Setup matters more than the chair
A great chair left at factory settings can be worse than a modest chair dialed in. The hours spent adjusting lumbar height, seat depth, armrest position, and recline tension are what actually pay off. If you never adjust it, you've wasted most of what you paid for — the exact point behind the [ergonomic chair buying mistakes](/en/guides/ergonomic-chair-buying-mistakes).

### The right adjustments are the ones you feel
Lumbar support at the right height, seat depth that leaves a few fingers behind the knee, and armrests that let your shoulders relax — these are the changes you notice within days. The guide to getting them right is the [ergonomic chair: lumbar, armrest & seat depth guide](/en/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide).

### A chair reduces strain but doesn't replace movement
The honest truth: no chair fixes the harm of sitting still for eight hours. The people who saw their back pain improve combined a well-adjusted chair with standing up regularly, adjusting posture, and moving. The chair makes good posture easier; it doesn't make sitting all day healthy.

### Build quality shows up over a year
Cheap foam flattens, gas cylinders sink, and mesh sags. A year in, the difference between a durable chair and a disposable one becomes obvious. This is where spending on build — not looks — pays back.

### Mesh vs. cushion is personal, and you learn which over time
Mesh breathes and suited some people through a hot summer; others found a cheap, taut mesh dug into their thighs and preferred foam. There's no universal winner — a year of use tells you which camp you're in.

## Who It's Worth It For

- **Worth it:** anyone sitting many hours a day who will take time to adjust the chair and pair it with regular movement.
- **Think twice:** if you want a fix without changing habits, or won't use the adjustments — a mid-range chair you actually dial in beats a premium one you don't.

Before buying, read the [ergonomic chair buying mistakes](/en/guides/ergonomic-chair-buying-mistakes) and browse the [pitfall guides column](/en/pitfalls).

## FAQ

### Does an ergonomic chair fix back pain?
It helps but isn't a cure on its own. A well-fitted, properly adjusted chair reduces strain and makes good posture easier, and many people see improvement. But no chair offsets sitting still for eight hours — lasting benefit comes from combining the chair with regular movement and posture changes.

### Is an expensive ergonomic chair worth it over a cheaper one?
Over a year, build quality matters: cheap foam flattens, cylinders sink, and mesh sags, so a durable chair pays back. But price isn't the same as ergonomics — a mid-range chair you actually adjust to your body beats a premium one left at factory settings. Spend on adjustability and build, not looks.

### Mesh or cushioned ergonomic chair — which is better?
Neither is universally better; it's personal and you learn your preference over time. Mesh breathes well and suits hot climates, but a cheap, over-tight mesh can dig into the thighs. Foam cushions comfortably but can trap heat and compress. Choose based on your climate and how many hours you sit.`,
    },
    zh: {
      title: `坐了一年人体工学椅：到底改变了什么（又没改变什么）`,
      summary: `人体工学椅能治好腰痛吗？全天久坐一年后，真正的好处来自调节和习惯，不亚于椅子本身。这是诚实的长期体验。`,
      content: `# 坐了一年人体工学椅：到底改变了什么（又没改变什么）

人体工学椅常被当作久坐太多后治腰痛的良方来买。坐了一年，结论很微妙：一把调节得当的好椅子确实有帮助——但椅子本身不是魔法，而一把你从不调节的贵椅子，作用小得惊人。

![桌前的人体工学办公椅](IMG: ergonomic office chair desk)

## 全天久坐一年揭示的事

最大的领悟是："人体工学"是个动词，不是名词。好处来自一把贴合你、调节正确的椅子，再加上活动——而非价签或营销。

### 调节比椅子更重要
一把停留在出厂设置的好椅子，可能不如一把调到位的普通椅子。花在调节腰托高度、座深、扶手位置、后仰张力上的时间，才是真正见效的。如果你从不调它，你就浪费了所付的大部分——这正是[人体工学椅选购误区](/zh/guides/ergonomic-chair-buying-mistakes)背后的点。

### 对的调节是你能感受到的那些
高度合适的腰托、在膝盖后留几指空隙的座深、让肩膀放松的扶手——这些改变你几天内就会察觉。把它们调对的指南见[人体工学椅：腰托、扶手与座深指南](/zh/guides/ergonomic-chair-lumbar-armrest-seat-depth-guide)。

### 椅子减轻负担，但替代不了活动
诚实地说：没有哪把椅子能消除一动不动坐八小时的伤害。腰痛得到改善的人，是把调好的椅子和定时起身、调整姿势、活动结合起来。椅子让好姿势更容易；它没法让整天久坐变健康。

### 做工在一年里见分晓
廉价海绵会塌、气压棒会下沉、网布会松垮。坐满一年，耐用椅和一次性椅的区别变得明显。这正是把钱花在做工——而非外观——上得到回报的地方。

### 网布还是海绵很个人，时间久了你会知道
网布透气，让一些人挺过了炎热的夏天；另一些人发现廉价绷紧的网布勒大腿、更偏爱海绵。没有普适赢家——用一年你就知道自己属于哪一派。

## 适合谁

- **值得：** 每天久坐很多小时、愿意花时间调节椅子并配合定时活动的人。
- **三思：** 如果你想不改习惯就解决问题、或不会用那些调节——一把你真会调到位的中端椅，胜过一把你不调的高端椅。

购买前读[人体工学椅选购误区](/zh/guides/ergonomic-chair-buying-mistakes)，并浏览[踩坑指南专栏](/zh/pitfalls)。

## 常见问题

### 人体工学椅能治好腰痛吗？
有帮助，但单靠它不是根治。一把贴合、调节正确的椅子能减轻负担、让好姿势更容易，很多人会有改善。但没有哪把椅子能抵消一动不动坐八小时——持久的好处来自把椅子和定时活动、调整姿势结合起来。

### 贵的人体工学椅比便宜的更值吗？
一年下来，做工很重要：廉价海绵会塌、气压棒下沉、网布松垮，所以耐用的椅子能回本。但价格不等于人体工学——一把你真会按身体调节的中端椅，胜过一把停留在出厂设置的高端椅。把钱花在可调性和做工上，而非外观。

### 网布还是海绵人体工学椅更好？
没有普适更好的；这很个人，时间久了你会知道自己的偏好。网布透气、适合炎热气候，但廉价绷紧的网布会勒大腿。海绵坐感舒适，却可能闷热、压塌。按你的气候和每天久坐时长来选。`,
    },
  },
]

// ── IMG: 占位解析（双语共图：同一篇的相同关键词只搜一次）──────────────────────
const finder = new ImageFinder()
const IMG_RE = /!\[([^\]]*)\]\(IMG:\s*([^)]+)\)/g

async function resolveArticleImages(a) {
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
  console.log(`图: ${a.slug} 命中 ${got} 张`)
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

#!/usr/bin/env node
/**
 * seed-luxury-auth-cluster.mjs
 *
 * 二手奢侈品鉴定簇（差异化补充，避免与现有 luxury-goods-authentication-guide 等蚕食）：
 *   1. Chanel 包鉴定要点（品牌专题，现有无）
 *   2. Hermès 包鉴定要点（品牌专题，现有无）
 *   3. 二手奢侈品保值与回收估价（角度，现有无）
 * tags 对齐现有奢侈品文章 → RelatedGuides 自动互链。YMYL 内容含专业鉴定免责。
 * upsert onConflict 'slug,locale'，幂等。
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-luxury-auth-cluster.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-luxury-auth-cluster.mjs
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
const TAGS = ['buying-guide', 'secondhand', 'life-decisions']
const HUB_EN = '/en/guides/luxury-goods-authentication-guide'
const HUB_ZH = '/zh/guides/luxury-goods-authentication-guide'
const DISC_EN =
  '\n\n> **Disclaimer:** This guide describes general checkpoints for reference only and is not an official authentication standard. Counterfeits evolve constantly. For high-value purchases, always use the brand or a reputable third-party authentication service before paying.'
const DISC_ZH =
  '\n\n> **免责声明：** 本文所述仅为通用参考性检查点，并非官方鉴定标准。仿品手法不断更新。高价值交易请务必在付款前委托品牌官方或正规第三方鉴定机构核验。'

const articles = [
  {
    slug: 'chanel-bag-authentication-guide',
    en: {
      title: 'Chanel Bag Authentication: Serial Stickers, Quilting & CC Lock Checkpoints',
      summary:
        'How to spot a fake Chanel bag: serial stickers and microchips, diamond quilting alignment, the CC turn-lock overlap rule, hardware engraving, and leather. A checkpoint guide for second-hand buyers.',
      content: `# Chanel Bag Authentication: Key Checkpoints

Chanel is one of the most counterfeited luxury brands, and modern fakes are good. No single detail proves authenticity — you judge a bag on the **weight of evidence** across several checkpoints. Here are the ones that matter most on the second-hand market.

## Serial Sticker and Microchip

From 1984 Chanel placed a serial sticker inside the bag, with a number that corresponds to a production era and should match the authenticity card. The sticker has a fine guilloché pattern and a protective overlay. **From 2021 Chanel replaced the serial sticker with an embedded NFC microchip**, so newer bags will not have a visible sticker — a missing sticker on a recent bag is not automatically a red flag, but a sloppy or mismatched sticker on an older bag is.

## CC Turn-Lock Overlap

On the classic CC turn-lock, the overlap follows a consistent rule: the **right C overlaps on top at the top, and the left C overlaps on top at the bottom**. Many fakes get this crossing wrong or make the Cs uneven in width and spacing.

## Diamond Quilting Alignment

On authentic bags the quilting lines are straight and the diamonds **align across seams and around the flap**, including on the back. Misaligned quilting or wandering stitch lines are a common tell.

## Hardware and Leather

Genuine hardware feels substantial, with crisp "CHANEL" engraving and even plating. The leather (lambskin or caviar) has a consistent grain and a natural smell. Glue smell, plasticky leather, or light, hollow hardware are warning signs.

For the general method that applies across all brands, see our [luxury bag authentication guide](${HUB_EN}).${DISC_EN}

## FAQ

### How do I check if a Chanel serial number is real?
Match the serial sticker (or the card/chip on 2021+ bags) to the era of the design and to the authenticity card. The number alone cannot confirm authenticity — fakes copy real-looking numbers — so combine it with quilting, hardware, and lock checks.

### Do new Chanel bags still have serial stickers?
No. From 2021 Chanel replaced the serial sticker with an embedded NFC microchip, so recent bags will not show a visible sticker.

### Is the CC lock a reliable authentication point?
It is one useful checkpoint: the right C overlaps on top at the top and the left C on top at the bottom. But rely on the weight of evidence across multiple details, not the lock alone.`,
    },
    zh: {
      title: 'Chanel 包鉴定要点：序列号贴、菱格缝线与双C扣检查点',
      summary:
        '如何辨别 Chanel 包真假：序列号贴与芯片、菱格缝线对齐、双C扣交叠规则、五金刻字与皮质。给二手买家的检查点指南。',
      content: `# Chanel 包鉴定要点

Chanel 是被仿最多的奢侈品牌之一，如今的仿品做得很像。没有任何单一细节能证明真假——要靠多个检查点的**证据综合**来判断。下面是二手市场上最关键的几点。

## 序列号贴与芯片

1984 年起 Chanel 在包内贴序列号贴，号码对应生产年代，并应与防伪卡对应；序列号贴带细密的扭索纹和保护膜。**2021 年起 Chanel 用内嵌 NFC 芯片取代了序列号贴**，所以较新的包不会有可见的贴纸——新包没有贴纸不一定是问题，但老包上贴纸粗糙或与卡片对不上则要警惕。

## 双C扣交叠规则

经典双C转扣的交叠遵循固定规则：**上方是右C压在上面，下方是左C压在上面**。很多仿品把交叠方向做反，或把两个C的宽度和间距做得不对称。

## 菱格缝线对齐

正品的缝线笔直，菱格在**接缝处和翻盖四周（包括背面）都对齐**。菱格错位或缝线走偏是常见破绽。

## 五金与皮质

正品五金有分量感，「CHANEL」刻字清晰、电镀均匀。皮料（羊皮或鱼子酱牛皮）纹理一致、有天然皮味。胶水味、塑料感的皮、轻飘空心的五金都是警示信号。

适用于所有品牌的通用方法，见我们的[奢侈品包鉴定指南](${HUB_ZH})。${DISC_ZH}

## 常见问题

### 怎么查 Chanel 序列号是不是真的？
把序列号贴（或 2021 年后包的卡片/芯片）与款式年代、防伪卡对应。光看号码无法确认真假——仿品会抄看起来很真的号码——要结合菱格、五金和扣具一起判断。

### 新款 Chanel 包还有序列号贴吗？
没有。2021 年起 Chanel 用内嵌 NFC 芯片取代了序列号贴，新包不会有可见贴纸。

### 双C扣是可靠的鉴定点吗？
它是一个有用的检查点：上方右C压上、下方左C压上。但要靠多个细节的证据综合，而非仅凭扣具。`,
    },
  },
  {
    slug: 'hermes-bag-authentication-guide',
    en: {
      title: 'Hermès Bag Authentication: Saddle Stitch, Blind Stamp & Hardware Checks',
      summary:
        'How to authenticate an Hermès Birkin or Kelly: hand saddle stitching, the blind stamp date code, hardware engraving, and leather. A checkpoint guide — and why suspiciously cheap is the biggest red flag.',
      content: `# Hermès Bag Authentication: Key Checkpoints

Hermès bags are hand-made, and that craftsmanship is exactly what is hardest to fake. As always, judge on the weight of evidence — and remember that a genuine Birkin or Kelly priced far below market is almost certainly fake.

## Hand Saddle Stitching

Authentic Hermès bags use **hand saddle stitching**: two needles working a single thread, producing stitches that are slightly angled and not perfectly uniform — a signature of handwork. Counterfeits often use machine stitching that looks too perfect, too even, or too straight.

## Blind Stamp (Date Code)

Hermès heat-presses a **blind stamp** indicating the production year (a letter, sometimes inside a shape in older bags) and the craftsman. Check its placement, font, and depth — it should be crisp and consistent, not smudged or uneven.

## Hardware and Engraving

Hardware is substantial and precisely engraved with "HERMÈS PARIS MADE IN FRANCE". Plating is even; zipper pulls are engraved. Light, roughly finished, or misspelled hardware is a clear tell.

## Leather

Hermès uses specific leathers (Togo, Epsom, Clemence, etc.) with consistent, recognizable grain and a natural smell. Uniform "too perfect" grain or a chemical smell are warning signs.

## The Price Test

Hermès does not discount its iconic bags, and demand vastly outstrips supply. A "new" Birkin or Kelly at a steep discount is the single biggest red flag of all.

For the general cross-brand method, see our [luxury bag authentication guide](${HUB_EN}).${DISC_EN}

## FAQ

### What is the Hermès blind stamp?
A heat-pressed mark indicating the production year and craftsman. Older bags sometimes enclose the year letter in a shape. Its placement, font, and crispness are part of authentication.

### Why is hand stitching a sign of authenticity?
Hermès uses hand saddle stitching, which is slightly angled and not perfectly uniform. Machine stitching that looks too even or too perfect is a common counterfeit tell.

### Is a cheap Birkin ever real?
Almost never. Hermès does not discount iconic bags and demand far exceeds supply, so a heavily discounted "new" Birkin or Kelly is the strongest red flag of a fake.`,
    },
    zh: {
      title: 'Hermès 爱马仕包鉴定：马鞍手缝、盲印年份码与五金检查',
      summary:
        '如何鉴定爱马仕 Birkin/Kelly：手工马鞍缝、盲印年份码、五金刻字与皮质，以及为什么"明显低于市价"是最大的危险信号。',
      content: `# Hermès 爱马仕包鉴定要点

爱马仕的包是手工制作的，而这种工艺恰恰最难仿。仍然要靠证据综合判断——并且记住：一只远低于市价的真 Birkin 或 Kelly，几乎可以肯定是假的。

## 手工马鞍缝

正品爱马仕用**手工马鞍缝**：两根针引一条线，缝出的针脚略微倾斜、并不完全均匀——这是手工的标志。仿品常用机器缝，看起来太完美、太均匀、太笔直。

## 盲印（年份码）

爱马仕会热压一个**盲印**，标示生产年份（一个字母，老包有时套在某个形状里）和工匠。检查它的位置、字体和深浅——应当清晰一致，不应糊掉或深浅不均。

## 五金与刻字

五金有分量，精准刻有「HERMÈS PARIS MADE IN FRANCE」。电镀均匀，拉链头有刻字。轻飘、做工粗糙或拼写错误的五金是明显破绽。

## 皮质

爱马仕用特定皮料（Togo、Epsom、Clemence 等），纹理一致、可辨识，有天然皮味。纹理「过于完美」均匀或有化学味是警示信号。

## 价格测试

爱马仕不会给标志性款式打折，且需求远超供给。一只大幅打折的「全新」Birkin 或 Kelly，是所有危险信号里最强的一个。

适用于各品牌的通用方法，见我们的[奢侈品包鉴定指南](${HUB_ZH})。${DISC_ZH}

## 常见问题

### 爱马仕的盲印是什么？
一个热压标记，标示生产年份和工匠。老包有时把年份字母套在某个形状里。它的位置、字体和清晰度都是鉴定要点。

### 为什么手工缝线是真品标志？
爱马仕用手工马鞍缝，针脚略微倾斜、不完全均匀。看起来太均匀、太完美的机器缝线，是常见的仿品破绽。

### 便宜的 Birkin 有可能是真的吗？
几乎不可能。爱马仕不给标志性款式打折、需求远超供给，所以大幅打折的「全新」Birkin 或 Kelly 是仿品最强的危险信号。`,
    },
  },
  {
    slug: 'secondhand-luxury-resale-value-guide',
    en: {
      title: 'Second-Hand Luxury Bag Resale Value: What Holds Value and How to Estimate Price',
      summary:
        'Which luxury bags hold their value, and how is a second-hand price estimated? This guide covers resale-value ranking, condition grading, what documentation adds, and how resale channels differ.',
      content: `# Second-Hand Luxury Bag Resale Value

Not all luxury bags hold value the same way. Understanding resale dynamics helps whether you are buying to keep value or selling on the second-hand market.

## Resale-Value Ranking (General)

- **Hermès Birkin / Kelly:** the strongest — iconic models often resell at or above retail.
- **Chanel Classic Flap / 19:** classic quilted styles hold value well, helped by frequent price increases.
- **Louis Vuitton classic monogram:** durable canvas and steady demand keep value stable.
- **Seasonal / logo-heavy trend bags:** depreciate fastest.

The pattern is simple: **timeless, supply-constrained classics hold value; seasonal pieces do not.**

## What Drives a Second-Hand Price

- **Model:** classic lines beat seasonal releases.
- **Condition:** graded from new/unworn down to visible wear (corners, handles, hardware tarnish, interior stains).
- **Completeness:** dust bag, box, receipt, and authenticity card all add value.
- **Rarity:** limited colors, materials, or editions command premiums.
- **Market timing:** demand and brand price increases move resale values.

## Condition Grading

Most resellers grade roughly as: new/unused, excellent (light use), good (visible but minor wear), and fair (clear wear). Corners, handle darkening, and hardware scratches are the first things buyers inspect.

## Resale Channels Differ

Brands generally do not buy back bags. Your options — consignment, resale platforms, and buy-out dealers — trade convenience against price. Buy-out is fastest but lowest; consignment can fetch more but takes time. Always confirm authentication before any high-value transaction.

For authenticity checkpoints before you buy or sell, see our [luxury bag authentication guide](${HUB_EN}).${DISC_EN}

## FAQ

### Which luxury bags hold their value best?
Iconic, supply-constrained classics — especially the Hermès Birkin and Kelly, followed by the Chanel Classic Flap and Louis Vuitton classic monogram lines. Seasonal and logo-heavy trend bags depreciate fastest.

### Does keeping the box and receipt increase resale value?
Yes. A complete set — dust bag, box, receipt, and authenticity card — meaningfully raises resale value and buyer confidence.

### How is second-hand bag condition graded?
Roughly: new/unused, excellent, good, and fair. Graders focus on corner wear, handle darkening, hardware scratches, and interior stains.`,
    },
    zh: {
      title: '二手奢侈品包保值与估价：哪些包保值、二手价怎么估',
      summary:
        '哪些奢侈品包保值？二手价怎么估？本文讲保值率排序、成色分级、配件齐全度的加成，以及不同回收渠道的差异。',
      content: `# 二手奢侈品包保值与估价

不是所有奢侈品包都同样保值。看懂二手价格逻辑，无论你是为保值而买，还是要在二手市场出售，都用得上。

## 保值率排序（通用）

- **爱马仕 Birkin / Kelly：** 最强——标志性款式常以原价甚至更高转手。
- **Chanel Classic Flap / 19：** 经典菱格款保值好，频繁涨价也有帮助。
- **路易威登经典老花：** 帆布耐用、需求稳定，价值稳定。
- **季节款 / 大 logo 潮流款：** 贬值最快。

规律很简单：**经典、供给受限的款保值；季节款不保值。**

## 二手价由什么决定

- **款式：** 经典线优于季节款。
- **成色：** 从全新/未使用，到明显使用痕迹（边角、手柄、五金氧化、内衬污渍）分级。
- **配件齐全度：** 防尘袋、包装盒、小票、防伪卡都加分。
- **稀有度：** 限量色、特殊皮质或限定款有溢价。
- **市场时机：** 需求和品牌涨价会带动二手价。

## 成色分级

多数回收方大致分为：全新/未使用、极佳（轻微使用）、良好（有可见但轻微痕迹）、一般（明显痕迹）。边角、手柄变色、五金划痕是买家最先检查的地方。

## 回收渠道有差异

品牌通常不回收。你的选择——寄卖、二手平台、回收商一口价——在便利和价格之间权衡。一口价最快但最低；寄卖可能卖更高但耗时。任何高价值交易前都务必先确认鉴定。

购买或出售前的鉴定检查点，见我们的[奢侈品包鉴定指南](${HUB_ZH})。${DISC_ZH}

## 常见问题

### 哪些奢侈品包最保值？
标志性、供给受限的经典款——尤其是爱马仕 Birkin 和 Kelly，其次是 Chanel Classic Flap 和路易威登经典老花线。季节款和大 logo 潮流款贬值最快。

### 留着包装盒和小票能提高二手价吗？
能。一整套——防尘袋、盒子、小票、防伪卡——会明显提高二手价和买家信心。

### 二手包的成色怎么分级？
大致为：全新/未使用、极佳、良好、一般。分级重点看边角磨损、手柄变色、五金划痕和内衬污渍。`,
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

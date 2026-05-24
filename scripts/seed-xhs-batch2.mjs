#!/usr/bin/env node
/**
 * seed-xhs-batch2.mjs
 *
 * 将 /Volumes/WenshuSpace/下载/xhs-knowledge-articles/ 下的
 * 第 59-300 篇 MD 文章上传到 Supabase pitfallfree_guides 表（locale='zh'）。
 *
 * 特性：
 *  - 自动从中文文件名生成语义化英文 slug（无需手工维护映射表）
 *  - 按文章编号生成发布日期（从 2026-03-01 起，第59篇开始）
 *  - 按内容关键词自动推断 tags
 *  - 支持 upsert（slug+locale 去重），可重复运行
 *
 * Usage:
 *   node scripts/seed-xhs-batch2.mjs
 *   node scripts/seed-xhs-batch2.mjs --dry-run   # 仅解析，不上传
 *   node scripts/seed-xhs-batch2.mjs --from=100  # 从编号100开始
 *   node scripts/seed-xhs-batch2.mjs --to=150    # 到编号150结束
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import path from 'path'

// ── CLI 参数 ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const FROM_NUM = parseInt(args.find((a) => a.startsWith('--from='))?.split('=')[1] || '59', 10)
const TO_NUM = parseInt(args.find((a) => a.startsWith('--to='))?.split('=')[1] || '300', 10)

// ── Supabase 配置 ──────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0OTM3OCwiZXhwIjoyMDkzNzI1Mzc4fQ.CBarLrHnr-tr5ZPaGs2JvW3NJE6O5O1Hw7oTWsHuI-E'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── 文章目录 ──────────────────────────────────────────────────────────────
const ARTICLES_DIR = '/Volumes/WenshuSpace/下载/xhs-knowledge-articles'

// ── 中文关键词 → 英文 slug 片段映射（用于自动生成语义化 slug）────────────
const ZH_TO_EN = {
  // 数码/3C
  '显卡': 'gpu', '固态硬盘': 'ssd', '无线路由器': 'wifi-router', '路由器': 'router',
  'NAS': 'nas', '家用NAS': 'home-nas', '耳机': 'headphone', '键盘': 'keyboard',
  '鼠标': 'mouse', '显示器': 'monitor', '笔记本': 'laptop', '手机': 'smartphone',
  '平板': 'tablet', '摄像头': 'camera', '投影仪': 'projector', '电视': 'tv',
  '音箱': 'speaker', '智能音箱': 'smart-speaker', '蓝牙耳机': 'bluetooth-earphone',
  '无线充电': 'wireless-charging', '快充': 'fast-charging', '声卡': 'audio-interface',
  '麦克风': 'microphone', '打印机': 'printer', '游戏主机': 'gaming-console',
  '智能手表': 'smartwatch', '智能手环': 'fitness-tracker', '5G': '5g',
  'WiFi': 'wifi', 'CPU': 'cpu', 'GPU': 'gpu',
  // 家电
  '冰箱': 'refrigerator', '空调': 'air-conditioner', '洗衣机': 'washing-machine',
  '油烟机': 'range-hood', '抽油烟机': 'range-hood', '烟机': 'range-hood',
  '电热水器': 'electric-water-heater', '燃气热水器': 'gas-water-heater', '热水器': 'water-heater',
  '洗碗机': 'dishwasher', '扫地机器人': 'robot-vacuum', '拖地机器人': 'robot-mop',
  '洗地机': 'floor-washer', '吸尘器': 'vacuum-cleaner', '除湿机': 'dehumidifier',
  '加湿器': 'humidifier', '空气净化器': 'air-purifier', '净化器': 'air-purifier',
  '新风系统': 'fresh-air-system', '空气炸锅': 'air-fryer', '电饭锅': 'rice-cooker',
  '破壁机': 'blender', '豆浆机': 'soymilk-maker', '微波炉': 'microwave',
  '烤箱': 'oven', '蒸烤箱': 'steam-oven', '吹风机': 'hair-dryer',
  '电动牙刷': 'electric-toothbrush', '冲牙器': 'water-flosser',
  '筋膜枪': 'massage-gun', '脱毛仪': 'hair-removal-device', '烘干机': 'dryer',
  '净水器': 'water-purifier', '燃气灶': 'gas-stove',
  // 家居/装修
  '床垫': 'mattress', '沙发': 'sofa', '衣柜': 'wardrobe', '餐桌': 'dining-table',
  '餐椅': 'dining-chair', '书桌': 'desk', '书柜': 'bookshelf', '台灯': 'desk-lamp',
  '窗帘': 'curtain', '地板': 'flooring', '木地板': 'hardwood-floor',
  '瓷砖': 'tile', '乳胶漆': 'latex-paint', '涂料': 'paint', '壁纸': 'wallpaper',
  '实木家具': 'solid-wood-furniture', '板材家具': 'panel-furniture',
  '人体工学椅': 'ergonomic-chair', '椅': 'chair',
  '水槽': 'sink', '龙头': 'faucet', '花洒': 'shower-head', '浴缸': 'bathtub',
  '智能马桶': 'smart-toilet', '马桶': 'toilet', '卫浴': 'bathroom',
  '浴室柜': 'bathroom-cabinet', '镜柜': 'mirror-cabinet', '卫浴五金': 'bathroom-hardware',
  '防火门': 'fire-door', '防盗门': 'security-door', '智能门锁': 'smart-lock',
  '门锁': 'door-lock', '视频监控': 'security-camera', '摄像': 'camera',
  '挂架': 'wall-mount', '电视挂架': 'tv-wall-mount', '收纳': 'storage',
  '台面': 'countertop', '厨房': 'kitchen', '水电': 'plumbing-electrical',
  '暖气': 'heating', '地暖': 'underfloor-heating', '窗户': 'window',
  // 护肤/美妆
  '防晒': 'sunscreen', '精华': 'serum', '面霜': 'moisturizer', '眼霜': 'eye-cream',
  '洗面奶': 'cleanser', '护肤': 'skincare', '刷酸': 'chemical-exfoliation',
  '烟酰胺': 'niacinamide', '维生素C': 'vitamin-c', '视黄醇': 'retinol',
  '玻尿酸': 'hyaluronic-acid', '神经酰胺': 'ceramide', '成分': 'ingredients',
  '屏障': 'skin-barrier', '敏感肌': 'sensitive-skin', '美白': 'whitening',
  '抗老': 'anti-aging', '补水': 'hydration', '射频美容仪': 'rf-beauty-device',
  '美容仪': 'beauty-device', '脱毛': 'hair-removal',
  // 母婴
  '婴儿': 'baby', '婴幼儿': 'infant', '宝宝': 'baby',
  '辅食': 'baby-food', '奶粉': 'formula', '奶瓶': 'bottle',
  '推车': 'stroller', '安全座椅': 'car-seat', '背巾': 'baby-carrier',
  '母乳': 'breastfeeding', '睡袋': 'sleep-sack', '益生菌': 'probiotics',
  // 宠物
  '猫粮': 'cat-food', '狗粮': 'dog-food', '猫砂': 'cat-litter',
  '猫咪': 'cat', '狗狗': 'dog', '宠物': 'pet',
  '猫砂盆': 'litter-box', '智能猫砂盆': 'smart-litter-box',
  '驱虫': 'parasite-control', '疫苗': 'vaccination',
  // 运动/户外
  '跑步': 'running', '骑行': 'cycling', '登山': 'hiking', '徒步': 'hiking',
  '露营': 'camping', '帐篷': 'tent', '睡袋': 'sleeping-bag', '溯溪': 'canyoning',
  '攀岩': 'climbing', '瑜伽': 'yoga', '健身': 'fitness', '哑铃': 'dumbbell',
  '壶铃': 'kettlebell', '弹力带': 'resistance-band', '单杠': 'pull-up-bar',
  '跑鞋': 'running-shoes', '登山鞋': 'hiking-boots', '护具': 'sports-protection',
  '护膝': 'knee-support', '补剂': 'supplement',
  // 二手/租房
  '二手车': 'used-car', '二手手机': 'used-phone', '二手电脑': 'used-laptop',
  '二手家具': 'used-furniture', '二手家电': 'used-appliance', '二手': 'secondhand',
  '奢侈品': 'luxury-goods', '租房': 'rental',
  // 通用
  '选购': 'buying-guide', '指南': 'guide', '深度': 'deep-dive',
  '科学': 'science', '完整': 'complete', '避坑': 'pitfall',
  '技术': 'tech', '原理': 'mechanism', '参数': 'specs',
}

// ── 文章分类标签规则（基于关键词匹配）────────────────────────────────────
const TAG_RULES = [
  { keywords: ['显卡', 'GPU', '固态硬盘', '路由器', 'NAS', '键盘', '鼠标', '显示器', '笔记本', '手机', '平板', '投影仪', '电视', '蓝牙', '无线充电', '快充', '声卡', '打印机', '游戏主机', '智能手表', '智能手环', '5G', '摄像头', 'WiFi', '监控'], tags: ['tech-specs'] },
  { keywords: ['护肤', '防晒', '精华', '面霜', '眼霜', '洗面奶', '刷酸', '烟酰胺', '维生素C', '玻尿酸', '屏障', '敏感肌', '美白', '抗老', '成分', '脱毛仪', '美容仪', '射频'], tags: ['skincare-science'] },
  { keywords: ['猫粮', '狗粮', '猫砂', '猫咪', '狗狗', '宠物', '驱虫', '疫苗'], tags: ['pet-nutrition'] },
  { keywords: ['婴儿', '婴幼儿', '宝宝', '辅食', '奶粉', '奶瓶', '推车', '安全座椅', '背巾', '母乳', '益生菌'], tags: ['parenting'] },
  { keywords: ['跑步', '骑行', '登山', '徒步', '露营', '帐篷', '溯溪', '攀岩', '瑜伽', '健身', '哑铃', '壶铃', '弹力带', '单杠', '跑鞋', '登山鞋', '补剂'], tags: ['outdoor-fitness'] },
  { keywords: ['二手', '奢侈品', '鉴别', '验机'], tags: ['secondhand'] },
  { keywords: ['租房', '装修', '合同'], tags: ['rental-living'] },
  { keywords: ['冰箱', '空调', '洗衣机', '油烟机', '抽油烟机', '热水器', '洗碗机', '扫地机器人', '拖地机器人', '洗地机', '吸尘器', '除湿机', '加湿器', '净化器', '新风系统', '空气炸锅', '电饭锅', '破壁机', '豆浆机', '微波炉', '烤箱', '吹风机', '电动牙刷', '冲牙器', '筋膜枪', '烘干机', '净水器', '燃气灶'], tags: ['home-appliance'] },
  { keywords: ['床垫', '沙发', '衣柜', '餐桌', '书桌', '台灯', '窗帘', '地板', '瓷砖', '涂料', '乳胶漆', '实木家具', '板材家具', '人体工学椅', '水槽', '龙头', '花洒', '浴缸', '智能马桶', '卫浴', '浴室柜', '防盗门', '智能门锁', '门锁', '台面', '暖气', '地暖', '水电改造'], tags: ['home-living'] },
]

// ── 从文件名自动生成英文 slug ─────────────────────────────────────────────
function generateSlug(filename) {
  // 文件名格式: "059_显卡选购指南_GPU参数解读" 或 "059_显卡选购指南"
  const numMatch = filename.match(/^(\d+)_(.+)$/)
  if (!numMatch) return null

  const num = numMatch[1].padStart(3, '0')
  let zhTitle = numMatch[2]
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')

  // 先直接做整词替换
  let enParts = []

  // 对中文标题拆词并翻译
  let remaining = zhTitle
  const sortedKeys = Object.keys(ZH_TO_EN).sort((a, b) => b.length - a.length) // 长词优先匹配

  const matched = new Set()
  for (const zh of sortedKeys) {
    if (remaining.includes(zh) && !matched.has(ZH_TO_EN[zh])) {
      enParts.push(ZH_TO_EN[zh])
      matched.add(ZH_TO_EN[zh])
      remaining = remaining.replace(new RegExp(zh, 'g'), ' ')
    }
  }

  // 清理剩余中文字符，保留英文字母
  const extraEn = remaining
    .replace(/[\u4e00-\u9fff]+/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .filter((s) => s.length > 1)
    .map((s) => s.toLowerCase())

  enParts.push(...extraEn)

  // 去重保留顺序
  const seen = new Set()
  const unique = enParts.filter((p) => {
    if (seen.has(p)) return false
    seen.add(p)
    return true
  })

  // 取前4个片段 + 编号后缀，限制 slug 长度
  const slug = unique.slice(0, 4).join('-') + `-zh${num}`
  return slug.replace(/--+/g, '-').replace(/^-|-$/g, '')
}

// ── 自动推断 tags ─────────────────────────────────────────────────────────
function inferTags(title, content) {
  const text = title + ' ' + content.slice(0, 500)
  const tagSet = new Set(['buying-guide'])

  for (const rule of TAG_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        for (const t of rule.tags) tagSet.add(t)
        break
      }
    }
  }

  return [...tagSet]
}

// ── 从 Markdown 中提取第一行 H1 标题 ────────────────────────────────────
function extractTitle(content) {
  for (const line of content.split('\n')) {
    const m = line.match(/^#\s+(.+)/)
    if (m) return m[1].trim()
  }
  return ''
}

// ── 从 Markdown 中提取摘要 ────────────────────────────────────────────────
function extractSummary(content, maxLen = 200) {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue
    const clean = trimmed.replace(/\*\*/g, '').replace(/`/g, '').replace(/>/g, '').trim()
    if (clean.length > 20) {
      return clean.slice(0, maxLen)
    }
  }
  return ''
}

// ── 解析文件 ─────────────────────────────────────────────────────────────
function parseArticle(filePath) {
  const filename = path.basename(filePath, '.md')
  const numMatch = filename.match(/^(\d+)_/)
  if (!numMatch) return null

  const num = parseInt(numMatch[1], 10)
  if (num < FROM_NUM || num > TO_NUM) return null

  const slug = generateSlug(filename)
  if (!slug) {
    console.warn(`  ⚠️  Cannot generate slug for: ${filename}`)
    return null
  }

  const rawContent = readFileSync(filePath, 'utf-8')
  const title = extractTitle(rawContent) || filename.replace(/^\d+_/, '').replace(/_/g, ' ')
  const summary = extractSummary(rawContent)
  const tags = inferTags(title, rawContent)

  // 发布日期：第59篇从 2026-03-01 开始，每天一篇
  const baseDate = new Date('2026-03-01')
  baseDate.setDate(baseDate.getDate() + (num - 59))
  const published_at = baseDate.toISOString().split('T')[0]

  return {
    slug,
    locale: 'zh',
    title,
    summary,
    tags,
    layout: 'PostLayout',
    published_at,
    lastmod: null,
    draft: false,
    authors: ['default'],
    content: rawContent.trim(),
  }
}

// ── 主流程 ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 LogicBuy — XHS Articles Batch 2 (59-300) Seed Script')
  console.log(`   Supabase:  ${SUPABASE_URL}`)
  console.log(`   Source:    ${ARTICLES_DIR}`)
  console.log(`   Range:     ${FROM_NUM} ~ ${TO_NUM}`)
  console.log(`   Dry Run:   ${DRY_RUN}`)
  console.log(`   Table:     pitfallfree_guides (locale=zh)\n`)

  // Step 1: 检查表结构和 locale 列
  console.log('🔧 Checking table schema...')
  const { data: testData, error: testErr } = await supabase
    .from('pitfallfree_guides')
    .select('locale')
    .limit(1)

  if (testErr) {
    console.error(`❌ Cannot access table or locale column missing: ${testErr.message}`)
    console.error('   Please ensure the table exists and has a locale column.')
    console.error('   Refer to scripts/seed-xhs-articles.mjs for migration SQL.')
    process.exit(1)
  }
  console.log('  ✅ Table schema OK\n')

  // Step 2: 读取所有 .md 文件
  let files
  try {
    files = readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort((a, b) => {
        const na = parseInt(a.match(/^(\d+)/)?.[1] || '0', 10)
        const nb = parseInt(b.match(/^(\d+)/)?.[1] || '0', 10)
        return na - nb
      })
      .map((f) => path.join(ARTICLES_DIR, f))
  } catch (e) {
    console.error(`❌ Cannot read directory: ${ARTICLES_DIR}`)
    process.exit(1)
  }

  console.log(`📂 Total .md files in directory: ${files.length}`)
  console.log(`   Processing range: ${FROM_NUM} ~ ${TO_NUM}\n`)

  // Step 3: 解析文章
  const articles = []
  const slugSet = new Set()

  for (const file of files) {
    const rel = path.basename(file)
    try {
      const parsed = parseArticle(file)
      if (!parsed) continue

      // slug 冲突检测
      if (slugSet.has(parsed.slug)) {
        console.warn(`  ⚠️  Duplicate slug detected: ${parsed.slug} (${rel}), appending suffix`)
        parsed.slug = parsed.slug + '-b'
      }
      slugSet.add(parsed.slug)

      articles.push(parsed)
      console.log(`  📄 [${String(articles.length).padStart(3)}] ${parsed.slug}`)
      console.log(`       标题: ${parsed.title.slice(0, 55)}`)
      console.log(`       Tags: [${parsed.tags.join(', ')}]`)
      console.log(`       Date: ${parsed.published_at} | ${parsed.content.length} chars`)
    } catch (e) {
      console.error(`  ❌ Failed to parse ${rel}: ${e.message}`)
    }
  }

  console.log(`\n📊 Parsed ${articles.length} article(s)`)

  if (articles.length === 0) {
    console.log('⚠️  No articles parsed. Check the range or directory.')
    process.exit(0)
  }

  if (DRY_RUN) {
    console.log('\n🔍 Dry-run mode — no data uploaded.')
    console.log('   Remove --dry-run to actually upload.')
    process.exit(0)
  }

  // Step 4: Upsert（分批，每批10篇）
  console.log(`\n⬆️  Uploading ${articles.length} article(s) to Supabase...\n`)

  let successCount = 0
  let errorCount = 0
  const BATCH_SIZE = 10

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(articles.length / BATCH_SIZE)

    const { error } = await supabase
      .from('pitfallfree_guides')
      .upsert(
        batch.map((a) => ({ ...a, updated_at: new Date().toISOString() })),
        { onConflict: 'slug,locale' }
      )

    if (error) {
      console.warn(`  ⚠️  Batch ${batchNum}/${totalBatches} failed: ${error.message}`)
      console.warn(`      Retrying one by one...`)
      for (const article of batch) {
        const { error: singleErr } = await supabase
          .from('pitfallfree_guides')
          .upsert(
            { ...article, updated_at: new Date().toISOString() },
            { onConflict: 'slug,locale' }
          )
        if (singleErr) {
          console.error(`  ❌ "${article.slug}": ${singleErr.message}`)
          errorCount++
        } else {
          console.log(`  ✅ ${article.slug}`)
          successCount++
        }
      }
    } else {
      for (const a of batch) {
        console.log(`  ✅ [${batchNum}/${totalBatches}] ${a.slug}`)
      }
      successCount += batch.length
    }
  }

  // Step 5: 结果汇总
  console.log('\n' + '─'.repeat(60))
  console.log('🎉 Done!')
  console.log(`   ✅ Upserted : ${successCount}`)
  console.log(`   ❌ Errors   : ${errorCount}`)
  console.log(`   📋 Total zh articles expected: ~300`)

  if (successCount > 0) {
    console.log('\n📊 Verify in Supabase:')
    console.log(`   https://supabase.com/dashboard/project/tixgzezefjjsyuzgdhcd/editor`)
    console.log(`\n   SELECT COUNT(*), locale FROM pitfallfree_guides GROUP BY locale;`)
    console.log(`   SELECT slug, title, published_at FROM pitfallfree_guides`)
    console.log(`   WHERE locale = 'zh' ORDER BY published_at DESC LIMIT 10;`)
  }
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err.message)
  process.exit(1)
})

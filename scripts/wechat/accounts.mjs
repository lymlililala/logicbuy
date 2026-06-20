// 0) 解析选购/测评公众号名 → wxid。一次性步骤，结果落 accounts.json，人工核对。
// 用法：node scripts/wechat/accounts.mjs
//       node scripts/wechat/accounts.mjs --only "什么值得买,老爸评测"   # 只解析部分
//
// 注意：cimidata searchAccounts 只返回 nickname/wxid/biz/description，
//       不返回粉丝数/更新频率。"粉丝多、更新勤、质量高"靠下面这份人工精选种子名单
//       保证；本脚本只负责把名字解析成 wxid（含同名号候选，供人工纠错）。

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { CimiClient } from './cimidata/client.mjs'
import { DATA_DIR, ACCOUNTS_FILE } from './lib/env.mjs'

// 目标公众号 —— 面向 logicbuy 双语选购/踩坑指南站的主题（消费品选购、测评、避坑、
// 数码 3C、家电、家居家装、母婴、美妆个护、运动户外、宠物、厨房）。
// 选号标准：粉丝量大、更新频率高、内容以参数/测评/选购/避坑为主（少软文、少纯带货）。
// 已知重广告/低质号不入选；同名号问题留 candidates 供人工核对后改 wxid。
const ACCOUNT_NAMES = [
  // ── 综合选购 / 避坑 / 值得买（最对口、粉丝最大）──
  '什么值得买',
  '老爸评测',
  '消费者报道',
  '中国消费者报',
  '企鹅评测团',
  '玩物志',
  // ── 数码 3C 测评（高频、高质量）──
  '爱否科技',
  'FView',
  'ZEALER',
  '小白测评',
  '笔吧评测室',
  '充电头网',
  '差评',
  '数字尾巴',
  '雷科技',
  '三易生活',
  'ZAEKE知客',
  '大米评测',
  // ── 家电 / 生活电器 ──
  '万维家电网',
  '家电网HEA',
  '中关村在线',
  // ── 家居 / 家装（home-renovation / furniture）──
  '一条',
  '好好住',
  '住小帮',
  // ── 母婴（baby / stroller / parenting）──
  '丁香妈妈',
  '年糕妈妈',
  // ── 美妆个护 / 护肤（skincare-personal-care）──
  '丁香医生',
  '美丽修行',
  '化妆品观察',
  // ── 运动户外 / 宠物 / 厨房 ──
  '户外探险outdoor',
  '萌爪医生',
  '企鹅吃喝指南',
]

const onlyArg = process.argv.find((a) => a.startsWith('--only'))
const only = onlyArg
  ? (onlyArg.split('=')[1] || process.argv[process.argv.indexOf(onlyArg) + 1] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null
const names = only && only.length ? ACCOUNT_NAMES.filter((n) => only.includes(n)) : ACCOUNT_NAMES

mkdirSync(DATA_DIR, { recursive: true })
const OUT = ACCOUNTS_FILE

// 已解析的保留（增量）
const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : []
const byName = new Map(existing.map((a) => [a.name, a]))

const cimi = new CimiClient({ minIntervalMs: 2500 })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// cimidata 搜索需预热：同名首次常报 1002「没有找到结果，请稍后再试」，重试即可。
async function searchWithRetry(name, tries = 4) {
  let lastErr
  for (let i = 0; i < tries; i++) {
    try {
      const r = await cimi.searchAccounts(name)
      if (r.length) return r
    } catch (e) {
      lastErr = e
      if (e.code !== 1002) throw e // 非「稍后再试」错误直接抛
    }
    await sleep(6000) // 等预热
  }
  if (lastErr) throw lastErr
  return []
}

console.log(`解析 ${names.length} 个选购/测评公众号 wxid（含重试，较慢）…\n`)

for (const name of names) {
  if (byName.get(name)?.wxid) {
    console.log(`✓ 已有  ${name}  ${byName.get(name).wxid}`)
    continue
  }
  try {
    const accounts = await searchWithRetry(name)
    // 取昵称精确匹配优先，否则第一个
    const exact = accounts.find((a) => a.nickname === name)
    const best = exact || accounts[0]
    if (!best) {
      console.log(`✗ 未找到  ${name}`)
      byName.set(name, { name, wxid: null, candidates: [] })
      continue
    }
    byName.set(name, {
      name,
      nickname: best.nickname,
      wxid: best.wxid,
      biz: best.biz,
      description: best.description,
      // 留候选供人工纠错（同名号问题）
      candidates: accounts
        .slice(0, 5)
        .map((a) => ({ nickname: a.nickname, wxid: a.wxid, description: a.description })),
    })
    const flag = exact ? '✓' : '?'
    console.log(
      `${flag} ${name}  →  ${best.nickname}  ${best.wxid}${exact ? '' : '  (非精确匹配，请核对)'}`
    )
  } catch (e) {
    console.log(`✗ 出错  ${name}: ${e.message}`)
    byName.set(name, { name, wxid: null, error: e.message })
  }
}

const result = ACCOUNT_NAMES.map((n) => byName.get(n)).filter(Boolean)
writeFileSync(OUT, JSON.stringify(result, null, 2))
console.log(`\n已写入 ${OUT}`)
console.log(
  `成功 ${result.filter((a) => a.wxid).length}/${ACCOUNT_NAMES.length}，余额 ${cimi.balance}`
)
console.log('⚠️  请打开 accounts.json 核对带 (非精确匹配) 的项，必要时从 candidates 手动改 wxid；')
console.log('    剔除解析错/同名号/低质号后，供下一轮采集流水线使用。')

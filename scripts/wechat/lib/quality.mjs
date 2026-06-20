// 发布前质量闸门（logicbuy）—— 面向**双语选购指南**合成文章，按 locale 区分。
// 命中任一硬性问题 → 不过线（该文 draft=true）。

// 已知劣质模板指纹（AI 套话/洗稿痕迹）。中文指纹只对 zh 查，英文指纹只对 en 查。
const FP_EN = [
  [/covers everything you need to know/i, 'FP-everything'],
  [/in (this|the following) (comprehensive )?guide,? (we'?ll|you'?ll|i'?ll)/i, 'FP-in-this-guide'],
  [/look no further/i, 'FP-look-no-further'],
  [/(unlock|unleash|elevate) your (buying|shopping|purchase)/i, 'FP-unlock'],
  [/as an ai language model/i, 'FP-ai-disclaimer'],
  [/本文|小编|公众号|原文链接|扫码关注/, 'FP-leftover-chinese'], // EN 文里残留中文 = 洗稿痕迹
]
const FP_ZH = [
  [/as an ai language model/i, 'FP-ai-disclaimer'],
  [/小编|扫码关注|原文链接|点击上方蓝字/, 'FP-wechat-residue'], // 公众号洗稿痕迹
]

/** FAQ 对计数：支持 ## FAQ（**Q** 形式）与 ## 常见问题（### 小标题形式）。 */
export function countFaqPairs(markdown) {
  if (!markdown) return 0
  const m = markdown.match(
    /^##\s*(?:FAQ|Frequently Asked Questions|常见问题|常見問題)[^\n]*\n([\s\S]*?)(?=^##\s|^---\s*$|(?![\s\S]))/m
  )
  if (!m) return 0
  const body = m[1]
  // 形式 A：### 问题\n答案
  const hPairs = [...body.matchAll(/^###\s+(.+)\n+([\s\S]*?)(?=^###\s|\n*$)/gm)].filter(
    (x) => x[1].trim().length >= 4 && x[2].trim().length >= 10
  ).length
  if (hPairs >= 2) return hPairs
  // 形式 B：**问题** 答案
  const blocks = body.split(/\n{2,}/)
  const pairs = []
  let cur = null
  for (const block of blocks) {
    const b = block.trim()
    if (!b) continue
    const qm = b.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/)
    if (qm) {
      if (cur && cur.a) pairs.push(cur)
      cur = { q: qm[1].trim(), a: qm[2].trim() }
    } else if (cur) {
      cur.a = (cur.a ? cur.a + ' ' : '') + b
    }
  }
  if (cur && cur.a) pairs.push(cur)
  return Math.max(hPairs, pairs.filter((p) => p.q.length >= 4 && p.a.length >= 10).length)
}

/**
 * 检查一篇某 locale 的合成文是否达标。
 * @param {object} doc   { title, content, summary, faq }
 * @param {object} opts  { locale:'en'|'zh', minChars, requireFaq, requireImages, requireLinks }
 */
export function checkQuality(doc, opts = {}) {
  const locale = opts.locale || 'en'
  // 中文更紧凑：同等信息量字符数更少，门槛低些
  const minChars = opts.minChars ?? (locale === 'zh' ? 1200 : 2800)
  const content = doc.content || ''
  const reasons = []

  if (content.length < minChars) reasons.push(`THIN:${content.length}<${minChars}`)

  const fps = locale === 'zh' ? FP_ZH : FP_EN
  for (const [re, name] of fps) if (re.test(content)) reasons.push(`FINGERPRINT:${name}`)

  const fmFaq = Array.isArray(doc.faq)
    ? doc.faq.filter((f) => f && (f.question || '').length >= 4 && (f.answer || '').length >= 10)
        .length
    : 0
  const faqPairs = Math.max(fmFaq, countFaqPairs(content))
  if (opts.requireFaq !== false && faqPairs < 2) reasons.push(`FAQ:${faqPairs}<2`)

  if (!doc.title || doc.title.length < 8) reasons.push('TITLE:too-short')
  const desc = doc.summary || doc.description || ''
  // 中文 meta 信息密度高，门槛低些（避免合格的简短中文摘要被误杀）
  const descMin = locale === 'zh' ? 24 : 40
  if (desc.length < descMin) reasons.push('DESC:too-short')
  if (desc.length > 200) reasons.push(`DESC:too-long:${desc.length}`)

  // EN 正文应以拉丁字母为主；残留大量中文 → 翻译/合成不彻底（zh 不查此项）
  if (locale === 'en') {
    const cjk = (content.match(/[一-龥]/g) || []).length
    if (cjk > content.length * 0.03) reasons.push(`HIGH-CJK:${cjk}`)
  }

  // 配图：≥2 张占位 ![alt](IMG: kw)（封面 + 正文）
  const imgs = (content.match(/!\[[^\]]*\]\(\s*IMG:[^)]*\)/gi) || []).length
  if (opts.requireImages !== false && imgs < 2) reasons.push(`IMG:${imgs}<2`)

  // 站内链接：≥1 条 /{locale}/(guides|tags|pitfalls)/... 内链（内链建设 + 降跳出）
  const links = (
    content.match(/\]\(\/(?:en|zh)\/(?:guides|tags|pitfalls)\/[a-z0-9-]+\/?\)/gi) || []
  ).length
  if (opts.requireLinks !== false && links < 1) reasons.push(`LINKS:${links}<1`)

  return { pass: reasons.length === 0, reasons, faqPairs, len: content.length, images: imgs, links }
}

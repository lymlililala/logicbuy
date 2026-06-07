/**
 * 正文内联内链：把文章正文中提及的产品词自动链接到对应 guide。
 *
 * 设计原则（保守、安全、避免过度优化）：
 * - 只在 HAST 文本节点上操作，跳过标题/已有链接/代码块 —— 不对 HTML 字符串做正则，结构安全
 * - 关键词只取「干净的 *-buying-guide」slug 派生的高精度产品短语，避免泛词误链
 * - 每个短语整篇最多链一次；整篇总数封顶；排除指向自身或已合并页
 */

type HNode = {
  type: string
  tagName?: string
  value?: string
  children?: HNode[]
  properties?: Record<string, unknown>
}

const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre'])
const STOPWORD_PHRASES = new Set(['home', 'smart', 'baby', 'pet', 'best', 'guide'])

export interface LinkEntry {
  phrase: string
  slug: string
  re: RegExp
}

/** 从 slug 列表构建「产品短语 → slug」高精度映射（仅取 *-buying-guide 干净 slug）。 */
export function buildInternalLinkEntries(slugs: string[], currentSlug: string): LinkEntry[] {
  const seen = new Set<string>()
  const entries: LinkEntry[] = []
  for (const slug of slugs) {
    if (slug === currentSlug) continue
    if (!slug.endsWith('-buying-guide')) continue
    const core = slug.slice(0, -'-buying-guide'.length)
    if (!core) continue
    const words = core.split('-')
    if (words.length > 3) continue // 太长的不是干净产品名
    const phrase = words.join(' ')
    if (phrase.length < 6) continue // 太短易误匹配
    if (STOPWORD_PHRASES.has(phrase)) continue
    if (seen.has(phrase)) continue
    seen.add(phrase)
    // 整词、忽略大小写、允许结尾复数 s
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s)?\\b`, 'i')
    entries.push({ phrase, slug, re })
  }
  // 长短语优先匹配，避免被短短语抢先
  return entries.sort((a, b) => b.phrase.length - a.phrase.length)
}

/** rehype 插件：在正文文本节点中注入内链。 */
export function rehypeInternalLinks(entries: LinkEntry[], locale: string, cap = 3) {
  return (tree: HNode) => {
    if (entries.length === 0) return
    let linked = 0
    const usedSlugs = new Set<string>()

    const walk = (node: HNode, insideSkip: boolean) => {
      if (!node.children) return
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.type === 'element') {
          const skip = insideSkip || (child.tagName ? SKIP_TAGS.has(child.tagName) : false)
          walk(child, skip)
        } else if (child.type === 'text' && !insideSkip && linked < cap) {
          const text = child.value || ''
          for (const entry of entries) {
            if (usedSlugs.has(entry.slug)) continue
            const m = entry.re.exec(text)
            if (!m || m.index === undefined) continue
            const before = text.slice(0, m.index)
            const matched = m[0]
            const after = text.slice(m.index + matched.length)
            const anchor: HNode = {
              type: 'element',
              tagName: 'a',
              properties: {
                href: `/${locale}/guides/${entry.slug}`,
                className: ['internal-link'],
              },
              children: [{ type: 'text', value: matched }],
            }
            const replacement: HNode[] = []
            if (before) replacement.push({ type: 'text', value: before })
            replacement.push(anchor)
            if (after) replacement.push({ type: 'text', value: after })
            node.children.splice(i, 1, ...replacement)
            i += replacement.length - 1
            usedSlugs.add(entry.slug)
            linked++
            break // 每个文本节点最多注入一个链接
          }
          if (linked >= cap) return
        }
      }
    }

    walk(tree, false)
  }
}

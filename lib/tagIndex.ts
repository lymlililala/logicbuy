import { CATEGORIES } from '@/data/categories'

/**
 * 标签页索引策略的单一数据源 —— sitemap.ts 与 /[locale]/tags/[tag] 同源复用，
 * 保证「进 sitemap 的标签」与「页面 robots=index 的标签」完全一致，
 * 避免薄标签页被收录后停留在「已抓取-未编入索引」。
 */

/** 孤儿标签收录门槛：少于该文章数的标签页内容过薄，不索引、不进 sitemap。 */
export const MIN_TAG_GUIDES = 3

/** 通用噪音标签：几乎挂在每篇文章上，对应页面等同于全站列表，不应收录。 */
export const TAG_BLOCKLIST = new Set(['tags', 'buying-guide', 'experience-guide'])

/**
 * 专栏标记 tag：仅用于专栏聚合与同标记互链，不作为面向用户的可见标签展示。
 * - pitfall-guide：「踩坑指南」专栏（有独立 /pitfalls 路由）。
 * - experience-guide：「商品体验」角度（暂复用 guides 渲染，无独立路由，故并入 TAG_BLOCKLIST 不收录其薄聚合页）。
 */
export const MARKER_TAGS = new Set(['pitfall-guide', 'experience-guide'])

let _taxonomy: Set<string> | null = null
/** taxonomy 覆盖的标签 slug（大类 + 子类）—— 结构性入口页，恒可索引。 */
export function taxonomyTagSlugs(): Set<string> {
  if (_taxonomy) return _taxonomy
  const slugs = new Set<string>()
  for (const cat of CATEGORIES) {
    slugs.add(cat.slug)
    for (const sub of cat.subcategories) slugs.add(sub.slug)
  }
  _taxonomy = slugs
  return slugs
}

/**
 * 标签页是否值得被索引 / 进 sitemap：
 *  - 噪音标签 → 否
 *  - taxonomy 分类页 → 是（结构性入口，文章数不限）
 *  - 实质孤儿标签（被 ≥ MIN_TAG_GUIDES 篇文章使用）→ 是
 *  - 其余薄标签 → 否
 */
export function isIndexableTag(slug: string, guideCount: number): boolean {
  if (TAG_BLOCKLIST.has(slug)) return false
  if (taxonomyTagSlugs().has(slug)) return true
  return guideCount >= MIN_TAG_GUIDES
}

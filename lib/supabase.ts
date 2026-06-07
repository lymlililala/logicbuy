import { createClient } from '@supabase/supabase-js'
import guideRedirects from '@/data/guide-redirects.json'

const supabaseUrl = 'https://tixgzezefjjsyuzgdhcd.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeGd6ZXplZmpqc3l1emdkaGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDkzNzgsImV4cCI6MjA5MzcyNTM3OH0.Hpr0F_kgFc9OkOla-UGHBioR6y2OBB2jbI-0xKMU1M4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Guide {
  id: number
  slug: string
  locale: string
  title: string
  summary: string
  tags: string[]
  layout: string
  published_at: string
  lastmod: string | null
  draft: boolean
  authors: string[]
  content: string
  created_at: string
  updated_at: string
}

/**
 * 获取指定语言的所有文章，如果该语言没有对应文章则 fallback 到 zh。
 * 返回列表不含正文 content（节省带宽）。
 */
export async function fetchGuideList(locale: string): Promise<Guide[]> {
  // 先取该语言的文章
  const { data: localeData, error: localeError } = await supabase
    .from('pitfallfree_guides')
    .select('id, slug, locale, title, summary, tags, published_at, lastmod, draft, authors')
    .eq('locale', locale)
    .eq('draft', false)
    .order('published_at', { ascending: false })

  if (!localeError && localeData && localeData.length > 0) {
    return localeData as Guide[]
  }

  // fallback：取中文文章
  if (locale !== 'zh') {
    const { data: zhData } = await supabase
      .from('pitfallfree_guides')
      .select('id, slug, locale, title, summary, tags, published_at, lastmod, draft, authors')
      .eq('locale', 'zh')
      .eq('draft', false)
      .order('published_at', { ascending: false })

    return (zhData as Guide[]) || []
  }

  return []
}

/**
 * 获取单篇文章，优先取目标语言，找不到则 fallback 到另一语言。
 * 包含完整 content。
 */
export async function fetchGuideBySlug(slug: string, locale: string): Promise<Guide | null> {
  // 先取目标语言
  const { data, error } = await supabase
    .from('pitfallfree_guides')
    .select('*')
    .eq('slug', slug)
    .eq('locale', locale)
    .eq('draft', false)
    .single()

  if (!error && data) {
    return data as Guide
  }

  // fallback：尝试另一种语言（zh ↔ en 双向互 fallback）
  const fallbackLocale = locale === 'zh' ? 'en' : 'zh'
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('pitfallfree_guides')
    .select('*')
    .eq('slug', slug)
    .eq('locale', fallbackLocale)
    .eq('draft', false)
    .single()

  if (!fallbackError && fallbackData) {
    return fallbackData as Guide
  }

  return null
}

/**
 * 获取文章列表（分页），用于 /guides 页面。
 */
export async function fetchGuideListPaged(
  locale: string,
  page: number,
  perPage: number
): Promise<{ guides: Guide[]; total: number }> {
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // 先取目标语言
  const { data, error, count } = await supabase
    .from('pitfallfree_guides')
    .select('id, slug, locale, title, summary, tags, published_at, lastmod, draft, authors', {
      count: 'exact',
    })
    .eq('locale', locale)
    .eq('draft', false)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (!error && data && data.length > 0) {
    return { guides: data as Guide[], total: count || 0 }
  }

  // fallback 到 zh
  if (locale !== 'zh') {
    const { data: zhData, count: zhCount } = await supabase
      .from('pitfallfree_guides')
      .select('id, slug, locale, title, summary, tags, published_at, lastmod, draft, authors', {
        count: 'exact',
      })
      .eq('locale', 'zh')
      .eq('draft', false)
      .order('published_at', { ascending: false })
      .range(from, to)

    return { guides: (zhData as Guide[]) || [], total: zhCount || 0 }
  }

  return { guides: [], total: 0 }
}

/**
 * 检查某个 slug 是否有对应语言的版本（用于语言切换器）。
 */
export async function checkGuideLocales(slug: string): Promise<string[]> {
  const { data } = await supabase
    .from('pitfallfree_guides')
    .select('locale')
    .eq('slug', slug)
    .eq('draft', false)

  return (data || []).map((row: { locale: string }) => row.locale)
}

/**
 * 按分类标签（大类或子类）获取文章列表，支持 locale fallback。
 * tagSlug 可以是大类 slug（如 'tech-electronics'）或子类 slug（如 'computers-peripherals'）。
 */
export async function fetchGuidesByTag(tagSlug: string, locale: string): Promise<Guide[]> {
  const tryLocale = async (loc: string) => {
    const { data, error } = await supabase
      .from('pitfallfree_guides')
      .select('id, slug, locale, title, summary, tags, published_at, lastmod, draft, authors')
      .contains('tags', [tagSlug])
      .eq('locale', loc)
      .eq('draft', false)
      .order('published_at', { ascending: false })
    if (error) return []
    return (data as Guide[]) || []
  }

  const result = await tryLocale(locale)
  if (result.length > 0) return result
  // 当前语言无文章时，fallback 到中文（会打 ZH only 标签告知用户）
  if (locale !== 'zh') return tryLocale('zh')
  return []
}

/**
 * 获取单语言文章总数（locale='zh'），用于首页统计展示。
 * EN/ZH 1:1 翻译，只取一种语言的数量即可。
 */
export async function fetchTotalGuideCount(): Promise<number> {
  const { count, error } = await supabase
    .from('pitfallfree_guides')
    .select('id', { count: 'exact', head: true })
    .eq('locale', 'zh')
    .eq('draft', false)

  if (error || count === null) return 0
  return count
}

/**
 * 获取所有文章的 tags 计数（按大类统计），用于分类页展示数量。
 * 返回 { tagSlug: count } 的 map。
 */
export async function fetchTagCounts(locale: string): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('pitfallfree_guides')
    .select('tags')
    .eq('locale', locale)
    .eq('draft', false)

  const counts: Record<string, number> = {}
  for (const row of data || []) {
    for (const tag of row.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return counts
}

/** 已被 301 合并的旧 slug：相关推荐里要排除，避免内链指向会跳转的页面 */
const REDIRECTED_SLUGS = new Set(Object.keys(guideRedirects))

/** 轻量获取某语言全部非草稿、未合并的 slug（用于正文内联内链关键词表）。 */
export async function fetchAllSlugs(locale: string): Promise<string[]> {
  const { data } = await supabase
    .from('pitfallfree_guides')
    .select('slug')
    .eq('locale', locale)
    .eq('draft', false)
  return (data || []).map((r: { slug: string }) => r.slug).filter((s) => !REDIRECTED_SLUGS.has(s))
}

/**
 * 获取与当前文章相关的文章（按共享标签数排序），用于详情页「相关指南」内链。
 * - 仅同语言、非草稿、未被合并的文章
 * - 排除自身
 * - 共享标签越多越靠前；同分按发布时间倒序
 */
export async function fetchRelatedGuides(
  currentSlug: string,
  tags: string[],
  locale: string,
  limit = 6
): Promise<Guide[]> {
  if (!tags || tags.length === 0) return []

  const { data, error } = await supabase
    .from('pitfallfree_guides')
    .select('id, slug, locale, title, summary, tags, published_at')
    .overlaps('tags', tags)
    .eq('locale', locale)
    .eq('draft', false)
    .neq('slug', currentSlug)
    .limit(60)

  if (error || !data) return []

  const tagSet = new Set(tags)
  const seen = new Set<string>()
  const scored = (data as Guide[])
    .filter((g) => {
      if (REDIRECTED_SLUGS.has(g.slug) || seen.has(g.slug)) return false
      seen.add(g.slug)
      return true
    })
    .map((g) => ({
      guide: g,
      shared: (g.tags || []).filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared || (b.guide.published_at > a.guide.published_at ? 1 : -1))

  return scored.slice(0, limit).map((s) => s.guide)
}

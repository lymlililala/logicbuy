import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { CATEGORIES } from '@/data/categories'
import { supabase } from '@/lib/supabase'
import guideRedirects from '@/data/guide-redirects.json'
import { MIN_TAG_GUIDES, TAG_BLOCKLIST, taxonomyTagSlugs } from '@/lib/tagIndex'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 小时重新生成一次

const LOCALES = ['en', 'zh'] as const
const BASE = siteMetadata.siteUrl
const NOW = new Date().toISOString().split('T')[0]
// 已被 301 合并掉的旧 slug：不再列入 sitemap（否则会列出会跳转的 URL）
const REDIRECTED_SLUGS = new Set(Object.keys(guideRedirects))

/** 固定静态路由（双语言） */
function staticRoutes(): MetadataRoute.Sitemap {
  const paths = [
    '', // 首页
    'guides', // 指南列表
    'pitfalls', // 踩坑指南专栏
    'tags', // 分类总览
    'about', // 关于我们
    'contact', // 联系我们
    'privacy', // 隐私政策
    'terms', // 服务条款
  ]

  // 信息/法务页变动少、权重低
  const LOW_FREQ = new Set(['about', 'contact', 'privacy', 'terms'])

  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const path of paths) {
      const url = path ? `${BASE}/${locale}/${path}` : `${BASE}/${locale}`
      entries.push({
        url,
        lastModified: NOW,
        changeFrequency: path === '' ? 'daily' : LOW_FREQ.has(path) ? 'yearly' : 'weekly',
        priority: path === '' ? 1.0 : path === 'guides' ? 0.9 : LOW_FREQ.has(path) ? 0.3 : 0.7,
        alternates: {
          languages: {
            en: path ? `${BASE}/en/${path}` : `${BASE}/en`,
            zh: path ? `${BASE}/zh/${path}` : `${BASE}/zh`,
          },
        },
      })
    }
  }

  return entries
}

/** 分类页（大类 + 子类）双语言 */
function categoryRoutes(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const cat of CATEGORIES) {
      entries.push({
        url: `${BASE}/${locale}/tags/${cat.slug}`,
        lastModified: NOW,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE}/en/tags/${cat.slug}`,
            zh: `${BASE}/zh/tags/${cat.slug}`,
          },
        },
      })

      for (const sub of cat.subcategories) {
        entries.push({
          url: `${BASE}/${locale}/tags/${sub.slug}`,
          lastModified: NOW,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${BASE}/en/tags/${sub.slug}`,
              zh: `${BASE}/zh/tags/${sub.slug}`,
            },
          },
        })
      }
    }
  }

  return entries
}

/** 从 Supabase 拉取全量文章路由 */
async function guideRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    // Supabase REST 单次最多返回 1000 行；分页拉取全量，避免文章 >1000 时漏掉末尾页面
    type Row = { slug: string; locale: string; published_at: string | null; lastmod: string | null }
    const data: Row[] = []
    const PAGE = 1000
    for (let from = 0; ; from += PAGE) {
      const { data: page, error } = await supabase
        .from('pitfallfree_guides')
        .select('slug, locale, published_at, lastmod')
        .eq('draft', false)
        .order('published_at', { ascending: false })
        .range(from, from + PAGE - 1)
      if (error) return from === 0 ? [] : data.length ? finalize(data) : []
      if (!page || page.length === 0) break
      data.push(...(page as Row[]))
      if (page.length < PAGE) break
    }

    return finalize(data)
  } catch {
    return []
  }
}

/** 把拉取到的文章行转成 sitemap 条目（slug 分组 + 双语 alternates + lastmod 钳制） */
function finalize(
  data: { slug: string; locale: string; published_at: string | null; lastmod: string | null }[]
): MetadataRoute.Sitemap {
  const slugMap = new Map<string, { locales: string[]; lastMod: string }>()

  for (const row of data) {
    const existing = slugMap.get(row.slug)
    // 取 lastmod 日期部分；钳制到不超过今天，避免未来日期损害 Google 对 sitemap 的信任
    const raw = (row.lastmod || row.published_at || NOW).slice(0, 10)
    const mod = raw > NOW ? NOW : raw
    if (existing) {
      existing.locales.push(row.locale)
      if (mod > existing.lastMod) existing.lastMod = mod
    } else {
      slugMap.set(row.slug, { locales: [row.locale], lastMod: mod })
    }
  }

  const entries: MetadataRoute.Sitemap = []

  for (const [slug, { locales, lastMod }] of slugMap.entries()) {
    if (REDIRECTED_SLUGS.has(slug)) continue // 已合并的旧 slug 跳过
    const alternates: Record<string, string> = {}
    for (const loc of locales) {
      alternates[loc] = `${BASE}/${loc}/guides/${slug}`
    }

    for (const loc of locales) {
      entries.push({
        url: `${BASE}/${loc}/guides/${slug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: { languages: alternates },
      })
    }
  }

  return entries
}

/** taxonomy 已覆盖的标签 slug（大类 + 子类），用于排除孤儿标签去重 —— 见 @/lib/tagIndex */

/**
 * 实质性「孤儿标签」页：被文章真实使用、文章数 ≥ MIN_TAG_GUIDES、
 * 不在 taxonomy、且非通用噪音的标签。这些页面返回 200 且被文章内链引用，
 * 收录可让其被正常索引，而薄/重复/噪音标签则排除在外。
 * EN/ZH 1:1 翻译，按 zh 统计文章数即可。
 * 索引门槛与标签页 robots 同源（@/lib/tagIndex），保证两者完全一致。
 */
async function orphanTagRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data, error } = await supabase
      .from('pitfallfree_guides')
      .select('tags')
      .eq('locale', 'zh')
      .eq('draft', false)

    if (error || !data) return []

    const taxonomy = taxonomyTagSlugs()
    const counts = new Map<string, number>()
    for (const row of data) {
      for (const tag of (row.tags as string[] | null) || []) {
        if (taxonomy.has(tag) || TAG_BLOCKLIST.has(tag)) continue
        counts.set(tag, (counts.get(tag) || 0) + 1)
      }
    }

    const entries: MetadataRoute.Sitemap = []
    for (const [tag, n] of counts) {
      if (n < MIN_TAG_GUIDES) continue
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE}/${locale}/tags/${tag}`,
          lastModified: NOW,
          changeFrequency: 'weekly',
          priority: 0.5,
          alternates: {
            languages: {
              en: `${BASE}/en/tags/${tag}`,
              zh: `${BASE}/zh/tags/${tag}`,
            },
          },
        })
      }
    }
    return entries
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [guides, cats, orphanTags, statics] = await Promise.all([
    guideRoutes(),
    Promise.resolve(categoryRoutes()),
    orphanTagRoutes(),
    Promise.resolve(staticRoutes()),
  ])

  return [...statics, ...cats, ...orphanTags, ...guides]
}

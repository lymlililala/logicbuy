import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { CATEGORIES } from '@/data/categories'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 小时重新生成一次

const LOCALES = ['en', 'zh'] as const
const BASE = siteMetadata.siteUrl
const NOW = new Date().toISOString().split('T')[0]

/** 固定静态路由（双语言） */
function staticRoutes(): MetadataRoute.Sitemap {
  const paths = [
    '',          // 首页
    'guides',    // 指南列表
    'tags',      // 分类总览
    'about',     // 关于
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const path of paths) {
      const url = path ? `${BASE}/${locale}/${path}` : `${BASE}/${locale}`
      entries.push({
        url,
        lastModified: NOW,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path === 'guides' ? 0.9 : 0.7,
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
    const { data, error } = await supabase
      .from('pitfallfree_guides')
      .select('slug, locale, published_at, lastmod')
      .eq('draft', false)
      .order('published_at', { ascending: false })

    if (error || !data) return []

    // 按 slug 分组，汇总每篇文章有哪些语言版本
    const slugMap = new Map<
      string,
      { locales: string[]; lastMod: string }
    >()

    for (const row of data) {
      const existing = slugMap.get(row.slug)
      const mod = row.lastmod || row.published_at || NOW
      if (existing) {
        existing.locales.push(row.locale)
        if (mod > existing.lastMod) existing.lastMod = mod
      } else {
        slugMap.set(row.slug, { locales: [row.locale], lastMod: mod })
      }
    }

    const entries: MetadataRoute.Sitemap = []

    for (const [slug, { locales, lastMod }] of slugMap.entries()) {
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
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [guides, cats, statics] = await Promise.all([
    guideRoutes(),
    Promise.resolve(categoryRoutes()),
    Promise.resolve(staticRoutes()),
  ])

  return [...statics, ...cats, ...guides]
}

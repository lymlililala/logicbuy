import { Metadata } from 'next'
import MainLocale from './Main'
import { fetchGuideList, fetchTotalGuideCount, fetchPitfallGuides } from '@/lib/supabase'
import { CATEGORIES } from '@/data/categories'
import siteMetadata from '@/data/siteMetadata'

const SOCIAL_BANNER = `${siteMetadata.siteUrl}/static/images/twitter-card.png`

// ISR：每天最多重新生成一次，构建期 Supabase 异常也能在运行时自愈
export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}`

  return {
    title: siteMetadata.title,
    description: siteMetadata.description,
    alternates: {
      canonical,
      languages: {
        en: `${siteMetadata.siteUrl}/en`,
        zh: `${siteMetadata.siteUrl}/zh`,
        'x-default': `${siteMetadata.siteUrl}/en`,
      },
    },
    openGraph: {
      title: siteMetadata.title,
      description: siteMetadata.description,
      url: canonical,
      siteName: siteMetadata.title,
      images: [{ url: SOCIAL_BANNER, width: 1200, height: 630, alt: siteMetadata.title }],
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteMetadata.title,
      description: siteMetadata.description,
      images: [SOCIAL_BANNER],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  // 并行获取：当前语言文章列表 + 全站总数 + 踩坑专栏文章
  const [guides, totalGuides, pitfallGuides] = await Promise.all([
    fetchGuideList(locale),
    fetchTotalGuideCount(),
    fetchPitfallGuides(locale),
  ])

  // 转换为 Main 组件所需的 PostSummary 格式
  const posts = guides.map((g) => ({
    slug: g.slug,
    date: g.published_at,
    title: g.title,
    summary: g.summary,
    tags: g.tags,
    draft: g.draft,
    locale: g.locale,
  }))

  // 踩坑专栏精选（首页导流区块）
  const pitfalls = pitfallGuides.map((g) => ({
    slug: g.slug,
    date: g.published_at,
    title: g.title,
    summary: g.summary,
    tags: g.tags,
    draft: g.draft,
    locale: g.locale,
  }))

  // 统计数字：指南总数为全站总数，大类/子类数来自静态配置
  const totalCategories = CATEGORIES.length
  const totalSubcategories = CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0)

  // WebSite + Organization JSON-LD（首页独有）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteMetadata.siteUrl}/#website`,
        url: siteMetadata.siteUrl,
        name: siteMetadata.title,
        description: siteMetadata.description,
        inLanguage: isZh ? 'zh-CN' : 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteMetadata.siteUrl}/${locale}/guides?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteMetadata.siteUrl}/#organization`,
        name: 'LogicBuy',
        url: siteMetadata.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteMetadata.siteUrl}/static/images/logo.png`,
        },
        sameAs: [siteMetadata.x, siteMetadata.linkedin].filter(Boolean),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainLocale
        posts={posts}
        locale={locale}
        stats={{ totalGuides, totalCategories, totalSubcategories }}
        pitfalls={pitfalls}
      />
    </>
  )
}

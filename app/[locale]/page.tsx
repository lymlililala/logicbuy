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

  // 首页标题：以独特关键词开头、品牌名 LogicBuy 收尾，避免中英混合。
  // 用 title.absolute 跳过 layout 的 `%s | LogicBuy` 模板，防止品牌名重复。
  const title = isZh
    ? '参数选购指南：只看规格，不看品牌 | LogicBuy'
    : 'Buying Guides by Specs, Not Brands | LogicBuy'
  const description = isZh
    ? '参数驱动、无品牌偏见的消费决策知识库。我们解读规格参数，帮你按需求挑对产品——聪明决策，零废话。'
    : siteMetadata.description

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      // hreflang 用相对路径：Next 会用 metadataBase 正确解析为各语言绝对 URL。
      // 不可用同域绝对 URL —— Next15 会用当前路由 pathname 覆盖其路径，导致全部塌缩。
      languages: {
        en: `/en`,
        zh: `/zh`,
        'x-default': `/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteMetadata.title,
      images: [{ url: SOCIAL_BANNER, width: 1200, height: 630, alt: title }],
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

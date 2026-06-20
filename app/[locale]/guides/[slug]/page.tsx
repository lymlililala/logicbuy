import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  fetchGuideBySlug,
  fetchGuideList,
  checkGuideLocales,
  fetchRelatedGuides,
  fetchAllSlugs,
} from '@/lib/supabase'
import { markdownToHtml, buildFaqJsonLd } from '@/lib/markdown'
import { buildInternalLinkEntries } from '@/lib/internalLinks'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import RelatedGuides from '@/components/guide/RelatedGuides'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getCategoryForTags } from '@/data/categories'
import { MARKER_TAGS } from '@/lib/tagIndex'
import { formatDate } from 'pliny/utils/formatDate'

// ISR：静态生成 + 每天最多重新生成一次，降低 Supabase egress
export const revalidate = 86400
// 构建期未生成的 slug 在运行时按需生成，避免构建期 Supabase 异常导致整站 500
export const dynamicParams = true

export async function generateStaticParams() {
  // 取所有语言的文章，合并去重 slug，确保每个 slug × locale 都生成静态页
  const [zhGuides, enGuides] = await Promise.all([fetchGuideList('zh'), fetchGuideList('en')])
  const allSlugs = [...new Set([...zhGuides.map((g) => g.slug), ...enGuides.map((g) => g.slug)])]
  const locales = ['en', 'zh']
  return locales.flatMap((locale) => allSlugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await props.params
  const guide = await fetchGuideBySlug(slug, locale)

  if (!guide) {
    return { title: 'Not Found' }
  }

  const canonical = `${siteMetadata.siteUrl}/${locale}/guides/${slug}`
  const alternates: Record<string, string> = {
    en: `${siteMetadata.siteUrl}/en/guides/${slug}`,
    zh: `${siteMetadata.siteUrl}/zh/guides/${slug}`,
  }

  return {
    title: guide.title,
    description: guide.summary,
    alternates: {
      canonical,
      languages: {
        ...alternates,
        'x-default': `${siteMetadata.siteUrl}/en/guides/${slug}`,
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      url: canonical,
      siteName: siteMetadata.title,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: guide.published_at,
      modifiedTime: guide.lastmod || guide.published_at,
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.summary,
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
  }
}

export default async function GuidePage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  const guide = await fetchGuideBySlug(slug, locale)

  if (!guide) return notFound()

  // 是否为「踩坑指南」专栏文章（带 pitfall-guide 标记 tag）
  const isPitfall = (guide.tags || []).includes('pitfall-guide')
  // 可见标签：隐藏专栏标记 tag（仅用于聚合与互链，不展示给用户）
  const visibleTags = (guide.tags || []).filter((t) => !MARKER_TAGS.has(t))

  // 主文章已就绪后，三个辅助查询彼此独立 —— 并行发起，缩短 ISR 渲染期函数执行时间，
  // 降低 Supabase 多次串行往返叠加导致的函数超时 / 5xx 风险。
  const [allSlugs, availableLocales, relatedGuides] = await Promise.all([
    fetchAllSlugs(guide.locale),
    checkGuideLocales(slug),
    fetchRelatedGuides(slug, guide.tags || [], guide.locale),
  ])

  // 正文内联内链：用全量 slug 构建产品词→guide 映射，渲染时注入站内链接
  const internalLinks = buildInternalLinkEntries(allSlugs, slug)

  // 渲染 Markdown → HTML（含正文内联内链）。渲染异常不应整页 500：
  // 降级为未注入内链的安全 HTML（转义后包裹 <pre>），保证返回 200 而非服务器错误。
  let contentHtml: string
  try {
    contentHtml = await markdownToHtml(guide.content, { internalLinks, locale })
  } catch {
    const escaped = guide.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    contentHtml = `<pre>${escaped}</pre>`
  }

  // 检查是否有其他语言版本（用于语言切换提示）
  const isFallback = guide.locale !== locale
  const otherLocale = locale === 'zh' ? 'en' : 'zh'
  const hasOtherLocale = availableLocales.includes(otherLocale)

  // 面包屑：首页 › 分类 › 当前文章（分类由 tags 推断）
  const category = getCategoryForTags(guide.tags)
  const crumbs = [
    { label: locale === 'zh' ? '首页' : 'Home', href: `/${locale}` },
    { label: locale === 'zh' ? '全部指南' : 'Guides', href: `/${locale}/guides` },
    ...(category
      ? [
          {
            label: locale === 'zh' ? category.labelZh : category.labelEn,
            href: `/${locale}/tags/${category.slug}`,
          },
        ]
      : []),
    { label: guide.title },
  ]

  // JSON-LD 结构化数据
  const guideUrl = `${siteMetadata.siteUrl}/${locale}/guides/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.published_at,
    dateModified: guide.lastmod || guide.published_at,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    url: guideUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': guideUrl },
    image: `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`,
    author: {
      '@type': 'Organization',
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
  }

  // BreadcrumbList 结构化数据（与可见面包屑一致，可获得面包屑富媒体结果）
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${siteMetadata.siteUrl}${c.href}` } : {}),
    })),
  }

  // FAQPage 结构化数据（从正文 ## FAQ / ## 常见问题 段解析，命中才输出，争取精选摘要 / PAA）
  const faqJsonLd = buildFaqJsonLd(
    guide.content,
    locale,
    `${siteMetadata.siteUrl}/${locale}/guides/${slug}`
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          {/* ── Breadcrumbs ── */}
          <Breadcrumbs items={crumbs} />

          {/* ── Header ── */}
          <header className="pt-6 xl:pb-6">
            <div className="space-y-4 text-center">
              {/* 踩坑专栏徽标 */}
              {isPitfall && (
                <div className="flex justify-center">
                  <Link
                    href={`/${locale}/pitfalls`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-500/20 transition hover:bg-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300"
                  >
                    ⚠️ {locale === 'zh' ? '踩坑指南专栏' : 'Pitfall Guides'}
                  </Link>
                </div>
              )}
              {/* Tags */}
              {visibleTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {visibleTags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
              {/* Title */}
              <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
                {guide.title}
              </h1>
              {/* Meta */}
              <dl className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd>
                    <time dateTime={guide.published_at}>
                      {formatDate(guide.published_at, siteMetadata.locale)}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          </header>

          {/* ── Fallback notice ── */}
          {isFallback && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              {guide.locale === 'zh'
                ? '⚠️ English version not available yet. Showing Chinese content.'
                : '⚠️ 暂无中文版本，显示英文内容。'}
            </div>
          )}

          {/* ── Language switcher ── */}
          {hasOtherLocale && (
            <div className="py-3 text-right text-sm">
              <Link
                href={`/${otherLocale}/guides/${slug}`}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {otherLocale === 'zh' ? '切换到中文 →' : 'Switch to English →'}
              </Link>
            </div>
          )}

          {/* ── Content ── */}
          <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
            <div
              className="prose dark:prose-invert max-w-none pt-10 pb-8"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* ── Related guides (internal linking) ── */}
          <RelatedGuides guides={relatedGuides} locale={locale} />

          {/* ── Footer ── */}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${locale}/guides`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to guides"
                >
                  ← {locale === 'zh' ? '返回全部指南' : 'Back to all guides'}
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  )
}

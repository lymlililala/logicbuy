import { genPageMetadata } from '@/app/seo'
import { fetchGuidesByTag, fetchTagCounts } from '@/lib/supabase'
import {
  CATEGORIES,
  getCategoryBySlug,
  getCategoryBySubSlug,
  getSubcategoryLabel,
} from '@/data/categories'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import type { Metadata } from 'next'

// ISR：静态生成 + 每天最多重新生成一次，降低 Supabase egress
export const revalidate = 86400
// 构建期未生成的 tag 在运行时按需生成，避免构建期 Supabase 异常导致整站 500
export const dynamicParams = true

export async function generateStaticParams() {
  const locales = ['en', 'zh']
  const allTagSlugs = new Set<string>()

  // 收集所有大类 + 子类 slug
  for (const cat of CATEGORIES) {
    allTagSlugs.add(cat.slug)
    for (const sub of cat.subcategories) {
      allTagSlugs.add(sub.slug)
    }
  }

  return locales.flatMap((locale) =>
    [...allTagSlugs].map((tag) => ({ locale, tag: encodeURI(tag) }))
  )
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; tag: string }>
}): Promise<Metadata> {
  const { locale, tag } = await props.params
  const decodedTag = decodeURI(tag)
  const isZh = locale === 'zh'

  const cat = getCategoryBySlug(decodedTag)
  const parentCat = getCategoryBySubSlug(decodedTag)
  const label = cat ? (isZh ? cat.labelZh : cat.labelEn) : getSubcategoryLabel(decodedTag, locale)
  const parentLabel = parentCat ? (isZh ? parentCat.labelZh : parentCat.labelEn) : ''

  const title = parentLabel ? `${parentLabel} · ${label}` : label

  const canonical = `${siteMetadata.siteUrl}/${locale}/tags/${decodedTag}`
  return genPageMetadata({
    title,
    description: `${siteMetadata.title} — ${title}`,
    alternates: {
      canonical,
      languages: {
        en: `${siteMetadata.siteUrl}/en/tags/${decodedTag}`,
        zh: `${siteMetadata.siteUrl}/zh/tags/${decodedTag}`,
        'x-default': `${siteMetadata.siteUrl}/en/tags/${decodedTag}`,
      },
    },
  })
}

export default async function TagPage(props: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag } = await props.params
  const decodedTag = decodeURI(tag)
  const isZh = locale === 'zh'

  // 判断是大类还是子类
  const mainCat = getCategoryBySlug(decodedTag)
  const parentCat = getCategoryBySubSlug(decodedTag) // 子类时返回父类
  const isMainCategory = !!mainCat
  const activeCat = mainCat || parentCat

  // 从数据库获取当前分类文章
  const guides = await fetchGuidesByTag(decodedTag, locale)

  // 如果是大类，同时获取各子类的文章数（用于子分类过滤器）
  // 同时取 zh 数量，用于标记"仅有中文内容"的子分类
  const [tagCounts, tagCountsZh] = isMainCategory
    ? await Promise.all([
        fetchTagCounts(locale),
        locale !== 'zh' ? fetchTagCounts('zh') : Promise.resolve({}),
      ])
    : [{}, {}]

  const catLabel = activeCat ? (isZh ? activeCat.labelZh : activeCat.labelEn) : decodedTag
  const subLabel = !isMainCategory ? getSubcategoryLabel(decodedTag, locale) : ''
  const pageTitle = subLabel ? `${catLabel} · ${subLabel}` : catLabel

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const pageUrl = `${siteMetadata.siteUrl}/${locale}/tags/${decodedTag}`

  // BreadcrumbList
  const breadcrumbItems: { '@type': string; position: number; name: string; item: string }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: isZh ? '首页' : 'Home',
      item: `${siteMetadata.siteUrl}/${locale}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: isZh ? '全部品类' : 'All Categories',
      item: `${siteMetadata.siteUrl}/${locale}/tags`,
    },
  ]
  if (!isMainCategory && activeCat) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: isZh ? activeCat.labelZh : activeCat.labelEn,
      item: `${siteMetadata.siteUrl}/${locale}/tags/${activeCat.slug}`,
    })
    breadcrumbItems.push({ '@type': 'ListItem', position: 4, name: pageTitle, item: pageUrl })
  } else {
    breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: pageTitle, item: pageUrl })
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  // ItemList（文章列表）
  const itemListLd =
    guides.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: pageTitle,
          url: pageUrl,
          numberOfItems: guides.length,
          itemListElement: guides.slice(0, 20).map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteMetadata.siteUrl}/${locale}/guides/${g.slug}`,
            name: g.title,
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Header */}
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href={`/${locale}/tags`} className="hover:text-primary-500 transition">
              {isZh ? '全部品类' : 'All Categories'}
            </Link>
            {!isMainCategory && activeCat && (
              <>
                <span>›</span>
                <Link
                  href={`/${locale}/tags/${activeCat.slug}`}
                  className="hover:text-primary-500 transition"
                >
                  {isZh ? activeCat.labelZh : activeCat.labelEn}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-gray-700 dark:text-gray-300">{subLabel || catLabel}</span>
          </nav>

          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
            {activeCat && <span className="mr-2">{activeCat.icon}</span>}
            {pageTitle}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {guides.length} {isZh ? '篇指南' : 'guides'}
            {isZh ? '，纯参数说话' : ' · facts & specs only'}
          </p>
        </div>

        {/* 子分类过滤器（仅大类页显示） */}
        {isMainCategory && mainCat && mainCat.subcategories.length > 0 && (
          <div className="py-6">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${locale}/tags/${decodedTag}`}
                className="bg-primary-500 inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
              >
                {isZh ? '全部' : 'All'}
                <span className="ml-1 opacity-80">{guides.length}</span>
              </Link>
              {mainCat.subcategories.map((sub) => {
                const subCount = tagCounts[sub.slug] || 0
                const zhCount = (tagCountsZh as Record<string, number>)[sub.slug] || 0
                // 当前语言无文章但中文有：标注 ZH
                const zhOnly = !isZh && subCount === 0 && zhCount > 0
                return (
                  <Link
                    key={sub.slug}
                    href={`/${locale}/tags/${sub.slug}`}
                    className="hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {isZh ? sub.labelZh : sub.labelEn}
                    {subCount > 0 && <span className="text-xs text-gray-400">{subCount}</span>}
                    {zhOnly && (
                      <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                        ZH
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* 子分类页的返回按钮 */}
        {!isMainCategory && activeCat && (
          <div className="py-4">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${locale}/tags/${activeCat.slug}`}
                className="hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                ← {isZh ? `查看所有 ${activeCat.labelZh}` : `All ${activeCat.labelEn}`}
              </Link>
              {activeCat.subcategories.map((sub) => {
                const isActive = sub.slug === decodedTag
                return (
                  <Link
                    key={sub.slug}
                    href={`/${locale}/tags/${sub.slug}`}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {isZh ? sub.labelZh : sub.labelEn}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* 文章列表 */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {guides.map((guide) => {
            const { slug, title, summary, tags, published_at, locale: gLocale } = guide
            const isFallback = gLocale !== locale
            const mainTag = tags?.[0]
            const subTag = tags?.[1]

            return (
              <li key={slug} className="py-10">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={published_at}>
                        {formatDate(published_at, siteMetadata.locale)}
                      </time>
                      {isFallback && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          {isZh ? '仅中文' : 'ZH only'}
                        </span>
                      )}
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h2 className="text-xl leading-8 font-bold tracking-tight">
                        <Link
                          href={`/${locale}/guides/${slug}`}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {mainTag && <Tag text={mainTag} />}
                        {subTag && subTag !== mainTag && <Tag text={subTag} />}
                      </div>
                    </div>
                    <p className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</p>
                    <Link
                      href={`/${locale}/guides/${slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
                    >
                      {isZh ? '查看指南 →' : 'Read guide →'}
                    </Link>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        {guides.length === 0 && (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">{isZh ? '暂无相关指南' : 'No guides in this category yet.'}</p>
            <Link
              href={`/${locale}/tags`}
              className="text-primary-500 mt-4 inline-block text-sm hover:underline"
            >
              {isZh ? '← 返回全部分类' : '← Back to all categories'}
            </Link>
          </div>
        )}

        {/* ── Related categories (cross-linking sibling subcategories) ── */}
        {activeCat && activeCat.subcategories.filter((s) => s.slug !== decodedTag).length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {isZh ? '相关品类' : 'Related Categories'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {activeCat.subcategories
                .filter((s) => s.slug !== decodedTag)
                .map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/${locale}/tags/${sub.slug}`}
                    className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
                  >
                    {isZh ? sub.labelZh : sub.labelEn}
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

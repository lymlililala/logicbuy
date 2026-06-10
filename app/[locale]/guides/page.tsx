import { genPageMetadata } from '@/app/seo'
import { fetchGuideListPaged } from '@/lib/supabase'
import { getTranslations } from 'next-intl/server'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

const PER_PAGE = 10

// ISR：每天最多重新生成一次，构建期 Supabase 异常也能在运行时自愈
export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const canonical = `${siteMetadata.siteUrl}/${locale}/guides`
  return genPageMetadata({
    title: t('guides'),
    alternates: {
      canonical,
      languages: {
        en: `${siteMetadata.siteUrl}/en/guides`,
        zh: `${siteMetadata.siteUrl}/zh/guides`,
        'x-default': `${siteMetadata.siteUrl}/en/guides`,
      },
    },
  })
}

export default async function GuidesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const { page: pageParam } = await searchParams
  const isZh = locale === 'zh'

  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const { guides, total } = await fetchGuideListPaged(locale, currentPage, PER_PAGE)
  const totalPages = Math.ceil(total / PER_PAGE)

  const title = isZh ? '全部避坑指南' : 'All Guides'
  const subtitle = isZh
    ? `共 ${total} 篇，纯参数说话，不提品牌`
    : `${total} guides · facts & specs, no brand bias`

  /** 生成分页链接 */
  const pageHref = (p: number) => `/${locale}/guides?page=${p}`

  /** 生成显示的页码序列（当前页前后各 2 页，加首尾） */
  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 4) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 3) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isZh ? '首页' : 'Home',
        item: `${siteMetadata.siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isZh ? '全部指南' : 'All Guides',
        item: `${siteMetadata.siteUrl}/${locale}/guides`,
      },
    ],
  }

  const itemListLd =
    guides.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: isZh ? '全部指南' : 'All Guides',
          url: `${siteMetadata.siteUrl}/${locale}/guides`,
          numberOfItems: total,
          itemListElement: guides.map((g, i) => ({
            '@type': 'ListItem',
            position: (currentPage - 1) * PER_PAGE + i + 1,
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
        {/* 标题区 */}
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* 文章列表 */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {guides.map((guide) => {
            const { slug, title: gTitle, summary, tags, published_at, locale: gLocale } = guide
            const isFallback = gLocale !== locale
            const visibleTags = (tags || []).filter((t) => t !== 'pitfall-guide')

            return (
              <li key={`${slug}-${gLocale}`} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
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

                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/${locale}/guides/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {gTitle}
                            </Link>
                          </h2>
                          {visibleTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {visibleTags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>

                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/${locale}/guides/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${gTitle}"`}
                        >
                          {isZh ? '查看完整指南 →' : 'Read guide →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        {guides.length === 0 && (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">
            <p className="text-xl">
              {isZh ? '暂无指南，请稍后查看。' : 'No guides yet. Check back soon.'}
            </p>
          </div>
        )}
      </div>

      {/* 分页器 */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-1.5 pb-8"
        >
          {/* 上一页 */}
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-600 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              aria-label={isZh ? '上一页' : 'Previous page'}
            >
              ‹
            </Link>
          ) : (
            <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-gray-100 text-sm text-gray-300 dark:border-gray-800 dark:text-gray-600">
              ‹
            </span>
          )}

          {/* 页码 */}
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <Link
                key={p}
                href={pageHref(p)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === currentPage
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400'
                }`}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </Link>
            )
          )}

          {/* 下一页 */}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-600 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
              aria-label={isZh ? '下一页' : 'Next page'}
            >
              ›
            </Link>
          ) : (
            <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-gray-100 text-sm text-gray-300 dark:border-gray-800 dark:text-gray-600">
              ›
            </span>
          )}
        </nav>
      )}

      {/* 当前页信息 */}
      {totalPages > 1 && (
        <p className="pb-4 text-center text-xs text-gray-400 dark:text-gray-600">
          {isZh
            ? `第 ${currentPage} / ${totalPages} 页，共 ${total} 篇`
            : `Page ${currentPage} of ${totalPages} · ${total} guides total`}
        </p>
      )}
    </>
  )
}

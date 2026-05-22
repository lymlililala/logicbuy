import { genPageMetadata } from '@/app/seo'
import { fetchGuideList } from '@/lib/supabase'
import { getTranslations } from 'next-intl/server'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return genPageMetadata({ title: t('guides') })
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const guides = await fetchGuideList(locale)

  const title = locale === 'zh' ? '全部避坑指南' : 'All Guides'
  const subtitle =
    locale === 'zh'
      ? `共 ${guides.length} 篇，纯参数说话，不提品牌`
      : `${guides.length} guides · facts & specs, no brand bias`

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {guides.map((guide) => {
            const { slug, title: gTitle, summary, tags, published_at, locale: gLocale } = guide
            const isFallback = gLocale !== locale

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
                            {locale === 'zh' ? '仅中文' : 'ZH only'}
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
                          {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {tags.map((tag) => (
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
                          {locale === 'zh' ? '查看完整指南 →' : 'Read guide →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {guides.length === 0 && (
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          <p className="text-xl">
            {locale === 'zh' ? '暂无指南，请稍后查看。' : 'No guides yet. Check back soon.'}
          </p>
        </div>
      )}
    </>
  )
}

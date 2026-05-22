import Link from '@/components/Link'
import { genPageMetadata } from '@/app/seo'
import { CATEGORIES } from '@/data/categories'
import { fetchTagCounts } from '@/lib/supabase'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const title = locale === 'zh' ? '全部分类' : 'All Categories'
  return genPageMetadata({ title })
}

export default async function TagsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  // 从数据库获取每个 tag 的文章数量
  const tagCounts = await fetchTagCounts(locale === 'en' ? 'zh' : locale)

  const title = isZh ? '全部品类' : 'All Categories'
  const subtitle = isZh
    ? '8 大核心品类 · 75+ 细分方向 · 纯参数说话'
    : '8 core categories · 75+ subcategories · facts & specs only'

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Header */}
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>

      {/* 8 大类 Grid */}
      <div className="py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const catLabel = isZh ? cat.labelZh : cat.labelEn
            const catDesc = isZh ? cat.descZh : cat.descEn
            // 大类文章总数（tags 数组第一位就是大类 slug）
            const catCount = tagCounts[cat.slug] || 0

            return (
              <div
                key={cat.slug}
                className={`rounded-2xl border bg-gradient-to-br p-6 ${cat.color} ${cat.border}`}
              >
                {/* 大类标题 */}
                <Link href={`/${locale}/tags/${cat.slug}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${cat.iconBg}`}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="hover:text-primary-600 dark:hover:text-primary-400 text-lg font-bold text-gray-900 transition dark:text-gray-100">
                        {catLabel}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{catDesc}</p>
                    </div>
                    {catCount > 0 && (
                      <span className="ml-auto rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                        {catCount} {isZh ? '篇' : 'guides'}
                      </span>
                    )}
                  </div>
                </Link>

                {/* 子分类列表 */}
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub) => {
                    const subLabel = isZh ? sub.labelZh : sub.labelEn
                    const subCount = tagCounts[sub.slug] || 0
                    return (
                      <Link
                        key={sub.slug}
                        href={`/${locale}/tags/${sub.slug}`}
                        className="hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 transition dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
                      >
                        {subLabel}
                        {subCount > 0 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {subCount}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

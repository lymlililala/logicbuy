import Link from '@/components/Link'
import type { Guide } from '@/lib/supabase'

interface RelatedGuidesProps {
  guides: Guide[]
  locale: string
}

/**
 * 详情页底部「相关指南」内链区块。
 * 通过共享标签把单篇文章连进同主题集群，消除孤立详情页、分发链接权重。
 */
export default function RelatedGuides({ guides, locale }: RelatedGuidesProps) {
  if (!guides || guides.length === 0) return null
  const isZh = locale === 'zh'

  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
      <h2 className="mb-5 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {isZh ? '相关指南' : 'Related Guides'}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${locale}/guides/${g.slug}`}
            className="group rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-gray-900"
          >
            <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {g.title}
            </h3>
            {g.summary && (
              <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {g.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

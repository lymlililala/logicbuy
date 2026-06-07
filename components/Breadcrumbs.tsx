import Link from '@/components/Link'

interface Crumb {
  label: string
  href?: string
}

/** 可见面包屑导航，强化向上内链（首页 › 分类 › 当前页）。 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            ) : (
              <span className="line-clamp-1 text-gray-700 dark:text-gray-300">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-gray-300 dark:text-gray-600">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

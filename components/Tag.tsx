'use client'

import Link from 'next/link'
import { slug } from 'github-slugger'
import { usePathname } from 'next/navigation'

interface Props {
  text: string
}

/** kebab-case 或 空格分隔 → Title Case 可读标签 */
function toReadableLabel(text: string): string {
  return text
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const Tag = ({ text }: Props) => {
  const pathname = usePathname()
  // Extract locale from pathname (e.g. /en/... or /zh/...)
  const localeMatch = pathname?.match(/^\/(en|zh)\//)
  const locale = localeMatch ? localeMatch[1] : 'en'

  return (
    <Link
      href={`/${locale}/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-2 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium ring-1 ring-gray-200 transition hover:bg-gray-100 dark:bg-gray-800/60 dark:ring-gray-700 dark:hover:bg-gray-800"
    >
      {toReadableLabel(text)}
    </Link>
  )
}

export default Tag

'use client'

import { usePathname } from 'next/navigation'
import Link from '@/components/Link'

// Next.js 渲染该组件时回传 HTTP 404。
// 用 usePathname 取首段 locale（not-found 拿不到 params），文案按语言切换。
export default function NotFound() {
  const pathname = usePathname()
  const isZh = pathname?.split('/')[1] === 'zh'
  const locale = isZh ? 'zh' : 'en'

  const t = isZh
    ? {
        heading: '页面未找到',
        desc: '抱歉，没有找到你要访问的页面，它可能已被移动或删除。',
        home: '返回首页',
        guides: '浏览全部指南',
      }
    : {
        heading: 'Page not found',
        desc: "Sorry, we couldn't find the page you were looking for. It may have been moved or deleted.",
        home: 'Back to homepage',
        guides: 'Browse all guides',
      }

  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-6xl leading-9 font-extrabold tracking-tight text-gray-900 md:border-r-2 md:px-6 md:text-8xl md:leading-14 dark:text-gray-100">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <h2 className="mb-2 text-xl leading-normal font-bold md:text-2xl">{t.heading}</h2>
        <p className="mb-8 text-gray-500 dark:text-gray-400">{t.desc}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}`}
            className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm leading-5 font-medium text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus:outline-hidden dark:hover:bg-blue-500"
          >
            {t.home}
          </Link>
          <Link
            href={`/${locale}/guides`}
            className="inline rounded-lg border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {t.guides}
          </Link>
        </div>
      </div>
    </div>
  )
}

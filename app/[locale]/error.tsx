'use client'

import { usePathname } from 'next/navigation'
import Link from '@/components/Link'

// 段级错误边界：页面渲染（如 Supabase 查询）意外抛错时，给用户友好的双语兜底页，
// 而不是白屏。reset() 可原地重试渲染。
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname()
  const isZh = pathname?.split('/')[1] === 'zh'
  const locale = isZh ? 'zh' : 'en'

  const t = isZh
    ? {
        heading: '出错了',
        desc: '页面加载时发生了意外错误。可以重试，或返回首页。',
        retry: '重试',
        home: '返回首页',
      }
    : {
        heading: 'Something went wrong',
        desc: 'An unexpected error occurred while loading this page. You can try again or go back home.',
        retry: 'Try again',
        home: 'Back to homepage',
      }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
        {t.heading}
      </h1>
      <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400">{t.desc}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          {t.retry}
        </button>
        <Link
          href={`/${locale}`}
          className="inline rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {t.home}
        </Link>
      </div>
    </div>
  )
}

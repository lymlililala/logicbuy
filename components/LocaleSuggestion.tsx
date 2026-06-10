'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * 语言建议条 —— 补齐自动语言检测的「深链直达」缺口。
 *
 * 中间件（i18n/routing.ts）只在 URL 缺少 /en、/zh 前缀时才按 Accept-Language 重定向。
 * 当用户从搜索引擎直接点进 /en/某文章（URL 已带前缀），中间件不会介入，
 * 偏好中文的用户便会停留在英文页。此组件检测到这种语言不匹配时，给出
 * 一个「可关闭」的切换建议，而非强制跳转 —— 后者会破坏 Google 对 /en 的收录。
 */

// 提示条必须用「目标语言」呈现，让偏好该语言的用户看得懂；
// 而 next-intl Provider 只加载当前页面语言，故此处内置目标语言文案。
const SUGGEST_TEXT = {
  zh: {
    message: '检测到您的浏览器偏好中文，是否切换到中文版？',
    confirm: '切换到中文',
    dismiss: '不用了',
  },
  en: {
    message: 'Your browser prefers English. Switch to the English version?',
    confirm: 'Switch to English',
    dismiss: 'No thanks',
  },
} as const

type Locale = keyof typeof SUGGEST_TEXT

const DISMISS_COOKIE = 'locale_suggest_dismissed'

function getCookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

function detectPreferredLocale(): Locale {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const lang of langs) {
    const lower = lang.toLowerCase()
    if (lower.startsWith('zh')) return 'zh'
    if (lower.startsWith('en')) return 'en'
  }
  return 'en'
}

export default function LocaleSuggestion({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const [target, setTarget] = useState<Locale | null>(null)

  useEffect(() => {
    // 用户已显式选过语言（手动切换写过 NEXT_LOCALE）或关闭过提示 → 不打扰
    if (getCookie('NEXT_LOCALE') || getCookie(DISMISS_COOKIE)) return

    const preferred = detectPreferredLocale()
    if (preferred !== currentLocale) {
      setTarget(preferred)
    }
  }, [currentLocale])

  if (!target) return null

  const text = SUGGEST_TEXT[target]

  const handleConfirm = () => {
    // 记住选择，下次请求中间件据此放行；与 LanguageSwitcher 行为一致
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    const newPath = pathname.replace(/^\/(en|zh)(\/|$)/, `/${target}$2`)
    router.push(newPath)
  }

  const handleDismiss = () => {
    // 30 天内不再提示
    document.cookie = `${DISMISS_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
    setTarget(null)
  }

  return (
    <div className="border-primary-200 bg-primary-50 dark:border-primary-900/50 dark:bg-primary-950/30 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-b px-4 py-2.5 text-sm">
      <span className="text-gray-700 dark:text-gray-200">🌐 {text.message}</span>
      <span className="flex items-center gap-2">
        <button
          onClick={handleConfirm}
          className="bg-primary-600 hover:bg-primary-700 rounded-md px-3 py-1 font-medium text-white transition"
        >
          {text.confirm}
        </button>
        <button
          onClick={handleDismiss}
          className="rounded-md px-2 py-1 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {text.dismiss}
        </button>
      </span>
    </div>
  )
}

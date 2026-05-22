'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface LanguageSwitcherProps {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('lang_switch')

  const targetLocale = currentLocale === 'en' ? 'zh' : 'en'

  const handleSwitch = () => {
    // 将当前 URL 路径中的 /en/ 或 /zh/ 替换为目标 locale
    // 路径格式: /en/blog/xxx → /zh/blog/xxx
    const newPath = pathname.replace(new RegExp(`^/(en|zh)(/|$)`), `/${targetLocale}$2`)
    router.push(newPath)
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={`Switch to ${t('switch_to')}`}
      className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      title={`Switch to ${targetLocale === 'en' ? 'English' : '中文'}`}
    >
      <span className="text-base leading-none">🌐</span>
      <span>{t('switch_to')}</span>
    </button>
  )
}

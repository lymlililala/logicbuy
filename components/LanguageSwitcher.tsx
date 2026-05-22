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
    // 写入 NEXT_LOCALE Cookie，next-intl middleware 会在下次请求时读取它
    // 有效期 1 年，SameSite=Lax 兼容主流浏览器
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

    // 替换 URL 中的 locale 前缀
    const newPath = pathname.replace(/^\/(en|zh)(\/|$)/, `/${targetLocale}$2`)
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

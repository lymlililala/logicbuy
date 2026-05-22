'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import LanguageSwitcher from './LanguageSwitcher'
import MegaMenu from './MegaMenu'

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const isZh = locale === 'zh'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/guides?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const headerClass = [
    'flex items-center w-full justify-between gap-3 py-3 px-0',
    'border-b border-gray-200/80 dark:border-gray-800',
    'bg-white/95 dark:bg-gray-950/95',
    siteMetadata.stickyNav ? 'sticky top-0 z-50 backdrop-blur-md' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const plainLinks = [
    { href: `/${locale}/guides`, title: isZh ? '指南' : 'Guides' },
    { href: `/${locale}/about`, title: isZh ? '关于' : 'About' },
  ]

  return (
    <header className={headerClass}>
      {/* ── Logo ── */}
      <Link href={`/${locale}`} aria-label={siteMetadata.headerTitle} className="shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo mark — 极客蓝 */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white shadow-sm">
            L
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              LogicBuy
            </span>
            <span className="hidden text-[9px] font-medium tracking-wide text-gray-400 sm:block dark:text-gray-600">
              {isZh ? 'BUY BY SPECS' : 'BUY BY SPECS'}
            </span>
          </div>
        </div>
      </Link>

      {/* ── 全局常驻搜索框（居中，最核心的交互入口） ── */}
      <form
        onSubmit={handleSearch}
        className="hidden flex-1 sm:flex"
        style={{ maxWidth: 480, minWidth: 200 }}
      >
        <div className="relative w-full">
          {/* 搜索图标 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isZh
                ? '搜索参数关键词，如"OLED 面板"、"RO 净水"...'
                : 'Search specs: "OLED panel", "RO filter"...'
            }
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pr-20 pl-9 text-sm text-gray-800 transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-blue-500 dark:focus:bg-gray-800"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            {isZh ? '搜索' : 'Search'}
          </button>
        </div>
      </form>

      {/* ── 右侧导航 ── */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* 桌面端导航链接 */}
        <div className="no-scrollbar hidden items-center sm:flex">
          {plainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              {link.title}
            </Link>
          ))}
          <MegaMenu locale={locale} label={isZh ? '分类' : 'Categories'} />
        </div>

        {/* 移动端搜索图标 */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 sm:hidden dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={() => router.push(`/${locale}/guides`)}
          aria-label="Search"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <LanguageSwitcher currentLocale={locale} />
        <ThemeSwitch />
        <MobileNav locale={locale} />
      </div>
    </header>
  )
}

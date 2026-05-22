'use client'

import { useState, useRef, useEffect } from 'react'
import Link from './Link'
import { CATEGORIES } from '@/data/categories'

interface MegaMenuProps {
  locale: string
  label: string
}

export default function MegaMenu({ locale, label }: MegaMenuProps) {
  const [open, setOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState(CATEGORIES[0].slug)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isZh = locale === 'zh'
  const activeCategory = CATEGORIES.find((c) => c.slug === activeSlug) ?? CATEGORIES[0]

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 触发按钮 */}
      <button
        className={`flex items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
          open
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg
          className={`ml-0.5 h-3 w-3 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mega Menu 面板 */}
      {open && (
        <div className="absolute top-full left-1/2 z-50 mt-2 w-[620px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex">
            {/* 左栏：大类列表 */}
            <div className="w-48 shrink-0 border-r border-gray-100 bg-gray-50/80 py-2 dark:border-gray-800 dark:bg-gray-950">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  onClick={() => setActiveSlug(cat.slug)}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition ${
                    cat.slug === activeSlug
                      ? 'bg-white font-semibold text-blue-700 shadow-sm dark:bg-gray-800 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-100'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="leading-tight">{isZh ? cat.labelZh : cat.labelEn}</span>
                  {cat.slug === activeSlug && (
                    <svg
                      className="ml-auto h-3 w-3 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* 右栏：子类 + 描述 */}
            <div className="flex flex-1 flex-col p-4">
              {/* 大类标题栏 */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${activeCategory.iconBg}`}
                  >
                    {activeCategory.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 dark:text-white">
                      {isZh ? activeCategory.labelZh : activeCategory.labelEn}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      {isZh ? activeCategory.descZh : activeCategory.descEn}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/tags/${activeCategory.slug}`}
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-lg border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                >
                  {isZh ? '查看全部 →' : 'View all →'}
                </Link>
              </div>

              {/* 子类网格 */}
              <div className="grid grid-cols-2 gap-1">
                {activeCategory.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/${locale}/tags/${sub.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 rounded-lg p-2 text-[12px] text-gray-600 transition hover:bg-blue-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 dark:bg-blue-600" />
                    {isZh ? sub.labelZh : sub.labelEn}
                  </Link>
                ))}
              </div>

              {/* 底部 */}
              <div className="mt-4 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                <Link
                  href={`/${locale}/tags`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 transition hover:text-blue-600 dark:text-gray-600 dark:hover:text-blue-400"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  {isZh ? '浏览全部 8 大品类' : 'Browse all 8 categories'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

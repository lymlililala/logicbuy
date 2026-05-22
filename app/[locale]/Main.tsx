'use client'

import Link from '@/components/Link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CATEGORIES } from '@/data/categories'

const MAX_DISPLAY = 6
const HOME_CATEGORIES = CATEGORIES.slice(0, 8)

type PostSummary = {
  slug: string
  date: string
  title: string
  summary?: string | null
  tags?: string[]
  draft?: boolean | null
  locale?: string
}

// 所有大类 + 子类 slug
const ALL_CAT_SLUGS = new Set(
  CATEGORIES.flatMap((c) => [c.slug, ...c.subcategories.map((s) => s.slug)])
)

function extractSpecTags(tags: string[]): string[] {
  return tags.filter((t) => !ALL_CAT_SLUGS.has(t)).slice(0, 4)
}

function toLabel(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatLocalDate(dateStr: string, locale: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    if (locale === 'zh') {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/** 根据文章标签推断 Badge 状态 */
function getBadge(tags: string[]): { label: string; labelZh: string; color: string } | null {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()))
  if (
    tagSet.has('recommended') ||
    tagSet.has('推荐') ||
    tagSet.has('top-pick') ||
    tagSet.has('best-value')
  ) {
    return { label: 'Recommended', labelZh: '✓ 推荐', color: 'bg-emerald-500 text-white' }
  }
  if (
    tagSet.has('overpriced') ||
    tagSet.has('high-premium') ||
    tagSet.has('溢价') ||
    tagSet.has('高溢价')
  ) {
    return { label: '⚠ High Premium', labelZh: '⚠ 高溢价', color: 'bg-amber-500 text-white' }
  }
  if (
    tagSet.has('pitfall') ||
    tagSet.has('trap') ||
    tagSet.has('avoid') ||
    tagSet.has('陷阱') ||
    tagSet.has('智商税')
  ) {
    return { label: '⚠ Watch Out', labelZh: '⚠ 注意陷阱', color: 'bg-red-500 text-white' }
  }
  return null
}

/** 骨架屏卡片 */
function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="skeleton h-1 w-full rounded-t-2xl" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-full rounded-md" />
        <div className="skeleton h-4 w-3/4 rounded-md" />
        <div className="flex gap-1.5">
          <div className="skeleton h-5 w-16 rounded-md" />
          <div className="skeleton h-5 w-20 rounded-md" />
          <div className="skeleton h-5 w-14 rounded-md" />
        </div>
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="mt-auto flex justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

export default function MainLocale({ posts, locale }: { posts: PostSummary[]; locale: string }) {
  const t = useTranslations('home')
  const isZh = locale === 'zh'
  const [loaded] = useState(true)

  return (
    <>
      {/* ══════════════════════════════════════════════
          Hero Section — 左右分栏 布局
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        {/* 网格背景纹理 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-gray-900) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-900) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          {/* 左侧：Slogan + CTA */}
          <div>
            {/* 状态徽标 */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 dark:border-blue-800/60 dark:bg-blue-950/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                {t('badge')}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              {t('hero_title_1')}{' '}
              <span className="text-blue-600 dark:text-blue-400">{t('hero_title_highlight')}</span>
              {t('hero_title_2')}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {t.rich('hero_desc', {
                strong: (chunks) => (
                  <strong className="font-semibold text-gray-700 dark:text-gray-200">
                    {chunks}
                  </strong>
                ),
              })}
            </p>

            {/* CTA 按钮组 */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/guides`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                {isZh ? '开始查阅指南' : 'Browse Guides'}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={`/${locale}/tags`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                {isZh ? '查看分类' : 'All Categories'}
              </Link>
            </div>

            {/* 数据统计栏 */}
            <div className="mt-8 flex gap-6">
              {[
                { num: '300+', label: isZh ? '深度指南' : 'In-depth Guides' },
                { num: '8', label: isZh ? '大品类' : 'Categories' },
                { num: '50+', label: isZh ? '子品类' : 'Subcategories' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono-spec text-xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.num}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：参数对比演示卡 */}
          <div className="hidden lg:block">
            <DemoCard isZh={isZh} />
          </div>
        </div>

        {/* 搜索框（Hero 区大搜索框 — 仅在移动端补充） */}
        <div className="mt-8 sm:hidden">
          <HeroSearchMobile locale={locale} isZh={isZh} t={t} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          金刚区 — 极简线框 Icon 分类（8大品类）
      ══════════════════════════════════════════════ */}
      <section className="border-y border-gray-200/80 py-6 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-600">
            {t('categories_title')}
          </h2>
          <Link
            href={`/${locale}/tags`}
            className="text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isZh ? '全部分类 →' : 'All categories →'}
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/tags/${cat.slug}`}
              className="group flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              {/* 线框图标容器 */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl shadow-sm transition group-hover:border-blue-300 group-hover:shadow-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:border-blue-700">
                {cat.icon}
              </div>
              <span className="text-[11px] leading-tight font-medium text-gray-600 group-hover:text-blue-700 dark:text-gray-400 dark:group-hover:text-blue-400">
                {isZh ? cat.labelZh : cat.labelEn}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          最新指南 — 参数评测卡片
      ══════════════════════════════════════════════ */}
      <section className="py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {t('guides_title')}
          </h2>
          <Link
            href={`/${locale}/guides`}
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            {t('guides_view_all')}
          </Link>
        </div>

        {!posts.length && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {loaded && posts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags = [] } = post
              const catObj = CATEGORIES.find((c) => tags.includes(c.slug))
              const subObj =
                catObj?.subcategories.find((s) => tags.includes(s.slug)) ??
                CATEGORIES.flatMap((c) => c.subcategories).find((s) => tags.includes(s.slug))
              const specTags = extractSpecTags(tags)
              const badge = getBadge(tags)

              return (
                <article
                  key={slug}
                  className="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900"
                >
                  {/* 顶部蓝色指示线 */}
                  <div className="h-[3px] w-full rounded-t-2xl bg-blue-600 opacity-80 group-hover:opacity-100" />

                  {/* 状态角标 */}
                  {badge && (
                    <span
                      className={`absolute top-4 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.color}`}
                    >
                      {isZh ? badge.labelZh : badge.label}
                    </span>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {/* ① 品类面包屑 */}
                    <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                      {catObj ? (
                        <Link
                          href={`/${locale}/tags/${catObj.slug}`}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          {catObj.icon} {isZh ? catObj.labelZh : catObj.labelEn}
                        </Link>
                      ) : null}
                      {subObj && (
                        <>
                          <span className="text-[9px] text-gray-300 dark:text-gray-700">›</span>
                          <Link
                            href={`/${locale}/tags/${subObj.slug}`}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                          >
                            {isZh ? subObj.labelZh : subObj.labelEn}
                          </Link>
                        </>
                      )}
                    </div>

                    {/* ② 标题 */}
                    <h3 className="mb-2.5 text-[14px] leading-snug font-bold text-gray-900 transition group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-400">
                      <Link href={`/${locale}/guides/${slug}`}>{title}</Link>
                    </h3>

                    {/* ③ 核心参数快照 — 等宽字体 */}
                    {specTags.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase dark:text-gray-600">
                          {isZh ? '核心参数' : 'Key Specs'}
                        </span>
                        {specTags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-spec rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/30 dark:text-blue-400"
                          >
                            {toLabel(tag)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ④ 摘要 */}
                    <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                      {summary}
                    </p>

                    {/* ⑤ 底部：日期 + 阅读链接 */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                      <time
                        dateTime={date}
                        className="font-mono-spec text-[11px] text-gray-400 tabular-nums dark:text-gray-600"
                      >
                        {formatLocalDate(date, locale)}
                      </time>
                      <Link
                        href={`/${locale}/guides/${slug}`}
                        className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {t('read_guide')}
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          价值主张区 — 深灰极客风
      ══════════════════════════════════════════════ */}
      <section className="my-8 rounded-2xl bg-gray-950 p-8 text-white shadow-xl ring-1 ring-gray-800 dark:ring-gray-700">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-px flex-1 bg-gray-800" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
            {isZh ? 'Why LogicBuy' : 'Why LogicBuy'}
          </span>
          <span className="h-px flex-1 bg-gray-800" />
        </div>
        <h2 className="mt-3 mb-1 text-center text-xl font-extrabold text-white">
          {t('diff_title')}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">{t('diff_desc')}</p>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { key: 'no_brand', icon: '🚫', border: 'border-red-900/50', dot: 'bg-red-500' },
            { key: 'param', icon: '📊', border: 'border-blue-900/50', dot: 'bg-blue-500' },
            {
              key: 'checklist',
              icon: '✅',
              border: 'border-emerald-900/50',
              dot: 'bg-emerald-500',
            },
          ].map((item) => (
            <div
              key={item.key}
              className={`rounded-xl border bg-gray-900 p-4 transition hover:bg-gray-800 ${item.border}`}
            >
              <div className="mb-3 text-4xl leading-none">{item.icon}</div>
              <div className="mb-1 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                <span className="text-sm font-bold text-gray-100">{t(`diff_${item.key}`)}</span>
              </div>
              <p className="text-[12px] leading-relaxed text-gray-500">
                {t(`diff_${item.key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/* ── 移动端 Hero 搜索框（仅移动端显示） ── */
function HeroSearchMobile({
  locale,
  isZh,
  t,
}: {
  locale: string
  isZh: boolean
  t: ReturnType<typeof useTranslations<'home'>>
}) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/${locale}/guides?search=${encodeURIComponent(query.trim())}`)
  }
  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
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
          placeholder={t('search_placeholder')}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-24 pl-9 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          {isZh ? '搜索' : 'Search'}
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-600">
        {t('search_note')}
      </p>
    </form>
  )
}

/* ── 右侧参数对比演示卡 ── */
function DemoCard({ isZh }: { isZh: boolean }) {
  const specs = isZh
    ? [
        { label: '净水工艺', a: 'RO 反渗透', b: '活性炭过滤', winner: 'a' },
        { label: '通量（GPD）', a: '800 GPD', b: '不适用', winner: 'a' },
        { label: '废水比', a: '1:1', b: '纯净水', winner: 'a' },
        { label: '滤芯寿命', a: '12 个月', b: '3 个月', winner: 'a' },
      ]
    : [
        { label: 'Filter Tech', a: 'RO Membrane', b: 'Activated Carbon', winner: 'a' },
        { label: 'Flow Rate', a: '800 GPD', b: 'N/A', winner: 'a' },
        { label: 'Waste Ratio', a: '1:1', b: 'No waste', winner: 'a' },
        { label: 'Filter Life', a: '12 months', b: '3 months', winner: 'a' },
      ]

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* 卡头 */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono-spec text-[11px] font-semibold text-gray-400">
          {isZh ? 'spec-compare.tsx' : 'spec-compare.tsx'}
        </span>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          {isZh ? '参数对比' : 'COMPARE'}
        </span>
      </div>

      {/* 表头 */}
      <div className="grid grid-cols-3 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <span className="text-[11px] font-semibold text-gray-400">{isZh ? '参数' : 'Spec'}</span>
        <span className="text-center text-[11px] font-semibold text-blue-600 dark:text-blue-400">
          {isZh ? '产品 A' : 'Product A'}
        </span>
        <span className="text-center text-[11px] font-semibold text-gray-400">
          {isZh ? '产品 B' : 'Product B'}
        </span>
      </div>

      {/* 参数行 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {specs.map((row, i) => (
          <div key={i} className="grid grid-cols-3 items-center px-4 py-2.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{row.label}</span>
            <span className="text-center">
              <span className="font-mono-spec inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                {row.a}
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </span>
            <span className="text-center">
              <span className="font-mono-spec inline-block px-1.5 py-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                {row.b}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="rounded-b-2xl border-t border-gray-100 bg-amber-50/60 px-4 py-2.5 dark:border-gray-800 dark:bg-amber-950/10">
        <p className="text-[11px] text-amber-700 dark:text-amber-500">
          ⚠️{' '}
          {isZh
            ? '警惕：宣称"矿物质水"多为营销噱头。'
            : 'Watch out: "Mineral water" claims are often marketing.'}
        </p>
      </div>
    </div>
  )
}

/* 解决 useRouter 在 HeroSearchMobile 中的引用 */
import { useRouter } from 'next/navigation'

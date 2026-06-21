import { Metadata } from 'next'
import { fetchPitfallGuides } from '@/lib/supabase'
import { getCategoryForTags } from '@/data/categories'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

// ISR：每天最多重新生成一次，构建期 Supabase 异常也能在运行时自愈
export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}/pitfalls`
  const title = isZh ? '踩坑指南专栏' : 'Pitfall Guides'
  const description = isZh
    ? '高频日常品类的「常见错误」专栏：用参数化解法拆解你最容易踩的坑，全程不提品牌。'
    : 'A column of common buying mistakes for everyday categories — each pitfall solved with the spec to check instead, and zero brand names.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `/en/pitfalls`,
        zh: `/zh/pitfalls`,
        'x-default': `/en/pitfalls`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteMetadata.title,
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteMetadata.siteUrl}${siteMetadata.socialBanner}`],
    },
  }
}

/** 从正文/摘要里推断"几个坑"——优先用标题里的数字，否则回退到通用文案 */
function countFromTitle(title: string): number | null {
  const m = title.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

export default async function PitfallsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const guides = await fetchPitfallGuides(locale)

  const title = isZh ? '踩坑指南' : 'Pitfall Guides'
  const subtitle = isZh
    ? '不止告诉你哪里是坑——每个坑都给出该看哪个参数，全程不提品牌。'
    : 'Not just the mistakes — every pitfall names the exact spec to check instead. No brand names, ever.'

  // ── 结构化数据 ──
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isZh ? '首页' : 'Home',
        item: `${siteMetadata.siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `${siteMetadata.siteUrl}/${locale}/pitfalls`,
      },
    ],
  }

  const itemListLd =
    guides.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: title,
          url: `${siteMetadata.siteUrl}/${locale}/pitfalls`,
          numberOfItems: guides.length,
          itemListElement: guides.map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteMetadata.siteUrl}/${locale}/guides/${g.slug}`,
            name: g.title,
          })),
        }
      : null

  // ── "本专栏怎么用"三栏 ──
  const howItWorks = isZh
    ? [
        { icon: '🕳️', t: '真实踩坑点', d: '从大家真正后悔的地方出发，不是泛泛的功能罗列。' },
        { icon: '📐', t: '参数化解法', d: '每个坑都告诉你该看哪个规格、哪个数值，可照着核对。' },
        { icon: '🚫', t: '零品牌', d: '不提任何产品名，只讲参数与原理，不受赞助左右。' },
      ]
    : [
        {
          icon: '🕳️',
          t: 'Real pitfalls',
          d: 'Built from what people actually regret — not a generic feature list.',
        },
        {
          icon: '📐',
          t: 'Spec-driven fixes',
          d: 'Every mistake names the exact spec or number to check instead.',
        },
        {
          icon: '🚫',
          t: 'Zero brands',
          d: 'No product names — just parameters and mechanisms, no sponsorship.',
        },
      ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-6 py-12 sm:px-10 sm:py-16 dark:border-amber-900/40 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20">
        {/* 装饰光斑 */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-500/10" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300">
            ⚠️ {isZh ? '避坑专栏' : 'Avoid the Traps'}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
          <p className="mt-3 text-sm font-medium text-amber-700/80 dark:text-amber-300/80">
            {isZh
              ? `${guides.length} 个高频品类 · 参数化避坑 · 无品牌偏见`
              : `${guides.length} everyday categories · spec-driven · no brand bias`}
          </p>
        </div>
      </section>

      {/* ── 本专栏怎么用 ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {howItWorks.map((it) => (
          <div
            key={it.t}
            className="overflow-hidden rounded-2xl border border-amber-200/60 bg-white/70 p-5 dark:border-amber-900/30 dark:bg-gray-900/40"
          >
            <div className="-mx-5 -mt-5 mb-4 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
            <div className="text-2xl">{it.icon}</div>
            <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-gray-100">{it.t}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">{it.d}</p>
          </div>
        ))}
      </section>

      {/* ── 卡片网格 ── */}
      <section className="mt-12">
        <h2 className="mb-5 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '按品类避坑' : 'Pitfalls by category'}
        </h2>

        {guides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p className="text-lg">
              {isZh ? '专栏内容即将上线，敬请期待。' : 'This column is coming soon.'}
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => {
              const cat = getCategoryForTags(g.tags)
              const count = countFromTitle(g.title)
              const catLabel = cat ? (isZh ? cat.labelZh : cat.labelEn) : null

              return (
                <li key={`${g.slug}-${g.locale}`}>
                  <Link
                    href={`/${locale}/guides/${g.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-700"
                  >
                    {/* 顶部：品类标签 + 坑数徽标 */}
                    <div className="flex items-center justify-between gap-2">
                      {cat ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.iconBg} text-gray-700 dark:text-gray-200`}
                        >
                          <span>{cat.icon}</span>
                          {catLabel}
                        </span>
                      ) : (
                        <span />
                      )}
                      {count !== null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300">
                          {isZh ? `${count} 个坑` : `${count} traps`}
                        </span>
                      )}
                    </div>

                    {/* 标题 */}
                    <h3 className="mt-3 text-lg leading-7 font-bold tracking-tight text-gray-900 group-hover:text-amber-700 dark:text-gray-100 dark:group-hover:text-amber-300">
                      {g.title}
                    </h3>

                    {/* 摘要 */}
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {g.summary}
                    </p>

                    {/* 行动 */}
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {isZh ? '看看这些坑' : 'See the pitfalls'}
                      <span className="ml-1 transition group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ── 底部导流 ── */}
      <section className="mt-14 mb-6 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center dark:border-gray-800 dark:bg-gray-900/40">
        <p className="text-base text-gray-600 dark:text-gray-300">
          {isZh
            ? '想要完整的参数解读，而不只是避坑？'
            : 'Want the full spec breakdown, not just the pitfalls?'}
        </p>
        <Link
          href={`/${locale}/guides`}
          className="mt-3 inline-flex items-center rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
        >
          {isZh ? '浏览全部避坑指南 →' : 'Browse all buying guides →'}
        </Link>
      </section>
    </>
  )
}

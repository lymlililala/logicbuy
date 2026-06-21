import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

// 静态内容，长缓存即可
export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}/about`
  const title = isZh ? '关于我们' : 'About Us'
  const description = isZh
    ? 'LogicBuy 是一个以参数为核心、不被品牌营销左右的选购知识库。了解我们的使命、研究方法与编辑原则。'
    : 'LogicBuy is a spec-driven, brand-free buying knowledge base. Learn our mission, research method, and editorial principles.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `/en/about`,
        zh: `/zh/about`,
        'x-default': `/en/about`,
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const title = isZh ? '关于 LogicBuy' : 'About LogicBuy'
  const subtitle = isZh
    ? '按参数选购，而不是被品牌牵着走。我们把规格、行业标准与真实表现拆给你看，让每一笔花费都对得起价格。'
    : 'Buy by specs, not by brands. We break down specifications, industry standards, and real-world performance so every purchase earns its price.'

  // ── 结构化数据：Organization + AboutPage + Breadcrumb ──
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LogicBuy',
    url: siteMetadata.siteUrl,
    logo: `${siteMetadata.siteUrl}/static/images/logo.png`,
    description: isZh
      ? '以参数为核心、不接受品牌赞助的全球选购知识库。'
      : 'A global, spec-driven buying knowledge base with no brand sponsorships.',
    email: siteMetadata.email,
    sameAs: [siteMetadata.x, siteMetadata.linkedin, siteMetadata.github].filter(Boolean),
  }
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
        name: isZh ? '关于我们' : 'About Us',
        item: `${siteMetadata.siteUrl}/${locale}/about`,
      },
    ],
  }

  const principles = isZh
    ? [
        {
          icon: '🚫',
          t: '零品牌赞助',
          d: '不接受任何品牌的付费推荐或定向合作，结论只对参数负责。',
        },
        { icon: '📊', t: '参数说话', d: '每条建议都能落到可测量的规格与数值上，而非主观好恶。' },
        { icon: '✅', t: '真实场景核对', d: '把核对清单放进真实购买场景里检验，能用才写进去。' },
        { icon: '🌍', t: '面向全球', d: '中英双语、用通俗语言写给所有想理性消费的人。' },
      ]
    : [
        {
          icon: '🚫',
          t: 'No brand sponsorships',
          d: 'We accept no paid placements or brand deals — conclusions answer only to the specs.',
        },
        {
          icon: '📊',
          t: 'Specs over opinions',
          d: 'Every recommendation maps to a measurable spec or number, not a personal preference.',
        },
        {
          icon: '✅',
          t: 'Tested against reality',
          d: 'Checklists are validated against real purchase scenarios before they ship.',
        },
        {
          icon: '🌍',
          t: 'Built for everyone',
          d: 'Bilingual (EN/中文) and written in plain language for anyone buying smarter.',
        },
      ]

  const method = isZh
    ? [
        { n: '1', t: '锁定决策参数', d: '先找出真正决定体验的少数关键规格，剔除营销噪音。' },
        { n: '2', t: '对齐行业标准', d: '把参数放回公开标准与测试方法里，给出能比较的基准线。' },
        {
          n: '3',
          t: '给出可核对清单',
          d: '把研究压缩成你下单前能逐条对照的清单，标明该看哪个数值。',
        },
      ]
    : [
        {
          n: '1',
          t: 'Isolate the deciding specs',
          d: 'We find the few specs that actually shape the experience and cut the marketing noise.',
        },
        {
          n: '2',
          t: 'Anchor to standards',
          d: 'Each spec is mapped back to public standards and test methods for a comparable baseline.',
        },
        {
          n: '3',
          t: 'Ship a checklist',
          d: 'Research is distilled into a checklist you can tick off before you buy — with the number to look for.',
        },
      ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 px-6 py-12 sm:px-10 sm:py-16 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300">
            ⚙️ {isZh ? 'BUY BY SPECS · NOT BY BRANDS' : 'BUY BY SPECS · NOT BY BRANDS'}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ── 使命 ── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '我们为什么存在' : 'Why we exist'}
        </h2>
        <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          {isZh ? (
            <>
              <p>
                选购信息早已过载，但其中大半是品牌营销、付费排名与含糊的「好评」。真正决定你用得爽不爽的，
                往往是几个不起眼的参数——而它们恰恰被淹没在广告里。
              </p>
              <p>
                LogicBuy 由一群独立研究者、工程师与消费者倡导者组成，只做一件事：把每个品类里
                <strong className="font-semibold text-gray-800 dark:text-gray-100">
                  真正重要的规格
                </strong>
                找出来、讲清楚，让你不靠运气、不被话术左右，就能买对。
              </p>
            </>
          ) : (
            <>
              <p>
                Buying advice is everywhere, yet most of it is brand marketing, paid rankings, and
                vague praise. What actually decides whether you'll be happy is usually a handful of
                unglamorous specs — the ones drowned out by the ads.
              </p>
              <p>
                LogicBuy is an independent group of researchers, engineers, and consumer advocates
                with one job: surface the{' '}
                <strong className="font-semibold text-gray-800 dark:text-gray-100">
                  specs that genuinely matter
                </strong>{' '}
                in every category and explain them plainly — so you buy right without luck or sales
                talk.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── 研究方法 ── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '我们怎么做研究' : 'How we research'}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {method.map((m) => (
            <div
              key={m.n}
              className="rounded-2xl border border-gray-200/80 bg-white/60 p-5 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                {m.n}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{m.t}</h3>
              <p className="mt-1.5 text-sm leading-6 text-gray-600 dark:text-gray-400">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 编辑原则 ── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '我们的原则' : 'Our principles'}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.t}
              className="flex gap-4 rounded-2xl border border-gray-200/80 bg-white/60 p-5 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div className="text-2xl">{p.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{p.t}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 透明度声明 ── */}
      <section className="mt-12 rounded-2xl border border-gray-200/80 bg-gray-50/60 p-6 dark:border-gray-800 dark:bg-gray-900/40">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '关于收入的坦白' : 'How we stay independent'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {isZh ? (
            <>
              本站部分链接为联盟推广链接，当你通过它们下单时我们可能获得佣金——但这
              <strong className="font-semibold text-gray-700 dark:text-gray-200">不影响</strong>
              任何基于参数的客观结论，也不会让某个产品被「买到」更高排名。详见{' '}
              <Link
                href={`/${locale}/privacy`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                隐私政策
              </Link>{' '}
              与{' '}
              <Link
                href={`/${locale}/terms`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                服务条款
              </Link>
              。
            </>
          ) : (
            <>
              Some links on this site are affiliate links, and we may earn a commission when you buy
              through them — but this{' '}
              <strong className="font-semibold text-gray-700 dark:text-gray-200">never</strong>{' '}
              influences our spec-based conclusions, and no product can buy a higher ranking. See
              our{' '}
              <Link
                href={`/${locale}/privacy`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link
                href={`/${locale}/terms`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Terms of Service
              </Link>
              .
            </>
          )}
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="mt-12 mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-gray-700 dark:text-gray-300">
          {isZh ? '有问题、纠错或合作意向？' : 'Questions, corrections, or partnership ideas?'}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {isZh ? '联系我们' : 'Contact us'} →
        </Link>
      </section>
    </>
  )
}

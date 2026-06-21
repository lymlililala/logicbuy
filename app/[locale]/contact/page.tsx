import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

export const revalidate = 86400

// Spaceship 已为以下地址配置邮件转发
const EMAILS = {
  general: 'hello@logicbuy.guide',
  privacy: 'privacy@logicbuy.guide',
  legal: 'legal@logicbuy.guide',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}/contact`
  const title = isZh ? '联系我们' : 'Contact Us'
  const description = isZh
    ? '联系 LogicBuy：一般咨询与合作、隐私与数据请求、法务与内容下架。我们会尽快回复。'
    : 'Get in touch with LogicBuy — general inquiries and partnerships, privacy and data requests, legal and takedown matters.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `/en/contact`,
        zh: `/zh/contact`,
        'x-default': `/en/contact`,
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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const title = isZh ? '联系我们' : 'Contact Us'
  const subtitle = isZh
    ? '我们读每一封邮件。请按主题选对地址，能让我们回得更快。'
    : 'We read every message. Pick the right address for your topic and we’ll reply faster.'

  const channels = isZh
    ? [
        {
          icon: '✉️',
          t: '一般咨询与合作',
          d: '内容建议、媒体、内容授权或商务合作，都发这里。',
          email: EMAILS.general,
        },
        {
          icon: '🔒',
          t: '隐私与数据',
          d: '查询、导出或删除你的数据，以及任何隐私相关请求。',
          email: EMAILS.privacy,
        },
        {
          icon: '⚖️',
          t: '法务与下架',
          d: '版权、商标、内容纠错或下架请求，请走此渠道。',
          email: EMAILS.legal,
        },
      ]
    : [
        {
          icon: '✉️',
          t: 'General & partnerships',
          d: 'Content suggestions, press, licensing, or business inquiries.',
          email: EMAILS.general,
        },
        {
          icon: '🔒',
          t: 'Privacy & data',
          d: 'Access, export, or delete your data, and any privacy-related request.',
          email: EMAILS.privacy,
        },
        {
          icon: '⚖️',
          t: 'Legal & takedowns',
          d: 'Copyright, trademark, content corrections, or takedown requests.',
          email: EMAILS.legal,
        },
      ]

  // ── 结构化数据 ──
  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: title,
    url: `${siteMetadata.siteUrl}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'LogicBuy',
      url: siteMetadata.siteUrl,
      email: EMAILS.general,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: EMAILS.general,
          contactType: isZh ? '客户服务' : 'customer support',
          availableLanguage: ['en', 'zh'],
        },
        {
          '@type': 'ContactPoint',
          email: EMAILS.privacy,
          contactType: 'privacy',
          availableLanguage: ['en', 'zh'],
        },
        {
          '@type': 'ContactPoint',
          email: EMAILS.legal,
          contactType: 'legal',
          availableLanguage: ['en', 'zh'],
        },
      ],
    },
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
        name: title,
        item: `${siteMetadata.siteUrl}/${locale}/contact`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 px-6 py-12 sm:px-10 sm:py-16 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300">
            💬 {isZh ? '我们在听' : "We're listening"}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
      </section>

      {/* ── 渠道卡片 ── */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <div
            key={c.email}
            className="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-5 dark:border-gray-800 dark:bg-gray-900/40"
          >
            <div className="text-2xl">{c.icon}</div>
            <h2 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{c.t}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {c.d}
            </p>
            <a
              href={`mailto:${c.email}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              {c.email}
            </a>
          </div>
        ))}
      </section>

      {/* ── 说明 ── */}
      <section className="mt-10 rounded-2xl border border-gray-200/80 bg-gray-50/60 p-6 dark:border-gray-800 dark:bg-gray-900/40">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {isZh ? '回复时间与说明' : 'Response times & notes'}
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {isZh ? (
            <>
              <li>· 我们通常在 2–3 个工作日内回复，中英文均可。</li>
              <li>· 发现文章里的参数或事实有误？请附上链接，我们会优先核查并更正。</li>
              <li>
                · 想了解我们如何处理你的信息，请阅读{' '}
                <Link
                  href={`/${locale}/privacy`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  隐私政策
                </Link>
                。
              </li>
            </>
          ) : (
            <>
              <li>· We usually reply within 2–3 business days, in English or Chinese.</li>
              <li>
                · Spotted a wrong spec or fact in an article? Include the link — corrections are
                prioritized.
              </li>
              <li>
                · To learn how we handle your information, read our{' '}
                <Link
                  href={`/${locale}/privacy`}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
                .
              </li>
            </>
          )}
        </ul>
      </section>
    </>
  )
}

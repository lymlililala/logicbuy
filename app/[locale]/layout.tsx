import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import LocaleSuggestion from '@/components/LocaleSuggestion'
import siteMetadata from '@/data/siteMetadata'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const SOCIAL_BANNER = `${siteMetadata.siteUrl}/static/images/twitter-card.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [{ url: SOCIAL_BANNER, width: 1200, height: 630, alt: siteMetadata.title }],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    // canonical 由各页面的 generateMetadata 自行设置，此处只配置 RSS
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [SOCIAL_BANNER],
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // 验证 locale 是否合法
  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound()
  }

  // 获取当前语言的 messages（用于 Client Components）
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
      <LocaleSuggestion currentLocale={locale as 'en' | 'zh'} />
      <SectionContainer>
        <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
          <Header locale={locale} />
          <main className="mb-auto">{children}</main>
        </SearchProvider>
        <Footer locale={locale} />
      </SectionContainer>
    </NextIntlClientProvider>
  )
}

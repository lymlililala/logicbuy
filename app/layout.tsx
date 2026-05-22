import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk, Roboto_Mono } from 'next/font/google'
import { ThemeProviders } from './theme-providers'
import { getLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

// locale → HTML lang attribute mapping
const localeToHtmlLang: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''
  const locale = await getLocale()
  const htmlLang = localeToHtmlLang[locale] || 'en'

  return (
    <html
      lang={htmlLang}
      className={`${space_grotesk.variable} ${roboto_mono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#2563EB"
      />
      <meta name="msapplication-TileColor" content="#2563EB" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F8FAFC" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0F172A" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-gray-50 pl-[calc(100vw-100%)] text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProviders>{children}</ThemeProviders>
        <Analytics />
      </body>
    </html>
  )
}

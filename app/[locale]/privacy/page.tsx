import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

export const revalidate = 86400

const PRIVACY_EMAIL = 'privacy@logicbuy.guide'
// 政策版本日期：内容变更时手动更新，避免动态日期误导
const LAST_UPDATED = { en: 'June 14, 2026', zh: '2026年6月14日' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}/privacy`
  const title = isZh ? '隐私政策' : 'Privacy Policy'
  const description = isZh
    ? 'LogicBuy 如何收集、使用与保护你的信息：订阅邮件、Cookie、联盟链接、第三方服务与你的权利。'
    : 'How LogicBuy collects, uses, and protects your information — newsletter, cookies, affiliate links, third parties, and your rights.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteMetadata.siteUrl}/en/privacy`,
        zh: `${siteMetadata.siteUrl}/zh/privacy`,
        'x-default': `${siteMetadata.siteUrl}/en/privacy`,
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
    robots: { index: true, follow: true },
  }
}

type Section = { h: string; body: React.ReactNode }

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const linkCls = 'font-medium text-blue-600 hover:underline dark:text-blue-400'
  const mail = (
    <a href={`mailto:${PRIVACY_EMAIL}`} className={linkCls}>
      {PRIVACY_EMAIL}
    </a>
  )

  const sections: Section[] = isZh
    ? [
        {
          h: '1. 我们是谁',
          body: (
            <p>
              本隐私政策适用于
              LogicBuy（logicbuy.guide，以下称「本站」「我们」）。我们是一个以参数为核心的双语选购知识库。
              如对你的个人信息有任何疑问，可随时通过 {mail} 联系我们。
            </p>
          ),
        },
        {
          h: '2. 我们收集哪些信息',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>你主动提供的信息：</strong>
                当你订阅邮件简报时，我们收集你的邮箱地址；当你来信时，我们收集你的邮箱及邮件内容。
              </li>
              <li>
                <strong>自动收集的技术信息：</strong>
                与几乎所有网站一样，我们的托管服务会在服务器日志中记录标准请求数据（如 IP
                地址、浏览器类型、访问时间、来源页），用于安全与运维。
              </li>
              <li>
                <strong>偏好信息：</strong>我们使用 Cookie 与本地存储记住你的语言（
                <code>NEXT_LOCALE</code>）与深色/浅色主题偏好（详见下文）。
              </li>
            </ul>
          ),
        },
        {
          h: '3. Cookie 与本地存储',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>
                  语言偏好（<code>NEXT_LOCALE</code> Cookie）：
                </strong>
                记住你选择的中文/英文，避免每次重新检测。
              </li>
              <li>
                <strong>主题偏好（本地存储）：</strong>
                记住你的深色/浅色模式选择，仅保存在你的浏览器中。
              </li>
              <li>
                <strong>广告与分析 Cookie：</strong>
                我们与第三方广告及分析合作伙伴（如 Google）可能在你的设备上设置 Cookie
                或类似技术，用于投放广告、衡量广告效果及统计访问情况（见第 5 节）。
              </li>
              <li>
                <strong>联盟 Cookie：</strong>
                当你点击联盟推广链接跳转到外部商家时，对方网络可能设置其自有 Cookie（见第 5 节）。
              </li>
            </ul>
          ),
        },
        {
          h: '4. 邮件简报',
          body: (
            <p>
              我们通过第三方服务 Buttondown
              发送邮件简报。订阅时你的邮箱会存储在该服务中，仅用于向你发送内容更新。你可以随时点击邮件中的退订链接取消，我们会相应删除你的订阅记录。
            </p>
          ),
        },
        {
          h: '5. 广告、联盟链接与第三方',
          body: (
            <div className="space-y-3">
              <p>
                <strong>广告：</strong>本站通过第三方广告服务（如 Google
                AdSense）展示广告。这些厂商可能使用 Cookie
                或类似技术，根据你对本站及其他网站的访问来投放更相关的广告并衡量效果。关于 Google
                如何使用广告 Cookie，见其{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  广告政策
                </a>
                ；你可以在{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Google 广告设置
                </a>{' '}
                中管理个性化广告，或在{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  aboutads.info
                </a>{' '}
                退出参与厂商的个性化广告。
              </p>
              <p>
                <strong>联盟链接：</strong>
                本站部分指向商家的链接为联盟推广链接。当你通过这些链接购买时，我们可能获得佣金，
                且对方网络可能通过 Cookie
                识别这笔来自本站的引荐——这一过程由对方按其隐私政策处理，我们不会因此获得你的支付信息。
              </p>
              <p>
                <strong>基础设施：</strong>本站托管于 Vercel，邮件由 Buttondown
                处理。以上第三方服务均有各自的隐私政策。
              </p>
            </div>
          ),
        },
        {
          h: '6. 我们如何使用信息',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>向订阅者发送邮件简报；</li>
              <li>回复你的来信与请求；</li>
              <li>保障网站安全、排查故障、了解整体使用趋势；</li>
              <li>记住你的语言与主题偏好。</li>
            </ul>
          ),
        },
        {
          h: '7. 你的权利',
          body: (
            <p>
              你有权访问、更正或删除我们持有的与你相关的信息（主要是你的订阅邮箱）。如需行使这些权利，
              请发送邮件至 {mail}，我们会在合理时间内处理。你也可以随时清除浏览器的 Cookie
              与本地存储。
            </p>
          ),
        },
        {
          h: '8. 数据安全与留存',
          body: (
            <p>
              我们仅在实现上述目的所必需的期间内保留信息。我们采取合理的技术与管理措施保护数据，但请理解：互联网传输无法保证绝对安全。
            </p>
          ),
        },
        {
          h: '9. 儿童隐私',
          body: <p>本站不面向 16 岁以下儿童，我们不会有意收集其个人信息。</p>,
        },
        {
          h: '10. 政策更新',
          body: (
            <p>
              我们可能不时更新本政策。重大变更将通过更新本页顶部的「最后更新」日期体现，建议你定期查看。
            </p>
          ),
        },
        {
          h: '11. 联系我们',
          body: (
            <p>
              对本隐私政策有任何疑问或请求，请联系 {mail}，或访问{' '}
              <Link href={`/${locale}/contact`} className={linkCls}>
                联系我们
              </Link>{' '}
              页面。
            </p>
          ),
        },
      ]
    : [
        {
          h: '1. Who we are',
          body: (
            <p>
              This Privacy Policy applies to LogicBuy (logicbuy.guide, “we”, “us”, “the site”), a
              bilingual, spec-driven buying knowledge base. If you have any questions about your
              personal information, contact us any time at {mail}.
            </p>
          ),
        },
        {
          h: '2. Information we collect',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Information you provide:</strong> when you subscribe to our newsletter we
                collect your email address; when you email us we collect your address and message.
              </li>
              <li>
                <strong>Technical information collected automatically:</strong> like virtually every
                website, our host records standard request data in server logs (such as IP address,
                browser type, timestamp, and referring page) for security and operations.
              </li>
              <li>
                <strong>Preferences:</strong> we use a cookie and local storage to remember your
                language (<code>NEXT_LOCALE</code>) and dark/light theme (see below).
              </li>
            </ul>
          ),
        },
        {
          h: '3. Cookies & local storage',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>
                  Language preference (<code>NEXT_LOCALE</code> cookie):
                </strong>{' '}
                remembers whether you chose English or Chinese so we don’t re-detect on every visit.
              </li>
              <li>
                <strong>Theme preference (local storage):</strong> remembers your dark/light choice,
                stored only in your browser.
              </li>
              <li>
                <strong>Advertising & analytics cookies:</strong> we and third-party advertising and
                analytics partners (such as Google) may set cookies or similar technologies on your
                device to serve ads, measure their performance, and understand usage (see Section
                5).
              </li>
              <li>
                <strong>Affiliate cookies:</strong> when you click an affiliate link to an external
                merchant, that network may set its own cookies (see Section 5).
              </li>
            </ul>
          ),
        },
        {
          h: '4. Newsletter',
          body: (
            <p>
              We send our newsletter through a third-party service, Buttondown. When you subscribe,
              your email is stored there and used only to send you content updates. You can
              unsubscribe at any time via the link in any email, and we will remove your
              subscription accordingly.
            </p>
          ),
        },
        {
          h: '5. Advertising, affiliate links & third parties',
          body: (
            <div className="space-y-3">
              <p>
                <strong>Advertising:</strong> we display ads through third-party advertising
                services (such as Google AdSense). These providers may use cookies or similar
                technologies to serve more relevant ads and measure their performance based on your
                visits to this and other sites. For how Google uses advertising cookies, see its{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Ads policy
                </a>
                . You can manage personalized ads in{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Google Ads Settings
                </a>{' '}
                or opt out of participating vendors at{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  aboutads.info
                </a>
                .
              </p>
              <p>
                <strong>Affiliate links:</strong> some links to merchants on this site are affiliate
                links. When you buy through them we may earn a commission, and the affiliate network
                may use cookies to attribute the referral from our site — handled by that network
                under its own privacy policy. We never receive your payment details.
              </p>
              <p>
                <strong>Infrastructure:</strong> this site is hosted on Vercel and email is handled
                by Buttondown. Each third party above has its own privacy policy.
              </p>
            </div>
          ),
        },
        {
          h: '6. How we use information',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>To send the newsletter to subscribers;</li>
              <li>To respond to your messages and requests;</li>
              <li>
                To keep the site secure, troubleshoot issues, and understand overall usage trends;
              </li>
              <li>To remember your language and theme preferences.</li>
            </ul>
          ),
        },
        {
          h: '7. Your rights',
          body: (
            <p>
              You have the right to access, correct, or delete the information we hold about you
              (chiefly your subscription email). To exercise these rights, email {mail} and we’ll
              act within a reasonable time. You can also clear cookies and local storage in your
              browser at any time.
            </p>
          ),
        },
        {
          h: '8. Data security & retention',
          body: (
            <p>
              We retain information only as long as needed for the purposes above. We use reasonable
              technical and organizational measures to protect it, but please understand that no
              transmission over the internet can be guaranteed perfectly secure.
            </p>
          ),
        },
        {
          h: '9. Children’s privacy',
          body: (
            <p>
              This site is not directed to children under 16, and we do not knowingly collect their
              personal information.
            </p>
          ),
        },
        {
          h: '10. Changes to this policy',
          body: (
            <p>
              We may update this policy from time to time. Material changes will be reflected by
              updating the “Last updated” date at the top of this page; please review it
              periodically.
            </p>
          ),
        },
        {
          h: '11. Contact us',
          body: (
            <p>
              For any questions or requests about this Privacy Policy, contact {mail} or visit our{' '}
              <Link href={`/${locale}/contact`} className={linkCls}>
                Contact
              </Link>{' '}
              page.
            </p>
          ),
        },
      ]

  const title = isZh ? '隐私政策' : 'Privacy Policy'

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
        item: `${siteMetadata.siteUrl}/${locale}/privacy`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="border-b border-gray-200 pt-6 pb-8 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {isZh ? '最后更新：' : 'Last updated: '}
          {isZh ? LAST_UPDATED.zh : LAST_UPDATED.en}
        </p>
      </header>

      <div className="mt-8 space-y-8 pb-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {s.h}
            </h2>
            <div className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

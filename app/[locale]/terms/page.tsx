import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

export const revalidate = 86400

const LEGAL_EMAIL = 'legal@logicbuy.guide'
// 条款版本日期：内容变更时手动更新
const LAST_UPDATED = { en: 'June 14, 2026', zh: '2026年6月14日' }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isZh = locale === 'zh'
  const canonical = `${siteMetadata.siteUrl}/${locale}/terms`
  const title = isZh ? '服务条款' : 'Terms of Service'
  const description = isZh
    ? '使用 LogicBuy 的条款：内容仅供参考、联盟披露、知识产权、免责声明与责任限制。'
    : 'The terms for using LogicBuy — informational content, affiliate disclosure, intellectual property, disclaimers, and limitation of liability.'

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteMetadata.siteUrl}/en/terms`,
        zh: `${siteMetadata.siteUrl}/zh/terms`,
        'x-default': `${siteMetadata.siteUrl}/en/terms`,
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

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isZh = locale === 'zh'

  const linkCls = 'font-medium text-blue-600 hover:underline dark:text-blue-400'
  const mail = (
    <a href={`mailto:${LEGAL_EMAIL}`} className={linkCls}>
      {LEGAL_EMAIL}
    </a>
  )
  const privacyLink = (
    <Link href={`/${locale}/privacy`} className={linkCls}>
      {isZh ? '隐私政策' : 'Privacy Policy'}
    </Link>
  )

  const sections: Section[] = isZh
    ? [
        {
          h: '1. 接受条款',
          body: (
            <p>
              欢迎使用
              LogicBuy（logicbuy.guide，以下称「本站」）。访问或使用本站，即表示你同意受本服务条款约束。如果你不同意，请停止使用本站。
            </p>
          ),
        },
        {
          h: '2. 内容仅供参考',
          body: (
            <p>
              本站提供的所有内容（包括选购指南、参数解读与核对清单）均为
              <strong>一般信息与教育目的</strong>
              ，不构成专业的财务、法律、医疗或其他专业建议。我们尽力保证信息准确、及时，但产品规格与市场会变化，我们不对内容的完整性或适用于你具体情况作出保证。任何购买决定由你自行判断并承担责任。
            </p>
          ),
        },
        {
          h: '3. 联盟披露',
          body: (
            <p>
              本站部分指向商家的链接为联盟推广链接，当你通过它们购买时我们可能获得佣金，这不会增加你的成本，也
              <strong>不影响</strong>我们基于参数的客观结论或排序。详见 {privacyLink}。
            </p>
          ),
        },
        {
          h: '4. 知识产权',
          body: (
            <p>
              除另有说明外，本站的原创文字、版面、Logo 与图形均归 LogicBuy
              所有，受著作权及相关法律保护。欢迎你个人、非商业地阅读与分享链接；未经书面许可，不得复制、转载或将本站内容用于商业用途。
            </p>
          ),
        },
        {
          h: '5. 可接受的使用',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>不得以自动化手段大规模抓取、镜像或转售本站内容；</li>
              <li>不得试图破坏、干扰本站的正常运行或安全；</li>
              <li>不得以误导方式使用本站名称、商标或内容。</li>
            </ul>
          ),
        },
        {
          h: '6. 第三方链接',
          body: (
            <p>
              本站包含指向第三方网站的链接。我们无法控制其内容、政策或做法，对其不承担责任。访问第三方网站受其各自条款与隐私政策约束。
            </p>
          ),
        },
        {
          h: '7. 免责声明',
          body: (
            <p>
              本站按「现状」与「现有」提供，不附带任何明示或默示的保证，包括但不限于适销性、特定用途适用性及不侵权。我们不保证本站持续可用、无错误或无中断。
            </p>
          ),
        },
        {
          h: '8. 责任限制',
          body: (
            <p>
              在适用法律允许的最大范围内，对于因使用或无法使用本站、或依赖本站内容而产生的任何间接、附带、特殊或后果性损失，LogicBuy
              概不负责。
            </p>
          ),
        },
        {
          h: '9. 条款变更',
          body: (
            <p>
              我们可能不时修订本条款，修订将通过更新本页顶部的「最后更新」日期生效。你在变更后继续使用本站，即视为接受修订后的条款。
            </p>
          ),
        },
        {
          h: '10. 联系我们',
          body: (
            <p>
              对本条款有任何疑问，或需提交版权、商标或下架请求，请联系 {mail}，或访问{' '}
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
          h: '1. Acceptance of terms',
          body: (
            <p>
              Welcome to LogicBuy (logicbuy.guide, “the site”). By accessing or using the site, you
              agree to be bound by these Terms of Service. If you do not agree, please do not use
              the site.
            </p>
          ),
        },
        {
          h: '2. Informational content only',
          body: (
            <p>
              All content on this site — including buying guides, spec explanations, and checklists
              — is provided for <strong>general informational and educational purposes</strong> and
              does not constitute professional financial, legal, medical, or other advice. We work
              hard to keep information accurate and current, but product specs and markets change,
              and we make no warranty that the content is complete or fit for your specific
              situation. Any purchasing decision is yours to make and your responsibility.
            </p>
          ),
        },
        {
          h: '3. Affiliate disclosure',
          body: (
            <p>
              Some links to merchants on this site are affiliate links; we may earn a commission
              when you buy through them, at no extra cost to you. This <strong>does not</strong>{' '}
              influence our spec-based conclusions or rankings. See our {privacyLink} for details.
            </p>
          ),
        },
        {
          h: '4. Intellectual property',
          body: (
            <p>
              Unless otherwise noted, the original text, layout, logo, and graphics on this site are
              owned by LogicBuy and protected by copyright and related laws. You may read and share
              links for personal, non-commercial use; you may not copy, republish, or use our
              content commercially without written permission.
            </p>
          ),
        },
        {
          h: '5. Acceptable use',
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Do not scrape, mirror, or resell the site’s content at scale by automated means;
              </li>
              <li>
                Do not attempt to disrupt, interfere with, or compromise the site’s operation or
                security;
              </li>
              <li>Do not use our name, trademarks, or content in a misleading way.</li>
            </ul>
          ),
        },
        {
          h: '6. Third-party links',
          body: (
            <p>
              The site contains links to third-party websites. We do not control their content,
              policies, or practices and are not responsible for them. Visiting third-party sites is
              subject to their own terms and privacy policies.
            </p>
          ),
        },
        {
          h: '7. Disclaimer of warranties',
          body: (
            <p>
              The site is provided “as is” and “as available” without warranties of any kind,
              express or implied, including but not limited to merchantability, fitness for a
              particular purpose, and non-infringement. We do not warrant that the site will be
              uninterrupted, error-free, or always available.
            </p>
          ),
        },
        {
          h: '8. Limitation of liability',
          body: (
            <p>
              To the maximum extent permitted by law, LogicBuy shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of, or inability
              to use, the site, or from reliance on its content.
            </p>
          ),
        },
        {
          h: '9. Changes to these terms',
          body: (
            <p>
              We may revise these Terms from time to time. Revisions take effect when we update the
              “Last updated” date at the top of this page. Your continued use of the site after a
              change constitutes acceptance of the revised Terms.
            </p>
          ),
        },
        {
          h: '10. Contact us',
          body: (
            <p>
              For any questions about these Terms, or to submit a copyright, trademark, or takedown
              request, contact {mail} or visit our{' '}
              <Link href={`/${locale}/contact`} className={linkCls}>
                Contact
              </Link>{' '}
              page.
            </p>
          ),
        },
      ]

  const title = isZh ? '服务条款' : 'Terms of Service'

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
        item: `${siteMetadata.siteUrl}/${locale}/terms`,
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

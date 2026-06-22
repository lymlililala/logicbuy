import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const isZh = locale === 'zh'

  const navLinks = [
    { href: `/${locale}/guides`, label: isZh ? '全部指南' : 'All Guides' },
    { href: `/${locale}/tags`, label: isZh ? '分类' : 'Categories' },
  ]

  const infoLinks = [
    { href: `/${locale}/about`, label: isZh ? '关于我们' : 'About' },
    { href: `/${locale}/contact`, label: isZh ? '联系我们' : 'Contact' },
    { href: `/${locale}/privacy`, label: isZh ? '隐私政策' : 'Privacy' },
    { href: `/${locale}/terms`, label: isZh ? '服务条款' : 'Terms' },
  ]

  return (
    <footer className="mt-12 border-t border-gray-200/80 dark:border-gray-800">
      <div className="py-8">
        {/* 品牌行 */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">
              L
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
              LogicBuy
            </span>
          </Link>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
            {isZh ? '靠参数选购 · 而非品牌' : 'BUY BY SPECS · NOT BY BRANDS'}
          </p>
        </div>

        {/* 导航链接 */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-400 transition hover:text-blue-600 dark:text-gray-600 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 信息/法务链接 */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs">
          {infoLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-400 transition hover:text-blue-600 dark:text-gray-600 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 版权 + 联盟声明 */}
        <div className="flex flex-col items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600">
          <p>
            © {new Date().getFullYear()}{' '}
            <Link
              href={`/${locale}`}
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              LogicBuy
            </Link>{' '}
            {isZh ? '· 保留所有权利。' : '· All rights reserved.'}
          </p>
          <p className="max-w-sm text-center text-[10px] text-gray-300 dark:text-gray-700">
            {isZh
              ? '本站部分链接为联盟推广链接，不影响我们基于参数的客观推荐。'
              : 'We may earn affiliate commissions. This never influences our spec-based recommendations.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * next-intl middleware 自动语言检测优先级：
 *
 *  1. URL 前缀（/zh/... 或 /en/...）  ← 用户已明确选择，最高优先
 *  2. Cookie「NEXT_LOCALE」           ← 用户上次手动切换后的偏好
 *  3. Accept-Language 请求头          ← 浏览器/系统语言（zh-CN → zh）
 *  4. defaultLocale（en）             ← 以上均不匹配时的兜底
 *
 * routing.ts 中设置了 localeDetection: true，所以 2、3 步骤自动生效。
 */
export default createMiddleware(routing)

export const config = {
  // 匹配所有路径，排除：API 路由、Next.js 内部路径、静态文件、llms.txt
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|static|llms.txt|sitemap.xml|robots.txt|feed.xml|.*\\..*).*)',
  ],
}

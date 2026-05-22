import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh'],
  // 默认语言（浏览器非中文时 fallback 到英文）
  defaultLocale: 'en',
  // 强制 URL 始终包含 /en/ 或 /zh/ 前缀
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]

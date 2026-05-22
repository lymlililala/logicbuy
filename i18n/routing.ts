import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh'],

  // 默认语言（所有检测手段都无法匹配时使用）
  defaultLocale: 'en',

  // 强制 URL 始终包含 /en/ 或 /zh/ 前缀（利于 SEO 双语 hreflang）
  localePrefix: 'always',

  // ✅ 开启自动语言检测（next-intl middleware 会按以下优先级依次判断）
  //    1. URL 前缀（/zh/... 或 /en/...）—— 优先级最高，用户已明确选择
  //    2. Cookie「NEXT_LOCALE」—— 用户上次手动切换后保存的偏好
  //    3. Accept-Language 请求头 —— 浏览器/系统语言设置（zh-CN → zh，en-US → en）
  //    4. defaultLocale —— 以上均无匹配时回落到 en
  localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]

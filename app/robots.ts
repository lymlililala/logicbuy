import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteMetadata.siteUrl

  return {
    rules: [
      // ── 主流搜索引擎：完整抓取权限 ──
      // 不屏蔽 /_next/：渲染页面需要其中的 JS/CSS/字体，Google 要求可抓取渲染资源
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider'],
        allow: '/',
        disallow: ['/api/'],
      },

      // ── AI 训练爬虫：允许内容页，屏蔽 API ──
      // allow 必须明确覆盖所有公开内容路径（含和不含尾斜杠两种形式）
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'cohere-ai',
          'Google-Extended',
          'Amazonbot',
          'meta-externalagent',
        ],
        allow: [
          '/en/',
          '/zh/',
          '/en/guides',
          '/zh/guides',
          '/en/guides/',
          '/zh/guides/',
          '/en/tags',
          '/zh/tags',
          '/en/tags/',
          '/zh/tags/',
        ],
        disallow: ['/api/', '/_next/'],
      },

      // ── SEO 监控工具爬虫：全部屏蔽，防止竞品分析 ──
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'PetalBot',
          'ZoominfoBot',
        ],
        disallow: '/',
      },

      // ── 其余所有爬虫：允许公开页面与渲染资源（/_next/），仅屏蔽 API ──
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

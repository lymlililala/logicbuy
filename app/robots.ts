import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteMetadata.siteUrl

  return {
    rules: [
      // 主流搜索引擎 — 完整抓取权限
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider'],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      // 主流 AI 训练爬虫 — 只允许读内容页，禁止 API 和后台
      {
        userAgent: [
          'GPTBot', // OpenAI
          'ChatGPT-User', // ChatGPT browse
          'ClaudeBot', // Anthropic
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot', // Perplexity
          'cohere-ai', // Cohere
          'Google-Extended', // Google AI training
          'Amazonbot', // Amazon Alexa AI
          'meta-externalagent', // Meta AI
        ],
        allow: ['/en/guides/', '/zh/guides/', '/en/tags/', '/zh/tags/'],
        disallow: ['/api/', '/_next/', '/static/', '/en/about/', '/zh/about/'],
      },
      // 恶意/无价值爬虫 — 全部屏蔽
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
      // 其余所有 — 允许公开内容，禁止内部路由
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
    // LLM-friendly discovery (llms.txt convention — https://llmstxt.org)
    // AI crawlers that respect this: GPTBot, ClaudeBot, PerplexityBot
    // Location: ${siteUrl}/llms.txt
  }
}

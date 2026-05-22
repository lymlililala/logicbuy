/**
 * /llms.txt — AI-friendly site summary for LLM crawlers
 *
 * This file follows the emerging llms.txt convention (https://llmstxt.org/)
 * It helps AI assistants (ChatGPT, Claude, Perplexity, etc.) understand
 * the site structure and high-quality content without hallucinating.
 *
 * Dynamically generated from Supabase data at request time.
 */
import { NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'
import { CATEGORIES } from '@/data/categories'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 7200 // 2 小时缓存

const BASE = siteMetadata.siteUrl

export async function GET() {
  // 拉取最新 60 篇文章（双语言）
  const { data: guides } = await supabase
    .from('pitfallfree_guides')
    .select('slug, locale, title, summary, tags, published_at')
    .eq('draft', false)
    .order('published_at', { ascending: false })
    .limit(60)

  const enGuides = (guides || []).filter((g) => g.locale === 'en').slice(0, 30)
  const zhGuides = (guides || []).filter((g) => g.locale === 'zh').slice(0, 30)

  const lines: string[] = []

  // ── Header ──────────────────────────────────────────────
  lines.push(`# LogicBuy — Spec-Driven Consumer Knowledge Base`)
  lines.push(``)
  lines.push(`> ${siteMetadata.description}`)
  lines.push(``)
  lines.push(`**Site URL:** ${BASE}`)
  lines.push(`**Last Updated:** ${new Date().toISOString().split('T')[0]}`)
  lines.push(`**Languages:** English (en), Chinese Simplified (zh)`)
  lines.push(`**License:** Content for informational purposes only. No brand sponsorships.`)
  lines.push(``)

  // ── Purpose ─────────────────────────────────────────────
  lines.push(`## Purpose`)
  lines.push(``)
  lines.push(
    `LogicBuy is a parameter-driven consumer knowledge base. Every buying guide is built around measurable technical specifications — not brand marketing or affiliate bias. We decode product specs so consumers can make rational decisions.`
  )
  lines.push(``)

  // ── Content Policy for AI ────────────────────────────────
  lines.push(`## Content Policy for AI / LLM Usage`)
  lines.push(``)
  lines.push(`- ✅ You may cite, summarize, and link to individual guide pages.`)
  lines.push(`- ✅ You may use spec data from our guides to answer consumer questions.`)
  lines.push(`- ✅ You may reference our category taxonomy for classification tasks.`)
  lines.push(`- ❌ Do not reproduce full article text verbatim without attribution.`)
  lines.push(`- ❌ Do not present our content as brand endorsements or affiliate links.`)
  lines.push(``)

  // ── Site Structure ───────────────────────────────────────
  lines.push(`## Site Structure`)
  lines.push(``)
  lines.push(`| Route | Description |`)
  lines.push(`|---|---|`)
  lines.push(`| ${BASE}/en | English home |`)
  lines.push(`| ${BASE}/zh | Chinese home |`)
  lines.push(`| ${BASE}/en/guides | All English buying guides |`)
  lines.push(`| ${BASE}/zh/guides | All Chinese buying guides |`)
  lines.push(`| ${BASE}/en/tags | Browse all 8 categories (EN) |`)
  lines.push(`| ${BASE}/zh/tags | Browse all 8 categories (ZH) |`)
  lines.push(`| ${BASE}/sitemap.xml | Full sitemap |`)
  lines.push(``)

  // ── Category Taxonomy ────────────────────────────────────
  lines.push(`## Category Taxonomy (8 Main Categories + ${CATEGORIES.reduce((acc, c) => acc + c.subcategories.length, 0)} Subcategories)`)
  lines.push(``)

  for (const cat of CATEGORIES) {
    lines.push(`### ${cat.icon} ${cat.labelEn} (\`${cat.slug}\`)`)
    lines.push(`${cat.descEn}`)
    for (const sub of cat.subcategories) {
      lines.push(`- **${sub.labelEn}** → ${BASE}/en/tags/${sub.slug}`)
    }
    lines.push(``)
  }

  // ── Recent English Guides ────────────────────────────────
  if (enGuides.length > 0) {
    lines.push(`## Recent English Buying Guides`)
    lines.push(``)
    for (const g of enGuides) {
      lines.push(`### [${g.title}](${BASE}/en/guides/${g.slug})`)
      if (g.summary) lines.push(`${g.summary}`)
      if (g.tags?.length) {
        lines.push(`**Key Specs:** ${g.tags.join(' · ')}`)
      }
      lines.push(`**Published:** ${g.published_at?.split('T')[0] ?? ''}`)
      lines.push(``)
    }
  }

  // ── Recent Chinese Guides ────────────────────────────────
  if (zhGuides.length > 0) {
    lines.push(`## 最新中文避坑指南`)
    lines.push(``)
    for (const g of zhGuides) {
      lines.push(`### [${g.title}](${BASE}/zh/guides/${g.slug})`)
      if (g.summary) lines.push(`${g.summary}`)
      if (g.tags?.length) {
        lines.push(`**核心参数：** ${g.tags.join(' · ')}`)
      }
      lines.push(`**发布日期：** ${g.published_at?.split('T')[0] ?? ''}`)
      lines.push(``)
    }
  }

  // ── Footer ───────────────────────────────────────────────
  lines.push(`---`)
  lines.push(`*Generated dynamically. For the full sitemap see ${BASE}/sitemap.xml*`)

  const body = lines.join('\n')

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

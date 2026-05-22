import MainLocale from './Main'
import { fetchGuideList } from '@/lib/supabase'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 从数据库获取文章列表（含 locale fallback）
  const guides = await fetchGuideList(locale)

  // 转换为 Main 组件所需的 PostSummary 格式
  const posts = guides.map((g) => ({
    slug: g.slug,
    date: g.published_at,
    title: g.title,
    summary: g.summary,
    tags: g.tags,
    draft: g.draft,
    locale: g.locale,
  }))

  return <MainLocale posts={posts} locale={locale} />
}

import MainLocale from './Main'
import { fetchGuideList, fetchTotalGuideCount } from '@/lib/supabase'
import { CATEGORIES } from '@/data/categories'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 并行获取：当前语言文章列表 + 全站总数
  const [guides, totalGuides] = await Promise.all([fetchGuideList(locale), fetchTotalGuideCount()])

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

  // 统计数字：指南总数为全站总数，大类/子类数来自静态配置
  const totalCategories = CATEGORIES.length
  const totalSubcategories = CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0)

  return (
    <MainLocale
      posts={posts}
      locale={locale}
      stats={{ totalGuides, totalCategories, totalSubcategories }}
    />
  )
}

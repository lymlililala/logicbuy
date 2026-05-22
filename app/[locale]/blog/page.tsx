import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { genPageMetadata } from '@/app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { getTranslations } from 'next-intl/server'

const POSTS_PER_PAGE = 5

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return genPageMetadata({ title: t('guides') })
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const allPosts = allCoreContent(sortPosts(allBlogs))
  // 过滤当前语言的非 draft 文章
  const posts = allPosts.filter((p) => {
    const postLocale = (p as { locale?: string }).locale || 'en'
    return postLocale === locale && !p.draft
  })

  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  const title = locale === 'zh' ? '全部指南' : 'All Guides'

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}

import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  // Generate for each locale
  const locales = ['en', 'zh']
  const params: { locale: string; page: string }[] = []

  for (const locale of locales) {
    const posts = allBlogs.filter((p) => {
      const postLocale = (p as { locale?: string }).locale || 'en'
      return postLocale === locale && !p.draft
    })
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    for (let i = 1; i <= totalPages; i++) {
      params.push({ locale, page: String(i) })
    }
  }
  return params
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; page: string }>
}) {
  const { locale, page } = await params
  const pageNumber = parseInt(page as string)

  const allPosts = allCoreContent(sortPosts(allBlogs))
  const posts = allPosts.filter((p) => {
    const postLocale = (p as { locale?: string }).locale || 'en'
    return postLocale === locale && !p.draft
  })

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (pageNumber <= 0 || pageNumber > totalPages) {
    return notFound()
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
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

import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

// 从 locale 获取 hreflang 值
const localeToHreflang: Record<string, string> = {
  en: 'en',
  zh: 'zh',
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = []
  for (const post of allBlogs) {
    const postLocale = (post as { locale?: string }).locale || 'en'
    if (!post.draft) {
      params.push({
        locale: postLocale,
        slug: post.slug.split('/').map((s) => decodeURI(s)),
      })
    }
  }
  return params
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const { locale, slug } = params
  const slugStr = decodeURI(slug.join('/'))

  // 找到对应 locale + slug 的文章
  const post = allBlogs.find((p) => {
    const postLocale = (p as { locale?: string }).locale || 'en'
    return p.slug === slugStr && postLocale === locale
  })

  if (!post) return

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)

  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => ({
    url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
  }))

  // 构造 hreflang alternates
  const alternateLocales: Record<string, string> = {}
  for (const loc of ['en', 'zh']) {
    alternateLocales[localeToHreflang[loc]] = `/${loc}/blog/${slugStr}`
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/${locale}/blog/${slugStr}`,
      languages: {
        ...alternateLocales,
        'x-default': `/en/blog/${slugStr}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}/${locale}/blog/${slugStr}`,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export default async function Page(props: { params: Promise<{ locale: string; slug: string[] }> }) {
  const params = await props.params
  const { locale, slug } = params
  const slugStr = decodeURI(slug.join('/'))

  // 取当前语言的所有文章并排序
  const allLocaleBlogs = allBlogs.filter((p) => {
    const postLocale = (p as { locale?: string }).locale || 'en'
    return postLocale === locale
  })
  const sortedCoreContents = allCoreContent(sortPosts(allLocaleBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slugStr)

  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => {
    const postLocale = (p as { locale?: string }).locale || 'en'
    return p.slug === slugStr && postLocale === locale
  }) as Blog

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }))
  // 添加 inLanguage 字段
  jsonLd['inLanguage'] = locale === 'zh' ? 'zh-CN' : 'en'

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}

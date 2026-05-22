import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from '@/app/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const title = locale === 'zh' ? '关于我们' : 'About'
  return genPageMetadata({ title })
}

export default function Page() {
  // contentlayer 生成的 slug 为 'authors/default'
  const author =
    (allAuthors.find((p) => p.slug === 'authors/default') as Authors | undefined) ??
    (allAuthors.find((p) => p.slug === 'default') as Authors | undefined) ??
    (allAuthors[0] as Authors | undefined)

  if (!author) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center text-gray-500">
        <p>Author profile not found.</p>
      </div>
    )
  }

  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}

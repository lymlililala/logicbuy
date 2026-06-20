import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import LeadMagnetCard from '@/components/guide/LeadMagnetCard'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, tags } = content
  // path is e.g. "blog/en/how-to-choose-mattress-specs"
  // Extract locale from path
  const pathParts = path.split('/')
  const locale = pathParts[1] === 'en' || pathParts[1] === 'zh' ? pathParts[1] : 'en'
  const basePath = `${locale}/blog`

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          {/* ── Article Header ── */}
          <header className="pt-6 xl:pb-6">
            <div className="space-y-4 text-center">
              {/* Tags above title */}
              {tags && (
                <div className="flex flex-wrap justify-center gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                  </time>
                </dd>
              </dl>
            </div>
          </header>

          {/* ── Main Content Grid ── */}
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            {/* ── Left sidebar: Author + Tags + Nav ── */}
            <aside className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              {/* Authors */}
              <dl>
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width={38}
                            height={38}
                            alt="avatar"
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                          <dt className="sr-only">Role</dt>
                          <dd className="text-xs text-gray-500 dark:text-gray-400">
                            {author.occupation || 'Expert Team'}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>

              {/* Sidebar: Lead Magnet Card (hidden on mobile, shown on xl) */}
              <div className="mt-8 hidden xl:block">
                <LeadMagnetCard
                  title="Get the Full Checklist (PDF)"
                  description="Free printable checklist for this guide. Enter your email and we'll send it instantly."
                  ctaText="Send Me the PDF"
                />
              </div>
            </aside>

            {/* ── Article body ── */}
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              {/* Main prose content */}
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>

              {/* Mobile Lead Magnet (shown below article on small screens) */}
              <div className="pt-6 pb-4 xl:hidden">
                <LeadMagnetCard
                  title="Get the Full Checklist (PDF)"
                  description="Free printable checklist for this guide. Enter your email and we'll send it instantly."
                  ctaText="Send Me the PDF"
                />
              </div>

              {/* Comments */}
              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>

            {/* ── Footer: Tags + Prev/Next ── */}
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {/* Prev / Next articles */}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          {locale === 'zh' ? '上一篇' : 'Previous Guide'}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          {/* prev.path = "blog/en/slug" → extract slug after locale segment */}
                          <Link
                            href={`/${locale}/blog/${prev.path.replace(/^blog\/(en|zh)\//, '').replace(/^blog\//, '')}`}
                          >
                            {prev.title}
                          </Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          {locale === 'zh' ? '下一篇' : 'Next Guide'}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link
                            href={`/${locale}/blog/${next.path.replace(/^blog\/(en|zh)\//, '').replace(/^blog\//, '')}`}
                          >
                            {next.title}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                <div className="py-4 xl:py-8">
                  <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-400 dark:bg-gray-800/40 dark:text-gray-600">
                    <strong className="text-gray-500 dark:text-gray-500">📋 Disclaimer:</strong>{' '}
                    Affiliate links on this page link to category searches, not specific products.
                    Your purchase of any item from the linked search may earn us a small commission
                    at no extra cost to you.
                  </div>
                </div>
              </div>

              {/* Back to guides */}
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to guides"
                >
                  &larr; Back to all guides
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}

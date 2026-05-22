'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_DISPLAY = 6

const CATEGORIES = [
  {
    icon: '🏠',
    title: 'Home & Living',
    description: 'Mattresses, furniture, appliances',
    tag: 'home-living',
    color: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    icon: '💻',
    title: 'Tech Specs',
    description: 'Monitors, laptops, phones, headphones',
    tag: 'tech-specs',
    color: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    icon: '🧴',
    title: 'Skincare Science',
    description: 'Ingredients, SPF, routines decoded',
    tag: 'skincare-science',
    color: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
    border: 'border-pink-200 dark:border-pink-800',
    iconBg: 'bg-pink-100 dark:bg-pink-900/40',
  },
  {
    icon: '🐾',
    title: 'Pet Nutrition',
    description: 'Cat food, dog food, vet-backed specs',
    tag: 'pet-nutrition',
    color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    border: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
  },
]

export default function Home({ posts }) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
            Smart Decisions, Zero BS. ✦
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
            Buy by{' '}
            <span className="from-primary-500 bg-gradient-to-r to-violet-500 bg-clip-text text-transparent">
              Specs
            </span>
            , Not by Brands
          </h1>
          <p className="mt-5 text-lg text-gray-500 dark:text-gray-400">
            The world's first{' '}
            <strong className="text-gray-700 dark:text-gray-200">parameter-driven</strong>,{' '}
            <strong className="text-gray-700 dark:text-gray-200">brand-bias-free</strong> consumer
            knowledge base. We decode specs so you never fall into marketing traps again.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8">
            <div className="relative mx-auto max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: Mattress, Robot Vacuum, Cat Food, Monitor..."
                className="focus:border-primary-400 focus:ring-primary-200 dark:focus:border-primary-500 dark:focus:ring-primary-900/30 w-full rounded-2xl border border-gray-200 bg-white py-4 pr-32 pl-12 text-base shadow-lg transition outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 absolute top-1/2 right-2 -translate-y-1/2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
            No ads. No affiliate bias. Pure spec knowledge.
          </p>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-10">
        <h2 className="mb-6 text-xl font-bold text-gray-700 dark:text-gray-300">
          🗂 Browse Categories
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.tag}
              href={`/tags/${cat.tag}`}
              className={`group flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-5 transition hover:shadow-md ${cat.color} ${cat.border}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${cat.iconBg}`}
              >
                {cat.icon}
              </div>
              <div>
                <div className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold text-gray-800 dark:text-gray-100">
                  {cat.title}
                </div>
                <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {cat.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest Guides ── */}
      <section className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            📖 Latest Buying Guides
          </h2>
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
          >
            View all guides →
          </Link>
        </div>

        {!posts.length && (
          <p className="text-gray-500 dark:text-gray-400">
            No guides published yet. Check back soon!
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <article
                key={slug}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Card top accent */}
                <div className="from-primary-400 h-1.5 w-full rounded-t-2xl bg-gradient-to-r to-violet-400" />
                <div className="flex flex-1 flex-col p-5">
                  {/* Tags */}
                  <div className="mb-2 flex flex-wrap gap-1">
                    {tags.slice(0, 2).map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-2 text-base leading-snug font-bold text-gray-900 dark:text-gray-100">
                    <Link href={`/blog/${slug}`}>{title}</Link>
                  </h3>

                  {/* Summary */}
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {summary}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                    <time dateTime={date} className="text-xs text-gray-400 dark:text-gray-600">
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-medium"
                      aria-label={`Read guide: "${title}"`}
                    >
                      Read guide →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Value Proposition Banner ── */}
      <section className="from-primary-500 my-10 rounded-3xl bg-gradient-to-r to-violet-500 p-8 text-center text-white shadow-lg">
        <h2 className="mb-2 text-2xl font-extrabold">How We're Different</h2>
        <p className="text-primary-100 mb-6">
          Every other review site gets paid by brands. We don't.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: '🚫', title: 'No Brand Mentions', desc: 'We talk specs, not product names.' },
            {
              icon: '📊',
              title: 'Parameter-Driven',
              desc: 'Every recommendation is backed by measurable specs.',
            },
            {
              icon: '✅',
              title: 'Interactive Checklists',
              desc: 'Use our checklists in-store or while shopping online.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/10 p-4 text-left backdrop-blur-sm"
            >
              <div className="mb-2 text-3xl">{item.icon}</div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-primary-100 mt-1 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

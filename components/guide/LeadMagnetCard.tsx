'use client'

import { useState } from 'react'

interface LeadMagnetCardProps {
  title?: string
  description?: string
  ctaText?: string
  paidVersion?: {
    label: string
    price: string
    href: string
  }
}

/**
 * Lead Magnet Card — Sidebar / bottom-of-article card to capture emails or link to paid PDF.
 * Usage in MDX or layout:
 * <LeadMagnetCard
 *   title="Get the Ultimate Mattress Buying Checklist"
 *   description="50-point checklist as PDF or Notion template — free for email subscribers."
 *   ctaText="Get Free Checklist"
 *   paidVersion={{ label: "Premium Notion Template", price: "$2.99", href: "https://gumroad.com/..." }}
 * />
 */
export default function LeadMagnetCard({
  title = 'Get the Full Buying Checklist',
  description = '50-point expert checklist as a printable PDF — completely free for email subscribers.',
  ctaText = 'Get Free Checklist',
  paidVersion,
}: LeadMagnetCardProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    // In production, wire this to your email provider (Buttondown, ConvertKit, etc.)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
  }

  return (
    <div className="not-prose border-primary-200 from-primary-50 dark:border-primary-800/50 dark:from-primary-950/40 overflow-hidden rounded-2xl border bg-gradient-to-br to-violet-50 dark:to-violet-950/40">
      <div className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            📥
          </span>
          <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">{title}</h4>
        </div>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>

        {status === 'success' ? (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
            <span>🎉</span>
            <span>Check your inbox! We sent the checklist to {email}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="focus:border-primary-400 focus:ring-primary-100 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-primary-500 hover:bg-primary-600 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-70"
            >
              {status === 'loading' ? 'Sending…' : ctaText}
            </button>
          </form>
        )}

        {status !== 'success' && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            No spam. Unsubscribe anytime.
          </p>
        )}
      </div>

      {paidVersion && (
        <div className="border-primary-100 dark:border-primary-900/30 flex items-center justify-between border-t bg-white/60 px-5 py-3 dark:bg-transparent">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Want the premium version?{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {paidVersion.label}
            </span>
          </span>
          <a
            href={paidVersion.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-500 hover:bg-primary-600 ml-3 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition"
          >
            {paidVersion.price} →
          </a>
        </div>
      )}
    </div>
  )
}

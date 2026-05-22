import { ReactNode } from 'react'

interface TLDRBoxProps {
  children: ReactNode
}

/**
 * Module A: TL;DR — One-line buying principle at the top of each guide.
 * Usage in MDX: <TLDRBox>Always look for X, never settle for Y.</TLDRBox>
 */
export default function TLDRBox({ children }: TLDRBoxProps) {
  return (
    <div className="not-prose border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20 my-6 flex items-start gap-3 rounded-2xl border p-5">
      <span className="mt-0.5 flex-shrink-0 text-2xl" aria-hidden>
        💡
      </span>
      <div>
        <p className="text-primary-500 dark:text-primary-400 mb-1 text-xs font-bold tracking-widest uppercase">
          TL;DR — The Bottom Line
        </p>
        <div className="text-base leading-relaxed font-medium text-gray-800 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

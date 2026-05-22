import { ReactNode } from 'react'

interface RedFlagItem {
  title: string
  description: string
}

interface RedFlagsProps {
  items: RedFlagItem[]
}

/**
 * Module B: Red Flags — Common pitfalls with red flag markers.
 * Usage in MDX:
 * <RedFlags items={[
 *   { title: "Suction below 2000 Pa", description: "Will struggle on carpet and miss pet hair." },
 *   { title: "No HEPA filter", description: "Just redistributes dust; bad for allergy sufferers." }
 * ]} />
 */
export default function RedFlags({ items }: RedFlagsProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="not-prose my-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          🚩
        </span>
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
          Red Flags — Common Pitfalls
        </h3>
      </div>
      <div className="divide-y divide-red-100 rounded-2xl border border-red-200 bg-red-50 dark:divide-red-900/40 dark:border-red-900/50 dark:bg-red-950/20">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 px-5 py-4">
            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" aria-hidden>
              🚩
            </span>
            <div>
              <p className="font-semibold text-red-700 dark:text-red-300">{item.title}</p>
              <p className="mt-0.5 text-sm text-red-600/80 dark:text-red-400/80">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

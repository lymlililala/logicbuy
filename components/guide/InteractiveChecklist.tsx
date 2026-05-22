'use client'

import { useState } from 'react'

interface ChecklistItem {
  id: string
  label: string
  detail?: string
  critical?: boolean
}

interface InteractiveChecklistProps {
  title?: string
  items: ChecklistItem[]
}

/**
 * Module D: Interactive Checklist — Use this in the store or while shopping online.
 * Usage in MDX:
 * <InteractiveChecklist
 *   title="Mattress Shopping Checklist"
 *   items={[
 *     { id: "firmness", label: "Check firmness options (soft/medium/firm)", critical: true },
 *     { id: "trial", label: "Confirm sleep trial ≥ 100 nights", detail: "Less than 100 nights is below industry standard.", critical: true },
 *     { id: "warranty", label: "Warranty covers sagging > 1 inch", critical: false },
 *   ]}
 * />
 */
export default function InteractiveChecklist({
  title = 'Buying Checklist',
  items,
}: InteractiveChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const checkedCount = Object.values(checked).filter(Boolean).length
  const criticalItems = items.filter((i) => i.critical)
  const criticalChecked = criticalItems.filter((i) => checked[i.id]).length
  const allCriticalDone = criticalChecked === criticalItems.length

  const resetAll = () => setChecked({})

  return (
    <div className="not-prose my-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            ✅
          </span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {checkedCount}/{items.length} done
          </span>
          {checkedCount > 0 && (
            <button
              onClick={resetAll}
              className="rounded-md px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="from-primary-400 h-full rounded-full bg-gradient-to-r to-violet-400 transition-all duration-300"
          style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex cursor-pointer items-start gap-3 px-5 py-4 transition ${
              idx < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
            } ${
              checked[item.id]
                ? 'bg-green-50/60 dark:bg-green-900/10'
                : 'bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/30'
            }`}
            onClick={() => toggle(item.id)}
            role="checkbox"
            aria-checked={!!checked[item.id]}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                toggle(item.id)
              }
            }}
          >
            {/* Checkbox */}
            <div
              className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                checked[item.id]
                  ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              aria-hidden
            >
              {checked[item.id] && (
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Label + detail */}
            <div className="flex-1 select-none">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm leading-snug font-medium ${
                    checked[item.id]
                      ? 'text-gray-400 line-through dark:text-gray-600'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {item.label}
                </span>
                {item.critical && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 uppercase dark:bg-red-900/40 dark:text-red-400">
                    Must-Have
                  </span>
                )}
              </div>
              {item.detail && (
                <p className="mt-0.5 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status message */}
      {checkedCount === items.length && items.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
          <span>🎉</span>
          <span className="font-medium">
            All boxes checked! You're ready to buy with confidence.
          </span>
        </div>
      )}
      {!allCriticalDone &&
        criticalItems.length > 0 &&
        checkedCount > 0 &&
        checkedCount < items.length && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            <span>⚠️</span>
            <span>
              Still missing {criticalItems.length - criticalChecked} critical Must-Have item
              {criticalItems.length - criticalChecked > 1 ? 's' : ''}.
            </span>
          </div>
        )}
    </div>
  )
}

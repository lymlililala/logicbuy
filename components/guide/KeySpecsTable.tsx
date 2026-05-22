interface SpecRow {
  spec: string
  whatItMeans: string
  minimumRecommended: string
  goodValue: string
  note?: string
}

interface KeySpecsTableProps {
  title?: string
  specs: SpecRow[]
}

/**
 * Module C: Key Specs — Decode the most important parameters in a scannable table.
 * Usage in MDX:
 * <KeySpecsTable
 *   title="Monitor Key Specs Decoded"
 *   specs={[
 *     { spec: "Resolution", whatItMeans: "Pixel density / sharpness", minimumRecommended: "1080p (FHD)", goodValue: "1440p (QHD)", note: "4K only worth it on 27\"+" },
 *     { spec: "Refresh Rate", whatItMeans: "Frames per second the panel can show", minimumRecommended: "60 Hz", goodValue: "144 Hz", note: "Gamers need 144+ Hz" },
 *   ]}
 * />
 */
export default function KeySpecsTable({ title = 'Key Specs Decoded', specs }: KeySpecsTableProps) {
  if (!specs || specs.length === 0) return null

  return (
    <div className="not-prose my-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          📊
        </span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                Spec
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                What It Means
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                Minimum ✓
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                Good Value ⭐
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-gray-600 md:table-cell dark:text-gray-300">
                Note
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {specs.map((row, idx) => (
              <tr
                key={idx}
                className="bg-white transition hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/40"
              >
                <td className="text-primary-600 dark:text-primary-400 px-4 py-3 font-semibold">
                  {row.spec}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.whatItMeans}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800">
                    {row.minimumRecommended}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800">
                    {row.goodValue}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-gray-400 md:table-cell dark:text-gray-500">
                  {row.note || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

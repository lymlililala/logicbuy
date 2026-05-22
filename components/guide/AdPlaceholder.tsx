interface AdPlaceholderProps {
  /** Ad slot size, e.g. "728x90" or "300x250" */
  size?: '728x90' | '300x250' | '320x50'
  /** Optional label for dev environment */
  label?: string
}

/**
 * Ad Placeholder — Insert between guide modules. Replace with Google AdSense / Mediavine
 * code when traffic is ready. In dev, shows a visual placeholder.
 *
 * Usage in MDX:
 * <AdPlaceholder size="728x90" />
 */
export default function AdPlaceholder({ size = '728x90', label }: AdPlaceholderProps) {
  const dimensions: Record<string, { w: string; h: string }> = {
    '728x90': { w: 'max-w-[728px]', h: 'h-[90px]' },
    '300x250': { w: 'max-w-[300px]', h: 'h-[250px]' },
    '320x50': { w: 'max-w-[320px]', h: 'h-[50px]' },
  }

  const dim = dimensions[size] || dimensions['728x90']

  return (
    <div className={`not-prose my-6 w-full ${dim.w}`}>
      <div
        className={`flex w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center ${dim.h} dark:border-gray-700 dark:bg-gray-900/30`}
      >
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-600">
            Advertisement ({size})
          </p>
          {label && <p className="mt-0.5 text-[10px] text-gray-300 dark:text-gray-700">{label}</p>}
        </div>
      </div>
    </div>
  )
}

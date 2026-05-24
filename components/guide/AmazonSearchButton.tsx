interface AmazonSearchButtonProps {
  /** A human-readable description shown on the button, e.g. "grain-free, high-protein cat food" */
  label: string
  /** Raw Amazon search keywords, e.g. "grain free high protein cat food" */
  keywords: string
  /** Optional: Amazon node/category ID for department filtering */
  nodeId?: string
  /** Optional: additional refinement hash params string, e.g. "p_n_feature_keywords_browse-bin:123" */
  refinements?: string
  /** Your Amazon affiliate tag */
  affiliateTag?: string
}

/**
 * Module: Amazon Search Button — Links to parameter-filtered Amazon search results.
 * NEVER links to a specific product. Always links to search results.
 *
 * Usage in MDX:
 * <AmazonSearchButton
 *   label="grain-free, high-protein cat food"
 *   keywords="grain free high protein cat food"
 *   affiliateTag="logicbuy-20"
 * />
 */
export default function AmazonSearchButton({
  label,
  keywords,
  nodeId,
  refinements,
  affiliateTag = 'logicbuy-20',
}: AmazonSearchButtonProps) {
  const params = new URLSearchParams()
  params.set('k', keywords)
  if (affiliateTag) params.set('tag', affiliateTag)
  if (nodeId) params.set('rh', `n:${nodeId}${refinements ? `,${refinements}` : ''}`)

  const href = `https://www.amazon.com/s?${params.toString()}`

  return (
    <div className="not-prose my-4">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-2.5 rounded-xl border border-[#FF9900]/30 bg-[#FFF8EC] px-5 py-3 text-sm font-semibold text-[#C45500] shadow-sm transition hover:bg-[#FF9900] hover:text-white hover:shadow-md dark:border-[#FF9900]/20 dark:bg-[#2a1f00]/30 dark:text-[#FF9900] dark:hover:bg-[#FF9900] dark:hover:text-white"
      >
        {/* Amazon logo mark */}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 flex-shrink-0 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074C15.334 16.847 15 15.9 15 15.9s-1.311 1.363-3.243 1.363c-1.6 0-3.354-.944-3.354-2.916 0-2.111 1.453-3.166 3.516-3.499 1.776-.289 4.209-.221 4.209-2.147 0-.966-.542-1.624-1.772-1.624-1.297 0-1.864.665-2.078 1.493-.044.177-.199.306-.38.306H10.54c-.222 0-.388-.209-.347-.427C10.572 6.264 12.3 5 14.5 5c2.399 0 3.889 1.189 3.889 3.375v4.547c0 .981.407 1.41.789 1.939.134.188.163.416-.007.556l-1.027.878zM20.24 18.66c-2.032 1.487-4.977 2.278-7.506 2.278-3.552 0-6.749-1.314-9.171-3.498-.19-.171-.02-.405.208-.271 2.611 1.519 5.837 2.432 9.171 2.432 2.247 0 4.717-.466 6.993-1.427.343-.147.632.225.305.486zm.87-1.02c-.261-.334-1.716-.157-2.37-.079-.197.023-.228-.148-.05-.271 1.159-.815 3.063-.581 3.285-.307.221.276-.058 2.19-1.146 3.103-.167.14-.326.066-.252-.12.245-.612.793-1.985.533-2.326z" />
        </svg>
        <span>View products matching these specs on Amazon</span>
        <span className="ml-1 text-xs opacity-70">({label})</span>
        <svg
          className="h-4 w-4 flex-shrink-0 opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
      <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-600">
        ℹ️ This links to search results, not a specific product. We earn a small commission if you
        buy — this never affects our recommendations.
      </p>
    </div>
  )
}

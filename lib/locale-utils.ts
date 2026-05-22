/**
 * Extracts the locale from a blog post.
 * Contentlayer computes this from the file path (blog/en/... → "en", blog/zh/... → "zh").
 * Falls back to 'en' if not present.
 */
export function getPostLocale(post: { locale?: string; [key: string]: unknown }): string {
  return post.locale || 'en'
}

/**
 * Filters an array of posts by locale, excluding drafts.
 */
export function filterPostsByLocale<T extends { locale?: string; draft?: boolean | null }>(
  posts: T[],
  locale: string
): T[] {
  return posts.filter((p) => getPostLocale(p) === locale && !p.draft)
}

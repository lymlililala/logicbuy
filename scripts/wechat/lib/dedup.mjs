// 合成前判重（logicbuy）—— 防生成与站内已有文章重复的选题（全自动直发护栏）。
//   ① 归一化 slug/标题精确查；② DeepSeek 近似判重（同品类 + 同角度才算重复）。
// 数据源：pitfallfree_guides（locale=en, draft=false）。无库时降级为不阻断。

import { slugify } from './slug.mjs'

function normTitle(t) {
  return (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * 判断候选选题是否与库内已有文章重复。
 * @param {object} cluster   { working_title, topic }
 * @param {Array}  existing  [{slug,title}]（fetchPublishedGuides 结果）
 * @param {object} ds        DeepSeek 实例（用于近似判重；可空 → 仅精确查）
 */
export async function isDuplicate(cluster, existing, ds) {
  if (!existing || !existing.length) return { dup: false }
  const candSlug = slugify(cluster.working_title || cluster.topic || '')
  const candNorm = normTitle(cluster.working_title || cluster.topic || '')

  for (const p of existing) {
    if (p.slug === candSlug) return { dup: true, reason: 'slug-exact', match: p.slug }
    const pn = normTitle(p.title)
    if (pn && candNorm && pn === candNorm)
      return { dup: true, reason: 'title-exact', match: p.title }
  }

  if (!ds) return { dup: false }
  const candWords = new Set(candNorm.split(' ').filter((w) => w.length > 3))
  const shortlist = existing
    .map((p) => ({
      p,
      overlap: normTitle(p.title)
        .split(' ')
        .filter((w) => candWords.has(w)).length,
    }))
    .filter((x) => x.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 30)
    .map((x) => x.p.title)
  if (!shortlist.length) return { dup: false }

  const sys =
    `You are a content de-duplication checker for a bilingual product-buying-guide site. ` +
    `Decide if a PROPOSED new article would substantially duplicate any EXISTING article ` +
    `(same product category AND same angle). A different product, or a clearly different angle ` +
    `(e.g. "buying guide" vs "common mistakes" vs "long-term experience"), is NOT a duplicate. ` +
    `Return ONLY JSON: {"duplicate":boolean,"match":"the existing title or empty","why":"short"}`
  const user =
    `PROPOSED title: ${cluster.working_title}\nPROPOSED topic: ${cluster.topic}\n\n` +
    `EXISTING titles:\n${shortlist.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
  try {
    const r = await ds.chatJSON(
      [
        { role: 'system', content: sys },
        { role: 'user', content: user },
      ],
      { maxTokens: 200 }
    )
    if (r && r.duplicate)
      return { dup: true, reason: `llm:${r.why || 'similar'}`, match: r.match || '' }
  } catch {
    // 判重失败不阻断（宁可生成、由质量闸门兜底）
  }
  return { dup: false }
}

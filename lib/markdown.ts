import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeInternalLinks, type LinkEntry } from './internalLinks'

/**
 * 将 MDX 自定义组件预处理为等价的纯 Markdown。
 * 适用于数据库中少数使用 MDX 格式的英文专属文章。
 */
function stripMdxComponents(content: string): string {
  let md = content

  // 1. <TLDRBox>…</TLDRBox> → blockquote
  md = md.replace(/<TLDRBox>([\s\S]*?)<\/TLDRBox>/g, (_, inner) => {
    const text = inner.trim().replace(/\n/g, '\n> ')
    return `> **TL;DR** — ${text}\n`
  })

  /**
   * 从 JSX prop 字符串里提取指定 key 的字符串值（处理双引号和转义）
   * e.g. title: "foo \"bar\"" → foo "bar"
   */
  const extractStringProp = (obj: string, key: string): string => {
    const re = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
    const m = obj.match(re)
    return m ? m[1].replace(/\\"/g, '"') : ''
  }

  const extractBoolProp = (obj: string, key: string): boolean => {
    const re = new RegExp(`${key}:\\s*(true|false)`)
    const m = obj.match(re)
    return m ? m[1] === 'true' : false
  }

  /** 将 [{…}, {…}] 字面量字符串拆成各对象字符串数组 */
  const splitJsxObjectArray = (raw: string): string[] => {
    const objects: string[] = []
    let depth = 0
    let start = -1
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '{') {
        if (depth === 0) start = i
        depth++
      } else if (raw[i] === '}') {
        depth--
        if (depth === 0 && start !== -1) {
          objects.push(raw.slice(start, i + 1))
          start = -1
        }
      }
    }
    return objects
  }

  // 2. <RedFlags items={[…]} /> → Markdown 警告列表
  md = md.replace(/<RedFlags\s+items=\{(\[[\s\S]*?\])\s*\}\s*\/>/g, (_, rawItems) => {
    const objs = splitJsxObjectArray(rawItems)
    const lines = objs.map((obj) => {
      const title = extractStringProp(obj, 'title')
      const description = extractStringProp(obj, 'description')
      return `- **${title}** — ${description}`
    })
    return lines.join('\n')
  })

  // 3. <KeySpecsTable … specs={[…]} /> → Markdown 表格
  md = md.replace(/<KeySpecsTable[\s\S]*?specs=\{(\[[\s\S]*?\])\s*\}\s*\/>/g, (_, rawSpecs) => {
    const objs = splitJsxObjectArray(rawSpecs)
    const header = '| Spec | What It Means | Minimum | Good Value | Note |'
    const sep = '|---|---|---|---|---|'
    const rows = objs.map((obj) => {
      const spec = extractStringProp(obj, 'spec')
      const whatItMeans = extractStringProp(obj, 'whatItMeans')
      const min = extractStringProp(obj, 'minimumRecommended')
      const good = extractStringProp(obj, 'goodValue')
      const note = extractStringProp(obj, 'note')
      return `| ${spec} | ${whatItMeans} | ${min} | ${good} | ${note} |`
    })
    return [header, sep, ...rows].join('\n')
  })

  // 4. <InteractiveChecklist … items={[…]} /> → Markdown 任务列表
  md = md.replace(
    /<InteractiveChecklist[\s\S]*?items=\{(\[[\s\S]*?\])\s*\}\s*\/>/g,
    (_, rawItems) => {
      const objs = splitJsxObjectArray(rawItems)
      return objs
        .map((obj) => {
          const label = extractStringProp(obj, 'label')
          const detail = extractStringProp(obj, 'detail')
          const critical = extractBoolProp(obj, 'critical')
          const criticalMark = critical ? ' *(Must-Have)*' : ''
          const detailText = detail ? ` — ${detail}` : ''
          return `- [ ] ${label}${criticalMark}${detailText}`
        })
        .join('\n')
    }
  )

  // 5. 删除广告/联盟/引流组件（无内容价值）
  md = md.replace(/<AdPlaceholder[\s\S]*?\/>/g, '')
  md = md.replace(/<AmazonSearchButton[\s\S]*?\/>/g, '')
  md = md.replace(/<LeadMagnetCard[\s\S]*?\/>/g, '')

  // 6. 删除其他残留的自闭合 JSX 标签（保底清理）
  md = md.replace(/<[A-Z][A-Za-z]+[\s\S]*?\/>/g, '')
  // 删除其他残留的成对 JSX 标签
  md = md.replace(/<[A-Z][A-Za-z]+[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]+>/g, '')

  return md
}

/**
 * 将 Markdown 字符串渲染为安全 HTML 字符串（服务端使用）。
 * 传入 internalLinks 时，会在正文中注入站内产品内链（结构安全的 HAST 处理）。
 */
export async function markdownToHtml(
  markdown: string,
  opts?: { internalLinks?: LinkEntry[]; locale?: string }
): Promise<string> {
  const preprocessed = stripMdxComponents(markdown)

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeInternalLinks, opts?.internalLinks || [], opts?.locale || 'en')
    .use(rehypeStringify)
    .process(preprocessed)

  // 给正文 <img> 加 loading="lazy" + decoding="async"，改善移动端 LCP / 流量
  // （正文图片基本都在首屏以下，懒加载收益明确、无副作用）
  return result.toString().replace(/<img /g, '<img loading="lazy" decoding="async" ')
}

/**
 * 从正文 Markdown 提取 FAQ 段（## FAQ / ## 常见问题 / ## Frequently Asked Questions），
 * 生成 schema.org FAQPage 结构化数据，争取精选摘要 / PAA 曝光。
 * 约定：FAQ 段内每个 `### 问题`，其后正文（到下一个 ### 或段末）为答案。
 * 无 FAQ 段或无有效问答时返回 null（不输出空 schema）。
 */
export function buildFaqJsonLd(
  markdown: string,
  locale: string,
  url: string
): Record<string, unknown> | null {
  const lines = markdown.split('\n')
  const faqHeadingRe = /^##\s+.*(FAQ|常见问题|常見問題|Frequently Asked)/i
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (faqHeadingRe.test(lines[i])) {
      start = i + 1
      break
    }
  }
  if (start === -1) return null

  // FAQ 段结束于下一个 ## 或 # 标题（FAQ 标题本身除外）
  let end = lines.length
  for (let i = start; i < lines.length; i++) {
    if (/^#{1,2}\s+/.test(lines[i]) && !faqHeadingRe.test(lines[i])) {
      end = i
      break
    }
  }

  const items: { q: string; a: string }[] = []
  let curQ: string | null = null
  let curA: string[] = []
  const flush = () => {
    if (curQ) {
      const a = curA.join(' ').replace(/\s+/g, ' ').trim()
      if (a) items.push({ q: curQ, a })
    }
    curQ = null
    curA = []
  }
  for (const ln of lines.slice(start, end)) {
    const m = ln.match(/^###\s+(.*)$/)
    if (m) {
      flush()
      curQ = m[1].trim()
    } else if (curQ) {
      curA.push(ln)
    }
  }
  flush()
  if (items.length === 0) return null

  // 答案剥离 markdown 标记，保留纯文本（schema 要求纯文本）
  const clean = (s: string) =>
    s
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*]\s+/gm, '')
      .trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    url,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: clean(it.q),
      acceptedAnswer: { '@type': 'Answer', text: clean(it.a) },
    })),
  }
}

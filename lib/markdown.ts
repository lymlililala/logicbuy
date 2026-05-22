import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

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
 * 将 Markdown 字符串渲染为安全 HTML 字符串（服务端使用）
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const preprocessed = stripMdxComponents(markdown)

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify)
    .process(preprocessed)

  return result.toString()
}

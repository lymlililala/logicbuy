// 选购文章配图 —— 按英文关键词搜图（热链 CDN），含相关性校验 + 关键词降级 + 缓存。
// 主力 Pexels（覆盖广、配额大、免署名可热链），未命中回退 Unsplash（需署名 + ping download）。
// 两家都搜不到/不相关时返回 null，由调用方决定丢弃该图占位（选购站无写死图池）。
//
// 由 chinatravel 的 lib/images.mjs 移植：去掉旅游地理过滤，停用词改为选购通用语境。
//
// 凭证从 scripts/wechat/.env 读（PEXELS_API_KEY / UNSPLASH_ACCESS_KEY），已存在的 env 优先。

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..', '..') // scripts/lib → 项目根
const CACHE_FILE = join(ROOT, 'scripts', 'content-pipeline', 'image-cache.json')

// 极简 .env 加载：scripts/wechat/.env（配图凭证所在）
function loadKeys() {
  const p = join(ROOT, 'scripts', 'wechat', '.env')
  try {
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
    }
  } catch {
    // 没有就靠 process.env
  }
}

// 英文停用词：相关性校验时忽略，只看实义词（商品主体名）是否命中。
// 含图片风格/通用词——否则 Pexels 靠 "modern/white/background" 之类重合就被误判相关，
// 必须靠真正的商品主体词（mattress / monitor / chair…）命中才算数。
const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'in',
  'at',
  'on',
  'and',
  'to',
  'with',
  'for',
  'or',
  'view',
  'photo',
  'image',
  'close',
  'closeup',
  'up',
  'macro',
  'detail',
  'shot',
  'modern',
  'new',
  'background',
  'isolated',
  'studio',
  'minimal',
  'minimalist',
  'clean',
  'style',
  'styled',
  'design',
  'top',
  'flat',
  'lay',
  'white',
  'black',
  'grey',
  'gray',
  'using',
  'use',
  'person',
  'people',
  'hand',
  'hands',
  'indoor',
  'indoors',
  'concept',
  'closeup',
  'professional',
  'beautiful',
  'set',
])

function loadCache() {
  if (!existsSync(CACHE_FILE)) return {}
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return {}
  }
}
function saveCache(c) {
  mkdirSync(dirname(CACHE_FILE), { recursive: true })
  writeFileSync(CACHE_FILE, JSON.stringify(c, null, 2))
}

function terms(s) {
  return (
    (s || '')
      .toLowerCase()
      .match(/[a-z]{3,}/g)
      ?.filter((w) => !STOPWORDS.has(w)) || []
  )
}

/** 相关性：查询里的实义词，至少有一个出现在结果描述里，才算真命中 */
function isRelevant(query, desc) {
  const qt = terms(query)
  if (!qt.length) return false
  const dt = new Set(terms(desc))
  return qt.some((w) => dt.has(w))
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── 各图源适配器：search(query) → [{ url, desc, credit?, downloadLocation? }] ──

class PexelsSource {
  constructor(key) {
    this.key = key
    this.name = 'pexels'
  }
  async search(query) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`
    const res = await fetch(url, { headers: { Authorization: this.key } })
    if (res.status === 429) throw { rateLimited: true }
    if (!res.ok) return []
    const json = await res.json()
    return (json.photos || [])
      .map((p) => ({
        url: p.src?.large || p.src?.original,
        desc: p.alt || '',
        credit: p.photographer || '',
      }))
      .filter((p) => p.url)
  }
}

class UnsplashSource {
  constructor(key) {
    this.key = key
    this.name = 'unsplash'
  }
  async search(query) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${this.key}` } })
    if (res.status === 403 || res.status === 429) throw { rateLimited: true }
    if (!res.ok) return []
    const json = await res.json()
    return (json.results || [])
      .map((p) => {
        const base = p.urls?.raw || p.urls?.regular || ''
        const url = base ? `${base}${base.includes('?') ? '&' : '?'}w=1200&q=85&fit=crop` : ''
        return {
          url,
          desc: p.description || p.alt_description || '',
          credit: p.user?.name || '',
          downloadLocation: p.links?.download_location || '',
        }
      })
      .filter((p) => p.url)
  }
}

/**
 * 统一配图客户端：Pexels 优先 → Unsplash 回退。
 * find(keyword, alt) → { url, source, credit } | null
 */
export class ImageFinder {
  constructor(opts = {}) {
    loadKeys()
    const pk = opts.pexelsKey || process.env.PEXELS_API_KEY
    const uk = opts.unsplashKey || process.env.UNSPLASH_ACCESS_KEY
    this.sources = []
    if (pk) this.sources.push(new PexelsSource(pk))
    if (uk) this.sources.push(new UnsplashSource(uk))
    this.enabled = this.sources.length > 0
    this.unsplashKey = uk || null
    this.cache = loadCache() // { "src:query": [photos] }
    this.used = new Set() // 本次运行已用图 URL（跨文章去重）
    this.disabled = new Set() // 本次运行已限频的源名（不再调）
    this.stats = { pexels: 0, unsplash: 0, miss: 0, calls: 0 }
  }

  async _search(source, query) {
    const ck = `${source.name}:${query}`
    if (this.cache[ck]) return this.cache[ck]
    let photos = []
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        this.stats.calls++
        photos = await source.search(query)
        break
      } catch (e) {
        if (e && e.rateLimited) {
          this.disabled.add(source.name)
          return []
        }
        await sleep(700 * (attempt + 1))
      }
    }
    this.cache[ck] = photos
    saveCache(this.cache)
    return photos
  }

  /** 合规：Unsplash 用图前 ping 一次 download_location（失败不影响展示） */
  async _pingDownload(loc) {
    if (!loc || !this.unsplashKey) return
    try {
      await fetch(`${loc}&client_id=${this.unsplashKey}`)
    } catch {
      /* 忽略 */
    }
  }

  /**
   * @param {string} keyword  IMG: 后的关键词（如 "robot vacuum cleaning floor"）
   * @param {string} [alt]    alt 文本，用于降级查询与相关性判断
   * @returns {Promise<{url,source,credit}|null>}
   */
  async find(keyword, alt = '') {
    if (!this.enabled) return null
    const kw = (keyword || '').trim()
    const core = terms(kw).slice(0, 2).join(' ')
    const altCore = terms(alt).slice(0, 2).join(' ')
    const queries = [...new Set([kw, core, altCore].filter((q) => q && q.length >= 3))]

    for (const source of this.sources) {
      if (this.disabled.has(source.name)) continue
      for (const q of queries) {
        const photos = await this._search(source, q)
        const pick = photos.find((p) => !this.used.has(p.url) && isRelevant(kw, p.desc))
        if (pick) {
          this.used.add(pick.url)
          this.stats[source.name]++
          if (source.name === 'unsplash') await this._pingDownload(pick.downloadLocation)
          return { url: pick.url, source: source.name, credit: pick.credit }
        }
      }
    }
    this.stats.miss++
    return null
  }
}

export default ImageFinder

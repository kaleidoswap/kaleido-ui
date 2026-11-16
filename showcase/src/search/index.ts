import { slug } from './slug'

// The search index, read from the showcase's own source so it cannot drift from
// the pages: every `<Demo title>`, `<ChartCard title>`, `<Row label>` and
// `<BlockTitle>` is a block you can search for, and the page it is rendered on
// is found by following the components each page's <Section> uses.

export interface SearchEntry {
  /** The block's `data-search-key`; empty for a page entry. */
  key: string
  title: string
  /** The page id (`#/<page>`). */
  page: string
  pageTitle: string
  /** What the block is for, searched at lower weight than its title. */
  use: string
  kind: 'page' | 'block'
}

const sources = import.meta.glob('../**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

const QUOTED = `(?:"([^"]*)"|'([^']*)')`
const ITEM_RE = new RegExp(
  `<(Demo|ChartCard)\\s+title=${QUOTED}|<Row\\s+label=${QUOTED}|<BlockTitle[^>]*>([^<{]+)</BlockTitle>`,
  'g',
)
const USE_RE = new RegExp(`\\buse=${QUOTED}`)
const SECTION_RE = /<Section\s+id="([^"]+)"\s+title="([^"]*)"/g
const DECL_RE = /^(?:export\s+)?(?:function|const)\s+([A-Z]\w*)/gm

interface Item {
  title: string
  use: string
}
interface Unit {
  text: string
  items: Item[]
}

const itemsIn = (text: string): Item[] => {
  const items: Item[] = []
  for (const match of text.matchAll(ITEM_RE)) {
    const title = (match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6] ?? '').trim()
    if (!title) continue
    let use = ''
    if (match[1]) {
      const rest = text.slice(match.index! + match[0].length)
      const end = rest.search(/<Demo\b|<ChartCard\b/)
      const useMatch = USE_RE.exec(end === -1 ? rest.slice(0, 900) : rest.slice(0, Math.min(end, 900)))
      use = useMatch?.[1] ?? useMatch?.[2] ?? ''
    }
    items.push({ title: title.replace(/&quot;/g, '"'), use })
  }
  return items
}

function buildIndex(): SearchEntry[] {
  const units = new Map<string, Unit>()
  const pages: { id: string; title: string; unit: Unit }[] = []

  for (const [path, raw] of Object.entries(sources)) {
    if (path.startsWith('../search/') || path.endsWith('ProductPreviews.tsx')) continue

    // The showcase's own page sections are the roots; everything else is a
    // component that a section (or another component) renders.
    const decls = [...raw.matchAll(DECL_RE)]
    decls.forEach((decl, i) => {
      const name = decl[1]
      const text = raw.slice(decl.index!, decls[i + 1]?.index ?? raw.length)
      if (name === 'App') {
        const sections = [...text.matchAll(SECTION_RE)]
        sections.forEach((section, j) => {
          const body = text.slice(section.index!, sections[j + 1]?.index ?? text.length)
          pages.push({ id: section[1], title: section[2], unit: { text: body, items: itemsIn(body) } })
        })
        return
      }
      units.set(name, { text, items: itemsIn(text) })
    })
  }

  const entries: SearchEntry[] = []
  const seen = new Set<string>()
  for (const page of pages) {
    entries.push({ key: '', title: page.title, page: page.id, pageTitle: page.title, use: '', kind: 'page' })
    const visited = new Set<string>()
    const collect = (unit: Unit) => {
      for (const item of unit.items) {
        const key = slug(item.title)
        const id = `${page.id}/${key}`
        if (!key || seen.has(id)) continue
        seen.add(id)
        entries.push({ key, title: item.title, page: page.id, pageTitle: page.title, use: item.use, kind: 'block' })
      }
      for (const ref of unit.text.matchAll(/<([A-Z]\w*)\b/g)) {
        const child = units.get(ref[1])
        if (child && !visited.has(ref[1])) {
          visited.add(ref[1])
          collect(child)
        }
      }
    }
    collect(page.unit)
  }
  return entries
}

export const SEARCH_INDEX: SearchEntry[] = buildIndex()

// ─── Matching ───────────────────────────────────────────────────────────────

const norm = (text: string) => text.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

/** Edit distance, bailing out once it passes `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      best = Math.min(best, row[j])
    }
    if (best > max) return max + 1
    prev = row
  }
  return prev[b.length]
}

const isSubsequence = (needle: string, hay: string) => {
  let i = 0
  for (const ch of hay) if (ch === needle[i]) i++
  return i === needle.length
}

function score(entry: SearchEntry, query: string): number {
  const title = norm(entry.title)
  const squashed = title.replace(/ /g, '')
  const q = query
  const qSquashed = q.replace(/ /g, '')
  let best = 0

  if (title === q || squashed === qSquashed) best = 100
  else if (title.startsWith(q) || squashed.startsWith(qSquashed)) best = 85
  else if (title.split(' ').some((word) => word.startsWith(q))) best = 75
  else if (title.includes(q) || squashed.includes(qSquashed)) best = 65

  if (best === 0) {
    // Close to a title word: a typo or a near spelling ("buton" → "Button").
    const words = [...title.split(' '), squashed]
    for (const word of words) {
      const max = q.length >= 7 ? 2 : q.length >= 4 ? 1 : 0
      if (max && distance(q, word.slice(0, Math.max(q.length, 1) + 1), max) <= max) best = Math.max(best, 50)
      else if (max && distance(q, word, max) <= max) best = Math.max(best, 45)
    }
    if (best === 0 && q.length >= 3 && isSubsequence(qSquashed, squashed)) best = 35
  }

  if (best === 0) {
    const use = norm(entry.use)
    if (use.includes(q)) best = 30
    else if (norm(entry.pageTitle).includes(q)) best = 25
  }
  // A page itself ranks under a block with the same match, but over weak ones.
  if (best && entry.kind === 'page') best -= 5
  return best
}

export function searchEntries(rawQuery: string, limit = 8): SearchEntry[] {
  const query = norm(rawQuery)
  if (!query) return []
  return SEARCH_INDEX.map((entry) => ({ entry, s: score(entry, query) }))
    .filter((hit) => hit.s > 0)
    .sort((a, b) => b.s - a.s || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit)
    .map((hit) => hit.entry)
}

/**
 * DESIGN.md drift lint.
 *
 * DESIGN.md is written by hand and quotes concrete token values, which means it
 * can fall out of step with `src/tokens/` silently. It did: for several releases
 * the document described `brand.primary` as `#2BEE79` on an `hsl(160 12% 8%)`
 * forest ramp, with a 9 px label at weight 800 and 0.2em tracking, while the
 * tokens had moved to `#15E99A` on a blue-slate ramp capped at weight 700 with
 * 0.18em tracking. Consumers that read the prose instead of the package pinned
 * the wrong palette, and nothing failed.
 *
 * This asserts the YAML front matter in DESIGN.md against the tokens it claims
 * to describe. `src/tokens/` is the source of truth; a mismatch means DESIGN.md
 * is the bug.
 *
 * Only mechanically checkable keys are covered — colours, the label type token
 * and the radius ladder. Prose is left to review.
 *
 * Run:  npm run check:design-doc   (also wired into pre-build via package.json)
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  colors,
  fontWeight,
  letterSpacing,
  lightSemanticColors,
  radius,
  typeScale,
} from '../src/tokens/index'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DESIGN_DOC = join(__dirname, '..', 'DESIGN.md')

/** Front matter is a flat `key: "value"` list, one per line, with # comments. */
const readFrontMatter = (): Map<string, string> => {
  const text = readFileSync(DESIGN_DOC, 'utf8')
  if (!text.startsWith('---\n')) {
    throw new Error('DESIGN.md has no YAML front matter')
  }
  const end = text.indexOf('\n---', 4)
  if (end === -1) throw new Error('DESIGN.md front matter is unterminated')
  const values = new Map<string, string>()
  for (const line of text.slice(4, end).split('\n')) {
    // `key: rest` at any indent. The value is taken before any comment is
    // stripped, because a hex colour STARTS with `#` -- splitting the line on
    // `#` first is what made an earlier version of this script report every
    // colour as missing.
    const match = /^\s*([A-Za-z0-9_.-]+):\s*(.*)$/.exec(line)
    if (!match) continue
    const [, key, rest] = match
    let value: string
    if (rest.startsWith('"')) {
      const closing = rest.indexOf('"', 1)
      if (closing === -1) continue
      value = rest.slice(1, closing)
    } else if (rest.startsWith('{')) {
      // A nested typography row; read separately by readTypographyRow.
      continue
    } else {
      // Unquoted: a trailing comment can only start at whitespace-then-hash.
      value = rest.replace(/\s+#.*$/, '').trim()
    }
    if (value !== '') values.set(key, value)
  }
  return values
}

/** `label: { family: "Satoshi", weight: 700, size: 9, tracking: 0.18em, ... }` */
const readTypographyRow = (name: string): Map<string, string> => {
  const text = readFileSync(DESIGN_DOC, 'utf8')
  const row = new RegExp(`^\\s*${name}:\\s*\\{(.*)\\}\\s*$`, 'm').exec(text)
  if (!row) throw new Error(`DESIGN.md has no typography row for "${name}"`)
  const fields = new Map<string, string>()
  for (const part of row[1].split(',')) {
    const [key, ...rest] = part.split(':')
    if (rest.length === 0) continue
    fields.set(key.trim(), rest.join(':').trim().replace(/^"|"$/g, ''))
  }
  return fields
}

const problems: string[] = []

const expect = (key: string, actual: string, documented: string | undefined) => {
  if (documented === undefined) {
    problems.push(`${key}: missing from DESIGN.md (tokens say ${actual})`)
    return
  }
  if (documented.toLowerCase() !== actual.toLowerCase()) {
    problems.push(`${key}: DESIGN.md says ${documented}, tokens say ${actual}`)
  }
}

const front = readFrontMatter()

// ── Colours ────────────────────────────────────────────────────────────────
expect('brand.primary', colors.primary, front.get('brand.primary'))
expect('brand.primary-light', lightSemanticColors.primary, front.get('brand.primary-light'))
expect('surface.bg', colors.background, front.get('surface.bg'))
expect('surface.raised', colors.muted, front.get('surface.raised'))
expect('surface.card', colors.card, front.get('surface.card'))
expect('surface.elevated', colors.accent, front.get('surface.elevated'))
expect('border.default', colors.border, front.get('border.default'))
expect('border.subtle', colors.borderToken.subtle, front.get('border.subtle'))
expect('border.strong', colors.borderToken.strong, front.get('border.strong'))
expect('text.muted', colors.mutedFg, front.get('text.muted'))
expect('destructive', colors.destructive, front.get('destructive'))
expect('success', colors.success, front.get('success'))
expect('warning', colors.warning, front.get('warning'))
expect('danger', colors.danger, front.get('danger'))
expect('info', colors.info, front.get('info'))

for (const [name, value] of Object.entries(colors.network)) {
  expect(`network.${name}`, value, front.get(`network.${name}`))
}
for (const [name, value] of Object.entries(colors.tx)) {
  expect(`tx.${name}`, value, front.get(`tx.${name}`))
}

// ── The label type token, which is the brand's typographic fingerprint ─────
const label = readTypographyRow('label')
const maxWeight = Math.max(...Object.values(fontWeight).map(Number))
const labelWeight = Number(label.get('weight'))
if (!Number.isFinite(labelWeight)) {
  problems.push('typography.label: weight is not a number')
} else if (labelWeight > maxWeight) {
  problems.push(
    `typography.label.weight: DESIGN.md asks for ${labelWeight}, but fontWeight tops out at ${maxWeight} — that spec cannot be met`,
  )
}
expect('typography.label.tracking', letterSpacing.eyebrow, label.get('tracking'))
expect('typography.label.size', typeScale.mini[0].replace('px', ''), label.get('size'))
expect('typography.label.family', 'Satoshi', label.get('family'))

// ── The radius ladder ──────────────────────────────────────────────────────
const rounded: Record<string, string> = {
  card: radius.card,
  inner: radius.xl,
  pill: radius.pill,
  panel: radius.panel,
  nav: radius.nav,
}
for (const [name, value] of Object.entries(rounded)) {
  const documented = front.get(name)
  const expected = value === '9999px' ? '999' : value.replace('px', '')
  if (documented !== expected) {
    problems.push(`rounded.${name}: DESIGN.md says ${documented ?? '(missing)'}, tokens say ${expected}`)
  }
}

if (problems.length === 0) {
  console.log('✓ check-design-doc: DESIGN.md matches src/tokens.')
  process.exit(0)
}

console.error(`✗ check-design-doc: ${problems.length} mismatch(es) between DESIGN.md and src/tokens.`)
console.error('  src/tokens is the source of truth — update DESIGN.md to match.\n')
for (const problem of problems) console.error(`    ${problem}`)
process.exit(1)

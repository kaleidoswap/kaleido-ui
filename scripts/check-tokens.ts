/**
 * Token-discipline lint.
 *
 * Fails the build when a tracked source file introduces:
 *   - raw hex colors (#aabbcc) or rgb()/rgba() literals
 *   - shadow-[...] / drop-shadow-[...] / bg-[...] / text-[...] arbitraries
 *     that encode brand color, blur or alpha
 *   - invalid Tailwind class shapes like `border-[network-arkade]/30`
 *     (the brackets make Tailwind treat the inside as a literal value
 *     instead of a token reference).
 *   - Tailwind palette classes (`text-red-400`, `bg-blue-500/10`,
 *     `border-yellow-400/20`) — those are design decisions outside our
 *     semantic tokens. Use `text-danger`, `bg-info/10`, `border-warning/20`.
 *
 * Scans `.ts`, `.tsx`, and `.css` source files. The tokens directory and
 * the generated CSS bundle are exempt — that's where literals live. The
 * showcase is intentionally excluded because it contains archive/demo
 * examples and copied static visual assets; production library source is
 * guarded under `src`.
 *
 * Run:  npm run check:tokens   (also wired into pre-build via package.json)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const SCAN_ROOTS = [join(ROOT, 'src'), join(ROOT, 'showcase/src')]

/** Files/dirs that are allowed to contain raw color values. */
const EXEMPT_PATHS = [
  'src/tokens',
  'src/css',
  // QR brand SVG — paint values for the KaleidoSwap logo.
  'src/web/components/qr-code.tsx',
  'src/native/components/qr-code.tsx',
  // Static SVG animation assets — raw paint values are part of the artwork.
  'src/web/components/kaleidoscope-hero-animation.tsx',
  'src/web/components/mobile-hero-animation.tsx',
  // Bundled protocol icon SVGs/PNGs — raw paint values are part of the artwork.
  'src/web/assets/protocol-icons.ts',
  // Generated / build artifact.
  'dist',
  // Demo/archive surfaces. Keep production library code under src token-clean.
  'showcase',
]

const FILE_EXTS = new Set(['.ts', '.tsx', '.css'])

interface Finding {
  file: string
  line: number
  rule: string
  match: string
}

const RULES: { name: string; pattern: RegExp; message: string }[] = [
  {
    name: 'raw-hex-color',
    pattern: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})\b/g,
    message: 'Use a token (text-primary, bg-network-bitcoin, colors.network.*) instead of a raw hex.',
  },
  {
    name: 'rgb-literal',
    pattern: /\brgba?\(\s*\d/g,
    message: 'Use a token CSS variable instead of a raw rgb()/rgba().',
  },
  {
    name: 'shadow-arbitrary',
    pattern: /\b(?:shadow|drop-shadow)-\[[^\]]+\]/g,
    message: 'Use a shadow token (shadow-glow-primary, shadow-popover, shadow-toast).',
  },
  {
    name: 'invalid-token-class',
    // border-[network-arkade], bg-[primary], etc. — Tailwind treats these as literal values, not token refs.
    pattern: /\b(?:bg|text|border|ring|fill|stroke|shadow|from|to|via|decoration)-\[(?:network|primary|secondary|muted|accent|background|card|foreground|popover|destructive|success|warning|danger|info)[^\]]*\]/g,
    message: 'Drop the brackets — `border-network-arkade/30`, not `border-[network-arkade]/30`.',
  },
  {
    name: 'tailwind-palette-class',
    // Bans text/bg/border/ring/from/to/via/decoration with raw Tailwind palette names (red-400, blue-500/10, etc.).
    // Allowed token names (network-arkade, primary, danger, warning…) are excluded by the negative lookahead.
    pattern:
      /\b(?:bg|text|border|ring|from|to|via|decoration|fill|stroke|outline|divide|placeholder|caret|accent|shadow)-(?:red|blue|green|yellow|amber|orange|purple|violet|fuchsia|pink|rose|sky|cyan|teal|emerald|lime|indigo|slate|gray|zinc|neutral|stone)-[0-9]{2,3}(?:\/[0-9]+)?\b/g,
    message:
      'Use a semantic token: `text-danger`, `bg-info/10`, `border-warning/20`, `text-network-arkade`, `text-muted-foreground`.',
  },
  {
    name: 'arbitrary-icon-size',
    // text-[Npx] is covered by text-icon-*; size-[Npx] is covered by size-icon-*.
    pattern: /\b(?:text|size)-\[\d+px\]/g,
    message:
      'Use an icon-size token: `text-icon-lg` for font icons, or `size-icon-lg` / `size-icon-nav` / `size-icon-control` for SVG boxes.',
  },
]

function isExempt(absPath: string): boolean {
  const rel = relative(ROOT, absPath).split('\\').join('/')
  return EXEMPT_PATHS.some((p) => rel === p || rel.startsWith(`${p}/`))
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (isExempt(full)) continue
    const stats = statSync(full)
    if (stats.isDirectory()) {
      yield* walk(full)
    } else if (FILE_EXTS.has(full.slice(full.lastIndexOf('.')))) {
      yield full
    }
  }
}

function scanFile(absPath: string): Finding[] {
  const text = readFileSync(absPath, 'utf8')
  const lines = text.split('\n')
  const out: Finding[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const rule of RULES) {
      rule.pattern.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = rule.pattern.exec(line))) {
        out.push({
          file: relative(ROOT, absPath),
          line: i + 1,
          rule: rule.name,
          match: m[0],
        })
      }
    }
  }
  return out
}

const findings: Finding[] = []
for (const root of SCAN_ROOTS) {
  for (const file of walk(root)) {
    findings.push(...scanFile(file))
  }
}

if (findings.length === 0) {
  console.log('✓ check-tokens: no banned design literals found.')
  process.exit(0)
}

const byRule = new Map<string, Finding[]>()
for (const f of findings) {
  const arr = byRule.get(f.rule) ?? []
  arr.push(f)
  byRule.set(f.rule, arr)
}

console.error(`✗ check-tokens: ${findings.length} violation(s):`)
for (const [rule, items] of byRule) {
  const message = RULES.find((r) => r.name === rule)?.message ?? ''
  console.error(`\n  [${rule}] ${message}`)
  for (const item of items.slice(0, 50)) {
    console.error(`    ${item.file}:${item.line}  ${item.match}`)
  }
  if (items.length > 50) {
    console.error(`    ... and ${items.length - 50} more`)
  }
}
process.exit(1)

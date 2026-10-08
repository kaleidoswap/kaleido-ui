import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  appSemanticDark,
  appSemanticLight,
  brandDepth,
  brandTheme,
  colors,
  lightSemanticColors,
  themedForeground,
  themedForegroundOrder,
  type ThemedForegroundToken,
} from '../src/tokens/index'
import { HaloBackdrop } from '../src/web/index'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const css = readFileSync(join(ROOT, 'src', 'css', 'kaleido-ui.css'), 'utf8')
const brandCss = readFileSync(join(ROOT, 'src', 'css', 'brand.css'), 'utf8')

// ── WCAG helpers ───────────────────────────────────────────────────────────
type Rgb = [number, number, number]
const parse = (color: string): Rgb => {
  if (color.startsWith('#')) {
    const h = color.slice(1)
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
  }
  return color.split(' ').map(Number) as Rgb
}
const luminance = (color: string) => {
  const [r, g, b] = parse(color).map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
/** `tint` of `hue` composited over `surface`, as a status pill paints it. */
const tint = (hue: string, surface: string, alpha: number) => {
  const [h, s] = [parse(hue), parse(surface)]
  return `#${h.map((v, i) => Math.round(v * alpha + s[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('')}`
}

const AA = 4.5

// Every opaque surface kaleido-ui paints text on, per theme.
const LIGHT_SURFACES = [
  lightSemanticColors.card,
  lightSemanticColors.background,
  lightSemanticColors.muted,
  lightSemanticColors.accent,
  ...(['surface-base', 'surface-raised', 'surface-overlay', 'surface-elevated'] as const).map(
    (k) => appSemanticLight[k],
  ),
]
const DARK_SURFACES = [
  colors.background,
  colors.muted,
  colors.card,
  colors.accent,
  ...(['surface-base', 'surface-raised', 'surface-overlay', 'surface-elevated'] as const).map(
    (k) => appSemanticDark[k],
  ),
]

/** The hue a status / network foreground sits on at 14% in a pill. */
const HUE: Partial<Record<ThemedForegroundToken, string>> = {
  'success-fg': colors.success,
  'warning-fg': colors.warning,
  'danger-fg': colors.danger,
  'info-fg': colors.info,
  'network-bitcoin-fg': colors.network.bitcoin,
  'network-lightning-fg': colors.network.lightning,
  'network-liquid-fg': colors.network.liquid,
  'network-arkade-fg': colors.network.arkade,
  'network-spark-fg': colors.network.spark,
  'network-rgb-fg': colors.network.rgb,
  'network-taproot-fg': colors.network.taproot,
}

test('contrast helper agrees with known WCAG values', () => {
  assert.equal(contrast('#000000', '#FFFFFF').toFixed(1), '21.0')
  // The value that started this: the brand mint on white.
  assert.equal(contrast('#15E99A', '#FFFFFF').toFixed(1), '1.6')
})

for (const theme of ['light', 'dark'] as const) {
  const surfaces = theme === 'light' ? LIGHT_SURFACES : DARK_SURFACES
  for (const token of themedForegroundOrder) {
    test(`${theme} --${token} clears AA on every ${theme} surface and on its own tint`, () => {
      const fg = themedForeground[theme][token]
      const hue = HUE[token]
      const grounds = [...surfaces, ...(hue ? surfaces.map((s) => tint(hue, s, 0.14)) : [])]
      for (const ground of grounds) {
        const ratio = contrast(fg, ground)
        assert.ok(ratio >= AA, `${token} ${fg} on ${ground} is ${ratio.toFixed(2)}:1`)
      }
    })
  }
}

test('the plain tokens are why the -fg set exists', () => {
  // Lightning and the light primary are unreadable as text on white.
  assert.ok(contrast(colors.network.lightning, '#FFFFFF') < AA)
  assert.ok(contrast(lightSemanticColors.primary, '#FFFFFF') < AA)
})

test('every per-theme foreground is emitted for both themes and mapped to a utility', () => {
  const lightBlock = css.slice(css.indexOf(':root,\n.light {'), css.indexOf('}', css.indexOf(':root,\n.light {')))
  const darkStart = css.indexOf('\n.dark {', css.indexOf('Brand layer'))
  const darkBlock = css.slice(darkStart, css.indexOf('}', darkStart))
  for (const token of themedForegroundOrder) {
    assert.ok(lightBlock.includes(`--${token}: ${themedForeground.light[token]};`), `light --${token}`)
    assert.ok(darkBlock.includes(`--${token}: ${themedForeground.dark[token]};`), `dark --${token}`)
    assert.ok(css.includes(`--color-${token}: var(--${token});`), `utility for ${token}`)
  }
  assert.ok(darkBlock.includes(`--gradient-page-brand: ${brandDepth.dark.pageWash};`))
  assert.ok(darkBlock.includes(`--brand-gradient: ${brandDepth.dark.gradient};`))
  assert.match(css, /\.text-gradient-brand \{[^}]*var\(--brand-gradient\)/)
  assert.match(css, /\.bg-page-brand \{[^}]*var\(--gradient-page-brand\)/)
})

test('the brand layer is additive: existing tokens keep their values', () => {
  assert.match(css, new RegExp(`--primary:\\s+${lightSemanticColors.primary};`))
  assert.match(css, new RegExp(`--color-danger:\\s+${colors.danger};`))
  assert.doesNotMatch(css, /--gradient-page: var\(--gradient-page-brand\)/)
})

test('the opt-in brand theme swaps in the AA primary and lifted dark status colours', () => {
  assert.match(brandCss, new RegExp(`:root:not\\(\\.dark\\),\\n\\.light \\{\\n  --primary: ${brandTheme.lightPrimary};`))
  assert.match(brandCss, /--app-primary: 9 123 78;/)
  assert.match(brandCss, new RegExp(`--color-danger: ${brandTheme.darkDanger};`))
  assert.match(brandCss, new RegExp(`--color-info: ${brandTheme.darkInfo};`))
  // White on the light primary stays readable for filled buttons.
  assert.ok(contrast('#FFFFFF', brandTheme.lightPrimary) >= AA)
})

test('HaloBackdrop renders three decorative blobs and honours animated={false}', () => {
  const markup = renderToStaticMarkup(createElement(HaloBackdrop, { animated: false, className: 'fixed' }))
  assert.match(markup, /aria-hidden="true"/)
  assert.match(markup, /data-animated="false"/)
  assert.equal(markup.match(/kui-halo-blob /g)?.length, 3)
  // className merges: `fixed` replaces the default `absolute`.
  assert.match(markup, /class="kui-halo pointer-events-none inset-0 -z-10 overflow-hidden fixed"/)
  assert.match(css, /prefers-reduced-motion: reduce\) \{\n  \.kui-halo-blob \{\n    animation: none;/)
})

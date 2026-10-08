/**
 * kaleido-ui/tailwind — the Tailwind CSS **v3** preset.
 *
 * kaleido-ui is built with Tailwind v4, whose theme lives in CSS (`@theme` in
 * `kaleido-ui/css`). A v3 consumer ignores `@theme`, and v3 only generates the
 * opacity steps in its own scale (0, 5, 10 … 100): `bg-white/8` on Input
 * produced no rule at all, and every field rendered on the browser's white.
 * This preset is the v3 counterpart of that `@theme` block, built from
 * `kaleido-ui/tokens`, so a v3 consumer gets a rule for every class the
 * components use (tests/tailwind-v3-preset.test.tsx compiles both and
 * compares them).
 *
 * Usage (tailwind.config.js):
 *
 *   module.exports = {
 *     presets: [require('kaleido-ui/tailwind')],
 *     content: ['./src/**\/*.{ts,tsx}', './node_modules/kaleido-ui/dist/web/*.js'],
 *     plugins: [require('tailwindcss-animate')],
 *   }
 *
 * and import `kaleido-ui/css` before `@tailwind base`: the colours below are
 * its custom properties, which is what lets light and dark switch at runtime.
 */
import { animation, keyframes } from '../tokens/animations'
import { appSemanticOrder } from '../tokens/app-semantic'
import { themedForegroundOrder } from '../tokens/brand'
import { colors } from '../tokens/colors'
import { layer } from '../tokens/layers'
import { radius } from '../tokens/radius'
import { shadow } from '../tokens/shadows'
import { sizing, spacingUnit } from '../tokens/sizing'
import { fontFamily, fontWeight, iconBoxSize, iconSize, letterSpacing, typeScale } from '../tokens/typography'

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * A theme custom property as a v3 colour that still takes an opacity modifier.
 * The properties hold whole colours (a hex, an `rgba(…)`), not channels, so
 * `<alpha-value>` is applied by mixing with transparent.
 */
const cssVar = (name: string) =>
  `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`

/** An `--app-*` channel triple, which takes `<alpha-value>` directly. */
const appVar = (name: string) => `rgb(var(--app-${name}) / <alpha-value>)`

const semantic = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground',
  'destructive', 'border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'series-1', 'series-2', 'series-3', 'series-4', 'series-5', 'series-6',
] as const

const semanticColors = Object.fromEntries(semantic.map((name) => [name, cssVar(name)]))

// The slate identity wins over the shadcn names for primary/secondary, as in
// the v4 `@theme inline` block.
const appColors = Object.fromEntries(appSemanticOrder.map((token) => [token, appVar(token)]))

const statusSubtle = Object.fromEntries(
  (['success', 'danger', 'warning', 'info'] as const).map((status) => [
    `status-${status}-subtle`,
    `rgb(var(--app-status-${status}) / 0.15)`,
  ]),
)

const prefixed = (prefix: string, record: Record<string, string>) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [`${prefix}-${kebab(key)}`, value]))

/**
 * Every integer step from 0 to 100. The components use `/3`, `/8`, `/12`, `/45`
 * and others that v3's default scale lacks; listing them all means a new step
 * in a component never silently produces no CSS again.
 */
const opacity = Object.fromEntries(
  Array.from({ length: 101 }, (_, step) => [String(step), String(step / 100)]),
)

/**
 * v4 derives every spacing step from `--spacing` (the unit in tokens/sizing);
 * v3 has a fixed rem scale, so the same steps are restated as multiples of the
 * unit — `p-4` is 4 units on both.
 */
const spacingSteps = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48,
  52, 56, 60, 64, 72, 80, 96,
]
const spacingScale = Object.fromEntries(
  spacingSteps.map((step) => [String(step), `calc(${spacingUnit} * ${step})`]),
)

/** v4 accepts any number for `brightness-*`; v3 needs the steps named. */
const brightness = Object.fromEntries(
  [90, 95, 100, 105, 110, 115, 120, 125, 150].map((step) => [String(step), String(step / 100)]),
)

const fontSize = {
  ...Object.fromEntries(
    Object.entries(typeScale).map(([key, [size, lineHeight]]) => [key, [size, { lineHeight }]]),
  ),
  ...Object.fromEntries(Object.entries(iconSize).map(([key, size]) => [`icon-${key}`, [size, { lineHeight: '1' }]])),
}

const preset = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ...semanticColors,
        ...appColors,
        ...statusSubtle,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
        ...prefixed('network', colors.network),
        // Chips and chip text follow the theme (the --network-*-chip/-text vars).
        ...Object.fromEntries(Object.keys(colors.networkChip).map((k) => [`network-${k}-chip`, cssVar(`network-${k}-chip`)])),
        ...Object.fromEntries(Object.keys(colors.networkText).map((k) => [`network-${k}-text`, cssVar(`network-${k}-text`)])),
        // The brand layer's per-theme AA foregrounds (text-brand, text-danger-fg, …).
        ...Object.fromEntries(themedForegroundOrder.map((token) => [token, cssVar(token)])),
        // Spark is themed (white on dark, black on light): back to its app token.
        'network-spark': appVar('network-spark'),
        ...prefixed('asset', colors.assetIcon),
        ...prefixed('tx', colors.tx),
        ...prefixed('text', colors.text),
        'surface-card': colors.surface.card,
        'surface-overlay-strong': colors.surface.overlayStrong,
        'surface-scrim': colors.surface.scrim,
        ...prefixed('scrollbar', colors.scrollbar),
      },
      borderRadius: {
        ...radius,
      },
      fontFamily: {
        sans: fontFamily.display.split(', '),
        display: fontFamily.display.split(', '),
        mono: fontFamily.mono.split(', '),
      },
      fontSize,
      fontWeight,
      letterSpacing: Object.fromEntries(Object.entries(letterSpacing).map(([k, v]) => [kebab(k), v])),
      spacing: {
        ...spacingScale,
        ...prefixed('icon', iconBoxSize),
        scrollbar: sizing.scrollbar,
        'scrollbar-hover': sizing.scrollbarHover,
        'scrollbar-thick': sizing.scrollbarThick,
        'scrollbar-thick-hover': sizing.scrollbarThickHover,
        'scrollbar-thumb-min': sizing.scrollbarThumbMin,
      },
      // Per-theme: the --kui-shadow-* vars kaleido-ui/css declares for dark and light.
      boxShadow: Object.fromEntries(Object.keys(shadow).map((key) => [kebab(key), `var(--kui-shadow-${kebab(key)})`])),
      zIndex: { ...layer },
      opacity,
      brightness,
      keyframes,
      animation,
    },
  },
}

// Default export only: the CommonJS build is then `module.exports = preset`,
// which is what `presets: [require('kaleido-ui/tailwind')]` expects.
export default preset

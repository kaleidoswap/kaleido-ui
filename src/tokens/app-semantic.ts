/**
 * KaleidoSwap App Semantic Color System (slate identity)
 *
 * The canonical, mode-switchable semantic palette shared across KaleidoSwap
 * surfaces. Values are stored as space-separated RGB channels ("R G B") so the
 * generated CSS can expose them through Tailwind utilities with full
 * `<alpha-value>` opacity support (e.g. `bg-surface-overlay`, `text-content-primary/60`,
 * `bg-status-danger/10`) that composites identically to straight rgba() alpha.
 *
 * Dark is the brand default ("dark backgrounds anchor everything"); light is a
 * fully-specified counterpart. The CSS generator emits dark under `:root, .dark`
 * and light under `.light` to match the runtime convention (a single
 * `.dark` / `.light` class is toggled on the document root).
 *
 * These channels live in the `--app-*` CSS-variable namespace so they never
 * collide with the component-facing full-color vars (`--primary`, `--card`,
 * `--background`, …) that web components consume via raw `var()` references.
 */

/** Ordered token keys → CSS-variable suffix. Drives both the `--app-*`
 *  declarations and the `@theme inline` utility mappings. */
export type AppSemanticToken =
  | 'surface-base'
  | 'surface-raised'
  | 'surface-overlay'
  | 'surface-elevated'
  | 'surface-high'
  | 'primary'
  | 'primary-emphasis'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-emphasis'
  | 'secondary-foreground'
  | 'secondary-content'
  | 'content-primary'
  | 'content-secondary'
  | 'content-tertiary'
  | 'content-inverse'
  | 'border-subtle'
  | 'border-default'
  | 'border-strong'
  | 'status-success'
  | 'status-danger'
  | 'status-warning'
  | 'status-info'
  | 'divider'

type AppSemanticChannels = Record<AppSemanticToken, string>

/** Dark mode — emitted under `:root, .dark`. */
export const appSemanticDark: AppSemanticChannels = {
  // Near-black ramp with a violet cast (~245 deg, low saturation): the
  // surfaces lean violet, the accents carry the colour — green first.
  'surface-base': '14 13 22', //  #0E0D16 — deepest bg, sidebar
  'surface-raised': '20 19 30', // #14131E — page body bg
  'surface-overlay': '28 26 42', // #1C1A2A — card bg
  'surface-elevated': '40 38 56', // #282638 — sections inside cards
  'surface-high': '54 51 74', //    #36334A — hover/active highlights
  primary: '21 233 154', //         #15E99A
  'primary-emphasis': '18 201 126', // #12C97E
  'primary-foreground': '14 13 22',
  secondary: '111 50 255', //       #6F32FF — brand violet
  'secondary-emphasis': '84 32 204', // #5420CC
  'secondary-foreground': '255 255 255',
  'secondary-content': '164 138 255', // #A48AFF — violet text/icons on dark
  'content-primary': '237 236 246', // #EDECF6 — cool white
  'content-secondary': '152 149 180', // #9895B4
  'content-tertiary': '98 95 124', // #625F7C
  'content-inverse': '14 13 22',
  'border-subtle': '38 36 54', //   #262436
  'border-default': '52 50 72', //  #343248
  'border-strong': '21 233 154',
  'status-success': '34 197 94',
  'status-danger': '248 113 113',
  'status-warning': '245 158 11',
  'status-info': '56 189 248',
  divider: '86 83 110', //          #56536E
}

/** Light mode — emitted under `.light`. */
export const appSemanticLight: AppSemanticChannels = {
  // Cards = white on a lavender page for clear depth.
  'surface-base': '226 222 244', // #E2DEF4 — sidebar/deep backgrounds
  'surface-raised': '241 238 252', // #F1EEFC — page body bg
  'surface-overlay': '255 255 255', // #FFFFFF — card bg (white)
  'surface-elevated': '248 246 255', // #F8F6FF — sections inside cards
  'surface-high': '234 229 252', // #EAE5FC — hover/active highlights
  primary: '23 181 129', //         #17B581
  'primary-emphasis': '19 138 100', // #138A64
  'primary-foreground': '255 255 255',
  secondary: '111 50 255', //       #6F32FF
  'secondary-emphasis': '84 32 204', // #5420CC
  'secondary-foreground': '255 255 255',
  'secondary-content': '84 32 204', // #5420CC — violet text/icons on light
  'content-primary': '21 18 42', //  #15122A
  'content-secondary': '79 74 117', // #4F4A75
  'content-tertiary': '122 116 160', // #7A74A0
  'content-inverse': '255 255 255',
  'border-subtle': '226 221 246', // #E2DDF6
  'border-default': '206 199 236', // #CEC7EC
  'border-strong': '23 181 129',
  'status-success': '22 163 74',
  'status-danger': '220 38 38',
  'status-warning': '217 119 6',
  'status-info': '2 132 199',
  divider: '206 199 236', //         #CEC7EC
}

/** Fixed-alpha tinted intent surfaces (e.g. `bg-status-danger-subtle`). */
export const appStatusSubtleAlpha = '0.15'

/** Token keys in the order they should be emitted. */
export const appSemanticOrder = Object.keys(appSemanticDark) as AppSemanticToken[]

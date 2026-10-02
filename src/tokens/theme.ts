/**
 * KaleidoSwap unified runtime theme (light + dark).
 *
 * A single, identically-shaped palette per mode so React Native components can
 * consume one `KaleidoTheme` object via `useKaleidoTheme()` and flip modes with
 * zero per-component conditionals. Dark is the brand default ("dark backgrounds
 * anchor everything"); light is a fully-specified counterpart.
 *
 * This file lives in `src/tokens` and is therefore exempt from the raw-color
 * lint — raw values are intentional here and ONLY here. Components must never
 * inline colors; they read them from the theme.
 */

export type ThemeMode = 'light' | 'dark'

/** Numeric type scale for React Native (the CSS `typeScale` is px strings). */
export const nativeType = {
  mini: { size: 10, line: 13 },
  xxs: { size: 11, line: 15 },
  tiny: { size: 12, line: 17 },
  caption: { size: 14, line: 20 },
  body: { size: 16, line: 24 },
  subhead: { size: 18, line: 26 },
  title: { size: 22, line: 30 },
  headline: { size: 30, line: 36 },
  display: { size: 38, line: 44 },
  hero: { size: 46, line: 52 },
} as const

export type NativeTypeLevel = keyof typeof nativeType

export interface KaleidoTheme {
  mode: ThemeMode
  /** App background (full-bleed page). */
  background: string
  /** Default card/panel surface. */
  card: string
  /** Raised card (modals, selected panels). */
  cardElevated: string
  /** Brand green — primary CTAs, success, focus ring. */
  primary: string
  /** Foreground on top of `primary`. */
  primaryFg: string
  /** Brand violet — active / protocol / selected accents. */
  violet: string
  /** Translucent violet wash for selected chips/surfaces. */
  violetSurface: string
  /** Readable violet for text/icons on the mode's surfaces (web `secondary-content`). */
  violetText: string
  /** Violet ring for selected states and icon tiles. */
  violetBorder: string
  /**
   * Faint violet light laid over card surfaces (native stand-in for the web
   * `bg-gradient-card`, since no LinearGradient dependency is assumed).
   */
  violetWash: string
  /** Glossy top-edge rim light for cards and filled buttons. */
  highlight: string
  /** Semantic intents. */
  success: string
  warning: string
  danger: string
  info: string
  /** Translucent intent washes (banners, tinted chips). */
  successSurface: string
  warningSurface: string
  dangerSurface: string
  infoSurface: string
  /** Text ladder. */
  text: {
    primary: string
    secondary: string
    muted: string
    disabled: string
    /** Text on the green primary fill (dark). */
    onAccent: string
    /** Text on saturated fills (violet / danger) — always white. */
    onFill: string
  }
  /** Border ladder. */
  border: {
    subtle: string
    default: string
    strong: string
  }
  /** Surface elevation overlays. */
  surface: {
    base: string
    raised: string
    sunken: string
    overlay: string
    scrim: string
  }
  /** Network glyph colors (consistent across modes). */
  network: {
    bitcoin: string
    lightning: string
    spark: string
    rgb: string
    arkade: string
    liquid: string
  }
  /** Network chip backgrounds (mode-specific tints). */
  networkSurface: {
    bitcoin: string
    lightning: string
    spark: string
    rgb: string
    arkade: string
    liquid: string
  }
  /** Transaction direction. */
  tx: { sent: string; receive: string; swap: string }
  /** Drop-shadow colours (RN `shadowColor`) — mirror the web shadow tokens. */
  shadow: {
    /** Resting card drop (violet-black on dark, violet-grey on light). */
    card: string
    /** Violet under-glow (selected cards, violet buttons, icon tiles). */
    violet: string
    /** Green drop for primary CTAs. */
    primary: string
  }
  /** Brand gradient as [start, end] for native LinearGradient (135°). */
  gradientBrand: readonly [string, string]
  /** Violet fill gradient as [start, end] for native LinearGradient (135°). */
  gradientViolet: readonly [string, string]
}

const NETWORK_GLYPH = {
  bitcoin: '#F7931A',
  lightning: '#F6C343',
  spark: '#FFFFFF', // white on dark; light overrides it to black
  rgb: '#DD352E',
  arkade: '#7C3AED',
  liquid: '#22E1C9',
} as const

const dark: KaleidoTheme = {
  mode: 'dark',
  // Violet-black surface ramp — identical to the web app surfaces.
  background: '#0E0D16',
  card: '#1C1A2A',
  cardElevated: '#282638',
  // Brand primary CTA green — per DESIGN.md `brand.primary`, identical to web.
  // (#15E99A is the decorative logo brandmark, kept only in gradientBrand / QR.)
  primary: '#2BEE79',
  primaryFg: '#051B10',
  violet: '#6F32FF',
  violetSurface: 'rgba(111, 50, 255, 0.18)',
  violetText: '#A48AFF',
  violetBorder: 'rgba(164, 138, 255, 0.35)',
  violetWash: 'rgba(111, 50, 255, 0.07)',
  highlight: 'rgba(255, 255, 255, 0.08)',
  success: '#2BEE79',
  warning: '#FACC15',
  danger: '#F94040',
  info: '#4290FF',
  successSurface: 'rgba(43, 238, 121, 0.14)',
  warningSurface: 'rgba(250, 204, 21, 0.14)',
  dangerSurface: 'rgba(249, 64, 64, 0.14)',
  infoSurface: 'rgba(66, 144, 255, 0.14)',
  text: {
    primary: '#EDEAF8',
    secondary: 'rgba(226, 220, 255, 0.66)',
    muted: 'rgba(226, 220, 255, 0.44)',
    disabled: 'rgba(226, 220, 255, 0.26)',
    onAccent: '#051B10', // text on brand green — DESIGN.md `text.on-primary`
    onFill: '#FFFFFF',
  },
  border: {
    subtle: 'rgba(200, 192, 240, 0.06)',
    default: 'rgba(200, 192, 240, 0.10)',
    strong: 'rgba(200, 192, 240, 0.18)',
  },
  surface: {
    base: 'rgba(200, 192, 240, 0.03)',
    raised: 'rgba(200, 192, 240, 0.06)',
    sunken: 'rgba(7, 5, 18, 0.30)',
    overlay: 'rgba(7, 5, 18, 0.60)',
    scrim: 'rgba(7, 5, 18, 0.75)',
  },
  network: NETWORK_GLYPH,
  networkSurface: {
    bitcoin: '#3A2D18',
    lightning: '#39351A',
    spark: '#2B2A35',
    rgb: '#3C2422',
    arkade: '#2E2548',
    liquid: '#0E2A2C',
  },
  tx: { sent: '#F94040', receive: '#2BEE79', swap: '#4290FF' },
  shadow: { card: '#05030F', violet: '#6F32FF', primary: '#15E99A' },
  gradientBrand: ['#15E99A', '#6F32FF'] as const,
  gradientViolet: ['#8A5CFF', '#5420CC'] as const,
}

const light: KaleidoTheme = {
  mode: 'light',
  background: '#F8F8FB', // near-white page, as on web
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  primary: '#13D88E',
  primaryFg: '#04231A',
  violet: '#6F32FF',
  violetSurface: 'rgba(111, 50, 255, 0.12)',
  violetText: '#5420CC',
  violetBorder: 'rgba(111, 50, 255, 0.30)',
  violetWash: 'rgba(111, 50, 255, 0.04)',
  highlight: 'rgba(255, 255, 255, 0.85)',
  success: '#0FB67C',
  warning: '#C8881A',
  danger: '#E2403B',
  info: '#2F73E0',
  successSurface: 'rgba(15, 182, 124, 0.12)',
  warningSurface: 'rgba(200, 136, 26, 0.12)',
  dangerSurface: 'rgba(226, 64, 59, 0.12)',
  infoSurface: 'rgba(47, 115, 224, 0.12)',
  text: {
    primary: '#15122A',
    secondary: 'rgba(21, 18, 42, 0.64)',
    muted: 'rgba(21, 18, 42, 0.46)',
    disabled: 'rgba(21, 18, 42, 0.26)',
    onAccent: '#04231A',
    onFill: '#FFFFFF',
  },
  border: {
    subtle: 'rgba(111, 50, 255, 0.10)',
    default: 'rgba(111, 50, 255, 0.16)',
    strong: 'rgba(111, 50, 255, 0.26)',
  },
  surface: {
    base: 'rgba(111, 50, 255, 0.03)',
    raised: 'rgba(111, 50, 255, 0.06)',
    sunken: 'rgba(21, 18, 42, 0.05)',
    overlay: 'rgba(21, 18, 42, 0.40)',
    scrim: 'rgba(21, 18, 42, 0.55)',
  },
  network: { ...NETWORK_GLYPH, spark: '#0D0C14' },
  networkSurface: {
    bitcoin: '#FBEFD9',
    lightning: '#FCF6D6',
    spark: '#E6E5EE',
    rgb: '#FBE3E1',
    arkade: '#ECE4FF',
    liquid: '#D8F5F1',
  },
  tx: { sent: '#E2403B', receive: '#0FB67C', swap: '#2F73E0' },
  shadow: { card: '#1C1B2E', violet: '#6F32FF', primary: '#17B581' },
  gradientBrand: ['#15E99A', '#6F32FF'] as const,
  gradientViolet: ['#8A5CFF', '#5420CC'] as const,
}

export const themes: Record<ThemeMode, KaleidoTheme> = { light, dark }

/** Resolve the full palette for a mode. */
export function makeTheme(mode: ThemeMode): KaleidoTheme {
  return themes[mode]
}

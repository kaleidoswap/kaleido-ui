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
  mini: { size: 9, line: 12 },
  xxs: { size: 10, line: 14 },
  tiny: { size: 11, line: 16 },
  caption: { size: 13, line: 18 },
  body: { size: 15, line: 22 },
  subhead: { size: 17, line: 24 },
  title: { size: 20, line: 28 },
  headline: { size: 28, line: 34 },
  display: { size: 36, line: 40 },
  hero: { size: 44, line: 48 },
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
  /** Brand gradient as [start, end] for native LinearGradient (135°). */
  gradientBrand: readonly [string, string]
}

const NETWORK_GLYPH = {
  bitcoin: '#F7931A',
  lightning: '#F6C343',
  spark: '#FF6D00',
  rgb: '#DD352E',
  arkade: '#7C3AED',
  liquid: '#22E1C9',
} as const

const dark: KaleidoTheme = {
  mode: 'dark',
  background: '#0D1813',
  card: '#121C16',
  cardElevated: '#17231C',
  primary: '#15E99A',
  primaryFg: '#062318',
  violet: '#8B5CFF',
  violetSurface: 'rgba(111, 50, 255, 0.18)',
  success: '#2BEE79',
  warning: '#FACC15',
  danger: '#F94040',
  info: '#4290FF',
  successSurface: 'rgba(43, 238, 121, 0.14)',
  warningSurface: 'rgba(250, 204, 21, 0.14)',
  dangerSurface: 'rgba(249, 64, 64, 0.14)',
  infoSurface: 'rgba(66, 144, 255, 0.14)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.64)',
    muted: 'rgba(255, 255, 255, 0.42)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    onAccent: '#062318',
    onFill: '#FFFFFF',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.10)',
    strong: 'rgba(255, 255, 255, 0.16)',
  },
  surface: {
    base: 'rgba(255, 255, 255, 0.03)',
    raised: 'rgba(255, 255, 255, 0.06)',
    sunken: 'rgba(0, 0, 0, 0.22)',
    overlay: 'rgba(0, 0, 0, 0.55)',
    scrim: 'rgba(0, 0, 0, 0.70)',
  },
  network: NETWORK_GLYPH,
  networkSurface: {
    bitcoin: '#3A2D18',
    lightning: '#39351A',
    spark: '#3A2A1C',
    rgb: '#3C2422',
    arkade: '#2E2548',
    liquid: '#0E2A2C',
  },
  tx: { sent: '#F94040', receive: '#2BEE79', swap: '#4290FF' },
  gradientBrand: ['#15E99A', '#6F32FF'] as const,
}

const light: KaleidoTheme = {
  mode: 'light',
  background: '#F4F5F2',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  primary: '#13D88E',
  primaryFg: '#04231A',
  violet: '#6F32FF',
  violetSurface: 'rgba(111, 50, 255, 0.12)',
  success: '#0FB67C',
  warning: '#C8881A',
  danger: '#E2403B',
  info: '#2F73E0',
  successSurface: 'rgba(15, 182, 124, 0.12)',
  warningSurface: 'rgba(200, 136, 26, 0.12)',
  dangerSurface: 'rgba(226, 64, 59, 0.12)',
  infoSurface: 'rgba(47, 115, 224, 0.12)',
  text: {
    primary: '#0D1813',
    secondary: 'rgba(13, 24, 19, 0.62)',
    muted: 'rgba(13, 24, 19, 0.44)',
    disabled: 'rgba(13, 24, 19, 0.26)',
    onAccent: '#04231A',
    onFill: '#FFFFFF',
  },
  border: {
    subtle: 'rgba(13, 24, 19, 0.06)',
    default: 'rgba(13, 24, 19, 0.10)',
    strong: 'rgba(13, 24, 19, 0.16)',
  },
  surface: {
    base: 'rgba(13, 24, 19, 0.02)',
    raised: 'rgba(13, 24, 19, 0.04)',
    sunken: 'rgba(13, 24, 19, 0.04)',
    overlay: 'rgba(13, 24, 19, 0.40)',
    scrim: 'rgba(13, 24, 19, 0.55)',
  },
  network: NETWORK_GLYPH,
  networkSurface: {
    bitcoin: '#FBEFD9',
    lightning: '#FCF6D6',
    spark: '#FFE7D6',
    rgb: '#FBE3E1',
    arkade: '#ECE4FF',
    liquid: '#D8F5F1',
  },
  tx: { sent: '#E2403B', receive: '#0FB67C', swap: '#2F73E0' },
  gradientBrand: ['#15E99A', '#6F32FF'] as const,
}

export const themes: Record<ThemeMode, KaleidoTheme> = { light, dark }

/** Resolve the full palette for a mode. */
export function makeTheme(mode: ThemeMode): KaleidoTheme {
  return themes[mode]
}

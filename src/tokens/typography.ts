/**
 * KaleidoSwap Typography Tokens
 */

export const fontFamily = {
  display: "'Satoshi', system-ui, -apple-system, sans-serif",
  mono: "'Geist Mono', monospace",
} as const

/**
 * Type scale — [fontSize, lineHeight]
 */
export const typeScale = {
  mini: ['10px', '13px'],
  xxs: ['11px', '15px'],
  tiny: ['12px', '17px'],
  caption: ['14px', '20px'],
  body: ['16px', '24px'],
  subhead: ['18px', '26px'],
  title: ['22px', '30px'],
  headline: ['30px', '36px'],
  display: ['38px', '44px'],
} as const

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

/**
 * Letter-spacing tokens — reused across uppercase eyebrow labels.
 * These replace the scattered `tracking-[0.18em]` / `tracking-[0.22em]` arbitraries.
 */
export const letterSpacing = {
  eyebrow: '0.18em',
  eyebrowWide: '0.22em',
} as const

/**
 * Icon size scale — drives `text-icon-*` utilities. The SVG `Icon` is 1em
 * square, so a font size is its size. Exists as its own scale (separate from
 * the body type scale) because icon sizes change in tighter steps.
 *
 * Usage: <Icon name="check" className="text-icon-md" />
 */
export const iconSize = {
  xxs: '11px', // dense inline status / timestamp icons
  xs: '13px',
  sm: '14px',
  md: '16px', // default
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '64px', // hero / success / error glyphs
} as const

/**
 * Square icon box scale — drives `size-icon-*` utilities for SVG icons
 * and compact icon buttons.
 */
export const iconBoxSize = {
  sm: '14px',
  md: '16px',
  lg: '18px',
  nav: '1.6875rem', // 27px — bottom-nav icons; rem so side-panel font scaling applies
  control: '34px',
} as const

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
  xxs: ['10px', '14px'],
  tiny: ['11px', '16px'],
  caption: ['13px', '18px'],
  body: ['15px', '22px'],
  subhead: ['17px', '24px'],
  title: ['20px', '28px'],
  headline: ['28px', '34px'],
  display: ['36px', '40px'],
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

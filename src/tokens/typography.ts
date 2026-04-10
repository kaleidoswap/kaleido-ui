/**
 * KaleidoSwap Typography Tokens
 */

export const fontFamily = {
  display: "'Geist Sans', system-ui, -apple-system, sans-serif",
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

/**
 * KaleidoSwap Color Tokens
 *
 * Single source of truth for all color constants across web and native.
 */
const darkSemanticColors = {
  background: '#0a0a0a',
  foreground: '#fafafa',
  border: '#ffffff1a',
  input: '#ffffff26',
  destructive: '#ff6467',
  secondary: '#262626',
  secondaryFg: '#fafafa',
  muted: '#262626',
  mutedFg: '#a1a1a1',
  primary: '#e5e5e5',
  primaryFg: '#171717',
  accent: '#262626',
  accentFg: '#fafafa',
  ring: '#737373',
  card: '#171717',
  cardFg: '#fafafa',
  popover: '#171717',
  popoverFg: '#fafafa',
  chart1: '#1447e6',
  chart2: '#00bc7d',
  chart3: '#fe9a00',
  chart4: '#ad46ff',
  chart5: '#ff2056',
  semanticBackground: '#272625',
  semanticBorder: '#535151',
} as const

export const colors = {
  ...darkSemanticColors,
  textPrimary: darkSemanticColors.foreground,
  textSecondary: darkSemanticColors.mutedFg,
  textMuted: darkSemanticColors.border,
  textDimmed: darkSemanticColors.ring,

  /** Semantic */
  success: darkSemanticColors.primary,
  warning: darkSemanticColors.chart3,
  error: darkSemanticColors.destructive,
  info: darkSemanticColors.chart1,

  /** Network / Layer */
  network: {
    bitcoin: '#F7931A',
    rgb: '#DD352E',
    arkade: '#7C3AED',
    spark: '#FF6D00',
    lightning: '#F6C343',
  },

  /** Transaction direction */
  tx: {
    sent: '#F94040',
    receive: '#2BEE79',
    swap: '#4290FF',
  },
} as const

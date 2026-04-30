/**
 * KaleidoSwap Color Tokens
 *
 * Single source of truth for all color constants across web and native.
 */
export const lightSemanticColors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  card: '#ffffff',
  cardFg: '#0a0a0a',
  popover: '#ffffff',
  popoverFg: '#0a0a0a',
  primary: '#171717',
  primaryFg: '#fafafa',
  secondary: '#f5f5f5',
  secondaryFg: '#171717',
  muted: '#f5f5f5',
  mutedFg: '#737373',
  accent: '#f5f5f5',
  accentFg: '#171717',
  destructive: '#e7000b',
  border: '#e5e5e5',
  input: '#e5e5e5',
  ring: '#a1a1a1',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#7C3AED',
  chart5: '#DD352E',
} as const

const darkSemanticColors = {
  background: 'hsl(158 58% 7%)',
  foreground: '#ffffff',
  border: 'hsl(150 20% 24%)',
  input: 'rgba(255, 255, 255, 0.15)',
  destructive: 'hsl(0 62% 50%)',
  secondary: 'hsl(154 26% 17%)',
  secondaryFg: '#ffffff',
  muted: 'hsl(156 32% 12%)',
  mutedFg: 'rgba(255, 255, 255, 0.55)',
  primary: '#2BEE79',
  primaryFg: '#051B10',
  accent: 'hsl(154 26% 17%)',
  accentFg: '#ffffff',
  ring: '#2BEE79',
  card: 'hsl(156 32% 12%)',
  cardFg: '#ffffff',
  popover: 'hsl(154 26% 17%)',
  popoverFg: '#ffffff',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#7C3AED',
  chart5: '#DD352E',
  semanticBackground: 'hsl(156 32% 12%)',
  semanticBorder: 'hsl(150 20% 24%)',
} as const

export const colors = {
  ...darkSemanticColors,
  textPrimary: darkSemanticColors.foreground,
  textSecondary: darkSemanticColors.mutedFg,
  textMuted: darkSemanticColors.border,
  textDimmed: darkSemanticColors.ring,

  /** Semantic intent colors (use as text-success, bg-warning/15, etc.) */
  success: darkSemanticColors.primary,
  warning: '#FACC15',
  danger: '#F94040',
  info: '#4290FF',
  /** @deprecated alias for `danger` — kept for back-compat. */
  error: darkSemanticColors.destructive,

  /** Surface elevation — translucent overlays applied over the page background */
  surface: {
    base: 'rgba(255, 255, 255, 0.03)',
    card: 'rgba(255, 255, 255, 0.05)',
    elevated: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.20)',
    overlayStrong: 'rgba(0, 0, 0, 0.35)',
    scrim: 'rgba(0, 0, 0, 0.60)',
  },

  /** Border ladder — translucent edges on dark surfaces */
  borderToken: {
    subtle: 'rgba(255, 255, 255, 0.04)',
    default: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },

  /** Text ladder for dark surfaces */
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.65)',
    muted: 'rgba(255, 255, 255, 0.45)',
    dimmed: 'rgba(255, 255, 255, 0.35)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    onAccent: '#051B10',
  },

  /** Network / Layer */
  network: {
    bitcoin: '#F7931A',
    rgb: '#DD352E',
    arkade: '#7C3AED',
    spark: '#FF6D00',
    lightning: '#F6C343',
  },
  networkChip: {
    bitcoin: '#A65D0D',
    rgb: '#7F2623',
    arkade: '#43208B',
    spark: '#314238',
    lightning: '#53611E',
  },

  /** Asset icon brand colors — used as solid backgrounds behind glyphs */
  assetIcon: {
    eth: '#627EEA',
    usdt: '#26A17B',
    usdc: '#2775CA',
  },

  /** Transaction direction */
  tx: {
    sent: '#F94040',
    receive: '#2BEE79',
    swap: '#4290FF',
  },
} as const

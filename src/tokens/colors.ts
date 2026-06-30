/**
 * KaleidoSwap Color Tokens
 *
 * Single source of truth for all color constants across web and native.
 */
// Slate identity (see src/tokens/app-semantic.ts). These shadcn-style semantic
// anchors back the component-facing full-color vars (--background, --card,
// --primary, …) consumed via raw var() and the bg-card / bg-background /
// text-foreground utilities NOT overridden by the channel-backed app tokens.
export const lightSemanticColors = {
  background: '#EAECF8', // surface-raised (light page body)
  foreground: '#12131E', // content-primary
  card: '#FFFFFF', //       surface-overlay
  cardFg: '#12131E',
  popover: '#FFFFFF',
  popoverFg: '#12131E',
  primary: '#17B581', //    brand green (light)
  primaryFg: '#FFFFFF',
  secondary: '#E4E6F6', //  neutral surface (bg-secondary utility is brand violet via app token)
  secondaryFg: '#12131E',
  muted: '#F6F7FD', //      surface-elevated
  mutedFg: '#464A69', //    content-secondary
  accent: '#E4E6F6', //     surface-high
  accentFg: '#12131E',
  destructive: '#e7000b',
  border: '#C8CBE0', //     border-default
  input: '#C8CBE0',
  ring: '#17B581',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#7C3AED',
  chart5: '#DD352E',
} as const

const darkSemanticColors = {
  background: '#12131C', // surface-base (deepest)
  foreground: '#E8E9F2', // content-primary (cool white)
  border: 'rgba(255, 255, 255, 0.10)',
  input: 'rgba(255, 255, 255, 0.15)',
  destructive: 'hsl(0 62% 50%)',
  secondary: '#16273F', // neutral surface (bg-secondary utility is brand violet via app token)
  secondaryFg: '#E8E9F2',
  muted: '#181924', //     surface-raised
  mutedFg: 'rgba(255, 255, 255, 0.55)',
  primary: '#15E99A', //   brand green (dark)
  primaryFg: '#12131C',
  accent: '#323448', //    surface-elevated
  accentFg: '#E8E9F2',
  ring: '#15E99A',
  card: '#242638', //      surface-overlay (card)
  cardFg: '#E8E9F2',
  popover: '#242638',
  popoverFg: '#E8E9F2',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#7C3AED',
  chart5: '#DD352E',
  semanticBackground: '#242638',
  semanticBorder: 'rgba(255, 255, 255, 0.10)',
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

  /** Scrollbar treatment for app-owned scroll regions */
  scrollbar: {
    thumb: 'rgba(255, 255, 255, 0.16)',
    thumbHover: 'rgba(43, 238, 121, 0.55)',
    track: 'transparent',
  },

  /** Network / Layer */
  network: {
    bitcoin: '#F7931A',
    rgb: '#DD352E',
    arkade: '#7C3AED',
    spark: '#FF6D00',
    lightning: '#F6C343',
    liquid: '#22e1c9',
    taproot: '#D1D6D8',
  },
  networkChip: {
    bitcoin: '#44341F',
    rgb: '#44282B',
    arkade: '#362B55',
    spark: '#284338',
    lightning: '#3D421F',
    liquid: '#0D2A2E',
    taproot: '#1E2328',
  },
  networkText: {
    bitcoin: '#F2B063',
    rgb: '#E87872',
    arkade: '#A98CF2',
    spark: '#D6E5DE',
    lightning: '#E4D56F',
    liquid: '#5DE5D6',
    taproot: '#C4CACD',
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

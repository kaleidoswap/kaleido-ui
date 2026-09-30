/**
 * KaleidoSwap Color Tokens
 *
 * Single source of truth for all color constants across web and native.
 */
// Slate identity (see src/tokens/app-semantic.ts). These shadcn-style semantic
// anchors back the component-facing full-color vars (--background, --card,
// --primary, …) consumed via raw var() and the bg-card / bg-background /
// text-foreground utilities NOT overridden by the channel-backed app tokens.
/** Brand scales — the two KaleidoSwap accents (brand book). */
export const brand = {
  green: {
    50: '#E8FDF4',
    100: '#B0F6DA',
    200: '#6EEDC0',
    400: '#15E99A', // primary
    600: '#17B581', // brand anchor
    800: '#0D7A58',
    900: '#053D2C',
  },
  violet: {
    50: '#EDE8FF',
    100: '#C9BAFF',
    200: '#A48AFF',
    400: '#6F32FF', // primary
    600: '#5420CC',
    800: '#371488',
    900: '#1C0A45',
  },
} as const

export const lightSemanticColors = {
  background: '#F1EEFC', // surface-raised (light page body, lavender)
  foreground: '#15122A', // content-primary
  card: '#FFFFFF', //       surface-overlay
  cardFg: '#15122A',
  popover: '#FFFFFF',
  popoverFg: '#15122A',
  primary: '#17B581', //    brand green (light)
  primaryFg: '#FFFFFF',
  secondary: '#EAE5FC', //  neutral surface (bg-secondary utility is brand violet via app token)
  secondaryFg: '#15122A',
  muted: '#F8F6FF', //      surface-elevated
  mutedFg: '#4F4A75', //    content-secondary
  accent: '#EAE5FC', //     surface-high
  accentFg: '#15122A',
  destructive: '#e7000b',
  border: '#D6CFF2', //     border-default (violet-tinted)
  input: '#CEC7EC',
  ring: '#17B581',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#6F32FF',
  chart5: '#DD352E',
} as const

const darkSemanticColors = {
  background: '#0E0D16', // surface-base (deepest, near-black with a violet cast)
  foreground: '#EDECF6', // content-primary (cool white)
  border: 'rgba(200, 192, 240, 0.11)', // lavender hairline
  input: 'rgba(200, 192, 240, 0.16)',
  destructive: 'hsl(0 62% 50%)',
  secondary: '#282638', // neutral surface (bg-secondary utility is brand violet via app token)
  secondaryFg: '#EDECF6',
  muted: '#14131E', //     surface-raised
  mutedFg: 'rgba(232, 230, 245, 0.58)',
  primary: '#15E99A', //   brand green (dark)
  primaryFg: '#0E0D16',
  accent: '#282638', //    surface-elevated
  accentFg: '#EDECF6',
  ring: '#15E99A',
  card: '#1C1A2A', //      surface-overlay (card)
  cardFg: '#EDECF6',
  popover: '#211F31',
  popoverFg: '#EDECF6',
  chart1: '#2BEE79',
  chart2: '#F6C343',
  chart3: '#F7931A',
  chart4: '#8B5CF6',
  chart5: '#DD352E',
  semanticBackground: '#1C1A2A',
  semanticBorder: 'rgba(200, 192, 240, 0.11)',
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
    subtle: 'rgba(200, 192, 240, 0.05)',
    default: 'rgba(200, 192, 240, 0.09)',
    strong: 'rgba(200, 192, 240, 0.18)',
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
    thumbHover: 'rgba(21, 233, 154, 0.55)',
    track: 'transparent',
  },

  /** External bridge chains — third-party brand colors for network tags.
   * Keyed by the lowercase chain id the bridge API uses. */
  bridgeChain: {
    ethereum: '#627EEA',
    base: '#0052FF',
    arbitrum: '#28A0F0',
    optimism: '#FF0420',
    polygon: '#8247E5',
    solana: '#9945FF',
    tron: '#FF4B4B',
    bitcoin: '#F7931A',
    lightning: '#F6C343',
    spark: '#FF6D00',
    avalanche: '#E84142',
    bsc: '#F0B90B',
    litecoin: '#4A7BD4',
    ton: '#0098EA',
    monad: '#836EF9',
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
    spark: '#463020',
    lightning: '#3D421F',
    liquid: '#0D2A2E',
    taproot: '#1E2328',
  },
  networkText: {
    bitcoin: '#F2B063',
    rgb: '#E87872',
    arkade: '#A98CF2',
    spark: '#F2A163',
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

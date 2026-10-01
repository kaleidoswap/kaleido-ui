/**
 * KaleidoSwap Brand Tokens
 *
 * Everything the apps used to add on top of kaleido-ui to look like
 * KaleidoSwap: the logo's paint, per-theme foregrounds that stay readable,
 * the coloured page wash, the brand gradient, the accent glows and the halo
 * backdrop. All of it is additive: no existing token changes value.
 *
 * Per-theme values follow the same convention as the shadcn-style tokens in
 * colors.ts: light is the `:root` default (also forced by `.light`), dark
 * applies under `.dark`.
 */
import { colors } from './colors'

/**
 * The logo's three fills. Decorative paint, never text: the mint is 1.6:1 on
 * white. Use `brandForeground` for a brand-coloured foreground.
 */
export const brandMark = {
  violet: '#6F32FF',
  green: '#17B581',
  mint: '#15E99A',
} as const

/** Keys of the per-theme foreground set, in emit order. */
export type ThemedForegroundToken =
  | 'brand'
  | 'accent-send-fg'
  | 'accent-recv-fg'
  | 'success-fg'
  | 'warning-fg'
  | 'danger-fg'
  | 'info-fg'
  | 'network-bitcoin-fg'
  | 'network-lightning-fg'
  | 'network-liquid-fg'
  | 'network-arkade-fg'
  | 'network-spark-fg'
  | 'network-rgb-fg'
  | 'network-taproot-fg'

type ThemedForegrounds = Record<ThemedForegroundToken, string>

/**
 * Foreground colours that clear WCAG AA (4.5:1) on every kaleido-ui surface
 * of their theme, and (for status and network hues) on a 14% tint of their
 * own hue, which is what a status pill sits on. tests/brand-tokens.test.tsx
 * measures every pair.
 *
 * The plain tokens (`text-primary`, `text-danger`, `text-network-lightning`)
 * are dark-theme values: lightning #F6C343 is 1.6:1 on white, and the light
 * primary #17B581 is 2.1 to 2.6:1 on the light ramp. Use these for TEXT and
 * glyphs; keep the plain tokens for fills and borders.
 */
export const themedForeground: { light: ThemedForegrounds; dark: ThemedForegrounds } = {
  light: {
    // Brand green darkened in the mint's own hue until it reads on white.
    brand: '#086E46',
    'accent-send-fg': '#6428F0',
    'accent-recv-fg': '#086E46',
    'success-fg': '#076A43', // a shade under brand: it also sits on a 14% mint tint
    // Tailwind -800 shades: -700 measured only 3.7 to 4.3:1 on the light ramp.
    'warning-fg': '#92400E',
    'danger-fg': '#991B1B',
    'info-fg': '#1E40AF',
    'network-bitcoin-fg': '#92400E',
    'network-lightning-fg': '#854D0E',
    'network-liquid-fg': '#115E59',
    'network-arkade-fg': '#5B21B6',
    'network-spark-fg': '#9A3412',
    'network-rgb-fg': '#991B1B',
    'network-taproot-fg': '#464A69',
  },
  dark: {
    brand: colors.primary,
    'accent-send-fg': '#AD94FB',
    'accent-recv-fg': colors.primary,
    'success-fg': colors.success,
    'warning-fg': colors.warning,
    // danger #F94040 and info #4290FF are 3.0:1 and 3.2:1 on the elevated
    // surface. Same hues, lifted until they clear 4.5:1.
    'danger-fg': '#FF9999',
    'info-fg': '#8BBDFF',
    'network-bitcoin-fg': colors.networkText.bitcoin,
    'network-lightning-fg': colors.networkText.lightning,
    'network-liquid-fg': colors.networkText.liquid,
    // The rgb and arkade *-text tokens dip under 4.5:1 on the elevated
    // surface (3.9 and 4.1), so their -fg twins are lifted a step.
    'network-arkade-fg': '#B49CF5',
    'network-spark-fg': colors.networkText.spark,
    'network-rgb-fg': '#F09490',
    'network-taproot-fg': colors.networkText.taproot,
  },
}

/** Emit order for the per-theme foregrounds. */
export const themedForegroundOrder = Object.keys(themedForeground.light) as ThemedForegroundToken[]

/**
 * Per-theme brand depth: the coloured page wash, the brand gradient (for
 * large display text) and the accent glows for send / receive panels and the
 * hero card. Emitted as raw custom properties (`--gradient-page-brand`,
 * `--brand-gradient`, `--glow-send`, …) and surfaced as `bg-page-brand`,
 * `text-gradient-brand`, `shadow-glow-send`, `shadow-glow-recv` and
 * `shadow-glow-card`.
 */
export const brandDepth = {
  light: {
    /** The same wash as the dark one, as soft tints on the lavender page. */
    pageWash:
      'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(21, 233, 154, 0.16) 0%, transparent 70%), radial-gradient(ellipse 50% 32% at 0% 68%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
    /** Darker stops, each 4.5:1 or better on the light page. */
    gradient: 'linear-gradient(90deg, #086E46 0%, #0369A1 55%, #6D28D9 100%)',
    glowSend: '0 0 0 1px rgba(100, 40, 240, 0.22), 0 12px 32px -14px rgba(100, 40, 240, 0.4)',
    glowRecv: '0 0 0 1px rgba(8, 110, 70, 0.2), 0 12px 32px -14px rgba(8, 110, 70, 0.35)',
    glowCard: '0 0 0 1px rgba(20, 20, 60, 0.06), 0 30px 80px -40px rgba(100, 40, 240, 0.28)',
  },
  dark: {
    /** Mint from the top, violet from the lower left, a little sky on the right. */
    pageWash:
      'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(21, 233, 154, 0.13) 0%, transparent 70%), radial-gradient(ellipse 50% 32% at 0% 68%, rgba(124, 58, 237, 0.16) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 100% 50%, rgba(56, 189, 248, 0.07) 0%, transparent 70%)',
    /** Large text only: each stop clears 3:1 on the dark base. */
    gradient: 'linear-gradient(90deg, #15E99A 0%, #38BDF8 55%, #A78BFA 100%)',
    glowSend: '0 0 0 1px rgba(167, 139, 250, 0.28), 0 12px 40px -12px rgba(124, 58, 237, 0.55)',
    glowRecv: '0 0 0 1px rgba(21, 233, 154, 0.22), 0 12px 40px -12px rgba(21, 233, 154, 0.35)',
    glowCard:
      '0 0 0 1px rgba(255, 255, 255, 0.05), 0 40px 100px -40px rgba(124, 58, 237, 0.35), 0 -20px 80px -50px rgba(21, 233, 154, 0.3)',
  },
} as const

/** Shadow utility names backed by `brandDepth` (`shadow-glow-send`, …). */
export const brandGlowShadows = ['glow-send', 'glow-recv', 'glow-card'] as const

/**
 * The halo backdrop: three large, heavily blurred blobs that drift slowly
 * behind a screen (the extension dashboard's "lava lamp"). Rendered by the
 * `HaloBackdrop` component; colours are overridable through
 * `--halo-primary` / `--halo-secondary`.
 */
export const halo = {
  primary: colors.tx.receive,
  secondary: brandMark.violet,
  blur: '110px',
} as const

/**
 * The opt-in brand theme (`kaleido-ui/css/brand`). These change the look of
 * existing tokens, so they only apply when an app imports that stylesheet.
 */
export const brandTheme = {
  /** AA-safe light primary: white on it is 6.3:1, it is 5.1:1 on the light ramp. */
  lightPrimary: themedForeground.light.brand,
  /** Lifted dark status colours (see `themedForeground.dark`). */
  darkDanger: themedForeground.dark['danger-fg'],
  darkInfo: themedForeground.dark['info-fg'],
} as const

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
    // Brand green in the mint's own hue, as light as it goes and still
    // clears 4.5:1 on every light surface (4.63:1 on #EFEFF4).
    brand: '#097B4E',
    'accent-send-fg': '#6428F0',
    'accent-recv-fg': '#097B4E',
    'success-fg': '#076A43', // a shade under brand: it also sits on a 14% mint tint
    // Tailwind -800 shades: -700 measured only 3.7 to 4.3:1 on the light ramp.
    'warning-fg': '#92400E',
    'danger-fg': '#991B1B',
    'info-fg': '#1E40AF',
    'network-bitcoin-fg': '#92400E',
    'network-lightning-fg': '#854D0E',
    'network-liquid-fg': '#115E59',
    'network-arkade-fg': '#5B21B6',
    'network-spark-fg': '#0D0C14', // Spark is black on light
    'network-rgb-fg': '#991B1B',
    'network-taproot-fg': '#464A69',
  },
  dark: {
    brand: colors.primary,
    'accent-send-fg': '#AD94FB',
    'accent-recv-fg': colors.primary,
    'success-fg': colors.success,
    'warning-fg': colors.warning,
    // danger #E53535 and info #4290FF are 3.0:1 and 3.2:1 on the elevated
    // surface. Same hues, lifted until they clear 4.5:1.
    'danger-fg': '#FF9999',
    'info-fg': '#8BBDFF',
    'network-bitcoin-fg': colors.networkText.bitcoin,
    'network-lightning-fg': colors.networkText.lightning,
    'network-liquid-fg': colors.networkText.liquid,
    // The rgb and arkade *-text tokens dip under 4.5:1 on the elevated
    // surface (3.9 and 4.1), so their -fg twins are lifted a step.
    'network-arkade-fg': '#B49CF5',
    'network-spark-fg': colors.network.spark, // and white on dark
    'network-rgb-fg': '#F09490',
    'network-taproot-fg': colors.networkText.taproot,
  },
}

/** Emit order for the per-theme foregrounds. */
export const themedForegroundOrder = Object.keys(themedForeground.light) as ThemedForegroundToken[]

/**
 * Per-theme brand depth: the coloured page wash and the brand gradient (for
 * large display text). Emitted as raw custom properties
 * (`--gradient-page-brand`, `--brand-gradient`) and surfaced as `bg-page-brand`
 * and `text-gradient-brand`.
 */
export const brandDepth = {
  light: {
    /** The same wash as the dark one, as soft tints on the near-white page. */
    pageWash:
      'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(21, 233, 154, 0.16) 0%, transparent 70%), radial-gradient(ellipse 50% 32% at 0% 68%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
    /**
     * Darker stops, each the lightest of its hue that clears 3:1 on every
     * light surface: the gradient is for headline and display type, which
     * WCAG measures as large text.
     */
    gradient: 'linear-gradient(90deg, #0B9B63 0%, #048EDA 55%, #9D6FE6 100%)',
  },
  dark: {
    /** Mint from the top, violet from the lower left, a little sky on the right. */
    pageWash:
      'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(21, 233, 154, 0.13) 0%, transparent 70%), radial-gradient(ellipse 50% 32% at 0% 68%, rgba(124, 58, 237, 0.16) 0%, transparent 70%), radial-gradient(ellipse 45% 40% at 100% 50%, rgba(56, 189, 248, 0.07) 0%, transparent 70%)',
    /** Large text only: each stop clears 3:1 on the dark base. */
    gradient: 'linear-gradient(90deg, #15E99A 0%, #38BDF8 55%, #A78BFA 100%)',
  },
} as const

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

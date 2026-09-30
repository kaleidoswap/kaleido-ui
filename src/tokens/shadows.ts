/**
 * KaleidoSwap Shadow Tokens
 *
 * Elevation is violet-tinted: every drop shadow is cast in `--app-shadow`
 * (a near-black violet) scaled by `--app-shadow-strength`, both declared by
 * kaleido-ui/css per theme — full strength on dark, a quarter on light — so
 * one token reads right in either mode. Glows are the two brand accents.
 * The CSS-variable tokens (card, cardHover, raised) are web-only; header,
 * popover and toast stay plain values because React Native re-exports them.
 */
const ink = (alpha: number) => `rgb(var(--app-shadow) / calc(${alpha} * var(--app-shadow-strength)))`
const rim = 'inset 0 1px 0 0 rgb(255 255 255 / var(--app-rim-alpha))'
/** Glass edge: a 1px translucent hairline all round, how a pane of glass catches light. */
const edge = 'inset 0 0 0 1px rgb(var(--app-glass-edge) / var(--app-glass-edge-alpha))'

export const shadow = {
  glow: '0 0 20px rgba(10, 10, 10, 0.15)',
  glowStrong: '0 0 30px rgba(10, 10, 10, 0.25)',
  glowSubtle: '0 0 15px rgba(10, 10, 10, 0.12)',
  glowAccent: '0 4px 30px rgba(10, 10, 10, 0.18)',
  /** Header separation shadow for sticky app chrome. */
  header: '0 10px 24px rgba(7, 4, 22, 0.35), 0 1px 0 rgba(164, 138, 255, 0.08)',
  /** Brand green glow — drives all primary CTA / focus halos. */
  glowPrimarySoft: '0 0 8px rgba(21, 233, 154, 0.5)',
  glowPrimary: '0 0 30px rgba(21, 233, 154, 0.45)',
  glowPrimaryStrong: '0 0 40px rgba(21, 233, 154, 0.55)',
  /** Brand violet glow — selected / protocol / active accents. */
  glowVioletSoft: '0 0 12px rgba(111, 50, 255, 0.45)',
  glowViolet: '0 0 30px rgba(111, 50, 255, 0.5)',
  /** Both accents at once — green left, violet right. Brand moments only. */
  glowBrand: '-10px 0 32px -8px rgba(21, 233, 154, 0.45), 10px 0 32px -8px rgba(111, 50, 255, 0.55)',
  /** Resting card: top rim light + soft violet-black drop. */
  card: `${rim}, ${edge}, 0 2px 6px -1px ${ink(0.45)}, 0 12px 32px -12px ${ink(0.7)}`,
  /** Hovered / lifted card: deeper drop with a violet under-glow. */
  cardHover: `${rim}, ${edge}, 0 4px 12px -2px ${ink(0.5)}, 0 20px 44px -14px rgba(111, 50, 255, 0.26)`,
  /** Small raised control or row inside a card (tiles, chips, inputs). */
  raised: `${rim}, 0 2px 4px -1px ${ink(0.4)}, 0 6px 14px -6px ${ink(0.55)}`,
  /** Primary (green) button: coloured drop, no edge line. */
  buttonPrimary: '0 8px 22px -8px rgba(21, 233, 154, 0.65)',
  /** Violet button: coloured drop, no edge line. */
  buttonViolet: '0 8px 22px -8px rgba(111, 50, 255, 0.75)',
  /** Floating popover / modal elevation on dark surfaces. */
  popover: '0 0 0 1px rgba(164, 138, 255, 0.10), 0 24px 60px -12px rgba(7, 4, 22, 0.8), 0 0 48px -16px rgba(111, 50, 255, 0.35)',
  /** Toast / inline-notification elevation. */
  toast: '0 0 0 1px rgba(164, 138, 255, 0.10), 0 12px 36px -8px rgba(7, 4, 22, 0.6)',
} as const

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

export const shadow = {
  glow: '0 0 20px rgba(10, 10, 10, 0.15)',
  glowStrong: '0 0 30px rgba(10, 10, 10, 0.25)',
  glowSubtle: '0 0 15px rgba(10, 10, 10, 0.12)',
  glowAccent: '0 4px 30px rgba(10, 10, 10, 0.18)',
  /** Header separation shadow for sticky app chrome. */
  header: '0 10px 24px rgba(7, 4, 22, 0.35), 0 1px 0 rgba(164, 138, 255, 0.08)',
  /** Brand green glow — drives all primary CTA / focus halos. */
  glowPrimarySoft: '0 0 8px rgba(21, 233, 154, 0.5)',
  /** A selected option in a row of options: the green halo, held down so the row stays calm. */
  glowPrimaryFaint: '0 0 6px rgba(21, 233, 154, 0.22)',
  glowPrimary: '0 0 30px rgba(21, 233, 154, 0.45)',
  glowPrimaryStrong: '0 0 40px rgba(21, 233, 154, 0.55)',
  /** Brand violet glow — selected / protocol / active accents. */
  glowVioletSoft: '0 0 12px rgba(111, 50, 255, 0.45)',
  /** The violet halo held down — an icon tile lit by its row's hover. */
  glowVioletFaint: '0 0 8px rgba(111, 50, 255, 0.25)',
  glowViolet: '0 0 30px rgba(111, 50, 255, 0.5)',
  /** Both accents at once — green left, violet right. Brand moments only. */
  glowBrand: '-10px 0 32px -8px rgba(21, 233, 154, 0.45), 10px 0 32px -8px rgba(111, 50, 255, 0.55)',
  /** Resting card: soft violet-black drop. No rim light: the glass edge is the
   *  gradient ring kaleido-ui/css draws on every `.shadow-card`, and an inset
   *  rim under it would taper into a second line round the corners. */
  card: `0 2px 6px -1px ${ink(0.45)}, 0 12px 32px -12px ${ink(0.7)}`,
  /** Secondary card: the resting card's drop under its own name, so the glass
   *  edge kaleido-ui/css draws on `.shadow-card` stays off it. */
  cardSecondary: `0 2px 6px -1px ${ink(0.45)}, 0 12px 32px -12px ${ink(0.7)}`,
  /** Hovered / lifted card: deeper drop with a violet under-glow. */
  cardHover: `0 4px 12px -2px ${ink(0.5)}, 0 20px 44px -14px rgba(111, 50, 255, 0.26)`,
  /** Hover on a settings-style card: a soft violet under-glow, no deeper drop. */
  cardHoverSoft: '0 6px 20px -10px rgba(111, 50, 255, 0.3)',
  /** Small raised control or row inside a card (tiles, chips, inputs). */
  raised: `${rim}, 0 2px 4px -1px ${ink(0.4)}, 0 6px 14px -6px ${ink(0.55)}`,
  /** Primary (green) button: coloured drop, no edge line. */
  buttonPrimary: '0 6px 14px -8px rgba(21, 233, 154, 0.4)',
  /** Primary button on hover: its resting drop, plus a halo a notch under `glowPrimary`. */
  buttonPrimaryHover: '0 6px 14px -8px rgba(21, 233, 154, 0.4), 0 0 14px rgba(21, 233, 154, 0.16)',
  /** Violet button: coloured drop, no edge line. */
  buttonViolet: '0 8px 22px -8px rgba(111, 50, 255, 0.75)',
  /** Outline button on hover: the soft green halo round its border. */
  buttonOutlineHover: '0 0 8px rgba(21, 233, 154, 0.5)',
  /** Surface (violet) button on hover: the soft violet halo round its ring. */
  buttonSurfaceHover: '0 0 12px rgba(111, 50, 255, 0.45)',
  /** The current row of a nav / drawer: the green halo round its ring. */
  navActive: '0 0 8px rgba(21, 233, 154, 0.5)',
  /** Floating popover / modal elevation on dark surfaces. */
  popover: '0 0 0 1px rgba(164, 138, 255, 0.10), 0 24px 60px -12px rgba(7, 4, 22, 0.8), 0 0 48px -16px rgba(111, 50, 255, 0.35)',
  /** Toast / inline-notification elevation. */
  toast: '0 0 0 1px rgba(164, 138, 255, 0.10), 0 12px 36px -8px rgba(7, 4, 22, 0.6)',
} as const

/**
 * The light theme's shadows. The dark values are tuned for a near-black page
 * (a deep drop that reads as depth, glows that light up the dark); on white
 * the same values are either lost (the scaled ink) or turn into a smudge (the
 * 0.6–0.8 black of popovers, the 0.5–0.75 colour of glows). These are cast in
 * a cool near-black, layered as a crisp contact shadow plus a soft ambient
 * one, with a hairline ring standing in for the glass edge white can't show
 * (cards get theirs from the `.shadow-card` gradient ring instead).
 * Emitted by kaleido-ui/css under `.light`; every `shadow-*` utility follows it.
 */
const lightInk = (alpha: number) => `rgba(20, 20, 43, ${alpha})`

export const shadowLight: Record<keyof typeof shadow, string> = {
  glow: `0 0 20px ${lightInk(0.08)}`,
  glowStrong: `0 0 30px ${lightInk(0.12)}`,
  glowSubtle: `0 0 15px ${lightInk(0.06)}`,
  glowAccent: `0 4px 30px ${lightInk(0.1)}`,
  header: `0 1px 0 ${lightInk(0.06)}, 0 6px 16px -10px ${lightInk(0.14)}`,
  glowPrimarySoft: '0 0 0 3px rgba(23, 181, 129, 0.16), 0 2px 8px -2px rgba(23, 181, 129, 0.25)',
  glowPrimaryFaint: '0 0 0 2px rgba(23, 181, 129, 0.1), 0 2px 6px -2px rgba(23, 181, 129, 0.16)',
  glowPrimary: '0 6px 20px -6px rgba(23, 181, 129, 0.4)',
  glowPrimaryStrong: '0 10px 28px -8px rgba(23, 181, 129, 0.5)',
  glowVioletSoft: '0 0 0 3px rgba(111, 50, 255, 0.12), 0 2px 8px -2px rgba(111, 50, 255, 0.2)',
  glowVioletFaint: '0 0 0 2px rgba(111, 50, 255, 0.1), 0 2px 6px -2px rgba(111, 50, 255, 0.14)',
  glowViolet: '0 6px 20px -6px rgba(111, 50, 255, 0.32)',
  glowBrand: '-8px 6px 24px -10px rgba(23, 181, 129, 0.4), 8px 6px 24px -10px rgba(111, 50, 255, 0.36)',
  card: `0 1px 2px ${lightInk(0.05)}, 0 4px 12px -4px ${lightInk(0.08)}, 0 14px 32px -16px ${lightInk(0.14)}`,
  cardSecondary: `0 1px 2px ${lightInk(0.05)}, 0 4px 12px -4px ${lightInk(0.08)}, 0 14px 32px -16px ${lightInk(0.14)}`,
  cardHover: `0 2px 4px ${lightInk(0.05)}, 0 10px 24px -8px ${lightInk(0.12)}, 0 22px 44px -18px rgba(111, 50, 255, 0.18)`,
  cardHoverSoft: '0 4px 14px -8px rgba(111, 50, 255, 0.16)',
  raised: `0 0 0 1px ${lightInk(0.06)}, 0 1px 2px ${lightInk(0.07)}, 0 3px 8px -3px ${lightInk(0.1)}`,
  buttonPrimary: '0 1px 2px rgba(13, 122, 88, 0.18), 0 4px 10px -6px rgba(23, 181, 129, 0.32)',
  buttonPrimaryHover: '0 1px 2px rgba(13, 122, 88, 0.18), 0 4px 10px -6px rgba(23, 181, 129, 0.32), 0 3px 10px -6px rgba(23, 181, 129, 0.2)',
  buttonViolet: '0 1px 2px rgba(55, 20, 136, 0.22), 0 6px 14px -6px rgba(111, 50, 255, 0.45)',
  // A 1px halo, not glowPrimarySoft's 3px: on white that ring reads as a thick border.
  buttonOutlineHover: '0 0 0 1px rgba(23, 181, 129, 0.12), 0 2px 8px -3px rgba(23, 181, 129, 0.25)',
  // Likewise a 1px halo, where glowVioletSoft's 3px reads as a thick border.
  buttonSurfaceHover: '0 0 0 1px rgba(111, 50, 255, 0.14), 0 2px 8px -3px rgba(111, 50, 255, 0.22)',
  // The row already carries a 1px ring: the halo is a drop only, or the two
  // stack into the thick green border the light theme showed.
  navActive: '0 2px 8px -3px rgba(23, 181, 129, 0.3)',
  popover: `0 0 0 1px ${lightInk(0.06)}, 0 4px 10px -4px ${lightInk(0.08)}, 0 18px 40px -14px ${lightInk(0.2)}`,
  toast: `0 0 0 1px ${lightInk(0.06)}, 0 10px 28px -10px ${lightInk(0.2)}`,
}

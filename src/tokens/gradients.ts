/**
 * KaleidoSwap Gradient Tokens
 *
 * Reusable visual gradients. Brand gradients are always 135° linear (brand
 * book); the page ambience is the one radial exception, because it is light
 * falling on the page rather than a brand mark. Each token is exposed by
 * kaleido-ui/css as `--gradient-*` and as a `.bg-gradient-*` utility class.
 */
export const gradient = {
  /**
   * Page-level wash — a violet bloom top-right and a green one bottom-left,
   * the two brand accents catching light. Used by page shells.
   */
  pageRadial:
    'radial-gradient(ellipse 80% 55% at 85% -5%, rgba(111, 50, 255, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 45% at 10% 40%, rgba(21, 233, 154, 0.05) 0%, transparent 65%), radial-gradient(ellipse 70% 50% at 0% 105%, rgba(21, 233, 154, 0.12) 0%, transparent 60%)',
  /** Subtle highlight for the swap-input card receive panel. */
  cardSheen:
    'linear-gradient(135deg, rgba(111, 50, 255, 0.10), rgba(21, 233, 154, 0.05))',
  /**
   * Brand headline gradient — white-to-fade. Used by `<HeadlineGradient />`
   * via the `bg-gradient-headline` utility plus `bg-clip-text text-transparent`.
   */
  headline:
    'linear-gradient(to right, #ffffff, #ffffff, rgba(255, 255, 255, 0.45))',
  /** The brand gradient: green → violet at 135°. Hero, key brand moments. */
  brand: 'linear-gradient(135deg, #15E99A 0%, #6F32FF 100%)',
  /** Dark variant of the brand gradient, for large fills on dark surfaces. */
  brandDark: 'linear-gradient(135deg, #17B581 0%, #5420CC 100%)',
  /** Brand gradient text: lighter stops so it stays legible at body sizes. */
  brandText: 'linear-gradient(135deg, #6EEDC0 0%, #A48AFF 100%)',
  /** Primary (green) button fill — a lit top-left edge falling to brand green. */
  primary: 'linear-gradient(135deg, #6EEDC0 0%, #15E99A 45%, #17B581 100%)',
  /** Violet button / selected fill. */
  violet: 'linear-gradient(135deg, #8B5CF6 0%, #6F32FF 50%, #5420CC 100%)',
  /** Card surface: a faint violet light from the top-left corner over bg-card. */
  card: 'linear-gradient(135deg, rgba(111, 50, 255, 0.06) 0%, rgba(111, 50, 255, 0) 55%)',
  /** Hero card (balance, swap): violet top-left, green bottom-right. */
  cardHero:
    'linear-gradient(135deg, rgba(111, 50, 255, 0.16) 0%, rgba(111, 50, 255, 0.03) 50%, rgba(21, 233, 154, 0.12) 100%)',
  /** Active / selected tint: green wash for selected rows, options, nav items. */
  active: 'linear-gradient(135deg, rgba(21, 233, 154, 0.16) 0%, rgba(21, 233, 154, 0.04) 100%)',
} as const

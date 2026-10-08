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
  /** Warning (yellow) fill, built like `primary`: a lit edge falling to a deeper step. */
  warning: 'linear-gradient(135deg, #FDE047 0%, #FACC15 45%, #CA8A04 100%)',
  /** Danger (red) fill, built like `primary`. */
  danger: 'linear-gradient(135deg, #FB7070 0%, #E53535 45%, #B91C1C 100%)',
  /** Violet button / selected fill. */
  violet: 'linear-gradient(135deg, #8B5CF6 0%, #6F32FF 50%, #5420CC 100%)',
  /** The destructive button: the `destructive` red, lit like `primary`, under white text. */
  destructive: 'linear-gradient(135deg, #DA4F4F 0%, #CF3030 50%, #B42828 100%)',
  /**
   * The surface button's violet tint, lit from the top-left: lays over its
   * `bg-secondary/15` so the flat tint gets the same light as a card.
   */
  surface: 'linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(111, 50, 255, 0.04) 100%)',
  /** Card surface: a faint violet light from the top-left corner over bg-card. */
  card: 'linear-gradient(135deg, rgba(111, 50, 255, 0.06) 0%, rgba(111, 50, 255, 0) 55%)',
  /** Hero card (balance, swap): violet top-left, green bottom-right. */
  cardHero:
    'linear-gradient(135deg, rgba(111, 50, 255, 0.16) 0%, rgba(111, 50, 255, 0.03) 50%, rgba(21, 233, 154, 0.12) 100%)',
  /**
   * Violet hover: a soft violet light from the top-left that fades out. It
   * layers over the element's own background (card, tint, nothing), so a
   * hovered surface lightens instead of losing its fill.
   */
  hover: 'linear-gradient(135deg, rgba(111, 50, 255, 0.18) 0%, rgba(111, 50, 255, 0.04) 100%)',
  /** Active / selected tint: green wash for selected rows, options, nav items. */
  active: 'linear-gradient(135deg, rgba(21, 233, 154, 0.16) 0%, rgba(21, 233, 154, 0.04) 100%)',
} as const

/**
 * The light theme's button fills. On white the dark step at the bottom-right
 * reads as dirt, so each fill starts at its colour and lightens toward the
 * bottom-right instead. Same 135° direction; keys as in `gradient`.
 */
export const gradientLight = {
  primary: 'linear-gradient(135deg, #15E99A 0%, #34ECA7 50%, #74EFC3 100%)',
  warning: 'linear-gradient(135deg, #FACC15 0%, #FCD844 50%, #FDE68A 100%)',
  danger: 'linear-gradient(135deg, #E53535 0%, #EA5252 50%, #F07F7F 100%)',
  violet: 'linear-gradient(135deg, #6F32FF 0%, #7A42FF 50%, #8B5CF6 100%)',
  destructive: 'linear-gradient(135deg, #CF3030 0%, #D43D3D 50%, #DC5454 100%)',
  surface: 'linear-gradient(135deg, rgba(111, 50, 255, 0.08) 0%, rgba(255, 255, 255, 0.2) 100%)',
} as const

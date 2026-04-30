/**
 * KaleidoSwap Gradient Tokens
 *
 * Reusable visual gradients. Card-accent / dynamic gradients live with
 * the components that build them — these tokens cover the global,
 * static gradients used by page shells.
 */
export const gradient = {
  /**
   * Page-level radial wash — top-right white highlight + bottom-left
   * brand purple bloom. Used by Welcome / LockScreen / Onboarding
   * page shells.
   */
  pageRadial:
    'radial-gradient(ellipse at 60% 10%, rgba(255, 255, 255, 0.06) 0%, transparent 55%), radial-gradient(ellipse at 30% 85%, rgba(124, 58, 237, 0.08) 0%, transparent 50%)',
  /** Subtle highlight for the swap-input card receive panel. */
  cardSheen:
    'linear-gradient(to bottom right, rgba(255, 255, 255, 0.01), rgba(43, 238, 121, 0.04))',
} as const

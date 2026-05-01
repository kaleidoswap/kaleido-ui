/**
 * KaleidoSwap Shadow Tokens
 */
export const shadow = {
  glow: '0 0 20px rgba(10, 10, 10, 0.15)',
  glowStrong: '0 0 30px rgba(10, 10, 10, 0.25)',
  glowSubtle: '0 0 15px rgba(10, 10, 10, 0.12)',
  glowAccent: '0 4px 30px rgba(10, 10, 10, 0.18)',
  /** Header separation shadow for sticky app chrome. */
  header: '0 10px 24px rgba(0, 0, 0, 0.22), 0 1px 0 rgba(255, 255, 255, 0.04)',
  /** Brand green glow — drives all primary CTA / focus halos. */
  glowPrimarySoft: '0 0 8px rgba(43, 238, 121, 0.5)',
  glowPrimary: '0 0 30px rgba(43, 238, 121, 0.45)',
  glowPrimaryStrong: '0 0 40px rgba(43, 238, 121, 0.5)',
  /** Floating popover / modal elevation on dark surfaces. */
  popover: '0 18px 55px rgba(0, 0, 0, 0.65)',
  /** Toast / inline-notification elevation. */
  toast: '0 0 30px rgba(0, 0, 0, 0.3)',
} as const

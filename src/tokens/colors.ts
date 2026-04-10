/**
 * KaleidoSwap Color Tokens
 *
 * Single source of truth for all color constants across web and native.
 */
export const colors = {
  /** Brand */
  primary: '#2BEE79',
  primaryDark: '#1FA855',
  primaryFg: '#102217',

  /** Surfaces (dark theme — the default) */
  bgDark: '#102217',
  surfaceDark: '#162E21',
  surfaceHighlight: '#243E30',
  surfaceBorder: '#244A35',
  surfaceDarker: '#0B1810',

  /** Surfaces (light theme) */
  bgLight: '#F6F8F7',
  surfaceLight: '#FFFFFF',

  /** Text */
  textPrimary: '#FFFFFF',
  textSecondary: '#92C9A8',
  textMuted: 'rgba(255,255,255,0.5)',
  textDimmed: 'rgba(255,255,255,0.35)',

  /** Semantic */
  success: '#2BEE79',
  warning: '#F59E0B',
  error: '#F94040',
  info: '#4290FF',

  /** Network / Layer */
  network: {
    bitcoin: '#F7931A',
    rgb: '#DD352E',
    arkade: '#7C3AED',
    spark: '#FF6D00',
    lightning: '#F6C343',
  },

  /** Transaction direction */
  tx: {
    sent: '#F94040',
    receive: '#2BEE79',
    swap: '#4290FF',
  },
} as const

/**
 * KaleidoSwap theme configuration for WDK UI Kit
 *
 * Uses WDK's brandConfig API to apply KaleidoSwap's green-primary identity.
 */
import type { ViewStyle } from 'react-native'
import { brand, colors } from '../tokens/colors'
import type { KaleidoTheme } from '../tokens/theme'

/**
 * Brand configuration for WDK ThemeProvider.
 *
 * Usage:
 *   <ThemeProvider brandConfig={kaleidoswapBrandConfig}>
 */
export const kaleidoswapBrandConfig = {
  primaryColor: colors.primary,
  secondaryColor: colors.secondary,
}

/**
 * Full custom theme tokens for more granular control.
 */
export const kaleidoswapTokens = {
  colors: {
    primary: colors.primary,
    primaryFg: colors.primaryFg,
    /** Brand violet — second accent (selection, active, protocol surfaces). */
    secondary: brand.violet[400],
    /** Readable violet for text/icons on dark surfaces. */
    secondaryContent: brand.violet[200],
    background: colors.background,
    surface: colors.card,
    surfaceHighlight: colors.accent,
    border: colors.border,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    network: colors.network,
    tx: colors.tx,
  },
} as const

/**
 * Native drop-shadow recipes — the React Native counterpart of the web
 * `shadow-*` tokens (shadow-card, shadow-card-hover, shadow-raised,
 * shadow-button-primary, shadow-button-violet, shadow-glow-violet-soft).
 * Colours come from `theme.shadow`, so they follow the active mode.
 *
 *   <View style={[styles.card, kaleidoShadow(theme, 'card')]} />
 */
export type KaleidoShadow =
  | 'card'
  | 'cardHover'
  | 'raised'
  | 'buttonPrimary'
  | 'buttonViolet'
  | 'glowViolet'

export function kaleidoShadow(theme: KaleidoTheme, kind: KaleidoShadow): ViewStyle {
  const dark = theme.mode === 'dark'
  switch (kind) {
    case 'cardHover':
      return {
        shadowColor: theme.shadow.violet,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: dark ? 0.34 : 0.2,
        shadowRadius: 20,
        elevation: 8,
      }
    case 'raised':
      return {
        shadowColor: theme.shadow.card,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: dark ? 0.45 : 0.1,
        shadowRadius: 6,
        elevation: 2,
      }
    case 'buttonPrimary':
      return {
        shadowColor: theme.shadow.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: dark ? 0.35 : 0.3,
        shadowRadius: 14,
        elevation: 6,
      }
    case 'buttonViolet':
      return {
        shadowColor: theme.shadow.violet,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: dark ? 0.45 : 0.3,
        shadowRadius: 14,
        elevation: 6,
      }
    case 'glowViolet':
      return {
        shadowColor: theme.shadow.violet,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: dark ? 0.4 : 0.22,
        shadowRadius: 12,
        elevation: 4,
      }
    case 'card':
    default:
      return {
        shadowColor: theme.shadow.card,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: dark ? 0.55 : 0.1,
        shadowRadius: 18,
        elevation: 4,
      }
  }
}

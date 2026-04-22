/**
 * KaleidoSwap theme configuration for WDK UI Kit
 *
 * Uses WDK's brandConfig API to apply KaleidoSwap's green-primary identity.
 */
import { colors } from '../tokens/colors'

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

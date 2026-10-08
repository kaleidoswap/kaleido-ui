/**
 * AlertBanner — React Native version
 *
 * Tri-alpha intent banner (tinted wash + tinted border), mode-aware via the
 * Kaleido theme, with a soft raised shadow so it lifts off the canvas.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'
import type { KaleidoTheme } from '../../tokens/theme'
import { useKaleidoTheme } from '../theme-context'
import { kaleidoShadow } from '../theme'

type Variant = 'error' | 'warning' | 'info' | 'success'

/** Intent colours are hex in the theme, so an 8-digit alpha suffix tints them. */
function variantConfig(theme: KaleidoTheme, variant: Variant) {
  const color =
    variant === 'error'
      ? theme.danger
      : variant === 'warning'
        ? theme.warning
        : variant === 'success'
          ? theme.success
          : theme.info
  const bg =
    variant === 'error'
      ? theme.dangerSurface
      : variant === 'warning'
        ? theme.warningSurface
        : variant === 'success'
          ? theme.successSurface
          : theme.infoSurface
  return { bg, borderColor: `${color}40`, iconColor: color }
}

interface AlertBannerProps {
  variant?: Variant
  children: ReactNode
  style?: any
}

export function AlertBanner({ variant = 'info', children, style }: AlertBannerProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  const config = variantConfig(theme, variant)

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.borderColor },
        kaleidoShadow(theme, 'raised'),
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: theme.text.primary, fontFamily }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  text: {
    fontSize: 14,
    flex: 1,
  },
})

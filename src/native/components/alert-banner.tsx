/**
 * AlertBanner — React Native version
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'
import { colors } from '../../tokens/colors'

const variantConfig = {
  error: { bg: `${colors.danger}1A`, borderColor: `${colors.danger}33`, iconColor: colors.danger },
  warning: { bg: `${colors.warning}1A`, borderColor: `${colors.warning}33`, iconColor: colors.warning },
  info: { bg: `${colors.info}1A`, borderColor: `${colors.info}33`, iconColor: colors.info },
  success: { bg: `${colors.success}1A`, borderColor: `${colors.success}33`, iconColor: colors.success },
} as const

interface AlertBannerProps {
  variant?: keyof typeof variantConfig
  children: ReactNode
  style?: any
}

export function AlertBanner({ variant = 'info', children, style }: AlertBannerProps) {
  const config = variantConfig[variant]

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.borderColor }, style]}>
      {typeof children === 'string' ? (
        <Text style={styles.text}>{children}</Text>
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
    color: colors.text.primary,
    flex: 1,
  },
})

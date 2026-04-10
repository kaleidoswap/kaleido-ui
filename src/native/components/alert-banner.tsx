/**
 * AlertBanner — React Native version
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'
import { colors } from '../../tokens/colors'

const variantConfig = {
  error: { bg: '#EF44441A', borderColor: '#EF444433', iconColor: '#F87171' },
  warning: { bg: '#F59E0B1A', borderColor: '#F59E0B33', iconColor: '#FBBF24' },
  info: { bg: '#3B82F61A', borderColor: '#3B82F633', iconColor: '#60A5FA' },
  success: { bg: `${colors.primary}1A`, borderColor: `${colors.primary}33`, iconColor: colors.primary },
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
    color: '#FFFFFF',
    flex: 1,
  },
})

/**
 * SectionLabel — React Native version
 *
 * Structural eyebrow in the readable brand violet (web `text-secondary-content`).
 */
import React from 'react'
import { Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'
import { useKaleidoTheme } from '../theme-context'

interface SectionLabelProps {
  children: ReactNode
  style?: any
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  return (
    <Text style={[styles.label, { color: theme.violetText, fontFamily }, style]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
})

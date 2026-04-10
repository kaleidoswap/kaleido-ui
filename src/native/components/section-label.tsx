/**
 * SectionLabel — React Native version
 */
import React from 'react'
import { Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  style?: any
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <Text style={[styles.label, style]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.2,
    color: 'rgba(255, 255, 255, 0.3)',
  },
})

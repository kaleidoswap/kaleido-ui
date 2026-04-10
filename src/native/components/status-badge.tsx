/**
 * StatusBadge — React Native version
 *
 * Inline badge for transaction/operation status.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'

export type StatusType = 'success' | 'pending' | 'failed' | 'completed' | 'error'

interface StatusBadgeProps {
  status: StatusType
  style?: any
}

const statusConfig: Record<StatusType, { color: string; bg: string; borderColor: string; label: string }> = {
  success: { color: colors.primary, bg: `${colors.primary}1A`, borderColor: `${colors.primary}33`, label: 'Success' },
  completed: { color: colors.primary, bg: `${colors.primary}1A`, borderColor: `${colors.primary}33`, label: 'Completed' },
  pending: { color: '#EAB308', bg: '#EAB3081A', borderColor: '#EAB30833', label: 'Pending' },
  failed: { color: '#EF4444', bg: '#EF44441A', borderColor: '#EF444433', label: 'Failed' },
  error: { color: '#EF4444', bg: '#EF44441A', borderColor: '#EF444433', label: 'Error' },
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.borderColor }, style]}>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
})

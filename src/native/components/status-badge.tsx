/**
 * StatusBadge — React Native version
 *
 * Inline badge for transaction/operation status — tri-alpha semantic pill,
 * mode-aware via the Kaleido theme.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { KaleidoTheme } from '../../tokens/theme'
import { useKaleidoTheme } from '../theme-context'

export type StatusType = 'success' | 'pending' | 'failed' | 'completed' | 'error'

interface StatusBadgeProps {
  status: StatusType
  style?: any
}

type Intent = 'success' | 'warning' | 'danger'

const statusConfig: Record<StatusType, { intent: Intent; label: string }> = {
  success: { intent: 'success', label: 'Success' },
  completed: { intent: 'success', label: 'Completed' },
  pending: { intent: 'warning', label: 'Pending' },
  failed: { intent: 'danger', label: 'Failed' },
  error: { intent: 'danger', label: 'Error' },
}

function intentColors(theme: KaleidoTheme, intent: Intent) {
  const color = theme[intent]
  const bg =
    intent === 'success' ? theme.successSurface : intent === 'warning' ? theme.warningSurface : theme.dangerSurface
  // Theme intents are hex, so an 8-digit alpha suffix tints the border.
  return { color, bg, borderColor: `${color}33` }
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  const entry = statusConfig[status]
  const config = { ...intentColors(theme, entry.intent), label: entry.label }

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.borderColor }, style]}>
      <Text style={[styles.label, { color: config.color, fontFamily }]}>{config.label}</Text>
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

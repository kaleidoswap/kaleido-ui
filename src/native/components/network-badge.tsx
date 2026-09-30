/**
 * NetworkBadge — React Native version
 *
 * Network glyph colours are fixed brand tokens (never recoloured); the pill
 * reads them from the active Kaleido theme.
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { KaleidoTheme } from '../../tokens/theme'
import { useKaleidoTheme } from '../theme-context'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade'

interface NetworkBadgeProps {
  network: NetworkType
  style?: any
}

const networkConfig: Record<NetworkType, { key: keyof KaleidoTheme['network']; label: string }> = {
  L1: { key: 'bitcoin', label: 'L1' },
  LN: { key: 'lightning', label: 'LN' },
  RGB20: { key: 'rgb', label: 'RGB' },
  RGB21: { key: 'rgb', label: 'RGB21' },
  'RGB-L1': { key: 'rgb', label: 'RGB L1' },
  'RGB-LN': { key: 'rgb', label: 'RGB LN' },
  Spark: { key: 'spark', label: 'Spark' },
  Arkade: { key: 'arkade', label: 'Arkade' },
}

export function NetworkBadge({ network, style }: NetworkBadgeProps) {
  const { theme } = useKaleidoTheme()
  const entry = networkConfig[network]
  const config = { color: theme.network[entry.key], label: entry.label }

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}1A`, borderColor: `${config.color}33` }, style]}>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
  },
})

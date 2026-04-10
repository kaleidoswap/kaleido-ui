/**
 * NetworkBadge — React Native version
 */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../tokens/colors'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade'

interface NetworkBadgeProps {
  network: NetworkType
  style?: any
}

const networkConfig: Record<NetworkType, { color: string; label: string }> = {
  L1: { color: colors.network.bitcoin, label: 'L1' },
  LN: { color: colors.network.lightning, label: 'LN' },
  RGB20: { color: colors.network.rgb, label: 'RGB' },
  RGB21: { color: colors.network.rgb, label: 'RGB21' },
  'RGB-L1': { color: colors.network.rgb, label: 'RGB L1' },
  'RGB-LN': { color: colors.network.rgb, label: 'RGB LN' },
  Spark: { color: colors.network.spark, label: 'Spark' },
  Arkade: { color: colors.network.arkade, label: 'Arkade' },
}

export function NetworkBadge({ network, style }: NetworkBadgeProps) {
  const config = networkConfig[network]

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

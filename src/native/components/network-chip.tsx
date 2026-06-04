/**
 * NetworkChip — destination-network selector pill.
 *
 * Fixes the inconsistent selected-state colors (blue Spark / amber Lightning):
 * the network glyph keeps its brand color via `network.*` tokens, while the
 * SELECTED state is a single, consistent violet ring/wash (brand: violet =
 * active/protocol). Unselected chips are neutral themed surfaces.
 */
import React from 'react'
import { Pressable, View } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { KText } from './k-text'

export type NetworkKey = 'bitcoin' | 'lightning' | 'spark' | 'rgb' | 'arkade' | 'liquid'

export interface NetworkChipProps {
  network?: NetworkKey
  title: string
  /** Small line under the title (e.g. "instant", "1 asset"). */
  subtitle?: string
  selected?: boolean
  onPress?: () => void
  /** Render the network glyph with the themed color + size. */
  icon?: (color: string, size: number) => React.ReactNode
  /** Show a small "available" dot. */
  dot?: boolean
}

export function NetworkChip({
  network,
  title,
  subtitle,
  selected = false,
  onPress,
  icon,
  dot = false,
}: NetworkChipProps) {
  const { theme } = useKaleidoTheme()
  const glyph = network ? theme.network[network] : theme.text.secondary
  const glyphBg = network ? theme.networkSurface[network] : theme.surface.raised

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: selected ? theme.violetSurface : theme.surface.base,
        borderWidth: 1.5,
        borderColor: selected ? theme.violet : theme.border.subtle,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {icon && (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: glyphBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon(glyph, 16)}
        </View>
      )}
      <View style={{ gap: 1 }}>
        <KText variant="caption" weight="bold" color={selected ? theme.violet : theme.text.primary}>
          {title}
        </KText>
        {!!subtitle && (
          <KText variant="mini" weight="medium" tone="muted">
            {subtitle}
          </KText>
        )}
      </View>
      {dot && (
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: theme.primary,
            marginLeft: 2,
          }}
        />
      )}
    </Pressable>
  )
}

export default NetworkChip

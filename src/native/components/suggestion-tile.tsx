/**
 * SuggestionTile — tappable capability tile (icon chip + title + subtitle).
 *
 * Shared assistant primitive: the cards in an empty/first-run chat state that
 * map to quick actions ("Check balance", "Create invoice", …). The glyph is a
 * render function (consumer supplies the icon set; the tile controls color +
 * size) and the chip uses a flat accent fill, matching the brand's flat-fill
 * treatment. Pure RN + useKaleidoTheme — no Expo / SVG deps.
 */
import React, { type ReactNode } from 'react'
import { Pressable, View, StyleSheet, type ViewStyle } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { KText } from './k-text'

export interface SuggestionTileProps {
  title: string
  subtitle?: string
  /** Glyph renderer — receives the themed glyph color + size. */
  icon: (color: string, size: number) => ReactNode
  /** Icon-chip background. Defaults to the brand green. */
  accent?: string
  onPress?: () => void
  style?: ViewStyle
}

export function SuggestionTile({ title, subtitle, icon, accent, onPress, style }: SuggestionTileProps) {
  const { theme } = useKaleidoTheme()
  const chipColor = accent ?? theme.primary

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border.subtle,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={[styles.chip, { backgroundColor: chipColor }]}>{icon(theme.text.onFill, 18)}</View>
      <View style={styles.textArea}>
        <KText variant="caption" weight="semibold" numberOfLines={1}>
          {title}
        </KText>
        {subtitle ? (
          <KText variant="tiny" tone="muted" numberOfLines={2} style={{ marginTop: 2 }}>
            {subtitle}
          </KText>
        ) : null}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: { flex: 1 },
})

export default SuggestionTile

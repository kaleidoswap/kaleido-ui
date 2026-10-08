/**
 * ActionButton — the Send / Receive / Swap / Activity quick action.
 *
 * Replaces the rainbow filled circles with a coherent brand treatment: a
 * themed surface tile with a tinted glyph (green/violet/neutral) and a
 * violet-tinted ring, or a filled accent with a coloured drop shadow for the
 * single primary action. Icon is a render function so the glyph
 * is always tinted to match the active theme.
 */
import React from 'react'
import { Pressable, View } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { kaleidoShadow } from '../theme'
import { KText } from './k-text'

type Tone = 'primary' | 'violet' | 'neutral'

export interface ActionButtonProps {
  label: string
  /** Render the glyph with the supplied themed color + size. */
  icon: (color: string, size: number) => React.ReactNode
  onPress?: () => void
  tone?: Tone
  /** Filled accent tile (use for the single most important action). */
  filled?: boolean
  disabled?: boolean
  size?: number
}

export function ActionButton({
  label,
  icon,
  onPress,
  tone = 'neutral',
  filled = false,
  disabled = false,
  size = 56,
}: ActionButtonProps) {
  const { theme } = useKaleidoTheme()

  const fill = tone === 'violet' ? theme.violet : tone === 'primary' ? theme.primary : theme.cardElevated
  const glyph = tone === 'violet' ? theme.violetText : tone === 'primary' ? theme.primary : theme.text.primary
  const tileBg = filled
    ? fill
    : tone === 'violet'
      ? theme.violetSurface
      : tone === 'primary'
        ? theme.successSurface
        : theme.surface.raised
  const glyphColor = filled
    ? tone === 'violet'
      ? theme.text.onFill
      : tone === 'primary'
        ? theme.primaryFg
        : theme.text.primary
    : glyph
  const ring = tone === 'primary' ? theme.border.default : theme.violetBorder
  const shadow = disabled
    ? null
    : filled
      ? kaleidoShadow(theme, tone === 'primary' ? 'buttonPrimary' : 'buttonViolet')
      : kaleidoShadow(theme, 'raised')

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        alignItems: 'center',
        gap: 8,
        opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tileBg,
          borderWidth: 1,
          borderColor: filled ? fill : ring,
          borderTopColor: filled ? theme.highlight : ring,
          ...shadow,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon(glyphColor, Math.round(size * 0.42))}
      </View>
      <KText variant="caption" weight="medium" tone="secondary">
        {label}
      </KText>
    </Pressable>
  )
}

export default ActionButton

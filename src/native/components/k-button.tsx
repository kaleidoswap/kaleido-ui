/**
 * KButton — themed button.
 *
 * Variants follow the brand: primary = green fill (dark text) with a green
 * drop, secondary = violet-tinted outline, violet = protocol accent with a
 * violet drop, ghost = text-only, danger = destructive (the web
 * `shadow-button-*` treatment: a coloured drop, no edge line).
 * Disabled/pressed states keep contrast (no more washed-out CTAs).
 */
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { kaleidoShadow } from '../theme'
import { KText } from './k-text'
import type { NativeTypeLevel } from '../../tokens/theme'

type Variant = 'primary' | 'secondary' | 'violet' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface KButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  /** Rendered before the label (e.g. an icon). */
  leading?: React.ReactNode
  style?: ViewStyle
}

const SIZE: Record<Size, { h: number; px: number; type: NativeTypeLevel }> = {
  sm: { h: 40, px: 16, type: 'caption' },
  md: { h: 52, px: 20, type: 'body' },
  lg: { h: 58, px: 24, type: 'subhead' },
}

export function KButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leading,
  disabled,
  style,
  ...rest
}: KButtonProps) {
  const { theme } = useKaleidoTheme()
  const s = SIZE[size]
  const isDisabled = disabled || loading

  const palette = (pressed: boolean): { bg: string; border: string; fg: string } => {
    switch (variant) {
      case 'secondary':
        return {
          bg: pressed ? theme.violetSurface : theme.surface.base,
          border: theme.violetBorder,
          fg: theme.violetText,
        }
      case 'violet':
        return { bg: theme.violet, border: theme.violet, fg: theme.text.onFill }
      case 'ghost':
        return { bg: pressed ? theme.violetSurface : 'transparent', border: 'transparent', fg: theme.primary }
      case 'danger':
        return { bg: theme.danger, border: theme.danger, fg: theme.text.onFill }
      case 'primary':
      default:
        return { bg: theme.primary, border: theme.primary, fg: theme.primaryFg }
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => {
        const p = palette(pressed)
        const filled = variant === 'primary' || variant === 'violet' || variant === 'danger'
        const shadow =
          isDisabled || !filled
            ? null
            : variant === 'violet'
              ? kaleidoShadow(theme, 'buttonViolet')
              : variant === 'primary'
                ? kaleidoShadow(theme, 'buttonPrimary')
                : kaleidoShadow(theme, 'raised')
        return {
          ...shadow,
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: p.border,
          backgroundColor: p.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.45 : pressed ? 0.92 : 1,
          ...style,
        }
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette(false).fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {leading}
          <KText variant={s.type} weight="bold" color={palette(false).fg}>
            {label}
          </KText>
        </View>
      )}
    </Pressable>
  )
}

export default KButton

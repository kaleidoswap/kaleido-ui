/**
 * KCard — themed surface/panel.
 *
 * The default card background + subtle violet-tinted border, mode-aware, with
 * a soft violet-black drop shadow and a glossy top rim (native take on the web
 * `bg-card bg-gradient-card shadow-card`). Use `variant` to raise it
 * (modals/selected: violet under-glow) or make it a translucent inset.
 */
import React from 'react'
import { View, type ViewProps } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { kaleidoShadow } from '../theme'

export interface KCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'inset' | 'outline'
  padding?: number
  radius?: number
  /** Draw a 1px themed border. */
  bordered?: boolean
}

export function KCard({
  variant = 'default',
  padding = 16,
  radius = 16,
  bordered = true,
  style,
  children,
  ...rest
}: KCardProps) {
  const { theme } = useKaleidoTheme()

  const backgroundColor =
    variant === 'elevated'
      ? theme.cardElevated
      : variant === 'inset'
        ? theme.surface.base
        : variant === 'outline'
          ? 'transparent'
          : theme.card

  const floating = variant === 'default' || variant === 'elevated'
  const shadow = floating ? kaleidoShadow(theme, variant === 'elevated' ? 'cardHover' : 'card') : null
  const borderColor =
    variant === 'elevated' ? theme.violetBorder : variant === 'outline' ? theme.border.default : theme.border.subtle

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor,
          borderRadius: radius,
          padding,
          borderWidth: bordered ? 1 : 0,
          borderColor,
          // Rim light along the top edge — the glossy highlight of the web card.
          borderTopColor: bordered && floating ? theme.highlight : borderColor,
        },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  )
}

export default KCard

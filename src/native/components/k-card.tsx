/**
 * KCard — themed surface/panel.
 *
 * The default card background + subtle border, mode-aware. Use `variant` to
 * raise it (modals/selected) or make it a translucent inset.
 */
import React from 'react'
import { View, type ViewProps } from 'react-native'
import { useKaleidoTheme } from '../theme-context'

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

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor,
          borderRadius: radius,
          padding,
          borderWidth: bordered ? 1 : 0,
          borderColor: theme.border.subtle,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

export default KCard

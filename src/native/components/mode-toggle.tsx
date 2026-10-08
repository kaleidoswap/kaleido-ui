/**
 * ModeToggle — round button that flips light/dark.
 *
 * Headless-ish: you supply the glyph via `icon` (gets the current mode + themed
 * color + size) so the app keeps using its own icon set. Styled as a raised
 * violet-tinted control.
 */
import React from 'react'
import { Pressable, View } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { kaleidoShadow } from '../theme'
import type { ThemeMode } from '../../tokens/theme'

export interface ModeToggleProps {
  icon: (mode: ThemeMode, color: string, size: number) => React.ReactNode
  size?: number
  onToggle?: (next: ThemeMode) => void
}

export function ModeToggle({ icon, size = 40, onToggle }: ModeToggleProps) {
  const { theme, mode, toggleMode } = useKaleidoTheme()
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: mode === 'dark' }}
      accessibilityLabel={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={() => {
        toggleMode()
        onToggle?.(mode === 'dark' ? 'light' : 'dark')
      }}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: pressed ? theme.violetSurface : theme.surface.raised,
        borderWidth: 1,
        borderColor: theme.violetBorder,
        alignItems: 'center',
        justifyContent: 'center',
        ...kaleidoShadow(theme, 'raised'),
      })}
    >
      <View>{icon(mode, theme.violetText, Math.round(size * 0.5))}</View>
    </Pressable>
  )
}

export default ModeToggle

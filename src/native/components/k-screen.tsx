/**
 * KScreen — themed page background + status-bar coordination.
 *
 * Replaces the green gradient-wallpaper header with the brand's dark canvas
 * (or the light surface in light mode). Pure react-native; the app supplies its
 * own SafeArea wrapper if needed (kept dependency-free here).
 */
import React from 'react'
import { StatusBar, View, type ViewProps } from 'react-native'
import { useKaleidoTheme } from '../theme-context'

export interface KScreenProps extends ViewProps {
  /** Use the slightly raised card color as the page bg (for sheets/modals). */
  elevated?: boolean
}

/**
 * Draw the page under a transparent Android status bar, as edge-to-edge does.
 *
 * React Native 0.81+ is edge-to-edge on Android and 0.87 removed these two
 * props from `StatusBarProps`, so naming them in JSX fails the type build
 * against a current react-native. Older versions still need them to paint the
 * canvas behind the bar. Spread as an untyped bag they reach the versions that
 * read them and are ignored by the ones that do not.
 */
const legacyAndroidStatusBar: Record<string, unknown> = {
  backgroundColor: 'transparent',
  translucent: true,
}

export function KScreen({ elevated = false, style, children, ...rest }: KScreenProps) {
  const { theme, mode } = useKaleidoTheme()
  return (
    <View
      {...rest}
      style={[{ flex: 1, backgroundColor: elevated ? theme.card : theme.background }, style]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        {...legacyAndroidStatusBar}
      />
      {children}
    </View>
  )
}

export default KScreen

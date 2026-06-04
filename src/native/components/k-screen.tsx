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

export function KScreen({ elevated = false, style, children, ...rest }: KScreenProps) {
  const { theme, mode } = useKaleidoTheme()
  return (
    <View
      {...rest}
      style={[{ flex: 1, backgroundColor: elevated ? theme.card : theme.background }, style]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      {children}
    </View>
  )
}

export default KScreen

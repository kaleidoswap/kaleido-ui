/**
 * EmptyState — themed empty placeholder (e.g. "No assets yet").
 */
import React from 'react'
import { View, type ViewProps } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { KText } from './k-text'

export interface EmptyStateProps extends ViewProps {
  title: string
  description?: string
  /** Render an illustrative glyph with the themed color + size. */
  icon?: (color: string, size: number) => React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({ title, description, icon, action, style, ...rest }: EmptyStateProps) {
  const { theme } = useKaleidoTheme()
  return (
    <View {...rest} style={[{ alignItems: 'center', paddingVertical: 36, gap: 12 }, style]}>
      {icon && (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.surface.raised,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon(theme.text.muted, 28)}
        </View>
      )}
      <View style={{ alignItems: 'center', gap: 4 }}>
        <KText variant="subhead" weight="bold" tone="primary" center>
          {title}
        </KText>
        {!!description && (
          <KText variant="caption" tone="muted" center>
            {description}
          </KText>
        )}
      </View>
      {action}
    </View>
  )
}

export default EmptyState

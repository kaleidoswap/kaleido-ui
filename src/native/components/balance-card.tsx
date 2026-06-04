/**
 * BalanceCard — primary balance readout.
 *
 * Centered eyebrow + large amount + unit + fiat sub. Mode-aware; sits on the
 * dark canvas instead of a green gradient wallpaper.
 */
import React from 'react'
import { View, type ViewProps } from 'react-native'
import { useKaleidoTheme } from '../theme-context'
import { KText } from './k-text'

export interface BalanceCardProps extends ViewProps {
  label?: string
  amount: string
  unit?: string
  fiat?: string
  /** Optional trailing element under the fiat line (e.g. a delta chip). */
  footer?: React.ReactNode
}

export function BalanceCard({
  label = 'Total Balance',
  amount,
  unit,
  fiat,
  footer,
  style,
  ...rest
}: BalanceCardProps) {
  const { theme } = useKaleidoTheme()
  return (
    <View {...rest} style={[{ alignItems: 'center', gap: 6 }, style]}>
      {!!label && (
        <KText variant="caption" weight="medium" tone="muted" eyebrow>
          {label}
        </KText>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <KText variant="hero" weight="bold" tone="primary">
          {amount}
        </KText>
        {!!unit && (
          <KText variant="title" weight="medium" tone="secondary">
            {unit}
          </KText>
        )}
      </View>
      {!!fiat && (
        <KText variant="body" weight="medium" color={theme.text.muted}>
          {fiat}
        </KText>
      )}
      {footer}
    </View>
  )
}

export default BalanceCard

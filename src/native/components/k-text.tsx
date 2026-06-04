/**
 * KText — themed Text primitive.
 *
 * Drives the type scale + text-color ladder from the active theme, so copy
 * stays consistent and mode-aware. Headlines get negative tracking, eyebrow
 * captions get positive tracking (per brand type rules).
 */
import React from 'react'
import { Text, type TextProps, type TextStyle } from 'react-native'
import { nativeType, type NativeTypeLevel } from '../../tokens/theme'
import { useKaleidoTheme } from '../theme-context'

type Weight = 'normal' | 'medium' | 'semibold' | 'bold'
type Tone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'disabled'
  | 'onAccent'
  | 'accent'
  | 'violet'
  | 'success'
  | 'warning'
  | 'danger'

const WEIGHT_MAP: Record<Weight, TextStyle['fontWeight']> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export interface KTextProps extends TextProps {
  variant?: NativeTypeLevel
  weight?: Weight
  tone?: Tone
  /** Explicit color override (wins over `tone`). */
  color?: string
  /** Uppercase eyebrow styling (positive tracking). */
  eyebrow?: boolean
  center?: boolean
}

export function KText({
  variant = 'body',
  weight = 'normal',
  tone = 'primary',
  color,
  eyebrow = false,
  center = false,
  style,
  children,
  ...rest
}: KTextProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  const scale = nativeType[variant]

  const toneColor =
    color ??
    (tone === 'accent'
      ? theme.primary
      : tone === 'violet'
        ? theme.violet
        : tone === 'success'
          ? theme.success
          : tone === 'warning'
            ? theme.warning
            : tone === 'danger'
              ? theme.danger
              : theme.text[tone])

  // Headlines tighten, eyebrows open up (brand rule).
  const tracking = eyebrow ? 1.2 : scale.size >= 28 ? -0.5 : 0

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: scale.size,
          lineHeight: scale.line,
          fontWeight: WEIGHT_MAP[weight],
          color: toneColor,
          letterSpacing: tracking,
          textAlign: center ? 'center' : undefined,
          textTransform: eyebrow ? 'uppercase' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}

export default KText

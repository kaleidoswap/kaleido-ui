/**
 * TypingDots — themed animated three-dot indicator.
 *
 * Shared chat/assistant primitive: a travelling-wave bounce used as a
 * streaming placeholder or an "AI is processing" row. Pure React Native
 * Animated + theme (no Expo / SVG deps), so it works in any RN app and
 * mirrors the web assistant's typing indicator.
 */
import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, type ViewStyle } from 'react-native'
import { useKaleidoTheme } from '../theme-context'

export interface TypingDotsProps {
  /** Optional caption shown next to the dots (e.g. "Thinking on-device…"). */
  label?: string
  /** Dot color override. Defaults to the brand green (`theme.primary`). */
  color?: string
  style?: ViewStyle
}

export function TypingDots({ label, color, style }: TypingDotsProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  // One animated value per dot, started on a stagger so the dots bounce in a
  // travelling wave (smoother + more "alive" than a two-phase blink).
  const dots = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current

  useEffect(() => {
    const make = (v: Animated.Value) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 420, useNativeDriver: true }),
          Animated.delay(240),
        ]),
      )
    const loops = dots.map(make)
    const timers = dots.map((_, i) => setTimeout(() => loops[i].start(), i * 160))
    return () => {
      timers.forEach(clearTimeout)
      loops.forEach((l) => l.stop())
    }
  }, [dots])

  const dotColor = color ?? theme.primary

  return (
    <View style={[styles.row, style]}>
      <View style={styles.dotsRow}>
        {dots.map((v, i) => (
          <Animated.View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              marginHorizontal: 2.5,
              backgroundColor: dotColor,
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
                { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.1] }) },
              ],
            }}
          />
        ))}
      </View>
      {label ? (
        <Text style={[styles.label, { color: theme.text.secondary, fontFamily }]}>{label}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dotsRow: { flexDirection: 'row', alignItems: 'center', height: 12 },
  label: { fontSize: 13, marginLeft: 10, fontWeight: '500' },
})

export default TypingDots

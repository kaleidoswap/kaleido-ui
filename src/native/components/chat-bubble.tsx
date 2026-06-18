/**
 * ChatBubble — themed assistant/user message row.
 *
 * Shared chat primitive: handles row alignment, the mount entrance animation,
 * the bubble container (flat brand fill for the user, surface card for the
 * assistant), and an optional timestamp. Avatar and body are consumer-owned
 * slots, so app-specific concerns (icons, markdown, structured cards) stay in
 * the consumer while web + mobile share the same bubble shape and motion.
 *
 * Pure React Native (Animated) + useKaleidoTheme — no Expo / SVG deps.
 */
import React, { useEffect, useRef, type ReactNode } from 'react'
import { View, Text, StyleSheet, Animated, Pressable, type ViewStyle } from 'react-native'
import { useKaleidoTheme } from '../theme-context'

export type ChatRole = 'user' | 'assistant'

export interface ChatBubbleProps {
  role: ChatRole
  /** Consumer-owned avatar node (icon, gradient, image) rendered beside the bubble. */
  avatar?: ReactNode
  /** Timestamp label rendered at the bubble foot. */
  time?: string
  /** Run the spring entrance animation on mount (default true). */
  animateOnMount?: boolean
  onLongPress?: () => void
  /** Max bubble width relative to the row (default '78%'). */
  maxWidth?: ViewStyle['maxWidth']
  /** Style applied to the bubble container. */
  style?: ViewStyle
  /** Message body — consumer renders text / markdown / cards / typing dots. */
  children: ReactNode
}

export function ChatBubble({
  role,
  avatar,
  time,
  animateOnMount = true,
  onLongPress,
  maxWidth = '78%',
  style,
  children,
}: ChatBubbleProps) {
  const { theme, fontFamily } = useKaleidoTheme()
  const isUser = role === 'user'

  const enter = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current
  useEffect(() => {
    if (!animateOnMount) return
    Animated.spring(enter, { toValue: 1, tension: 120, friction: 9, useNativeDriver: true }).start()
  }, [enter, animateOnMount])

  const bubble = (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={300}
      style={[
        styles.bubble,
        { maxWidth },
        isUser
          ? { backgroundColor: theme.primary }
          : {
              backgroundColor: theme.card,
              shadowColor: theme.background,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 3,
            },
        style,
      ]}
    >
      {children}
      {time ? (
        <Text
          style={[
            styles.time,
            {
              color: isUser ? theme.text.onAccent : theme.text.muted,
              fontFamily,
              textAlign: isUser ? 'right' : 'left',
            },
          ]}
        >
          {time}
        </Text>
      ) : null}
    </Pressable>
  )

  return (
    <Animated.View
      style={[
        styles.row,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
        {
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
            { translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [isUser ? 22 : -22, 0] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
          ],
        },
      ]}
    >
      {!isUser && avatar}
      {bubble}
      {isUser && avatar}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', width: '100%', marginBottom: 16 },
  bubble: { borderRadius: 24, padding: 16, overflow: 'hidden' },
  time: { fontSize: 12, marginTop: 8, fontWeight: '500' },
})

export default ChatBubble

/**
 * Satoshi — the KaleidoSwap brand typeface, owned by the UI library so every
 * consumer (mobile + web) shares one source of truth.
 *
 * React Native can't load `.woff2` (web only), so the native package ships the
 * static `.ttf` weights. This module is Expo-free by design: it only exposes
 * the font *asset map* and the family *names*. The consumer app does the actual
 * loading (e.g. `useFonts(kaleidoFonts)` from `expo-font`), which keeps this
 * library usable outside Expo.
 *
 * Usage (Expo):
 *   import { useFonts } from 'expo-font'
 *   import { kaleidoFonts } from '@kaleidorg/kaleido-ui/native'
 *   const [loaded] = useFonts(kaleidoFonts)
 *
 * Then reference a family by name (e.g. `fontFamily: satoshiFontFamily.medium`)
 * or let `satoshiFamilyForWeight()` pick the right face for a numeric weight.
 */
import SatoshiRegular from './fonts/Satoshi-Regular.ttf'
import SatoshiMedium from './fonts/Satoshi-Medium.ttf'
import SatoshiBold from './fonts/Satoshi-Bold.ttf'
import SatoshiBlack from './fonts/Satoshi-Black.ttf'
import GeistMono from './fonts/GeistMono.ttf'

/**
 * Asset map keyed by the family name to register the font under. Pass straight
 * to `expo-font`'s `useFonts` / `Font.loadAsync`. Each key becomes the string
 * you use as `fontFamily` in styles (identical on iOS and Android).
 */
export const kaleidoFonts: Record<string, number> = {
  'Satoshi-Regular': SatoshiRegular,
  'Satoshi-Medium': SatoshiMedium,
  'Satoshi-Bold': SatoshiBold,
  'Satoshi-Black': SatoshiBlack,
  GeistMono: GeistMono,
}

/**
 * Monospaced family for numerals / equivalent balances — Geist Mono (the same
 * face the web/extension references). Use for tabular amounts; pair with the
 * `mono` text role rather than the Satoshi body face.
 */
export const monoFontFamily = 'GeistMono'

/** Registered Satoshi family names, by semantic weight. */
export const satoshiFontFamily = {
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  /** No dedicated 600 face ships — semibold maps onto the bold cut. */
  semibold: 'Satoshi-Bold',
  bold: 'Satoshi-Bold',
  /** Heaviest cut (900) — display numerals / hero balances. */
  black: 'Satoshi-Black',
} as const

export type SatoshiWeightName = keyof typeof satoshiFontFamily

/**
 * Resolve the Satoshi family that best matches an RN `fontWeight` value.
 * RN won't synthesize weight from a single custom family (especially on
 * Android), so weight must be expressed by picking the matching face.
 */
export function satoshiFamilyForWeight(weight?: string | number): string {
  if (weight === 'bold') return satoshiFontFamily.bold
  const n = typeof weight === 'number' ? weight : Number(weight)
  if (!Number.isFinite(n)) return satoshiFontFamily.regular
  if (n >= 800) return satoshiFontFamily.black
  if (n >= 600) return satoshiFontFamily.bold
  if (n >= 500) return satoshiFontFamily.medium
  return satoshiFontFamily.regular
}

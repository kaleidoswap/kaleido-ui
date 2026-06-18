/**
 * KaleidoSwap UI — React Native Components
 *
 * Re-exports WDK UI Kit components (themed with KaleidoSwap brand)
 * plus custom native components.
 *
 * Usage:
 *   import { KaleidoThemeProvider, StatusBadge } from 'kaleido-ui/native'
 */

// Theme & Provider
export { KaleidoThemeProvider } from './provider'
export { kaleidoswapBrandConfig, kaleidoswapTokens } from './theme'

// Re-export WDK UI Kit components (consumers get them pre-themed via KaleidoThemeProvider)
export {
  AmountInput,
  AssetSelector,
  NetworkSelector,
  Balance,
  CryptoAddressInput,
  QRCode,
  TransactionItem,
  TransactionList,
  SeedPhrase,
  ThemeProvider,
  useTheme,
} from '@tetherto/wdk-uikit-react-native'

// Custom native components
// KaleidoSwap-branded styled QR (rounded finders, dot modules, center logo)
export { QrCode, type QrCodeProps } from './components/qr-code'
export { StatusBadge, type StatusType } from './components/status-badge'
export { NetworkBadge, type NetworkType } from './components/network-badge'
export { AlertBanner } from './components/alert-banner'
export { SectionLabel } from './components/section-label'

// --- Themed design system (light + dark toggle) -----------------------------
export {
  KaleidoUIProvider,
  useKaleidoTheme,
  type KaleidoUIProviderProps,
} from './theme-context'
export { KText, type KTextProps } from './components/k-text'
export { KScreen, type KScreenProps } from './components/k-screen'
export { KCard, type KCardProps } from './components/k-card'
export { KButton, type KButtonProps } from './components/k-button'
export { ActionButton, type ActionButtonProps } from './components/action-button'
export { BalanceCard, type BalanceCardProps } from './components/balance-card'
export {
  NetworkChip,
  type NetworkChipProps,
  type NetworkKey,
} from './components/network-chip'
export { EmptyState, type EmptyStateProps } from './components/empty-state'
export { TypingDots, type TypingDotsProps } from './components/typing-dots'
export { ChatBubble, type ChatBubbleProps, type ChatRole } from './components/chat-bubble'
export { SuggestionTile, type SuggestionTileProps } from './components/suggestion-tile'
export { ModeToggle, type ModeToggleProps } from './components/mode-toggle'
export {
  makeTheme,
  themes,
  nativeType,
  type KaleidoTheme,
  type ThemeMode,
  type NativeTypeLevel,
} from '../tokens/theme'

// Re-export tokens for convenience
export { colors, fontFamily, typeScale, fontWeight, radius, shadow, transition } from '../tokens'

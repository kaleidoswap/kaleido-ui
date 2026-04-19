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
export { StatusBadge, type StatusType } from './components/status-badge'
export { NetworkBadge, type NetworkType } from './components/network-badge'
export { AlertBanner } from './components/alert-banner'
export { SectionLabel } from './components/section-label'

// Re-export tokens for convenience
export { colors, fontFamily, typeScale, fontWeight, radius, shadow, transition } from '../tokens'

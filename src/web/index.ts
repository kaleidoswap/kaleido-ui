/**
 * KaleidoSwap UI — Web Components
 *
 * Tailwind CSS + Radix UI based components for web applications.
 *
 * Usage:
 *   import { Button, Card, StatusBadge } from 'kaleido-ui'
 */

// Utilities
export { cn } from './utils/cn'

// Primitives
export { Button, buttonVariants, type ButtonProps } from './primitives/button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './primitives/card'
export { Input, type InputProps } from './primitives/input'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from './primitives/select'
export { Switch } from './primitives/switch'
export { NumberInput, type NumberInputProps } from './primitives/number-input'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './primitives/dialog'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './primitives/tabs'
export { Label } from './primitives/label'
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './primitives/toast'
export { Toaster } from './primitives/toaster'
export { Icon, Icons, type IconProps } from './primitives/icon'

// Shared Components
export { StatusBadge, type StatusType } from './components/status-badge'
export { NetworkBadge, type NetworkBadgeProps, type NetworkType } from './components/network-badge'
export { AssetIcon } from './components/asset-icon'
export { AssetCard, type AssetCardProps } from './components/asset-card'
export { TransactionCard, type TransactionCardProps } from './components/transaction-card'
export { AppIcon, type AppIconProps, type AppIconName } from './components/app-icon'
export {
  LightningNetworkIcon,
  SparkNetworkIcon,
  ArkadeNetworkIcon,
  type NetworkIconProps,
} from './components/network-icon'
export { ActionTile, type ActionTileProps } from './components/action-tile'
export { QrCode, type QrCodeProps } from './components/qr-code'
export {
  BottomNav,
  type BottomNavProps,
  type BottomNavItem,
} from './components/bottom-nav'
export {
  AccountStatusTabs,
  type AccountStatusTabsProps,
  type AccountStatusTabItem,
} from './components/account-status-tabs'
export {
  FilterDropdown,
  type FilterDropdownProps,
  type FilterDropdownOption,
} from './components/filter-dropdown'
export {
  SettingsTile,
  SettingsStatusPanel,
  SettingsActionButton,
  type SettingsTileProps,
} from './components/settings-tile'
export {
  AccountCapabilitiesCard,
  type AccountCapabilitiesCardProps,
} from './components/account-capabilities-card'
export {
  WalletAssetList,
  type WalletAssetListProps,
  type WalletAssetListItem,
  type WalletAssetListEmptyState,
} from './components/wallet-asset-list'
export {
  BalanceBreakdown,
  type BalanceBreakdownProps,
  type BalanceBreakdownAsset,
  type BalanceBreakdownAccounts,
  type BalanceBreakdownNodeInfo,
} from './components/balance-breakdown'
export {
  AssetSelector,
  type AssetSelectorProps,
  type AssetSelectorOption,
  type AssetSelectorCategory,
} from './components/asset-selector'
export {
  SwapInputCard,
  type SwapInputCardProps,
} from './components/swap-input-card'
export {
  ActivityList,
  type ActivityListProps,
  type ActivityListItem,
} from './components/activity-list'
export {
  ActivityFilterBar,
  type ActivityFilterBarProps,
  type ActivityStatusOption,
} from './components/activity-filter-bar'
export {
  ActivityNetworkFilters,
  getActivityNetworkFilterIcon,
  type ActivityNetworkFilterValue,
  type ActivityNetworkFilterOption,
  type ActivityNetworkFiltersProps,
} from './components/activity-network-filters'
export {
  ActivityTypeTabs,
  type ActivityTypeTabValue,
  type ActivityTypeTabCounts,
} from './components/activity-type-tabs'
export { ActivityDetailRow, type ActivityDetailRowProps } from './components/activity-detail-row'
export {
  WithdrawDestinationInput,
  type WithdrawAddressType,
  type WithdrawDestinationInputProps,
} from './components/withdraw-destination-input'
export {
  WithdrawAmountInput,
  type WithdrawAmountInputProps,
  type WithdrawDecodedLnInvoice,
  type WithdrawDecodedRgbInvoice,
  type WithdrawLnurlPayData,
} from './components/withdraw-amount-input'
export {
  WithdrawInvoiceInfo,
  type WithdrawInvoiceInfoProps,
  type WithdrawInvoiceAsset,
  type WithdrawInvoiceInfoLnInvoice,
  type WithdrawInvoiceInfoRgbInvoice,
} from './components/withdraw-invoice-info'
export {
  WithdrawRouteSelector,
  type WithdrawRouteSelectorProps,
  type WithdrawRouteOption,
  type WithdrawRouteSummary,
} from './components/withdraw-route-selector'
export {
  WithdrawConfirmation,
  type WithdrawConfirmationProps,
  type WithdrawConfirmationRgbInvoice,
} from './components/withdraw-confirmation'
export { WithdrawSuccess, type WithdrawSuccessProps } from './components/withdraw-success'
export { PageHeader, type PageHeaderProps } from './components/page-header'
export { SettingItem } from './components/setting-item'
export { SectionLabel } from './components/section-label'
export { AlertBanner } from './components/alert-banner'
export { ErrorBoundary } from './components/error-boundary'
export {
  NETWORK_CONFIG,
  InvoiceStatusBanner,
  PaidOverlay,
  CopyIcon,
  AccountChoiceChip,
  NetworkInfoDisclosure,
  MethodChoiceChip,
  type DepositAccountId,
  type DepositTransferMethod,
  type DepositNetworkKey,
  type DepositNetworkConfigEntry,
} from './components/deposit-ui-shared'
export {
  DepositSuccessScreen,
  type DepositSuccessScreenProps,
} from './components/deposit-success-screen'
export {
  DepositNetworkDefaultModal,
  type DepositNetworkDefaultModalProps,
  type DepositNetworkOption,
} from './components/deposit-network-default-modal'
export {
  BtcUnifiedReceive,
  type BtcUnifiedReceiveProps,
  type BtcUnifiedReceiveResult,
  type BtcUnifiedReceiveAddress,
} from './components/btc-unified-receive'
export {
  DepositGeneratedView,
  type DepositGeneratedViewProps,
  type DepositGeneratedAsset,
} from './components/deposit-generated-view'
export {
  DepositPreGeneration,
  type DepositPreGenerationProps,
  type DepositPreGenerationAsset,
} from './components/deposit-pre-generation'
export {
  DepositAssetSelection,
  type DepositAssetSelectionProps,
  type DepositSelectionAsset,
} from './components/deposit-asset-selection'
export {
  DepositInvoiceGeneration,
  type DepositInvoiceGenerationProps,
  type DepositInvoiceAsset,
  type DepositGenerationController,
} from './components/deposit-invoice-generation'
export {
  AccountHeaderIcons,
  AccountSettingsRow,
  getAccountNetworkLabel,
  getAccountNetworkUi,
  getAccountStatusUi,
  AccountStatusPills,
  AccountNetworkSelector,
  AccountNetworkPicker,
  AccountSettingsShell,
  AccountInfoGrid,
  AccountNotice,
  AccountNetworkNotice,
  SectionTitle,
  InlineAction,
  TransferRouteCard,
  ExpandIcon,
  type AccountSettingsProtocol,
  type AccountSettingsNetwork,
} from './components/account-settings-shared'

// Hooks
export { useToast, toast } from './hooks/use-toast'
export { useAssetIcon, getAssetIconUrl, getFallbackAssetIconUrl } from './hooks/use-asset-icon'

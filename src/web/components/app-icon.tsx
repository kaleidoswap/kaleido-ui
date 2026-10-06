import { Icon, type IconProps } from '../primitives/icon'
import { cn } from '../utils/cn'
import { OnchainNetworkIcon } from './network-icon'

const APP_ICON_NAMES = {
  activity: 'history',
  bitcoin: 'currency_bitcoin',
  chevronDown: 'expand_more',
  chevronRight: 'chevron_right',
  channelClose: 'remove_circle',
  channelOpen: 'add_circle',
  close: 'close',
  experimental: 'science',
  issuance: 'inventory_2',
  lock: 'lock',
  onboarding: 'arrow_circle_up',
  onchain: 'link', // fallback name only; AppIcon renders OnchainNetworkIcon for it
  power: 'power_settings_new',
  receive: 'call_received',
  refresh: 'refresh',
  search: 'search',
  send: 'arrow_outward',
  settings: 'settings',
  swap: 'swap_horiz',
  transaction: 'receipt_long',
  info: 'info',
  vault: 'key',
  wallet: 'account_balance_wallet',
  allNetworks: 'grid_view',
  arkadeLayers: 'layers',
} as const

export type AppIconName = keyof typeof APP_ICON_NAMES

export interface AppIconProps extends Omit<IconProps, 'name'> {
  name: AppIconName
  strokeWidth?: number
}

const SIZE_CLASSES = {
  xs: 'text-icon-sm',
  sm: 'text-icon-md',
  md: 'text-icon-xl',
  lg: 'text-icon-2xl',
  xl: 'text-icon-4xl',
  '2xl': 'text-icon-5xl',
} as const

export function AppIcon({ name, strokeWidth: _strokeWidth, ...props }: AppIconProps) {
  // On-chain is the network mark (the NetworkBadge L1 glyph), not a Material symbol.
  if (name === 'onchain') {
    const { size, className } = props
    return <OnchainNetworkIcon className={cn(size && SIZE_CLASSES[size], className)} />
  }
  return <Icon name={APP_ICON_NAMES[name]} {...props} />
}

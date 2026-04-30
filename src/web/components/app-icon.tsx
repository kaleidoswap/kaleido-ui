import { Icon, type IconProps } from '../primitives/icon'

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
  onchain: 'link',
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

export function AppIcon({ name, strokeWidth: _strokeWidth, ...props }: AppIconProps) {
  return <Icon name={APP_ICON_NAMES[name]} {...props} />
}

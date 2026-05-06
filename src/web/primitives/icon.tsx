import type { SVGProps } from 'react'
import { cn } from '../utils/cn'
import { outlinedMap, filledMap, type IconName } from '../icons'

export type { IconName }

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  filled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const sizeClasses = {
  xs: 'text-icon-sm',
  sm: 'text-icon-md',
  md: 'text-icon-xl',
  lg: 'text-icon-2xl',
  xl: 'text-icon-4xl',
  '2xl': 'text-icon-5xl',
}

export function Icon({ name, filled = false, size, className, ...props }: IconProps) {
  const SvgComponent = (filled ? filledMap[name] : undefined) ?? outlinedMap[name]
  if (!SvgComponent) return null
  return (
    <SvgComponent
      width="1em"
      height="1em"
      className={cn('inline-block shrink-0', size && sizeClasses[size], className)}
      {...props}
    />
  )
}

export const Icons = {
  // Navigation
  ArrowBack: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_back" {...props} />,
  ArrowForward: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_forward" {...props} />,
  Close: (props: Omit<IconProps, 'name'>) => <Icon name="close" {...props} />,
  Menu: (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />,

  // Actions
  Send: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_outward" {...props} />,
  Receive: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_downward" {...props} />,
  Swap: (props: Omit<IconProps, 'name'>) => <Icon name="swap_horiz" {...props} />,
  Copy: (props: Omit<IconProps, 'name'>) => <Icon name="content_copy" {...props} />,
  Paste: (props: Omit<IconProps, 'name'>) => <Icon name="content_paste" {...props} />,
  Refresh: (props: Omit<IconProps, 'name'>) => <Icon name="refresh" {...props} />,
  QrCode: (props: Omit<IconProps, 'name'>) => <Icon name="qr_code_2" {...props} />,
  QrScanner: (props: Omit<IconProps, 'name'>) => <Icon name="qr_code_scanner" {...props} />,

  // Status
  Check: (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />,
  CheckCircle: (props: Omit<IconProps, 'name'>) => <Icon name="check_circle" {...props} />,
  Error: (props: Omit<IconProps, 'name'>) => <Icon name="error" {...props} />,
  Warning: (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />,
  Info: (props: Omit<IconProps, 'name'>) => <Icon name="info" {...props} />,
  Pending: (props: Omit<IconProps, 'name'>) => <Icon name="hourglass_top" {...props} />,
  Progress: (props: Omit<IconProps, 'name'>) => <Icon name="autorenew" {...props} />,

  // Navigation tabs
  Wallet: (props: Omit<IconProps, 'name'>) => <Icon name="account_balance_wallet" {...props} />,
  Activity: (props: Omit<IconProps, 'name'>) => <Icon name="history" {...props} />,
  Settings: (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />,

  // Networks
  Lightning: (props: Omit<IconProps, 'name'>) => <Icon name="bolt" {...props} />,
  Bitcoin: (props: Omit<IconProps, 'name'>) => <Icon name="currency_bitcoin" {...props} />,
  Ark: (props: Omit<IconProps, 'name'>) => <Icon name="hexagon" {...props} />,

  // Security
  Lock: (props: Omit<IconProps, 'name'>) => <Icon name="lock" {...props} />,
  Unlock: (props: Omit<IconProps, 'name'>) => <Icon name="lock_open" {...props} />,
  Shield: (props: Omit<IconProps, 'name'>) => <Icon name="shield" {...props} />,
  Key: (props: Omit<IconProps, 'name'>) => <Icon name="key" {...props} />,
  Fingerprint: (props: Omit<IconProps, 'name'>) => <Icon name="fingerprint" {...props} />,
  Visibility: (props: Omit<IconProps, 'name'>) => <Icon name="visibility" {...props} />,
  VisibilityOff: (props: Omit<IconProps, 'name'>) => <Icon name="visibility_off" {...props} />,

  // Misc
  ExpandMore: (props: Omit<IconProps, 'name'>) => <Icon name="expand_more" {...props} />,
  ExpandLess: (props: Omit<IconProps, 'name'>) => <Icon name="expand_less" {...props} />,
  ChevronRight: (props: Omit<IconProps, 'name'>) => <Icon name="chevron_right" {...props} />,
  OpenInNew: (props: Omit<IconProps, 'name'>) => <Icon name="open_in_new" {...props} />,
  Search: (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />,
  Add: (props: Omit<IconProps, 'name'>) => <Icon name="add" {...props} />,
  Download: (props: Omit<IconProps, 'name'>) => <Icon name="download" {...props} />,
  Upload: (props: Omit<IconProps, 'name'>) => <Icon name="upload" {...props} />,
  Edit: (props: Omit<IconProps, 'name'>) => <Icon name="edit" {...props} />,
  Delete: (props: Omit<IconProps, 'name'>) => <Icon name="delete" {...props} />,
  Timer: (props: Omit<IconProps, 'name'>) => <Icon name="timer" {...props} />,
  Person: (props: Omit<IconProps, 'name'>) => <Icon name="person" {...props} />,
  Hub: (props: Omit<IconProps, 'name'>) => <Icon name="hub" {...props} />,
  Verified: (props: Omit<IconProps, 'name'>) => <Icon name="verified" {...props} />,

  // Agent / AI
  SmartToy: (props: Omit<IconProps, 'name'>) => <Icon name="smart_toy" {...props} />,
  Psychology: (props: Omit<IconProps, 'name'>) => <Icon name="psychology" {...props} />,
}

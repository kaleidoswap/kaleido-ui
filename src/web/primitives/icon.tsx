import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name (e.g., "home", "settings", "arrow_back") */
  name: string
  /** Use filled variant of the icon */
  filled?: boolean
  /** Icon size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const sizeClasses = {
  xs: 'text-[14px]',
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[32px]',
  '2xl': 'text-[48px]',
}

export function Icon({
  name,
  filled = false,
  size = 'lg',
  className,
  ...props
}: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined',
        filled && 'filled',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {name}
    </span>
  )
}

/**
 * Convenience components for common icons
 */
export const Icons = {
  // Navigation
  ArrowBack: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_back" {...props} />,
  ArrowForward: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_forward" {...props} />,
  Close: (props: Omit<IconProps, 'name'>) => <Icon name="close" {...props} />,
  Menu: (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />,

  // Actions
  Send: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_upward" {...props} />,
  Receive: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_downward" {...props} />,
  Swap: (props: Omit<IconProps, 'name'>) => <Icon name="swap_horiz" {...props} />,
  Copy: (props: Omit<IconProps, 'name'>) => <Icon name="content_copy" {...props} />,
  Paste: (props: Omit<IconProps, 'name'>) => <Icon name="content_paste" {...props} />,
  Refresh: (props: Omit<IconProps, 'name'>) => <Icon name="refresh" {...props} />,
  Share: (props: Omit<IconProps, 'name'>) => <Icon name="ios_share" {...props} />,
  QrCode: (props: Omit<IconProps, 'name'>) => <Icon name="qr_code_2" {...props} />,
  QrScanner: (props: Omit<IconProps, 'name'>) => <Icon name="qr_code_scanner" {...props} />,

  // Status
  Check: (props: Omit<IconProps, 'name'>) => <Icon name="check" {...props} />,
  CheckCircle: (props: Omit<IconProps, 'name'>) => <Icon name="check_circle" {...props} />,
  Error: (props: Omit<IconProps, 'name'>) => <Icon name="error" {...props} />,
  Warning: (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />,
  Info: (props: Omit<IconProps, 'name'>) => <Icon name="info" {...props} />,
  Pending: (props: Omit<IconProps, 'name'>) => <Icon name="hourglass_top" {...props} />,

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
  Event: (props: Omit<IconProps, 'name'>) => <Icon name="event" {...props} />,
  PlayArrow: (props: Omit<IconProps, 'name'>) => <Icon name="play_arrow" {...props} />,
  ChatBubble: (props: Omit<IconProps, 'name'>) => <Icon name="chat_bubble" {...props} />,
  Progress: (props: Omit<IconProps, 'name'>) => <Icon name="progress_activity" {...props} />,
}

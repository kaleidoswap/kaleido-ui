import { cn } from '../utils/cn'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade'

interface NetworkBadgeProps {
  network: NetworkType
  /** Override the icon path (consumer provides asset path) */
  iconBasePath?: string
  /** Show only the icon, no label */
  iconOnly?: boolean
  className?: string
}

const networkConfig: Record<NetworkType, { color: string; bg: string; border: string; label: string; iconSuffix: string }> = {
  L1: {
    color: 'text-network-bitcoin',
    bg: 'bg-network-bitcoin/10 backdrop-blur-md',
    border: 'border-network-bitcoin/20',
    label: 'L1',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  LN: {
    color: 'text-network-lightning',
    bg: 'bg-network-lightning/10 backdrop-blur-md',
    border: 'border-network-lightning/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    color: 'text-destructive',
    bg: 'bg-red-500/20 backdrop-blur-md',
    border: 'border-red-500/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    color: 'text-destructive',
    bg: 'bg-red-500/20 backdrop-blur-md',
    border: 'border-red-500/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    color: 'text-destructive',
    bg: 'bg-red-500/20 backdrop-blur-md',
    border: 'border-red-500/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    color: 'text-destructive',
    bg: 'bg-red-500/20 backdrop-blur-md',
    border: 'border-red-500/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    color: 'text-black dark:text-white',
    bg: 'bg-black/10 dark:bg-white/10 backdrop-blur-md',
    border: 'border-black/20 dark:border-white/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
  },
  Arkade: {
    color: 'text-violet-400',
    bg: 'bg-violet-500/15 backdrop-blur-md',
    border: 'border-violet-500/20',
    label: 'Arkade',
    iconSuffix: 'arkade/arkade-icon.svg',
  },
}

export function NetworkBadge({ network, iconBasePath = '/icons', iconOnly = false, className }: NetworkBadgeProps) {
  const { color, bg, label, iconSuffix } = networkConfig[network]
  const icon = `${iconBasePath}/${iconSuffix}`

  return (
    <span
      className={cn(
        'text-xs rounded-full font-bold flex items-center justify-center w-max',
        iconOnly ? 'p-1.5' : 'px-2.5 py-1 gap-1',
        bg,
        color,
        className
      )}
    >
      <img
        src={icon}
        alt={network}
        className={cn(iconOnly ? 'size-4' : 'size-3.5', 'object-contain', network === 'Spark' && 'brightness-0 dark:brightness-0 dark:invert')}
      />
      {!iconOnly && label}
    </span>
  )
}

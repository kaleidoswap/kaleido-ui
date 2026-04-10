import { cn } from '../utils/cn'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade'

interface NetworkBadgeProps {
  network: NetworkType
  /** Override the icon path (consumer provides asset path) */
  iconBasePath?: string
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
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 backdrop-blur-md',
    border: 'border-purple-500/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    color: 'text-network-rgb',
    bg: 'bg-network-rgb/10 backdrop-blur-md',
    border: 'border-network-rgb/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    color: 'text-network-rgb',
    bg: 'bg-network-rgb/10 backdrop-blur-md',
    border: 'border-network-rgb/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    color: 'text-network-rgb',
    bg: 'bg-network-rgb/10 backdrop-blur-md',
    border: 'border-network-rgb/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    color: 'text-network-rgb',
    bg: 'bg-network-rgb/10 backdrop-blur-md',
    border: 'border-network-rgb/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    color: 'text-network-spark',
    bg: 'bg-network-spark/10 backdrop-blur-md',
    border: 'border-network-spark/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
  },
  Arkade: {
    color: 'text-network-arkade',
    bg: 'bg-network-arkade/10 backdrop-blur-md',
    border: 'border-network-arkade/20',
    label: 'Arkade',
    iconSuffix: 'arkade/arkade-icon.svg',
  },
}

export function NetworkBadge({ network, iconBasePath = '/icons', className }: NetworkBadgeProps) {
  const { color, bg, border, label, iconSuffix } = networkConfig[network]
  const icon = `${iconBasePath}/${iconSuffix}`

  return (
    <span
      className={cn(
        'text-xxs px-2 py-0.5 rounded-full font-bold border shadow-inner flex items-center justify-center gap-1 w-max transition-all',
        bg,
        border,
        color,
        className
      )}
    >
      <img
        src={icon}
        alt={network}
        className={cn('size-3 object-contain', network === 'Spark' && 'opacity-80')}
      />
      {label}
    </span>
  )
}

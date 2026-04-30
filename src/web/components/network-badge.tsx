import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade'

export interface NetworkBadgeProps {
  network: NetworkType
  /** Override the icon path (consumer provides asset path) */
  iconBasePath?: string
  /** @deprecated Use showLabel={false}. Kept for compatibility. */
  iconOnly?: boolean
  /** Adds the network label after the icon. Defaults to false. */
  showLabel?: boolean
  /** Optional content rendered after the icon. Overrides the built-in label. */
  children?: ReactNode
  size?: 'sm' | 'md'
  className?: string
  iconClassName?: string
}

const networkConfig: Record<
  NetworkType,
  {
    color: string
    bg: string
    iconBg: string
    border: string
    label: string
    iconSuffix: string
    defaultIconClassName?: string
  }
> = {
  L1: {
    color: 'text-white',
    bg: 'bg-network-bitcoin-chip',
    iconBg: 'bg-network-bitcoin-chip',
    border: 'border-network-bitcoin/20',
    label: 'L1',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  LN: {
    color: 'text-white',
    bg: 'bg-network-lightning-chip',
    iconBg: 'bg-network-lightning-chip',
    border: 'border-network-lightning/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    color: 'text-white',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    color: 'text-white',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    color: 'text-white',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    color: 'text-white',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    color: 'text-white',
    bg: 'bg-network-spark-chip',
    iconBg: 'bg-network-spark-chip',
    border: 'border-black/20 dark:border-white/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
  },
  Arkade: {
    color: 'text-white',
    bg: 'bg-network-arkade-chip',
    iconBg: 'bg-network-arkade-chip',
    border: 'border-network-arkade/20',
    label: 'Arkade',
    iconSuffix: 'arkade/arkade-icon.svg',
  },
}

export function NetworkBadge({
  network,
  iconBasePath = '/icons',
  showLabel,
  children,
  size = 'md',
  className,
  iconClassName,
}: NetworkBadgeProps) {
  const { color, bg, iconBg, label, iconSuffix, defaultIconClassName } = networkConfig[network]
  const icon = `${iconBasePath}/${iconSuffix}`
  const shouldShowLabel = showLabel ?? false
  const content = children ?? (shouldShowLabel ? label : null)
  const chipSize = size === 'sm' ? 'size-6' : 'size-8'
  const imageSize = size === 'sm' ? 'size-3.5' : 'size-icon-lg'

  if (!content) {
    return (
      <span
        className={cn(
          'flex items-center justify-center rounded-full shadow-inner',
          chipSize,
          iconBg,
          className,
        )}
      >
        <img
          src={icon}
          alt={network}
          className={cn(imageSize, 'object-contain', defaultIconClassName, iconClassName)}
        />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex w-max items-center justify-center gap-1 rounded-full font-bold',
        size === 'sm' ? 'px-2 py-0.5 text-xxs' : 'px-2.5 py-1 text-xs',
        bg,
        color,
        className
      )}
    >
      <img
        src={icon}
        alt={network}
        className={cn(size === 'sm' ? 'size-3' : 'size-3.5', 'object-contain', defaultIconClassName, iconClassName)}
      />
      {content}
    </span>
  )
}

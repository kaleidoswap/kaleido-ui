import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

export type NetworkType = 'L1' | 'LN' | 'RGB20' | 'RGB21' | 'RGB-L1' | 'RGB-LN' | 'Spark' | 'Arkade' | 'Bitcoin' | 'Liquid' | 'Taproot'

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
  size?: 'sm' | 'md' | 'lg'
  className?: string
  iconClassName?: string
}

const networkConfig: Record<
  NetworkType,
  {
    chipVar: string
    textVar: string
    border: string
    label: string
    iconSuffix: string
    defaultIconClassName?: string
  }
> = {
  L1: {
    chipVar: '--color-network-bitcoin-chip',
    textVar: '--color-network-bitcoin-text',
    border: 'border-network-bitcoin/20',
    label: 'L1',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  LN: {
    chipVar: '--color-network-lightning-chip',
    textVar: '--color-network-lightning-text',
    border: 'border-network-lightning/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    chipVar: '--color-network-rgb-chip',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    chipVar: '--color-network-rgb-chip',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    chipVar: '--color-network-rgb-chip',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    chipVar: '--color-network-rgb-chip',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    chipVar: '--color-network-spark-chip',
    textVar: '--color-network-spark-text',
    border: 'border-black/20 dark:border-white/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
  },
  Arkade: {
    chipVar: '--color-network-arkade-chip',
    textVar: '--color-network-arkade-text',
    border: 'border-network-arkade/20',
    label: 'Arkade',
    iconSuffix: 'arkade/arkade-icon.svg',
  },
  Bitcoin: {
    chipVar: '--color-network-bitcoin-chip',
    textVar: '--color-network-bitcoin-text',
    border: 'border-network-bitcoin/20',
    label: 'Bitcoin',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  Liquid: {
    chipVar: '--color-network-liquid-chip',
    textVar: '--color-network-liquid-text',
    border: 'border-network-liquid/20',
    label: 'Liquid',
    iconSuffix: 'liquid/logo-liquid.svg',
  },
  Taproot: {
    chipVar: '--color-network-taproot-chip',
    textVar: '--color-network-taproot-text',
    border: 'border-network-taproot/20',
    label: 'Taproot',
    iconSuffix: 'taproot-assets/tapass-logo.svg',
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
  const { chipVar, textVar, label, iconSuffix, defaultIconClassName } = networkConfig[network]
  const icon = `${iconBasePath}/${iconSuffix}`
  const shouldShowLabel = showLabel ?? false
  const content = children ?? (shouldShowLabel ? label : null)
  const chipSize = size === 'sm' ? 'size-6' : size === 'lg' ? 'size-14' : 'size-8'
  const imageSize = size === 'sm' ? 'size-3.5' : size === 'lg' ? 'size-7' : 'size-icon-lg'
  const chipStyle = {
    backgroundColor: `var(${chipVar})`,
    color: `var(${textVar})`,
  }

  // L1 (on-chain Bitcoin) uses a generic chain glyph rather than the BTC logo —
  // the BTC logo is reserved for the asset itself, not the network it lives on.
  const renderGlyph = (className: string) =>
    network === 'L1' ? (
      <span
        className={cn('material-symbols-outlined leading-none', className)}
        style={{ fontSize: size === 'sm' ? 12 : size === 'lg' ? 24 : 16 }}
        aria-hidden
      >
        link
      </span>
    ) : (
      <img
        src={icon}
        alt={network}
        className={cn(className, 'object-contain', defaultIconClassName, iconClassName)}
      />
    )

  if (!content) {
    return (
      <span
        className={cn(
          'flex items-center justify-center rounded-full shadow-inner',
          chipSize,
          className,
        )}
        style={chipStyle}
      >
        {renderGlyph(imageSize)}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex w-max items-center justify-center gap-1 rounded-full font-bold shadow-inner',
        size === 'sm'
          ? 'px-2 py-1 text-xxs'
          : size === 'lg'
            ? 'gap-2 px-4 py-3 text-sm'
            : 'px-2.5 py-1 text-xs',
        className
      )}
      style={chipStyle}
    >
      {renderGlyph(size === 'sm' ? 'size-3' : size === 'lg' ? 'size-6' : 'size-3.5')}
      {content}
    </span>
  )
}

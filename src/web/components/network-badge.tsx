import { cn } from '../utils/cn'
import type { ReactNode } from 'react'
import { protocolIcons } from '../assets/protocol-icons'
import { OnchainNetworkIcon } from './network-icon'

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
    /** The network's own colour, for a hovered or emphasised chip. */
    accentVar: string
    border: string
    label: string
    iconSuffix: string
    defaultIconClassName?: string
  }
> = {
  L1: {
    chipVar: '--color-network-bitcoin-chip',
    accentVar: '--color-network-bitcoin',
    textVar: '--color-network-bitcoin-text',
    border: 'border-network-bitcoin/20',
    label: 'L1',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  LN: {
    chipVar: '--color-network-lightning-chip',
    accentVar: '--color-network-lightning',
    textVar: '--color-network-lightning-text',
    border: 'border-network-lightning/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    chipVar: '--color-network-rgb-chip',
    accentVar: '--color-network-rgb',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    chipVar: '--color-network-rgb-chip',
    accentVar: '--color-network-rgb',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    chipVar: '--color-network-rgb-chip',
    accentVar: '--color-network-rgb',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    chipVar: '--color-network-rgb-chip',
    accentVar: '--color-network-rgb',
    textVar: '--color-network-rgb-text',
    border: 'border-danger/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    chipVar: '--color-network-spark-chip',
    accentVar: '--color-network-spark',
    textVar: '--color-network-spark-text',
    border: 'border-black/20 dark:border-foreground/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
    // The asterisk is white: drawn black on the light theme, like the label.
    defaultIconClassName: 'kui-mono-icon',
  },
  Arkade: {
    chipVar: '--color-network-arkade-chip',
    accentVar: '--color-network-arkade',
    textVar: '--color-network-arkade-text',
    border: 'border-network-arkade/20',
    label: 'Arkade',
    iconSuffix: 'arkade/arkade-icon.svg',
  },
  Bitcoin: {
    chipVar: '--color-network-bitcoin-chip',
    accentVar: '--color-network-bitcoin',
    textVar: '--color-network-bitcoin-text',
    border: 'border-network-bitcoin/20',
    label: 'Bitcoin',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  Liquid: {
    chipVar: '--color-network-liquid-chip',
    accentVar: '--color-network-liquid',
    textVar: '--color-network-liquid-text',
    border: 'border-network-liquid/20',
    label: 'Liquid',
    iconSuffix: 'liquid/logo-liquid.svg',
  },
  Taproot: {
    chipVar: '--color-network-taproot-chip',
    accentVar: '--color-network-taproot',
    textVar: '--color-network-taproot-text',
    border: 'border-network-taproot/20',
    label: 'Taproot',
    iconSuffix: 'taproot-assets/tapass-logo.svg',
  },
}

/** A network's chip fill and ink — the badge's colours, for any surface that stands for that network. */
export function networkChipStyle(network: NetworkType): { backgroundColor: string; color: string } {
  const { chipVar, textVar } = networkConfig[network]
  return { backgroundColor: `var(${chipVar})`, color: `var(${textVar})` }
}

/**
 * The same colours as CSS variables, for `.kui-network-chip`: the badge fill
 * at rest and the network's own colour on hover.
 */
export function networkChipVars(network: NetworkType): Record<string, string> {
  const { chipVar, textVar, accentVar } = networkConfig[network]
  return {
    '--kui-network-chip': `var(${chipVar})`,
    '--kui-network-text': `var(${textVar})`,
    '--kui-network-accent': `var(${accentVar})`,
  }
}

export function NetworkBadge({
  network,
  iconBasePath,
  showLabel,
  children,
  size = 'md',
  className,
  iconClassName,
}: NetworkBadgeProps) {
  const { label, iconSuffix, defaultIconClassName } = networkConfig[network]
  const icon = iconBasePath ? `${iconBasePath}/${iconSuffix}` : (protocolIcons[network] ?? `${iconSuffix}`)
  const shouldShowLabel = showLabel ?? false
  const content = children ?? (shouldShowLabel ? label : null)
  const chipSize = size === 'sm' ? 'size-6' : size === 'lg' ? 'size-14' : 'size-8'
  const imageSize = size === 'sm' ? 'size-3.5' : size === 'lg' ? 'size-7' : 'size-icon-lg'
  const chipStyle = networkChipStyle(network)

  const renderGlyph = (className: string) =>
    network === 'L1' ? (
      <OnchainNetworkIcon className={className} />
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
            ? 'gap-2 px-4 py-3 text-body'
            : 'px-2.5 py-1 text-caption',
        className
      )}
      style={chipStyle}
    >
      {renderGlyph(size === 'sm' ? 'size-3' : size === 'lg' ? 'size-6' : 'size-3.5')}
      {content}
    </span>
  )
}

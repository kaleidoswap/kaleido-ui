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
    color: 'text-network-bitcoin-text',
    bg: 'bg-network-bitcoin-chip',
    iconBg: 'bg-network-bitcoin-chip',
    border: 'border-network-bitcoin/20',
    label: 'L1',
    iconSuffix: 'bitcoin/bitcoin-logo.svg',
  },
  LN: {
    color: 'text-network-lightning-text',
    bg: 'bg-network-lightning-chip',
    iconBg: 'bg-network-lightning-chip',
    border: 'border-network-lightning/20',
    label: 'LN',
    iconSuffix: 'lightning/lightning.svg',
  },
  RGB20: {
    color: 'text-network-rgb-text',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  RGB21: {
    color: 'text-network-rgb-text',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB21',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-L1': {
    color: 'text-network-rgb-text',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB L1',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  'RGB-LN': {
    color: 'text-network-rgb-text',
    bg: 'bg-network-rgb-chip',
    iconBg: 'bg-network-rgb-chip',
    border: 'border-danger/20',
    label: 'RGB LN',
    iconSuffix: 'rgb/rgb-logo.svg',
  },
  Spark: {
    color: 'text-network-spark-text',
    bg: 'bg-network-spark-chip',
    iconBg: 'bg-network-spark-chip',
    border: 'border-black/20 dark:border-white/20',
    label: 'Spark',
    iconSuffix: 'spark/Asterisk/Spark Asterisk White.svg',
  },
  Arkade: {
    color: 'text-network-arkade-text',
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

  // L1 (on-chain Bitcoin) uses a generic chain glyph rather than the BTC logo —
  // the BTC logo is reserved for the asset itself, not the network it lives on.
  // RGB-LN renders two glyphs side by side (RGB + Lightning) so users see at
  // a glance that an RGB asset is travelling on Lightning rails.
  const renderGlyph = (className: string) => {
    if (network === 'L1') {
      return (
        <span
          className={cn('material-symbols-outlined leading-none', color, className)}
          style={{ fontSize: size === 'sm' ? 12 : 16 }}
          aria-hidden
        >
          link
        </span>
      )
    }
    if (network === 'RGB-LN') {
      // Tighter inner glyphs so the dual chip stays visually similar in
      // weight to a single-icon NetworkBadge — the previous size matched
      // the single-icon size, which made the dual chip read as ~2× wider
      // than its single-icon siblings and visibly clipped the parent
      // asset icon when used as a corner overlay (the USDT / USDB cards).
      const innerGlyph = size === 'sm' ? 'size-2.5' : 'size-3'
      return (
        <span className="inline-flex items-center gap-0.5">
          <img
            src={`${iconBasePath}/rgb/rgb-logo.svg`}
            alt="RGB"
            className={cn(innerGlyph, 'object-contain', defaultIconClassName, iconClassName)}
          />
          <img
            src={`${iconBasePath}/lightning/lightning.svg`}
            alt="Lightning"
            className={cn(innerGlyph, 'object-contain', iconClassName)}
          />
        </span>
      )
    }
    return (
      <img
        src={icon}
        alt={network}
        className={cn(className, 'object-contain', defaultIconClassName, iconClassName)}
      />
    )
  }

  if (!content) {
    // RGB-LN renders two glyphs side by side, so use a pill (auto width)
    // instead of the square `chipSize` used by single-icon badges.
    // Keep the pill height equal to the single-icon chip and tighten
    // horizontal padding so the dual chip stays compact when it overlays
    // the corner of an asset icon.
    const isDualGlyph = network === 'RGB-LN'
    return (
      <span
        className={cn(
          'flex items-center justify-center rounded-full shadow-inner',
          isDualGlyph
            ? size === 'sm'
              ? 'h-5 px-1'
              : 'h-7 px-1.5'
            : chipSize,
          iconBg,
          className,
        )}
      >
        {renderGlyph(imageSize)}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'flex w-max items-center justify-center gap-1 rounded-full font-bold shadow-inner',
        size === 'sm' ? 'px-2 py-1 text-xxs' : 'px-2.5 py-1 text-xs',
        bg,
        color,
        className
      )}
    >
      {renderGlyph(size === 'sm' ? 'size-3' : 'size-3.5')}
      {content}
    </span>
  )
}

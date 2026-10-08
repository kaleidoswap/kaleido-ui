import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../utils/cn'
import { networkChipVars, type NetworkType } from './network-badge'

export interface NetworkStatusChipProps {
  icon: ReactNode
  /** The account's network: the chip takes that network's badge fill (`NetworkBadge`), and on hover the network's own colour. */
  network?: NetworkType
  dotClassName?: string
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

export function NetworkStatusChip({
  icon,
  network,
  dotClassName,
  onClick,
  ariaLabel,
  className,
}: NetworkStatusChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 shadow-raised transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        network
          ? 'kui-network-chip'
          : 'bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card hover:bg-accent hover:shadow-glow-violet-soft',
        className,
      )}
      style={network ? (networkChipVars(network) as CSSProperties) : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {dotClassName && <span className={cn('size-2 rounded-full', dotClassName)} />}
    </button>
  )
}

import { cn } from '../utils/cn'
import { NetworkBadge, type NetworkType } from './network-badge'

export interface SwapBadgeProps {
  /** Network the funds came from. */
  from: NetworkType
  /** Network the funds landed on. */
  to: NetworkType
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Two networks and a direction, for anything that crosses a boundary — a Boltz
 * reverse swap into Arkade, an on-chain deposit that onboards into Spark, an
 * asset swap.
 *
 * Paired glyphs rather than a single split tile. Bitcoin, Lightning and Spark
 * all sit within a narrow orange-to-gold hue band and are the three networks a
 * user meets most, so a tile tinted half one colour and half another is not
 * reliably readable — and is unreadable to anyone with a colour-vision
 * deficiency. Two whole glyphs stay distinct at small sizes, and the arrow
 * states the direction rather than implying it.
 *
 * Rows have horizontal room where they have no vertical room, which is what
 * makes the wider form the right trade here.
 */
export function SwapBadge({ from, to, size = 'md', className }: SwapBadgeProps) {
  const arrowSize = size === 'sm' ? 'size-2.5' : 'size-3'

  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      role="img"
      aria-label={`${from} to ${to}`}
    >
      <NetworkBadge network={from} size={size === 'sm' ? 'sm' : 'md'} />
      <svg
        className={cn(arrowSize, 'shrink-0 text-muted-foreground')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
      <NetworkBadge network={to} size={size === 'sm' ? 'sm' : 'md'} />
    </span>
  )
}

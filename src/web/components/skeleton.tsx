import type { CSSProperties } from 'react'
import { cn } from '../utils/cn'

export type SkeletonTone = 'primary' | 'secondary' | 'card'

export interface SkeletonProps {
  className?: string
  /** `primary` for headline figures, `secondary` for supporting lines, `card` for a card-coloured block. */
  tone?: SkeletonTone
  /**
   * Offsets the shimmer sweep, in ms. Staggering siblings turns a block of
   * placeholders into a wave instead of a wall flashing in lockstep.
   */
  delay?: number
}

const toneClass: Record<SkeletonTone, string> = {
  primary: 'bg-secondary/15',
  secondary: 'bg-secondary/10',
  card: 'bg-secondary/[0.08]',
}

/**
 * A placeholder block with a highlight sweeping across it (a breath under
 * `prefers-reduced-motion`), not a block pulsing on and off.
 */
export function Skeleton({ className, tone = 'primary', delay = 0 }: SkeletonProps) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn('kui-skeleton rounded', toneClass[tone], className)}
      style={delay ? ({ '--kui-skeleton-delay': `${delay}ms` } as CSSProperties) : undefined}
    />
  )
}

export interface ListSkeletonRowsProps {
  rows?: number
  /** Width of each row's title bar, to echo the real copy ("w-24"). */
  titleWidth?: string
  /** Width of each row's second line. */
  sublineWidth?: string
  className?: string
  rowClassName?: string
}

/**
 * Placeholder rows for an activity or transaction list: an icon, two leading
 * lines and two trailing amount lines. Each row's shimmer starts a little
 * later than the one above, so the list reads top to bottom.
 */
export function ListSkeletonRows({
  rows = 3,
  titleWidth = 'w-28',
  sublineWidth = 'w-20',
  className,
  rowClassName,
}: ListSkeletonRowsProps) {
  return (
    <div aria-hidden className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, index) => {
        const at = index * 110
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-4 shadow-card',
              rowClassName,
            )}
          >
            <Skeleton className="size-10 shrink-0 rounded-xl" delay={at} />
            <div className="flex-1 space-y-2">
              <Skeleton className={cn('h-3', titleWidth)} delay={at + 55} />
              <Skeleton tone="secondary" className={cn('h-2.5', sublineWidth)} delay={at + 110} />
            </div>
            <div className="flex flex-col items-end space-y-1.5">
              <Skeleton className="h-3 w-14" delay={at + 55} />
              <Skeleton tone="secondary" className="h-2 w-10" delay={at + 110} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

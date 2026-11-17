import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

// The parts a MetricCard is filled with on a dashboard: the figure with its
// unit (`value`), and under it the change against the preceding period or why
// there is none (`description`). The metrics gallery draws its tiles with
// exactly these.

export interface MetricFigureProps {
  amount: ReactNode
  /** Shown after the amount in caps, smaller than the number. Omit for none. */
  unit?: ReactNode
  className?: string
}

/** A figure with its unit: the unit in caps, smaller than the number. */
export function MetricFigure({ amount, unit, className }: MetricFigureProps) {
  if (unit === undefined || unit === null || unit === '') return <span className={className}>{amount}</span>
  return (
    <span className={cn('whitespace-nowrap', className)} data-slot="metric-figure">
      {amount} <span className="text-caption font-semibold uppercase tracking-eyebrow text-muted-foreground">{unit}</span>
    </span>
  )
}

export type MetricDeltaDirection = 'up' | 'down' | 'flat'

export interface MetricDeltaProps {
  direction: MetricDeltaDirection
  /** The change as shown, sign included: `+12.7%`. A flat change shows `0%` unless given. */
  value?: ReactNode
  /**
   * Whether the change is good news, which sets the colour. Defaults to up
   * good and down bad; pass `false` for a figure where a rise is bad (fees),
   * `null` for neutral.
   */
  good?: boolean | null
  /** Read after the figure by a screen reader. */
  comparisonLabel?: string
  /** Beside the change, usually an `InfoTip` saying what it compares with. */
  info?: ReactNode
  className?: string
}

const DIRECTION_WORDS: Record<MetricDeltaDirection, string> = { up: 'Up', down: 'Down', flat: 'Unchanged' }

/**
 * A change under a metric's figure. The direction is said three ways: an
 * arrow, words for a screen reader, and the colour, which says whether it is
 * good news. Flat is neutral, with no arrow.
 */
export function MetricDelta({
  direction,
  value,
  good = direction === 'flat' ? null : direction === 'up',
  comparisonLabel = 'against the preceding period',
  info,
  className,
}: MetricDeltaProps) {
  const tone = good === null ? 'text-muted-foreground' : good ? 'text-success-fg' : 'text-danger-fg'
  return (
    <span className={cn('inline-flex items-center gap-1', className)} data-slot="metric-delta">
      <span className={cn('inline-flex items-center gap-0.5 whitespace-nowrap font-semibold', tone)} data-direction={direction}>
        {direction !== 'flat' && (
          <Icon name={direction === 'up' ? 'arrow_upward' : 'arrow_downward'} className="text-icon-xs" aria-hidden="true" />
        )}
        <span className="sr-only">{DIRECTION_WORDS[direction]} </span>
        {value ?? (direction === 'flat' ? '0%' : null)}
        {comparisonLabel && <span className="sr-only"> {comparisonLabel}</span>}
      </span>
      {info}
    </span>
  )
}

export interface MetricNoDeltaProps {
  /** Why there is no change to show. */
  children?: ReactNode
  /** Beside the text, usually an `InfoTip` saying what it would compare with. */
  info?: ReactNode
  className?: string
}

/** In place of a change: there is nothing to compare with, or it is not known yet. */
export function MetricNoDelta({ children = 'No prior data', info, className }: MetricNoDeltaProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap', className)} data-slot="metric-no-delta">
      <span className="text-muted-foreground">{children}</span>
      {info}
    </span>
  )
}

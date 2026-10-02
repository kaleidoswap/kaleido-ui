import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from '../../primitives/icon'
import { defaultChartFormat } from './core'

export interface MeterProps {
  /** What is measured: "Channel capacity used". */
  label: ReactNode
  value: number
  max: number
  /** At or above this share of `max` the fill turns to warning. Defaults to 0.75. */
  warnAt?: number
  /** At or above this share the fill turns to danger. Defaults to 0.9. */
  dangerAt?: number
  formatValue?: (value: number) => string
  className?: string
}

/**
 * A single ratio against a limit — capacity used, a quota — where a two-slice
 * pie would be the wrong form. The fill carries severity (primary → warning →
 * danger); the track is a lighter step of the same colour, so the state reads
 * across the whole bar. A state other than normal also gets an icon and a
 * word, never colour alone.
 */
export function Meter({
  label,
  value,
  max,
  warnAt = 0.75,
  dangerAt = 0.9,
  formatValue = defaultChartFormat,
  className,
}: MeterProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const state = ratio >= dangerAt ? 'danger' : ratio >= warnAt ? 'warning' : 'normal'
  const fill = { normal: 'bg-primary bg-gradient-primary', warning: 'bg-warning', danger: 'bg-danger' }[state]
  const track = { normal: 'bg-primary/15', warning: 'bg-warning/15', danger: 'bg-danger/15' }[state]
  const percent = Math.round(ratio * 100)

  return (
    <div data-slot="meter" data-state={state} className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3 text-caption">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-foreground">
          {formatValue(value)} <span className="font-normal text-muted-foreground">/ {formatValue(max)}</span>
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${formatValue(value)} of ${formatValue(max)}, ${percent}%`}
        aria-label={typeof label === 'string' ? label : undefined}
        className={cn('h-2 overflow-hidden rounded-full shadow-inner', track)}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none', fill)} style={{ width: `${ratio * 100}%` }} />
      </div>
      {state !== 'normal' && (
        <p className={cn('m-0 flex items-center gap-1 text-caption', state === 'danger' ? 'text-danger-fg' : 'text-warning-fg')}>
          <Icon name={state === 'danger' ? 'error' : 'warning'} className="text-icon-sm" />
          {state === 'danger' ? `Almost full · ${percent}%` : `Getting full · ${percent}%`}
        </p>
      )}
    </div>
  )
}

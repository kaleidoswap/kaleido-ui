import { cn } from '../../utils/cn'

export interface SparklineProps {
  /** The recent values, oldest first. Twelve is the usual length. */
  values: readonly number[]
  /**
   * The accessible description, which a sparkline needs because it has no
   * axes: "Swaps, last 12 weeks: 40 to 71".
   */
  label: string
  width?: number
  height?: number
  className?: string
}

/**
 * A word-sized trend line for a stat tile: the history in the de-emphasis
 * colour, the current value as the one accented dot. No axes — the figure
 * beside it carries the number, and `label` carries the range.
 */
export function Sparkline({ values, label, width = 96, height = 28, className }: SparklineProps) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = 4
  const x = (index: number) => pad + (index / (values.length - 1)) * (width - pad * 2)
  const y = (value: number) => height - pad - ((value - min) / span) * (height - pad * 2)
  const d = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join('')
  const last = values.length - 1

  return (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('block shrink-0 overflow-visible', className)}
    >
      <path d={d} fill="none" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={3} fill="var(--series-1)" stroke="var(--card)" strokeWidth={2} />
    </svg>
  )
}

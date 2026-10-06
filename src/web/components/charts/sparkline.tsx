import { useEffect, useRef, useState } from 'react'
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
  /**
   * The height in px, or `fill` to take the height of its container (a
   * stretched slot, such as MetricCard's `trend`). Filling redraws at the
   * measured height, so the line and its dot keep their weight.
   */
  height?: number | 'fill'
  /** A pulse ring on the current-value dot: the figure is live. Off under reduced motion. */
  pulse?: boolean
  /**
   * The current-value dot's colour: the first series colour by default,
   * `negative` in danger red for a figure that has fallen. The line stays
   * neutral; pair it with a description that says the change.
   */
  tone?: 'default' | 'negative'
  className?: string
}

/**
 * A word-sized trend line for a stat tile: the history in the de-emphasis
 * colour, the current value as the one accented dot. No axes — the figure
 * beside it carries the number, and `label` carries the range.
 */
export function Sparkline({ values, label, width = 96, height = 28, pulse = false, tone = 'default', className }: SparklineProps) {
  const fill = height === 'fill'
  const boxRef = useRef<HTMLSpanElement>(null)
  const [measured, setMeasured] = useState(28)

  useEffect(() => {
    const box = boxRef.current
    if (!fill || !box) return
    const measure = () => setMeasured(Math.max(16, Math.round(box.getBoundingClientRect().height)))
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [fill])

  if (values.length < 2) return null
  const h = fill ? measured : height
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pad = 4
  const x = (index: number) => pad + (index / (values.length - 1)) * (width - pad * 2)
  const y = (value: number) => h - pad - ((value - min) / span) * (h - pad * 2)
  const d = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(value).toFixed(1)}`).join('')
  const last = values.length - 1
  const dot = tone === 'negative' ? 'var(--color-danger)' : 'var(--series-1)'

  const svg = (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label={label}
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      className={cn('block shrink-0 overflow-visible', !fill && className, fill && 'absolute inset-y-0 right-0')}
    >
      <path d={d} fill="none" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {pulse && (
        <circle
          data-slot="sparkline-pulse"
          aria-hidden="true"
          cx={x(last)}
          cy={y(values[last])}
          r={4}
          fill={dot}
          className="opacity-0 motion-safe:animate-ping motion-safe:opacity-75"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      )}
      <circle cx={x(last)} cy={y(values[last])} r={4} fill={dot} stroke="var(--card)" strokeWidth={2} />
    </svg>
  )

  if (!fill) return svg
  // The box takes its height from the slot, never from the svg inside it.
  return (
    <span ref={boxRef} className={cn('relative block h-full', className)} style={{ width }}>
      {svg}
    </span>
  )
}

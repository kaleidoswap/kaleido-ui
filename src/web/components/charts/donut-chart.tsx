import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { chartSeriesLimit } from '../../../tokens/chart'
import {
  ChartFrame,
  ChartLegend,
  defaultChartFormat,
  nextActiveIndex,
  plotClass,
  seriesColor,
} from './core'

export interface DonutSegment {
  id: string
  label: string
  value: number
}

export interface DonutChartProps {
  /**
   * The parts of one whole. Past six, the smallest fold into one "Other"
   * segment rather than taking a generated colour.
   */
  segments: readonly DonutSegment[]
  label: string
  formatValue?: (value: number) => string
  /** Under the total in the hole: "Total balance". */
  totalLabel?: string
  size?: number
  empty?: ReactNode
  className?: string
}

const OTHER_ID = '__other'

/** Keep the largest five and fold the rest into "Other" once there are more than six. */
export function foldSegments(segments: readonly DonutSegment[]): DonutSegment[] {
  const positive = segments.filter((s) => s.value > 0)
  if (positive.length <= chartSeriesLimit) return positive
  const sorted = [...positive].sort((a, b) => b.value - a.value)
  const kept = sorted.slice(0, chartSeriesLimit - 1)
  const rest = sorted.slice(chartSeriesLimit - 1).reduce((sum, s) => sum + s.value, 0)
  const keptIds = new Set(kept.map((s) => s.id))
  // Survivors keep their original order, and so their colour.
  return [...positive.filter((s) => keptIds.has(s.id)), { id: OTHER_ID, label: 'Other', value: rest }]
}

/** A point on the ring, angle 0 at 12 o'clock, clockwise. */
const polar = (cx: number, cy: number, r: number, angle: number) => [
  cx + r * Math.sin(angle),
  cy - r * Math.cos(angle),
]

function arcPath(cx: number, cy: number, outer: number, inner: number, start: number, end: number) {
  const large = end - start > Math.PI ? 1 : 0
  const [x0, y0] = polar(cx, cy, outer, start)
  const [x1, y1] = polar(cx, cy, outer, end)
  const [x2, y2] = polar(cx, cy, inner, end)
  const [x3, y3] = polar(cx, cy, inner, start)
  return `M${x0},${y0}A${outer},${outer} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${inner},${inner} 0 ${large} 0 ${x3},${y3}Z`
}

/**
 * A donut: part-to-whole at a glance, six parts at most. The total sits in the
 * hole; hovering or focusing a segment shows its value and share there. Close
 * values are better compared as a bar chart — a donut is for "most of it is
 * Lightning", not for 31% against 29%.
 */
export function DonutChart({
  segments,
  label,
  formatValue = defaultChartFormat,
  totalLabel = 'Total',
  size = 200,
  empty,
  className,
}: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const parts = foldSegments(segments)
  const total = parts.reduce((sum, s) => sum + s.value, 0)
  if (parts.length === 0 || total <= 0) return <>{empty ?? null}</>

  const cx = size / 2
  const cy = size / 2
  const outer = size / 2 - 2
  const inner = outer * 0.64
  // The 2px surface gap between segments, as an angle at the outer edge.
  const gap = parts.length > 1 ? 2 / outer : 0
  let angle = 0
  const arcs = parts.map((part) => {
    const sweep = (part.value / total) * Math.PI * 2
    const start = angle + gap / 2
    const end = angle + sweep - gap / 2
    angle += sweep
    return { part, start, end: Math.max(start + 0.001, end) }
  })

  const colorOf = (index: number) =>
    parts[index].id === OTHER_ID ? 'var(--muted-foreground)' : seriesColor(index)
  const share = (value: number) => `${Math.round((value / total) * 1000) / 10}%`
  const activePart = active === null ? null : parts[active]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (nextActiveIndex(event.key, active, parts.length) === undefined) return
    event.preventDefault()
    // From the latest state, so keys pressed faster than a render still step.
    setActive((current) => {
      const next = nextActiveIndex(event.key, current, parts.length)
      return next === undefined ? current : next
    })
  }

  return (
    <ChartFrame
      label={label}
      className={className}
      legend={
        <ChartLegend
          items={parts.map((part, index) => ({
            id: part.id,
            label: `${part.label} · ${share(part.value)}`,
            color: colorOf(index),
          }))}
        />
      }
      table={{
        columns: ['Part', 'Value', 'Share'],
        rows: [
          ...parts.map((part) => [part.label, formatValue(part.value), share(part.value)]),
          [totalLabel, formatValue(total), '100%'],
        ],
      }}
      announcement={activePart ? `${activePart.label}: ${formatValue(activePart.value)}, ${share(activePart.value)}` : undefined}
    >
      <div
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}: ${parts.length} parts. Arrow keys move between them.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className={`${plotClass} flex justify-center`}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="block max-w-full">
          {arcs.map(({ part, start, end }, index) => (
            <path
              key={part.id}
              data-segment={part.id}
              d={arcPath(cx, cy, active === index ? outer + 1 : outer, inner, start, end)}
              fill={colorOf(index)}
              opacity={active !== null && active !== index ? 0.55 : 1}
              onPointerEnter={() => setActive(index)}
            />
          ))}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize={20}
            fontWeight={700}
            fill="var(--foreground)"
          >
            {formatValue(activePart ? activePart.value : total)}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
            {activePart ? `${activePart.label} · ${share(activePart.value)}` : totalLabel}
          </text>
        </svg>
      </div>
    </ChartFrame>
  )
}

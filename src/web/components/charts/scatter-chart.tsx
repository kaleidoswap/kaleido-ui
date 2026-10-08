import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { chartScatterSeriesLimit } from '../../../tokens/chart'
import {
  ChartFrame,
  useSeriesVisibility,
  type ChartTitleProps,
  ChartLegend,
  ChartTooltip,
  TICK_FONT,
  axisTextWidth,
  chartValueTicks,
  defaultChartFormat,
  nextActiveIndex,
  plotClass,
  seriesColor,
  useChartWidth,
} from './core'

export interface ScatterPoint {
  id: string
  x: number
  y: number
  /** What the point is: "Swap sw_81", "BTC/USDT". */
  label?: string
}

export interface ScatterSeries {
  id: string
  label: string
  points: readonly ScatterPoint[]
}

export interface ScatterChartProps extends ChartTitleProps {
  /**
   * At most three: in a scatter any two points can sit side by side, and only
   * the first three palette slots stay apart for every pair under colour
   * blindness. More series throw rather than borrow a colour.
   */
  series: readonly ScatterSeries[]
  label: string
  xLabel: string
  yLabel: string
  formatX?: (value: number) => string
  formatY?: (value: number) => string
  height?: number
  empty?: ReactNode
  className?: string
}

const MARGIN = { top: 12, right: 16, bottom: 40, left: 8 }
/** The hit radius around a point: 24px across, far larger than the 8px mark. */
const HIT_RADIUS = 12

/**
 * A scatter plot: how two measures relate — fee against amount, latency
 * against size. Hover finds the nearest point, not only one under the
 * pointer; focus the plot and ←/→ walk the points in x order.
 */
export function ScatterChart({
  series: allSeries,
  label,
  xLabel,
  yLabel,
  formatX = defaultChartFormat,
  formatY = defaultChartFormat,
  height = 260,
  empty,
  className,
  ...head
}: ScatterChartProps) {
  const [containerRef, width] = useChartWidth()
  const [active, setActive] = useState<number | null>(null)
  const visibility = useSeriesVisibility(allSeries.map((s) => s.id))
  const series = allSeries.filter((s) => visibility.isVisible(s.id))
  const slotOf = (id: string) => allSeries.findIndex((s) => s.id === id)
  if (allSeries.length > chartScatterSeriesLimit) {
    throw new Error(
      `ScatterChart takes at most ${chartScatterSeriesLimit} series (got ${allSeries.length}); fold the rest into "Other" or use small multiples.`,
    )
  }

  const points = series
    .flatMap((s) => s.points.map((p) => ({ ...p, slot: slotOf(s.id), seriesLabel: s.label })))
    .sort((a, b) => a.x - b.x)
  if (points.length === 0) return <>{empty ?? null}</>

  const xMax = Math.max(0, ...points.map((p) => p.x))
  const yMax = Math.max(0, ...points.map((p) => p.y))
  const xTicks = chartValueTicks(xMax)
  const yTicks = chartValueTicks(yMax)
  const yTickLabels = yTicks.map(formatY)
  const plotLeft = MARGIN.left + axisTextWidth(yTickLabels) + 8
  const plotRight = width - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = height - MARGIN.bottom
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const sx = (value: number) => plotLeft + (Math.max(0, value) / (xMax || 1)) * plotWidth
  const sy = (value: number) => plotBottom - (Math.max(0, value) / (yMax || 1)) * plotHeight

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - box.left) / box.width) * width
    const py = ((event.clientY - box.top) / box.height) * height
    let best: number | null = null
    let bestDistance = Infinity
    points.forEach((p, index) => {
      const distance = Math.hypot(sx(p.x) - px, sy(p.y) - py)
      if (distance < bestDistance) {
        best = index
        bestDistance = distance
      }
    })
    // Nearest, within reach: a pointer in an empty corner shows nothing.
    setActive(bestDistance <= HIT_RADIUS * 3 ? best : null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (nextActiveIndex(event.key, active, points.length) === undefined) return
    event.preventDefault()
    // From the latest state, so keys pressed faster than a render still step.
    setActive((current) => {
      const next = nextActiveIndex(event.key, current, points.length)
      return next === undefined ? current : next
    })
  }

  const activePoint = active === null ? null : points[active]
  const describe = (p: (typeof points)[number]) =>
    `${p.label ?? p.seriesLabel}: ${xLabel} ${formatX(p.x)}, ${yLabel} ${formatY(p.y)}`

  return (
    <ChartFrame
      {...head}
      label={label}
      className={className}
      scale={`${yLabel} against ${xLabel} · both linear, from 0`}
      legend={
        allSeries.length > 1 ? (
          <ChartLegend
            keyShape="dot"
            items={allSeries.map((s, slot) => ({ id: s.id, label: s.label, color: seriesColor(slot) }))}
            {...visibility.legend}
          />
        ) : undefined
      }
      table={{
        columns: ['Point', 'Series', xLabel, yLabel],
        rows: points.map((p) => [p.label ?? p.id, p.seriesLabel, formatX(p.x), formatY(p.y)]),
      }}
      announcement={activePoint ? describe(activePoint) : undefined}
    >
      <div
        ref={containerRef}
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}: ${points.length} points. Arrow keys move between them.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        className={plotClass}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block overflow-visible"
          aria-hidden="true"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          <g data-slot="chart-y-axis">
            {yTicks.map((tick, index) => (
              <g key={tick}>
                <line x1={plotLeft} x2={plotRight} y1={sy(tick)} y2={sy(tick)} stroke="var(--border)" />
                <text x={plotLeft - 8} y={sy(tick)} dy="0.32em" textAnchor="end" fontSize={TICK_FONT} fill="var(--muted-foreground)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {yTickLabels[index]}
                </text>
              </g>
            ))}
          </g>
          <g data-slot="chart-x-axis">
            <line x1={plotLeft} x2={plotRight} y1={plotBottom} y2={plotBottom} stroke="var(--border)" />
            {xTicks.map((tick, index) => (
              <text
                key={tick}
                x={sx(tick)}
                y={plotBottom + 16}
                textAnchor={index === 0 ? 'start' : index === xTicks.length - 1 ? 'end' : 'middle'}
                fontSize={TICK_FONT}
                fill="var(--muted-foreground)"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatX(tick)}
              </text>
            ))}
            <text x={plotRight} y={plotBottom + 34} textAnchor="end" fontSize={TICK_FONT} fill="var(--muted-foreground)">
              {xLabel} →
            </text>
          </g>
          <g data-slot="chart-points">
            {points.map((p, index) => (
              <circle
                key={`${p.slot}-${p.id}`}
                data-series={allSeries[p.slot].id}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={active === index ? 6 : 4}
                fill={seriesColor(p.slot)}
                stroke="var(--card)"
                strokeWidth={2}
                opacity={active !== null && active !== index ? 0.5 : 1}
              />
            ))}
          </g>
        </svg>
        {activePoint && (
          <ChartTooltip
            title={activePoint.label ?? activePoint.seriesLabel}
            rows={[
              { id: 'x', label: xLabel, value: formatX(activePoint.x), color: seriesColor(activePoint.slot) },
              { id: 'y', label: yLabel, value: formatY(activePoint.y), color: seriesColor(activePoint.slot) },
            ]}
            x={sx(activePoint.x)}
            y={sy(activePoint.y) - 24}
            width={width}
          />
        )}
      </div>
    </ChartFrame>
  )
}

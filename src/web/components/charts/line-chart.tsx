import { useId, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import {
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  TICK_FONT,
  axisTextWidth,
  chartLabelIndices,
  chartValueTicks,
  defaultChartFormat,
  nextActiveIndex,
  plotClass,
  seriesColor,
  tooltipText,
  useChartWidth,
  type ChartDatum,
  type ChartSeries,
  type TooltipRow,
} from './core'

export interface LineChartProps {
  /** One datum per x position, in order (usually time). */
  data: readonly ChartDatum[]
  /** Drawn in slot order; at most six (fold the tail into "Other"). */
  series: readonly ChartSeries[]
  /** Accessible name, and the table's caption. */
  label: string
  /** What one unit on the value axis is: "Volume, sats". Stated with "· linear, from 0". */
  scaleLabel: string
  /**
   * Fill under the line in a 10% wash of its colour. For a single series; with
   * several, overlapping washes stop reading as data, so only the lines draw.
   */
  area?: boolean
  /** Counts: keep axis steps whole. */
  integer?: boolean
  formatValue?: (value: number) => string
  /** Plot height in px, axes included. */
  height?: number
  /** Rendered instead of the chart when there is no data. Never an empty frame. */
  empty?: ReactNode
  className?: string
}

const MARGIN = { top: 12, right: 16, bottom: 26, left: 8 }

/**
 * A line chart: change over time, one 2px line per series, a crosshair that
 * snaps to the nearest x and a tooltip listing every series there. With
 * `area` and one series it is an area chart.
 *
 * The value axis is linear from zero and tops out at the largest value.
 * Focus the plot and use ←/→, Home/End to walk the points; Escape clears.
 */
export function LineChart({
  data,
  series,
  label,
  scaleLabel,
  area = false,
  integer = false,
  formatValue = defaultChartFormat,
  height = 240,
  empty,
  className,
}: LineChartProps) {
  const [containerRef, width] = useChartWidth()
  const [active, setActive] = useState<number | null>(null)
  const idBase = `line-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  const count = data.length
  if (count === 0 || series.length === 0) return <>{empty ?? null}</>

  const max = Math.max(0, ...data.flatMap((d) => series.map((s) => d.values[s.id] ?? 0)))
  const ticks = chartValueTicks(max, { integer })
  const tickLabels = ticks.map(formatValue)
  const plotLeft = MARGIN.left + axisTextWidth(tickLabels) + 8
  const plotRight = width - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = height - MARGIN.bottom
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const top = max > 0 ? max : 1
  const x = (index: number) => (count === 1 ? plotLeft + plotWidth / 2 : plotLeft + (index / (count - 1)) * plotWidth)
  const y = (value: number) => plotBottom - (Math.max(0, value) / top) * plotHeight
  const labelIndices = chartLabelIndices(count, plotWidth / 72)
  const showArea = area && series.length === 1

  const pathFor = (id: string) =>
    data.map((d, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(2)},${y(d.values[id] ?? 0).toFixed(2)}`).join('')

  const rowsAt = (index: number): TooltipRow[] =>
    series.map((s, slot) => ({
      id: s.id,
      label: s.label,
      value: formatValue(data[index].values[s.id] ?? 0),
      color: seriesColor(slot),
    }))

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - box.left) / box.width) * width
    const ratio = count === 1 ? 0 : (px - plotLeft) / plotWidth
    setActive(Math.max(0, Math.min(count - 1, Math.round(ratio * (count - 1)))))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (nextActiveIndex(event.key, active, count) === undefined) return
    event.preventDefault()
    // From the latest state, so keys pressed faster than a render still step.
    setActive((current) => {
      const next = nextActiveIndex(event.key, current, count)
      return next === undefined ? current : next
    })
  }

  const activeDatum = active === null ? null : data[active]

  return (
    <ChartFrame
      label={label}
      className={className}
      scale={`${scaleLabel} · linear, from 0`}
      legend={
        series.length > 1 ? (
          <ChartLegend
            keyShape="line"
            items={series.map((s, slot) => ({ id: s.id, label: s.label, color: seriesColor(slot) }))}
          />
        ) : undefined
      }
      table={{
        columns: ['Period', ...series.map((s) => s.label)],
        rows: data.map((d) => [d.detail ?? d.label, ...series.map((s) => formatValue(d.values[s.id] ?? 0))]),
      }}
      announcement={activeDatum ? tooltipText(activeDatum.detail ?? activeDatum.label, rowsAt(active!)) : undefined}
    >
      <div
        ref={containerRef}
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}: ${count} points. Arrow keys move between them.`}
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
          {showArea && (
            <defs>
              <linearGradient id={`${idBase}-wash`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={seriesColor(0)} stopOpacity="0.14" />
                <stop offset="1" stopColor={seriesColor(0)} stopOpacity="0.04" />
              </linearGradient>
            </defs>
          )}
          <g data-slot="chart-y-axis">
            {ticks.map((tick, index) => (
              <g key={tick}>
                <line x1={plotLeft} x2={plotRight} y1={y(tick)} y2={y(tick)} stroke="var(--border)" />
                <text
                  x={plotLeft - 8}
                  y={y(tick)}
                  dy="0.32em"
                  textAnchor="end"
                  fontSize={TICK_FONT}
                  fill="var(--muted-foreground)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {tickLabels[index]}
                </text>
              </g>
            ))}
          </g>

          {showArea && (
            <path
              data-slot="chart-area"
              d={`${pathFor(series[0].id)}L${x(count - 1)},${plotBottom}L${x(0)},${plotBottom}Z`}
              fill={`url(#${idBase}-wash)`}
            />
          )}

          <g data-slot="chart-lines">
            {series.map((s, slot) => (
              <path
                key={s.id}
                data-series={s.id}
                d={pathFor(s.id)}
                fill="none"
                stroke={seriesColor(slot)}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* End markers, ringed in the surface so they read where lines cross. */}
          <g data-slot="chart-end-markers">
            {series.map((s, slot) => (
              <circle
                key={s.id}
                cx={x(count - 1)}
                cy={y(data[count - 1].values[s.id] ?? 0)}
                r={4}
                fill={seriesColor(slot)}
                stroke="var(--card)"
                strokeWidth={2}
              />
            ))}
          </g>

          {active !== null && (
            <g data-slot="chart-crosshair">
              <line x1={x(active)} x2={x(active)} y1={plotTop} y2={plotBottom} stroke="var(--muted-foreground)" strokeWidth={1} />
              {series.map((s, slot) => (
                <circle
                  key={s.id}
                  cx={x(active)}
                  cy={y(data[active].values[s.id] ?? 0)}
                  r={4}
                  fill={seriesColor(slot)}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          <g data-slot="chart-x-axis">
            {labelIndices.map((index) => (
              <text
                key={data[index].key}
                x={x(index)}
                y={plotBottom + 18}
                textAnchor={index === 0 && count > 1 ? 'start' : index === count - 1 && count > 1 ? 'end' : 'middle'}
                fontSize={TICK_FONT}
                fill="var(--muted-foreground)"
              >
                {data[index].label}
              </text>
            ))}
          </g>
        </svg>
        {activeDatum && (
          <ChartTooltip
            title={activeDatum.detail ?? activeDatum.label}
            rows={rowsAt(active!)}
            x={x(active!) * (containerRef.current ? containerRef.current.clientWidth / width : 1)}
            y={plotTop}
            width={containerRef.current?.clientWidth ?? width}
          />
        )}
      </div>
    </ChartFrame>
  )
}

/** A line chart with its wash: one series, change over time. */
export function AreaChart(props: Omit<LineChartProps, 'area'>) {
  return <LineChart {...props} area className={cn(props.className)} />
}

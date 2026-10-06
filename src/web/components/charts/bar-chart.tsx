import { useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  ChartFrame,
  useSeriesVisibility,
  type ChartTitleProps,
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

export interface BarChartProps extends ChartTitleProps {
  /** One datum per category (or period), in display order. */
  data: readonly ChartDatum[]
  /** At most six, in slot order. One series needs no legend: the label names it. */
  series: readonly ChartSeries[]
  label: string
  /** What one unit on the value axis is. Stated with "· linear, from 0". */
  scaleLabel: string
  /** `grouped` bars side by side (compare series), `stacked` segments (part-to-whole). */
  layout?: 'grouped' | 'stacked'
  /** `vertical` columns, or `horizontal` bars for many or long-named categories. */
  orientation?: 'vertical' | 'horizontal'
  integer?: boolean
  formatValue?: (value: number) => string
  /** Plot height in px for vertical charts; horizontal charts grow with their rows. */
  height?: number
  empty?: ReactNode
  className?: string
}

/** Bars never fill their slot: past 24px they read as blocks, not marks. */
const MAX_BAR = 24
/** The surface gap between touching marks. */
const GAP = 2
const RADIUS = 4

/**
 * A rectangle with its data end rounded and its baseline end square, so the
 * bar reads as growing from the axis.
 */
function barPath(x: number, y: number, w: number, h: number, end: 'top' | 'right' | 'none') {
  const r = Math.min(RADIUS, w / 2, h / 2)
  if (end === 'none' || r <= 0) return `M${x},${y}h${w}v${h}h${-w}Z`
  if (end === 'top') {
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
  }
  return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`
}

/**
 * A bar chart: compare magnitude across categories. Grouped or stacked,
 * columns or horizontal bars. Every category is one hover and focus target;
 * the tooltip lists each series there, and the table view lists them all.
 */
export function BarChart({
  data,
  series: allSeries,
  label,
  scaleLabel,
  layout = 'grouped',
  orientation = 'vertical',
  integer = false,
  formatValue = defaultChartFormat,
  height = 240,
  empty,
  className,
  ...head
}: BarChartProps) {
  const [containerRef, width] = useChartWidth()
  const [active, setActive] = useState<number | null>(null)
  const visibility = useSeriesVisibility(allSeries.map((s) => s.id))
  const series = allSeries.filter((s) => visibility.isVisible(s.id))
  const slotOf = (id: string) => allSeries.findIndex((s) => s.id === id)
  const count = data.length
  if (count === 0 || series.length === 0) return <>{empty ?? null}</>

  const stacked = layout === 'stacked'
  const horizontal = orientation === 'horizontal'
  const totals = data.map((d) => series.reduce((sum, s) => sum + Math.max(0, d.values[s.id] ?? 0), 0))
  const max = stacked
    ? Math.max(0, ...totals)
    : Math.max(0, ...data.flatMap((d) => series.map((s) => d.values[s.id] ?? 0)))
  const ticks = chartValueTicks(max, { integer })
  const tickLabels = ticks.map(formatValue)
  const top = max > 0 ? max : 1

  // Horizontal: categories down the left, one row per category.
  const rowHeight = stacked ? 36 : Math.max(36, series.length * (MAX_BAR / 1.5 + GAP) + 16)
  const svgHeight = horizontal ? count * rowHeight + 28 : height
  const categoryLabelWidth = horizontal ? Math.min(160, axisTextWidth(data.map((d) => d.label)) + 12) : 0
  const margin = horizontal
    ? { top: 4, right: 16, bottom: 24, left: categoryLabelWidth }
    : { top: 12, right: 12, bottom: 26, left: axisTextWidth(tickLabels) + 16 }

  const plotLeft = margin.left
  const plotRight = width - margin.right
  const plotTop = margin.top
  const plotBottom = svgHeight - margin.bottom
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const bandSize = (horizontal ? plotHeight : plotWidth) / count
  const valueLength = horizontal ? plotWidth : plotHeight
  const scale = (value: number) => (Math.max(0, value) / top) * valueLength

  const groupCount = stacked ? 1 : series.length
  const barThickness = Math.max(2, Math.min(MAX_BAR, (bandSize * 0.7 - GAP * (groupCount - 1)) / groupCount))
  const groupThickness = barThickness * groupCount + GAP * (groupCount - 1)

  const rowsAt = (index: number): TooltipRow[] =>
    series.map((s, slot) => ({
      id: s.id,
      label: s.label,
      value: formatValue(data[index].values[s.id] ?? 0),
      color: seriesColor(slotOf(s.id)),
    }))

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (nextActiveIndex(event.key, active, count, { vertical: horizontal }) === undefined) return
    event.preventDefault()
    // From the latest state, so keys pressed faster than a render still step.
    setActive((current) => {
      const next = nextActiveIndex(event.key, current, count, { vertical: horizontal })
      return next === undefined ? current : next
    })
  }

  const bars = data.map((d, index) => {
    const bandStart = (horizontal ? plotTop : plotLeft) + index * bandSize
    const groupStart = bandStart + (bandSize - groupThickness) / 2
    const marks: ReactNode[] = []
    let stackBase = 0
    series.forEach((s, slot) => {
      const value = Math.max(0, d.values[s.id] ?? 0)
      if (value <= 0) return
      const length = scale(value)
      const offset = stacked ? scale(stackBase) : 0
      stackBase += value
      const isLastInStack = !stacked || series.slice(slot + 1).every((next) => (d.values[next.id] ?? 0) <= 0)
      const across = stacked ? groupStart : groupStart + slot * (barThickness + GAP)
      // A 2px surface gap between stacked segments.
      const seam = stacked && offset > 0 ? GAP : 0
      const path = horizontal
        ? barPath(plotLeft + offset + seam, across, Math.max(0.5, length - seam), barThickness, isLastInStack ? 'right' : 'none')
        : barPath(across, plotBottom - offset - length, barThickness, Math.max(0.5, length - seam), isLastInStack ? 'top' : 'none')
      marks.push(<path key={s.id} data-series={s.id} d={path} fill={seriesColor(slotOf(s.id))} />)
    })
    return (
      <g key={d.key} data-category={d.key} opacity={active !== null && active !== index ? 0.55 : 1}>
        {marks}
        {/* The whole band is the hit target, larger than the mark. */}
        <rect
          x={horizontal ? plotLeft : bandStart}
          y={horizontal ? bandStart : plotTop}
          width={horizontal ? plotWidth : bandSize}
          height={horizontal ? bandSize : plotHeight}
          fill="transparent"
          onPointerEnter={() => setActive(index)}
        />
      </g>
    )
  })

  const labelIndices = horizontal ? data.map((_, index) => index) : chartLabelIndices(count, plotWidth / 56)
  const activeDatum = active === null ? null : data[active]
  const tooltipAnchor =
    active === null
      ? { x: 0, y: 0 }
      : horizontal
        ? { x: plotLeft + scale(stacked ? totals[active] : Math.max(...series.map((s) => data[active].values[s.id] ?? 0))), y: plotTop + active * bandSize }
        : { x: plotLeft + (active + 0.5) * bandSize, y: plotTop }

  return (
    <ChartFrame
      {...head}
      label={label}
      className={className}
      scale={`${scaleLabel} · linear, from 0`}
      legend={
        allSeries.length > 1 ? (
          <ChartLegend
            items={allSeries.map((s, slot) => ({ id: s.id, label: s.label, color: seriesColor(slot) }))}
            {...visibility.legend}
          />
        ) : undefined
      }
      table={{
        columns: [
          horizontal ? 'Category' : 'Period',
          ...series.map((s) => s.label),
          ...(stacked && series.length > 1 ? ['Total'] : []),
        ],
        rows: data.map((d, index) => [
          d.detail ?? d.label,
          ...series.map((s) => formatValue(d.values[s.id] ?? 0)),
          ...(stacked && series.length > 1 ? [formatValue(totals[index])] : []),
        ]),
      }}
      announcement={activeDatum ? tooltipText(activeDatum.detail ?? activeDatum.label, rowsAt(active!)) : undefined}
    >
      <div
        ref={containerRef}
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}: ${count} categories. Arrow keys move between them.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className={plotClass}
      >
        <svg width="100%" height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`} className="block overflow-visible" aria-hidden="true">
          <g data-slot="chart-value-axis">
            {ticks.map((tick, index) => {
              const at = horizontal ? plotLeft + scale(tick) : plotBottom - scale(tick)
              return (
                <g key={tick}>
                  {horizontal ? (
                    <line x1={at} x2={at} y1={plotTop} y2={plotBottom} stroke="var(--border)" />
                  ) : (
                    <line x1={plotLeft} x2={plotRight} y1={at} y2={at} stroke="var(--border)" />
                  )}
                  <text
                    x={horizontal ? at : plotLeft - 8}
                    y={horizontal ? plotBottom + 16 : at}
                    dy={horizontal ? undefined : '0.32em'}
                    textAnchor={horizontal ? (index === ticks.length - 1 ? 'end' : 'middle') : 'end'}
                    fontSize={TICK_FONT}
                    fill="var(--muted-foreground)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {tickLabels[index]}
                  </text>
                </g>
              )
            })}
          </g>
          <g data-slot="chart-bars">{bars}</g>
          <g data-slot="chart-category-axis">
            {labelIndices.map((index) => (
              <text
                key={data[index].key}
                x={horizontal ? plotLeft - 8 : plotLeft + (index + 0.5) * bandSize}
                y={horizontal ? plotTop + (index + 0.5) * bandSize : plotBottom + 18}
                dy={horizontal ? '0.32em' : undefined}
                textAnchor={horizontal ? 'end' : 'middle'}
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
            x={tooltipAnchor.x}
            y={tooltipAnchor.y}
            width={width}
          />
        )}
      </div>
    </ChartFrame>
  )
}

import { useId, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import {
  ChartFrame,
  ChartLegend,
  ChartTooltip,
  LegendSwatch,
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
  useSeriesVisibility,
  type ChartDatum,
  type ChartTitleProps,
  type ChartViewOption,
  type TooltipRow,
} from './core'

/**
 * The ways the mixed chart draws its series, one at a time: bars side by side,
 * bars stacked into the period's total, lines, washed areas, dots.
 */
export type MixedChartMark = 'bar' | 'stacked' | 'line' | 'area' | 'dots'

export interface MixedChartSeries {
  /** Key into each datum's `values`. */
  id: string
  label: ReactNode
}

const MARK_VIEWS: Record<MixedChartMark, ChartViewOption> = {
  bar: { value: 'bar', label: 'Bars', icon: 'bar_chart' },
  stacked: { value: 'stacked', label: 'Stacked bars', icon: 'stacked_bar_chart' },
  line: { value: 'line', label: 'Lines', icon: 'show_chart' },
  area: { value: 'area', label: 'Areas', icon: 'area_chart' },
  dots: { value: 'dots', label: 'Dots', icon: 'scatter_plot' },
}

export interface MixedChartProps extends ChartTitleProps {
  /** One datum per period, in order. */
  data: readonly ChartDatum[]
  /** Colour follows the slot, as in every chart; at most six. */
  series: readonly MixedChartSeries[]
  /** Accessible name, and the table's caption. */
  label: string
  /** What one unit on the shared value axis is: "Volume, BTC". Stated with "· linear, from 0". */
  scaleLabel: string
  /** The views offered in the switch, in order; the first is drawn first. Defaults to all five. */
  marks?: readonly MixedChartMark[]
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
const MAX_BAR_GROUP = 56
const ALL_MARKS: readonly MixedChartMark[] = ['bar', 'stacked', 'line', 'area', 'dots']

/** The legend key for the current view: a swatch, a wash, a stroke, a dot. */
function MarkSwatch({ mark, color }: { mark: MixedChartMark; color: string }) {
  if (mark === 'area') {
    return (
      <svg width="12" height="12" aria-hidden="true" className="shrink-0">
        <rect width="12" height="12" rx="3" fill={color} fillOpacity="0.25" />
        <line x1="1" x2="11" y1="3" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return <LegendSwatch color={color} shape={mark === 'line' ? 'line' : mark === 'dots' ? 'dot' : 'rect'} />
}

/**
 * The same series over the same periods, drawn one way at a time: bars,
 * stacked bars, lines, areas or dots. The view switch on the title's line
 * offers each of them and the table; the series, the colours and the legend
 * stay the same from one view to the next.
 *
 * One value axis, linear from zero (from zero to the largest total when
 * stacked). The period under the pointer is highlighted and the tooltip lists
 * every series there; focus the plot and use ←/→, Home/End to walk the
 * periods, Escape to clear. The legend switches series off and on.
 */
export function MixedChart({
  data,
  series: allSeries,
  label,
  scaleLabel,
  marks = ALL_MARKS,
  integer = false,
  formatValue = defaultChartFormat,
  height = 280,
  empty,
  className,
  ...head
}: MixedChartProps) {
  const [containerRef, width] = useChartWidth()
  const [active, setActive] = useState<number | null>(null)
  const [chosen, setChosen] = useState<MixedChartMark>(marks[0] ?? 'bar')
  const mark = marks.includes(chosen) ? chosen : (marks[0] ?? 'bar')
  const idBase = `mixed-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const visibility = useSeriesVisibility(allSeries.map((s) => s.id))
  const series = allSeries.filter((s) => visibility.isVisible(s.id))
  const colorOf = (id: string) => seriesColor(allSeries.findIndex((s) => s.id === id))

  const count = data.length
  if (count === 0 || allSeries.length === 0) return <>{empty ?? null}</>

  const totals = data.map((d) => series.reduce((sum, s) => sum + Math.max(0, d.values[s.id] ?? 0), 0))
  const max =
    mark === 'stacked'
      ? Math.max(0, ...totals)
      : Math.max(0, ...data.flatMap((d) => series.map((s) => d.values[s.id] ?? 0)))
  const ticks = chartValueTicks(max, { integer })
  const tickLabels = ticks.map(formatValue)
  const plotLeft = MARGIN.left + axisTextWidth(tickLabels) + 8
  const plotRight = width - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = height - MARGIN.bottom
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const top = max > 0 ? max : 1
  // Periods are bands, so bars and points share one x: the band's centre.
  const band = plotWidth / count
  const x = (index: number) => plotLeft + band * (index + 0.5)
  const y = (value: number) => plotBottom - (Math.max(0, value) / top) * plotHeight
  const labelIndices = chartLabelIndices(count, plotWidth / 72)

  const groupWidth = Math.min(band * 0.7, MAX_BAR_GROUP)
  const barWidth =
    mark === 'stacked' ? groupWidth : Math.max(1, (groupWidth - (series.length - 1) * 2) / Math.max(1, series.length))

  const pathFor = (id: string) =>
    data.map((d, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(2)},${y(d.values[id] ?? 0).toFixed(2)}`).join('')

  const rowsAt = (index: number): TooltipRow[] =>
    series.map((s) => ({
      id: s.id,
      label: s.label,
      value: formatValue(data[index].values[s.id] ?? 0),
      color: colorOf(s.id),
    }))

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - box.left) / box.width) * width
    setActive(Math.max(0, Math.min(count - 1, Math.floor((px - plotLeft) / band))))
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

  const strokeFor = (s: MixedChartSeries) => (
    <path
      key={s.id}
      data-series={s.id}
      data-mark={mark}
      d={pathFor(s.id)}
      fill="none"
      stroke={colorOf(s.id)}
      strokeWidth={mark === 'area' ? 1.5 : 2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  )

  const marksLayer = () => {
    if (mark === 'bar' || mark === 'stacked') {
      return data.map((d, index) => {
        let stackTop = 0
        return series.map((s, position) => {
          const value = Math.max(0, d.values[s.id] ?? 0)
          const left =
            mark === 'stacked' ? x(index) - groupWidth / 2 : x(index) - groupWidth / 2 + position * (barWidth + 2)
          const bottom = mark === 'stacked' ? y(stackTop) : plotBottom
          if (mark === 'stacked') stackTop += value
          const barTop = mark === 'stacked' ? y(stackTop) : y(value)
          return (
            <rect
              key={`${s.id}-${d.key}`}
              data-series={s.id}
              data-mark={mark}
              x={left}
              y={barTop}
              width={barWidth}
              // A 1px surface gap between stacked segments.
              height={Math.max(0, bottom - barTop - (mark === 'stacked' && position > 0 ? 1 : 0))}
              rx={mark === 'stacked' ? 0 : Math.min(3, barWidth / 2)}
              fill={colorOf(s.id)}
            />
          )
        })
      })
    }
    if (mark === 'dots') {
      return series.map((s) => (
        <g key={s.id} data-series={s.id} data-mark="dots">
          {data.map((d, index) => (
            <circle key={d.key} cx={x(index)} cy={y(d.values[s.id] ?? 0)} r={4} fill={colorOf(s.id)} stroke="var(--card)" strokeWidth={1.5} />
          ))}
        </g>
      ))
    }
    if (mark === 'area') {
      return (
        <>
          {series.map((s) => (
            <path
              key={`${s.id}-wash`}
              d={`${pathFor(s.id)}L${x(count - 1)},${plotBottom}L${x(0)},${plotBottom}Z`}
              fill={`url(#${idBase}-wash-${s.id})`}
            />
          ))}
          {series.map(strokeFor)}
        </>
      )
    }
    return series.map(strokeFor)
  }

  return (
    <ChartFrame
      {...head}
      views={marks.map((m) => MARK_VIEWS[m])}
      chartView={mark}
      onChartViewChange={(next) => setChosen(next as MixedChartMark)}
      label={label}
      className={className}
      scale={`${scaleLabel} · linear, from 0`}
      legend={
        <ChartLegend
          items={allSeries.map((s) => ({
            id: s.id,
            label: s.label,
            color: colorOf(s.id),
            swatch: <MarkSwatch mark={mark} color={colorOf(s.id)} />,
          }))}
          {...visibility.legend}
        />
      }
      table={{
        columns: ['Period', ...allSeries.map((s) => s.label)],
        rows: data.map((d) => [d.detail ?? d.label, ...allSeries.map((s) => formatValue(d.values[s.id] ?? 0))]),
      }}
      announcement={activeDatum ? tooltipText(activeDatum.detail ?? activeDatum.label, rowsAt(active!)) : undefined}
    >
      <div
        ref={containerRef}
        role="group"
        aria-roledescription="chart"
        aria-label={`${label}: ${count} periods. Arrow keys move between them.`}
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
          <defs>
            {mark === 'area' &&
              series.map((s) => (
                <linearGradient key={s.id} id={`${idBase}-wash-${s.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={colorOf(s.id)} stopOpacity="0.22" />
                  <stop offset="1" stopColor={colorOf(s.id)} stopOpacity="0.03" />
                </linearGradient>
              ))}
          </defs>

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

          {active !== null && (
            <rect
              data-slot="chart-active-band"
              x={plotLeft + band * active}
              y={plotTop}
              width={band}
              height={plotBottom - plotTop}
              fill="var(--muted-foreground)"
              fillOpacity={0.08}
            />
          )}

          <g data-slot="chart-marks" data-view={mark}>
            {marksLayer()}
          </g>

          {active !== null && (
            <g data-slot="chart-crosshair">
              {(mark === 'bar' || mark === 'stacked' ? [] : series).map((s) => (
                <circle
                  key={s.id}
                  cx={x(active)}
                  cy={y(data[active].values[s.id] ?? 0)}
                  r={4.5}
                  fill={colorOf(s.id)}
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
                textAnchor="middle"
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

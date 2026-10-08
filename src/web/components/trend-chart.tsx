import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'
import { formatAmount } from '../utils/amount-display'
import {
  ChartDataTable,
  ChartHeader,
  ChartLegend,
  ChartLegendRow,
  ChartTooltip,
  tooltipText,
  type ChartTitleProps,
  type ChartView,
  type TooltipRow,
  useSeriesVisibility,
} from './charts/core'

/**
 * Series colours are the theme's own custom properties, never literals, so the
 * chart follows light and dark with the rest of the system. `info` and
 * `warning` take the chart ramp's purple and yellow (`--chart-4`, `--chart-2`).
 */
export type TrendChartTone = 'primary' | 'danger' | 'info' | 'warning' | 'muted'

/**
 * `solid` and `hatch` are what keep two series apart once colour is gone — a
 * greyscale print, a colour-blind reader, a projector that washes out the
 * green. Colour is a second cue on top of the texture, never the only one.
 */
export type TrendChartTexture = 'solid' | 'hatch'

export interface TrendChartSeries {
  /** Key into each point's `values`. */
  id: string
  label: ReactNode
  tone: TrendChartTone
  /** Defaults to `solid` for the first series and `hatch` for the rest. */
  texture?: TrendChartTexture
}

export interface TrendChartPoint {
  /** Stable identity of the period, e.g. its ISO start. */
  key: string
  /** Short axis label: "3 Sep", "14:00". */
  label: string
  /** Full label for the readout: "3 Sep 2026". Defaults to `label`. */
  detail?: string
  values: Readonly<Record<string, number>>
}

export interface TrendChartProps extends ChartTitleProps {
  points: readonly TrendChartPoint[]
  /** Stacked bottom to top, in this order. */
  series: readonly TrendChartSeries[]
  /**
   * What one unit on the value axis is, stated on the chart: "Swaps per day".
   * The axis always starts at zero and is linear; that is said beside it.
   */
  scaleLabel: string
  /** Accessible name of the chart as a whole. */
  label: string
  /** Rendered instead of the chart when there are no points. Never an empty frame. */
  empty?: ReactNode
  /** Formats axis labels and the readout. Defaults to en-US grouping. */
  formatValue?: (value: number) => string
  /** Plot height in px, axes included. */
  height?: number
  /**
   * Chart or table, controlled. Leave both out and the chart keeps its own
   * view; pass them when the host keeps the view in its own state (an address,
   * a saved preference), so the chart's switch is the only one on screen.
   */
  view?: ChartView
  onViewChange?: (view: ChartView) => void
  className?: string
}

const toneFill: Record<TrendChartTone, string> = {
  // The charts' green, so every chart draws the same one.
  primary: 'var(--series-1)',
  danger: 'var(--destructive)',
  info: 'var(--chart-4)',
  warning: 'var(--chart-2)',
  muted: 'var(--muted-foreground)',
}

const defaultFormat = (value: number) => formatAmount(value)

const MARGIN = { top: 8, right: 8, bottom: 24, left: 8 }
/** The `tiny` step of the type scale, in px — SVG text takes a number. */
const TICK_FONT = 11
/** Room one time-axis label needs, so labels never touch. */
const X_LABEL_SPACING = 64
/** Width drawn before the container has been measured (server render, first paint). */
const FALLBACK_WIDTH = 640
/** Bars stop growing past this, so a short series does not read as a few slabs. */
const MAX_BAR_WIDTH = 40

/**
 * Value-axis ticks that only name values the chart reaches.
 *
 * A conventional "nice" axis rounds its top up — data peaking at 37 gets an
 * axis to 40, and "40" labels a height no bar reaches. Here the top of the
 * scale IS the peak and carries its own label; the round steps below it are
 * kept only where they do not crowd that label.
 */
export function trendChartTicks(max: number): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0]
  const rough = max / 4
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude
  // Counts are whole; a step of 0.5 would label heights between two counts.
  const wholeStep = Math.max(1, Math.round(step))
  const ticks = [0]
  for (let value = wholeStep; value < max - max * 0.15; value += wholeStep) ticks.push(value)
  ticks.push(max)
  return ticks
}

/** Indices that get an axis label: first and last always, evenly spaced between. */
export function trendChartLabelIndices(count: number, maxLabels: number): number[] {
  if (count <= 0) return []
  if (count === 1) return [0]
  const slots = Math.max(2, Math.min(count, Math.floor(maxLabels)))
  const indices = new Set<number>()
  for (let slot = 0; slot < slots; slot += 1) {
    indices.add(Math.round((slot * (count - 1)) / (slots - 1)))
  }
  return [...indices].sort((a, b) => a - b)
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * The container's width, so the SVG's viewBox is drawn in real pixels.
 *
 * The SVG itself is `width="100%"`: a fixed pixel width would become its grid
 * column's min-content and force the page to scroll sideways. Measuring the
 * container instead keeps text and bars at 1:1 without holding the column open.
 */
function useElementWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(FALLBACK_WIDTH)
  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measured = Math.round(element.getBoundingClientRect().width)
    if (measured > 0) setWidth(measured)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width)
      if (next > 0) setWidth(next)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/**
 * A stacked bar chart over a time axis — one bar per period, one segment per
 * series.
 *
 * Built for the partner dashboard's swap trend (completed and failed per
 * bucket), and sized for its widest case: about 120 periods (a year at weekly,
 * ninety days at daily) readable at card width without scrolling.
 *
 * Every value it draws can be read off an axis: the value axis is linear from
 * zero, its top is the tallest bar, and every label on it names a height the
 * data reaches. Periods are read by hovering, or by focusing the plot and using
 * the arrow keys; the period's figures show in a tooltip by its bar, as in the
 * line and area charts, and a hidden live region says them to a screen reader.
 *
 * It draws nothing when there are no points: an empty period is the consumer's
 * empty state, passed as `empty`, not a frame with no bars in it.
 */
export function TrendChart({
  points,
  series: allSeries,
  scaleLabel,
  label,
  empty,
  formatValue = defaultFormat,
  height = 220,
  view: controlledView,
  onViewChange,
  className,
  ...head
}: TrendChartProps) {
  const [containerRef, width] = useElementWidth()
  const [active, setActive] = useState<number | null>(null)
  const [ownView, setOwnView] = useState<ChartView>('chart')
  const view = controlledView ?? ownView
  const setView = (next: ChartView) => {
    if (controlledView === undefined) setOwnView(next)
    onViewChange?.(next)
  }
  // Each series keeps its own texture when another is switched off.
  const styledSeries = allSeries.map((s, index) => ({ ...s, texture: s.texture ?? (index === 0 ? 'solid' : 'hatch') }))
  const visibility = useSeriesVisibility(allSeries.map((s) => s.id))
  const series = styledSeries.filter((s) => visibility.isVisible(s.id))
  const idBase = `trend-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const count = points.length

  const moveActive = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (count === 0) return
      const current = active ?? -1
      let next: number | null | undefined
      switch (event.key) {
        case 'ArrowRight':
          next = Math.min(count - 1, current + 1)
          break
        case 'ArrowLeft':
          next = current < 0 ? count - 1 : Math.max(0, current - 1)
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = count - 1
          break
        case 'Escape':
          next = null
          break
        default:
          return
      }
      event.preventDefault()
      setActive(next)
    },
    [active, count],
  )

  if (count === 0) return <>{empty ?? null}</>

  const textures = series.map((s) => s.texture)
  const totals = points.map((point) =>
    series.reduce((sum, s) => sum + Math.max(0, point.values[s.id] ?? 0), 0),
  )
  const max = Math.max(0, ...totals)
  const ticks = trendChartTicks(max)
  const tickLabels = ticks.map(formatValue)
  // Tabular digits are ~0.62em wide; the axis is as wide as its longest label.
  const axisWidth = Math.max(...tickLabels.map((t) => t.length)) * TICK_FONT * 0.62 + 8

  const plotLeft = MARGIN.left + axisWidth
  const plotRight = width - MARGIN.right
  const plotTop = MARGIN.top
  const plotBottom = height - MARGIN.bottom
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const domainTop = max > 0 ? max : 1
  const y = (value: number) => plotBottom - (value / domainTop) * plotHeight

  const band = plotWidth / count
  // Wide bands leave a gap between bars; at 120 periods a band is a few px and
  // the bars nearly touch, which still reads as a series.
  const barWidth = band >= 4 ? Math.min(band * 0.72, MAX_BAR_WIDTH) : Math.max(1, band - 0.75)
  const barOffset = (band - barWidth) / 2
  const labelIndices = trendChartLabelIndices(count, plotWidth / X_LABEL_SPACING)

  const fillFor = (index: number) =>
    textures[index] === 'hatch' ? `url(#${idBase}-hatch-${index})` : toneFill[series[index].tone]

  const activePoint = active === null ? null : points[active]
  const readoutId = `${idBase}-readout`
  // The period's figures, as the Area chart shows them: a tooltip by the bar.
  const activeRows: TooltipRow[] = activePoint
    ? series.map((s) => ({
        id: s.id,
        label: s.label,
        value: formatValue(activePoint.values[s.id] ?? 0),
        color: toneFill[s.tone],
      }))
    : []
  const activeTitle = activePoint ? (activePoint.detail ?? activePoint.label) : ''
  // The SVG is drawn in measured px; the tooltip is placed in the container's.
  const containerWidth = containerRef.current?.clientWidth ?? width
  const toContainer = width > 0 ? containerWidth / width : 1

  return (
    <figure
      data-slot="trend-chart"
      aria-label={label}
      className={cn('m-0 min-w-0 space-y-2', className)}
    >
      <ChartHeader {...head} view={view} onViewChange={setView} />

      {view === 'table' && (
        <ChartDataTable
          label={label}
          table={{
            columns: ['Period', ...series.map((s) => s.label), 'Total'],
            rows: points.map((point, index) => [
              point.detail ?? point.label,
              ...series.map((s) => formatValue(point.values[s.id] ?? 0)),
              formatValue(totals[index]),
            ]),
          }}
        />
      )}

      {/* What the tooltip shows, said to a screen reader as the period changes. */}
      <p id={readoutId} data-slot="trend-chart-readout" aria-live="polite" className="sr-only">
        {activePoint ? tooltipText(activeTitle, activeRows) : ''}
      </p>

      {/* Hidden, not unmounted, in the table view: it keeps measuring its width. */}
      <div
        ref={containerRef}
        hidden={view === 'table'}
        role="group"
        aria-roledescription="chart"
        tabIndex={0}
        aria-describedby={readoutId}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End Escape"
        aria-label={`${label}: ${count} periods. Arrow keys move between them.`}
        onKeyDown={moveActive}
        onBlur={() => setActive(null)}
        className="relative mt-5 w-full min-w-0 rounded-xl outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft"
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block overflow-visible"
          onPointerLeave={() => setActive(null)}
          aria-hidden="true"
        >
          <defs>
            {series.map((s, index) =>
              textures[index] === 'hatch' ? (
                <Texture key={s.id} id={`${idBase}-hatch-${index}`} tone={s.tone} texture="hatch" />
              ) : null,
            )}
          </defs>

          <g data-slot="trend-chart-y-axis">
            {ticks.map((tick, index) => (
              <g key={tick}>
                <line
                  x1={plotLeft}
                  x2={plotRight}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="var(--border)"
                  strokeDasharray={tick === 0 ? undefined : '2 3'}
                />
                <text
                  x={plotLeft - 6}
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
              data-slot="trend-chart-active"
              x={plotLeft + active * band}
              y={plotTop}
              width={band}
              height={plotHeight}
              // Violet wash (the chart ramp's brand purple) marks the read period.
              fill="var(--chart-4)"
              opacity={0.14}
            />
          )}

          <g data-slot="trend-chart-bars">
            {points.map((point, pointIndex) => {
              let base = 0
              return (
                <g key={point.key} data-period={point.key}>
                  {series.map((s, seriesIndex) => {
                    const value = point.values[s.id] ?? 0
                    if (value <= 0) return null
                    const top = y(base + value)
                    const bottom = y(base)
                    base += value
                    const hatched = textures[seriesIndex] === 'hatch'
                    return (
                      <rect
                        key={s.id}
                        data-series={s.id}
                        x={plotLeft + pointIndex * band + barOffset}
                        y={top}
                        width={barWidth}
                        // A 1px seam between stacked segments, so they part
                        // even where their colours are close.
                        height={Math.max(0.5, bottom - top - (seriesIndex > 0 ? 1 : 0))}
                        fill={fillFor(seriesIndex)}
                        stroke={hatched ? toneFill[s.tone] : undefined}
                        strokeWidth={hatched && barWidth >= 4 ? 1 : 0}
                      />
                    )
                  })}
                  {/* The whole band is the hover target, not just the bar. */}
                  <rect
                    x={plotLeft + pointIndex * band}
                    y={plotTop}
                    width={band}
                    height={plotHeight}
                    fill="transparent"
                    onPointerEnter={() => setActive(pointIndex)}
                  />
                </g>
              )
            })}
          </g>

          <g data-slot="trend-chart-x-axis">
            {labelIndices.map((index) => (
              <text
                key={points[index].key}
                x={plotLeft + index * band + band / 2}
                y={plotBottom + 16}
                textAnchor={
                  index === 0 && count > 1 ? 'start' : index === count - 1 && count > 1 ? 'end' : 'middle'
                }
                fontSize={TICK_FONT}
                fill="var(--muted-foreground)"
              >
                {points[index].label}
              </text>
            ))}
          </g>
        </svg>
        {activePoint && (
          <ChartTooltip
            title={activeTitle}
            rows={activeRows}
            swatch="rect"
            x={(plotLeft + active! * band + band / 2) * toContainer}
            y={plotTop}
            width={containerWidth}
          />
        )}
      </div>
      {view === 'chart' && (
        <ChartLegendRow>
          <ChartLegend
            items={styledSeries.map((s, index) => ({
              id: s.id,
              label: s.label,
              color: toneFill[s.tone],
              swatch: (
                <svg width="12" height="12" aria-hidden="true" className="shrink-0">
                  <Texture id={`${idBase}-legend-${index}`} tone={s.tone} texture={s.texture} />
                  <rect
                    width="12"
                    height="12"
                    rx="2"
                    fill={s.texture === 'hatch' ? `url(#${idBase}-legend-${index})` : toneFill[s.tone]}
                    stroke={toneFill[s.tone]}
                  />
                </svg>
              ),
            }))}
            {...visibility.legend}
          />
        </ChartLegendRow>
      )}
      <p data-slot="trend-chart-scale" className="sr-only">
        {scaleLabel} · linear, from 0
      </p>
    </figure>
  )
}

function Texture({
  id,
  tone,
  texture,
}: {
  id: string
  tone: TrendChartTone
  texture: TrendChartTexture
}) {
  if (texture !== 'hatch') return null
  return (
    <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="4" height="4" fill={toneFill[tone]} opacity={0.25} />
      <rect width="2" height="4" fill={toneFill[tone]} />
    </pattern>
  )
}

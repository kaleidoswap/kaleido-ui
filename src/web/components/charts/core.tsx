import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { chartSeriesLimit } from '../../../tokens/chart'
import { cn } from '../../utils/cn'
import { formatAmount } from '../../utils/amount-display'
import { Icon } from '../../primitives/icon'
import { FilterChipGroup, type FilterChipOption } from '../filter-chip-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../primitives/table'

// The parts every kaleido-ui chart is made of. The rules they enforce come
// from the dataviz method the charts were designed against:
//
//   * Colour follows the series' slot, in the fixed order of `chartSeries`,
//     never its rank — and never cycles past the last slot.
//   * Marks carry colour; text never does (values, labels and legends stay in
//     text tokens beside a coloured key).
//   * Gridlines and axes are solid hairlines on the `border` token.
//   * Every chart has a table view, so no value is reachable only by hovering
//     — and on the light theme, where two series slots sit below 3:1 on white,
//     the table is the relief channel the palette requires.
//   * A legend is present for two or more series.

export interface ChartSeries {
  /** Key into each datum's `values`. */
  id: string
  label: string
}

export interface ChartDatum {
  /** Stable identity: an ISO date, a category id. */
  key: string
  /** Short axis label: "Sep", "Mon", "Lightning". */
  label: string
  /** Full label for the tooltip and table: "September 2026". Defaults to `label`. */
  detail?: string
  values: Readonly<Record<string, number>>
}

/** The series colour for a slot. Slots past the palette are a bug, not a new hue. */
export const seriesColor = (slot: number) => `var(--series-${(slot % chartSeriesLimit) + 1})`

export const defaultChartFormat = (value: number) => formatAmount(value)

/** Space for axis labels: tiny (11 px) tabular digits are ~0.62em wide. */
export const TICK_FONT = 11
export const axisTextWidth = (labels: readonly string[]) =>
  Math.max(0, ...labels.map((label) => label.length)) * TICK_FONT * 0.62

/**
 * Value-axis ticks that only name values the chart reaches: from zero, round
 * steps below the top, and the top itself is the largest value, labelled. A
 * conventional axis rounds 37 up to 40, and "40" then labels a height no mark
 * reaches. `integer` keeps steps whole for counts.
 */
export function chartValueTicks(max: number, { integer = false } = {}): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0]
  const rough = max / 4
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  let step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude
  if (integer) step = Math.max(1, Math.round(step))
  const ticks = [0]
  for (let value = step; value < max - max * 0.15; value += step) {
    ticks.push(Number(value.toPrecision(12)))
  }
  ticks.push(max)
  return ticks
}

/** Indices that get a category label: first and last always, evenly spaced between. */
export function chartLabelIndices(count: number, maxLabels: number): number[] {
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
 * The container's width in px, so an SVG can be `width="100%"` with a viewBox
 * in real pixels. A fixed pixel width would become its grid column's
 * min-content and push the page into a sideways scroll.
 */
export function useChartWidth(fallback = 640) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(fallback)
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

// ── Legend ──────────────────────────────────────────────────────────────────

export type LegendKey = 'rect' | 'line' | 'dot'

export function ChartLegend({
  items,
  keyShape = 'rect',
  className,
}: {
  items: readonly { id: string; label: ReactNode; color: string }[]
  /** Mirrors the mark: a swatch for bars and areas, a stroke for lines, a dot for points. */
  keyShape?: LegendKey
  className?: string
}) {
  return (
    <ul
      data-slot="chart-legend"
      className={cn('m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-caption text-foreground', className)}
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-1.5">
          <LegendSwatch color={item.color} shape={keyShape} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export function LegendSwatch({ color, shape = 'rect' }: { color: string; shape?: LegendKey }) {
  return (
    <svg width="12" height="12" aria-hidden="true" className="shrink-0">
      {shape === 'line' ? (
        <line x1="1" x2="11" y1="6" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      ) : shape === 'dot' ? (
        <circle cx="6" cy="6" r="4" fill={color} />
      ) : (
        <rect width="12" height="12" rx="3" fill={color} />
      )}
    </svg>
  )
}

// ── Tooltip ─────────────────────────────────────────────────────────────────

export interface TooltipRow {
  id: string
  label: ReactNode
  value: string
  color: string
}

/**
 * The hover/focus readout: the value leads (strong), the series follows
 * (muted), each keyed by a short stroke of its colour. Positioned inside the
 * plot's relative container, flipped to stay inside it.
 */
export function ChartTooltip({
  title,
  rows,
  x,
  y,
  width,
}: {
  title: ReactNode
  rows: readonly TooltipRow[]
  /** Anchor, in px from the plot container's top-left. */
  x: number
  y: number
  /** The container's width, to flip the tooltip left of the anchor near the right edge. */
  width: number
}) {
  const flip = x > width * 0.6
  return (
    <div
      data-slot="chart-tooltip"
      role="presentation"
      className="pointer-events-none absolute z-10 min-w-32 rounded-xl bg-popover bg-gradient-card-hero px-3 py-2 text-caption text-popover-foreground shadow-popover ring-1 ring-inset ring-secondary/15"
      style={{
        left: flip ? undefined : x + 12,
        right: flip ? width - x + 12 : undefined,
        top: Math.max(0, y - 8),
      }}
    >
      <div className="mb-1 font-semibold text-foreground">{title}</div>
      <ul className="m-0 list-none space-y-0.5 p-0">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-2 whitespace-nowrap">
            <LegendSwatch color={row.color} shape="line" />
            <span className="font-semibold tabular-nums text-foreground">{row.value}</span>
            <span className="text-muted-foreground">{row.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The same readout as text, for the live region a keyboard user hears. */
export const tooltipText = (title: string, rows: readonly TooltipRow[]) =>
  [title, ...rows.map((row) => `${row.value} ${typeof row.label === 'string' ? row.label : ''}`.trim())].join(' · ')

// ── Keyboard ────────────────────────────────────────────────────────────────

/**
 * ←/→ (and ↑/↓ for vertical lists of marks), Home/End and Escape over `count`
 * marks. Returns the next index, `null` to clear, or `undefined` for a key the
 * chart does not handle.
 */
export function nextActiveIndex(
  key: string,
  current: number | null,
  count: number,
  { vertical = false } = {},
): number | null | undefined {
  if (count === 0) return undefined
  const at = current ?? -1
  const forward = vertical ? 'ArrowDown' : 'ArrowRight'
  const back = vertical ? 'ArrowUp' : 'ArrowLeft'
  switch (key) {
    case forward:
      return Math.min(count - 1, at + 1)
    case back:
      return at < 0 ? count - 1 : Math.max(0, at - 1)
    case 'Home':
      return 0
    case 'End':
      return count - 1
    case 'Escape':
      return null
    default:
      return undefined
  }
}

// ── Frame ───────────────────────────────────────────────────────────────────

export interface ChartTable {
  columns: readonly string[]
  rows: readonly (readonly ReactNode[])[]
}

export interface ChartFrameProps {
  /** Accessible name of the chart; also the table's caption. */
  label: string
  /** A line above the plot that says what is measured: "Swaps per day · linear, from 0". */
  scale?: ReactNode
  legend?: ReactNode
  /** The chart's data as a table: the view that needs no pointer, and no colour. */
  table: ChartTable
  /** The live readout for keyboard users (visually hidden). */
  announcement?: string
  children: ReactNode
  className?: string
}

type ChartView = 'chart' | 'table'

const viewOptions: readonly FilterChipOption<ChartView>[] = [
  { value: 'chart', ariaLabel: 'Chart', icon: <Icon name="bar_chart" size="sm" /> },
  { value: 'table', ariaLabel: 'Table', icon: <Icon name="table_rows" size="sm" /> },
]

/**
 * A chart's frame: its name, scale line and legend above; the plot or, one
 * segment away, the same numbers as a table.
 */
export function ChartFrame({
  label,
  scale,
  legend,
  table,
  announcement,
  children,
  className,
}: ChartFrameProps) {
  const [view, setView] = useState<ChartView>('chart')
  return (
    <figure data-slot="chart" aria-label={label} className={cn('m-0 min-w-0 space-y-3', className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0 space-y-1">
          {scale && (
            <p data-slot="chart-scale" className="m-0 text-caption text-muted-foreground">
              {scale}
            </p>
          )}
          {legend}
        </div>
        <div data-slot="chart-view-toggle" className="shrink-0">
          <FilterChipGroup
            variant="segmented"
            ariaLabel="View"
            options={viewOptions}
            value={view}
            onChange={setView}
          />
        </div>
      </div>
      {view === 'chart' ? (
        children
      ) : (
        <Table>
          <caption className="sr-only">{label}</caption>
          <TableHeader>
            <TableRow>
              {table.columns.map((column, index) => (
                <TableHead key={column} className={index > 0 ? 'text-right' : undefined}>
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className={cellIndex > 0 ? 'text-right tabular-nums' : undefined}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement ?? ''}
      </p>
    </figure>
  )
}

/** Shared plot container classes: focusable, ringed on keyboard focus. */
export const plotClass =
  'relative w-full min-w-0 rounded-xl outline-none transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft'

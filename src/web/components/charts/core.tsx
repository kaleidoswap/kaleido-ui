import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { chartSeriesLimit } from '../../../tokens/chart'
import { cn } from '../../utils/cn'
import { formatAmount } from '../../utils/amount-display'
import { Icon, type IconName } from '../../primitives/icon'
import { IconButton } from '../../primitives/icon-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../primitives/dropdown-menu'
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

export interface ChartLegendItem {
  id: string
  label: ReactNode
  color: string
  /** A key drawn by the chart itself (a hatched swatch), in place of the shape. */
  swatch?: ReactNode
}

/**
 * The legend, centred under the plot. With `onToggle` every entry is a button
 * that switches its series off and on (`aria-pressed`); a switched-off entry
 * is dimmed and struck through. The last visible series cannot be switched off.
 */
export function ChartLegend({
  items,
  keyShape = 'rect',
  hidden,
  onToggle,
  className,
}: {
  items: readonly ChartLegendItem[]
  /** Mirrors the mark: a swatch for bars and areas, a stroke for lines, a dot for points. */
  keyShape?: LegendKey
  /** The ids switched off. */
  hidden?: ReadonlySet<string>
  onToggle?: (id: string) => void
  className?: string
}) {
  const visibleCount = items.filter((item) => !hidden?.has(item.id)).length
  return (
    <ul
      data-slot="chart-legend"
      className={cn('m-0 flex list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0 text-caption text-foreground', className)}
    >
      {items.map((item) => {
        const off = hidden?.has(item.id) ?? false
        const key = item.swatch ?? <LegendSwatch color={item.color} shape={keyShape} />
        return (
          <li key={item.id} className="flex items-center">
            {onToggle ? (
              <button
                type="button"
                aria-pressed={!off}
                disabled={!off && visibleCount <= 1}
                title={off ? 'Show' : 'Hide'}
                onClick={() => onToggle(item.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-foreground transition-all hover-gradient-violet focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-default disabled:hover:bg-none',
                  off && 'opacity-45 line-through',
                )}
              >
                {key}
                {item.label}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-1.5 py-0.5">
                {key}
                {item.label}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Which series are switched off from the legend. `isVisible` filters the
 * series to draw; `legend` spreads onto `ChartLegend`. Colour stays with the
 * series' own slot, so switching one off never repaints the others.
 */
export function useSeriesVisibility(ids: readonly string[]) {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set())
  const onToggle = (id: string) =>
    setHidden((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else if (ids.filter((other) => !next.has(other)).length > 1) next.add(id)
      return next
    })
  // Only ids still in the series count: one that left while switched off must
  // not stay hidden, or a series set narrowed to it would draw nothing.
  const hiddenNow = useMemo(() => {
    const kept = new Set(ids.filter((id) => hidden.has(id)))
    // At least one series stays on, as the legend's own toggle guarantees.
    return ids.length > 0 && kept.size >= ids.length ? new Set<string>() : kept
  }, [ids, hidden])
  return {
    isVisible: (id: string) => !hiddenNow.has(id),
    legend: { hidden: hiddenNow as ReadonlySet<string>, onToggle },
  }
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
  swatch = 'line',
}: {
  title: ReactNode
  rows: readonly TooltipRow[]
  /** Anchor, in px from the plot container's top-left. */
  x: number
  y: number
  /** The container's width, to flip the tooltip left of the anchor near the right edge. */
  width: number
  /** The key beside each row, matching the marks: `line` for lines and areas, `rect` for bars. */
  swatch?: LegendKey
}) {
  const flip = x > width * 0.6
  return (
    <div
      data-slot="chart-tooltip"
      role="presentation"
      className="pointer-events-none absolute z-10 min-w-32 rounded-xl bg-popover bg-gradient-card-hero px-3 py-2 text-caption text-popover-foreground shadow-popover"
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
            <LegendSwatch color={row.color} shape={swatch} />
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
  columns: readonly ReactNode[]
  rows: readonly (readonly ReactNode[])[]
}

export interface ChartTimeframe {
  value: string
  /** Short: "7D", "1M", "1Y". */
  label: string
}

export interface ChartFilter {
  value: string
  /** What it narrows to, as an item in the menu: "Settled only". */
  label: string
}

/**
 * A chart's head. The timeframe selector, the filters menu and the chart /
 * table switch sit on the title's line, centred on it. Timeframe and filters
 * are controlled: the chart draws the data it is given, so the consumer swaps
 * the data on change.
 */
export interface ChartTitleProps {
  title?: ReactNode
  /** A line under the title: what is measured, and on what scale. */
  description?: ReactNode
  timeframes?: readonly ChartTimeframe[]
  timeframe?: string
  onTimeframeChange?: (timeframe: string) => void
  /** Further filters, beside the timeframe: a menu of switches, each on or off. */
  filters?: readonly ChartFilter[]
  /** The `value`s of the filters that are on. */
  activeFilters?: readonly string[]
  onFiltersChange?: (active: string[]) => void
}

/** One way to draw the chart, offered in the view switch beside the table. */
export interface ChartViewOption {
  value: string
  /** The option's name and tooltip: "Bars", "Line". */
  label: string
  icon: IconName
}

/**
 * Several ways to draw the same data. The view switch then offers each of
 * them and the table, instead of chart / table; the chart draws `chartView`.
 */
export interface ChartViewsProps {
  views?: readonly ChartViewOption[]
  chartView?: string
  onChartViewChange?: (view: string) => void
}

export interface ChartFrameProps extends ChartTitleProps, ChartViewsProps {
  /** Accessible name of the chart; also the table's caption. */
  label: string
  /**
   * What is measured: "Swaps per day · linear, from 0". Read to screen
   * readers, not drawn: show it as the chart's description, under its title.
   */
  scale?: ReactNode
  legend?: ReactNode
  /** The chart's data as a table: the view that needs no pointer, and no colour. */
  table: ChartTable
  /** The live readout for keyboard users (visually hidden). */
  announcement?: string
  children: ReactNode
  className?: string
}

export type ChartView = 'chart' | 'table'

const viewOptions: readonly FilterChipOption<ChartView>[] = [
  { value: 'chart', ariaLabel: 'Chart', icon: <Icon name="bar_chart" size="sm" /> },
  { value: 'table', ariaLabel: 'Table', icon: <Icon name="table_rows" size="sm" /> },
]

const tableOption: FilterChipOption<string> = viewOptions[1]

/**
 * The view switch every chart carries, on its title's line: chart / table, or
 * with `views` each way of drawing the chart and the table.
 */
export function ChartViewToggle({
  view,
  onChange,
  views,
  chartView,
  onChartViewChange,
}: { view: ChartView; onChange: (view: ChartView) => void } & ChartViewsProps) {
  const options: readonly FilterChipOption<string>[] =
    views && views.length > 0
      ? [...views.map((v) => ({ value: v.value, ariaLabel: v.label, icon: <Icon name={v.icon} size="sm" /> })), tableOption]
      : viewOptions
  const value = view === 'table' ? 'table' : views && views.length > 0 ? (chartView ?? views[0].value) : 'chart'
  return (
    <div data-slot="chart-view-toggle" className="shrink-0">
      <FilterChipGroup
        variant="segmented"
        ariaLabel="View"
        options={options}
        value={value}
        onChange={(next) => {
          if (next === 'table') return onChange('table')
          onChange('chart')
          if (views && views.length > 0) onChartViewChange?.(next)
        }}
      />
    </div>
  )
}

/**
 * The timeframe picker: an icon-only button that opens a menu of the
 * timeframes, the current one checked. The button's name and tooltip say
 * the current timeframe, since the glyph alone cannot.
 */
export function ChartTimeframeMenu({
  timeframes,
  value,
  onChange,
}: {
  timeframes: readonly ChartTimeframe[]
  value: string
  onChange: (timeframe: string) => void
}) {
  const current = timeframes.find((t) => t.value === value) ?? timeframes[0]
  return (
    <div data-slot="chart-timeframe" className="shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton icon="event" label={`Timeframe: ${current.label}`} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-28">
          {timeframes.map((t) => (
            <DropdownMenuItem
              key={t.value}
              onSelect={() => onChange(t.value)}
              icon={<Icon name="check" className={t.value === current.value ? undefined : 'invisible'} />}
            >
              {t.label}
              {t.value === current.value && <span className="sr-only"> (current)</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/**
 * The filters menu: an icon-only button beside the timeframe that opens a
 * menu of switches. Each item turns its filter on or off and the menu stays
 * open, so several can be set in one visit. With any on, the button takes the
 * surface tint and its name counts them, since the glyph alone cannot.
 */
export function ChartFiltersMenu({
  filters,
  active,
  onChange,
}: {
  filters: readonly ChartFilter[]
  active: readonly string[]
  onChange: (active: string[]) => void
}) {
  const on = filters.filter((f) => active.includes(f.value))
  const toggle = (value: string) =>
    onChange(active.includes(value) ? active.filter((v) => v !== value) : [...active, value])
  return (
    <div data-slot="chart-filters" className="shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon="tune"
            variant={on.length > 0 ? 'surface' : 'quiet'}
            label={on.length > 0 ? `Filters: ${on.length} on` : 'Filters'}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-44">
          {filters.map((f) => {
            const checked = active.includes(f.value)
            return (
              <DropdownMenuItem
                key={f.value}
                role="menuitemcheckbox"
                aria-checked={checked}
                // Keep the menu open: a filter is a switch, not a destination.
                onSelect={(event) => {
                  event.preventDefault()
                  toggle(f.value)
                }}
                icon={<Icon name="check" className={checked ? undefined : 'invisible'} />}
              >
                {f.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/**
 * The head of a chart: the title at the top left with the description right
 * under it, and the timeframe / chart-table switch at the top right. Without a
 * title or description the switch sits alone at the right.
 */
export function ChartHeader({
  title,
  description,
  timeframes,
  timeframe,
  onTimeframeChange,
  filters,
  activeFilters,
  onFiltersChange,
  view,
  onViewChange,
  views,
  chartView,
  onChartViewChange,
}: ChartTitleProps & ChartViewsProps & { view: ChartView; onViewChange: (view: ChartView) => void }) {
  const showTimeframes = timeframes && timeframes.length > 0 && onTimeframeChange
  const showFilters = filters && filters.length > 0 && onFiltersChange
  const hasText = Boolean(title || description)
  return (
    <div
      data-slot="chart-header"
      className={cn('flex flex-wrap items-start gap-x-4 gap-y-2', hasText ? 'justify-between' : 'justify-end')}
    >
      {hasText && (
        <div className="flex min-w-0 flex-col gap-1">
          {title && (
            <h3 className="m-0 text-subhead font-semibold leading-none tracking-tight text-foreground">{title}</h3>
          )}
          {description && <p className="m-0 text-caption text-muted-foreground">{description}</p>}
        </div>
      )}
      {/* One tight row of controls: filters, timeframe, then the chart / table switch. */}
      <div className="flex shrink-0 items-center gap-1">
        {(showTimeframes || showFilters) && (
          <div className="flex items-center gap-0.5">
            {showFilters && (
              <ChartFiltersMenu filters={filters} active={activeFilters ?? []} onChange={onFiltersChange} />
            )}
            {showTimeframes && (
              <ChartTimeframeMenu
                timeframes={timeframes}
                value={timeframe ?? timeframes[0].value}
                onChange={onTimeframeChange}
              />
            )}
          </div>
        )}
        <ChartViewToggle
          view={view}
          onChange={onViewChange}
          views={views}
          chartView={chartView}
          onChartViewChange={onChartViewChange}
        />
      </div>
    </div>
  )
}

/** The legend, under the plot. The table view has no legend: its columns name the series. */
export function ChartLegendRow({ children }: { children: ReactNode }) {
  return <div data-slot="chart-legend-row">{children}</div>
}

/** A chart's numbers as a table: the first column names the row, the rest are figures. */
export function ChartDataTable({ label, table }: { label: string; table: ChartTable }) {
  return (
    <Table>
      <caption className="sr-only">{label}</caption>
      <TableHeader>
        <TableRow>
          {table.columns.map((column, index) => (
            <TableHead key={index} className={index > 0 ? 'text-right' : undefined}>
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
  )
}

/**
 * A chart's frame: the title and the chart / table switch on one line, then
 * the plot with its legend under it — or, one segment away, the same numbers
 * as a table, with no legend.
 */
export function ChartFrame({
  label,
  scale,
  legend,
  table,
  announcement,
  children,
  className,
  ...head
}: ChartFrameProps) {
  const [view, setView] = useState<ChartView>('chart')
  return (
    <figure data-slot="chart" aria-label={label} className={cn('m-0 min-w-0 space-y-3', className)}>
      {/* The scale is said, not shown: the page states it as the chart's
          description, under its title. */}
      {scale && (
        <p data-slot="chart-scale" className="sr-only">
          {scale}
        </p>
      )}
      <ChartHeader {...head} view={view} onViewChange={setView} />
      {view === 'chart' ? children : <ChartDataTable label={label} table={table} />}
      {view === 'chart' && legend && <ChartLegendRow>{legend}</ChartLegendRow>}
      <p aria-live="polite" className="sr-only">
        {announcement ?? ''}
      </p>
    </figure>
  )
}

/** Shared plot container classes: focusable, ringed on keyboard focus. */
export const plotClass =
  'relative w-full min-w-0 rounded-xl outline-none transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft'

import { useId, type ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../primitives/card'
import { SegmentedTabs, type SegmentedTabsOption } from '../primitives/tabs'
import { BarList } from './charts/bar-list'
import { AreaChart } from './charts/line-chart'
import { EmptyState } from './empty-state'
import { cn } from '../utils/cn'
import { formatAmount } from '../utils/amount-display'
import { eyebrow } from '../utils/type-roles'

/** One period of an item's series, for the chart. */
export interface TrendPoint {
  /** Stable identity of the period, e.g. its ISO start. */
  key: string
  /** Short axis label: "14 Oct". */
  label: string
  /** Full label for the tooltip and table: "14 Oct 2026". Defaults to `label`. */
  detail?: string
  value: number
}

/** One row of the ranking, and the series the chart draws when it is selected. */
export interface RankedTrendItem {
  id: string
  name: string
  /** What the list ranks by and totals. */
  value: number
  /** A count under the name ("1,284 orders"), printed by `countText`. */
  count?: number
  /** The item's course over the period, oldest first. */
  series: readonly TrendPoint[]
}

export interface RankedTrendPanelProps {
  items: readonly RankedTrendItem[]
  title: ReactNode
  /** One line under the title. */
  description?: ReactNode
  /** The period shown, one of `periods`' values ("30d"). Without `onPeriodChange` there is no period control. */
  period?: string
  onPeriodChange?: (period: string) => void
  /** The period choices. Defaults to 7D, 30D and 90D (`7d`, `30d`, `90d`). */
  periods?: readonly SegmentedTabsOption[]
  /** The item the chart shows. Defaults to the top one. */
  selectedId?: string
  onSelect: (id: string) => void
  /** Prints a ranked value and the total. Defaults to a grouped number. */
  formatValue?: (value: number) => string
  /** Prints the chart's values and the series total. Defaults to `formatValue`. */
  formatSeriesValue?: (value: number) => string
  /** "1,284 orders". Without it the rows show no count. */
  countText?: (count: number) => string
  /** What one point of the series covers, after the count: "per day". */
  bucketLabel?: string
  /** The period control's accessible name. */
  periodLabel?: string
  nameColumnLabel?: string
  valueColumnLabel?: string
  /** The ranked list's accessible name. */
  listLabel?: string
  totalLabel?: string
  /** The chart's heading for the selected item. Defaults to the item's name. */
  seriesTitle?: (name: string) => string
  /** The chart series' name, in its tooltip and table. */
  seriesLabel?: string
  /** The chart scale's accessible name. Defaults to `seriesLabel`. */
  scaleLabel?: string
  /** Rendered instead of the split when there are no items. */
  empty?: ReactNode
  /** Rendered instead of the chart when the selected item has no points. */
  chartEmpty?: ReactNode
  /** Hooks for the deprecated `EarningsByPartnerCard`, which keeps its own slot names. */
  slots?: { root?: string; total?: string; seriesTotal?: string }
  className?: string
}

const DEFAULT_PERIODS: readonly SegmentedTabsOption[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
]

const formatNumber = (value: number) => formatAmount(Math.round(value))

/**
 * A ranking beside the chart it drives: pick a row, the chart shows its course.
 * For any "who leads, and how did they get there" view — sales by store,
 * revenue by partner, tickets by venue.
 *
 * The header holds the title, a one-line description and, when the host
 * passes `onPeriodChange`, the period (`SegmentedTabs`, compact). Under it the
 * card splits: a 21rem column on the `card-hero` gradient (side by side, the
 * gradient runs the card's full height, under the title too), a hairline, and
 * the chart beside it; stacked below `lg`. The column ranks the items by
 * `value` (`BarList`, ranked and selectable) over their total; the right is the
 * selected item's series (`AreaChart`, gradient fill, the latest point haloed)
 * with its total.
 *
 * Data comes in through props only: the panel fetches nothing, and `period`
 * and `selectedId` are the host's state.
 */
export function RankedTrendPanel({
  items,
  title,
  description,
  period,
  onPeriodChange,
  periods = DEFAULT_PERIODS,
  selectedId,
  onSelect,
  formatValue = formatNumber,
  formatSeriesValue = formatValue,
  countText,
  bucketLabel,
  periodLabel = 'Period',
  nameColumnLabel = 'Name',
  valueColumnLabel = 'Value',
  listLabel = 'Ranking',
  totalLabel = 'Total',
  seriesTitle = (name) => name,
  seriesLabel = 'Value',
  scaleLabel = seriesLabel,
  empty = <EmptyState title="Nothing in this period" />,
  chartEmpty = <EmptyState title="No data in this period" />,
  slots = {},
  className,
}: RankedTrendPanelProps) {
  const titleId = useId()
  const ranked = [...items].sort((a, b) => b.value - a.value)
  const selected = ranked.find((item) => item.id === selectedId) ?? ranked[0]
  const total = ranked.reduce((sum, item) => sum + item.value, 0)
  const seriesTotal = selected ? selected.series.reduce((sum, point) => sum + point.value, 0) : 0
  const meta = [selected?.count !== undefined && countText ? countText(selected.count) : null, bucketLabel].filter(Boolean).join(' · ')

  return (
    <Card
      variant="secondary"
      role="region"
      aria-labelledby={titleId}
      data-slot={slots.root ?? 'ranked-trend-panel'}
      className={cn('relative min-w-0', className)}
    >
      {selected && (
        // Side by side, the column's gradient runs the card's full height,
        // under the header too; stacked, the column carries its own.
        <div
          aria-hidden="true"
          data-slot="ranked-trend-backdrop"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[21rem] rounded-l-[inherit] border-r border-border bg-gradient-card-hero lg:block"
        />
      )}
      <CardHeader className="relative flex-row flex-wrap items-center justify-between gap-3 space-y-0 px-6 py-5">
        <div className="min-w-0 space-y-0.5">
          <CardTitle id={titleId}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {onPeriodChange && period !== undefined && (
          <SegmentedTabs
            aria-label={periodLabel}
            size="compact"
            fullWidth={false}
            options={periods}
            value={period}
            onValueChange={onPeriodChange}
          />
        )}
      </CardHeader>

      {selected ? (
        <div className="relative grid rounded-b-[inherit] lg:grid-cols-[21rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-1 px-3 py-5 max-lg:[background-image:var(--gradient-card-hero)] lg:rounded-bl-[inherit]">
            <div className={cn('flex items-baseline justify-between gap-3 px-2.5 pb-1.5 text-muted-foreground', eyebrow)}>
              <span>{nameColumnLabel}</span>
              <span>{valueColumnLabel}</span>
            </div>
            <BarList
              label={listLabel}
              items={ranked.map((item) => ({
                id: item.id,
                label: item.name,
                detail: item.count !== undefined && countText ? countText(item.count) : undefined,
                value: item.value,
                valueText: formatValue(item.value),
              }))}
              sort="none"
              ranked
              showPercent={false}
              selectedId={selected.id}
              onSelect={onSelect}
            />
            <div
              data-slot={slots.total ?? 'ranked-trend-total'}
              className="mt-auto flex items-baseline justify-between gap-3 border-t border-border px-2.5 pt-3 text-caption"
            >
              <span className="text-muted-foreground">{totalLabel}</span>
              <span className="font-bold tabular-nums text-foreground">{formatValue(total)}</span>
            </div>
          </div>

          <div className="min-w-0 space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h4 className="m-0 text-subhead font-semibold text-foreground">{seriesTitle(selected.name)}</h4>
                {meta && <p className="m-0 text-tiny tabular-nums text-muted-foreground">{meta}</p>}
              </div>
              <p
                data-slot={slots.seriesTotal ?? 'ranked-trend-series-total'}
                className="m-0 whitespace-nowrap text-title font-bold tabular-nums text-foreground"
              >
                {formatSeriesValue(seriesTotal)}
              </p>
            </div>
            <AreaChart
              data={selected.series.map((point) => ({
                key: point.key,
                label: point.label,
                detail: point.detail,
                values: { value: point.value },
              }))}
              series={[{ id: 'value', label: seriesLabel }]}
              label={seriesTitle(selected.name)}
              scaleLabel={scaleLabel}
              formatValue={formatSeriesValue}
              areaFill="gradient"
              latestMarker="halo"
              empty={chartEmpty}
            />
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">{empty}</div>
      )}
    </Card>
  )
}

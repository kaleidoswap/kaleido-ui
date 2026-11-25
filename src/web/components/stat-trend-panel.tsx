import { useId, type ReactNode } from 'react'
import { Card } from '../primitives/card'
import { AreaChart } from './charts/line-chart'
import { EmptyState } from './empty-state'
import { SummaryRows, type SummaryRowItem } from './summary-rows'
import type { TrendPoint } from './ranked-trend-panel'
import { useFillHeight } from '../hooks/use-fill-height'
import { cn } from '../utils/cn'
import { eyebrowLarge } from '../utils/type-roles'

/** The value-axis gutter every panel chart shares, so their plots are the same width. */
const PANEL_AXIS_WIDTH = 72

export interface StatTrendPanelProps {
  /** The eyebrow over the figure; it also names the panel. */
  label: ReactNode
  /**
   * Over the figure instead of the eyebrow, e.g. a tab menu. The `label` then
   * stays as the panel's accessible name only, not drawn.
   */
  header?: ReactNode
  /** The figure, already formatted: "3,718". */
  value: ReactNode
  /** Beside the figure, smaller: "members", "+126 this month". */
  valueSuffix?: ReactNode
  /** The suffix's colour: quiet by default; `success` / `danger` set it as a metric card's change is (semibold, in the tone's colour). */
  valueSuffixTone?: 'muted' | 'success' | 'danger'
  /** Where the suffix sits: on a line `below` the figure (default) or `beside` it. */
  valueSuffixPlacement?: 'beside' | 'below'
  /** The breakdown under the figure, as label · leader line · value rows. */
  rows?: readonly SummaryRowItem[]
  /** At the foot of the column: one action, e.g. a ghost `Button` around the host's link. */
  action?: ReactNode
  /** The chart's points, oldest first. */
  series: readonly TrendPoint[]
  chartTitle: ReactNode
  /** What the chart measures and on what scale: "Scans per local day · Last 30 days". */
  chartDescription?: ReactNode
  /** The chart's accessible name. Defaults to `chartTitle` when it is a string. */
  chartLabel?: string
  /** The series' name, in its tooltip and table. */
  seriesLabel?: string
  /** The scale's accessible name. Defaults to `seriesLabel`. */
  scaleLabel?: string
  formatValue?: (value: number) => string
  /** Rendered instead of the chart when there are no points. */
  chartEmpty?: ReactNode
  className?: string
}

/**
 * A headline figure with its breakdown, beside the trend that led to it: a
 * balance and its parts, members and their states, stock and its movements.
 *
 * The panel splits as `RankedTrendPanel` does — a 21rem column on the
 * `card-hero` gradient, a hairline, the chart beside it; stacked below `lg`.
 * The column holds the figure under its eyebrow, the breakdown as
 * `SummaryRows` and an action at its foot. The right is the trend
 * (`AreaChart` with its own title, description and chart/table switch).
 *
 * Data comes in through props only: the panel fetches nothing.
 */
export function StatTrendPanel({
  label,
  header,
  value,
  valueSuffix,
  valueSuffixTone = 'muted',
  valueSuffixPlacement = 'below',
  rows = [],
  action,
  series,
  chartTitle,
  chartDescription,
  chartLabel = typeof chartTitle === 'string' ? chartTitle : 'Trend',
  seriesLabel = 'Value',
  scaleLabel = seriesLabel,
  formatValue,
  chartEmpty = <EmptyState title="No data in this period" />,
  className,
}: StatTrendPanelProps) {
  const labelId = useId()
  // The plot fills the column's height, so the chart is as tall as the panel.
  const { slotRef, height } = useFillHeight(240)

  return (
    <Card
      variant="secondary"
      role="region"
      aria-labelledby={labelId}
      data-slot="stat-trend-panel"
      className={cn('grid min-w-0 overflow-hidden lg:grid-cols-[21rem_minmax(0,1fr)]', className)}
    >
      <div
        data-slot="stat-trend-column"
        className="flex min-w-0 flex-col gap-5 bg-gradient-card-hero px-6 py-6 lg:border-r lg:border-border"
      >
        {/* A gap, not space-y: the paragraphs are m-0, which would cancel it. */}
        <div className="flex flex-col gap-3">
          {header && <div data-slot="stat-trend-header">{header}</div>}
          <p id={labelId} className={cn('m-0 text-muted-foreground', eyebrowLarge, header && 'sr-only')}>
            {label}
          </p>
          <p
            data-slot="stat-trend-value"
            className={cn('m-0 flex gap-x-2.5', valueSuffixPlacement === 'below' ? 'flex-col gap-y-1' : 'flex-wrap items-baseline')}
          >
            <span className="text-main-title font-bold tabular-nums text-foreground">{value}</span>
            {valueSuffix && (
              <span
                data-slot="stat-trend-suffix"
                className={cn(
                  'text-body',
                  valueSuffixTone === 'muted' && 'text-muted-foreground',
                  valueSuffixTone === 'success' && 'font-semibold text-success-fg',
                  valueSuffixTone === 'danger' && 'font-semibold text-danger-fg',
                )}
              >
                {valueSuffix}
              </span>
            )}
          </p>
        </div>
        {rows.length > 0 && <SummaryRows rows={[...rows]} className="space-y-3" />}
        {action && <div className="mt-auto pt-6">{action}</div>}
      </div>

      <div className="flex min-w-0 flex-col px-4 py-6">
        {/* No height of its own: the column sets the row, the plot fills it. */}
        <div ref={slotRef} className="relative min-h-0 flex-1 max-lg:min-h-[20rem]">
          <div className="absolute inset-0">
            <AreaChart
              title={chartTitle}
              description={chartDescription}
              data={series.map((point) => ({
                key: point.key,
                label: point.label,
                detail: point.detail,
                values: { value: point.value },
              }))}
              series={[{ id: 'value', label: seriesLabel }]}
              label={chartLabel}
              scaleLabel={scaleLabel}
              formatValue={formatValue}
              areaFill="gradient"
              axisWidth={PANEL_AXIS_WIDTH}
              latestMarker="dot"
              height={height}
              empty={chartEmpty}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

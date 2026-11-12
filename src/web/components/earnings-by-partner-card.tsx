import { useId, type ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../primitives/card'
import { SegmentedTabs, type SegmentedTabsOption } from '../primitives/tabs'
import { BarList } from './charts/bar-list'
import { AreaChart } from './charts/line-chart'
import { EmptyState } from './empty-state'
import { cn } from '../utils/cn'
import { formatAmount } from '../utils/amount-display'
import { eyebrow } from '../utils/type-roles'

/** One period of a partner's swap volume, for the chart. */
export interface EarningsVolumePoint {
  /** Stable identity of the period, e.g. its ISO start. */
  key: string
  /** Short axis label: "14 Oct". */
  label: string
  /** Full label for the tooltip and table: "14 Oct 2026". Defaults to `label`. */
  detail?: string
  /** Swap volume in the period, in sats. */
  volume: number
}

export interface EarningsPartner {
  id: string
  name: string
  /** Revenue in the period, in sats. The list ranks by it. */
  revenue: number
  /** Swaps in the period. */
  swaps: number
  /** The partner's swap volume over the period, oldest first. */
  volumeSeries: readonly EarningsVolumePoint[]
}

export interface EarningsByPartnerCardProps {
  partners: readonly EarningsPartner[]
  /** The period shown, one of `periods`' values ("30d"). */
  period: string
  onPeriodChange: (period: string) => void
  /** The partner the chart shows. Defaults to the top partner by revenue. */
  selectedId?: string
  onSelect: (id: string) => void
  /** How amounts print: `sat` ("412,300 sat") or `BTC` ("0.004123 BTC"). Amounts are given in sats either way. */
  unit: 'sat' | 'BTC'
  /** The period choices. Defaults to 7D, 30D and 90D (`7d`, `30d`, `90d`). */
  periods?: readonly SegmentedTabsOption[]
  /** Prints an amount given in sats; overrides `unit`'s format. */
  formatValue?: (sats: number) => string
  title?: ReactNode
  /** One line under the title. */
  description?: ReactNode
  /** What one point of the series covers, after the swap count: "per day". */
  bucketLabel?: string
  /** The period control's accessible name. */
  periodLabel?: string
  partnerColumnLabel?: string
  revenueColumnLabel?: string
  /** The ranked list's accessible name. */
  listLabel?: string
  totalLabel?: string
  /** The chart's heading for the selected partner. */
  volumeTitle?: (name: string) => string
  /** "1,284 swaps". */
  swapsText?: (count: number) => string
  /** Rendered instead of the split when there are no partners. */
  empty?: ReactNode
  /** Rendered instead of the chart when the selected partner has no volume. */
  chartEmpty?: ReactNode
  className?: string
}

const DEFAULT_PERIODS: readonly SegmentedTabsOption[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
]

const SATS_PER_BTC = 100_000_000

const unitFormat: Record<EarningsByPartnerCardProps['unit'], (sats: number) => string> = {
  sat: (sats) => `${formatAmount(Math.round(sats))} sat`,
  BTC: (sats) => `${formatAmount(sats / SATS_PER_BTC, { maximumFractionDigits: 8 })} BTC`,
}

/**
 * Earnings by partner, for an admin overview or a partner dashboard: one card
 * so both draw the same thing.
 *
 * The header holds the title, a one-line description and the period
 * (`SegmentedTabs`, compact). Under it the card splits as the platform
 * dashboard's earnings panel does — a 21rem column on the `card-hero`
 * gradient and the chart beside it, stacked below `lg`, with no divider
 * between them. The left column ranks the partners by revenue (`BarList`,
 * ranked and selectable: revenue, swap count and a bar each) over the total
 * for all of them; the right is the selected partner's swap volume
 * (`AreaChart`, gradient fill, the latest point haloed) with its total volume
 * and swap count.
 *
 * Data comes in through props only: the card fetches nothing, and `period`
 * and `selectedId` are the host's state.
 */
export function EarningsByPartnerCard({
  partners,
  period,
  onPeriodChange,
  selectedId,
  onSelect,
  unit,
  periods = DEFAULT_PERIODS,
  formatValue = unitFormat[unit],
  title = 'Earnings by partner',
  description = 'Ranked by revenue',
  bucketLabel,
  periodLabel = 'Period',
  partnerColumnLabel = 'Partner',
  revenueColumnLabel = 'Revenue',
  listLabel = 'Revenue by partner',
  totalLabel = 'All partners',
  volumeTitle = (name) => `Swap volume · ${name}`,
  swapsText = (count) => `${formatAmount(count)} ${count === 1 ? 'swap' : 'swaps'}`,
  empty = <EmptyState title="No partner earnings in this period" />,
  chartEmpty = <EmptyState title="No swaps in this period" />,
  className,
}: EarningsByPartnerCardProps) {
  const titleId = useId()
  const ranked = [...partners].sort((a, b) => b.revenue - a.revenue)
  const selected = ranked.find((partner) => partner.id === selectedId) ?? ranked[0]
  const total = ranked.reduce((sum, partner) => sum + partner.revenue, 0)
  const volume = selected ? selected.volumeSeries.reduce((sum, point) => sum + point.volume, 0) : 0

  return (
    <Card role="region" aria-labelledby={titleId} data-slot="earnings-by-partner-card" className={cn('min-w-0', className)}>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0 px-6 py-5">
        <div className="min-w-0 space-y-0.5">
          <CardTitle id={titleId}>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <SegmentedTabs
          aria-label={periodLabel}
          size="compact"
          fullWidth={false}
          options={periods}
          value={period}
          onValueChange={onPeriodChange}
        />
      </CardHeader>

      {selected ? (
        // The platform dashboard's split: no divider, the left on the hero gradient.
        <div className="grid rounded-b-[inherit] lg:grid-cols-[21rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-1 bg-gradient-card-hero px-3 py-5 lg:rounded-bl-[inherit]">
            <div className={cn('flex items-baseline justify-between gap-3 px-2.5 pb-1.5 text-muted-foreground', eyebrow)}>
              <span>{partnerColumnLabel}</span>
              <span>{revenueColumnLabel}</span>
            </div>
            <BarList
              label={listLabel}
              items={ranked.map((partner) => ({
                id: partner.id,
                label: partner.name,
                detail: swapsText(partner.swaps),
                value: partner.revenue,
                valueText: formatValue(partner.revenue),
              }))}
              sort="none"
              ranked
              showPercent={false}
              selectedId={selected.id}
              onSelect={onSelect}
            />
            <div
              data-slot="earnings-total"
              className="mt-auto flex items-baseline justify-between gap-3 border-t border-border px-2.5 pt-3 text-caption"
            >
              <span className="text-muted-foreground">{totalLabel}</span>
              <span className="font-bold tabular-nums text-foreground">{formatValue(total)}</span>
            </div>
          </div>

          <div className="min-w-0 space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h4 className="m-0 text-subhead font-semibold text-foreground">{volumeTitle(selected.name)}</h4>
                <p className="m-0 text-tiny tabular-nums text-muted-foreground">
                  {bucketLabel ? `${swapsText(selected.swaps)} · ${bucketLabel}` : swapsText(selected.swaps)}
                </p>
              </div>
              <p data-slot="earnings-volume" className="m-0 whitespace-nowrap text-title font-bold tabular-nums text-foreground">
                {formatValue(volume)}
              </p>
            </div>
            <AreaChart
              data={selected.volumeSeries.map((point) => ({
                key: point.key,
                label: point.label,
                detail: point.detail,
                values: { volume: point.volume },
              }))}
              series={[{ id: 'volume', label: 'Swap volume' }]}
              label={volumeTitle(selected.name)}
              scaleLabel={`Swap volume, ${unit}`}
              formatValue={formatValue}
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

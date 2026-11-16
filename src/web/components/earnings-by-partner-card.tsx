import type { ReactNode } from 'react'
import type { SegmentedTabsOption } from '../primitives/tabs'
import { EmptyState } from './empty-state'
import { formatAmount } from '../utils/amount-display'
import { RankedTrendPanel } from './ranked-trend-panel'

/** One period of a partner's swap volume, for the chart. @deprecated Use `TrendPoint` with `RankedTrendPanel`. */
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

/** @deprecated Use `RankedTrendItem` with `RankedTrendPanel`. */
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

/** @deprecated Use `RankedTrendPanelProps`. */
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
  /** The chart series' name, in its tooltip and legend. Defaults to "Swap volume". */
  seriesLabel?: string
  /** The chart scale's accessible name. Defaults to `${seriesLabel}, ${unit}`. */
  scaleLabel?: string
  /** Rendered instead of the split when there are no partners. */
  empty?: ReactNode
  /** Rendered instead of the chart when the selected partner has no volume. */
  chartEmpty?: ReactNode
  className?: string
}

const SATS_PER_BTC = 100_000_000

const unitFormat: Record<EarningsByPartnerCardProps['unit'], (sats: number) => string> = {
  sat: (sats) => `${formatAmount(Math.round(sats))} sat`,
  BTC: (sats) => `${formatAmount(sats / SATS_PER_BTC, { maximumFractionDigits: 8 })} BTC`,
}

/**
 * Earnings by partner: partners ranked by revenue beside the selected one's
 * swap volume, amounts in sats.
 *
 * @deprecated Use `RankedTrendPanel`, the same panel with generic props
 * (`items` with `value`, `count` and `series`). This wrapper maps the partner
 * props onto it and keeps its slot names and English defaults.
 */
export function EarningsByPartnerCard({
  partners,
  period,
  onPeriodChange,
  selectedId,
  onSelect,
  unit,
  periods,
  formatValue = unitFormat[unit],
  title = 'Earnings by partner',
  description = 'Ranked by revenue',
  bucketLabel,
  periodLabel,
  partnerColumnLabel = 'Partner',
  revenueColumnLabel = 'Revenue',
  listLabel = 'Revenue by partner',
  totalLabel = 'All partners',
  volumeTitle = (name) => `Swap volume · ${name}`,
  swapsText = (count) => `${formatAmount(count)} ${count === 1 ? 'swap' : 'swaps'}`,
  seriesLabel = 'Swap volume',
  scaleLabel = `${seriesLabel}, ${unit}`,
  empty = <EmptyState title="No partner earnings in this period" />,
  chartEmpty = <EmptyState title="No swaps in this period" />,
  className,
}: EarningsByPartnerCardProps) {
  return (
    <RankedTrendPanel
      items={partners.map((partner) => ({
        id: partner.id,
        name: partner.name,
        value: partner.revenue,
        count: partner.swaps,
        series: partner.volumeSeries.map(({ volume, ...point }) => ({ ...point, value: volume })),
      }))}
      title={title}
      description={description}
      period={period}
      onPeriodChange={onPeriodChange}
      periods={periods}
      selectedId={selectedId}
      onSelect={onSelect}
      formatValue={formatValue}
      countText={swapsText}
      bucketLabel={bucketLabel}
      periodLabel={periodLabel}
      nameColumnLabel={partnerColumnLabel}
      valueColumnLabel={revenueColumnLabel}
      listLabel={listLabel}
      totalLabel={totalLabel}
      seriesTitle={volumeTitle}
      seriesLabel={seriesLabel}
      scaleLabel={scaleLabel}
      empty={empty}
      chartEmpty={chartEmpty}
      slots={{ root: 'earnings-by-partner-card', total: 'earnings-total', seriesTotal: 'earnings-volume' }}
      className={className}
    />
  )
}

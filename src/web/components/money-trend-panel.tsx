import { StatTrendPanel, type StatTrendPanelProps } from './stat-trend-panel'
import type { SummaryRowItem } from './summary-rows'
import { SegmentedTabs, type SegmentedTabsOption } from '../primitives/tabs'
import { formatAmount } from '../utils/amount-display'

/** A breakdown row; `usd` adds its counter-value as a note beside the value. */
export interface MoneyTrendRow extends SummaryRowItem {
  /** The row's counter-value in USD, shown under its value. */
  usd?: number
}

export interface MoneyTrendPanelProps
  extends Omit<
    StatTrendPanelProps,
    'value' | 'valueSuffix' | 'valueSuffixTone' | 'valueSuffixPlacement' | 'formatValue' | 'scaleLabel' | 'rows'
  > {
  /**
   * A tab menu over the headline figure (accounts, wallets). With it the
   * visible `label` is dropped; it stays as the panel's accessible name.
   * Needs `tab` and `onTabChange`.
   */
  tabs?: readonly SegmentedTabsOption[]
  /** The chosen tab's value. */
  tab?: string
  onTabChange?: (value: string) => void
  /** The breakdown (pass values formatted). Give a row `usd` to show its USD counter-value. */
  rows?: readonly MoneyTrendRow[]
  /** The headline amount, in BTC. */
  btc: number
  /** Its counter-value in USD, on the line under the BTC figure. Omit to show BTC alone. */
  usd?: number
  /** Decimals kept on BTC figures, the headline and the chart. Defaults to 8 (one sat). */
  btcDecimals?: number
  /** BCP 47 locale the figures are grouped in. Defaults to en-US. */
  locale?: string
  /** The scale's accessible name. Defaults to "BTC". */
  scaleLabel?: string
}

/**
 * `StatTrendPanel` for money: the headline is an amount in BTC; under it, one
 * smaller line with its USD counter-value — a wallet's revenue and the trend
 * that led to it. The `rows` are the breakdown (pass them formatted), the
 * chart is drawn in BTC; `series` values are BTC amounts.
 *
 * Data comes in through props only: the panel converts and fetches nothing,
 * so the host passes the USD figure it already priced.
 */
export function MoneyTrendPanel({
  btc,
  usd,
  btcDecimals = 8,
  locale,
  scaleLabel = 'BTC',
  seriesLabel = 'Revenue',
  rows,
  tabs,
  tab,
  onTabChange,
  ...props
}: MoneyTrendPanelProps) {
  const btcText = (amount: number) => formatAmount(amount, { locale, maximumFractionDigits: btcDecimals })
  const usdText = (amount: number) =>
    `${amount < 0 ? '−' : ''}$${formatAmount(Math.abs(amount), { locale, minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return (
    <StatTrendPanel
      {...props}
      header={
        tabs && tab !== undefined && onTabChange ? (
          <SegmentedTabs
            options={tabs}
            value={tab}
            onValueChange={onTabChange}
            size="compact"
            fullWidth={false}
            aria-label={typeof props.label === 'string' ? props.label : undefined}
          />
        ) : undefined
      }
      rows={rows?.map(({ usd, ...row }) =>
        usd === undefined
          ? row
          : {
              ...row,
              value: (
                <span className="flex flex-col items-end">
                  <span>{row.value}</span>
                  <span data-slot="money-trend-row-usd" className="text-xxs font-normal text-muted-foreground">
                    {usdText(usd)}
                  </span>
                </span>
              ),
            },
      )}
      value={
        <>
          {btcText(btc)} <span className="text-body font-normal text-muted-foreground">BTC</span>
        </>
      }
      valueSuffix={
        usd === undefined ? undefined : (
          <span data-slot="money-trend-usd" className="tabular-nums">
            {usdText(usd)}
          </span>
        )
      }
      seriesLabel={seriesLabel}
      scaleLabel={scaleLabel}
      formatValue={btcText}
    />
  )
}

import { StatTrendPanel, type StatTrendPanelProps } from './stat-trend-panel'
import { formatAmount } from '../utils/amount-display'

export interface MoneyTrendPanelProps
  extends Omit<
    StatTrendPanelProps,
    'value' | 'valueSuffix' | 'valueSuffixTone' | 'valueSuffixPlacement' | 'formatValue' | 'scaleLabel'
  > {
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
  ...props
}: MoneyTrendPanelProps) {
  const btcText = (amount: number) => formatAmount(amount, { locale, maximumFractionDigits: btcDecimals })
  return (
    <StatTrendPanel
      {...props}
      value={
        <>
          {btcText(btc)} <span className="text-body font-normal text-muted-foreground">BTC</span>
        </>
      }
      valueSuffix={
        usd === undefined ? undefined : (
          <span data-slot="money-trend-usd" className="tabular-nums">
            ${formatAmount(usd, { locale, maximumFractionDigits: 2 })}
          </span>
        )
      }
      seriesLabel={seriesLabel}
      scaleLabel={scaleLabel}
      formatValue={btcText}
    />
  )
}

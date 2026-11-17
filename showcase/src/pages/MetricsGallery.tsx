import { BlockTitle } from './blocks'
import { InfoTip, MetricCard, MetricDelta, MetricFigure, MetricNoDelta, Sparkline } from 'kaleido-ui'

/** The periods the sample changes compare with. */
const WEEK_PERIOD =
  'Changes compare with the preceding 7 days (Oct 31 – Nov 6, 2025, UTC). Today is still running (today, 17 hours of 24), so a fall may only be a short day.'
const YEAR_PERIOD =
  'Changes compare with the preceding 365 days (Nov 14, 2024 – Nov 13, 2025, UTC). Today is still running (today, 17 hours of 24), so a fall may only be a short day.'

/** What a sample change compares with, in the info button beside it. */
const periodInfo = (period: string) => <InfoTip label="Compared period">{period}</InfoTip>

/** The sample changes: the sign gives the direction. */
const delta = (value: string, period: string) => (
  <MetricDelta direction={value.startsWith('-') ? 'down' : 'up'} value={value} info={periodInfo(period)} />
)

export function MetricsGallery() {
  return (
    <div className="space-y-0">
      {/* A single figure is a stat tile, not a chart. */}
      <BlockTitle className="mb-3">MetricCard — small</BlockTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          size="comfortable"
          labelStyle="title"
          trendPlacement="below-label"
          className="p-3"
          label="Orders this week"
          value="1,284"
          description={delta('+12.7%', WEEK_PERIOD)}
          trend={<Sparkline height="fill" pulse values={[40, 44, 39, 52, 48, 57, 55, 61, 58, 66, 63, 71]} label="Orders, last 12 weeks: 39 to 71" />}
        />
        <MetricCard
          size="comfortable"
          labelStyle="title"
          trendPlacement="below-label"
          className="p-3"
          label="Revenue"
          value={<MetricFigure amount="9.4" unit="BTC" />}
          description={delta('-8.7%', WEEK_PERIOD)}
          trend={<Sparkline height="fill" pulse tone="negative" values={[12.9, 12.4, 12.8, 11.9, 12.1, 11.2, 11.6, 10.8, 10.9, 10.1, 10.3, 9.4]} label="Revenue, last 12 weeks: 12.9 down to 9.4 BTC" />}
        />
        <MetricCard
          size="comfortable"
          labelStyle="title"
          trendPlacement="below-label"
          className="p-3"
          label="Conversion rate"
          value="96.4%"
          description={<MetricNoDelta info={periodInfo(WEEK_PERIOD)} />}
          trend={<Sparkline height="fill" values={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]} label="Conversion rate, last 12 weeks: no data" />}
        />
      </div>

      <BlockTitle className="mb-3 pt-12">MetricCard — large</BlockTitle>
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          size="comfortable"
          tone="purple"
          labelStyle="title"
          icon="trending_up"
          label="Revenue"
          definition="Total income in the period."
          value={<MetricFigure amount="47,429" unit="sat" />}
          description={delta('+12.7%', YEAR_PERIOD)}
          className="p-3"
          trend={<Sparkline height="fill" pulse values={[0, 0, 2, 0, 1, 9, 22, 14, 31, 18, 40, 26, 47]} label="Revenue, recent period: 0 to 47,429 sats" />}
        />
        <MetricCard
          size="comfortable"
          tone="purple"
          labelStyle="title"
          icon="toll"
          label="Volume"
          definition="Total value processed."
          value={<MetricFigure amount="1,840,000" unit="sat" />}
          description={delta('-8.0%', YEAR_PERIOD)}
          className="p-3"
          trend={<Sparkline height="fill" pulse tone="negative" values={[2, 1.95, 2.05, 1.9, 1.96, 1.85, 1.88, 1.84]} label="Volume, recent period: 2,000,000 down to 1,840,000 sats" />}
        />
        <MetricCard
          size="comfortable"
          tone="purple"
          labelStyle="title"
          icon="swap_horiz"
          label="Orders"
          definition="Orders that completed."
          value="4"
          description={<MetricNoDelta info={periodInfo(YEAR_PERIOD)} />}
          className="p-3"
          trend={<Sparkline height="fill" values={[0, 0, 0, 0, 0, 0]} label="Orders, recent period: no data" />}
        />
      </div>

    </div>
  )
}

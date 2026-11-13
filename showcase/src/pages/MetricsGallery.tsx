import { useState } from 'react'
import { cn, EarningsByPartnerCard, Icon, MetricCard, Sparkline, Switch, type EarningsPartner } from '@kaleido-ui/index'

/** A week-on-week change under a metric's figure: green up, red down. */
function Delta({ value }: { value: string }) {
  const down = value.startsWith('-')
  return (
    <span className={cn('inline-flex items-center gap-0.5 whitespace-nowrap font-semibold', down ? 'text-danger-fg' : 'text-success-fg')}>
      <Icon name={down ? 'arrow_downward' : 'arrow_upward'} className="text-icon-xs" aria-hidden="true" />
      {value}
      <span className="sr-only"> vs last week</span>
    </span>
  )
}

/** A figure with its unit: the unit in caps, smaller than the number. */
function Figure({ amount, unit }: { amount: string; unit: string }) {
  return (
    <span className="whitespace-nowrap">
      {amount} <span className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">{unit}</span>
    </span>
  )
}

// ─── Earnings by partner ────────────────────────────────────────────────────

/** Sample partners; each period scales them and draws a series of its own length. */
const SAMPLE_PARTNERS = [
  { id: 'acme', name: 'Acme Wallet', revenue: 412_300, swaps: 1_284, volume: 642_000_000, seed: 3 },
  { id: 'example', name: 'Example Exchange', revenue: 288_900, swaps: 902, volume: 495_000_000, seed: 7 },
  { id: 'nimbus', name: 'Nimbus Wallet', revenue: 164_200, swaps: 517, volume: 271_000_000, seed: 11 },
  { id: 'orbit', name: 'Orbit Pay', revenue: 97_500, swaps: 301, volume: 138_000_000, seed: 5 },
  { id: 'sample', name: 'Sample Pay', revenue: 41_800, swaps: 122, volume: 66_000_000, seed: 13 },
]
const PERIODS: Record<string, { scale: number; points: number; bucket: string; step: number }> = {
  '7d': { scale: 0.24, points: 7, bucket: 'per day', step: 1 },
  '30d': { scale: 1, points: 30, bucket: 'per day', step: 1 },
  '90d': { scale: 2.9, points: 13, bucket: 'per week', step: 7 },
}

function partnersFor(period: string): EarningsPartner[] {
  const { scale, points, step } = PERIODS[period]
  const end = Date.UTC(2026, 10, 12)
  return SAMPLE_PARTNERS.map(({ seed, volume, ...partner }) => {
    const weights = Array.from({ length: points }, (_, index) =>
      0.45 + 0.4 * (Math.sin(index * 1.7 + seed) * 0.5 + 0.5) + 0.25 * (Math.sin(index * 0.6 + seed * 2) * 0.5 + 0.5) + 0.35 * (index / Math.max(1, points - 1)),
    )
    const sum = weights.reduce((a, b) => a + b, 0)
    return {
      ...partner,
      revenue: Math.round(partner.revenue * scale),
      swaps: Math.round(partner.swaps * scale),
      volumeSeries: weights.map((weight, index) => {
        const day = new Date(end - (points - 1 - index) * step * 86_400_000)
        return {
          key: day.toISOString().slice(0, 10),
          label: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
          volume: Math.round((volume * scale * weight) / sum),
        }
      }),
    }
  })
}

function EarningsDemo() {
  const [period, setPeriod] = useState('30d')
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [unit, setUnit] = useState<'sat' | 'BTC'>('sat')
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-caption text-muted-foreground">
        <Switch checked={unit === 'BTC'} onCheckedChange={(on) => setUnit(on ? 'BTC' : 'sat')} aria-label="Amounts in BTC" />
        Amounts in BTC
      </div>
      <EarningsByPartnerCard
        partners={partnersFor(period)}
        period={period}
        onPeriodChange={setPeriod}
        selectedId={selected}
        onSelect={setSelected}
        unit={unit}
        description="Ranked by revenue · publishable keys only"
        bucketLabel={PERIODS[period].bucket}
      />
    </div>
  )
}

export function MetricsGallery() {
  return (
    <div className="space-y-0">
      {/* A single figure is a stat tile, not a chart. */}
      <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">MetricCard — small</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          size="comfortable"
          label="Orders this week"
          value="1,284"
          description={<Delta value="+12.7%" />}
          trend={<Sparkline height="fill" pulse values={[40, 44, 39, 52, 48, 57, 55, 61, 58, 66, 63, 71]} label="Orders, last 12 weeks: 39 to 71" />}
        />
        <MetricCard
          size="comfortable"
          label="Revenue"
          value={<Figure amount="9.4" unit="BTC" />}
          description={<Delta value="-8.7%" />}
          trend={<Sparkline height="fill" pulse tone="negative" values={[12.9, 12.4, 12.8, 11.9, 12.1, 11.2, 11.6, 10.8, 10.9, 10.1, 10.3, 9.4]} label="Revenue, last 12 weeks: 12.9 down to 9.4 BTC" />}
        />
        <MetricCard
          size="comfortable"
          label="Conversion rate"
          value="96.4%"
          description={<Delta value="+0.2%" />}
          trend={<Sparkline height="fill" pulse values={[94.1, 95.2, 93.8, 95.9, 96.0, 95.4, 96.8, 96.1, 95.7, 96.9, 96.2, 96.4]} label="Conversion rate, last 12 weeks: 93.8% to 96.9%" />}
        />
      </div>

      <p className="mb-3 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">MetricCard — large</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          size="comfortable"
          tone="purple"
          labelStyle="title"
          icon="trending_up"
          label="Revenue"
          definition="Total income in the period."
          value={<Figure amount="47,429" unit="sat" />}
          description={<Delta value="+12.7%" />}
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
          value={<Figure amount="1,840,000" unit="sat" />}
          description={<Delta value="-8.0%" />}
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
          description={<Delta value="+0.2%" />}
          className="p-3"
          trend={<Sparkline height="fill" pulse values={[4, 4, 4, 4, 4, 4]} label="Orders, recent period: 4" />}
        />
      </div>

      <p className="mb-3 pt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">EarningsByPartnerCard</p>
      <EarningsDemo />
    </div>
  )
}

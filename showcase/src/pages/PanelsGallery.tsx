import { useState } from 'react'
import { BlockTitle } from './blocks'
import { Button, EmptyState, Icon, RankedTrendPanel, StatTrendPanel, type RankedTrendItem } from 'kaleido-ui'

// The samples are invented on purpose: a ticketing desk and a climbing gym,
// so the panels read as layouts, not as any one product's screens.

// ─── Ticket sales by venue (RankedTrendPanel) ───────────────────────────

/** Sample venues; each period scales them and draws a series of its own length. */
const SAMPLE_VENUES = [
  { id: 'lumen', name: 'Lumen Hall', revenue: 58_640, swaps: 37, volume: 812_000, seed: 4 },
  { id: 'riverside', name: 'Riverside Arena', revenue: 44_115, swaps: 21, volume: 706_500, seed: 9 },
  { id: 'glasshouse', name: 'The Glasshouse', revenue: 23_980, swaps: 48, volume: 318_200, seed: 2 },
  { id: 'mill', name: 'Old Mill Stage', revenue: 11_305, swaps: 29, volume: 154_900, seed: 12 },
  { id: 'pier', name: 'Pier 9 Club', revenue: 6_470, swaps: 16, volume: 87_300, seed: 6 },
]
const PERIODS: Record<string, { scale: number; points: number; bucket: string; step: number }> = {
  '7d': { scale: 0.21, points: 7, bucket: 'per day', step: 1 },
  '30d': { scale: 1, points: 30, bucket: 'per day', step: 1 },
  '90d': { scale: 3.1, points: 13, bucket: 'per week', step: 7 },
}

function venuesFor(period: string): RankedTrendItem[] {
  const { scale, points, step } = PERIODS[period]
  const end = Date.UTC(2026, 10, 12)
  return SAMPLE_VENUES.map(({ seed, volume, ...venue }) => {
    // Weekend peaks over a slow climb, a different rhythm per venue.
    const weights = Array.from({ length: points }, (_, index) =>
      0.3 + 0.55 * (Math.sin(index * 0.9 + seed) * 0.5 + 0.5) ** 2 + 0.3 * (Math.cos(index * 2.3 + seed * 1.4) * 0.5 + 0.5) + 0.25 * (index / Math.max(1, points - 1)),
    )
    const sum = weights.reduce((a, b) => a + b, 0)
    return {
      id: venue.id,
      name: venue.name,
      value: Math.round(venue.revenue * scale),
      count: Math.max(1, Math.round(venue.swaps * scale)),
      series: weights.map((weight, index) => {
        const day = new Date(end - (points - 1 - index) * step * 86_400_000)
        return {
          key: day.toISOString().slice(0, 10),
          label: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
          value: Math.round((volume * scale * weight) / sum),
        }
      }),
    }
  })
}

const formatEur = (amount: number) => `€${Math.round(amount).toLocaleString('en-US')}`

function VenuesDemo() {
  const [period, setPeriod] = useState('30d')
  const [selected, setSelected] = useState<string | undefined>(undefined)
  return (
    <RankedTrendPanel
      items={venuesFor(period)}
      period={period}
      onPeriodChange={setPeriod}
      selectedId={selected}
      onSelect={setSelected}
      formatValue={formatEur}
      title="Ticket sales by venue"
      description="Ranked by net commission"
      nameColumnLabel="Venue"
      valueColumnLabel="Commission"
      listLabel="Commission by venue"
      totalLabel="All venues"
      bucketLabel={PERIODS[period].bucket}
      seriesTitle={(name) => `Gross sales · ${name}`}
      countText={(count) => `${count.toLocaleString('en-US')} ${count === 1 ? 'show' : 'shows'}`}
      seriesLabel="Gross sales"
      scaleLabel="Gross sales, EUR"
      empty={<EmptyState title="No shows in this period" />}
      chartEmpty={<EmptyState title="No tickets sold in this period" />}
    />
  )
}

// ─── Gym memberships (StatTrendPanel) ──────────────────────────────────

/** Check-ins over the last 30 days: busy Mondays, quiet Sundays, a holiday dip. */
const CHECK_INS = Array.from({ length: 30 }, (_, index) => {
  const day = new Date(Date.UTC(2026, 9, 15) + index * 86_400_000)
  const weekday = day.getUTCDay()
  const base = [212, 396, 371, 344, 318, 287, 254][weekday]
  const drift = Math.round(Math.sin(index * 1.3) * 22 + index * 2.4)
  const dip = index === 17 || index === 18 ? -140 : 0
  return {
    key: day.toISOString().slice(0, 10),
    label: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }),
    detail: day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
    value: Math.max(0, base + drift + dip),
  }
})

const formatCheckIns = (count: number) => Math.round(count).toLocaleString('en-US')

function MembershipsDemo() {
  return (
    <StatTrendPanel
      label="Active members"
      value="3,718"
      valueSuffix="+126 this month"
      rows={[
        { label: 'On a free trial', value: '284' },
        { label: 'Frozen memberships', value: '57' },
        { label: 'Average visits a week', value: '2.6' },
        { label: 'Cancelled this month', value: '41' },
        { label: 'Day passes sold', value: '903' },
      ]}
      action={
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <a href="#panels">
            Open member list
            <Icon name="arrow_forward" className="text-icon-md" aria-hidden="true" />
          </a>
        </Button>
      }
      series={CHECK_INS}
      chartTitle="Daily check-ins"
      chartDescription="Front-desk and app scans, per local day · Last 30 days"
      chartLabel="Daily check-ins"
      seriesLabel="Check-ins"
      scaleLabel="Check-ins"
      formatValue={formatCheckIns}
      chartEmpty={<EmptyState title="No check-ins in this period" />}
    />
  )
}

/** Panels: whole dashboard panels built from the library's parts. */
export function PanelsGallery() {
  return (
    <div className="space-y-0">
      <BlockTitle className="mb-3">RankedTrendPanel</BlockTitle>
      <VenuesDemo />

      <BlockTitle className="mb-3 pt-12">StatTrendPanel</BlockTitle>
      <MembershipsDemo />
    </div>
  )
}

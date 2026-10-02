import type { ReactNode } from 'react'
import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DonutChart,
  LineChart,
  MetricCard,
  Meter,
  ScatterChart,
  Sparkline,
  TrendChart,
  type ChartDatum,
  type TrendChartPoint,
} from '@kaleido-ui/index'

// ─── Sample data ────────────────────────────────────────────────────────────
//
// Deterministic, so the page renders the same on every load and in review.

/** A small seeded generator: the same numbers every time. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const tenth = (value: number) => Math.round(value * 10) / 10

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const MONTH_DETAIL = [
  'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026',
  'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026',
]

const volumeByMonth: ChartDatum[] = (() => {
  const random = seeded(7)
  return MONTHS.map((label, index) => ({
    key: `m-${index}`,
    label,
    detail: MONTH_DETAIL[index],
    values: {
      lightning: tenth(1.8 + index * 0.42 + random() * 0.9),
      onchain: tenth(3.2 + Math.sin(index / 2) * 0.8 + random() * 0.6),
      spark: tenth(index > 3 ? (index - 3) * 0.55 + random() * 0.5 : 0),
    },
  }))
})()

const balanceByDay: ChartDatum[] = (() => {
  const random = seeded(21)
  let balance = 1_250_000
  return Array.from({ length: 30 }, (_, index) => {
    balance += Math.round((random() - 0.38) * 90_000)
    return {
      key: `d-${index}`,
      label: `${index + 1} Sep`,
      detail: `${index + 1} September 2026`,
      values: { balance: Math.max(0, balance) },
    }
  })
})()

const swapsByWeekday: ChartDatum[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, index) => ({
  key: label,
  label,
  detail: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index],
  values: {
    lightning: [142, 168, 175, 181, 204, 121, 98][index],
    onchain: [64, 71, 69, 77, 83, 42, 35][index],
    spark: [22, 31, 29, 34, 40, 25, 19][index],
  },
}))

const volumeByPair: ChartDatum[] = [
  { key: 'btc-usdt', label: 'BTC/USDT', values: { volume: 18.4 } },
  { key: 'btc-usdb', label: 'BTC/USDB', values: { volume: 11.2 } },
  { key: 'btc-lbtc', label: 'BTC/L-BTC', values: { volume: 7.9 } },
  { key: 'usdt-usdb', label: 'USDT/USDB', values: { volume: 4.3 } },
  { key: 'btc-xaut', label: 'BTC/XAUT', values: { volume: 2.1 } },
]

const trendPoints: TrendChartPoint[] = (() => {
  const random = seeded(3)
  return Array.from({ length: 30 }, (_, index) => {
    const total = Math.round(40 + index * 0.9 + random() * 18)
    const failed = Math.round(total * (0.04 + random() * 0.08))
    return {
      key: `t-${index}`,
      label: `${index + 1} Sep`,
      detail: `${index + 1} September 2026`,
      values: { completed: total - failed, failed },
    }
  })
})()

const dailyList = trendPoints.slice(-7).map((point) => {
  const total = point.values.completed + point.values.failed
  return {
    id: point.key,
    label: point.label,
    value: total,
    valueText: `${point.values.completed} / ${total}`,
  }
})

const balanceByLayer = [
  { id: 'lightning', label: 'Lightning', value: 4_210_000 },
  { id: 'onchain', label: 'On-chain', value: 2_650_000 },
  { id: 'spark', label: 'Spark', value: 980_000 },
  { id: 'arkade', label: 'Arkade', value: 540_000 },
  { id: 'liquid', label: 'Liquid', value: 220_000 },
]

const feeVsAmount = (() => {
  const random = seeded(11)
  const make = (count: number, feeRate: number, spread: number, prefix: string) =>
    Array.from({ length: count }, (_, index) => {
      const amount = Math.round(20_000 + random() * 480_000)
      return {
        id: `${prefix}-${index}`,
        label: `Swap ${prefix}${index + 1}`,
        x: amount,
        y: Math.round(amount * feeRate + random() * spread),
      }
    })
  return [
    { id: 'lightning', label: 'Lightning', points: make(18, 0.001, 180, 'ln') },
    { id: 'onchain', label: 'On-chain', points: make(14, 0.0025, 900, 'oc') },
  ]
})()

const sats = (value: number) => `${new Intl.NumberFormat('en-US').format(value)} sats`
const compactSats = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
const btc = (value: number) => `${value} BTC`

// ─── Layout ─────────────────────────────────────────────────────────────────

function ChartCard({
  title,
  use,
  children,
  wide = false,
}: {
  title: string
  /** When to reach for this form. */
  use: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <Card className={wide ? 'xl:col-span-2' : undefined}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-subhead">{title}</CardTitle>
        <CardDescription className="text-caption">{use}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

export function ChartsGallery() {
  return (
    <div className="space-y-6">
      {/* A single figure is a stat tile, not a chart. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          size="comfortable"
          label="Swaps this week"
          value="1,284"
          description={<Sparkline values={[40, 44, 39, 52, 48, 57, 55, 61, 58, 66, 63, 71]} label="Swaps, last 12 weeks: 39 to 71" />}
        />
        <MetricCard
          size="comfortable"
          label="Volume"
          value="12.9 BTC"
          description={<Sparkline values={[8.1, 8.4, 9.0, 8.7, 9.6, 10.2, 9.9, 10.8, 11.4, 11.1, 12.2, 12.9]} label="Volume, last 12 weeks: 8.1 to 12.9 BTC" />}
        />
        <MetricCard
          size="comfortable"
          label="Success rate"
          value="96.4%"
          description={<Sparkline values={[94.1, 95.2, 93.8, 95.9, 96.0, 95.4, 96.8, 96.1, 95.7, 96.9, 96.2, 96.4]} label="Success rate, last 12 weeks: 93.8% to 96.9%" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Line" use="Change over time, several series. The crosshair lists every series at that point." wide>
          <LineChart
            data={volumeByMonth}
            series={[
              { id: 'lightning', label: 'Lightning' },
              { id: 'onchain', label: 'On-chain' },
              { id: 'spark', label: 'Spark' },
            ]}
            label="Monthly volume by layer"
            scaleLabel="Volume, BTC"
            formatValue={btc}
          />
        </ChartCard>

        <ChartCard title="Area" use="One series over time, where the running level matters: a balance.">
          <AreaChart
            data={balanceByDay}
            series={[{ id: 'balance', label: 'Balance' }]}
            label="Wallet balance, September"
            scaleLabel="Balance, sats"
            integer
            formatValue={compactSats}
          />
        </ChartCard>

        <ChartCard title="Stacked columns · TrendChart" use="A count per period, split into parts: completed and failed swaps. Up to ~120 periods at card width.">
          <TrendChart
            points={trendPoints}
            series={[
              { id: 'completed', label: 'completed', tone: 'primary' },
              { id: 'failed', label: 'not completed', tone: 'danger' },
            ]}
            label="Swap trend"
            scaleLabel="Swaps per day"
          />
        </ChartCard>

        <ChartCard title="Grouped columns" use="Compare a few series across a few categories.">
          <BarChart
            data={swapsByWeekday}
            series={[
              { id: 'lightning', label: 'Lightning' },
              { id: 'onchain', label: 'On-chain' },
              { id: 'spark', label: 'Spark' },
            ]}
            label="Swaps by weekday and layer"
            scaleLabel="Swaps"
            integer
          />
        </ChartCard>

        <ChartCard title="Stacked columns" use="Part-to-whole per category: the total and what it is made of.">
          <BarChart
            data={swapsByWeekday}
            series={[
              { id: 'lightning', label: 'Lightning' },
              { id: 'onchain', label: 'On-chain' },
              { id: 'spark', label: 'Spark' },
            ]}
            layout="stacked"
            label="Swaps by weekday, stacked by layer"
            scaleLabel="Swaps"
            integer
          />
        </ChartCard>

        <ChartCard title="Horizontal bars" use="Many categories, or long names. One series, so one colour.">
          <BarChart
            data={volumeByPair}
            series={[{ id: 'volume', label: 'Volume' }]}
            orientation="horizontal"
            label="Volume by trading pair"
            scaleLabel="Volume, BTC"
            formatValue={btc}
          />
        </ChartCard>

        <ChartCard title="Bar list" use="A ranked or dated list with every value printed: the list view of a trend.">
          <BarList items={dailyList} label="Swaps completed of total, last 7 days" />
        </ChartCard>

        <ChartCard title="Donut" use="Part-to-whole at a glance, six parts at most. Close values belong in a bar chart.">
          <DonutChart segments={balanceByLayer} label="Balance by layer" totalLabel="Total balance" formatValue={compactSats} />
        </ChartCard>

        <ChartCard title="Scatter" use="How two measures relate. Three series at most; hover finds the nearest point.">
          <ScatterChart
            series={feeVsAmount}
            label="Fee against amount, by layer"
            xLabel="Amount"
            yLabel="Fee"
            formatX={compactSats}
            formatY={sats}
          />
        </ChartCard>

        <ChartCard title="Meter" use="One ratio against a limit. Severity changes colour, and always adds an icon and a word.">
          <div className="space-y-5">
            <Meter label="Channel capacity used" value={420_000} max={1_000_000} formatValue={compactSats} />
            <Meter label="Daily swap limit" value={8_100_000} max={10_000_000} formatValue={compactSats} />
            <Meter label="Inbound liquidity used" value={960_000} max={1_000_000} formatValue={compactSats} />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

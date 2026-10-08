import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react'
import {
  AreaChart,
  BarChart,
  BarList,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  DonutChart,
  Icon,
  LineChart,
  MetricCard,
  MixedChart,
  Meter,
  ScatterChart,
  Sparkline,
  TrendChart,
  type ChartDatum,
  type ChartTimeframe,
  type ChartFilter,
  type ChartTitleProps,
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

// The last N days, newest first, so the list reads from today down.
const dailyListFor = (timeframe: string) => dailyListFrom(trendPoints.slice(-(daysIn[timeframe] ?? 7)).reverse())
const dailyListFrom = (points: typeof trendPoints) => points.map((point) => {
  const total = point.values.completed + point.values.failed
  return {
    id: point.key,
    label: point.label,
    value: total,
    valueText: `${point.values.completed} / ${total}`,
    // The completion rate, not the day's share of the week.
    percent: total > 0 ? point.values.completed / total : 0,
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

// ─── Timeframes ─────────────────────────────────────────────────────────────
//
// The chart draws what it is given: the page swaps the data when the
// timeframe changes. Series over time keep their last N periods; totals per
// category are rescaled for the window, each part by its own amount, so the
// shares move too.

const MONTH_FRAMES: readonly ChartTimeframe[] = [
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
]
const DAY_FRAMES: readonly ChartTimeframe[] = [
  { value: '7d', label: '7D' },
  { value: '14d', label: '14D' },
  { value: '30d', label: '30D' },
]
// The bar list prints a row per day: ten at most, so its card stays as tall
// as the charts beside it.
const LIST_FRAMES: readonly ChartTimeframe[] = [
  { value: '5d', label: '5D' },
  { value: '7d', label: '7D' },
  { value: '10d', label: '10D' },
]
const WINDOW_FRAMES: readonly ChartTimeframe[] = [
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
]

// The filters menu every chart carries beside its timeframe. Each filter
// narrows the data by its share, so turning one on visibly changes the chart.
const CHART_FILTERS: readonly ChartFilter[] = [
  { value: 'settled', label: 'Settled only' },
  { value: 'external', label: 'Exclude internal transfers' },
]
const filterShare = { settled: 0.9, external: 0.8 } as Record<string, number>

type Numbers = Record<string, number>
type FilterableProps = {
  data?: readonly { values: Numbers }[]
  points?: readonly ({ values: Numbers } | { y: number })[]
  items?: readonly { value: number; valueText?: ReactNode }[]
  segments?: readonly { value: number }[]
}

/**
 * The chart's own data with the filters on, whatever its shape: the values of
 * each datum or period, a list's or a donut's values, a scatter's y. Whole
 * numbers (counts, sats) stay whole.
 */
const withFilters = (props: FilterableProps, active: readonly string[]): FilterableProps => {
  const share = active.reduce((product, value) => product * (filterShare[value] ?? 1), 1)
  if (share === 1) return {}
  const scale = (value: number) =>
    Number.isInteger(value) ? Math.round(value * share) : Math.round(value * share * 100) / 100
  const scaleValues = (values: Numbers) =>
    Object.fromEntries(Object.entries(values).map(([id, value]) => [id, scale(value)]))
  const next: FilterableProps = {}
  if (props.data) next.data = props.data.map((d) => ({ ...d, values: scaleValues(d.values) }))
  if (props.points)
    next.points = props.points.map((p) => ('values' in p ? { ...p, values: scaleValues(p.values) } : { ...p, y: scale(p.y) }))
  // A filtered row prints its own value: the "12 / 15" text was the unfiltered count.
  if (props.items) next.items = props.items.map((item) => ({ ...item, value: scale(item.value), valueText: undefined }))
  if (props.segments) next.segments = props.segments.map((s) => ({ ...s, value: scale(s.value) }))
  return next
}

const monthsIn = { '3m': 3, '6m': 6, '1y': 12 } as Record<string, number>
const daysIn = { '5d': 5, '7d': 7, '10d': 10, '14d': 14, '30d': 30 } as Record<string, number>
const windowScale = { '1w': 0.25, '1m': 1, '3m': 3 } as Record<string, number>

/** Each part rescaled for the window, by a little more or less than the rest. */
const tilt = (timeframe: string, index: number) =>
  windowScale[timeframe] * (timeframe === '1m' ? 1 : 1 + 0.18 * Math.sin(index * 1.7 + windowScale[timeframe]))

const rescaled = (data: readonly ChartDatum[], timeframe: string, round: (value: number) => number): ChartDatum[] =>
  data.map((d) => ({
    ...d,
    values: Object.fromEntries(Object.entries(d.values).map(([id, value], index) => [id, round(value * tilt(timeframe, index))])),
  }))

// ─── Layout ─────────────────────────────────────────────────────────────────

/** The charts that carry the chart / table switch. */
const FRAMED_CHARTS = new Set<unknown>([LineChart, AreaChart, BarChart, BarList, DonutChart, ScatterChart, TrendChart, MixedChart])

function ChartCard({
  title,
  use,
  timeframes,
  filters = CHART_FILTERS,
  children,
  wide = false,
}: {
  title: string
  /** What the chart measures, and on what scale. */
  use: string
  /** The windows the chart can show; the widest is selected first. */
  timeframes?: readonly ChartTimeframe[]
  /** Further filters, in the menu beside the timeframe; all off at first. Every chart has them. */
  filters?: readonly ChartFilter[]
  /** The chart, or a function from the selected timeframe to the chart. */
  children: ReactNode | ((timeframe: string) => ReactNode)
  wide?: boolean
}) {
  const [timeframe, setTimeframe] = useState(timeframes?.[timeframes.length - 1].value ?? '')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const content = typeof children === 'function' ? children(timeframe) : children
  // A chart with a frame draws its own head: the title and description at the
  // top left, then the timeframe, the filters and the chart / table switch at
  // the top right.
  if (isValidElement(content) && FRAMED_CHARTS.has(content.type)) {
    return (
      <Card variant="secondary" className={wide ? 'xl:col-span-2' : undefined}>
        <CardContent className="p-4">
          {cloneElement(content as ReactElement<ChartTitleProps & FilterableProps>, {
            title,
            description: use,
            timeframes,
            timeframe,
            onTimeframeChange: setTimeframe,
            filters,
            activeFilters,
            onFiltersChange: setActiveFilters,
            ...withFilters(content.props as FilterableProps, activeFilters),
          })}
        </CardContent>
      </Card>
    )
  }
  return (
    <Card variant="secondary" className={wide ? 'xl:col-span-2' : undefined}>
      <CardHeader className="space-y-1 p-4 pb-0">
        <CardTitle className="text-subhead">{title}</CardTitle>
        <CardDescription className="text-caption">{use}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">{content}</CardContent>
    </Card>
  )
}

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

export function ChartsGallery() {
  return (
    <div className="space-y-6">
      {/* A single figure is a stat tile, not a chart. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          size="comfortable"
          label="Swaps this week"
          value="1,284"
          description={<Delta value="+12.7%" />}
          trend={<Sparkline height="fill" pulse values={[40, 44, 39, 52, 48, 57, 55, 61, 58, 66, 63, 71]} label="Swaps, last 12 weeks: 39 to 71" />}
        />
        <MetricCard
          size="comfortable"
          label="Volume"
          value="9.4 BTC"
          description={<Delta value="-8.7%" />}
          trend={<Sparkline height="fill" pulse tone="negative" values={[12.9, 12.4, 12.8, 11.9, 12.1, 11.2, 11.6, 10.8, 10.9, 10.1, 10.3, 9.4]} label="Volume, last 12 weeks: 12.9 down to 9.4 BTC" />}
        />
        <MetricCard
          size="comfortable"
          label="Success rate"
          value="96.4%"
          description={<Delta value="+0.2%" />}
          trend={<Sparkline height="fill" pulse values={[94.1, 95.2, 93.8, 95.9, 96.0, 95.4, 96.8, 96.1, 95.7, 96.9, 96.2, 96.4]} label="Success rate, last 12 weeks: 93.8% to 96.9%" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Mixed" use="Volume, BTC · one view at a time: bars, stacked, lines, areas, dots" timeframes={MONTH_FRAMES} wide>
          {(timeframe) => (
            <MixedChart
              data={volumeByMonth.slice(-monthsIn[timeframe])}
              series={[
                { id: 'lightning', label: 'Lightning' },
                { id: 'onchain', label: 'On-chain' },
                { id: 'spark', label: 'Spark' },
              ]}
              label="Monthly volume by layer"
              scaleLabel="Volume, BTC"
              formatValue={btc}
            />
          )}
        </ChartCard>

        <ChartCard title="Line" use="Volume, BTC · linear, from 0" timeframes={MONTH_FRAMES}>
          {(timeframe) => (
            <LineChart
              data={volumeByMonth.slice(-monthsIn[timeframe])}
              series={[
                { id: 'lightning', label: 'Lightning' },
                { id: 'onchain', label: 'On-chain' },
                { id: 'spark', label: 'Spark' },
              ]}
              label="Monthly volume by layer"
              scaleLabel="Volume, BTC"
              formatValue={btc}
            />
          )}
        </ChartCard>

        <ChartCard title="Area" use="Balance, sats · linear, from 0" timeframes={DAY_FRAMES}>
          {(timeframe) => (
            <AreaChart
              data={balanceByDay.slice(-daysIn[timeframe])}
              series={[{ id: 'balance', label: 'Balance' }]}
              label="Wallet balance, September"
              scaleLabel="Balance, sats"
              integer
              formatValue={compactSats}
            />
          )}
        </ChartCard>

        <ChartCard title="Stacked columns over time" use="Swaps per day · linear, from 0" timeframes={DAY_FRAMES}>
          {(timeframe) => (
            <TrendChart
              points={trendPoints.slice(-daysIn[timeframe])}
              series={[
                { id: 'completed', label: 'completed', tone: 'primary' },
                { id: 'failed', label: 'not completed', tone: 'danger' },
              ]}
              label="Swap trend"
              scaleLabel="Swaps per day"
            />
          )}
        </ChartCard>

        <ChartCard title="Grouped columns" use="Swaps · linear, from 0" timeframes={WINDOW_FRAMES}>
          {(timeframe) => (
            <BarChart
              data={rescaled(swapsByWeekday, timeframe, Math.round)}
              series={[
                { id: 'lightning', label: 'Lightning' },
                { id: 'onchain', label: 'On-chain' },
                { id: 'spark', label: 'Spark' },
              ]}
              label="Swaps by weekday and layer"
              scaleLabel="Swaps"
              integer
            />
          )}
        </ChartCard>

        <ChartCard title="Stacked columns by category" use="Swaps · linear, from 0" timeframes={WINDOW_FRAMES}>
          {(timeframe) => (
            <BarChart
              data={rescaled(swapsByWeekday, timeframe, Math.round)}
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
          )}
        </ChartCard>

        <ChartCard title="Horizontal bars" use="Volume, BTC · linear, from 0" timeframes={WINDOW_FRAMES}>
          {(timeframe) => (
            <BarChart
              data={volumeByPair.map((d, index) => ({ ...d, values: { volume: tenth(d.values.volume * tilt(timeframe, index)) } }))}
              series={[{ id: 'volume', label: 'Volume' }]}
              orientation="horizontal"
              label="Volume by trading pair"
              scaleLabel="Volume, BTC"
              formatValue={btc}
            />
          )}
        </ChartCard>

        <ChartCard title="Bar list" use="Swaps completed of total, per day" timeframes={LIST_FRAMES}>
          {(timeframe) => (
            <BarList items={dailyListFor(timeframe)} label="Swaps completed of total, per day" />
          )}
        </ChartCard>

        <ChartCard title="Donut" use="Balance by layer" timeframes={WINDOW_FRAMES}>
          {(timeframe) => (
              <DonutChart
                segments={balanceByLayer.map((s, index) => ({ ...s, value: Math.round(s.value * tilt(timeframe, index)) }))}
                label="Balance by layer"
                totalLabel="Total balance"
                formatValue={compactSats}
              />
          )}
        </ChartCard>

        <ChartCard title="Scatter" use="Fee against Amount · both linear, from 0" timeframes={WINDOW_FRAMES}>
          {(timeframe) => (
            <ScatterChart
              series={feeVsAmount.map((s) => ({
                ...s,
                points: s.points.slice(0, Math.ceil(s.points.length * Math.min(1, windowScale[timeframe] / 3 + (timeframe === '1w' ? 0.25 : 0.33)))),
              }))}
              label="Fee against amount, by layer"
              xLabel="Amount"
              yLabel="Fee"
              formatX={compactSats}
              formatY={sats}
            />
          )}
        </ChartCard>

        <ChartCard title="Meter" use="Used against each limit">
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

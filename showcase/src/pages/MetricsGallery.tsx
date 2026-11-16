import { useRef, useState } from 'react'
import { BlockTitle } from './blocks'
import {
  cn,
  Icon,
  IconButton,
  MetricCard,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sparkline,
} from '@kaleido-ui/index'

/** The periods the sample changes compare with. */
const WEEK_PERIOD =
  'Changes compare with the preceding 7 days (Oct 31 – Nov 6, 2025, UTC). Today is still running (today, 17 hours of 24), so a fall may only be a short day.'
const YEAR_PERIOD =
  'Changes compare with the preceding 365 days (Nov 14, 2024 – Nov 13, 2025, UTC). Today is still running (today, 17 hours of 24), so a fall may only be a short day.'

/**
 * An icon-only info button that says which period a change compares with.
 * It opens on hover (with a mouse) and on click or tap; a click pins it open
 * until Escape or a click outside.
 */
function PeriodInfo({ period }: { period: string }) {
  const [open, setOpen] = useState(false)
  const pinned = useRef(false)
  const closeTimer = useRef<number>()

  const hoverOpen = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hoverClose = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse' || pinned.current) return
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) pinned.current = false
        setOpen(next)
      }}
    >
      <PopoverTrigger asChild>
        <IconButton
          icon="info"
          label="Compared period"
          title=""
          size="sm"
          className="relative z-10 size-6 rounded-md text-muted-foreground [&_.material-symbols-rounded]:text-icon-xs"
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
          onClick={(event) => {
            // A click after hovering keeps the panel open instead of toggling it shut.
            event.preventDefault()
            window.clearTimeout(closeTimer.current)
            pinned.current = !(open && pinned.current)
            setOpen(pinned.current)
          }}
        />
      </PopoverTrigger>
      <PopoverContent side="bottom" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
        <p className="m-0 text-caption text-foreground">{period}</p>
      </PopoverContent>
    </Popover>
  )
}

/** A change under a metric's figure: green up, red down, with the compared period. */
function Delta({ value, period }: { value: string; period: string }) {
  const down = value.startsWith('-')
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn('inline-flex items-center gap-0.5 whitespace-nowrap font-semibold', down ? 'text-danger-fg' : 'text-success-fg')}>
        <Icon name={down ? 'arrow_downward' : 'arrow_upward'} className="text-icon-xs" aria-hidden="true" />
        {value}
        <span className="sr-only"> against the preceding period</span>
      </span>
      <PeriodInfo period={period} />
    </span>
  )
}

/** In place of a change when the compared period has nothing to compare with. */
function NoPriorData({ period }: { period: string }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="text-muted-foreground">No prior data</span>
      <PeriodInfo period={period} />
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
          description={<Delta value="+12.7%" period={WEEK_PERIOD} />}
          trend={<Sparkline height="fill" pulse values={[40, 44, 39, 52, 48, 57, 55, 61, 58, 66, 63, 71]} label="Orders, last 12 weeks: 39 to 71" />}
        />
        <MetricCard
          size="comfortable"
          labelStyle="title"
          trendPlacement="below-label"
          className="p-3"
          label="Revenue"
          value={<Figure amount="9.4" unit="BTC" />}
          description={<Delta value="-8.7%" period={WEEK_PERIOD} />}
          trend={<Sparkline height="fill" pulse tone="negative" values={[12.9, 12.4, 12.8, 11.9, 12.1, 11.2, 11.6, 10.8, 10.9, 10.1, 10.3, 9.4]} label="Revenue, last 12 weeks: 12.9 down to 9.4 BTC" />}
        />
        <MetricCard
          size="comfortable"
          labelStyle="title"
          trendPlacement="below-label"
          className="p-3"
          label="Conversion rate"
          value="96.4%"
          description={<NoPriorData period={WEEK_PERIOD} />}
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
          value={<Figure amount="47,429" unit="sat" />}
          description={<Delta value="+12.7%" period={YEAR_PERIOD} />}
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
          description={<Delta value="-8.0%" period={YEAR_PERIOD} />}
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
          description={<NoPriorData period={YEAR_PERIOD} />}
          className="p-3"
          trend={<Sparkline height="fill" values={[0, 0, 0, 0, 0, 0]} label="Orders, recent period: no data" />}
        />
      </div>

    </div>
  )
}

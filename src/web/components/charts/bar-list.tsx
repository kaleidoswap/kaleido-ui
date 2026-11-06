import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { ChartFrame, defaultChartFormat, type ChartTitleProps } from './core'

export interface BarListItem {
  id: string
  label: ReactNode
  value: number
  /**
   * The value as the row prints it, when it says more than the number:
   * "12 / 15" (completed of total). Defaults to `formatValue(value)`.
   */
  valueText?: ReactNode
  /**
   * The row's percentage, as a fraction (0.8 = 80%), when it is not its share
   * of the list: a completion rate, a success rate. Defaults to `value / sum`.
   */
  percent?: number
}

export interface BarListProps extends ChartTitleProps {
  items: readonly BarListItem[]
  /** Accessible name of the list. */
  label: string
  formatValue?: (value: number) => string
  /** The value a full bar stands for. Defaults to the largest item. */
  max?: number
  /** `desc` ranks the rows largest first; `none` keeps the given order (a time series). */
  sort?: 'desc' | 'none'
  /** Prints each row's percentage after its value. On by default. */
  showPercent?: boolean
  /**
   * A fixed width for the label column, as a CSS length ("8rem"). Lists that
   * sit one under another (one per asset, say) each size their labels to
   * their own, so their bars start at different points; one width lines them
   * up. Longer labels are truncated. Defaults to the longest label.
   */
  labelWidth?: string
  empty?: ReactNode
  className?: string
}

/**
 * A ranked list of horizontal bars: label, bar, value, one row each — the
 * list view of a trend, or the top pairs by volume. Every value is printed, so
 * the list is its own table view and needs no hover. Each row also prints its
 * percentage — its share of the list, or the item's own `percent`.
 *
 * Given a `title` or `timeframes`, it carries the common chart head (title,
 * timeframe, the chart / table switch) like the other charts.
 *
 * One series, so one fill for every bar: the primary gradient on a lighter
 * step of the same colour, as `Meter` draws its normal state, so a bar list
 * and a meter on one page read as the same kind of mark. Colouring nominal
 * rows darker-where-bigger would re-encode what the bar length already shows.
 * Rows separate by spacing on the track, never by dividers.
 *
 * On a phone the label and value share the top line and the bar runs the full
 * width under them, so a long label or value never squeezes the bar to a
 * sliver.
 */
export function BarList({
  items,
  label,
  formatValue = defaultChartFormat,
  max,
  sort = 'none',
  showPercent = true,
  labelWidth,
  empty,
  className,
  ...head
}: BarListProps) {
  if (items.length === 0) return <>{empty ?? null}</>
  const rows = sort === 'desc' ? [...items].sort((a, b) => b.value - a.value) : items
  const top = Math.max(max ?? 0, ...rows.map((item) => item.value), 0) || 1
  const sum = rows.reduce((acc, item) => acc + Math.max(0, item.value), 0)
  const percentOf = (item: BarListItem) =>
    formatPercent(item.percent ?? (sum > 0 ? Math.max(0, item.value) / sum : 0))

  // The common head (title, timeframe, chart / table switch) only when asked
  // for: on its own the list is its own table view and needs no frame.
  const framed = head.title !== undefined || (head.timeframes?.length ?? 0) > 0

  // Wide: one grid for every row (rows are subgrids), label · bar · value
  // (· percent), so bars start right after the label column, all aligned.
  const label_ = labelWidth ? `minmax(0,${labelWidth})` : 'auto'
  const wideColumns = showPercent ? `${label_} 1fr auto auto` : `${label_} 1fr auto`

  const list = (
    <ol
      data-slot="bar-list"
      aria-label={label}
      className={cn(
        'm-0 grid list-none gap-y-3 p-0 text-caption sm:items-center sm:gap-x-3 sm:gap-y-2',
        'sm:[grid-template-columns:var(--bar-list-columns)]',
        // Under a head, a little more air than the plots' own top margin.
        framed && 'pt-2',
        className
      )}
      style={{ '--bar-list-columns': wideColumns } as CSSProperties}
    >
      {rows.map((item) => {
        const share = Math.max(0, item.value) / top
        return (
          <li
            key={item.id}
            data-slot="bar-list-row"
            className={cn(
              // Narrow: label and value on one line, the bar under them.
              'grid items-baseline gap-x-3 gap-y-1.5',
              showPercent ? 'grid-cols-[minmax(0,1fr)_auto_auto]' : 'grid-cols-[minmax(0,1fr)_auto]',
              'sm:col-span-full sm:grid-cols-subgrid sm:items-center sm:gap-y-0'
            )}
          >
            <span className={cn('min-w-0 truncate text-muted-foreground', !labelWidth && 'sm:max-w-[10rem]')}>
              {item.label}
            </span>
            <span
              className="order-last col-span-full h-2 overflow-hidden rounded-full bg-primary/15 shadow-inner sm:order-none sm:col-span-1"
              aria-hidden="true"
            >
              <span
                className="block h-full rounded-full bg-primary bg-gradient-primary"
                style={{
                  width: `${share * 100}%`,
                  // A non-zero value keeps a sliver, so it never reads as zero.
                  minWidth: item.value > 0 ? 4 : 0,
                }}
              />
            </span>
            <span className="whitespace-nowrap text-right font-semibold tabular-nums text-foreground">
              {item.valueText ?? formatValue(item.value)}
            </span>
            {showPercent && (
              <span className="text-right tabular-nums text-muted-foreground">
                {percentOf(item)}
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )

  if (!framed) return list

  return (
    <ChartFrame
      {...head}
      label={label}
      table={{
        columns: showPercent ? ['Item', 'Value', 'Percent'] : ['Item', 'Value'],
        rows: rows.map((item) => {
          const value = item.valueText ?? formatValue(item.value)
          return showPercent ? [item.label, value, percentOf(item)] : [item.label, value]
        }),
      }}
    >
      {list}
    </ChartFrame>
  )
}

/** 0.8 → "80%"; a non-zero share under 1% prints "<1%", so it never reads as zero. */
function formatPercent(fraction: number) {
  if (fraction > 0 && fraction < 0.005) return '<1%'
  return `${Math.round(fraction * 100)}%`
}

import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { defaultChartFormat, seriesColor } from './core'

export interface BarListItem {
  id: string
  label: ReactNode
  value: number
  /**
   * The value as the row prints it, when it says more than the number:
   * "12 / 15" (completed of total). Defaults to `formatValue(value)`.
   */
  valueText?: ReactNode
}

export interface BarListProps {
  items: readonly BarListItem[]
  /** Accessible name of the list. */
  label: string
  formatValue?: (value: number) => string
  /** The value a full bar stands for. Defaults to the largest item. */
  max?: number
  /** `desc` ranks the rows largest first; `none` keeps the given order (a time series). */
  sort?: 'desc' | 'none'
  empty?: ReactNode
  className?: string
}

/**
 * A ranked list of horizontal bars: label, bar, value, one row each — the
 * list view of a trend, or the top pairs by volume. Every value is printed, so
 * the list is its own table view and needs no hover.
 *
 * One series, so one colour (series slot 1) for every bar: colouring nominal
 * rows darker-where-bigger would re-encode what the bar length already shows.
 * Rows separate by spacing on the muted track, never by dividers.
 */
export function BarList({
  items,
  label,
  formatValue = defaultChartFormat,
  max,
  sort = 'none',
  empty,
  className,
}: BarListProps) {
  if (items.length === 0) return <>{empty ?? null}</>
  const rows = sort === 'desc' ? [...items].sort((a, b) => b.value - a.value) : items
  const top = Math.max(max ?? 0, ...rows.map((item) => item.value), 0) || 1

  return (
    <ol
      data-slot="bar-list"
      aria-label={label}
      className={cn('m-0 list-none space-y-2 p-0', className)}
    >
      {rows.map((item) => {
        const share = Math.max(0, item.value) / top
        return (
          <li
            key={item.id}
            data-slot="bar-list-row"
            className="grid grid-cols-[minmax(4.5rem,auto)_1fr_auto] items-center gap-3 text-caption"
          >
            <span className="truncate text-muted-foreground">{item.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${share * 100}%`,
                  // A non-zero value keeps a sliver, so it never reads as zero.
                  minWidth: item.value > 0 ? 4 : 0,
                  background: seriesColor(0),
                }}
              />
            </span>
            <span className="text-right font-semibold tabular-nums text-foreground">
              {item.valueText ?? formatValue(item.value)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

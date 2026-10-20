import type { ReactNode } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/select'
import { DateRangeFilter, type DateRange } from './date-range-filter'
import { cn } from '../utils/cn'

export interface PeriodOption<Id extends string = string> {
  id: Id
  label: ReactNode
}

export interface PeriodSelectProps<Id extends string = string> {
  /** The presets, in order, including the custom one. */
  options: readonly PeriodOption<Id>[]
  period: Id
  onPeriodChange: (period: Id) => void
  /** The option that shows the two date inputs. */
  customId?: Id
  /** The custom range's days, `YYYY-MM-DD`. */
  range?: DateRange
  onRangeChange?: (range: DateRange) => void
  /** The select's accessible name. */
  label?: string
  /** The date inputs' labels; say the zone the days are read in: "From (UTC)". */
  fromLabel?: string
  toLabel?: string
  className?: string
}

/**
 * The period a page reads: a dropdown of presets ("Last 7 days", "This
 * month"), with two date inputs behind the custom option rather than in front
 * of every reader. A dropdown rather than a chip row: ten presets do not fit
 * a phone, and the closed control still reads as the chosen period.
 *
 * The date inputs have no Clear of their own; the filter bar around them has
 * one. Seed the custom range from the period on screen in `onPeriodChange`,
 * so choosing it adjusts a range instead of asking for two dates from nothing.
 */
export function PeriodSelect<Id extends string = string>({
  options,
  period,
  onPeriodChange,
  customId = 'custom' as Id,
  range = { from: '', to: '' },
  onRangeChange,
  label = 'Period',
  fromLabel,
  toLabel,
  className,
}: PeriodSelectProps<Id>) {
  return (
    <div data-slot="period-select" className={cn('flex min-w-0 flex-wrap items-end gap-3', className)}>
      <Select value={period} onValueChange={(next) => onPeriodChange(next as Id)}>
        <SelectTrigger className="w-full sm:w-[200px]" aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {period === customId && onRangeChange && (
        <DateRangeFilter
          value={range}
          onChange={onRangeChange}
          fromLabel={fromLabel}
          toLabel={toLabel}
          showClear={false}
        />
      )}
    </div>
  )
}

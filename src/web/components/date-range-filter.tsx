import { useId } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'
import { IconButton } from '../primitives/icon-button'

export interface DateRange {
  /** `YYYY-MM-DD`, or empty. */
  from: string
  to: string
}

export interface DateRangeFilterProps {
  value: DateRange
  onChange: (value: DateRange) => void
  /** Reloads the data for the range. Adds a refresh button. */
  onRefresh?: () => void
  /** A refresh in flight: the icon spins and the button is disabled. */
  isRefreshing?: boolean
  fromLabel?: string
  toLabel?: string
  clearLabel?: string
  refreshLabel?: string
  /**
   * The range's own "Clear". On by default; turn it off inside a `FilterBar`,
   * whose "Clear all" already empties the range with the other filters.
   */
  showClear?: boolean
  className?: string
}

/**
 * From / To date inputs with labels, a "Clear" that empties both (disabled
 * when there is nothing to clear) and an optional refresh.
 */
export function DateRangeFilter({
  value,
  onChange,
  onRefresh,
  isRefreshing = false,
  fromLabel = 'From',
  toLabel = 'To',
  clearLabel = 'Clear',
  refreshLabel = 'Refresh',
  showClear = true,
  className,
}: DateRangeFilterProps) {
  const id = useId().replace(/:/g, '')
  const empty = !value.from && !value.to

  return (
    <div data-slot="date-range-filter" className={cn('flex flex-wrap items-end gap-3', className)}>
      <div className="flex min-w-36 flex-col gap-2">
        <Label htmlFor={`${id}-from`}>{fromLabel}</Label>
        <Input
          id={`${id}-from`}
          type="date"
          value={value.from}
          max={value.to || undefined}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
        />
      </div>
      <div className="flex min-w-36 flex-col gap-2">
        <Label htmlFor={`${id}-to`}>{toLabel}</Label>
        <Input
          id={`${id}-to`}
          type="date"
          value={value.to}
          min={value.from || undefined}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </div>
      {showClear && (
        <Button type="button" variant="ghost" disabled={empty} onClick={() => onChange({ from: '', to: '' })}>
          {clearLabel}
        </Button>
      )}
      {onRefresh && (
        <IconButton
          label={refreshLabel}
          variant="surface"
          size="lg"
          disabled={isRefreshing}
          aria-busy={isRefreshing || undefined}
          onClick={onRefresh}
          icon={<Icon name="refresh" aria-hidden="true" className={cn(isRefreshing && 'animate-spin motion-reduce:animate-none')} />}
        />
      )}
    </div>
  )
}

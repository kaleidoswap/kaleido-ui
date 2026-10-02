import { useId } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'

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
  className,
}: DateRangeFilterProps) {
  const id = useId().replace(/:/g, '')
  const empty = !value.from && !value.to

  return (
    <div data-slot="date-range-filter" className={cn('flex flex-wrap items-end gap-3', className)}>
      <div className="min-w-36 space-y-1.5">
        <Label htmlFor={`${id}-from`}>{fromLabel}</Label>
        <Input
          id={`${id}-from`}
          type="date"
          value={value.from}
          max={value.to || undefined}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
        />
      </div>
      <div className="min-w-36 space-y-1.5">
        <Label htmlFor={`${id}-to`}>{toLabel}</Label>
        <Input
          id={`${id}-to`}
          type="date"
          value={value.to}
          min={value.from || undefined}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
        />
      </div>
      <Button type="button" variant="ghost" disabled={empty} onClick={() => onChange({ from: '', to: '' })}>
        {clearLabel}
      </Button>
      {onRefresh && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xl"
          aria-label={refreshLabel}
          title={refreshLabel}
          disabled={isRefreshing}
          aria-busy={isRefreshing || undefined}
          onClick={onRefresh}
          className="text-secondary-content hover:bg-secondary/15 hover:shadow-glow-violet-soft focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:shadow-glow-primary-soft"
        >
          <Icon name="refresh" className={cn('text-icon-lg', isRefreshing && 'animate-spin motion-reduce:animate-none')} />
        </Button>
      )}
    </div>
  )
}

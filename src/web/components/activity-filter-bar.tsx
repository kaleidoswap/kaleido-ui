import { AppIcon } from './app-icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'
import { IconButton } from '../primitives/icon-button'

export interface ActivityStatusOption<TValue extends string = string> {
  value: TValue
  label: string
}

export interface ActivityFilterBarProps<TStatus extends string = string> {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  statusFilter: TStatus
  onStatusFilterChange: (value: TStatus) => void
  statusOptions: ActivityStatusOption<TStatus>[]
  hasActiveFilters?: boolean
  onClearFilters?: () => void
  searchPlaceholder?: string
}

export function ActivityFilterBar<TStatus extends string = string>({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  hasActiveFilters = false,
  onClearFilters,
  searchPlaceholder = 'Search by txid, asset...',
}: ActivityFilterBarProps<TStatus>) {
  return (
    // The row takes the status Select's height, and the search field stretches to
    // match it, so the two read as one bar.
    <div className="flex items-stretch gap-2">
      <div className="group relative min-w-0 flex-1">
        <AppIcon
          name="search"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/55 transition-colors group-focus-within:text-secondary-content"
        />
        <input
          type="text"
          data-testid="activity-search"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="h-full w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 py-2.5 pl-10 pr-8 text-caption text-foreground shadow-inner outline-none transition-all placeholder:text-muted-foreground focus:bg-secondary/10 focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft"
        />
        {searchTerm && (
          <IconButton
            icon="close"
            label="Clear search"
            size="sm"
            onClick={() => onSearchTermChange('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          />
        )}
      </div>

      {/* The library Select as it is: no classes of its own, so it scrolls and
          searches past four statuses like every other select. */}
      <div className="shrink-0">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as TStatus)}
        >
          <SelectTrigger hug aria-label="Filter activity by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && onClearFilters && (
        <IconButton icon="close" label="Clear filters" variant="surface" size="lg" className="self-center" onClick={onClearFilters} />
      )}
    </div>
  )
}

import { AppIcon } from './app-icon'
import { Button } from '../primitives/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'

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
    <div className="flex h-11 items-center gap-2">
      <div className="group relative h-full flex-1">
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
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchTermChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-foreground/55 transition-colors hover:text-foreground"
          >
            <AppIcon name="close" size="sm" />
          </button>
        )}
      </div>

      <div className="h-full w-28 shrink-0">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as TStatus)}
        >
          <SelectTrigger
            aria-label="Filter activity by status"
            className="h-full rounded-xl border-0 bg-foreground/5 px-3 py-0 text-caption font-bold text-foreground shadow-inner hover:bg-secondary/10 focus:ring-0 data-[state=open]:bg-secondary/15 data-[state=open]:ring-1 data-[state=open]:ring-primary/50 data-[state=open]:shadow-glow-primary-soft"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover/95 p-1.5 shadow-popover">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="py-2 text-caption">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && onClearFilters && (
        <Button
          variant="surface"
          size="icon-lg"
          onClick={onClearFilters}
          aria-label="Clear filters"
          title="Clear Filters"
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <AppIcon name="close" size="lg" />
        </Button>
      )}
    </div>
  )
}

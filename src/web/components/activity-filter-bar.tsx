import { AppIcon } from './app-icon'
import { Button } from '../primitives/button'

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
    <div className="flex h-10 items-center gap-2">
      <div className="relative h-full flex-1">
        <AppIcon
          name="search"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="h-full w-full rounded-xl border bg-background/40 pl-9 pr-8 text-xs text-white shadow-sm backdrop-blur-xl transition-all placeholder:text-white/30 focus:border-primary/40 focus:outline-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchTermChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
          >
            <AppIcon name="close" className="size-icon-sm" />
          </button>
        )}
      </div>

      <div className="group relative h-full w-28 shrink-0">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as TStatus)}
          className="h-full w-full cursor-pointer appearance-none rounded-xl border bg-card/40 px-3 text-xs font-bold text-white shadow-sm backdrop-blur-xl transition-colors hover:border-border focus:border-primary/40 focus:outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-card">
              {option.label}
            </option>
          ))}
        </select>
        <AppIcon
          name="chevronDown"
          className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-primary"
        />
      </div>

      {hasActiveFilters && onClearFilters && (
        <Button variant="surface" size="icon-lg" onClick={onClearFilters} title="Clear Filters">
          <AppIcon name="close" className="size-icon-lg" />
        </Button>
      )}
    </div>
  )
}

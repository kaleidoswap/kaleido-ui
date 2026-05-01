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
          className="h-full w-full rounded-2xl bg-surface-card pl-9 pr-8 text-xs text-white shadow-inner backdrop-blur-xl transition-all placeholder:text-white/30 focus:bg-surface-elevated focus:outline-none"
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

      <div className="h-full w-28 shrink-0">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as TStatus)}
        >
          <SelectTrigger className="h-full rounded-2xl border-0 bg-surface-card px-3 py-0 text-xs font-bold text-white shadow-inner backdrop-blur-xl hover:bg-surface-elevated focus:ring-0 data-[state=open]:bg-surface-elevated">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-0 bg-popover/95 p-1.5 shadow-popover">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="py-2 text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && onClearFilters && (
        <Button variant="surface" size="icon-lg" onClick={onClearFilters} title="Clear Filters">
          <AppIcon name="close" className="size-icon-lg" />
        </Button>
      )}
    </div>
  )
}

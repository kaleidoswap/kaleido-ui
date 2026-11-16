import { AppIcon } from './app-icon'
import { Input } from '../primitives/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select'
import { GlyphButton } from '../primitives/glyph-button'
import { Close } from '../icons/outlined'

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
      <div className="flex min-w-0 flex-1">
        {/* The library Input: the glyph is its prefix, the clear button its suffix, so typed text stops short of both. */}
        <Input
          type="text"
          data-testid="activity-search"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          prefix={<AppIcon name="search" size="sm" />}
          suffix={
            searchTerm ? (
              <GlyphButton icon={Close} label="Clear search" size="sm" onClick={() => onSearchTermChange('')} />
            ) : undefined
          }
          className="h-auto min-h-0 flex-1 gap-2.5 px-3 text-caption text-foreground"
        />
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
        <GlyphButton icon={Close} label="Clear filters" variant="surface" size="lg" className="self-center" onClick={onClearFilters} />
      )}
    </div>
  )
}

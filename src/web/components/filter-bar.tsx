import { useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../primitives/collapsible'
import { Icon } from '../primitives/icon'
import { useIsNarrow } from '../hooks/use-media-query'
import { cn } from '../utils/cn'

/** "1 filter applied", "3 filters applied". */
export function activeFiltersLabel(count: number): string {
  return `${count} ${count === 1 ? 'filter' : 'filters'} applied`
}

export interface FilterBarProps {
  /** How many filters are set. Above zero, the count and "Clear all" show. */
  activeCount: number
  onClear?: () => void
  /** The filter controls. */
  children: ReactNode
  /** "N filters applied"; override to translate. */
  activeLabel?: (count: number) => string
  clearLabel?: string
  /** The narrow-screen toggle's visible text. */
  filtersLabel?: string
  /** The toggle's count, spoken: `(count) => count ? '2 active' : 'none'`. */
  countLabel?: (count: number) => string
  /** Start the narrow panel open. */
  defaultOpen?: boolean
  /** Wide layout: the controls and the count line from the left (default) or the right. */
  align?: 'start' | 'end'
  className?: string
}

const defaultCountLabel = (count: number) => (count > 0 ? `${count} active` : 'none')

/**
 * The container for a list's filters.
 *
 * Wide screens: the controls in a row; with filters set, "N filters applied"
 * and "Clear all" beside them. Narrow screens (below `sm`): one "Filters"
 * toggle that opens the controls stacked underneath, its count part of its
 * name ("Filters, 2 active"), with "Clear all" still in reach beside it.
 */
export function FilterBar({
  activeCount,
  onClear,
  children,
  activeLabel = activeFiltersLabel,
  clearLabel = 'Clear all',
  filtersLabel = 'Filters',
  countLabel = defaultCountLabel,
  defaultOpen = false,
  align = 'start',
  className,
}: FilterBarProps) {
  const narrow = useIsNarrow()
  const [open, setOpen] = useState(defaultOpen)
  const clear =
    activeCount > 0 && onClear ? (
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        {clearLabel}
      </Button>
    ) : null

  if (narrow) {
    return (
      <Collapsible open={open} onOpenChange={setOpen} data-slot="filter-bar" data-layout="narrow" className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger
            type="button"
            aria-label={`${filtersLabel}, ${countLabel(activeCount)}`}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-muted/40 px-3 text-caption font-semibold text-foreground shadow-raised ring-1 ring-inset ring-secondary/15 hover-gradient-violet hover:ring-secondary/35 data-[state=open]:bg-secondary/15 data-[state=open]:text-secondary-content data-[state=open]:ring-secondary/35"
          >
            <Icon name="tune" className="text-icon-md" />
            {filtersLabel}
            {activeCount > 0 && (
              <span aria-hidden="true" className="rounded-full bg-primary/15 px-1.5 text-xxs font-bold text-brand ring-1 ring-inset ring-primary/30">
                {activeCount}
              </span>
            )}
            <CollapsibleChevron />
          </CollapsibleTrigger>
          {clear}
        </div>
        <CollapsibleContent className="flex flex-col gap-3">{children}</CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div
      data-slot="filter-bar"
      data-layout="wide"
      className={cn('flex flex-wrap items-end gap-3', align === 'end' && 'justify-end', className)}
    >
      {children}
      {activeCount > 0 && (
        // Its own line under the filters, never squeezed in beside them.
        // The count belongs to the controls above it: a tighter gap than theirs.
        <div className={cn('-mt-1.5 flex basis-full items-center gap-2', align === 'end' && 'justify-end')}>
          <span className="text-caption text-muted-foreground">{activeLabel(activeCount)}</span>
          {clear}
        </div>
      )}
    </div>
  )
}

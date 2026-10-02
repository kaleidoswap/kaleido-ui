import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface PagerProps {
  /** Index of the first row on this page. */
  offset: number
  /** Rows asked for per page. */
  limit: number
  /** Rows this page actually returned. */
  returned: number
  onOffsetChange: (offset: number) => void
  /** What the rows are: "swaps". Defaults to "rows". */
  noun?: string
  previousLabel?: string
  nextLabel?: string
  className?: string
}

/**
 * Offset paging for an API that does not return a total.
 *
 * A next page exists only when this page came back full (`returned ===
 * limit`); a shorter page is the last. It says "swaps 51–100", never "of N" —
 * the total is not known — and renders nothing when there is neither a
 * previous nor a next page. `DotPagination` is for carousel steps, not this.
 */
export function Pager({
  offset,
  limit,
  returned,
  onOffsetChange,
  noun = 'rows',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
}: PagerProps) {
  const hasPrevious = offset > 0
  const hasNext = returned === limit && limit > 0
  if (!hasPrevious && !hasNext) return null
  const first = returned > 0 ? offset + 1 : offset
  const last = offset + returned

  return (
    <nav aria-label="Pagination" data-slot="pager" className={cn('flex items-center justify-between gap-3', className)}>
      <p className="m-0 text-caption tabular-nums text-muted-foreground">
        {noun} {first}–{last}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!hasPrevious}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          <Icon name="chevron_left" className="text-icon-md" />
          {previousLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={!hasNext} onClick={() => onOffsetChange(offset + limit)}>
          {nextLabel}
          <Icon name="chevron_right" className="text-icon-md" />
        </Button>
      </div>
    </nav>
  )
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface RefreshButtonProps {
  onRefresh: () => void
  /** A read is in flight: the icon spins and presses are ignored. */
  isRefreshing?: boolean
  label?: ReactNode
  className?: string
}

/**
 * A page's one Refresh. While a read is in flight it stays enabled and
 * focusable and says it is busy (`aria-busy`); a second press is ignored
 * rather than refused by disabling the element under the reader's focus.
 */
export function RefreshButton({ onRefresh, isRefreshing = false, label = 'Refresh', className }: RefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      data-slot="refresh-button"
      aria-busy={isRefreshing || undefined}
      className={className}
      onClick={() => {
        if (!isRefreshing) onRefresh()
      }}
    >
      <Icon
        name="refresh"
        className={cn('text-icon-md', isRefreshing && 'animate-spin motion-reduce:animate-none')}
      />
      {label}
    </Button>
  )
}

/** The slice of a TanStack Query result (or anything shaped like it) this reads. */
export interface ReadStatusRead {
  data: unknown
  /** When the last read that succeeded landed, in ms since the epoch. */
  dataUpdatedAt: number
  isError: boolean
  isFetching: boolean
  refetch: () => unknown
}

export interface ReadStatusProps {
  /** Every read the surface shows. The oldest of them is how old the surface is. */
  reads: readonly ReadStatusRead[]
  /** How the time of the last read is written: the consumer owns locale and zone. */
  formatTime: (ms: number) => string
  lastUpdateLabel?: ReactNode
  updatedLabel?: ReactNode
  /** Shown, and announced after a requested refresh, when a refresh failed but older figures remain. */
  staleLabel?: string
  refreshLabel?: ReactNode
  /** Announced after a requested refresh lands, given the formatted time. */
  updatedAnnouncement?: (time: string) => string
  /** How long "Updated" stays beside the time once a read lands. */
  updatedMarkMs?: number
  className?: string
}

/** How long "Updated" stays beside the time by default. */
export const READ_STATUS_UPDATED_MS = 2_000

/**
 * How old the figures on a surface are, beside the control that makes them
 * newer. One per surface, in its page header.
 *
 * - "Last update" is the last read that succeeded, not the last attempt.
 * - A finished read says so for a moment ("Updated"), so a figure never
 *   changes silently — the automatic reads included.
 * - A failed refresh keeps the figures and says they are the previous read;
 *   an error panel is only for a surface that never read at all.
 * - An automatic read spins the same Refresh a click does. Only a requested
 *   refresh is announced, so a minute's background read never talks over
 *   what a screen reader is reading.
 */
export function ReadStatus({
  reads,
  formatTime,
  lastUpdateLabel = 'Last update:',
  updatedLabel = 'Updated',
  staleLabel = 'Could not refresh. Showing the previous read.',
  refreshLabel,
  updatedAnnouncement = (time) => `Updated. Last update: ${time}`,
  updatedMarkMs = READ_STATUS_UPDATED_MS,
  className,
}: ReadStatusProps) {
  const fetching = reads.some((read) => read.isFetching)
  const landed = reads.every((read) => read.data !== undefined)
  const lastRead = landed && reads.length > 0 ? Math.min(...reads.map((read) => read.dataUpdatedAt)) : undefined
  const previous = reads.some((read) => read.data !== undefined && read.isError)

  const [updated, setUpdated] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const requested = useRef(false)
  const wasFetching = useRef(fetching)

  useEffect(() => {
    const finished = wasFetching.current && !fetching
    wasFetching.current = fetching
    if (!finished) return
    if (previous) {
      if (requested.current) setAnnouncement(staleLabel)
      requested.current = false
      return
    }
    if (lastRead === undefined) return
    if (requested.current) setAnnouncement(updatedAnnouncement(formatTime(lastRead)))
    requested.current = false
    setUpdated(true)
  }, [fetching, previous, lastRead, staleLabel, updatedAnnouncement, formatTime])

  useEffect(() => {
    if (!updated) return
    const timer = window.setTimeout(() => setUpdated(false), updatedMarkMs)
    return () => window.clearTimeout(timer)
  }, [updated, updatedMarkMs])

  const refresh = () => {
    requested.current = true
    setAnnouncement('')
    for (const read of reads) void read.refetch()
  }

  return (
    <div data-slot="read-status" className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      <p className="m-0 text-caption tabular-nums text-muted-foreground">
        {previous && <span className="mr-2 text-warning-fg">{staleLabel}</span>}
        {lastUpdateLabel} {lastRead === undefined ? '—' : formatTime(lastRead)}
        {updated && (
          <span className="ml-2 inline-flex items-center gap-1 text-success-fg">
            <Icon name="check" className="text-icon-xs" />
            {updatedLabel}
          </span>
        )}
      </p>
      <RefreshButton onRefresh={refresh} isRefreshing={fetching} label={refreshLabel} />
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  )
}

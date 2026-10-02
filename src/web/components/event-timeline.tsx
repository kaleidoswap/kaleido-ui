import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface TimelineEvent {
  id: string
  /** What happened: "Invoice paid". */
  label: ReactNode
  /** How long since the previous event, already formatted: "+8s". */
  duration?: ReactNode
  /** When it happened, already formatted in the consumer's locale and zone. */
  timestamp: ReactNode
  /** The machine-readable instant, for `<time dateTime>`. */
  dateTime?: string
}

export interface EventTimelineProps {
  events: readonly TimelineEvent[]
  /** The list's accessible name: "Status history". */
  label?: string
  className?: string
}

/**
 * An ordered log of events (`<ol>`): the event on the left, its duration and
 * timestamp on the right, quieter than the event. Formatting is the
 * consumer's — values arrive formatted — so the list never decides a locale
 * or a time zone. Wrap it in `QueryState` for loading and empty.
 */
export function EventTimeline({ events, label, className }: EventTimelineProps) {
  return (
    <ol aria-label={label} data-slot="event-timeline" className={cn('m-0 list-none space-y-1.5 p-0', className)}>
      {events.map((event) => (
        <li
          key={event.id}
          data-slot="event-timeline-item"
          className="relative flex items-baseline justify-between gap-3 rounded-xl bg-muted/40 py-2.5 pl-7 pr-3 before:absolute before:left-3 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-primary/60 last:before:bg-primary last:before:shadow-glow-primary-soft"
        >
          <span className="min-w-0 text-caption font-medium text-foreground">{event.label}</span>
          <span className="flex shrink-0 items-baseline gap-2 text-caption tabular-nums text-muted-foreground">
            {event.duration !== undefined && <span data-slot="event-timeline-duration">{event.duration}</span>}
            <time dateTime={event.dateTime}>{event.timestamp}</time>
          </span>
        </li>
      ))}
    </ol>
  )
}

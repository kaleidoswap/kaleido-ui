import type { HTMLAttributes, ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { cn } from '../utils/cn'

export interface InstantsStatementProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The range in words, with its zone: "1–30 September 2026, UTC". */
  description: ReactNode
  /** The first instant asked for, as sent: an ISO 8601 timestamp. */
  start?: string
  /** The last instant asked for, as sent. An open end is left unsaid. */
  end?: string
  startLabel?: string
  endLabel?: string
  className?: string
}

/**
 * The range a surface asked for, in words, and the two instants it actually
 * sent, each copyable. A reader reconciling against their own logs pastes
 * these into their own query rather than working out what "1 September"
 * became — honest only when the caller computes them with the same function
 * its request is built with.
 */
export function InstantsStatement({
  description,
  start,
  end,
  startLabel = 'Range start',
  endLabel = 'Range end',
  className,
  ...rest
}: InstantsStatementProps) {
  return (
    <div data-slot="instants-statement" className={cn('space-y-1 text-caption text-muted-foreground', className)} {...rest}>
      <p className="m-0">{description}</p>
      {start || end ? (
        <dl className="m-0 space-y-1">
          {start ? <Boundary label={startLabel} value={start} /> : null}
          {end ? <Boundary label={endLabel} value={end} /> : null}
        </dl>
      ) : null}
    </div>
  )
}

function Boundary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <dt>{label}</dt>
      <dd className="m-0 inline-flex items-center gap-1 font-mono text-foreground">
        <span className="select-all break-all">{value}</span>
        <CopyButton value={value} label={label.toLowerCase()} />
      </dd>
    </div>
  )
}

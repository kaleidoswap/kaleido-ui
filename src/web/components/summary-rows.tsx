import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type SummaryRowTone = 'default' | 'primary' | 'warning' | 'danger' | 'success'

export interface SummaryRowItem {
  label: ReactNode
  value: ReactNode
  /** Secondary line under the value — a rate, a percentage, a deadline. */
  hint?: ReactNode
  /** The number the user is actually deciding on. At most one per list. */
  emphasis?: boolean
  /** Addresses, hashes, ids. */
  mono?: boolean
  tone?: SummaryRowTone
}

export interface SummaryRowsProps {
  rows: SummaryRowItem[]
  className?: string
}

const valueTone: Record<SummaryRowTone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  warning: 'text-warning',
  danger: 'text-danger',
  success: 'text-success',
}

/**
 * Label-on-the-left, value-on-the-right rows for a review or confirmation
 * surface: what you pay, what lands, the fee, the counterparty.
 *
 * Rows are `bg-muted/40` blocks separated by spacing — the canonical nested
 * layer inside a card, no dividers and no outlines. Distinct from
 * `ActivityDetailRow`, which is the dotted-leader treatment for *reading* a
 * settled transaction; this one is for *deciding* on a pending one, so values
 * stay full-size and the deciding number can take `emphasis`.
 *
 * Values are `tabular-nums` so a stack of amounts lines up on the decimal.
 */
export function SummaryRows({ rows, className }: SummaryRowsProps) {
  return (
    <div data-slot="summary-rows" className={cn('space-y-1.5', className)}>
      {rows.map((row, index) => (
        <div
          key={index}
          data-slot="summary-row"
          data-emphasis={row.emphasis ? 'true' : undefined}
          className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5"
        >
          <span className="shrink-0 text-xs text-muted-foreground">{row.label}</span>
          <div className="flex min-w-0 flex-col items-end">
            <span
              className={cn(
                'truncate tabular-nums',
                row.emphasis ? 'text-base font-bold' : 'text-sm font-medium',
                row.mono && 'font-mono text-xs',
                valueTone[row.tone ?? 'default'],
              )}
            >
              {row.value}
            </span>
            {row.hint && (
              <span className="mt-0.5 text-xxs text-muted-foreground">{row.hint}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type SummaryRowTone = 'default' | 'primary' | 'warning' | 'danger' | 'success' | 'muted'

export interface SummaryRowItem {
  label: ReactNode
  value: ReactNode
  /** Secondary line under the value — a rate, a percentage, a deadline. */
  hint?: ReactNode
  /** The number the user is actually deciding on. At most one per list. */
  emphasis?: boolean
  /** Addresses, hashes, ids. */
  mono?: boolean
  /**
   * The value's colour. `muted` is for a value that should read quieter than
   * its label — the timestamp beside a log event — and also drops it to
   * `caption` at normal weight.
   */
  tone?: SummaryRowTone
}

export interface SummaryRowsProps {
  rows: SummaryRowItem[]
  /**
   * The list's semantics. `dl` (default) is a label/value list — a `dt`/`dd`
   * pair per row. `ol` is an ordered log (a status history, in sequence) and
   * `ul` an unordered one; each row is an `li`. The visual is the same.
   */
  as?: 'dl' | 'ol' | 'ul'
  className?: string
}

const valueTone: Record<SummaryRowTone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  warning: 'text-warning',
  danger: 'text-danger',
  success: 'text-success',
  muted: 'text-muted-foreground',
}

const rowClass = 'flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5'

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
export function SummaryRows({ rows, as = 'dl', className }: SummaryRowsProps) {
  const List = as
  const isDl = as === 'dl'
  const Label = isDl ? 'dt' : 'span'
  const Value = isDl ? 'dd' : 'div'

  return (
    <List
      data-slot="summary-rows"
      className={cn('m-0 list-none space-y-1.5 p-0', className)}
    >
      {rows.map((row, index) => {
        const muted = row.tone === 'muted'
        const content = (
          <>
            <Label className="shrink-0 text-caption text-muted-foreground">{row.label}</Label>
            <Value className="m-0 flex min-w-0 flex-col items-end">
              <span
                className={cn(
                  'truncate tabular-nums',
                  row.emphasis
                    ? 'text-body font-bold'
                    : muted
                      ? 'text-caption font-normal'
                      : 'text-body font-medium',
                  row.mono && 'font-mono text-caption',
                  valueTone[row.tone ?? 'default'],
                )}
              >
                {row.value}
              </span>
              {row.hint && <span className="mt-0.5 text-xxs text-muted-foreground">{row.hint}</span>}
            </Value>
          </>
        )
        const rowProps = {
          'data-slot': 'summary-row',
          'data-emphasis': row.emphasis ? 'true' : undefined,
          className: rowClass,
        }
        // A `div` may group each dt/dd pair inside a dl; in a list the row is the li.
        return isDl ? (
          <div key={index} {...rowProps}>
            {content}
          </div>
        ) : (
          <li key={index} {...rowProps}>
            {content}
          </li>
        )
      })}
    </List>
  )
}

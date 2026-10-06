import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { DottedLeader } from './dotted-leader'

export type SummaryRowTone = 'default' | 'primary' | 'warning' | 'danger' | 'success' | 'muted'

export interface SummaryRowItem {
  label: ReactNode
  value: ReactNode
  /** Secondary note beside the value — a rate, a percentage, a deadline. */
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
  primary: 'text-brand',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
  success: 'text-success-fg',
  muted: 'text-muted-foreground',
}

const rowClass = 'flex items-center gap-3 py-1'

/**
 * Label-on-the-left, value-on-the-right rows for a review or confirmation
 * surface: what you pay, what lands, the fee, the counterparty.
 *
 * Rows use the transaction-card treatment: the label and value tied by a
 * continuous leader line (`DottedLeader`), as in `ActivityDetailRow`. Unlike
 * that one, values stay full-size and the deciding number can take `emphasis`.
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
      className={cn('m-0 list-none p-0', className)}
    >
      {rows.map((row, index) => {
        const muted = row.tone === 'muted'
        const content = (
          <>
            <Label className="shrink-0 text-caption text-muted-foreground">{row.label}</Label>
            <DottedLeader />
            <Value className="m-0 flex min-w-0 max-w-[65%] items-baseline gap-2">
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
              {row.hint && <span className="shrink-0 text-xxs text-muted-foreground">{row.hint}</span>}
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

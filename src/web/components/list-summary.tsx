import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

const count = (n: number, noun: string) => `${n} ${n === 1 ? noun.replace(/s$/, '') : noun}`

export interface ListSummaryProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  /** What a row is, plural: "swaps". */
  noun: string
  /** Rows on screen. */
  shown: number
  /** For a list read in windows: where the window starts. */
  offset?: number
  /** How many exist, where the API reports it. Leave it out rather than guess. */
  total?: number
  filtersActive?: boolean
  /** Said after a filtered count when there is no total. */
  noTotalNote?: string
  className?: string
}

/**
 * How many rows a list is showing, and of how many.
 *
 * Only as honest as the API: with a `total` it says "Showing 12 of 40 keys";
 * without one it says what it can — the rows shown, the window they are —
 * and, under a filter, that the total is not reported, instead of printing a
 * denominator it would have to invent. Pairs with `Pager`.
 */
export function ListSummary({
  noun,
  shown,
  offset,
  total,
  filtersActive = false,
  noTotalNote = ', narrowed by the filters above. The API does not report how many exist in all.',
  className,
  ...rest
}: ListSummaryProps) {
  let text: string
  if (total !== undefined) {
    text = filtersActive ? `Showing ${shown} of ${count(total, noun)}` : count(total, noun)
  } else if (offset !== undefined && shown > 0) {
    text = `Showing ${noun} ${offset + 1}–${offset + shown}`
  } else {
    text = `Showing ${count(shown, noun)}`
  }
  return (
    <p data-slot="list-summary" className={cn('m-0 text-caption tabular-nums text-muted-foreground', className)} {...rest}>
      {text}
      {filtersActive && total === undefined ? noTotalNote : ''}
    </p>
  )
}

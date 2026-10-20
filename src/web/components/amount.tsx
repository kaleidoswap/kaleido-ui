import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface AmountProps {
  /** The figure with its unit, formatted by the caller: "1,000,000 sat". `null` renders a dash. */
  figure: string | null | undefined
  /** What the figure counts: "BTC", "USDT". */
  asset?: ReactNode
  /** Said in the asset's place when the source did not name one. */
  missingAsset?: ReactNode
  /** The asset under the figure, for a table cell; beside it otherwise. */
  stacked?: boolean
  className?: string
}

/**
 * One amount as a table cell shows it: the figure, which never breaks, and
 * the asset as quieter text — under it when `stacked`, so every row of a
 * column is the same height and the digits line up when the cell is
 * right-aligned.
 *
 * The asset is part of the amount, not decoration: it stays in the text a
 * screen reader or a copy reads, and is never dropped to save width.
 */
export function Amount({ figure, asset, missingAsset = 'asset not reported', stacked = false, className }: AmountProps) {
  if (figure === null || figure === undefined || figure === '' || figure === '—') {
    return (
      <span data-slot="amount" className={cn('text-muted-foreground', className)}>
        —
      </span>
    )
  }
  return (
    <span data-slot="amount" className={cn(stacked ? 'inline-flex flex-col items-start' : 'inline', 'tabular-nums', className)}>
      <span className="whitespace-nowrap">{figure}</span>
      {/* Dropped from layout in the flex column, kept in the text it reads as. */}{' '}
      <span className="whitespace-nowrap text-caption font-normal text-muted-foreground">{asset ?? missingAsset}</span>
    </span>
  )
}

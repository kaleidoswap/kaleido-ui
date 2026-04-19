import { cn } from '../utils/cn'
import { TransactionItem, type TransactionItemProps } from './transaction-item'

export interface TransactionSection {
  title: string
  items: TransactionItemProps[]
}

export interface TransactionListProps {
  /** Flat list of transactions — used when no sections are needed */
  transactions?: TransactionItemProps[]
  /** Grouped list of transactions with section headers */
  sections?: TransactionSection[]
  isLoading?: boolean
  /** Number of skeleton rows to show while loading (default: 5) */
  skeletonCount?: number
  /** Rendered when the list is empty and not loading */
  emptyState?: React.ReactNode
  /** Default empty state message when emptyState prop is not set */
  emptyMessage?: string
  className?: string
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-16 animate-pulse rounded bg-muted/50" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-3.5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-8 animate-pulse rounded bg-muted/50" />
      </div>
    </div>
  )
}

function DefaultEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted">
        <span className="material-symbols-outlined text-[28px] text-muted-foreground">
          receipt_long
        </span>
      </div>
      <p className="text-caption font-medium text-muted-foreground">{message}</p>
    </div>
  )
}

export function TransactionList({
  transactions,
  sections,
  isLoading = false,
  skeletonCount = 5,
  emptyState,
  emptyMessage = 'No transactions yet',
  className,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  // ─── flat list ───────────────────────────────────────────────────────────────
  if (transactions !== undefined) {
    if (transactions.length === 0) {
      return (
        <div className={className}>
          {emptyState ?? <DefaultEmpty message={emptyMessage} />}
        </div>
      )
    }
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {transactions.map((tx, i) => (
          <TransactionItem key={i} {...tx} />
        ))}
      </div>
    )
  }

  // ─── sectioned list ───────────────────────────────────────────────────────────
  if (sections !== undefined) {
    const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)
    if (totalItems === 0) {
      return (
        <div className={className}>
          {emptyState ?? <DefaultEmpty message={emptyMessage} />}
        </div>
      )
    }
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {sections.map((section) => {
          if (section.items.length === 0) return null
          return (
            <div key={section.title} className="flex flex-col gap-2">
              <p className="px-1 text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                {section.title}
              </p>
              {section.items.map((tx, i) => (
                <TransactionItem key={i} {...tx} />
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

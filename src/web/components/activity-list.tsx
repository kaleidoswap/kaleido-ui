import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { TransactionCard } from './transaction-card'
import { NetworkBadge, type NetworkType } from './network-badge'
import { Icon } from '../primitives/icon'
import type { StatusType } from './status-badge'
import { cn } from '../utils/cn'

export interface ActivityListItem<TData = unknown> {
  id: string
  direction: 'inbound' | 'outbound'
  status: StatusType
  displayAmount: string
  unit?: string
  timestamp: number
  network?: NetworkType
  label?: string
  data?: TData
}

export interface ActivityListProps<TData = unknown> {
  items: ActivityListItem<TData>[]
  isLoading?: boolean
  error?: string | null
  hasActiveFilters?: boolean
  expandedId?: string | null
  onExpandedChange?: (id: string | null) => void
  onRetry?: () => void
  onClearFilters?: () => void
  renderEmptyActions?: () => ReactNode
  renderDetails?: (item: ActivityListItem<TData>) => ReactNode
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  filteredEmptyTitle?: string
  filteredEmptyDescription?: string
}

function DefaultEmptyIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined text-foreground/30" style={{ fontSize: '32px' }}>
      {name}
    </span>
  )
}

export function ActivityList<TData = unknown>({
  items,
  isLoading = false,
  error,
  hasActiveFilters = false,
  expandedId = null,
  onExpandedChange,
  onRetry,
  onClearFilters,
  renderEmptyActions,
  renderDetails,
  emptyIcon,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Your transaction history will appear here once you start using your wallet.',
  filteredEmptyTitle = 'No matching transactions',
  filteredEmptyDescription = 'Try adjusting your search, status, or network filter.',
}: ActivityListProps<TData>) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 size-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading activity...</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/10">
          <span className="material-symbols-outlined text-red-400" style={{ fontSize: '32px' }}>
            error
          </span>
        </div>
        <h3 className="mb-1 text-base font-semibold">Failed to load</h3>
        <p className="mb-4 max-w-[240px] text-center text-xs text-muted-foreground">{error}</p>
        {onRetry && (
          <Button variant="surface" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/5">
          {emptyIcon ?? <DefaultEmptyIcon name="receipt_long" />}
        </div>
        <h3 className="mb-1 text-base font-semibold">
          {hasActiveFilters ? filteredEmptyTitle : emptyTitle}
        </h3>
        <p className="mb-4 max-w-[240px] text-center text-xs text-muted-foreground">
          {hasActiveFilters ? filteredEmptyDescription : emptyDescription}
        </p>
        {hasActiveFilters && onClearFilters ? (
          <Button variant="surface" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        ) : (
          renderEmptyActions?.()
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isExpanded = expandedId === item.id
        const details = renderDetails?.(item)

        return (
          <div
            key={item.id}
            className="relative mb-1.5 overflow-hidden rounded-card border bg-card shadow-inner transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <TransactionCard
              direction={item.direction}
              status={item.status}
              displayAmount={item.displayAmount}
              unit={item.unit}
              timestamp={item.timestamp}
              onClick={() => onExpandedChange?.(isExpanded ? null : item.id)}
            />
            {(item.network || item.label) && (
              <div className="flex items-center gap-1.5 border-t border-border/60 bg-black/10 px-3 py-2">
                {item.network && <NetworkBadge network={item.network} />}
                {item.label && (
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {item.label}
                  </span>
                )}
              </div>
            )}
            {renderDetails && (
              <Icon
                name="expand_more"
                className={cn(
                  'pointer-events-none absolute bottom-3 right-3 z-10 text-[18px] text-foreground/30 transition-transform duration-300',
                  isExpanded && 'rotate-180 text-primary'
                )}
              />
            )}
            {isExpanded && details && (
              <div className="space-y-1.5 border-t border-border bg-black/20 px-3 py-3 shadow-inner animate-in slide-in-from-top-2 duration-300">
                {details}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

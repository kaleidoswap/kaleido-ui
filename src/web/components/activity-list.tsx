import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { TransactionCard } from './transaction-card'
import { NetworkBadge, type NetworkType } from './network-badge'
import { SwapBadge } from './swap-badge'
import { LoadingCard, ErrorCard } from './page-shell'
import { EmptyState } from './empty-state'
import type { StatusType } from './status-badge'
import { cn } from '../utils/cn'
import type { IconName } from '../icons'

export interface ActivityListItem<TData = unknown> {
  id: string
  direction: 'inbound' | 'outbound'
  status: StatusType
  displayAmount: string
  unit?: string
  /** Secondary amount under the unit (e.g. the sats leg of an asset transfer). */
  subAmount?: string
  timestamp: number
  onSubAmountInfo?: () => void
  network?: NetworkType
  /**
   * Destination network, when the entry crossed a boundary (a Boltz swap into
   * Arkade, an on-chain deposit onboarding into Spark). Renders `network → networkTo`
   * so the hop is legible without reading the label.
   */
  networkTo?: NetworkType
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

function DefaultEmptyIcon({ name }: { name: IconName }) {
  return <Icon name={name} className="text-icon-4xl text-secondary-content" />
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
    return <LoadingCard message="Loading activity..." />
  }

  if (error && items.length === 0) {
    return <ErrorCard title="Failed to load" description={error} onRetry={onRetry} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon ?? <DefaultEmptyIcon name="receipt_long" />}
        title={hasActiveFilters ? filteredEmptyTitle : emptyTitle}
        description={hasActiveFilters ? filteredEmptyDescription : emptyDescription}
        // The activity feed has always set its description a step brighter.
        descriptionClassName="text-white/70"
        action={
          hasActiveFilters && onClearFilters ? (
            <Button variant="surface" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          ) : (
            renderEmptyActions?.()
          )
        }
      />
    )
  }

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const isExpanded = expandedId === item.id
        const details = renderDetails?.(item)

        return (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card transition-all hover:shadow-card-hover animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <TransactionCard
              direction={item.direction}
              status={item.status}
              displayAmount={item.displayAmount}
              unit={item.unit}
              subAmount={item.subAmount}
              onSubAmountInfo={item.onSubAmountInfo}
              timestamp={item.timestamp}
              onClick={() => onExpandedChange?.(isExpanded ? null : item.id)}
              // Stays above the details, which tuck underneath its rounded
              // bottom corners.
              className={cn('relative z-[1] bg-card', isExpanded && 'shadow-raised')}
            />
            {isExpanded && (
              // -mt-4/pt-4 slides the details up behind the card's bottom
              // radius, so the corner notches show the details' own
              // background instead of the darker container.
              <div className="-mt-4 pt-4 animate-in slide-in-from-top-2 duration-300">
                {(item.network || item.label) && (
                  <div className="flex items-center gap-1.5 px-3 py-2.5">
                    {item.network &&
                      (item.networkTo ? (
                        <SwapBadge from={item.network} to={item.networkTo} size="sm" />
                      ) : (
                        <NetworkBadge network={item.network} showLabel />
                      ))}
                    {item.label && (
                      <span className="text-xxs font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    )}
                  </div>
                )}
                {details && <div className="space-y-1.5 px-3 pb-3 pt-1">{details}</div>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

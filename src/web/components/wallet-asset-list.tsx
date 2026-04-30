import type { ReactNode } from 'react'
import { AssetCard } from './asset-card'
import type { NetworkType } from './network-badge'
import { cn } from '../utils/cn'

export interface WalletAssetListItem {
  id: string
  ticker: string
  name: string
  displayBalance: string
  networks?: NetworkType[]
  logoUri?: string
  balanceVisible?: boolean
  accentColor?: string
  onClick?: () => void
}

export interface WalletAssetListEmptyState {
  id: string
  title?: string
  description?: string
  icon?: ReactNode
}

export interface WalletAssetListProps {
  items: WalletAssetListItem[]
  title?: string
  amountLabel?: string
  isLoading?: boolean
  loadingRows?: number
  emptyStates?: WalletAssetListEmptyState[]
  bottomSpacer?: boolean
  className?: string
}

function AssetSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-center justify-between rounded-card bg-white/[0.03] p-3 animate-pulse"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-8 rounded-full bg-white/10" />
          <div className="absolute -bottom-1 -right-1 size-icon-md rounded-full bg-white/10" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-20 rounded bg-white/10" />
          <div className="h-2.5 w-10 rounded bg-white/5" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="h-3.5 w-16 rounded bg-white/10" />
        <div className="h-2.5 w-8 rounded bg-white/5" />
      </div>
    </div>
  )
}

function EmptyState({ state }: { state: WalletAssetListEmptyState }) {
  return (
    <div className="py-8 text-center">
      {state.icon && (
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-card border bg-card">
          {state.icon}
        </div>
      )}
      {state.title && (
        <p className="mb-1 text-sm font-medium text-muted-foreground">{state.title}</p>
      )}
      {state.description && (
        <p className="text-xs text-muted-foreground/70">{state.description}</p>
      )}
    </div>
  )
}

export function WalletAssetList({
  items,
  title = 'Your Assets',
  amountLabel = 'Amount',
  isLoading = false,
  loadingRows = 2,
  emptyStates = [],
  bottomSpacer = true,
  className,
}: WalletAssetListProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="mb-1 mt-3 flex items-center justify-between px-2">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">
          {title}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">
          {amountLabel}
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: loadingRows }).map((_, index) => (
            <AssetSkeleton key={index} index={index} />
          ))}
        </div>
      )}

      {!isLoading && items.map((item) => (
        <AssetCard
          key={item.id}
          ticker={item.ticker}
          name={item.name}
          displayBalance={item.displayBalance}
          networks={item.networks}
          logoUri={item.logoUri}
          balanceVisible={item.balanceVisible}
          accentColor={item.accentColor}
          onClick={item.onClick}
        />
      ))}

      {!isLoading && emptyStates.map((state) => (
        <EmptyState key={state.id} state={state} />
      ))}

      {bottomSpacer && <div className="h-32" />}
    </div>
  )
}

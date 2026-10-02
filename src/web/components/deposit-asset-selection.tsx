import { useEffect, useState } from 'react'
import { Button } from '../primitives/button'
import { DotPagination } from '../primitives/dot-pagination'
import { Icon } from '../primitives/icon'
import { AssetIcon } from './asset-icon'
import { BottomSheet } from './bottom-sheet'
import { NetworkBadge } from './network-badge'
import { LiquidNetworkIcon } from './network-icon'
import { ScrollArea } from './scroll-area'
import { cn } from '../utils/cn'
import type { DepositAccountId } from './deposit-ui-shared'

const ADD_ASSET_SUBTITLE: Record<DepositAccountId, string> = {
  RGB: 'RGB asset on Bitcoin',
  SPARK: 'Spark-native asset',
  ARKADE: 'Arkade-native asset',
  LIQUID: 'L-BTC or Liquid asset',
}

export interface DepositSelectionAsset {
  asset_id: string
  ticker: string
  name?: string
  precision?: number
  /** Account/protocol the asset lives on — drives the protocol badge in "Your assets". */
  accountId?: DepositAccountId
  /** Spendable balance in raw (smallest) units; used for sorting and the right-aligned amount. */
  balance?: number
}

const PROTOCOL_BADGE: Record<DepositAccountId, { label: string; className: string }> = {
  RGB: { label: 'RGB', className: 'bg-network-rgb-chip text-network-rgb-fg' },
  SPARK: { label: 'Spark', className: 'bg-network-spark-chip text-network-spark-fg' },
  ARKADE: { label: 'Arkade', className: 'bg-network-arkade-chip text-network-arkade-fg' },
  LIQUID: { label: 'Liquid', className: 'bg-network-liquid-chip text-network-liquid-fg' },
}

function formatAssetBalance(asset: DepositSelectionAsset): string {
  const raw = asset.balance ?? 0
  if (raw === 0) return '0'
  const precision = asset.precision ?? 0
  const value = raw / Math.pow(10, precision)
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(precision, 8),
  })
}

export interface DepositAssetSelectionProps<TView extends string = string> {
  setCurrentView: (view: TView) => void
  isNewAsset: boolean
  newAssetAccount: DepositAccountId | null
  newAssetId: string
  setNewAssetId: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  filteredAssets: DepositSelectionAsset[]
  onSelectAsset: (asset: DepositSelectionAsset) => void
  handleAddNewAsset: (account: DepositAccountId) => void
  handleContinueToGenerate: () => void
  isRgbConnected: boolean
  isSparkConnected: boolean
  isArkadeConnected: boolean
  isLiquidConnected?: boolean
}


export function DepositAssetSelection<TView extends string = string>({
  setCurrentView,
  isNewAsset,
  newAssetAccount,
  newAssetId,
  setNewAssetId,
  searchQuery,
  setSearchQuery,
  filteredAssets,
  onSelectAsset,
  handleAddNewAsset,
  handleContinueToGenerate,
  isRgbConnected,
  isSparkConnected,
  isArkadeConnected,
  isLiquidConnected = false,
}: DepositAssetSelectionProps<TView>) {
  const btcAsset = filteredAssets.find((asset) => asset.ticker === 'BTC')
  const ownedAssets = filteredAssets
    .filter((asset) => asset.ticker !== 'BTC')
    .slice()
    .sort((a, b) => (b.balance ?? 0) - (a.balance ?? 0))
  const ownedAssetsCount = ownedAssets.length
  const noResults = filteredAssets.length === 0 && !!searchQuery
  const isSearching = !!searchQuery
  // Collapsed by default; auto-expand whenever the user starts a search.
  const [assetsExpanded, setAssetsExpanded] = useState(false)
  const [showAddAssetModal, setShowAddAssetModal] = useState(false)
  useEffect(() => {
    if (isSearching) setAssetsExpanded(true)
  }, [isSearching])
  const showOwnedAssets = isSearching ? true : assetsExpanded
  // Per-protocol color tokens for the NEW ASSET cards.
  // Idle uses a low-opacity protocol tint; hover/active brighten the same hue.
  const newAssetOptions = [
    {
      account: 'RGB' as const,
      title: 'New RGB Asset',
      ticker: 'RGB',
      enabled: isRgbConnected,
      idleClass: 'bg-primary/10 hover:bg-primary/20',
      activeClass: 'bg-primary/25',
      titleHoverClass: 'group-hover:text-brand',
    },
    {
      account: 'SPARK' as const,
      title: 'New Spark Asset',
      ticker: 'SPARK',
      enabled: isSparkConnected,
      idleClass: 'bg-info/10 hover:bg-info/20',
      activeClass: 'bg-info/25',
      titleHoverClass: 'group-hover:text-info-fg',
    },
    {
      account: 'ARKADE' as const,
      title: 'New Arkade Asset',
      ticker: 'ARKADE',
      enabled: isArkadeConnected,
      idleClass: 'bg-network-arkade/10 hover:bg-network-arkade/20',
      activeClass: 'bg-network-arkade/25',
      titleHoverClass: 'group-hover:text-network-arkade-fg',
    },
    {
      account: 'LIQUID' as const,
      title: 'New Liquid Asset',
      ticker: 'LIQUID',
      enabled: isLiquidConnected,
      idleClass: 'bg-network-liquid/10 hover:bg-network-liquid/20',
      activeClass: 'bg-network-liquid/25',
      titleHoverClass: 'group-hover:text-network-liquid-fg',
    },
  ].filter((option) => option.enabled)

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background bg-page-radial pt-16 font-display text-foreground">
      <div className="absolute left-4 top-4 z-30">
        <Button
          type="button"
          variant="ghost"
          size="icon-xl"
          onClick={() => setCurrentView('dashboard' as TView)}
          aria-label="Go back"
        >
          <Icon name="arrow_back" size="xl" />
        </Button>
      </div>

      <div className="flex-shrink-0 px-5 pb-3 pt-4">
        <DotPagination
          count={2}
          index={0}
          ariaLabel="Deposit step 1 of 2: select asset"
        />
      </div>

      <div className="flex-shrink-0 px-5 pb-3">
        <div className="relative">
          <Icon
            name="search"
            size="sm"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-content"
          />
          <input
            autoFocus
            data-testid="deposit-asset-search"
            className="w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 py-2.5 pl-10 pr-4 text-caption text-foreground shadow-inner outline-none transition-all placeholder:text-muted-foreground focus:ring-primary/50 focus:bg-foreground/8 focus:shadow-glow-primary-soft"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search assets..."
            type="text"
            value={searchQuery}
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" viewportClassName="space-y-1.5 px-5 pb-3">
        {btcAsset && (
          <button
            type="button"
            data-testid="deposit-asset-btc"
            className="group flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card px-4 py-3 text-body shadow-card transition-all duration-200 hover:bg-secondary/10 hover:shadow-card-hover"
            onClick={() => onSelectAsset(btcAsset)}
          >
            <AssetIcon ticker="BTC" size={40} className="flex-shrink-0" />
            <div className="min-w-0 flex-1 text-left">
              <div className="font-bold tracking-wide text-foreground transition-colors group-hover:text-secondary-content">
                Bitcoin
              </div>
              <div className="mt-0.5 text-caption text-foreground/55">Choose destination account next</div>
            </div>
            <div className="hidden min-w-0 max-w-[42%] flex-shrink flex-wrap justify-end gap-1 min-[380px]:flex">
              <NetworkBadge network="L1" size="sm" />
              <NetworkBadge network="LN" size="sm" />
              {isSparkConnected && <NetworkBadge network="Spark" size="sm" />}
              {isArkadeConnected && <NetworkBadge network="Arkade" size="sm" />}
              {isLiquidConnected && <NetworkBadge network="Liquid" size="sm" />}
            </div>
            <Icon name="arrow_forward" className="flex-shrink-0 text-icon-md text-foreground/20 transition-colors group-hover:text-secondary-content" />
          </button>
        )}

        {noResults ? (
          <div className="py-8 text-center text-caption text-foreground/55">
            No assets match &quot;{searchQuery}&quot;
          </div>
        ) : ownedAssetsCount > 0 ? (
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              data-testid="deposit-toggle-owned-assets"
              onClick={() => !isSearching && setAssetsExpanded((value) => !value)}
              disabled={isSearching}
              className={cn(
                'flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 transition-all',
                showOwnedAssets ? 'bg-gradient-active ring-1 ring-inset ring-primary/40' : 'bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-raised hover:bg-secondary/10',
                isSearching && 'cursor-default',
              )}
            >
              <span className="text-mini font-bold uppercase tracking-eyebrow text-muted-foreground">
                Your assets
              </span>
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-secondary bg-gradient-violet text-tiny font-bold text-white shadow-button-violet">
                {ownedAssetsCount}
              </span>
              <div className="flex-1" />
              {!isSearching && (
                <Icon name={showOwnedAssets ? 'expand_less' : 'expand_more'} size="md" className="text-secondary-content" />
              )}
            </button>

            {showOwnedAssets && (
              <div className="space-y-1.5 duration-200 animate-in fade-in slide-in-from-top-1">
                {ownedAssets.map((asset) => {
                  const protocolBadge = asset.accountId ? PROTOCOL_BADGE[asset.accountId] : null
                  const balance = asset.balance ?? 0
                  return (
                    <button
                      key={asset.asset_id}
                      type="button"
                      data-testid={`deposit-asset-${asset.asset_id}`}
                      className="group flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card px-4 py-3 text-body shadow-card transition-all duration-200 hover:bg-secondary/10 hover:shadow-card-hover"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <AssetIcon ticker={asset.ticker} size={40} className="flex-shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="truncate font-bold tracking-wide text-foreground transition-colors group-hover:text-secondary-content">
                            {asset.ticker}
                          </span>
                          {protocolBadge && (
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-1.5 py-0.5 text-mini font-bold uppercase tracking-eyebrow',
                                protocolBadge.className,
                              )}
                            >
                              {protocolBadge.label}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 truncate text-caption text-foreground/55">
                          {asset.name ?? 'Asset'}
                        </div>
                      </div>
                      {balance > 0 && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-caption font-bold tabular-nums text-foreground">
                            {formatAssetBalance(asset)}
                          </div>
                          <div className="mt-0.5 text-mini font-bold uppercase tracking-eyebrow text-foreground/55">
                            {asset.ticker}
                          </div>
                        </div>
                      )}
                      <Icon name="arrow_forward" className="flex-shrink-0 text-icon-sm text-foreground/20 transition-colors group-hover:text-secondary-content" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}

        {!searchQuery && (
          <div className="pb-1 pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('bridge' as TView)}
              className="group flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-secondary/20 to-primary/10 p-3 shadow-card transition-all duration-200 hover:from-secondary/30 hover:to-primary/15 hover:shadow-card-hover"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary bg-gradient-violet text-white shadow-button-violet">
                <Icon name="swap_calls" className="text-icon-lg" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-semibold text-foreground transition-colors group-hover:text-secondary-content">
                  Bridge from another chain
                </p>
                <p className="text-xxs leading-tight text-foreground/55">USDC, USDT, ETH, SOL via Flashnet</p>
              </div>
              <Icon name="arrow_forward" className="text-icon-lg text-foreground/55 transition-colors group-hover:text-secondary-content" />
            </button>
          </div>
        )}

        {!searchQuery && newAssetOptions.length > 0 && (
          <div className="pb-1 pt-2">
            <button
              type="button"
              data-testid="deposit-add-asset"
              onClick={() => setShowAddAssetModal(true)}
              className="group flex w-full items-center gap-3 rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card transition-all duration-200 hover:bg-secondary/10 hover:shadow-card-hover"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25">
                <Icon name="add" size="md" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-body font-semibold text-foreground transition-colors group-hover:text-secondary-content">
                  Add an asset
                </p>
                <p className="text-xxs leading-tight text-foreground/55">
                  Receive a new {newAssetOptions.map((o) => o.ticker).join(', ')} asset
                </p>
              </div>
              <Icon name="arrow_forward" className="text-icon-lg text-foreground/55 transition-colors group-hover:text-secondary-content" />
            </button>
          </div>
        )}
      </ScrollArea>

      <BottomSheet
        open={showAddAssetModal}
        title="Add an asset"
        onClose={() => setShowAddAssetModal(false)}
      >
        <div className="space-y-2">
          {newAssetOptions.map((option) => (
            <button
              key={option.account}
              type="button"
              data-testid={`deposit-new-asset-${option.account.toLowerCase()}`}
              className={cn(
                'group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left shadow-raised transition-all hover:shadow-card-hover',
                option.idleClass,
              )}
              onClick={() => {
                setShowAddAssetModal(false)
                handleAddNewAsset(option.account)
              }}
            >
              {option.account === 'LIQUID' ? (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-network-liquid/10">
                  <LiquidNetworkIcon className="size-5" />
                </span>
              ) : (
                <AssetIcon ticker={option.ticker} size={36} className="flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className={cn('text-body font-bold tracking-wide text-foreground', option.titleHoverClass)}>
                  {option.title}
                </div>
                <div className="mt-0.5 text-xxs text-foreground/55">
                  {ADD_ASSET_SUBTITLE[option.account]}
                </div>
              </div>
              <Icon name="add" size="sm" className="text-foreground/55 transition-colors group-hover:text-foreground/60" />
            </button>
          ))}
        </div>
      </BottomSheet>

    </div>
  )
}

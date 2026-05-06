import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { DotPagination } from '../primitives/dot-pagination'
import { Icon } from '../primitives/icon'
import { AssetIcon } from './asset-icon'
import { ScrollArea } from './scroll-area'
import { cn } from '../utils/cn'
import type { DepositAccountId } from './deposit-ui-shared'

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
  RGB: { label: 'RGB', className: 'bg-network-rgb-chip text-network-rgb-text' },
  SPARK: { label: 'Spark', className: 'bg-network-spark-chip text-network-spark-text' },
  ARKADE: { label: 'Arkade', className: 'bg-network-arkade-chip text-network-arkade-text' },
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
}

function NetBadge({ icon, className }: { icon: ReactNode; className: string }) {
  return (
    <span className={cn('inline-flex items-center justify-center rounded border px-1.5 py-0.5', className)}>
      {icon}
    </span>
  )
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
      titleHoverClass: 'group-hover:text-primary',
    },
    {
      account: 'SPARK' as const,
      title: 'New Spark Asset',
      ticker: 'SPARK',
      enabled: isSparkConnected,
      idleClass: 'bg-info/10 hover:bg-info/20',
      activeClass: 'bg-info/25',
      titleHoverClass: 'group-hover:text-info',
    },
    {
      account: 'ARKADE' as const,
      title: 'New Arkade Asset',
      ticker: 'ARKADE',
      enabled: isArkadeConnected,
      idleClass: 'bg-network-arkade/10 hover:bg-network-arkade/20',
      activeClass: 'bg-network-arkade/25',
      titleHoverClass: 'group-hover:text-network-arkade',
    },
  ].filter((option) => option.enabled)

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background pt-16 font-display text-foreground">
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            autoFocus
            data-testid="deposit-asset-search"
            className="w-full rounded-xl border border-white/8 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-primary/40 focus:bg-white/8"
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
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm transition-all hover:border-border hover:bg-accent"
            onClick={() => onSelectAsset(btcAsset)}
          >
            <AssetIcon ticker="BTC" size={40} />
            <div className="min-w-0 flex-1 text-left">
              <div className="font-bold tracking-wide text-white transition-colors group-hover:text-primary/90">
                Bitcoin
              </div>
              <div className="mt-0.5 text-xs text-white/40">Choose destination account next</div>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <NetBadge
                className="border-network-bitcoin/20 bg-network-bitcoin/15"
                icon={<span className="material-symbols-outlined leading-none text-network-bitcoin" style={{ fontSize: 10 }}>link</span>}
              />
              <NetBadge
                className="border-warning/20 bg-warning/15"
                icon={<img src="/icons/lightning/lightning.svg" className="h-2.5 w-2.5" alt="" />}
              />
              {isSparkConnected && (
                <NetBadge
                  className="border-info/20 bg-info/15"
                  icon={<img src="/icons/spark/Asterisk/Spark Asterisk White.svg" className="h-2.5 w-2.5" alt="Spark" />}
                />
              )}
              {isArkadeConnected && (
                <NetBadge
                  className="border-network-arkade/20 bg-network-arkade/15"
                  icon={<img src="/icons/arkade/arkade-icon.svg" className="h-2.5 w-2.5 rounded-sm" alt="Arkade" />}
                />
              )}
            </div>
            <span className="material-symbols-outlined flex-shrink-0 text-icon-md text-white/20 transition-colors group-hover:text-white/50">
              arrow_forward
            </span>
          </button>
        )}

        {noResults ? (
          <div className="py-8 text-center text-sm text-white/30">
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
                'flex w-full items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all',
                showOwnedAssets
                  ? 'border-white/10 bg-white/4'
                  : 'border-white/8 bg-white/3 hover:border-border hover:bg-accent',
                isSearching && 'cursor-default',
              )}
            >
              <span className="text-xxs font-bold uppercase tracking-[0.18em] text-white/55">
                Your assets
              </span>
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-tiny font-bold text-white/70">
                {ownedAssetsCount}
              </span>
              <div className="flex-1" />
              {!isSearching && (
                <span className="material-symbols-outlined text-icon-md text-white/40">
                  {showOwnedAssets ? 'expand_less' : 'expand_more'}
                </span>
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
                      className="group flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm transition-all hover:border-border hover:bg-accent"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <AssetIcon ticker={asset.ticker} size={40} className="flex-shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-bold tracking-wide text-white transition-colors group-hover:text-primary/90">
                            {asset.ticker}
                          </span>
                          {protocolBadge && (
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-1.5 py-0.5 text-tiny font-bold uppercase tracking-wider',
                                protocolBadge.className,
                              )}
                            >
                              {protocolBadge.label}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-white/40">
                          {asset.name ?? 'Asset'}
                        </div>
                      </div>
                      {balance > 0 && (
                        <div className="flex-shrink-0 text-right">
                          <div className="font-mono text-xs font-bold text-white">
                            {formatAssetBalance(asset)}
                          </div>
                          <div className="mt-0.5 text-tiny uppercase tracking-wider text-white/35">
                            {asset.ticker}
                          </div>
                        </div>
                      )}
                      <span className="material-symbols-outlined flex-shrink-0 text-icon-sm text-white/20 transition-colors group-hover:text-white/50">
                        arrow_forward
                      </span>
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
              className="group flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-3 transition-all hover:from-primary/20 hover:to-primary/10"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <span className="material-symbols-outlined text-lg text-primary">swap_calls</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white transition-colors group-hover:text-primary">
                  Bridge from another chain
                </p>
                <p className="text-xxs leading-tight text-white/40">USDC, USDT, ETH, SOL via Flashnet</p>
              </div>
              <span className="material-symbols-outlined text-lg text-white/30 transition-colors group-hover:text-primary">
                arrow_forward
              </span>
            </button>
          </div>
        )}

        {!searchQuery && newAssetOptions.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="px-1">
              <p className="text-xxs font-bold uppercase tracking-[0.18em] text-white/35">
                New Asset
              </p>
            </div>
            <div
              className={cn(
                'grid gap-2',
                newAssetOptions.length === 1
                  ? 'grid-cols-1'
                  : newAssetOptions.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
              )}
            >
              {newAssetOptions.map((option) => {
                const active = isNewAsset && newAssetAccount === option.account
                return (
                  <button
                    key={option.account}
                    type="button"
                    data-testid={`deposit-new-asset-${option.account.toLowerCase()}`}
                    className={cn(
                      'group flex min-h-[112px] flex-col items-center justify-center rounded-2xl px-3 py-3.5 text-center text-sm transition-all',
                      active ? option.activeClass : option.idleClass
                    )}
                    onClick={() => handleAddNewAsset(option.account)}
                  >
                    <div className="relative">
                      <AssetIcon ticker={option.ticker} size={40} />
                      <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary">
                        <Icon name="add" size="xs" className="text-background" />
                      </div>
                    </div>
                    <div className="mt-2 min-w-0">
                      <div
                        className={cn(
                          'text-sm font-bold tracking-wide',
                          active ? 'text-white' : 'text-white group-hover:opacity-90',
                          !active && option.titleHoverClass
                        )}
                      >
                        {option.title}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </ScrollArea>

      {isNewAsset && newAssetAccount === 'RGB' && (
        <>
          <div className="flex-shrink-0 px-5 pb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2 rounded-2xl border border-network-arkade/20 bg-network-arkade/5 p-3">
              <p className="text-tiny leading-relaxed text-network-arkade/80">
                Leave empty to receive any RGB asset, or enter a specific asset ID.
              </p>
              <input
                className="w-full rounded-xl border bg-white/5 px-3 py-2 font-mono text-sm text-white transition-all placeholder:text-white/25 focus:border-network-arkade/40 focus:outline-none"
                onChange={(event) => setNewAssetId(event.target.value)}
                placeholder="Asset ID (optional)"
                type="text"
                value={newAssetId}
              />
            </div>
          </div>
          <div className="flex-shrink-0 px-5 pb-5 pt-2">
            <Button variant="cta" size="cta" onClick={handleContinueToGenerate}>
              Continue with New Asset
              <span className="material-symbols-outlined text-icon-xl font-bold">arrow_forward</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

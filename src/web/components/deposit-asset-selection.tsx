import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { AssetIcon } from './asset-icon'
import { PageHeader } from './page-header'
import { ScrollArea } from './scroll-area'
import { cn } from '../utils/cn'
import type { DepositAccountId } from './deposit-ui-shared'

export interface DepositSelectionAsset {
  asset_id: string
  ticker: string
  name?: string
  precision?: number
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
  const rgbAssets = filteredAssets.filter((asset) => asset.ticker !== 'BTC')
  const noResults = filteredAssets.length === 0 && !!searchQuery
  const newAssetOptions = [
    {
      account: 'RGB' as const,
      title: 'New RGB Asset',
      ticker: 'RGB',
      enabled: isRgbConnected,
    },
    {
      account: 'SPARK' as const,
      title: 'New Spark Asset',
      ticker: 'SPARK',
      enabled: isSparkConnected,
    },
    {
      account: 'ARKADE' as const,
      title: 'New Arkade Asset',
      ticker: 'ARKADE',
      enabled: isArkadeConnected,
    },
  ].filter((option) => option.enabled)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-display text-foreground">
      <PageHeader title="Deposit" onBack={() => setCurrentView('dashboard' as TView)} />

      <div className="flex-shrink-0 space-y-2 px-5 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-primary shadow-sm">
              <span className="text-tiny font-black text-background">1</span>
            </div>
            <span className="text-xs font-bold tracking-wide text-primary">Select Asset</span>
          </div>
          <div className="mx-1 h-px flex-1 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full border border-white/20">
              <span className="text-tiny font-black text-white/30">2</span>
            </div>
            <span className="text-xs font-bold tracking-wide text-white/30">Receive</span>
          </div>
        </div>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 rounded-full bg-primary transition-all duration-500" />
        </div>
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
        ) : (
          rgbAssets.map((asset) => (
            <button
              key={asset.asset_id}
              type="button"
              className="group flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-sm transition-all hover:border-border hover:bg-accent"
              onClick={() => onSelectAsset(asset)}
            >
              <div className="relative flex-shrink-0">
                <AssetIcon ticker={asset.ticker} size={40} />
                <div className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border bg-card">
                  <img src="/icons/rgb/rgb-logo.svg" className="block h-2.5 w-2.5 object-contain" alt="RGB" />
                </div>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="font-bold tracking-wide text-white transition-colors group-hover:text-primary/90">
                  {asset.ticker}
                </div>
                <div className="mt-0.5 truncate text-xs text-white/40">
                  {asset.name ?? 'RGB Asset'}
                </div>
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
              </div>
              <span className="material-symbols-outlined flex-shrink-0 text-icon-md text-white/20 transition-colors group-hover:text-white/50">
                arrow_forward
              </span>
            </button>
          ))
        )}

        {!searchQuery && (
          <div className="pb-1 pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('bridge' as TView)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-info/20 bg-gradient-to-r from-info/10 to-network-arkade/10 p-3 transition-all hover:border-info/40"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-info/20">
                <span className="material-symbols-outlined text-lg text-info">swap_calls</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-white transition-colors group-hover:text-info">
                  Bridge from another chain
                </p>
                <p className="text-xxs leading-tight text-white/40">USDC, USDT, ETH, SOL via Flashnet</p>
              </div>
              <span className="material-symbols-outlined text-lg text-white/30 transition-colors group-hover:text-info">
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
                      'group flex min-h-[112px] flex-col items-center justify-center rounded-2xl border px-3 py-3.5 text-center text-sm transition-all',
                      active
                        ? 'border-network-arkade/30 bg-network-arkade/10'
                        : 'border-white/8 bg-white/3 hover:border-network-arkade/30 hover:bg-network-arkade/5'
                    )}
                    onClick={() => handleAddNewAsset(option.account)}
                  >
                    <div className="relative">
                      <AssetIcon ticker={option.ticker} size={40} />
                      <div
                        className={cn(
                          'absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border',
                          active ? 'border-network-arkade/40 bg-network-arkade' : 'border-border bg-card'
                        )}
                      >
                        {active ? (
                          <Icon name="check" size="xs" className="text-white" />
                        ) : (
                          <Icon name="add" size="xs" className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2 min-w-0">
                      <div
                        className={cn(
                          'text-xs font-bold tracking-wide',
                          active ? 'text-network-arkade' : 'text-muted-foreground group-hover:text-white'
                        )}
                      >
                        {option.account}
                      </div>
                      <div className="mt-1 text-xxs leading-tight text-white/40">{option.title}</div>
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

import { useState, type ReactNode } from 'react'
import { ActionTile } from './action-tile'
import { Icon } from '../primitives/icon'

export interface BalanceBreakdownAsset {
  asset_id: string
  ticker: string
  name?: string
  precision?: number
  balance?: unknown
}

export interface BalanceBreakdownAccounts {
  RGB?: {
    connected?: boolean
  }
}

export interface BalanceBreakdownNodeInfo {
  pubkey?: string
  num_peers?: number
  num_channels?: number
}

export interface BalanceBreakdownProps {
  btcOnchain: number
  btcLightning: number
  btcSpark: number
  btcArkade: number
  totalBTC: number
  rgbAssets: BalanceBreakdownAsset[]
  accounts: BalanceBreakdownAccounts
  nodeInfo?: BalanceBreakdownNodeInfo | null
  balanceVisible: boolean
  format: (sats: number) => string
  formatFiatValue: (sats: number) => string
  unit: string
  label: string
  cycle: () => void
  isLoading?: boolean
  isPartial?: boolean
  btcOnchainPending?: boolean
  btcLightningPending?: boolean
  btcSparkPending?: boolean
  btcArkadePending?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
  onNavigate?: (view: 'deposit' | 'swap' | 'withdraw') => void
}

function OnchainIcon({ className = '' }: { className?: string }) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{ fontSize: 'inherit' }}
    >
      link
    </span>
  )
}

function ImageIcon({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return <img src={src} alt={alt} className={className} />
}

function numberOnly(formatted: string): string {
  return formatted.replace(/\u00a0(sats|BTC|mBTC)$/, '').replace(/^\u20bf/, '')
}

export function BalanceBreakdown({
  btcOnchain,
  btcLightning,
  btcSpark,
  btcArkade,
  totalBTC,
  rgbAssets,
  accounts,
  nodeInfo,
  balanceVisible,
  format,
  formatFiatValue,
  unit,
  label,
  cycle,
  isLoading = false,
  isPartial = false,
  btcOnchainPending = false,
  btcLightningPending = false,
  btcSparkPending = false,
  btcArkadePending = false,
  onRefresh,
  isRefreshing = false,
  onNavigate,
}: BalanceBreakdownProps) {
  const [expanded, setExpanded] = useState(false)
  const fiatTotal = formatFiatValue(totalBTC)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-3xl bg-card p-5">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 -translate-y-1/4 translate-x-1/4 rounded-full bg-white/[0.04] blur-[60px]" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <button
            onClick={cycle}
            className="group flex min-w-0 flex-1 flex-col items-start text-left"
            title={`Tap to switch unit (current: ${label})`}
          >
            <p className="mb-1 text-xxs font-bold uppercase tracking-widest text-white/40">
              Total Balance
            </p>
            {isLoading ? (
              <div className="mt-1 space-y-2">
                <div className="h-9 w-36 animate-pulse rounded-lg bg-white/10" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
              </div>
            ) : (
              <>
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="block min-w-0 truncate text-[34px] font-black leading-[1.1] tracking-tighter text-white drop-shadow-sm transition-all duration-300 group-active:scale-95 group-active:text-primary">
                    {balanceVisible ? numberOnly(format(totalBTC)) : '••••••'}
                  </span>
                  {unit !== 'fiat' && (
                    <span className="inline-block rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-tiny font-bold uppercase tracking-widest text-primary/80">
                      {label}
                    </span>
                  )}
                  {isPartial && (
                    <span
                      className="inline-flex size-4 items-center justify-center rounded-full border bg-white/[0.06]"
                      title="Loading remaining balances"
                    >
                      <span className="size-2 animate-spin rounded-full border border-primary/30 border-t-primary" />
                    </span>
                  )}
                </div>
                {balanceVisible && fiatTotal && unit !== 'fiat' && (
                  <span className="mt-1 font-mono text-xs font-medium text-white/45">
                    {fiatTotal}
                  </span>
                )}
              </>
            )}
          </button>

          <div className="mt-1 flex shrink-0 items-center gap-1.5">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex size-7 items-center justify-center rounded-full bg-white/[0.08] transition-all hover:bg-white/[0.12] disabled:opacity-40"
                title="Refresh balances"
              >
                <span
                  className={`material-symbols-outlined text-[14px] leading-none text-white/60${isRefreshing ? ' animate-spin' : ''}`}
                >
                  refresh
                </span>
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex size-7 items-center justify-center rounded-full bg-white/[0.08] transition-all hover:bg-white/[0.12]"
            >
              <Icon
                name={expanded ? 'expand_less' : 'expand_more'}
                size="sm"
                className="text-white/60"
              />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-1 border-t border-white/[0.08] pt-4 duration-300 animate-in fade-in slide-in-from-top-2">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-white/30">
              Bitcoin
            </p>
            <NetworkRow
              icon={<OnchainIcon className="text-[14px]" />}
              iconColor="text-network-spark"
              dotColor="bg-network-spark"
              label="BTC on-chain"
              sublabel="Standard Bitcoin balance"
              amount={btcOnchain}
              isPending={btcOnchainPending}
              visible={balanceVisible}
              format={format}
              formatFiat={formatFiatValue}
            />
            <NetworkRow
              icon={
                <ImageIcon
                  src="/icons/lightning/lightning.svg"
                  alt="Lightning"
                  className="size-3.5"
                />
              }
              iconColor="text-network-lightning"
              dotColor="bg-network-lightning"
              label="BTC on RLN"
              sublabel="RLN balance"
              amount={btcLightning}
              isPending={btcLightningPending}
              visible={balanceVisible}
              format={format}
              formatFiat={formatFiatValue}
            />
            <NetworkRow
              icon={
                <ImageIcon
                  src="/icons/spark/Asterisk/Spark Asterisk White.svg"
                  alt="Spark"
                  className="size-3.5 opacity-90"
                />
              }
              iconColor=""
              dotColor="bg-sky-400"
              label="BTC on Spark"
              sublabel="Spark balance"
              amount={btcSpark}
              isPending={btcSparkPending}
              visible={balanceVisible}
              format={format}
              formatFiat={formatFiatValue}
            />
            <NetworkRow
              icon={
                <ImageIcon
                  src="/icons/arkade/arkade-icon.svg"
                  alt="Arkade"
                  className="size-3.5 rounded-sm"
                />
              }
              iconColor=""
              dotColor="bg-network-arkade"
              label="BTC on Arkade"
              sublabel="Arkade balance"
              amount={btcArkade}
              isPending={btcArkadePending}
              visible={balanceVisible}
              format={format}
              formatFiat={formatFiatValue}
            />

            {rgbAssets.length > 0 && (
              <RgbAssetsBreakdown assets={rgbAssets} balanceVisible={balanceVisible} />
            )}

            {accounts.RGB?.connected && nodeInfo?.pubkey && (
              <div className="mt-3 border-t border-white/[0.08] pt-4">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-white/30">
                  RLN Details
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <StatusChip
                    label="Node"
                    value={`${nodeInfo.pubkey.slice(0, 8)}...${nodeInfo.pubkey.slice(-6)}`}
                  />
                  <StatusChip label="Peers" value={String(nodeInfo.num_peers ?? 0)} />
                  <StatusChip label="Channels" value={String(nodeInfo.num_channels ?? 0)} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="relative z-10 mt-3 flex gap-2.5 border-t border-white/[0.08] pt-3">
          <ActionTile
            icon={<span className="material-symbols-outlined text-[18px] leading-none">call_received</span>}
            label="Deposit"
            onClick={() => onNavigate?.('deposit')}
            data-testid="dashboard-action-deposit"
          />
          <ActionTile
            icon={<span className="material-symbols-outlined text-[18px] leading-none">swap_horiz</span>}
            label="Swap"
            onClick={() => onNavigate?.('swap')}
            data-testid="dashboard-action-swap"
          />
          <ActionTile
            icon={<span className="material-symbols-outlined text-[18px] leading-none">send</span>}
            label="Withdraw"
            onClick={() => onNavigate?.('withdraw')}
            data-testid="dashboard-action-withdraw"
          />
        </div>
      </div>
    </div>
  )
}

function RgbAssetsBreakdown({
  assets,
  balanceVisible,
}: {
  assets: BalanceBreakdownAsset[]
  balanceVisible: boolean
}) {
  return (
    <div className="mt-3 border-t border-white/[0.08] pt-4">
      <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-white/30">
        RGB Assets
      </p>
      <div className="space-y-2">
        {assets.map((asset) => {
          const bal = (asset.balance ?? {}) as Record<string, number>
          const onChain = Number(bal.future || 0)
          const offChain = Number(bal.offchain_outbound || 0)
          const total = onChain + offChain
          const precision = asset.precision || 0
          const formatRgb = (value: number) => (value / Math.pow(10, precision)).toFixed(precision)

          return (
            <div key={asset.asset_id} className="flex items-start justify-between py-1">
              <div className="flex items-center gap-2.5">
                <div className="flex size-5 items-center justify-center overflow-hidden rounded border border-network-rgb/20 bg-network-rgb/10">
                  <img src="/icons/rgb/rgb-logo.svg" alt="RGB" className="size-3.5 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/90">{asset.ticker}</span>
                  <span className="max-w-[90px] truncate text-xxs text-white/40">{asset.name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="tabular-nums text-sm font-bold text-white">
                  {balanceVisible ? formatRgb(total) : '••••••'}
                </span>
                {balanceVisible && (onChain > 0 || offChain > 0) && (
                  <div className="mt-0.5 flex items-center gap-1 text-xxs text-white/40">
                    {onChain > 0 && (
                      <span className="text-network-spark/80">{formatRgb(onChain)} on-chain</span>
                    )}
                    {onChain > 0 && offChain > 0 && <span className="text-white/20">|</span>}
                    {offChain > 0 && (
                      <span className="inline-flex items-center gap-1 text-network-lightning/80">
                        {formatRgb(offChain)}
                        <ImageIcon
                          src="/icons/lightning/lightning.svg"
                          alt=""
                          className="size-2.5"
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/5 px-3 py-2">
      <div className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</div>
      <div className="mt-1 truncate text-xs font-semibold text-white/80">{value}</div>
    </div>
  )
}

function NetworkRow({
  icon,
  iconColor,
  dotColor,
  label,
  sublabel,
  amount,
  isPending = false,
  visible,
  format,
  formatFiat,
}: {
  icon: ReactNode
  iconColor: string
  dotColor: string
  label: string
  sublabel: string
  amount: number
  isPending?: boolean
  visible: boolean
  format: (sats: number) => string
  formatFiat: (sats: number) => string
}) {
  const fiat = formatFiat(amount)
  const isEmpty = amount === 0 && !isPending

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${isEmpty ? 'opacity-35' : 'bg-white/[0.03] hover:bg-accent'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-7 w-0.5 rounded-full ${dotColor} opacity-80`} />
        <div
          className={`flex size-7 items-center justify-center rounded-lg bg-white/5 text-[14px] ${iconColor}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold leading-tight text-white/80">{label}</span>
          <span className="mt-0.5 text-[9px] font-medium leading-tight text-white/30">
            {sublabel}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        {isPending ? (
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-12 animate-pulse rounded bg-white/10" />
            <span className="inline-flex size-3 items-center justify-center rounded-full border bg-white/[0.06]">
              <span className="size-1.5 animate-spin rounded-full border border-primary/30 border-t-primary" />
            </span>
          </div>
        ) : (
          <>
            <span className="tabular-nums text-xs font-bold text-white">
              {visible ? format(amount) : '••••••'}
            </span>
            {fiat && visible && !isEmpty && (
              <span className="mt-0.5 font-mono text-xxs text-white/35">{fiat}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

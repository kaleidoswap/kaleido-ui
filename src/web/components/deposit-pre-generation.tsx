import type { ChangeEvent } from 'react'
import { AlertBanner } from './alert-banner'
import { Button } from '../primitives/button'
import { cn } from '../utils/cn'
import type {
  DepositAccountId,
  DepositNetworkConfigEntry,
  DepositNetworkKey,
  DepositTransferMethod,
} from './deposit-ui-shared'

export interface DepositPreGenerationAsset {
  ticker?: string
  precision?: number
}

const ACCOUNT_TITLES: Record<DepositAccountId, string> = {
  RGB: 'RGB & Lightning',
  SPARK: 'Spark',
  ARKADE: 'Arkade',
}

const METHOD_META: Record<DepositTransferMethod, { label: string; summary: string }> = {
  bitcoin_l1: { label: 'Bitcoin address', summary: 'Standard on-chain BTC transfer.' },
  lightning: { label: 'Lightning invoice', summary: 'Fast payment over Lightning.' },
  spark: { label: 'Spark transfer', summary: 'Funds land directly in the Spark account.' },
  arkade: { label: 'Arkade transfer', summary: 'Funds land directly in the Arkade account.' },
  boarding: { label: 'Boarding', summary: 'Send on-chain BTC into Arkade.' },
  submarine_swap: {
    label: 'LN via swap',
    summary: 'Uses Arkade as the source account and bridges to Lightning.',
  },
}

export interface DepositPreGenerationProps {
  selectedAsset: DepositPreGenerationAsset | null
  isBtc: boolean
  network: DepositNetworkKey
  net: DepositNetworkConfigEntry
  selectedAccount: DepositAccountId
  currentMethod: DepositTransferMethod
  channelsLoading: boolean
  showChannelWarning: boolean
  showLiquidityWarning: boolean
  isAutoGenerate: boolean
  loading: boolean
  usePrivacy: boolean
  setUsePrivacy: (value: boolean) => void
  amount: string
  handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  getUnitLabel: () => string
  generateInvoice: () => Promise<void>
}

export function DepositPreGeneration({
  selectedAsset,
  isBtc,
  network,
  net,
  selectedAccount,
  currentMethod,
  channelsLoading,
  showChannelWarning,
  showLiquidityWarning,
  isAutoGenerate,
  loading,
  usePrivacy,
  setUsePrivacy,
  amount,
  handleAmountChange,
  getUnitLabel,
  generateInvoice,
}: DepositPreGenerationProps) {
  const method = METHOD_META[currentMethod]

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">
          Receive Summary
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/45">Asset</span>
            <span className="font-bold text-white">
              {selectedAsset?.ticker ?? (isBtc ? 'BTC' : 'Asset')}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/45">Destination account</span>
            <span className="font-bold text-white">{ACCOUNT_TITLES[selectedAccount]}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/45">Transfer method</span>
            <span className="font-bold text-white">{method.label}</span>
          </div>
          <p className="text-tiny text-white/35">{method.summary}</p>
        </div>
      </div>

      {channelsLoading && selectedAccount === 'RGB' && currentMethod === 'lightning' && !isBtc && (
        <div className="flex items-center gap-2.5 rounded-xl border bg-card p-3">
          <span className="material-symbols-outlined animate-spin text-[18px] text-primary">
            progress_activity
          </span>
          <span className="text-xs font-medium text-white/60">Checking channel availability...</span>
        </div>
      )}

      {showChannelWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-xs font-bold text-amber-400">No Lightning Channels</p>
          <p className="text-tiny text-amber-400/70">Only on-chain deposits are available.</p>
        </AlertBanner>
      )}

      {showLiquidityWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-xs font-bold text-amber-400">No Inbound Liquidity</p>
          <p className="text-tiny text-amber-400/70">
            No channels with inbound capacity for {selectedAsset?.ticker ?? 'this asset'}.
          </p>
        </AlertBanner>
      )}

      {isAutoGenerate && loading && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className={cn('flex size-16 items-center justify-center rounded-2xl border', net.bg, net.border)}>
            <span className={cn('material-symbols-outlined animate-spin text-[32px]', net.text)}>
              progress_activity
            </span>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Generating {network === 'lightning' ? 'invoice' : 'address'}...
            </p>
            <p className="text-xs text-white/30">{net.label} network</p>
          </div>
        </div>
      )}

      {network === 'onchain' && !isBtc && (
        <div className="space-y-2 rounded-xl border bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white">Receive with Privacy</h4>
              <p className="mt-0.5 text-xxs text-muted-foreground">
                {usePrivacy ? 'Blinded UTXO - enhanced privacy' : 'Witness address - less private'}
              </p>
            </div>
            <button
              type="button"
              className={cn(
                'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full border shadow-inner transition-colors',
                usePrivacy ? 'bg-primary' : 'bg-white/10'
              )}
              onClick={() => setUsePrivacy(!usePrivacy)}
            >
              <span
                className={cn(
                  'inline-block h-3.5 w-3.5 rounded-full shadow-md transition-all',
                  usePrivacy ? 'translate-x-5 bg-black' : 'translate-x-0.5 bg-white/80'
                )}
              />
            </button>
          </div>
          {!usePrivacy && (
            <p className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-2.5 py-1.5 text-xxs text-amber-500/80">
              Sender needs to add sats to create a new UTXO for you.
            </p>
          )}
        </div>
      )}

      {network === 'onchain' && !isBtc && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
              Amount ({getUnitLabel()}) - Optional
            </label>
            {selectedAsset && (
              <span className="text-[9px] text-white/30">
                {selectedAsset.precision ?? 0} decimals
              </span>
            )}
          </div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`e.g. 10.00 ${selectedAsset?.ticker ?? ''}`}
            className="w-full rounded-xl border bg-white/5 px-3 py-2.5 font-mono text-sm font-bold text-white transition-all placeholder:text-white/20 focus:border-primary/50 focus:outline-none"
            inputMode="decimal"
          />
        </div>
      )}

      {!isAutoGenerate && (
        <Button variant="cta" size="cta" onClick={generateInvoice} disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[16px]">
                progress_activity
              </span>
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
              Generate Address
            </span>
          )}
        </Button>
      )}
    </div>
  )
}

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
  /**
   * RGB on-chain only: true when the user needs to create at least one
   * uncolored UTXO before an invoice can be generated.
   */
  needsColorableUtxos?: boolean
  /** Invoked by the inline "Create Colorable UTXOs" CTA. */
  onOpenCreateUtxos?: () => void
  showReceiveSummary?: boolean
  /** RGB-asset receive: render an inline asset-id field (receive a specific asset). */
  isNewRgbAsset?: boolean
  /** Current asset-id value for the inline field. */
  newAssetId?: string
  /** Setter for the inline asset-id field. */
  setNewAssetId?: (value: string) => void
  /**
   * Number of colorable (uncolored) UTXOs available for a blinded receive.
   * `undefined` ⇒ unknown/loading; a number drives the availability hint and the
   * create-UTXO prompt for the privacy (blinded) path.
   */
  colorableUtxoCount?: number
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
  needsColorableUtxos = false,
  onOpenCreateUtxos,
  showReceiveSummary = true,
  isNewRgbAsset = false,
  newAssetId = '',
  setNewAssetId,
  colorableUtxoCount,
}: DepositPreGenerationProps) {
  const method = METHOD_META[currentMethod]
  const isRgbOnchain = network === 'onchain' && !isBtc

  return (
    <div className="space-y-3">
      {showReceiveSummary && (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
          <p className="text-xxs font-bold uppercase tracking-widest text-white/35">
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
      )}

      {channelsLoading && selectedAccount === 'RGB' && currentMethod === 'lightning' && !isBtc && (
        <div className="flex items-center gap-2.5 rounded-xl border bg-card p-3">
          <span className="material-symbols-outlined animate-spin text-icon-lg text-primary">
            progress_activity
          </span>
          <span className="text-xs font-medium text-white/60">Checking channel availability...</span>
        </div>
      )}

      {showChannelWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-xs font-bold text-warning">No Lightning Channels</p>
          <p className="text-tiny text-warning/70">Only on-chain deposits are available.</p>
        </AlertBanner>
      )}

      {showLiquidityWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-xs font-bold text-warning">No Inbound Liquidity</p>
          <p className="text-tiny text-warning/70">
            No channels with inbound capacity for {selectedAsset?.ticker ?? 'this asset'}.
          </p>
        </AlertBanner>
      )}

      {isAutoGenerate && loading && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className={cn('flex size-16 items-center justify-center rounded-2xl border', net.bg, net.border)}>
            <span className={cn('material-symbols-outlined animate-spin text-icon-4xl', net.text)}>
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

      {/* RGB asset-id: receive a specific asset, or any asset when left empty. */}
      {isRgbOnchain && isNewRgbAsset && setNewAssetId && (
        <div className="space-y-1.5">
          <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
            RGB Asset ID - Optional
          </label>
          <input
            type="text"
            value={newAssetId}
            onChange={(event) => setNewAssetId(event.target.value)}
            placeholder="rgb:... (leave empty for any asset)"
            spellCheck={false}
            autoCapitalize="off"
            className="w-full rounded-xl border bg-white/5 px-3 py-2.5 font-mono text-sm text-white transition-all placeholder:text-white/20 focus:border-primary/50 focus:outline-none"
          />
          <p className="text-xxs text-white/35">
            Enter a specific asset ID to receive it, or leave empty to accept any RGB asset to this
            invoice.
          </p>
        </div>
      )}

      {isRgbOnchain && (
        <div className="space-y-2.5 rounded-xl border bg-card p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white">
                {usePrivacy ? 'Blinded receive' : 'Witness receive'}
              </h4>
              <p className="mt-0.5 text-xxs text-muted-foreground">
                {usePrivacy ? 'Private - recommended' : 'Simpler - less private'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Toggle blinded (private) receive"
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

          {/* Mode explainer */}
          <p className="text-tiny leading-relaxed text-white/45">
            {usePrivacy
              ? 'Blinded: the sender never sees which UTXO you receive into. Spends one of your colorable UTXOs as the receiving slot.'
              : 'Witness: the sender creates the receiving UTXO for you. No colorable UTXO needed, but the sender sees the receiving output.'}
          </p>

          {/* Colorable UTXO availability — only relevant for the blinded path. */}
          {usePrivacy && colorableUtxoCount !== undefined && (
            <div
              className={cn(
                'flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xxs',
                colorableUtxoCount > 0
                  ? 'border-success/20 bg-success/5 text-success/80'
                  : 'border-warning/20 bg-warning/5 text-warning/80'
              )}
            >
              <span className="font-medium">Available colorable UTXOs</span>
              <span className="font-mono font-bold">{colorableUtxoCount}</span>
            </div>
          )}
          {usePrivacy && colorableUtxoCount === 0 && (
            <p className="text-tiny text-warning/70">
              None available — create a colorable UTXO below to receive privately, or switch off
              privacy to use a witness receive.
            </p>
          )}
        </div>
      )}

      {network === 'onchain' && !isBtc && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
              Amount ({getUnitLabel()}) - Optional
            </label>
            {selectedAsset && (
              <span className="text-xxs text-white/30">
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

      {/* RGB on-chain: warn the user before they hit Generate that the wallet
          needs at least one uncolored UTXO to back the invoice. */}
      {needsColorableUtxos && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-xs font-bold text-warning">Colorable UTXOs Required</p>
          <p className="text-tiny text-warning/70">
            To receive RGB assets on-chain you need at least one uncolored UTXO. Create some now
            and the invoice will be generated automatically.
          </p>
        </AlertBanner>
      )}

      {!isAutoGenerate &&
        ((needsColorableUtxos || (isRgbOnchain && usePrivacy && colorableUtxoCount === 0)) &&
        onOpenCreateUtxos ? (
          <Button variant="cta" size="cta" onClick={onOpenCreateUtxos} disabled={loading}>
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-icon-md">add_circle</span>
              Create Colorable UTXOs
            </span>
          </Button>
        ) : (
          <Button variant="cta" size="cta" onClick={generateInvoice} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-icon-md">
                  progress_activity
                </span>
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-icon-md">qr_code_2</span>
                Generate Address
              </span>
            )}
          </Button>
        ))}
    </div>
  )
}

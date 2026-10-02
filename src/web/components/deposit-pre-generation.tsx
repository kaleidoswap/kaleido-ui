import { Icon } from '../primitives/icon'
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
  LIQUID: 'Liquid',
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
        <div className="rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card">
          <p className="text-mini font-bold uppercase tracking-eyebrow text-muted-foreground">
            Receive Summary
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 text-caption">
            <div className="flex items-center justify-between gap-3">
              <span className="text-foreground/55">Asset</span>
              <span className="font-bold text-foreground">
                {selectedAsset?.ticker ?? (isBtc ? 'BTC' : 'Asset')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-foreground/55">Destination account</span>
              <span className="font-bold text-foreground">{ACCOUNT_TITLES[selectedAccount]}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-foreground/55">Transfer method</span>
              <span className="font-bold text-foreground">{method.label}</span>
            </div>
            <p className="text-tiny text-foreground/55">{method.summary}</p>
          </div>
        </div>
      )}

      {channelsLoading && selectedAccount === 'RGB' && currentMethod === 'lightning' && !isBtc && (
        <div className="flex items-center gap-2.5 rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card">
          <Icon name="progress_activity" className="animate-spin text-icon-lg text-secondary-content" />
          <span className="text-caption font-medium text-foreground/60">Checking channel availability...</span>
        </div>
      )}

      {showChannelWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-caption font-bold text-warning-fg">No Lightning Channels</p>
          <p className="text-tiny text-warning-fg/70">Only on-chain deposits are available.</p>
        </AlertBanner>
      )}

      {showLiquidityWarning && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-caption font-bold text-warning-fg">No Inbound Liquidity</p>
          <p className="text-tiny text-warning-fg/70">
            No channels with inbound capacity for {selectedAsset?.ticker ?? 'this asset'}.
          </p>
        </AlertBanner>
      )}

      {isAutoGenerate && loading && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className={cn('flex size-16 items-center justify-center rounded-2xl shadow-raised', net.bg)}>
            <Icon name="progress_activity" className={cn('animate-spin text-icon-4xl', net.text)} />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-caption font-bold text-muted-foreground">
              Generating {network === 'lightning' ? 'invoice' : 'address'}...
            </p>
            <p className="text-caption text-foreground/55">{net.label} network</p>
          </div>
        </div>
      )}

      {/* RGB asset-id: receive a specific asset, or any asset when left empty. */}
      {isRgbOnchain && isNewRgbAsset && setNewAssetId && (
        <div className="space-y-1.5">
          <label className="block pb-1 leading-none text-mini font-bold uppercase tracking-eyebrow text-secondary-content">
            RGB Asset ID - Optional
          </label>
          <input
            type="text"
            value={newAssetId}
            onChange={(event) => setNewAssetId(event.target.value)}
            placeholder="rgb:... (leave empty for any asset)"
            spellCheck={false}
            autoCapitalize="off"
            className="w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 px-3 py-2.5 font-mono text-caption text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus:ring-primary/50 focus:shadow-glow-primary-soft focus:outline-none"
          />
          <p className="text-xxs text-foreground/55">
            Enter a specific asset ID to receive it, or leave empty to accept any RGB asset to this
            invoice.
          </p>
        </div>
      )}

      {isRgbOnchain && (
        <div className="space-y-2.5 rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="text-caption font-bold text-foreground">
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
                'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full shadow-inner transition-colors',
                usePrivacy ? 'bg-primary bg-gradient-primary shadow-glow-primary-soft' : 'bg-foreground/10'
              )}
              onClick={() => setUsePrivacy(!usePrivacy)}
            >
              <span
                className={cn(
                  'inline-block h-3.5 w-3.5 rounded-full shadow-md transition-all',
                  usePrivacy ? 'translate-x-5 bg-black' : 'translate-x-0.5 bg-foreground/80'
                )}
              />
            </button>
          </div>

          {/* Mode explainer */}
          <p className="text-tiny leading-relaxed text-foreground/55">
            {usePrivacy
              ? 'Blinded: the sender never sees which UTXO you receive into. Spends one of your colorable UTXOs as the receiving slot.'
              : 'Witness: the sender creates the receiving UTXO for you. No colorable UTXO needed, but the sender sees the receiving output.'}
          </p>

          {/* Colorable UTXO availability — only relevant for the blinded path. */}
          {usePrivacy && colorableUtxoCount !== undefined && (
            <div
              className={cn(
                'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xxs',
                colorableUtxoCount > 0
                  ? 'bg-success/10 text-success-fg/80'
                  : 'bg-warning/10 text-warning-fg/80'
              )}
            >
              <span className="font-medium">Available colorable UTXOs</span>
              <span className="font-bold tabular-nums">{colorableUtxoCount}</span>
            </div>
          )}
          {usePrivacy && colorableUtxoCount === 0 && (
            <p className="text-tiny text-warning-fg/70">
              None available — create a colorable UTXO below to receive privately, or switch off
              privacy to use a witness receive.
            </p>
          )}
        </div>
      )}

      {network === 'onchain' && !isBtc && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block pb-1 leading-none text-mini font-bold uppercase tracking-eyebrow text-secondary-content">
              Amount ({getUnitLabel()}) - Optional
            </label>
            {selectedAsset && (
              <span className="text-xxs text-foreground/55">
                {selectedAsset.precision ?? 0} decimals
              </span>
            )}
          </div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`e.g. 10.00 ${selectedAsset?.ticker ?? ''}`}
            className="w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 px-3 py-2.5 font-mono text-caption font-bold text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus:ring-primary/50 focus:shadow-glow-primary-soft focus:outline-none"
            inputMode="decimal"
          />
        </div>
      )}

      {/* RGB on-chain: warn the user before they hit Generate that the wallet
          needs at least one uncolored UTXO to back the invoice. */}
      {needsColorableUtxos && (
        <AlertBanner variant="warning">
          <p className="mb-0.5 text-caption font-bold text-warning-fg">Colorable UTXOs Required</p>
          <p className="text-tiny text-warning-fg/70">
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
              <Icon name="add_circle" className="text-icon-md" />
              Create Colorable UTXOs
            </span>
          </Button>
        ) : (
          <Button variant="cta" size="cta" onClick={generateInvoice} disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" className="animate-spin text-icon-md" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="qr_code_2" className="text-icon-md" />
                Generate Address
              </span>
            )}
          </Button>
        ))}
    </div>
  )
}

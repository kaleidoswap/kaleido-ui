import type { ChangeEvent } from 'react'
import { Icon } from '../primitives/icon'
import { QrCode } from './qr-code'
import { cn } from '../utils/cn'
import {
  CopyIcon,
  InvoiceStatusBanner,
  PaidOverlay,
  type DepositNetworkConfigEntry,
  type DepositNetworkKey,
} from './deposit-ui-shared'

export interface DepositGeneratedAsset {
  ticker?: string
  name?: string
  precision?: number
}

export interface DepositGeneratedViewProps {
  network: DepositNetworkKey
  net: DepositNetworkConfigEntry
  isBtc: boolean
  address: string
  addressLabel: string
  recipientId: string
  arkSubMode: 'ark' | 'boarding'
  invoiceStatus: string | null
  isInvoicePending: boolean
  isInvoicePaid: boolean
  isInvoiceFailedOrExpired: boolean
  amount: string
  handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  copied: boolean
  copyToClipboard: (text: string) => Promise<void>
  getUnitLabel: () => string
  selectedAsset: DepositGeneratedAsset | null
  maxDepositAmount: number
  setAddress: (value: string) => void
  setRecipientId: (value: string) => void
  setAmount: (value: string) => void
  setInvoiceStatus: (value: string | null) => void
  showQrNetworkBadge?: boolean
  showRegenerate?: boolean
  /**
   * @deprecated Done button removed in v0.1.8 per the v1.0.0 wallet redesign;
   * users navigate away via the standard back button. Prop kept for source
   * compatibility — it is no longer invoked.
   */
  handleDone?: () => void
  /**
   * Optional regenerate callback. When provided, the "New Address" button
   * calls it directly (instead of just clearing local state via the
   * setters above). Required for flows whose auto-generation effect does
   * not refire on cleared state — e.g. RGB on-chain.
   */
  onRegenerate?: () => Promise<void> | void
}

function parseAssetAmount(amountString: string, asset: DepositGeneratedAsset | null): number {
  const value = Number(amountString)
  if (!Number.isFinite(value)) return 0
  return Math.round(value * Math.pow(10, asset?.precision ?? 0))
}

function formatAssetAmount(amount: number, asset: DepositGeneratedAsset | null): string {
  const precision = asset?.precision ?? 0
  return (amount / Math.pow(10, precision)).toLocaleString('en-US', {
    maximumFractionDigits: precision,
    minimumFractionDigits: 0,
  })
}

export function DepositGeneratedView({
  network,
  net,
  isBtc,
  address,
  addressLabel,
  recipientId,
  arkSubMode,
  invoiceStatus,
  isInvoicePending,
  isInvoicePaid,
  isInvoiceFailedOrExpired,
  amount,
  handleAmountChange,
  loading,
  copied,
  copyToClipboard,
  getUnitLabel,
  selectedAsset,
  maxDepositAmount,
  setAddress,
  setRecipientId,
  setAmount,
  setInvoiceStatus,
  showQrNetworkBadge = true,
  showRegenerate = true,
  onRegenerate,
}: DepositGeneratedViewProps) {
  return (
    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
      {(network === 'lightning' || (network === 'arkade' && arkSubMode === 'ark')) && isBtc && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-white/8 bg-white/3 p-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
              Specify amount (optional)
            </label>
          </div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Any amount (amountless)"
            className="w-full rounded-lg border bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-white transition-all placeholder:text-white/25 focus:border-warning/40 focus:outline-none"
            inputMode="decimal"
          />
          {amount && (
            <p className="text-xxs text-warning/70">
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined animate-spin text-icon-xxs">
                    progress_activity
                  </span>
                  Updating {network === 'arkade' ? 'URI' : 'invoice'}...
                </span>
              ) : network === 'arkade' ? (
                `Unified URI for ${amount} ${getUnitLabel()}`
              ) : (
                `Invoice for ${amount} ${getUnitLabel()}`
              )}
            </p>
          )}
        </div>
      )}

      {network === 'lightning' && !isBtc && (
        <div className="flex flex-col gap-1.5 rounded-xl border border-white/8 bg-white/3 p-2.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
              Specify amount (optional)
            </label>
          </div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Any amount (${selectedAsset?.ticker ?? 'amountless'})`}
            className="w-full rounded-lg border bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-white transition-all placeholder:text-white/25 focus:border-warning/40 focus:outline-none"
            inputMode="decimal"
          />
          {amount && (
            <p className="text-xxs text-warning/70">
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined animate-spin text-icon-xxs">
                    progress_activity
                  </span>
                  Updating invoice...
                </span>
              ) : (
                `Invoice for ${amount} ${getUnitLabel()}`
              )}
            </p>
          )}
          {amount && maxDepositAmount > 0 && parseAssetAmount(amount, selectedAsset) > maxDepositAmount && (
            <p className="rounded-lg border border-danger/20 bg-danger/10 px-2.5 py-1.5 text-xxs text-danger">
              Exceeds max: {formatAssetAmount(maxDepositAmount, selectedAsset)} {getUnitLabel()}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'relative flex flex-col items-center rounded-2xl border-2 bg-white p-3.5 transition-all',
            net.qrBorder
          )}
          style={net.qrGlow}
        >
          {showQrNetworkBadge && network !== 'spark' && network !== 'arkade' && (
            <div
              className={cn(
                'absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full border bg-white/90 px-1.5 py-0.5 text-xxs font-bold shadow-sm',
                net.text,
                net.border
              )}
            >
              {net.icon}
              <span>{net.label}</span>
            </div>
          )}
          <QrCode value={address} size={188} />
          {isInvoicePaid && <PaidOverlay />}
          {loading && !isInvoicePaid && (
            // Loading scrim — sits over the QR while a fresh address/invoice
            // is being fetched (e.g. after the New Address button).
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
              <span className="material-symbols-outlined animate-spin text-icon-3xl text-network-bitcoin">
                progress_activity
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          className={cn(
            'flex items-center gap-1 rounded-full border px-2.5 py-1 text-xxs font-bold uppercase tracking-widest transition-all',
            copied
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-border bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-accent hover:text-white'
          )}
          onClick={(event) => {
            event.stopPropagation()
            void copyToClipboard(address)
          }}
        >
          <Icon name={copied ? 'check' : 'content_copy'} size="xs" />
          {copied ? 'Copied' : network === 'lightning' ? 'Copy Invoice' : 'Copy Address'}
        </button>
      </div>

      {network === 'lightning' && invoiceStatus && (
        <InvoiceStatusBanner
          isInvoicePending={isInvoicePending}
          isInvoicePaid={isInvoicePaid}
          isInvoiceFailedOrExpired={isInvoiceFailedOrExpired}
          invoiceStatus={invoiceStatus}
        />
      )}

      <div
        data-testid="deposit-generated-address"
        data-address={address}
        className={cn(
          'group flex cursor-pointer items-center gap-2 rounded-xl border bg-white/3 px-2.5 py-1.5',
          'transition-all hover:bg-white/6 active:scale-[0.98]',
          net.border
        )}
        style={{ borderLeftWidth: 3, borderLeftColor: net.color }}
        onClick={() => void copyToClipboard(address)}
      >
        <div className={cn('flex size-5 flex-shrink-0 items-center justify-center rounded-md', net.bg)}>
          {net.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('text-xxs font-bold uppercase tracking-widest', net.text)}>
            <span data-testid="deposit-address-label">{addressLabel}</span>
          </p>
          <p className="mt-0.5 truncate font-mono text-tiny text-muted-foreground">
            {address.length > 50 ? `${address.slice(0, 18)}...${address.slice(-14)}` : address}
          </p>
        </div>
        <CopyIcon copied={copied} />
      </div>

      {recipientId && (
        <div
          className={cn(
            'group flex cursor-pointer items-center gap-2 rounded-xl border bg-primary/5 px-2.5 py-1.5',
            'border-primary/20 transition-all hover:bg-primary/8 active:scale-[0.98]'
          )}
          style={{ borderLeftWidth: 3, borderLeftColor: 'var(--primary)' }}
          onClick={() => void copyToClipboard(recipientId)}
        >
          <div className="flex size-5 flex-shrink-0 items-center justify-center rounded-md bg-primary/15">
            <Icon name="person" size="xs" className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xxs font-bold uppercase tracking-widest text-primary">
              Recipient ID
            </p>
            <p className="mt-0.5 truncate font-mono text-tiny text-muted-foreground">
              {recipientId.length > 50
                ? `${recipientId.slice(0, 18)}...${recipientId.slice(-14)}`
                : recipientId}
            </p>
          </div>
          <CopyIcon copied={copied} />
        </div>
      )}

      {showRegenerate && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            aria-label={`New ${network === 'lightning' ? 'invoice' : 'address'}`}
            title={`New ${network === 'lightning' ? 'invoice' : 'address'}`}
            disabled={loading}
            onClick={() => {
              if (onRegenerate) {
                // Keep the existing QR visible (we render a loading overlay on
                // top via `loading`) until the new value arrives. Avoids a
                // flash back to the pre-generation step.
                void onRegenerate()
                return
              }
              // Legacy callers without onRegenerate fall back to clearing
              // local state and relying on the parent's auto-regen effect.
              setAddress('')
              setRecipientId('')
              setAmount('')
              setInvoiceStatus(null)
            }}
            className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary transition-all hover:bg-primary/25 active:scale-[0.98] disabled:opacity-50"
          >
            <span
              className={cn('material-symbols-outlined text-icon-md', loading && 'animate-spin')}
            >
              refresh
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

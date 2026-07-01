import { useState, type ChangeEvent } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { QrCode } from './qr-code'
import { BottomSheet } from './bottom-sheet'
import {
  CopyIcon,
  InvoiceStatusBanner,
  NETWORK_CONFIG,
  PaidOverlay,
  type DepositAccountId,
  type DepositNetworkKey,
} from './deposit-ui-shared'

export interface BtcUnifiedReceiveAddress {
  network: DepositNetworkKey
  label: string
  value: string
  /**
   * Amount the address / invoice is bound to, in satoshis. Surfaced as
   * a small "10,000 sats" tag next to the row label so the user can see
   * at a glance what the LN invoice / Spark invoice / BIP21 link
   * actually encodes — bolt11 invoices and Spark invoices carry the
   * amount internally, but the user couldn't see it without decoding.
   * Omit (or pass 0) for amountless / open-ended addresses.
   */
  amountSats?: number
}

function formatSatsForRow(value: number | undefined): string | null {
  if (!value || value <= 0 || !Number.isFinite(value)) return null
  return `${value.toLocaleString('en-US')} sats`
}

export interface BtcUnifiedReceiveResult {
  qrValue: string
  qrLabel: string
  addresses: BtcUnifiedReceiveAddress[]
}

export interface BtcUnifiedReceiveProps {
  btcSelectedAccount: DepositAccountId
  accountReceiveResult: BtcUnifiedReceiveResult
  invoiceStatus: string | null
  isInvoicePending: boolean
  isInvoicePaid: boolean
  isInvoiceFailedOrExpired: boolean
  amount: string
  handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  /**
   * Identifier of the most recently copied value (the address/invoice text),
   * or null when nothing was copied recently. Each row compares against its
   * own value so the "Copied" affordance only highlights the row the user
   * actually clicked.
   */
  copied: string | null
  copyToClipboard: (text: string) => Promise<void>
  setAddress: (value: string) => void
  setAmount: (value: string) => void
  setInvoiceStatus: (value: string | null) => void
  setAccountReceiveResult: (result: null) => void
  handleDone: () => void
  /**
   * Show the "New Address" regenerate button below the QR. Defaults to true
   * for backwards compatibility. Set to false on flows where regenerating an
   * address is not meaningful (e.g. RGB on-chain receive — the addresses
   * are derived from the active RGB invoice and starting over from this
   * button leads to a half-initialised state).
   */
  showRegenerate?: boolean
  /** Optional request description/memo, edited alongside the amount in the
   * Edit modal. When omitted the description field is hidden. */
  description?: string
  onDescriptionChange?: (value: string) => void
}

export function BtcUnifiedReceive({
  accountReceiveResult,
  invoiceStatus,
  isInvoicePending,
  isInvoicePaid,
  isInvoiceFailedOrExpired,
  amount,
  handleAmountChange,
  loading,
  copied,
  copyToClipboard,
  setAddress,
  setAmount,
  setInvoiceStatus,
  setAccountReceiveResult,
  showRegenerate = true,
  description,
  onDescriptionChange,
}: BtcUnifiedReceiveProps) {
  const [showEdit, setShowEdit] = useState(false)
  const isQrCopied = copied === accountReceiveResult.qrValue

  const handleNewAddress = () => {
    setAddress('')
    setAmount('')
    setInvoiceStatus(null)
    setAccountReceiveResult(null)
  }

  return (
    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
      {/* White QR directly on the app background (no white card). */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex flex-col items-center p-2">
          <QrCode value={accountReceiveResult.qrValue} size={200} tone="onDark" />
          {isInvoicePaid && <PaidOverlay />}
        </div>

        {/* Icon-only Surface actions: Copy, New Address, Edit (amount/description). */}
        <div className="flex items-center justify-center gap-2.5">
          <Button
            variant="surface"
            size="icon-xl"
            aria-label={`Copy ${accountReceiveResult.qrLabel}`}
            onClick={() => void copyToClipboard(accountReceiveResult.qrValue)}
          >
            <Icon name={isQrCopied ? 'check' : 'content_copy'} size="lg" />
          </Button>
          {showRegenerate && (
            <Button
              variant="surface"
              size="icon-xl"
              aria-label="New address"
              onClick={handleNewAddress}
            >
              <Icon name="refresh" size="lg" />
            </Button>
          )}
          <Button
            variant="surface"
            size="icon-xl"
            aria-label="Edit amount and description"
            onClick={() => setShowEdit(true)}
          >
            <Icon name="edit" size="lg" />
          </Button>
        </div>
      </div>

      {invoiceStatus && (
        <InvoiceStatusBanner
          isInvoicePending={isInvoicePending}
          isInvoicePaid={isInvoicePaid}
          isInvoiceFailedOrExpired={isInvoiceFailedOrExpired}
          invoiceStatus={invoiceStatus}
        />
      )}

      <div className="space-y-1.5">
        <p className="text-xxs font-bold uppercase tracking-widest text-white/30">
          Available Addresses
        </p>
        {accountReceiveResult.addresses.map((address) => {
          const network = NETWORK_CONFIG[address.network]
          return (
            <div
              key={address.network}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-xl bg-white/3 px-2.5 py-1.5',
                'transition-all hover:bg-white/6 active:scale-[0.98]'
              )}
              style={{ borderLeftWidth: 3, borderLeftColor: network.color }}
              onClick={() => void copyToClipboard(address.value)}
            >
              <div className={cn('flex size-5 flex-shrink-0 items-center justify-center rounded-md', network.bg)}>
                {network.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={cn('text-xxs font-bold uppercase tracking-widest', network.text)}>
                    {address.label}
                  </p>
                  {(() => {
                    const amountLabel = formatSatsForRow(address.amountSats)
                    return amountLabel ? (
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-tiny font-bold tabular-nums text-white/70">
                        {amountLabel}
                      </span>
                    ) : null
                  })()}
                </div>
                <p className="mt-0.5 truncate font-mono text-tiny text-muted-foreground">
                  {address.value.length > 50
                    ? `${address.value.slice(0, 18)}...${address.value.slice(-14)}`
                    : address.value}
                </p>
              </div>
              <CopyIcon copied={copied === address.value} />
            </div>
          )
        })}
      </div>

      <BottomSheet
        open={showEdit}
        title="Edit request"
        icon={<Icon name="edit" size="md" />}
        onClose={() => setShowEdit(false)}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
              Amount (optional)
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Any amount"
              className="w-full rounded-xl bg-white/5 px-3 py-2.5 font-mono text-sm font-bold text-white shadow-inner transition-all placeholder:text-white/25 focus:outline focus:outline-2 focus:outline-primary/40"
              inputMode="decimal"
            />
            {amount && loading && (
              <p className="flex items-center gap-1 text-xxs text-warning/70">
                <span className="material-symbols-outlined animate-spin text-icon-xxs">
                  progress_activity
                </span>
                Updating invoice...
              </p>
            )}
          </div>

          {onDescriptionChange && (
            <div className="space-y-1.5">
              <label className="text-xxs font-bold uppercase tracking-widest text-white/40">
                Description (optional)
              </label>
              <input
                type="text"
                value={description ?? ''}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="What's this for?"
                className="w-full rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white shadow-inner transition-all placeholder:text-white/25 focus:outline focus:outline-2 focus:outline-primary/40"
              />
            </div>
          )}

          <Button variant="cta" className="w-full" onClick={() => setShowEdit(false)}>
            Done
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { IconGlyph } from '../primitives/icon-glyph'
import { ArrowBack, Fingerprint, ProgressActivity } from '../icons/outlined'
import { ScrollArea } from '../primitives/scroll-area'
import { formatAmount } from '../utils/amount-display'
import type { WithdrawAddressType } from './withdraw-destination-input'
import { GlyphButton } from '../primitives/glyph-button'
import { AssetIcon } from './asset-icon'

export interface WithdrawConfirmationRgbInvoice {
  recipient_type?: string
}

export interface WithdrawConfirmationProps {
  isConfirming: boolean
  isPollingStatus: boolean
  setShowConfirmation: (value: boolean) => void
  displayAmount: number
  selectedAssetId: string
  selectedAsset?: { ticker?: string; icon?: string }
  destination: string
  networkLabel: string
  /** The network's mark, e.g. `<ArkadeNetworkIcon />`: shown in the Network row and as the badge on the asset. */
  networkIcon?: ReactNode
  /** The paying account. Shown as "from …" beside the network only when it differs from `networkLabel`. */
  routeAccount?: string
  /** @deprecated No longer shown: the network and account already say how the payment goes. */
  routeMethod?: string
  estimatedFee: number
  /** The fee is quoted, not estimated: drop the `~`. Defaults to false. */
  feeIsExact?: boolean
  feeRate: string
  addressType: WithdrawAddressType
  decodedRgbInvoice: WithdrawConfirmationRgbInvoice | null
  witnessAmountSat: number
  amount: string
  /** Localized labels for the payment review amounts. */
  reviewLabels?: {
    recipientReceives: string
    estimatedNetworkFee: string
    totalDeducted: string
  }
  handleConfirmSend: () => void
  /** Locale the amounts are grouped in. Defaults to DEFAULT_AMOUNT_LOCALE (en-US), never the host's. */
  locale?: string
}

export function WithdrawConfirmation({
  isConfirming,
  isPollingStatus,
  setShowConfirmation,
  displayAmount,
  selectedAssetId,
  selectedAsset,
  destination,
  networkLabel,
  networkIcon,
  routeAccount,
  estimatedFee,
  feeIsExact = false,
  feeRate,
  addressType,
  decodedRgbInvoice,
  witnessAmountSat,
  amount,
  reviewLabels,
  handleConfirmSend,
  locale,
}: WithdrawConfirmationProps) {
  const ticker = selectedAsset?.ticker ?? selectedAssetId
  const unit = selectedAssetId === 'BTC' ? 'sats' : (selectedAsset?.ticker ?? 'units')
  const busy = isConfirming || isPollingStatus
  const showTotal = selectedAssetId === 'BTC' && estimatedFee > 0
  const fromAccount =
    routeAccount && routeAccount.toLowerCase() !== networkLabel.toLowerCase() ? routeAccount : null

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background bg-page-radial font-display text-foreground">
      <div className="absolute left-4 top-4 z-30">
        <GlyphButton
          icon={ArrowBack}
          label="Go back"
          size="lg"
          onClick={() => {
            if (!busy) setShowConfirmation(false)
          }}
          className={busy ? 'pointer-events-none opacity-70' : undefined}
        />
      </div>

      <ScrollArea className="flex-1" viewportClassName="px-5 pt-14 pb-6">
        <main className="space-y-4">
          <div data-slot="payment-review-hero" className="flex flex-col items-center pt-2">
            <div className="relative mb-3">
              <AssetIcon ticker={ticker} logoUri={selectedAsset?.icon} size={48} />
              {networkIcon && (
                <span
                  data-slot="payment-review-network-badge"
                  aria-hidden="true"
                  className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-card ring-2 ring-background"
                >
                  {networkIcon}
                </span>
              )}
            </div>
            <p className="text-caption uppercase tracking-eyebrow text-muted-foreground">
              {reviewLabels?.recipientReceives ?? 'Recipient receives'}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-display font-bold tabular-nums text-gradient-brand">
                {formatAmount(displayAmount, { locale })}
              </span>
              <span className="text-body text-muted-foreground">{unit}</span>
            </p>
          </div>

          <div className="space-y-1 rounded-2xl bg-card bg-gradient-card p-2 shadow-card">
            <ReviewRow label="To">
              <span className="min-w-0 truncate font-mono text-body text-foreground" title={destination}>
                {destination.length > 24
                  ? `${destination.slice(0, 12)}…${destination.slice(-8)}`
                  : destination}
              </span>
            </ReviewRow>
            <ReviewRow label="Network" data-testid="payment-review-network">
              <span className="flex min-w-0 items-center gap-1.5">
                {networkIcon && (
                  <span aria-hidden="true" className="flex shrink-0 items-center">
                    {networkIcon}
                  </span>
                )}
                <span className="truncate text-body font-bold text-foreground">{networkLabel}</span>
                {fromAccount && (
                  <span className="shrink-0 text-caption text-muted-foreground">from {fromAccount}</span>
                )}
              </span>
            </ReviewRow>
            {estimatedFee > 0 && (
              <ReviewRow
                label={reviewLabels?.estimatedNetworkFee ?? 'Estimated network fee'}
                data-testid="payment-review-fee"
              >
                <span className="flex items-baseline gap-1.5">
                  <span className="text-body tabular-nums text-foreground">
                    {`${feeIsExact ? '' : '~'}${formatAmount(estimatedFee, { locale })} sats`}
                  </span>
                  {feeRate && (
                    <span className="text-xxs font-bold capitalize tracking-wider text-secondary-content">
                      {feeRate}
                    </span>
                  )}
                </span>
              </ReviewRow>
            )}
            {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
              <ReviewRow label="Witness amount">
                <span className="text-body tabular-nums text-foreground">
                  {formatAmount(witnessAmountSat, { locale })} sats
                </span>
              </ReviewRow>
            )}
            {showTotal && (
              <div
                data-testid="payment-review-total"
                className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2.5"
              >
                <span className="text-caption font-bold uppercase tracking-eyebrow text-brand">
                  {reviewLabels?.totalDeducted ?? 'Total deducted'}
                </span>
                <span className="text-subhead font-bold tabular-nums text-foreground">
                  {formatAmount(Math.round(parseFloat(amount.replace(/,/g, '')) || 0) + estimatedFee, { locale })}{' '}
                  <span className="text-caption text-brand">sats</span>
                </span>
              </div>
            )}
          </div>

          {isPollingStatus && (
            <div className="flex items-center gap-3 rounded-xl bg-gradient-active p-4 shadow-glow-violet-soft ring-1 ring-inset ring-secondary/40">
              <IconGlyph glyph={ProgressActivity} className="animate-spin text-icon-2xl text-secondary-content" />
              <div>
                <p className="text-body font-medium text-foreground">Processing payment...</p>
                <p className="text-caption text-muted-foreground">Waiting for confirmation</p>
              </div>
            </div>
          )}

          <Button
            variant="cta"
            size="cta-lg"
            onClick={handleConfirmSend}
            disabled={busy}
            className="w-full"
          >
            {busy ? (
              <>
                <IconGlyph glyph={ProgressActivity} className="animate-spin text-icon-2xl" />
                {isPollingStatus ? 'Waiting for confirmation...' : 'Sending...'}
              </>
            ) : (
              <>
                <IconGlyph glyph={Fingerprint} className="text-icon-2xl" />
                Confirm & Send
              </>
            )}
          </Button>
        </main>
      </ScrollArea>
    </div>
  )
}

function ReviewRow({
  label,
  children,
  ...props
}: {
  label: string
  children: ReactNode
  'data-testid'?: string
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 px-3 py-2" {...props}>
      <span className="shrink-0 text-caption text-muted-foreground">{label}</span>
      <span className="flex min-w-0 justify-end">{children}</span>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { ScrollArea } from './scroll-area'
import { AssetIcon } from './asset-icon'
import type { WithdrawAddressType } from './withdraw-destination-input'

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
}: WithdrawConfirmationProps) {
  const ticker = selectedAsset?.ticker ?? selectedAssetId
  const unit = selectedAssetId === 'BTC' ? 'sats' : (selectedAsset?.ticker ?? 'units')
  const busy = isConfirming || isPollingStatus
  const showTotal = selectedAssetId === 'BTC' && estimatedFee > 0
  const fromAccount =
    routeAccount && routeAccount.toLowerCase() !== networkLabel.toLowerCase() ? routeAccount : null
  const total = Math.round(parseFloat(amount.replace(/,/g, '')) || 0) + estimatedFee

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background font-display text-foreground">
      <div className="absolute left-4 top-4 z-30">
        <Button
          type="button"
          variant="ghost"
          size="icon-xl"
          onClick={() => {
            if (!busy) setShowConfirmation(false)
          }}
          aria-label="Go back"
          className={busy ? 'pointer-events-none opacity-70' : undefined}
        >
          <Icon name="arrow_back" size="xl" />
        </Button>
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
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              {reviewLabels?.recipientReceives ?? 'Recipient receives'}
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">{displayAmount.toLocaleString('en-US')}</span>
              <span className="text-base text-muted-foreground">{unit}</span>
            </p>
          </div>

          <div className="space-y-1 rounded-2xl bg-card/90 p-2 shadow-inner backdrop-blur-2xl">
            <ReviewRow label="To">
              <span className="min-w-0 truncate font-mono text-sm text-white" title={destination}>
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
                <span className="truncate text-sm font-bold text-white">{networkLabel}</span>
                {fromAccount && (
                  <span className="shrink-0 text-xs text-muted-foreground">from {fromAccount}</span>
                )}
              </span>
            </ReviewRow>
            {estimatedFee > 0 && (
              <ReviewRow
                label={reviewLabels?.estimatedNetworkFee ?? 'Estimated network fee'}
                data-testid="payment-review-fee"
              >
                <span className="flex items-baseline gap-1.5">
                  <span className="text-sm tabular-nums text-white">
                    {`${feeIsExact ? '' : '~'}${estimatedFee.toLocaleString('en-US')} sats`}
                  </span>
                  {feeRate && (
                    <span className="text-xxs font-bold capitalize tracking-wider text-primary">
                      {feeRate}
                    </span>
                  )}
                </span>
              </ReviewRow>
            )}
            {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
              <ReviewRow label="Witness amount">
                <span className="text-sm tabular-nums text-white">
                  {witnessAmountSat.toLocaleString('en-US')} sats
                </span>
              </ReviewRow>
            )}
            {showTotal && (
              <div
                data-testid="payment-review-total"
                className="flex items-center justify-between gap-3 rounded-xl bg-primary/10 px-3 py-2.5"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {reviewLabels?.totalDeducted ?? 'Total deducted'}
                </span>
                <span className="text-lg font-bold tabular-nums text-white">
                  {total.toLocaleString('en-US')} <span className="text-sm text-primary/70">sats</span>
                </span>
              </div>
            )}
          </div>

          {isPollingStatus && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
              <span className="material-symbols-outlined animate-spin text-primary">
                progress_activity
              </span>
              <div>
                <p className="text-sm font-medium text-white">Processing payment...</p>
                <p className="text-xs text-muted-foreground">Waiting for confirmation</p>
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
                <span className="material-symbols-outlined animate-spin text-icon-2xl">
                  progress_activity
                </span>
                {isPollingStatus ? 'Waiting for confirmation...' : 'Sending...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-icon-2xl font-bold">fingerprint</span>
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
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="flex min-w-0 justify-end">{children}</span>
    </div>
  )
}

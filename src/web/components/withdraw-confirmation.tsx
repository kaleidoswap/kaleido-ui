import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { ScrollArea } from './scroll-area'
import { formatAmount } from '../utils/amount-display'
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
  selectedAsset?: { ticker?: string }
  destination: string
  networkLabel: string
  routeAccount?: string
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
  routeAccount,
  routeMethod,
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
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background font-display text-foreground">
      <div className="absolute left-4 top-4 z-30">
        <Button
          type="button"
          variant="ghost"
          size="icon-xl"
          onClick={() => {
            if (!isConfirming && !isPollingStatus) {
              setShowConfirmation(false)
            }
          }}
          aria-label="Go back"
          className={isConfirming || isPollingStatus ? 'pointer-events-none opacity-70' : undefined}
        >
          <Icon name="arrow_back" size="xl" />
        </Button>
      </div>

      <ScrollArea className="flex-1" viewportClassName="px-5 pt-16 pb-6">
      <main className="space-y-6">
        <div className="flex flex-col items-center py-6">
          <p className="mb-1 text-caption uppercase tracking-eyebrow text-muted-foreground">
            {reviewLabels?.recipientReceives ?? 'Recipient receives'}
          </p>
          <h1 className="mb-2 text-display font-bold">{formatAmount(displayAmount, { locale })}</h1>
          <p className="text-body text-muted-foreground">
            {selectedAssetId === 'BTC' ? 'sats' : (selectedAsset?.ticker ?? 'units')}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-card/90 py-1 shadow-inner backdrop-blur-2xl">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-caption text-muted-foreground">To</span>
            <span className="max-w-[200px] truncate font-mono text-body text-white" title={destination}>
              {destination.length > 24
                ? `${destination.substring(0, 12)}...${destination.slice(-12)}`
                : destination}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-caption text-muted-foreground">Network</span>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-primary" />
              <span className="text-body font-bold text-white">{networkLabel}</span>
            </div>
          </div>
          {routeAccount && (
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-caption text-muted-foreground">From Account</span>
              <span className="text-body font-bold text-white">{routeAccount}</span>
            </div>
          )}
          {routeMethod && (
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-caption text-muted-foreground">Route Method</span>
              <span className="text-body font-bold text-white">{routeMethod}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-caption text-muted-foreground">Asset</span>
            <span className="text-body font-bold text-white">
              {selectedAsset?.ticker ?? selectedAssetId}
            </span>
          </div>
          {estimatedFee > 0 && (
            <div
              data-testid="payment-review-fee"
              className="flex items-center justify-between px-5 py-4"
            >
              <span className="text-caption text-muted-foreground">
                {reviewLabels?.estimatedNetworkFee ?? 'Estimated network fee'}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-body text-white">
                  {`${feeIsExact ? '' : '~'}${formatAmount(estimatedFee, { locale })} sats`}
                </span>
                <span className="mt-0.5 text-xxs font-bold capitalize tracking-wider text-primary">
                  {feeRate}
                </span>
              </div>
            </div>
          )}
          {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-caption text-muted-foreground">Witness Amount</span>
              <span className="text-body text-white">{witnessAmountSat} sats</span>
            </div>
          )}
        </div>

        {selectedAssetId === 'BTC' && estimatedFee > 0 && (
          <div
            data-testid="payment-review-total"
            className="flex items-center justify-between rounded-2xl bg-primary/10 p-5 shadow-inner"
          >
            <span className="text-body font-bold uppercase tracking-eyebrow text-primary">
              {reviewLabels?.totalDeducted ?? 'Total deducted'}
            </span>
            <span className="text-title font-bold text-white">
              {formatAmount(Math.round(parseFloat(amount) || 0) + estimatedFee, { locale })}{' '}
              <span className="text-subhead text-primary/70">sats</span>
            </span>
          </div>
        )}

        {isPollingStatus && (
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
            <Icon name="progress_activity" className="animate-spin text-icon-2xl text-primary" />
            <div>
              <p className="text-body font-medium text-white">Processing payment...</p>
              <p className="text-caption text-muted-foreground">Waiting for confirmation</p>
            </div>
          </div>
        )}

        <Button
          variant="cta"
          size="cta-lg"
          onClick={handleConfirmSend}
          disabled={isConfirming || isPollingStatus}
          className="mt-2 w-full"
        >
          {isConfirming || isPollingStatus ? (
            <>
              <Icon name="progress_activity" className="animate-spin text-icon-2xl" />
              {isPollingStatus ? 'Waiting for confirmation...' : 'Sending...'}
            </>
          ) : (
            <>
              <Icon name="fingerprint" className="text-icon-2xl" />
              Confirm & Send
            </>
          )}
        </Button>
      </main>
      </ScrollArea>
    </div>
  )
}

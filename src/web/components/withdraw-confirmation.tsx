import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
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
  feeRate: string
  addressType: WithdrawAddressType
  decodedRgbInvoice: WithdrawConfirmationRgbInvoice | null
  witnessAmountSat: number
  amount: string
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
  routeAccount,
  routeMethod,
  estimatedFee,
  feeRate,
  addressType,
  decodedRgbInvoice,
  witnessAmountSat,
  amount,
  handleConfirmSend,
}: WithdrawConfirmationProps) {
  return (
    <div className="relative min-h-screen bg-background pb-6 pt-16 font-display text-foreground">
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

      <main className="space-y-6 px-5">
        <div className="flex flex-col items-center py-6">
          <p className="mb-1 text-sm uppercase tracking-wide text-muted-foreground">Sending</p>
          <h1 className="mb-2 text-4xl font-bold">{displayAmount.toLocaleString()}</h1>
          <p className="text-base text-muted-foreground">
            {selectedAssetId === 'BTC' ? 'sats' : (selectedAsset?.ticker ?? 'units')}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card/90 shadow-inner backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-border p-5">
            <span className="text-sm text-muted-foreground">To</span>
            <span className="max-w-[200px] truncate font-mono text-sm text-white" title={destination}>
              {destination.length > 24
                ? `${destination.substring(0, 12)}...${destination.slice(-12)}`
                : destination}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border p-5">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-primary" />
              <span className="text-sm font-bold text-white">{networkLabel}</span>
            </div>
          </div>
          {routeAccount && (
            <div className="flex items-center justify-between border-b border-border p-5">
              <span className="text-sm text-muted-foreground">From Account</span>
              <span className="text-sm font-bold text-white">{routeAccount}</span>
            </div>
          )}
          {routeMethod && (
            <div className="flex items-center justify-between border-b border-border p-5">
              <span className="text-sm text-muted-foreground">Route Method</span>
              <span className="text-sm font-bold text-white">{routeMethod}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-border p-5">
            <span className="text-sm text-muted-foreground">Asset</span>
            <span className="text-sm font-bold text-white">
              {selectedAsset?.ticker ?? selectedAssetId}
            </span>
          </div>
          {estimatedFee > 0 && (
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Network Fee</span>
              <div className="flex flex-col items-end">
                <span className="text-sm text-white">~{estimatedFee.toLocaleString()} sats</span>
                <span className="mt-0.5 text-xxs font-bold capitalize tracking-wider text-primary">
                  {feeRate}
                </span>
              </div>
            </div>
          )}
          {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
            <div className="flex items-center justify-between border-t border-border p-4">
              <span className="text-sm text-muted-foreground">Witness Amount</span>
              <span className="text-sm text-white">{witnessAmountSat} sats</span>
            </div>
          )}
        </div>

        {selectedAssetId === 'BTC' && estimatedFee > 0 && (
          <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-5 px-2 shadow-inner">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Total to deduct
            </span>
            <span className="text-xl font-bold text-white">
              {(Math.round(parseFloat(amount) || 0) + estimatedFee).toLocaleString()}{' '}
              <span className="text-lg text-primary/70">sats</span>
            </span>
          </div>
        )}

        {isPollingStatus && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
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
          disabled={isConfirming || isPollingStatus}
          className="mt-2 w-full"
        >
          {isConfirming || isPollingStatus ? (
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
    </div>
  )
}

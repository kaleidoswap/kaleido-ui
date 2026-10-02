import { formatAmount } from '../utils/amount-display'
import { Icon } from '../primitives/icon'
import { eyebrow } from '../utils/type-roles'
import { cn } from '../utils/cn'

export interface WithdrawSuccessProps {
  displayAmount: number
  selectedAssetId: string
  selectedAsset?: { ticker?: string }
  txResult: {
    paymentHash?: string
    payment_hash?: string
    txid?: string
  } | null
  handleReset: () => void
  onDone: () => void
  /** Locale the amount is grouped in. Defaults to en-US, never the host's. */
  locale?: string
}

export function WithdrawSuccess({
  displayAmount,
  selectedAssetId,
  selectedAsset,
  txResult,
  handleReset,
  onDone,
  locale,
}: WithdrawSuccessProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background bg-page-radial p-6 font-display text-foreground">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/40 to-transparent opacity-30" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/30 blur-2xl" />
          <div className="relative scale-110 rounded-full bg-primary bg-gradient-primary p-6 text-background shadow-glow-brand">
            <Icon name="check" className="text-icon-6xl" />
          </div>
        </div>

        <h1 className="mb-2 text-headline font-bold text-gradient-brand">Payment Sent!</h1>
        <p className="max-w-xs text-center text-muted-foreground">
          Your transaction has been successfully processed.
        </p>

        <div className="mt-12 w-full max-w-xs space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero p-5 shadow-card">
            <span className="text-caption text-muted-foreground">Amount</span>
            <span className="text-title font-bold">
              {formatAmount(displayAmount, { locale })}{' '}
              {selectedAssetId === 'BTC' ? (
                <span className="text-body text-brand/70">sats</span>
              ) : (
                (selectedAsset?.ticker ?? 'units')
              )}
            </span>
          </div>

          {(txResult?.paymentHash || txResult?.payment_hash) && (
            <div className="rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-5 shadow-card">
              <p className={cn('mb-2 text-muted-foreground', eyebrow)}>
                Payment Hash
              </p>
              <p className="break-all font-mono text-caption leading-relaxed text-muted-foreground">
                {txResult.paymentHash ?? txResult.payment_hash}
              </p>
            </div>
          )}

          {txResult?.txid && (
            <div className="rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-5 shadow-card">
              <p className={cn('mb-2 text-muted-foreground', eyebrow)}>
                Transaction ID
              </p>
              <p className="break-all font-mono text-caption leading-relaxed text-muted-foreground">
                {txResult.txid}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="z-10 space-y-3 py-6">
        <button
          type="button"
          onClick={() => {
            handleReset()
            onDone()
          }}
          className="w-full rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card py-4 text-subhead font-bold text-foreground shadow-card transition-all hover:bg-secondary/10 hover:shadow-card-hover active:scale-[0.98]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

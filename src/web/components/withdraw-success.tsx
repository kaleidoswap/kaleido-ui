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
}

export function WithdrawSuccess({
  displayAmount,
  selectedAssetId,
  selectedAsset,
  txResult,
  handleReset,
  onDone,
}: WithdrawSuccessProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background p-6 font-display text-foreground">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent opacity-20" />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30 blur-2xl" />
          <div className="relative scale-110 rounded-full bg-primary p-6 text-background shadow-2xl">
            <span className="material-symbols-outlined text-icon-6xl font-bold">check</span>
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold">Payment Sent!</h1>
        <p className="max-w-xs text-center text-muted-foreground">
          Your transaction has been successfully processed.
        </p>

        <div className="mt-12 w-full max-w-xs space-y-4">
          <div className="flex items-center justify-between rounded-2xl border bg-card p-5 shadow-inner">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-xl font-bold">
              {displayAmount.toLocaleString()}{' '}
              {selectedAssetId === 'BTC' ? (
                <span className="text-sm text-primary/70">sats</span>
              ) : (
                (selectedAsset?.ticker ?? 'units')
              )}
            </span>
          </div>

          {(txResult?.paymentHash || txResult?.payment_hash) && (
            <div className="rounded-2xl border bg-card p-5 shadow-inner">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Payment Hash
              </p>
              <p className="break-all font-mono text-xs leading-relaxed text-muted-foreground">
                {txResult.paymentHash ?? txResult.payment_hash}
              </p>
            </div>
          )}

          {txResult?.txid && (
            <div className="rounded-2xl border bg-card p-5 shadow-inner">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transaction ID
              </p>
              <p className="break-all font-mono text-xs leading-relaxed text-muted-foreground">
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
          className="w-full rounded-2xl border bg-card py-4 text-lg font-bold text-white transition-all hover:bg-accent active:scale-[0.98]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

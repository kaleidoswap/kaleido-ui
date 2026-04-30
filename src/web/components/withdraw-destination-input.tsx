export type WithdrawAddressType =
  | 'unknown'
  | 'bitcoin'
  | 'spark'
  | 'arkade'
  | 'lightning'
  | 'lightning-address'
  | 'lnurl-pay'
  | 'rgb'
  | 'invalid'

export interface WithdrawDestinationInputProps {
  destination: string
  setDestination: (value: string) => void
  addressType: WithdrawAddressType
  detectedNetworkLabel?: string
  isDecoding: boolean
  isResolvingLnurl: boolean
  handlePaste: () => void
  handleReset: () => void
}

export function WithdrawDestinationInput({
  destination,
  setDestination,
  addressType,
  detectedNetworkLabel,
  isDecoding,
  isResolvingLnurl,
  handlePaste,
  handleReset,
}: WithdrawDestinationInputProps) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Destination
      </label>
      <div className="relative">
        <input
          type="text"
          data-testid="withdraw-destination-input"
          className="w-full rounded-2xl border bg-card px-5 py-4 pr-20 font-mono text-sm text-white shadow-inner transition-all placeholder:text-white/20 focus:border-primary/50 focus:outline-none"
          placeholder="Address, Invoice, or RGB Invoice"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {destination && (
            <button
              type="button"
              onClick={() => {
                setDestination('')
                handleReset()
              }}
              className="text-xs text-muted-foreground transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-icon-md">close</span>
            </button>
          )}
          <button
            type="button"
            onClick={handlePaste}
            className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-white/20"
          >
            Paste
          </button>
        </div>
      </div>

      {destination && (
        <div className="ml-1 flex items-center gap-2 text-xs">
          {isDecoding || isResolvingLnurl ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="material-symbols-outlined animate-spin text-icon-sm">
                progress_activity
              </span>
              {isResolvingLnurl ? 'Resolving...' : 'Decoding...'}
            </span>
          ) : addressType !== 'unknown' && addressType !== 'invalid' ? (
            <>
              <span className="text-primary">&#10003;</span>
              <span data-testid="withdraw-detected-network" className="text-muted-foreground">
                Detected: {detectedNetworkLabel ?? addressType}
              </span>
            </>
          ) : addressType === 'invalid' ? (
            <>
              <span className="text-danger">&#10007;</span>
              <span data-testid="withdraw-invalid-destination" className="text-danger">
                Invalid address format
              </span>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

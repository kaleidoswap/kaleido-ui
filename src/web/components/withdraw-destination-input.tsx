import { useLayoutEffect, useRef } from 'react'
export type WithdrawAddressType =
  | 'unknown'
  | 'bitcoin'
  | 'spark'
  | 'arkade'
  | 'liquid'
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
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  // Grow with the content up to max-h, then scroll.
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [destination])
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Destination
      </label>
      <div className="relative">
        {/* A textarea, not an input: an address or invoice wraps so the whole
            string can be checked in the field itself, growing to a few lines
            and scrolling beyond that. Enter and pasted line breaks never land
            in the value. */}
        <textarea
          ref={fieldRef}
          data-testid="withdraw-destination-input"
          rows={1}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="block max-h-32 min-h-14 w-full resize-none break-all leading-relaxed rounded-2xl bg-card px-5 py-4 pr-20 font-mono text-sm text-white shadow-inner transition-all placeholder:text-white/20 focus:outline focus:outline-2 focus:outline-primary/50"
          placeholder="Address, Invoice, or RGB Invoice"
          value={destination}
          onChange={(event) => setDestination(event.target.value.replace(/\s*[\r\n]+\s*/g, ''))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault()
          }}
        />
        <div className="absolute right-3 top-3 flex items-center gap-1">
          {destination && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setDestination('')
                handleReset()
              }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-white"
            >
              <span className="material-symbols-outlined text-icon-md">close</span>
            </button>
          )}
          <button
            type="button"
            aria-label="Paste"
            onClick={handlePaste}
            className="rounded-lg bg-white/5 p-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-icon-md">content_paste</span>
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

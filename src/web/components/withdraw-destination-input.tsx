import { useId } from 'react'
import { Icon } from '../primitives/icon'
import { Label } from '../primitives/label'

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
  const inputId = useId()
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="ml-1">
        Destination
      </Label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          data-testid="withdraw-destination-input"
          className="w-full rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card px-5 py-4 pr-20 font-mono text-caption text-foreground shadow-inner transition-all placeholder:text-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft"
          placeholder="Address, Invoice, or RGB Invoice"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {destination && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setDestination('')
                handleReset()
              }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary/10 hover:text-foreground"
            >
              <Icon name="close" className="text-icon-md" />
            </button>
          )}
          <button
            type="button"
            aria-label="Paste"
            onClick={handlePaste}
            className="rounded-lg bg-secondary/15 p-2 text-secondary-content shadow-raised ring-1 ring-inset ring-secondary/25 transition-all hover:bg-secondary hover:text-white hover:shadow-button-violet"
          >
            <Icon name="content_paste" className="text-icon-md" />
          </button>
        </div>
      </div>

      {destination && (
        <div className="ml-1 flex items-center gap-2 text-caption">
          {isDecoding || isResolvingLnurl ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Icon name="progress_activity" className="animate-spin text-icon-sm" />
              {isResolvingLnurl ? 'Resolving...' : 'Decoding...'}
            </span>
          ) : addressType !== 'unknown' && addressType !== 'invalid' ? (
            <>
              <span className="text-brand">&#10003;</span>
              <span data-testid="withdraw-detected-network" className="text-muted-foreground">
                Detected: {detectedNetworkLabel ?? addressType}
              </span>
            </>
          ) : addressType === 'invalid' ? (
            <>
              <span className="text-danger-fg">&#10007;</span>
              <span data-testid="withdraw-invalid-destination" className="text-danger-fg">
                Invalid address format
              </span>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

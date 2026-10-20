import { useId, useLayoutEffect, useRef } from 'react'
import { IconGlyph } from '../primitives/icon-glyph'
import { Close, ContentPaste, ProgressActivity } from '../icons/outlined'
import { Label } from '../primitives/label'
import { GlyphButton } from '../primitives/glyph-button'

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
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  // Grow with the content up to max-h, then scroll.
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [destination])
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId} className="ml-1">
        Destination
      </Label>
      <div className="relative">
        {/* A textarea, not an input: an address or invoice wraps so the whole
            string can be checked in the field itself, growing to a few lines
            and scrolling beyond that. It still takes a single value: Enter
            and pasted line breaks never land in it. */}
        <textarea
          ref={fieldRef}
          id={inputId}
          data-testid="withdraw-destination-input"
          rows={1}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="block max-h-32 min-h-14 w-full resize-none break-all rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card px-5 py-4 pr-20 font-mono text-caption leading-relaxed text-foreground shadow-inner transition-all placeholder:text-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft"
          placeholder="Address, Invoice, or RGB Invoice"
          value={destination}
          onChange={(event) => setDestination(event.target.value.replace(/\s*[\r\n]+\s*/g, ''))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault()
          }}
        />
        <div className="absolute right-3 top-3 flex items-center gap-1">
          {destination && (
            <GlyphButton
              icon={Close}
              label="Clear"
              size="sm"
              onClick={() => {
                setDestination('')
                handleReset()
              }}
            />
          )}
          <GlyphButton icon={ContentPaste} label="Paste" variant="surface" size="sm" onClick={handlePaste} />
        </div>
      </div>

      {destination && (
        <div className="ml-1 flex items-center gap-2 text-caption">
          {isDecoding || isResolvingLnurl ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <IconGlyph glyph={ProgressActivity} className="animate-spin text-icon-sm" />
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

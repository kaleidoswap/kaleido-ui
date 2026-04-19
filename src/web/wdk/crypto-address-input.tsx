import { useRef, useState } from 'react'
import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export interface CryptoAddressInputProps {
  value: string
  onChange: (value: string) => void
  /**
   * Optional QR scan callback. On web this typically opens a dialog / camera
   * permission flow. When omitted the QR button is not rendered.
   */
  onQRScan?: () => void
  error?: string
  /** Short hint shown inside the field when value is empty */
  placeholder?: string
  label?: string
  disabled?: boolean
  /** When true, renders a small validated checkmark on the right */
  isValid?: boolean
  /** Forwarded to the underlying <input> element — useful for testing selectors */
  'data-testid'?: string
  className?: string
}

export function CryptoAddressInput({
  value,
  onChange,
  onQRScan,
  error,
  placeholder = 'Enter address or invoice…',
  label,
  disabled = false,
  isValid = false,
  'data-testid': dataTestId,
  className,
}: CryptoAddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pasting, setPasting] = useState(false)

  const handlePaste = async () => {
    if (pasting) return
    try {
      setPasting(true)
      const text = await navigator.clipboard.readText()
      onChange(text.trim())
    } catch {
      // clipboard permission denied — focus the input so the user can paste manually
      inputRef.current?.focus()
    } finally {
      setPasting(false)
    }
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex items-center overflow-hidden rounded-xl border bg-card transition-all',
          error
            ? 'border-destructive focus-within:border-destructive'
            : isValid
              ? 'border-primary/60 focus-within:border-primary/60'
              : 'border-border focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* wallet icon */}
        <div className="flex shrink-0 items-center pl-3 text-muted-foreground">
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
        </div>

        {/* text input */}
        <input
          ref={inputRef}
          type="text"
          data-testid={dataTestId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="h-12 min-w-0 flex-1 truncate bg-transparent px-2.5 font-mono text-caption text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
        />

        {/* right actions */}
        <div className="flex shrink-0 items-center gap-1 pr-2">
          {/* valid indicator */}
          {isValid && !error && (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </span>
          )}

          {/* clear */}
          {value && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="size-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Clear address"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </Button>
          )}

          {/* paste */}
          {!value && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handlePaste() }}
              disabled={pasting}
              className="h-7 gap-1 rounded-lg border border-border bg-muted text-xxs font-bold uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[12px]">content_paste</span>
              Paste
            </Button>
          )}

          {/* QR scan */}
          {onQRScan && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); onQRScan() }}
              className="size-8 rounded-xl border border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              aria-label="Scan QR code"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-tiny font-medium text-destructive">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>
      )}
    </div>
  )
}

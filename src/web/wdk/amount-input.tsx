import { useRef } from 'react'
import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export type AmountInputMode = 'token' | 'fiat'

export interface AmountInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  tokenSymbol: string
  fiatSymbol?: string
  tokenBalance?: string
  fiatBalance?: string
  inputMode?: AmountInputMode
  onToggleInputMode?: () => void
  onUseMax?: () => void
  error?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function AmountInput({
  label,
  value,
  onChange,
  tokenSymbol,
  fiatSymbol,
  tokenBalance,
  fiatBalance,
  inputMode = 'token',
  onToggleInputMode,
  onUseMax,
  error,
  disabled = false,
  placeholder = '0',
  className,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSymbol  = inputMode === 'token' ? tokenSymbol : (fiatSymbol ?? tokenSymbol)
  const activeBalance = inputMode === 'token' ? tokenBalance : fiatBalance
  const canToggle     = !!(fiatSymbol && onToggleInputMode)

  const handleChange = (raw: string) => {
    // Allow only digits + one decimal point
    const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    onChange(cleaned)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* label row */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </label>
          {activeBalance && (
            <span className="text-tiny text-muted-foreground">
              Balance:{' '}
              <span className="font-medium text-foreground">{activeBalance}</span>
            </span>
          )}
        </div>
      )}

      {/* input frame */}
      <div
        className={cn(
          'flex items-center overflow-hidden rounded-xl border bg-card transition-all',
          error
            ? 'border-destructive focus-within:border-destructive'
            : 'border-border focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* symbol + optional toggle */}
        <div className="flex shrink-0 items-center gap-1 self-stretch border-r border-border bg-muted px-3">
          <span className="text-sm font-semibold text-muted-foreground">{activeSymbol}</span>
          {canToggle && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleInputMode?.() }}
              disabled={disabled}
              className="ml-0.5 text-muted-foreground transition-colors hover:text-primary disabled:pointer-events-none"
              aria-label="Toggle token / fiat"
            >
              <span className="material-symbols-outlined text-[14px]">swap_vert</span>
            </button>
          )}
        </div>

        {/* numeric input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="h-14 min-w-0 flex-1 bg-transparent px-3 text-right text-xl font-bold tabular-nums text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
        />

        {/* Max */}
        {onUseMax && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onUseMax() }}
            disabled={disabled}
            className="mr-2 h-7 shrink-0 rounded-lg border border-primary/30 bg-primary/10 text-xxs font-bold uppercase tracking-widest text-primary hover:bg-primary/20 disabled:pointer-events-none"
          >
            Max
          </Button>
        )}
      </div>

      {/* error */}
      {error && (
        <p className="flex items-center gap-1.5 text-tiny font-medium text-destructive">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>
      )}
    </div>
  )
}

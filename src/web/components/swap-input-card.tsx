import type { ReactNode } from 'react'
import { Button, type ButtonProps } from '../primitives/button'
import { Icon } from '../primitives/icon'
import {
  AssetSelector,
  type AssetSelectorCategory,
  type AssetSelectorOption,
} from './asset-selector'
import { cn } from '../utils/cn'

export interface SwapInputCardProps {
  fromTicker: string
  toTicker: string
  fromInput: string
  fromOptions: AssetSelectorOption[]
  toOptions: AssetSelectorOption[]
  categories?: AssetSelectorCategory[]
  defaultActiveCategories?: string[]
  availableText: string
  showMaxText?: boolean
  maxText?: string
  selectedPercentage?: number | null
  percentageDisabled?: boolean
  fromUnitLabel: string
  fromUnitIsToggle?: boolean
  receiveAmount?: string | null
  receiveUnitLabel?: string
  isLoadingQuote?: boolean
  quoteError?: string | null
  quoteRateText?: string | null
  quoteFeeText?: string | null
  quoteExpiresText?: string | null
  quoteExpiresUrgent?: boolean
  warning?: string | null
  submitLabel: string
  /** Optional leading icon for the submit CTA (e.g. a Material-Symbols glyph). */
  submitIcon?: ReactNode
  submitVariant?: ButtonProps['variant']
  submitDisabled?: boolean
  onFromTickerChange: (ticker: string) => void
  onToTickerChange: (ticker: string) => void
  onFromInputChange: (value: string) => void
  onPercentageClick: (percent: number) => void
  onToggleFromUnit?: () => void
  onFlip: () => void
  onSubmit: () => void
}

const PERCENTAGES = [25, 50, 75, 100]

export function SwapInputCard({
  fromTicker,
  toTicker,
  fromInput,
  fromOptions,
  toOptions,
  categories,
  defaultActiveCategories,
  availableText,
  showMaxText = false,
  maxText,
  selectedPercentage = null,
  percentageDisabled = false,
  fromUnitLabel,
  fromUnitIsToggle = false,
  receiveAmount,
  receiveUnitLabel,
  isLoadingQuote = false,
  quoteError,
  quoteRateText,
  quoteFeeText,
  quoteExpiresText,
  quoteExpiresUrgent = false,
  warning,
  submitLabel,
  submitIcon,
  submitVariant = 'cta',
  submitDisabled = false,
  onFromTickerChange,
  onToTickerChange,
  onFromInputChange,
  onPercentageClick,
  onToggleFromUnit,
  onFlip,
  onSubmit,
}: SwapInputCardProps) {
  return (
    <>
      <div className="relative mb-3 flex flex-col rounded-3xl bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300">
        <div className="p-3.5 pb-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">You Pay</p>
            {/* Percentage shortcuts now sit above the amount row per spec —
                they read more naturally as inputs that drive the amount. */}
            <div className="flex items-center gap-1">
              {PERCENTAGES.map((percent) => (
                <button
                  key={percent}
                  type="button"
                  disabled={percentageDisabled}
                  onClick={() => onPercentageClick(percent)}
                  className={cn(
                    'rounded px-1.5 py-0.5 text-xxs font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40',
                    selectedPercentage === percent
                      ? 'border-primary/50 bg-primary/20 text-primary shadow-sm'
                      : 'bg-white/[0.03] text-muted-foreground hover:text-white',
                  )}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AssetSelector
              compact
              label="From"
              selectedTicker={fromTicker}
              options={fromOptions}
              categories={categories}
              defaultActiveCategories={defaultActiveCategories}
              disabledTicker={toTicker}
              onChange={onFromTickerChange}
            />
            <div className="min-w-0 flex-1 text-right">
              <input
                type="text"
                inputMode="decimal"
                value={fromInput}
                onChange={(event) => onFromInputChange(event.target.value)}
                placeholder="0"
                className="w-full border-none bg-transparent text-right text-2xl font-bold text-white placeholder:text-white/15 focus:outline-none"
              />
              {fromUnitIsToggle && onToggleFromUnit ? (
                <button
                  type="button"
                  onClick={onToggleFromUnit}
                  className="mt-0.5 text-right text-xs text-muted-foreground transition-colors hover:text-primary"
                  title="Tap to switch unit"
                >
                  {fromUnitLabel}
                </button>
              ) : (
                <p className="mt-0.5 text-xs text-muted-foreground">{fromUnitLabel}</p>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xxs font-medium text-white/60">
              {showMaxText && maxText ? `Max: ${maxText}` : `Available: ${availableText}`}
            </p>
          </div>
        </div>

        <div className="relative mx-6 flex h-px items-center justify-center bg-white/[0.08]">
          {/* The flip button rotates 180° on hover; previously it carried a
              directional `shadow-lg shadow-black/35` that visibly slid as the
              button rotated. Wrap the button in a non-rotating shadow host
              and rotate only the inner glyph so the shadow stays put. */}
          <span className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-lg shadow-black/35">
            <button
              type="button"
              onClick={onFlip}
              title="Flip assets"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-primary transition-transform duration-500 hover:rotate-180 hover:bg-accent active:scale-95"
            >
              <Icon name="swap_vert" size="md" />
            </button>
          </span>
        </div>

        <div className="rounded-b-3xl bg-gradient-to-br from-white/[0.01] to-primary/[0.04] p-3.5 pt-4 transition-all duration-300">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
            You Receive
          </p>
          <div className="flex items-center gap-2">
            <AssetSelector
              compact
              label="To"
              selectedTicker={toTicker}
              options={toOptions}
              categories={categories}
              defaultActiveCategories={defaultActiveCategories}
              disabledTicker={fromTicker}
              onChange={onToTickerChange}
            />
            <div className="min-w-0 flex-1 text-right">
              {isLoadingQuote ? (
                <div className="ml-auto h-8 w-28 animate-pulse rounded-lg bg-white/10" />
              ) : receiveAmount ? (
                <span className="text-2xl font-bold text-primary">{receiveAmount}</span>
              ) : (
                <span className="text-2xl font-bold text-white/15">-</span>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">
                {receiveUnitLabel || toTicker || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(quoteError || quoteRateText || quoteFeeText || quoteExpiresText) && (
        <div className="rounded-xl bg-card/60 p-3">
          {quoteError ? (
            <p className="text-center text-xs text-danger">{quoteError}</p>
          ) : (
            <div className="space-y-1.5">
              {quoteRateText && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Rate</span>
                  <span className="font-medium text-white/65">{quoteRateText}</span>
                </div>
              )}
              {(quoteFeeText || quoteExpiresText) && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">Fee</span>
                  <div className="flex items-center gap-2">
                    {quoteFeeText && <span className="text-white/65">{quoteFeeText}</span>}
                    {quoteFeeText && quoteExpiresText && (
                      <span className="text-white/15">·</span>
                    )}
                    {quoteExpiresText && (
                      <span
                        className={cn(
                          'font-mono tabular-nums',
                          quoteExpiresUrgent ? 'font-semibold text-warning' : 'text-white/40',
                        )}
                      >
                        {quoteExpiresText}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {warning && (
        <div className="flex items-start gap-2 rounded-xl bg-danger/10 p-3">
          <Icon name="warning" size="sm" className="mt-0.5 text-danger" />
          <p className="text-xs leading-relaxed text-danger">{warning}</p>
        </div>
      )}

      <Button
        variant={submitVariant}
        size="cta"
        className="w-full"
        onClick={onSubmit}
        disabled={submitDisabled}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {submitIcon}
          <span>{submitLabel}</span>
        </span>
      </Button>
    </>
  )
}

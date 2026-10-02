import type { ReactNode } from 'react'
import { Button, type ButtonProps } from '../primitives/button'
import { Icon } from '../primitives/icon'
import {
  AssetSelector,
  type AssetSelectorCategory,
  type AssetSelectorNetworkOption,
  type AssetSelectorOption,
  type AssetSelectorQuickAsset,
} from './asset-selector'
import { cn } from '../utils/cn'
import { formatDisplayAmountText, type AmountDisplayUnit } from '../utils/amount-display'

export interface SwapInputCardProps {
  fromTicker: string
  toTicker: string
  fromSelectedId?: string
  toSelectedId?: string
  fromInput: string
  fromOptions: AssetSelectorOption[]
  toOptions: AssetSelectorOption[]
  categories?: AssetSelectorCategory[]
  defaultActiveCategories?: string[]
  /** Network filter slider rendered inside the "You Pay" asset picker. */
  fromNetworks?: AssetSelectorNetworkOption[]
  /** Quick-asset chips rendered inside the "You Pay" asset picker. */
  fromQuickAssets?: AssetSelectorQuickAsset[]
  availableText: string
  showMaxText?: boolean
  maxText?: string
  selectedPercentage?: number | null
  percentageDisabled?: boolean
  /** Hide the 25/50/75/Max shortcuts entirely (e.g. bridge: no local balance). */
  hidePercentages?: boolean
  /** One-way flow: replace the flip button with a static down-arrow indicator. */
  oneWay?: boolean
  fromUnitLabel: string
  fromDisplayUnit?: AmountDisplayUnit
  fromUnitIsToggle?: boolean
  receiveAmount?: string | null
  receiveUnitLabel?: string
  receiveDisplayUnit?: AmountDisplayUnit
  isLoadingQuote?: boolean
  quoteError?: string | null
  quoteRateText?: string | null
  /** Routing venue label shown next to the rate row (e.g. "KaleidoSwap"). */
  quoteVenueText?: string | null
  /** Tone of the venue dot — primary for KaleidoSwap, info/spark for Flashnet. */
  quoteVenueTone?: 'primary' | 'spark' | 'info'
  quoteFeeText?: string | null
  quoteExpiresText?: string | null
  quoteExpiresUrgent?: boolean
  warning?: string | null
  submitLabel: string
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
  fromSelectedId,
  toSelectedId,
  fromInput,
  fromOptions,
  toOptions,
  categories,
  defaultActiveCategories,
  fromNetworks,
  fromQuickAssets,
  availableText,
  showMaxText = false,
  maxText,
  selectedPercentage = null,
  percentageDisabled = false,
  hidePercentages = false,
  oneWay = false,
  fromUnitLabel,
  fromDisplayUnit,
  fromUnitIsToggle = false,
  receiveAmount,
  receiveUnitLabel,
  receiveDisplayUnit,
  isLoadingQuote = false,
  quoteError,
  quoteRateText,
  quoteVenueText,
  quoteVenueTone = 'primary',
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
  const availableDisplayText = formatDisplayAmountText(availableText, {
    unit: fromDisplayUnit,
  })
  const maxDisplayText = maxText
    ? formatDisplayAmountText(maxText, {
        unit: fromDisplayUnit,
      })
    : undefined
  const receiveDisplayText = receiveAmount
    ? formatDisplayAmountText(receiveAmount, {
        unit: receiveDisplayUnit,
      })
    : null

  return (
    <>
      <div className="relative mb-3 flex flex-col rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero shadow-card transition-all duration-300">
        <div className="p-3.5 pb-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-mini font-bold uppercase tracking-eyebrow text-muted-foreground">You Pay</p>
            {/* Percentage shortcuts now sit above the amount row per spec —
                they read more naturally as inputs that drive the amount. */}
            {!hidePercentages && (
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
                      ? 'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary'
                      : 'bg-secondary/10 text-secondary-content shadow-raised hover:bg-secondary/20 hover:text-foreground',
                  )}
                >
                  {percent}%
                </button>
              ))}
            </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AssetSelector
              compact
              label="From"
              selectedTicker={fromTicker}
              selectedId={fromSelectedId}
              options={fromOptions}
              categories={categories}
              defaultActiveCategories={defaultActiveCategories}
              networks={fromNetworks}
              quickAssets={fromQuickAssets}
              disabledId={toSelectedId}
              onChange={onFromTickerChange}
            />
            <div className="min-w-0 flex-1 overflow-hidden text-right">
              <input
                type="text"
                inputMode="decimal"
                value={fromInput}
                maxLength={24}
                onChange={(event) => onFromInputChange(event.target.value)}
                placeholder="0"
                className="w-full min-w-0 border-none bg-transparent text-right text-headline font-bold tabular-nums text-foreground placeholder:text-foreground/15 focus:outline-none"
              />
              {fromUnitIsToggle && onToggleFromUnit ? (
                <button
                  type="button"
                  onClick={onToggleFromUnit}
                  className="mt-0.5 text-right text-caption text-muted-foreground transition-colors hover:text-secondary-content"
                  title="Tap to switch unit"
                >
                  {fromUnitLabel}
                </button>
              ) : (
                <p className="mt-0.5 text-caption text-muted-foreground">{fromUnitLabel}</p>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p
              className="min-w-0 max-w-full truncate text-xxs font-medium tabular-nums text-foreground/60"
              title={showMaxText && maxText ? `Max: ${maxText}` : `Available: ${availableText}`}
            >
              {showMaxText && maxDisplayText
                ? `Max: ${maxDisplayText}`
                : `Available: ${availableDisplayText}`}
            </p>
          </div>
        </div>

        <div className="relative mx-6 flex h-px items-center justify-center bg-secondary/25">
          {/* The flip button rotates 180° on hover; previously it carried a
              directional `shadow-lg shadow-black/35` that visibly slid as the
              button rotated. Wrap the button in a non-rotating shadow host
              and rotate only the inner glyph so the shadow stays put. */}
          <span className="absolute flex h-11 w-11 items-center justify-center rounded-full bg-secondary shadow-button-violet transition-shadow duration-300 hover:shadow-glow-violet">
            <button
              type="button"
              onClick={onFlip}
              title="Flip assets"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary bg-gradient-violet text-white ring-4 ring-card transition-transform duration-500 hover:rotate-180 active:scale-95"
            >
              <Icon name="swap_vert" size="md" />
            </button>
          </span>
        </div>

        <div className="rounded-b-2xl bg-gradient-to-br from-secondary/[0.06] to-primary/[0.08] p-3.5 pt-4 transition-all duration-300">
          <p className="mb-2 text-mini font-bold uppercase tracking-eyebrow text-brand/70">
            You Receive
          </p>
          <div className="flex items-center gap-2">
            <AssetSelector
              compact
              label="To"
              selectedTicker={toTicker}
              selectedId={toSelectedId}
              options={toOptions}
              categories={categories}
              defaultActiveCategories={defaultActiveCategories}
              disabledId={fromSelectedId}
              onChange={onToTickerChange}
            />
            <div className="min-w-0 flex-1 text-right">
              {isLoadingQuote ? (
                <div className="ml-auto h-8 w-28 animate-pulse rounded-lg bg-secondary/15" />
              ) : receiveAmount ? (
                <span
                  className="block max-w-full truncate text-headline font-bold tabular-nums text-brand"
                  title={receiveAmount}
                >
                  {receiveDisplayText}
                </span>
              ) : (
                <span className="text-headline font-bold text-foreground/15">-</span>
              )}
              <p className="mt-0.5 text-caption text-muted-foreground">
                {receiveUnitLabel || toTicker || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(quoteError || quoteRateText || quoteVenueText || quoteFeeText || quoteExpiresText) && (
        <div className="rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card">
          {quoteError ? (
            <p className="text-center text-caption text-danger-fg">{quoteError}</p>
          ) : (
            <div className="space-y-1.5">
              {quoteVenueText && (
                <div className="flex items-center justify-between text-caption">
                  <span className="text-foreground/55">Provider</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground/65">
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        quoteVenueTone === 'spark' && 'bg-network-spark',
                        quoteVenueTone === 'info' && 'bg-info',
                        quoteVenueTone === 'primary' && 'bg-primary',
                      )}
                      aria-hidden
                    />
                    {quoteVenueText}
                  </span>
                </div>
              )}
              {quoteRateText && (
                <div className="flex items-center justify-between text-caption">
                  <span className="text-foreground/55">Rate</span>
                  <span className="font-medium text-foreground/65">{quoteRateText}</span>
                </div>
              )}
              {(quoteFeeText || quoteExpiresText) && (
                <div className="flex items-center justify-between text-caption">
                  <span className="text-foreground/55">Fee</span>
                  <div className="flex items-center gap-2">
                    {quoteFeeText && <span className="text-foreground/65">{quoteFeeText}</span>}
                    {quoteFeeText && quoteExpiresText && (
                      <span className="text-foreground/15">·</span>
                    )}
                    {quoteExpiresText && (
                      <span
                        className={cn(
                          'tabular-nums',
                          quoteExpiresUrgent ? 'font-semibold text-warning-fg' : 'text-foreground/55',
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
          <Icon name="warning" size="sm" className="mt-0.5 text-danger-fg" />
          <p className="text-caption leading-relaxed text-danger-fg">{warning}</p>
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

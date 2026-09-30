import { formatAmount } from '../utils/amount-display'
import type { ChangeEvent } from 'react'
import { cn } from '../utils/cn'

export interface WithdrawDecodedLnInvoice {
  amount?: number | null
  asset_amount?: number | null
}

export interface WithdrawDecodedRgbInvoice {
  assignment?: { value?: number | null } | null
  recipient_type?: string
}

export interface WithdrawLnurlPayData {
  params: {
    min: number
    max: number
    description?: string
  }
}

export interface WithdrawAmountInputProps {
  addressType: import('./withdraw-destination-input').WithdrawAddressType
  amount: string
  handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSetMax: () => void
  selectedAssetId: string
  selectedAssetTicker: string | undefined
  assetBalance?: number
  formattedBalance: string
  decodedLnInvoice: WithdrawDecodedLnInvoice | null
  decodedRgbInvoice: WithdrawDecodedRgbInvoice | null
  lnurlPayData: WithdrawLnurlPayData | null
  witnessAmountSat: number
  setWitnessAmountSat: (value: number) => void
  feeRate: 'slow' | 'normal' | 'fast'
  setFeeRate: (rate: 'slow' | 'normal' | 'fast') => void
  feeRates: { slow: number; normal: number; fast: number }
  /**
   * Optional custom fee-rate mode. When `setFeeRateMode` is provided the fee
   * selector gains a fourth "Custom" option with a sat/vB input; otherwise it
   * renders the plain slow/normal/fast presets (backward compatible).
   */
  feeRateMode?: 'slow' | 'normal' | 'fast' | 'custom'
  setFeeRateMode?: (mode: 'slow' | 'normal' | 'fast' | 'custom') => void
  customFeeRate?: string
  setCustomFeeRate?: (value: string) => void
  /** Resolved sat/vB actually used (preset or custom), for the estimate line. */
  effectiveFeeRateSatPerVb?: number
  /** Estimated total fee in sats, for the estimate line. */
  estimatedFee?: number
  donation: boolean
  setDonation: (value: boolean) => void
}

export function WithdrawAmountInput({
  addressType,
  amount,
  handleAmountChange,
  handleSetMax,
  selectedAssetId,
  selectedAssetTicker,
  formattedBalance,
  decodedLnInvoice,
  decodedRgbInvoice,
  lnurlPayData,
  witnessAmountSat,
  setWitnessAmountSat,
  feeRate,
  setFeeRate,
  feeRates,
  feeRateMode,
  setFeeRateMode,
  customFeeRate,
  setCustomFeeRate,
  effectiveFeeRateSatPerVb,
  estimatedFee,
  donation,
  setDonation,
}: WithdrawAmountInputProps) {
  // Custom mode is opt-in: callers wanting the sat/vB input pass setFeeRateMode.
  const customFeeEnabled = typeof setFeeRateMode === 'function'
  const activeFeeMode = feeRateMode ?? feeRate
  const unitLabel = selectedAssetId === 'BTC' ? 'sats' : (selectedAssetTicker ?? 'units')
  const showAmountInput =
    addressType === 'bitcoin' ||
    addressType === 'spark' ||
    addressType === 'arkade' ||
    addressType === 'liquid' ||
    addressType === 'lightning-address' ||
    addressType === 'lnurl-pay' ||
    (addressType === 'rgb' && !decodedRgbInvoice?.assignment?.value) ||
    (addressType === 'lightning' && !decodedLnInvoice?.amount && !decodedLnInvoice?.asset_amount)

  const enteredNum = parseFloat(amount.replace(/[^\d.-]/g, '') || '0') || 0
  const balanceNum = parseFloat(formattedBalance.replace(/,/g, '') || '0') || 0
  const isOverBalance = enteredNum > 0 && balanceNum > 0 && enteredNum > balanceNum

  return (
    <>
      {showAmountInput && (
        <div className="space-y-3">
          <label className="ml-1 text-mini font-bold uppercase tracking-eyebrow text-secondary-content">
            Amount
          </label>
          <div className="overflow-hidden rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero shadow-card transition-shadow focus-within:ring-1 focus-within:ring-primary/50 focus-within:shadow-glow-primary-soft">
            <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent text-headline font-bold tabular-nums text-white outline-none placeholder:text-white/15"
                  placeholder="0"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <p className="mt-0.5 text-caption text-muted-foreground">{unitLabel}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-secondary bg-gradient-violet px-3 py-1.5 text-mini font-bold uppercase tracking-eyebrow text-white shadow-button-violet transition-shadow hover:shadow-glow-violet"
                onClick={handleSetMax}
              >
                Max
              </button>
            </div>
            <div className={cn(
              'flex items-center justify-between bg-muted/40 px-4 py-2',
            )}>
              <span className="text-xxs text-white/40">Available</span>
              <span className={cn(
                'tabular-nums text-xxs font-medium',
                isOverBalance ? 'text-danger' : 'text-white/55',
              )}>
                {formattedBalance} {unitLabel}
              </span>
            </div>
          </div>
          {lnurlPayData && (
            <div className="space-y-1 px-1">
              <p className="text-caption text-muted-foreground">
                {formatAmount(Math.ceil(lnurlPayData.params.min))} &ndash;{' '}
                {formatAmount(Math.floor(lnurlPayData.params.max))} sats
              </p>
              {lnurlPayData.params.description && (
                <p className="text-caption italic text-muted-foreground">
                  {lnurlPayData.params.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
        <div className="space-y-2">
          <label className="ml-1 text-caption font-medium text-muted-foreground">
            Witness Amount (sats) - min 512
          </label>
          <input
            type="number"
            min={512}
            value={witnessAmountSat}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10)
              if (!Number.isNaN(value)) setWitnessAmountSat(value)
            }}
            className="w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 px-4 py-3 text-body text-white shadow-inner transition-all focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft"
          />
          <p className="ml-1 text-caption text-muted-foreground">
            Bitcoin amount sent to create the witness UTXO for the recipient.
          </p>
        </div>
      )}

      {(addressType === 'bitcoin' || addressType === 'rgb') && (
        <div className="space-y-2">
          <label className="ml-1 text-mini font-bold uppercase tracking-eyebrow text-secondary-content">
            Fee Rate
          </label>
          {customFeeEnabled ? (
            <>
              <div className="grid grid-cols-4 gap-2">
                {(['slow', 'normal', 'fast', 'custom'] as const).map((mode) => {
                  const selected = activeFeeMode === mode
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setFeeRateMode?.(mode)
                        if (mode !== 'custom') setFeeRate(mode)
                      }}
                      className={`group relative overflow-hidden rounded-xl border px-2 py-3 transition-all active:scale-[0.98] ${
                        selected
                          ? 'border-transparent bg-gradient-active ring-1 ring-inset ring-primary/40 shadow-glow-primary-soft'
                          : 'border-transparent bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-raised hover:bg-secondary/10'
                      }`}
                    >
                      <span
                        className={`block text-caption font-bold capitalize ${selected ? 'text-primary' : 'text-muted-foreground group-hover:text-secondary-content'}`}
                      >
                        {mode}
                      </span>
                      <span
                        className={`mt-0.5 block text-xxs font-medium ${selected ? 'text-primary/70' : 'text-white/40 group-hover:text-white/70'}`}
                      >
                        {mode === 'custom' ? 'sat/vB' : `${feeRates[mode]} sat/vB`}
                      </span>
                    </button>
                  )
                })}
              </div>
              {activeFeeMode === 'custom' && (
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={`${feeRates[feeRate]} (${feeRate})`}
                  value={customFeeRate ?? ''}
                  onChange={(event) => setCustomFeeRate?.(event.target.value.replace(/[^\d.]/g, ''))}
                  className="w-full rounded-xl bg-card/55 bg-gradient-card ring-1 ring-inset ring-secondary/15 hover:ring-secondary/35 px-4 py-3 text-body text-white shadow-inner transition-all focus:outline-none focus:ring-1 focus:ring-primary/50 focus:shadow-glow-primary-soft"
                />
              )}
              {typeof estimatedFee === 'number' && (
                <p className="ml-1 text-caption text-muted-foreground">
                  Using {effectiveFeeRateSatPerVb} sat/vB &middot; ~{formatAmount(estimatedFee)}{' '}
                  sats est. fee
                </p>
              )}
            </>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {(['slow', 'normal', 'fast'] as const).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setFeeRate(rate)}
                  className={`group relative overflow-hidden rounded-[16px] px-3 py-3 transition-all active:scale-[0.98] ${
                    feeRate === rate
                      ? 'bg-gradient-active ring-1 ring-inset ring-primary/40 shadow-glow-primary-soft'
                      : 'bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-raised hover:bg-secondary/10'
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/15 to-transparent transition-opacity ${feeRate === rate ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className={`text-body font-bold capitalize transition-colors ${feeRate === rate ? 'text-primary' : 'text-muted-foreground group-hover:text-secondary-content'}`}
                    >
                      {rate}
                    </div>
                    <div
                      className={`mt-0.5 text-xxs font-medium transition-colors ${feeRate === rate ? 'text-primary/70' : 'text-white/40 group-hover:text-white/70'}`}
                    >
                      {feeRates[rate]} sat/vB
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {addressType === 'rgb' && (
        <div className="flex items-center justify-between rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-3 shadow-card">
          <div>
            <p className="text-body font-medium text-white">Gift / Donation</p>
            <p className="text-caption text-muted-foreground">Skip amount checks for this transfer</p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              donation ? 'bg-primary bg-gradient-primary shadow-glow-primary-soft' : 'bg-white/10 shadow-inner'
            }`}
            onClick={() => setDonation(!donation)}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full transition-transform ${
                donation ? 'translate-x-6 bg-black' : 'translate-x-1 bg-foreground/90'
              }`}
            />
          </button>
        </div>
      )}
    </>
  )
}

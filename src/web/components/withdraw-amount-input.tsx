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
  donation,
  setDonation,
}: WithdrawAmountInputProps) {
  const unitLabel = selectedAssetId === 'BTC' ? 'sats' : (selectedAssetTicker ?? 'units')
  const showAmountInput =
    addressType === 'bitcoin' ||
    addressType === 'spark' ||
    addressType === 'arkade' ||
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
          <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Amount
          </label>
          <div className="overflow-hidden rounded-2xl bg-card/70">
            <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/15"
                  placeholder="0"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <p className="mt-0.5 text-xs text-muted-foreground">{unitLabel}</p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg bg-primary/15 px-3 py-1.5 text-xxs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/25"
                onClick={handleSetMax}
              >
                Max
              </button>
            </div>
            <div className={cn(
              'flex items-center justify-between border-t border-white/[0.05] px-4 py-2',
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
              <p className="text-xs text-muted-foreground">
                {Math.ceil(lnurlPayData.params.min).toLocaleString()} &ndash;{' '}
                {Math.floor(lnurlPayData.params.max).toLocaleString()} sats
              </p>
              {lnurlPayData.params.description && (
                <p className="text-xs italic text-muted-foreground">
                  {lnurlPayData.params.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {addressType === 'rgb' && decodedRgbInvoice?.recipient_type === 'Witness' && (
        <div className="space-y-2">
          <label className="ml-1 text-xs font-medium text-muted-foreground">
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
            className="w-full rounded-xl border bg-card px-4 py-3 text-sm text-white transition-colors focus:border-primary/50 focus:outline-none"
          />
          <p className="ml-1 text-xs text-muted-foreground">
            Bitcoin amount sent to create the witness UTXO for the recipient.
          </p>
        </div>
      )}

      {(addressType === 'bitcoin' || addressType === 'rgb') && (
        <div className="space-y-2">
          <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Fee Rate
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['slow', 'normal', 'fast'] as const).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setFeeRate(rate)}
                className={`group relative overflow-hidden rounded-[16px] border px-3 py-3 shadow-sm transition-all active:scale-[0.98] ${
                  feeRate === rate
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border bg-card/40 backdrop-blur-xl hover:border-primary/40'
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent transition-opacity ${feeRate === rate ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`text-sm font-bold capitalize transition-colors ${feeRate === rate ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
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
        </div>
      )}

      {addressType === 'rgb' && (
        <div className="flex items-center justify-between rounded-xl border bg-card p-3">
          <div>
            <p className="text-sm font-medium text-white">Gift / Donation</p>
            <p className="text-xs text-muted-foreground">Skip amount checks for this transfer</p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              donation ? 'bg-primary' : 'bg-secondary'
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

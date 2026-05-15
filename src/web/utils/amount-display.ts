export type AmountDisplayUnit = 'token' | 'sats' | 'BTC' | 'mBTC'

export interface AmountDisplayOptions {
  unit?: AmountDisplayUnit
  maxDecimals?: number
}

const NUMBER_RE = /^(-?\d[\d,]*)(?:\.(\d+))?$/

export function formatDisplayAmountText(
  value: string | number | null | undefined,
  options: AmountDisplayOptions = {},
): string {
  if (value === null || value === undefined || value === '') return ''
  const unit = options.unit ?? 'token'
  const maxDecimals =
    unit === 'sats'
      ? 0
      : unit === 'BTC'
        ? 8
        : unit === 'mBTC'
          ? 5
          : (options.maxDecimals ?? 6)

  const raw = typeof value === 'number' ? String(value) : value.trim()
  const suffixMatch = raw.match(/(\s+[A-Za-z][\w.-]*)$/u)
  const suffix = suffixMatch?.[1] ?? ''
  const numeric = suffix ? raw.slice(0, -suffix.length) : raw
  const match = numeric.match(NUMBER_RE)
  if (!match) return raw

  const num = parseFloat(numeric.replace(/,/g, ''))
  if (!Number.isFinite(num)) return raw

  const factor = Math.pow(10, maxDecimals)
  const rounded = Math.round(num * factor) / factor
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  })

  return `${formatted}${suffix}`
}

/**
 * Format a numeric value for compact display.
 * Uses locale-aware compact notation (e.g. 1.2M, 3.4K) when the
 * absolute value exceeds the threshold.
 */
export function formatCompactAmount(
  value: number,
  locale = 'en-US',
): string {
  if (!Number.isFinite(value)) return String(value)
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

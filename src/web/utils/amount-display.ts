export type AmountDisplayUnit = 'token' | 'sats' | 'BTC' | 'mBTC'

export interface AmountDisplayOptions {
  unit?: AmountDisplayUnit
  maxDecimals?: number
}

// Matches ONLY unambiguous en-US plain numbers: either no grouping at all
// (`3159`, `0.00053`) or commas used strictly as thousands separators in
// groups of three (`53,000`, `1,234,567`). A string like `31,59` — where the
// comma is a decimal separator (it-IT/de-DE/fr-FR locale output) — does NOT
// match, so it is passed through untouched instead of being misread as
// `3159`. Without this, locale-formatted currency strings (e.g. "31,59 USD")
// were corrupted to "3,159 USD" by the comma-stripping reparse below.
const NUMBER_RE = /^-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/

export function formatDisplayAmountText(
  value: string | number | null | undefined,
  options: AmountDisplayOptions = {},
): string {
  if (value === null || value === undefined || value === '') return ''
  const unit = options.unit ?? 'token'
  const raw = typeof value === 'number' ? String(value) : value.trim()
  const suffixMatch = raw.match(/(\s+[A-Za-z][\w.-]*)$/u)
  const suffix = suffixMatch?.[1] ?? ''
  const detectedUnit =
    suffix.trim() === 'BTC' ? 'BTC' :
    suffix.trim() === 'sats' ? 'sats' :
    suffix.trim() === 'mBTC' ? 'mBTC' :
    unit
  const maxDecimals =
    detectedUnit === 'sats' ? 0 :
    detectedUnit === 'BTC' ? 8 :
    detectedUnit === 'mBTC' ? 5 :
    (options.maxDecimals ?? 6)
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

import { useState, useEffect } from 'react'

const DEFAULT_ICON_CDN_BASE_URL =
  'https://raw.githubusercontent.com/kaleidoswap/coinmarketcap-icons-cryptos/refs/heads/main/icons/'
const DICEBEAR_SHAPES_BASE_URL = 'https://api.dicebear.com/9.x/shapes/svg'

const TICKER_MAPPINGS: Record<string, string> = {
  SAT: 'BTC',
  None: '',
}

const VALID_ICON_TICKER_REGEX = /^[A-Z0-9-]{1,12}$/

/**
 * Build the CDN icon URL for a given ticker.
 */
export function getAssetIconUrl(ticker: string, cdnBaseUrl = DEFAULT_ICON_CDN_BASE_URL): string {
  if (!ticker || ticker.trim() === '') return ''

  const normalized = ticker.toUpperCase().trim()

  if (!VALID_ICON_TICKER_REGEX.test(normalized)) return ''

  if (TICKER_MAPPINGS[normalized] !== undefined) {
    const mapped = TICKER_MAPPINGS[normalized]
    if (mapped === '') return ''
    return getAssetIconUrl(mapped, cdnBaseUrl)
  }

  return `${cdnBaseUrl}${normalized.toLowerCase()}.png`
}

export function getFallbackAssetIconUrl(seed: string): string {
  const normalized = seed.trim()
  if (!normalized) return ''

  const params = new URLSearchParams({
    seed: normalized,
    backgroundType: 'gradientLinear',
    radius: '50',
  })

  return `${DICEBEAR_SHAPES_BASE_URL}?${params.toString()}`
}

/**
 * Hook that returns a CDN icon URL for a given asset ticker.
 */
export function useAssetIcon(ticker: string, cdnBaseUrl?: string): string {
  const [url, setUrl] = useState(() => getAssetIconUrl(ticker, cdnBaseUrl))

  useEffect(() => {
    setUrl(getAssetIconUrl(ticker, cdnBaseUrl))
  }, [ticker, cdnBaseUrl])

  return url
}

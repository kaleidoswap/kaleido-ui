import { useEffect, useState } from 'react'
import { getFallbackAssetIconUrl, useAssetIcon } from '../hooks/use-asset-icon'
import { cn } from '../utils/cn'

interface AssetIconProps {
  ticker: string
  logoUri?: string
  /** CDN base URL for icon resolution (defaults to KaleidoSwap CDN) */
  cdnBaseUrl?: string
  size?: number
  className?: string
}

const ASSET_COLORS: Record<string, string> = {
  BTC: 'bg-transparent',
  ETH: 'bg-asset-eth',
  USDT: 'bg-asset-usdt',
  USDC: 'bg-asset-usdc',
}

const LOCAL_ICONS: Record<string, string> = {
  BTC: '/icons/bitcoin/bitcoin-logo.svg',
  ARKADE: '/icons/arkade/arkade-icon.svg',
  RGB: '/icons/rgb/rgb-logo.svg',
  SPARK: '/icons/spark/Asterisk/Spark Asterisk White.svg',
}

/**
 * Renders a circular asset icon.
 * First checks local SVG map, then tries CDN, then placeholder.
 */
export function AssetIcon({ ticker, logoUri, cdnBaseUrl, size = 40, className }: AssetIconProps) {
  const normTicker = ticker.toUpperCase()
  const localIcon = LOCAL_ICONS[normTicker]
  const cdnUrl = useAssetIcon(ticker, cdnBaseUrl)
  const fallbackUrl = getFallbackAssetIconUrl(ticker)
  const [useFallback, setUseFallback] = useState(!logoUri && !localIcon && !cdnUrl && !!fallbackUrl)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    setUseFallback(!logoUri && !localIcon && !cdnUrl && !!fallbackUrl)
  }, [logoUri, localIcon, cdnUrl, fallbackUrl])

  const iconUrl = logoUri
    ? logoUri
    : localIcon
      ? localIcon
      : failed
        ? null
        : useFallback || !cdnUrl
          ? fallbackUrl || null
          : cdnUrl || fallbackUrl || null

  const bgColor = ASSET_COLORS[normTicker] || 'bg-slate-600'

  if (iconUrl) {
    return (
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center shadow-inner',
          !localIcon && bgColor,
          className
        )}
        style={{ width: size, height: size }}
      >
        <img
          src={iconUrl}
          alt={`${ticker} icon`}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => {
            if (logoUri) {
              setFailed(false)
              setUseFallback(!localIcon && !!fallbackUrl)
              return
            }
            if (localIcon) return
            if (!useFallback && fallbackUrl) {
              setUseFallback(true)
              return
            }
            setFailed(true)
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-foreground shadow-inner border',
        bgColor,
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {ticker.charAt(0).toUpperCase()}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getFallbackAssetIconUrl, useAssetIcon } from '../hooks/use-asset-icon'
import { protocolIcons } from '../assets/protocol-icons'
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

// Bundled data-URIs (protocolIcons, the same marks as the showcase's External
// logos): a host app need not serve them, and a missing host asset would render
// as a permanently broken image (onError bails early for local icons).
// protocolIcons is a Partial for type reasons but these keys are always defined.
const LOCAL_ICONS: Record<string, string> = {
  BTC: protocolIcons.Bitcoin!,
  ARKADE: protocolIcons.Arkade!,
  RGB: protocolIcons.RGB20!,
  SPARK: protocolIcons.Spark!,
  LIQUID: protocolIcons.Liquid!,
  'L-BTC': protocolIcons.Liquid!,
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

  // Unknown assets fall back to a brand-violet disc (gradient + white glyph).
  const bgColor = ASSET_COLORS[normTicker] || 'bg-secondary bg-gradient-violet'

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
          className={cn('object-cover w-full h-full', normTicker === 'SPARK' && localIcon && 'kui-mono-icon')}
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
        'rounded-full flex items-center justify-center font-bold shadow-inner',
        bgColor,
        ASSET_COLORS[normTicker] ? 'text-foreground' : 'text-secondary-foreground',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {ticker.charAt(0).toUpperCase()}
    </div>
  )
}

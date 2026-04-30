import { useState } from 'react'
import { cn } from '../utils/cn'
import { NetworkBadge, type NetworkType } from './network-badge'
import { AssetIcon } from './asset-icon'

export interface AssetCardProps {
  /** Asset ticker symbol (e.g. "BTC", "USDT") */
  ticker: string
  /** Display name (e.g. "Bitcoin") */
  name: string
  /** Formatted display balance string */
  displayBalance: string
  /** Networks this asset is available on */
  networks?: NetworkType[]
  /** Logo URI override */
  logoUri?: string
  /** Whether balance should be masked */
  balanceVisible?: boolean
  /** Accent color hex for the card gradient. Pass a token from `kaleido-ui/tokens` (e.g. `colors.network.bitcoin`). */
  accentColor?: string
  onClick?: () => void
  className?: string
}

export function AssetCard({
  ticker,
  name,
  displayBalance,
  networks = [],
  logoUri,
  balanceVisible = true,
  accentColor,
  onClick,
  className,
}: AssetCardProps) {
  const shown = balanceVisible ? displayBalance : '••••••'
  const [hovered, setHovered] = useState(false)

  const gradientStyle = accentColor
    ? { background: `linear-gradient(135deg, var(--card) 30%, ${accentColor}${hovered ? '77' : '55'} 75%, ${accentColor}${hovered ? 'dd' : 'b3'} 100%)`, transition: 'background 0.3s ease' }
    : undefined

  return (
    <div
      className={cn(
        'p-4 rounded-card backdrop-blur-xl transition-all shadow-sm relative overflow-hidden group',
        !accentColor && 'bg-card',
        onClick && 'cursor-pointer hover:brightness-110 active:scale-[0.98]',
        className
      )}
      style={gradientStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <AssetIcon
            ticker={ticker}
            logoUri={logoUri}
            size={44}
            className="group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span
              className={cn(
                'font-bold text-base leading-tight tracking-wide text-foreground',
                onClick && 'transition-colors'
              )}
            >
              {name}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {networks.map((network) => (
                <NetworkBadge key={network} network={network} showLabel />
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg tracking-tight text-foreground group-hover:opacity-90 transition-colors">
            {shown}
          </p>
          <p className="text-tiny text-muted-foreground font-medium tracking-wide uppercase mt-0.5">
            {ticker}
          </p>
        </div>
      </div>
    </div>
  )
}

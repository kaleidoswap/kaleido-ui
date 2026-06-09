import { useState } from 'react'
import { cn } from '../utils/cn'
import { NetworkBadge, type NetworkType } from './network-badge'
import { AssetIcon } from './asset-icon'
import { formatDisplayAmountText } from '../utils/amount-display'
import { StatusBadge, type StatusType } from './status-badge'

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
  /** Optional state badge for assets that are present but not currently spendable. */
  status?: StatusType
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
  status,
  onClick,
  className,
}: AssetCardProps) {
  const shown = balanceVisible ? displayBalance : '••••••'
  const displayShown = balanceVisible ? formatDisplayAmountText(displayBalance) : shown
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
      <div className="relative z-10 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AssetIcon
            ticker={ticker}
            logoUri={logoUri}
            size={44}
            className="group-hover:scale-105 transition-transform"
          />
          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                'max-w-full truncate font-bold text-base leading-tight tracking-wide text-foreground',
                onClick && 'transition-colors'
              )}
              title={name}
            >
              {name}
            </span>
            <div className="flex flex-nowrap gap-1 mt-1">
              {networks.map((network) => (
                <NetworkBadge key={network} network={network} size="sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex min-w-0 max-w-[45%] flex-col items-end text-right">
          <p
            className="max-w-full truncate font-bold text-lg tabular-nums tracking-tight text-foreground transition-colors group-hover:opacity-90"
            title={shown}
          >
            {displayShown}
          </p>
          <p className="mt-0.5 truncate text-tiny font-medium uppercase tracking-wide text-muted-foreground">
            {ticker}
          </p>
          {status && <StatusBadge status={status} className="mt-2" />}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { AssetIcon } from './asset-icon'
import { cn } from '../utils/cn'

export interface AssetLabelProps {
  ticker: string
  /** A logo to use instead of the built-in one for this ticker. */
  logoUri?: string
  /** The logo's size in px. */
  size?: number
  /** What is written beside the logo: the asset's name, or an amount of it. */
  children: ReactNode
  className?: string
}

/** An asset's logo beside what is written about it: its name, or an amount of it. */
export function AssetLabel({ ticker, logoUri, size = 16, children, className }: AssetLabelProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)} data-slot="asset-label">
      <AssetIcon ticker={ticker} logoUri={logoUri} size={size} />
      {children}
    </span>
  )
}

import { cn } from '../utils/cn'
import { protocolIcons } from '../assets/protocol-icons'

export interface NetworkIconProps {
  className?: string
  alt?: string
}

export function LightningNetworkIcon({
  className = 'size-3.5',
  alt = 'Lightning',
}: NetworkIconProps) {
  return (
    <img
      src="/icons/lightning/lightning.svg"
      alt={alt}
      className={cn('object-contain', className)}
    />
  )
}

export function SparkNetworkIcon({ className = 'size-3.5', alt = 'Spark' }: NetworkIconProps) {
  return (
    <img
      src="/icons/spark/Asterisk/Spark Asterisk White.svg"
      alt={alt}
      className={cn('kui-mono-icon object-contain', className)}
    />
  )
}

export function ArkadeNetworkIcon({
  className = 'size-3.5 rounded-sm',
  alt = 'Arkade',
}: NetworkIconProps) {
  return (
    <img
      src="/icons/arkade/arkade-icon.svg"
      alt={alt}
      className={cn('object-contain', className)}
    />
  )
}

export function NostrNetworkIcon({
  className = 'size-3.5',
  alt = 'Nostr',
}: NetworkIconProps) {
  return (
    <img
      src="/icons/nostr-icon.svg"
      alt={alt}
      className={cn('object-contain', className)}
    />
  )
}

/**
 * RGB logo. Unlike the other network icons (which reference host-app asset
 * paths), this renders the RGB mark bundled with the library (protocolIcons),
 * so consumers get the canonical logo without serving their own copy.
 */
export function RgbNetworkIcon({ className = 'size-3.5', alt = 'RGB' }: NetworkIconProps) {
  return <img src={protocolIcons['RGB20']} alt={alt} className={cn('object-contain', className)} />
}

/**
 * On-chain (Bitcoin L1) mark: three solid blocks joined by links — the chain
 * itself. The single source for every on-chain glyph (NetworkBadge, filters,
 * deposit rows, balance rows). Orange by default; `inherit` draws it in the
 * surrounding text colour instead (e.g. on a filled active pill).
 */
export function OnchainNetworkIcon({
  className = 'size-3.5',
  inherit = false,
}: {
  className?: string
  inherit?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      width="1em"
      height="1em"
      className={cn('inline-block shrink-0', className)}
      style={inherit ? undefined : { color: 'var(--color-network-bitcoin)' }}
    >
      <rect x="2" y="2" width="8" height="8" rx="2" stroke="none" />
      <rect x="14" y="2" width="8" height="8" rx="2" stroke="none" />
      <rect x="14" y="14" width="8" height="8" rx="2" stroke="none" />
      <path d="M10 6h4M18 10v4" fill="none" />
    </svg>
  )
}

/**
 * Liquid Network mark. Like RgbNetworkIcon, renders the canonical Liquid logo
 * bundled with the library (protocolIcons), so every surface shows the official
 * mark rather than a placeholder — matching the extension's LiquidIcon.
 */
export function LiquidNetworkIcon({ className = 'size-3.5', alt = 'Liquid' }: NetworkIconProps) {
  return (
    <img src={protocolIcons.Liquid} alt={alt} className={cn('object-contain', className)} />
  )
}

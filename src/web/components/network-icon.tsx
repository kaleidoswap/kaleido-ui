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
      className={cn('object-contain', className)}
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

/**
 * RGB logo. Unlike the other network icons (which reference host-app asset
 * paths), this renders the RGB mark bundled with the library (protocolIcons),
 * so consumers get the canonical logo without serving their own copy.
 */
export function RgbNetworkIcon({ className = 'size-3.5', alt = 'RGB' }: NetworkIconProps) {
  return <img src={protocolIcons['RGB20']} alt={alt} className={cn('object-contain', className)} />
}

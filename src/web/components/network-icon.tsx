import { cn } from '../utils/cn'

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

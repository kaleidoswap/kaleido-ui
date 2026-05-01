import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface NetworkStatusChipProps {
  icon: ReactNode
  dotClassName?: string
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

export function NetworkStatusChip({
  icon,
  dotClassName,
  onClick,
  ariaLabel,
  className,
}: NetworkStatusChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-surface-card px-1.5 py-1 shadow-inner transition-all',
        'hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        className,
      )}
    >
      <span className="shrink-0">{icon}</span>
      {dotClassName && <span className={cn('size-2 rounded-full', dotClassName)} />}
    </button>
  )
}

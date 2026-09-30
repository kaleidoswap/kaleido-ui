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
        'inline-flex items-center gap-1.5 rounded-full bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card px-1.5 py-1 shadow-raised ring-1 ring-inset ring-secondary/25 transition-all duration-200',
        'hover:bg-accent hover:ring-secondary/50 hover:shadow-glow-violet-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
    >
      <span className="shrink-0">{icon}</span>
      {dotClassName && <span className={cn('size-2 rounded-full', dotClassName)} />}
    </button>
  )
}

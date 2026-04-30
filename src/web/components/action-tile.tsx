import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface ActionTileProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
  'data-testid'?: string
}

export function ActionTile({
  icon,
  label,
  onClick,
  disabled = false,
  className,
  ariaLabel,
  'data-testid': dataTestId,
}: ActionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      data-testid={dataTestId}
      className={cn(
        'group flex h-9 flex-1 items-center justify-start gap-2 overflow-hidden rounded-xl px-3',
        'bg-white/[0.07] text-foreground transition-all',
        'hover:bg-primary hover:text-background',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      <span className="flex shrink-0 items-center justify-center text-current leading-none [&_.material-symbols-outlined]:text-[18px] [&_.material-symbols-outlined]:leading-none">
        {icon}
      </span>
      <span className="text-[11px] font-semibold tracking-wide">{label}</span>
    </button>
  )
}

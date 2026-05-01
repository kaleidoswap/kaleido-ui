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
        'group flex h-10 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2.5',
        'bg-primary/15 text-primary transition-all',
        'hover:bg-primary/25 hover:brightness-115',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      <span className="flex shrink-0 items-center justify-center text-current leading-none [&_.material-symbols-outlined]:text-icon-lg [&_.material-symbols-outlined]:leading-none">
        {icon}
      </span>
      <span className="truncate text-tiny font-semibold tracking-wide">{label}</span>
    </button>
  )
}

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
        'group inline-flex h-10 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2.5',
        'bg-primary/15 text-primary transition-all',
        'hover:bg-primary/25 hover:brightness-115',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {/* Icon and label are both leading-none so they center on the same
          axis — no baseline wobble between the glyph box and the text. */}
      <span className="flex shrink-0 items-center justify-center text-current leading-none [&_.material-symbols-outlined]:text-icon-sm [&_.material-symbols-outlined]:leading-none [&_svg]:size-icon-sm">
        {icon}
      </span>
      {/* rem-based size (not the px `text-tiny` token) so the side-panel root
          font-size ladder scales the action labels with everything else. */}
      <span className="truncate text-xs font-bold leading-none tracking-wide">{label}</span>
    </button>
  )
}

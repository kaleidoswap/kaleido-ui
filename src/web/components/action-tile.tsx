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
        'group relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-2.5',
        'bg-foreground/8 text-foreground ring-1 ring-inset ring-foreground/10 shadow-raised transition-all duration-200 [&>span:nth-child(2)]:text-primary hover:[&>span:nth-child(2)]:text-primary-foreground',
        'hover:-translate-y-0.5 hover:text-primary-foreground hover:ring-transparent hover:shadow-glow-primary-soft',
        'active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {/* Green gradient fill revealed on hover: gradient classes cannot take a
          hover: variant, so the fill is a layer whose opacity the group toggles. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-primary bg-gradient-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      {/* Icon and label are both leading-none so they center on the same
          axis — no baseline wobble between the glyph box and the text. */}
      <span className="relative flex shrink-0 items-center justify-center text-current leading-none [&_svg]:size-icon-sm">
        {icon}
      </span>
      {/* rem-based size (not the px `text-tiny` token) so the side-panel root
          font-size ladder scales the action labels with everything else. */}
      <span className="relative truncate text-caption font-bold leading-none tracking-wide">{label}</span>
    </button>
  )
}

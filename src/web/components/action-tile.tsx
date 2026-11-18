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
  /** A destination rather than an action: the tile renders as a link. */
  href?: string
  target?: string
  rel?: string
  /**
   * Icon only, for a rail with no room for the label: the tile goes square,
   * and the label stays for assistive tech and becomes the tooltip.
   */
  hideLabel?: boolean
}

export function ActionTile({
  icon,
  label,
  onClick,
  disabled = false,
  className,
  ariaLabel,
  'data-testid': dataTestId,
  href,
  target,
  rel,
  hideLabel = false,
}: ActionTileProps) {
  const classes = cn(
    'group relative inline-flex h-10 items-center justify-center gap-1.5 overflow-hidden rounded-xl',
    hideLabel ? 'w-10 shrink-0' : 'flex-1 px-2.5',
    // Icon and label stay the brand green; hover and press only tint the fill
    // toward violet, so the tile never floods with colour.
    'bg-foreground/8 bg-gradient-surface text-brand shadow-raised transition-all duration-200',
    // On light, a neutral grey that leans slightly violet toward the bottom
    // right: the ink at low alpha under a faint secondary wash. Important: the
    // dark surface gradient class is unlayered and would win otherwise.
    '[.light_&]:bg-foreground/[0.05] [.light_&]:!bg-gradient-to-br [.light_&]:from-transparent [.light_&]:to-secondary/[0.08]',
    'hover:bg-secondary/[0.2] [.light_&]:hover:bg-secondary/[0.14]',
    'active:bg-secondary/[0.28] [.light_&]:active:bg-secondary/[0.2] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    // A link has no disabled state of its own.
    href && disabled && 'pointer-events-none opacity-50',
    className
  )

  const content = (
    <>
      {/* Icon and label are both leading-none so they center on the same
          axis — no baseline wobble between the glyph box and the text. */}
      <span className="relative flex shrink-0 items-center justify-center text-current leading-none [&_svg]:size-icon-sm">
        {icon}
      </span>
      {/* rem-based size (not the px `text-tiny` token) so the side-panel root
          font-size ladder scales the action labels with everything else. */}
      <span className={cn('relative truncate text-caption font-bold leading-none tracking-wide', hideLabel && 'sr-only')}>
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        aria-disabled={disabled || undefined}
        title={hideLabel ? label : undefined}
        data-testid={dataTestId}
        className={classes}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      title={hideLabel ? label : undefined}
      data-testid={dataTestId}
      className={classes}
    >
      {content}
    </button>
  )
}

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
    // Icon and label are both the brand green, and flip together to the
    // ink on green when the hover fill shows.
    'bg-foreground/8 text-brand ring-1 ring-inset ring-foreground/10 shadow-raised transition-all duration-200',
    // On light, a lighter fill with a violet cast instead of the ink grey.
    '[.light_&]:bg-[rgb(84_76_140/0.07)] [.light_&]:ring-[rgb(84_76_140/0.14)]',
    'hover:-translate-y-0.5 hover:text-primary-foreground hover:ring-transparent hover:shadow-glow-primary-soft',
    'active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
    // A link has no disabled state of its own.
    href && disabled && 'pointer-events-none opacity-50',
    className
  )

  const content = (
    <>
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

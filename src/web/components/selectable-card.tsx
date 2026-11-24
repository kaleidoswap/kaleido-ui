import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface SelectableCardProps {
  selected?: boolean
  onClick?: () => void
  title: ReactNode
  description?: ReactNode
  badge?: ReactNode
  preview?: ReactNode
  indicator?: boolean
  children?: ReactNode
  /** A glyph or logo tile before the title. */
  icon?: ReactNode
  /** Cannot be picked now; stays visible, dimmed. */
  disabled?: boolean
  'data-testid'?: string
  className?: string
}

export function SelectableCard({
  selected,
  onClick,
  title,
  description,
  badge,
  preview,
  indicator = true,
  children,
  icon,
  disabled = false,
  'data-testid': testId,
  className,
}: SelectableCardProps) {
  const content = (
    <span className="flex items-start justify-between gap-3">
      <span className="flex min-w-0 flex-1 items-start gap-3">
        {indicator && (
          <span
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              selected
                ? 'border-primary bg-primary bg-gradient-primary shadow-glow-primary-soft'
                : 'border-secondary/40',
            )}
          >
            {selected && <span className="size-2 rounded-full bg-white" />}
          </span>
        )}
        {icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-content">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-body font-bold text-foreground">{title}</span>
            {badge}
          </span>
          {description && (
            <span className="mt-0.5 block text-caption leading-relaxed text-muted-foreground">{description}</span>
          )}
          {children}
        </span>
      </span>
      {preview && <span className="shrink-0 text-right">{preview}</span>}
    </span>
  )

  const cardClassName = cn(
    'w-full rounded-2xl border border-transparent bg-card p-4 text-left transition-all duration-200',
    selected
      ? 'bg-gradient-active ring-1 ring-inset ring-primary/40 shadow-glow-primary-soft'
      : cn('bg-gradient-card shadow-card', onClick && 'hover:-translate-y-0.5 hover:shadow-card-hover'),
    onClick && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50',
    className,
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        data-testid={testId}
        className={cardClassName}
      >
        {content}
      </button>
    )
  }

  return (
    <div data-testid={testId} className={cardClassName}>
      {content}
    </div>
  )
}

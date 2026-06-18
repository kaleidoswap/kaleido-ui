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
  className,
}: SelectableCardProps) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {indicator && (
          <div
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              selected ? 'border-primary bg-primary' : 'border-white/20',
            )}
          >
            {selected && <div className="size-2 rounded-full bg-background" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body font-bold text-foreground">{title}</span>
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      </div>
      {preview && <div className="shrink-0 text-right">{preview}</div>}
    </div>
  )

  const cardClassName = cn(
    'w-full rounded-2xl border p-4 text-left transition-all duration-200',
    selected ? 'border-primary/40 bg-primary/10 shadow-sm' : 'border-border bg-card hover:bg-accent',
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardClassName}>
        {content}
      </button>
    )
  }

  return <div className={cardClassName}>{content}</div>
}

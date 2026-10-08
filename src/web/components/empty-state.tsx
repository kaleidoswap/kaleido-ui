import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface EmptyStateProps {
  /** What is empty, said plainly: "No swaps in this range". */
  title: ReactNode
  /** What to do about it, or why it is empty. */
  description?: ReactNode
  /** One way forward: a button, a link. */
  action?: ReactNode
  /** A glyph in a soft circle above the title. */
  icon?: ReactNode
  className?: string
  /** Kept so a consumer can match an older surface; prefer the default. */
  descriptionClassName?: string
}

/**
 * An empty list or surface, centred: an optional glyph, a title, an optional
 * description and one optional action. Generalised from `ActivityList`'s
 * empty state, which now renders through it.
 */
export function EmptyState({ title, description, action, icon, className, descriptionClassName }: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/15 text-secondary-content shadow-glow-violet-soft"
        >
          {icon}
        </div>
      )}
      <h3 className="m-0 mb-1 text-body font-semibold text-foreground">{title}</h3>
      {description && (
        <p className={cn('m-0 mb-4 max-w-[240px] text-caption text-muted-foreground', descriptionClassName)}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

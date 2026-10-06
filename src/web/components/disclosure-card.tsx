import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../primitives/collapsible'

export interface DisclosureCardProps {
  title: ReactNode
  children: ReactNode
  /** Controlled open state. Leave out (with `onOpenChange`) and it runs itself. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  icon?: ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

/**
 * A card-styled `Collapsible`: one inset box that holds both the trigger row
 * and, when open, the body under it — the text never leaves the box. The
 * trigger reports `aria-expanded` and points at the body with `aria-controls`.
 */
export function DisclosureCard({
  title,
  children,
  open,
  onOpenChange,
  defaultOpen,
  icon,
  className,
  triggerClassName,
  contentClassName,
}: DisclosureCardProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      data-slot="disclosure-card"
      className={cn(
        'group/disclosure overflow-hidden rounded-xl bg-surface-inset/40 shadow-raised transition-all',
        'data-[state=open]:ring-1 data-[state=open]:ring-inset data-[state=open]:ring-secondary/30',
        className,
      )}
    >
      <CollapsibleTrigger
        type="button"
        className={cn(
          'flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover-gradient-violet focus-visible:ring-inset',
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {icon}
          <span className="truncate text-caption font-bold text-foreground">{title}</span>
        </span>
        <CollapsibleChevron />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn('px-3 pb-3 pt-1', contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

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
  open: boolean
  onOpenChange: (open: boolean) => void
  icon?: ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

/**
 * A card-styled `Collapsible`: a muted trigger row and a muted body. Its open
 * state stays controlled, as it always was; the trigger now also reports
 * `aria-expanded` and points at the body with `aria-controls`.
 */
export function DisclosureCard({
  title,
  children,
  open,
  onOpenChange,
  icon,
  className,
  triggerClassName,
  contentClassName,
}: DisclosureCardProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className={className}>
      <CollapsibleTrigger
        type="button"
        className={cn(
          'flex w-full items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-left shadow-raised transition-all hover:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft',
          open && 'bg-secondary/10 ring-1 ring-inset ring-secondary/30',
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {icon}
          <span className="truncate text-caption font-bold text-foreground">{title}</span>
        </span>
        <CollapsibleChevron />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn('mt-3 rounded-xl bg-muted/40 px-3 py-3', contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

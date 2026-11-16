import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../primitives/collapsible'

export interface BasicCollapsibleProps {
  title: ReactNode
  children: ReactNode
  /** Controlled open state. Leave out (with `onOpenChange`) and it runs itself. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

/**
 * The plain `Collapsible`, styled: a boxless row — a caption-size title and the
 * turning chevron — that opens a section of caption text under it. It draws no
 * surface of its own, so it sits inside a card or form that already exists
 * (advanced settings, a note). For a block of its own, use `DisclosureCard`.
 */
export function BasicCollapsible({
  title,
  children,
  open,
  onOpenChange,
  defaultOpen,
  className,
  triggerClassName,
  contentClassName,
}: BasicCollapsibleProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      data-slot="basic-collapsible"
      className={className}
    >
      <CollapsibleTrigger
        type="button"
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-caption font-semibold text-foreground hover-gradient-violet focus-visible:ring-inset',
          triggerClassName,
        )}
      >
        {title}
        <CollapsibleChevron />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn('px-2 pb-2 pt-1 text-caption text-muted-foreground', contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

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
 * The plain `Collapsible`, styled: a compact inset row — a caption-size title
 * and the turning chevron — that opens a section of caption text under it.
 * For a lighter disclosure than `DisclosureCard` (advanced settings, a note).
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
      className={cn('overflow-hidden rounded-xl bg-surface-inset/40 shadow-raised', className)}
    >
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center justify-between px-3 py-2 text-caption font-semibold text-foreground hover-gradient-violet focus-visible:ring-inset',
          triggerClassName,
        )}
      >
        {title}
        <CollapsibleChevron />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn('px-3 pb-3 pt-1 text-caption text-muted-foreground', contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

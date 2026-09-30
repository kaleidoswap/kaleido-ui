import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { Icon } from './icon'
import { cn } from '../utils/cn'

/**
 * A button that opens and closes a section. Radix Collapsible underneath:
 * `open` / `defaultOpen` / `onOpenChange` work controlled or not, and the
 * trigger carries `aria-expanded` and `aria-controls` pointing at the content.
 *
 * The base for navigation submenus, expandable lists and filter panels. Put
 * `CollapsibleChevron` inside the trigger for the turning chevron.
 */
const Collapsible = CollapsiblePrimitive.Root

export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    data-slot="collapsible-trigger"
    className={cn('group/collapsible focus:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    {...props}
  />
))
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName

export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    data-slot="collapsible-content"
    className={cn('data-[state=open]:animate-fade-in motion-reduce:animate-none', className)}
    {...props}
  />
))
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

/**
 * The chevron that turns with the trigger's state: pointing down when closed,
 * up when open. Decorative; the trigger's `aria-expanded` carries the state.
 */
function CollapsibleChevron({ className }: { className?: string }) {
  return (
    <Icon
      name="expand_more"
      aria-hidden="true"
      className={cn(
        'shrink-0 text-icon-md text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none',
        className,
      )}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleChevron }

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../utils/cn'

/**
 * A panel anchored to a trigger, for content that is not a menu: a note, a
 * few buttons, a copy control. Tab walks everything inside in order. Radix
 * Popover underneath, so Escape and a click outside close it and focus goes
 * back to the trigger. A list of actions is a `DropdownMenu`, not this.
 */
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverClose = PopoverPrimitive.Close

/**
 * The floating surface shared by Popover and DropdownMenu: a glass fill (the
 * popover colour at 50% under the hero card light, blurred and saturated), the
 * floating shadow (the popover shadow without its hairline: no edge line), and
 * the same fade + 0.98 zoom as Dialog and Select.
 */
export const floatingSurface =
  'z-50 rounded-2xl bg-popover/50 bg-gradient-card-hero backdrop-blur-xl backdrop-saturate-150 text-popover-foreground shadow-floating outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:zoom-out-[0.98] motion-reduce:animate-none'

export type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ className, align = 'center', sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(floatingSurface, 'w-72 max-w-[calc(100vw-2rem)] p-4 text-caption', className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverAnchor, PopoverClose, PopoverContent }

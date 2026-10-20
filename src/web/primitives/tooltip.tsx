import * as React from 'react'
import { cn } from '../utils/cn'

export type TooltipPlacement = 'top' | 'bottom' | 'right'

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  right: 'left-full top-1/2 ml-3 -translate-y-1/2',
}

export interface TooltipBubbleProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The `id` the described control points at with `aria-describedby`. */
  id: string
  placement?: TooltipPlacement
}

/**
 * The bubble alone, for a trigger that wires `aria-describedby` itself. It is
 * shown while its `group/tooltip` ancestor is hovered or holds focus.
 */
const TooltipBubble = React.forwardRef<HTMLSpanElement, TooltipBubbleProps>(
  ({ id, placement = 'bottom', className, children, ...props }, ref) => (
    <span
      ref={ref}
      id={id}
      role="tooltip"
      data-slot="tooltip"
      className={cn(
        'pointer-events-none absolute z-50 hidden w-max max-w-[16rem] rounded-lg bg-popover px-3 py-2 text-caption font-normal normal-case tracking-normal text-popover-foreground shadow-popover',
        'group-hover/tooltip:block group-focus-within/tooltip:block',
        placementClasses[placement],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
)
TooltipBubble.displayName = 'TooltipBubble'

export interface TooltipProps {
  /** What the tooltip says. A short sentence: it is a description, not a label. */
  content: React.ReactNode
  /** One focusable element. It gets `aria-describedby` pointing at the tooltip. */
  children: React.ReactElement
  placement?: TooltipPlacement
  /** Classes for the wrapper, which is `relative inline-flex`. */
  className?: string
  bubbleClassName?: string
}

/**
 * A short description of a control, shown on hover and on keyboard focus.
 *
 * Pure CSS: the bubble is always in the document, hidden until its wrapper is
 * hovered or holds focus, so it needs no portal or timer and reads the same in
 * a test as in a browser. The control describes itself with it
 * (`aria-describedby`), so a screen reader hears it after the control's name.
 * It is not a place for the control's name: an icon-only button still needs
 * its own `aria-label`.
 */
function Tooltip({ content, children, placement = 'bottom', className, bubbleClassName }: TooltipProps) {
  const id = React.useId()
  const childProps = children.props as { 'aria-describedby'?: string }
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {React.cloneElement(children, {
        'aria-describedby': cn(childProps['aria-describedby'], id),
      } as Record<string, unknown>)}
      <TooltipBubble id={id} placement={placement} className={bubbleClassName}>
        {content}
      </TooltipBubble>
    </span>
  )
}
Tooltip.displayName = 'Tooltip'

export { Tooltip, TooltipBubble }

import * as React from 'react'
import { cn } from '../utils/cn'

export type TooltipPlacement = 'top' | 'bottom' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
  right: 'left-full top-1/2 ml-3 -translate-y-1/2',
  // Aligned to one edge of the trigger, for a trigger near the side of the screen.
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  'bottom-start': 'left-0 top-full mt-2',
  'bottom-end': 'right-0 top-full mt-2',
}

export interface TooltipBubbleProps extends React.HTMLAttributes<HTMLElement> {
  /** The `id` the described control points at with `aria-describedby`. */
  id: string
  placement?: TooltipPlacement
  /** Render as a `div`, for a bubble holding block content (a small panel of rows). */
  block?: boolean
}

/**
 * The bubble alone, for a trigger that wires `aria-describedby` itself. It is
 * shown while its `group/tooltip` ancestor is hovered or holds keyboard focus.
 */
const TooltipBubble = React.forwardRef<HTMLElement, TooltipBubbleProps>(
  ({ id, placement = 'bottom', block = false, className, children, ...props }, ref) =>
    React.createElement(
      block ? 'div' : 'span',
      {
        ref,
        id,
        role: 'tooltip',
        'data-slot': 'tooltip',
        className: cn(
          'pointer-events-none absolute z-50 hidden w-max max-w-[16rem] rounded-lg bg-popover bg-gradient-floating px-3 py-2 text-caption font-normal normal-case tracking-normal text-popover-foreground shadow-floating',
          // Hover, or keyboard focus only: a mouse click focuses the trigger too,
          // and the bubble must not stay pinned after the pointer leaves. The
          // hover is the plain :hover state, not Tailwind's hover variant, which
          // only applies on devices whose primary pointer can hover.
          'group-[:hover]/tooltip:block group-has-[:focus-visible]/tooltip:block',
          placementClasses[placement],
          className
        ),
        ...props,
      },
      children
    )
)
TooltipBubble.displayName = 'TooltipBubble'

export interface TooltipProps {
  /** What the tooltip says. A short sentence: it is a description, not a label. */
  content: React.ReactNode
  /** One focusable element. It gets `aria-describedby` pointing at the tooltip. */
  children: React.ReactElement
  placement?: TooltipPlacement
  /** Wrapper and bubble as `div`s, for content with blocks in it (rows, a list). */
  block?: boolean
  /** Classes for the wrapper, which is `relative inline-flex`. */
  className?: string
  bubbleClassName?: string
}

/**
 * A short description of a control, shown on hover and on keyboard focus
 * (`:focus-visible`), not after a mouse click.
 *
 * Pure CSS: the bubble is always in the document, hidden until its wrapper is
 * hovered or holds keyboard focus, so it needs no portal or timer and reads the same in
 * a test as in a browser. The control describes itself with it
 * (`aria-describedby`), so a screen reader hears it after the control's name.
 * It is not a place for the control's name: an icon-only button still needs
 * its own `aria-label`.
 */
function Tooltip({ content, children, placement = 'bottom', block = false, className, bubbleClassName }: TooltipProps) {
  const id = React.useId()
  const childProps = children.props as { 'aria-describedby'?: string }
  return React.createElement(
    block ? 'div' : 'span',
    { className: cn('group/tooltip relative inline-flex', className) },
    React.cloneElement(children, {
      'aria-describedby': cn(childProps['aria-describedby'], id),
    } as Record<string, unknown>),
    <TooltipBubble id={id} placement={placement} block={block} className={bubbleClassName}>
      {content}
    </TooltipBubble>
  )
}
Tooltip.displayName = 'Tooltip'

export { Tooltip, TooltipBubble }

import { cloneElement, useId, type MouseEvent, type ReactElement } from 'react'
import { TooltipBubble, type TooltipPlacement } from '../primitives/tooltip'
import { cn } from '../utils/cn'

export interface RestrictedProps {
  /**
   * Why the reader cannot use the control: "Only an admin can invite
   * members." With no reason the control is rendered untouched.
   */
  reason: string | null | undefined
  /** One control: a button or a link. */
  children: ReactElement<{ className?: string; onClick?: (event: MouseEvent) => void }>
  placement?: TooltipPlacement
  className?: string
}

/**
 * A control the reader may not use, shown rather than hidden, with the reason
 * one hover or one Tab away.
 *
 * Hidden, the control leaves the reader believing the thing cannot be done at
 * all. Disabled with `disabled`, it leaves the tab order, so the reason could
 * only be read with a pointer. So it stays focusable, says `aria-disabled`,
 * swallows its own activation, and points at the reason with
 * `aria-describedby`; the reason shows on hover and on focus.
 */
export function Restricted({ reason, children, placement = 'bottom', className }: RestrictedProps) {
  const id = useId()
  if (!reason) return children
  return (
    <span data-slot="restricted" className={cn('group/tooltip relative inline-flex', className)}>
      {cloneElement(children, {
        'aria-disabled': true,
        'aria-describedby': id,
        className: cn(children.props.className, 'cursor-not-allowed opacity-50'),
        // Activation does nothing: no dialog opens and no form submits.
        onClick: (event: MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
        },
      } as Record<string, unknown>)}
      <TooltipBubble id={id} placement={placement}>
        {reason}
      </TooltipBubble>
    </span>
  )
}

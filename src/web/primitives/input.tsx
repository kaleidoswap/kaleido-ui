import * as React from 'react'
import { cn } from '../utils/cn'
import { fieldShell, fieldSurface } from '../utils/field-styles'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Inside the field, before the typed text: a currency sign, "https://". */
  prefix?: React.ReactNode
  /** Inside the field, after the typed text: a unit ("%", "bps", "sat"). */
  suffix?: React.ReactNode
}

/**
 * A text field. With `prefix` or `suffix` the field becomes a box holding the
 * input and its unit side by side, so typed text stops short of the unit
 * rather than running under it. The unit is muted text, read after the value
 * (it joins the input's `aria-describedby`), and a click on it focuses the
 * input. `className` then styles the box; the ref is always the input.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const slotId = React.useId()
    const hasPrefix = prefix !== undefined && prefix !== null && prefix !== false
    const hasSuffix = suffix !== undefined && suffix !== null && suffix !== false

    if (!hasPrefix && !hasSuffix) {
      return (
        <input
          type={type}
          className={cn(
            'flex h-12 w-full px-4 py-3 text-body file:border-0 file:bg-transparent file:text-caption file:font-medium',
            fieldSurface,
            className
          )}
          ref={ref}
          {...props}
        />
      )
    }

    const setRef = (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }
    const describedBy =
      [props['aria-describedby'], hasPrefix && `${slotId}-prefix`, hasSuffix && `${slotId}-suffix`]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div
        data-slot="input-field"
        className={cn('flex h-12 w-full items-center gap-2 px-4 text-body', fieldShell, className)}
        // The unit is part of the field: pressing it focuses the input.
        onPointerDown={(event) => {
          if (event.target === inputRef.current || props.disabled) return
          event.preventDefault()
          inputRef.current?.focus()
        }}
      >
        {hasPrefix && (
          <span id={`${slotId}-prefix`} data-slot="input-prefix" className="shrink-0 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className="h-full min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          ref={setRef}
          {...props}
          aria-describedby={describedBy}
        />
        {hasSuffix && (
          <span id={`${slotId}-suffix`} data-slot="input-suffix" className="shrink-0 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }

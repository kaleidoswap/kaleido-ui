import { Icon } from './icon'
import * as React from 'react'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min, max, step = 1, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? inputRef

    const nudge = (direction: 1 | -1) => {
      const el = resolvedRef.current
      if (!el) return
      const current = parseFloat(el.value) || 0
      const next = current + direction * Number(step)
      const clamped =
        min !== undefined ? Math.max(Number(min), next) : next
      const final =
        max !== undefined ? Math.min(Number(max), clamped) : clamped
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
      nativeInputValueSetter?.call(el, String(final))
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }

    return (
      <div className="relative w-full">
        <input
          ref={resolvedRef}
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'flex h-12 w-full px-4 py-3 pr-10 text-body',
            fieldSurface,
            '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
            className
          )}
          {...props}
        />
        {!disabled && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => nudge(1)}
              className="flex items-center justify-center h-4 w-5 rounded text-muted-foreground hover-gradient-violet hover:text-secondary-content transition-colors"
            >
              <Icon name="keyboard_arrow_up" className="text-icon-sm" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => nudge(-1)}
              className="flex items-center justify-center h-4 w-5 rounded text-muted-foreground hover-gradient-violet hover:text-secondary-content transition-colors"
            >
              <Icon name="keyboard_arrow_down" className="text-icon-sm" />
            </button>
          </div>
        )}
      </div>
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }

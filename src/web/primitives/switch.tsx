import * as React from 'react'
import { cn } from '../utils/cn'

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /**
   * How the control is named. A `role="switch"` with no accessible name is
   * unreachable by name for screen readers and for tests, so callers that
   * render their own visible label (`SwitchRow`) pass it here.
   */
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  id?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      className,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-white/10',
          className
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full shadow-sm transition-all duration-200',
            checked ? 'translate-x-6 bg-white' : 'translate-x-1 bg-primary'
          )}
        />
      </button>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }

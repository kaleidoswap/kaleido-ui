import * as React from 'react'
import { Check } from '../icons/outlined'
import { cn } from '../utils/cn'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Called with the new state; the native change event is still available via `onChange`. */
  onCheckedChange?: (checked: boolean) => void
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

/**
 * A checkbox for consent and opt-in choices ("I have written down my
 * recovery phrase", "include logs"). It is a real `<input type="checkbox">`,
 * so labels, forms and keyboard work natively; only its box is drawn by the
 * library. For a setting that takes effect at once use `Switch` instead.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => (
    <span className={cn('relative inline-flex size-5 shrink-0', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 m-0 size-full cursor-pointer appearance-none rounded-md bg-card/55 shadow-inner ring-1 ring-inset ring-field-edge transition-all hover:ring-field-edge-hover checked:bg-primary checked:bg-gradient-primary checked:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(event) => {
          onChange?.(event)
          onCheckedChange?.(event.target.checked)
        }}
        {...props}
      />
      <Check
        aria-hidden="true"
        width="1em"
        height="1em"
        className="pointer-events-none relative m-auto text-icon-sm text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  ),
)
Checkbox.displayName = 'Checkbox'

export interface CheckboxRowProps extends Omit<CheckboxProps, 'children'> {
  label: React.ReactNode
  description?: React.ReactNode
}

/**
 * A checkbox with its label and an optional description, the whole row
 * clickable. The opt-in counterpart of `SwitchRow`: same row surface, a box
 * on the left instead of a switch on the right.
 */
function CheckboxRow({ label, description, className, id, ...props }: CheckboxRowProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl bg-muted/40 p-3 shadow-raised transition-colors hover-gradient-violet has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60',
        className,
      )}
    >
      <Checkbox id={inputId} className="mt-px" {...props} />
      <span className="min-w-0">
        <span className="block text-body font-medium text-foreground">{label}</span>
        {description && (
          <span className="mt-0.5 block text-caption leading-snug text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  )
}

export { Checkbox, CheckboxRow }

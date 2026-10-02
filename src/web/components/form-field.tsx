import * as React from 'react'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'

export interface FormFieldProps {
  /** The visible label. */
  label: React.ReactNode
  /**
   * The control: an `Input`, a `Select` trigger, a textarea. It receives `id`,
   * `aria-describedby` and, with an error, `aria-invalid` — its own values
   * for those are kept and merged.
   */
  children: React.ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean | 'true' | 'false'
  }>
  /** The control's id. Generated when left out. */
  id?: string
  /** A line under the control that helps fill it. */
  hint?: React.ReactNode
  /** What is wrong with the value. Sets `aria-invalid` on the control and is announced. */
  error?: React.ReactNode
  className?: string
}

/**
 * A label, its control and an optional hint or error, wired together: the
 * label points at the control (`htmlFor` / `id`), the hint and the error are
 * attached with `aria-describedby`, and an error marks the control
 * `aria-invalid` and is announced as an alert.
 */
export function FormField({ label, children, id: idProp, hint, error, className }: FormFieldProps) {
  const generated = React.useId()
  const id = idProp ?? children.props.id ?? `field-${generated.replace(/:/g, '')}`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy =
    [children.props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined

  const control = React.cloneElement(children, {
    id,
    'aria-describedby': describedBy,
    ...(error ? { 'aria-invalid': true } : {}),
  })

  return (
    <div data-slot="form-field" className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {hint && (
        <p id={hintId} className="m-0 text-caption text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="m-0 text-caption text-danger-fg">
          {error}
        </p>
      )}
    </div>
  )
}

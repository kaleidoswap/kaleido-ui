import * as React from 'react'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * A multi-line text field on the same surface as `Input`: the rounded glass
 * field, its inset ring and focus ring. Grows with `rows`; resizes vertically
 * only, so it never pushes the layout sideways.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn('flex min-h-24 w-full resize-y px-4 py-3 text-body', fieldSurface, className)}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }

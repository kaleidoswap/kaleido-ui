import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

/**
 * A field's label: the eyebrow in violet (`secondary-content`), as the wallet's
 * own fields label themselves (DESTINATION, AMOUNT). One style for every field —
 * a form's, a wallet flow's — with a hair of room before the box under it.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'mb-1 inline-block leading-none',
      eyebrow,
      'text-secondary-content peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

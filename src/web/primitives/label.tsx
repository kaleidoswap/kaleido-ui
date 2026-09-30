import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

// The field label is the eyebrow in violet, as the wallet's own fields label
// themselves (DESTINATION, AMOUNT), set a hair in from the field's edge.
const labelVariants = cva(
  `ml-1 ${eyebrow} leading-none text-secondary-content peer-disabled:cursor-not-allowed peer-disabled:opacity-70`
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

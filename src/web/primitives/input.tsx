import * as React from 'react'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
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
)
Input.displayName = 'Input'

export { Input }

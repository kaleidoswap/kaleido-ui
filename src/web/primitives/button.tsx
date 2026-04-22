import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glow: 'bg-primary text-primary-foreground shadow-md',
        surface: 'bg-card text-card-foreground border border-border hover:bg-accent',
        cta: 'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        'cta-gradient': 'w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-extrabold rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:opacity-100 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:bg-accent disabled:text-muted-foreground',
        'danger-subtle': 'w-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base font-bold',
        xl: 'h-16 rounded-2xl px-10 text-lg font-bold',
        cta: 'h-14 py-4 px-6 text-lg',
        'cta-lg': 'h-[60px] py-5 px-6 text-lg',
        icon: 'h-10 w-10 rounded-full',
        'icon-lg': 'h-12 w-12 rounded-full',
        'icon-xl': 'h-14 w-14 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

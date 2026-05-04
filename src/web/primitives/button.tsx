import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:brightness-115',
        destructive: 'bg-destructive text-destructive-foreground hover:brightness-115',
        outline: 'border border-primary/50 bg-transparent text-primary hover:bg-primary/5 hover:border-primary hover:brightness-115',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-primary hover:bg-primary/10 hover:brightness-115 hover:[&_span]:brightness-115 active:bg-primary/15 active:brightness-100',
        link: 'text-primary underline-offset-4 hover:underline',
        glow: 'bg-primary text-primary-foreground shadow-md',
        surface: 'bg-primary/15 text-primary hover:bg-primary/25',
        cta: 'w-full bg-primary text-primary-foreground font-bold rounded-2xl shadow-md hover:brightness-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        'cta-gradient': 'w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-extrabold rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:opacity-100 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:bg-accent disabled:text-muted-foreground',
        'danger-subtle': 'bg-danger/10 border border-danger/20 text-danger font-bold rounded-xl hover:brightness-115',
        hyperlink: 'group text-muted-foreground underline underline-offset-2 hover:text-white hover:decoration-primary hover:[&_.icon]:text-primary bg-transparent font-normal',
        // Hierarchy variants — primary/secondary/tertiary action emphasis.
        // Pair with size="lg" or size="cta" for full-bleed buttons.
        h1: 'w-full bg-primary text-primary-foreground font-bold rounded-2xl shadow-md hover:brightness-115 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        h2: 'w-full bg-primary/15 text-primary font-semibold rounded-xl border border-primary/20 hover:bg-primary/25 hover:border-primary/35',
        h3: 'text-primary font-semibold rounded-lg hover:bg-primary/10 active:bg-primary/15',
      },
      size: {
        default: 'h-11 px-5 py-2',
        xs: 'h-7 rounded-lg px-2 text-xs',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-14 rounded-xl px-8 text-base font-bold',
        xl: 'h-16 rounded-2xl px-10 text-lg font-bold',
        cta: 'h-14 py-4 px-6 text-lg',
        'cta-lg': 'h-[60px] py-5 px-6 text-lg',
        icon: 'h-6 w-6 rounded-full',
        'icon-lg': 'h-9 w-9 rounded-full',
        'icon-xl': 'h-12 w-12 rounded-full',
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

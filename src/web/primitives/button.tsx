import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-caption font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary hover:brightness-110 hover:shadow-button-primary-hover disabled:shadow-none',
        destructive: 'bg-destructive bg-gradient-destructive text-white shadow-raised hover:brightness-110',
        outline: 'border border-primary/50 bg-transparent text-brand hover:bg-primary/5 hover:border-primary hover:shadow-button-outline-hover hover:brightness-115',
        secondary: 'bg-secondary bg-gradient-violet text-secondary-foreground shadow-button-violet hover:brightness-110 hover:shadow-glow-violet disabled:shadow-none',
        ghost: 'text-brand hover:bg-primary/10 hover:brightness-115 hover:[&_span]:brightness-115 active:bg-primary/15 active:brightness-100',
        link: 'text-brand underline-offset-4 hover:underline',
        glow: 'bg-primary bg-gradient-primary text-primary-foreground shadow-glow-primary hover:shadow-glow-primary-strong',
        surface: 'bg-secondary/15 bg-gradient-surface text-secondary-content hover-gradient-violet hover:shadow-button-surface-hover',
        cta: 'w-full bg-primary bg-gradient-primary text-primary-foreground font-bold rounded-2xl shadow-button-primary hover:brightness-110 hover:shadow-button-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        'cta-gradient': 'w-full bg-secondary bg-gradient-brand-dark text-white font-extrabold rounded-2xl shadow-glow-brand hover:brightness-115 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed',
        'danger-subtle': 'bg-danger/10 text-danger-fg font-bold rounded-xl hover:bg-danger/15 hover:brightness-115',
        // danger-subtle without its resting tint: the danger glyph alone, tinted on hover.
        'danger-quiet': 'text-danger-fg hover:bg-danger/10 active:bg-danger/15',
        hyperlink: 'group text-muted-foreground underline underline-offset-2 hover:text-foreground hover:decoration-primary hover:[&_.icon]:text-brand bg-transparent font-normal',
        // Hierarchy variants — primary/secondary/tertiary action emphasis.
        // Pair with size="lg" or size="cta" for full-bleed buttons.
        h1: 'w-full bg-primary bg-gradient-primary text-primary-foreground font-bold rounded-2xl shadow-button-primary hover:brightness-110 hover:shadow-button-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        h2: 'w-full bg-secondary/15 bg-gradient-surface text-secondary-content font-semibold rounded-xl hover-gradient-violet hover:shadow-button-surface-hover',
        h3: 'text-brand font-semibold rounded-lg hover:bg-primary/10 active:bg-primary/15',
        // The icon-only default: a muted glyph that turns violet on the violet hover.
        quiet: 'text-muted-foreground hover-gradient-violet hover:text-secondary-content',
      },
      size: {
        default: 'h-11 px-5 py-2',
        xs: 'h-7 rounded-lg px-2 text-caption',
        sm: 'h-9 rounded-lg px-3 text-caption',
        lg: 'h-14 rounded-xl px-8 text-body font-bold',
        xl: 'h-16 rounded-2xl px-10 text-subhead font-bold',
        cta: 'h-14 py-4 px-6 text-subhead',
        'cta-lg': 'h-[60px] py-5 px-6 text-subhead',
        // Icon-only: a square that sizes its own glyph, so callers pass a bare <Icon>.
        // sm 32 / md 40 / lg 50 px (7 / 9 / 11 spacing steps) — inline row actions, toolbar and close, headers.
        'icon-sm': 'size-7 rounded-lg p-0 [&_svg]:text-icon-md',
        icon: 'size-9 rounded-xl p-0 [&_svg]:text-icon-lg',
        'icon-lg': 'size-11 rounded-xl p-0 [&_svg]:text-icon-xl',
        /** @deprecated The icon steps stop at `icon-lg`; this is the same size. */
        'icon-xl': 'size-11 rounded-xl p-0 [&_svg]:text-icon-xl',
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

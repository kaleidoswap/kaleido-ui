import * as React from 'react'
import { cn } from '../utils/cn'

/**
 * The two card surfaces. `primary` is the glass card: blurred fill, gradient,
 * drop shadow and the glass edge kaleido-ui/css rings every `.shadow-card`
 * with. `secondary` is the same card without that edge, for one that sits
 * next to a primary card and ranks under it — a quote under the swap form,
 * details under a summary. Exported for surfaces that are not a `Card`.
 */
export const cardSurface = {
  primary: 'rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card',
  secondary: 'rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card-secondary',
} as const

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardSurface
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <div
      ref={ref}
      data-variant={variant}
      className={cn(
        cardSurface[variant],
        // A column, so CardFooter can sit on the bottom edge when the card is
        // taller than its content (a grid row of cards stretches them all).
        'flex flex-col text-card-foreground transition-[color,background-color,box-shadow] duration-300',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-title font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-caption text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    // mt-auto: the card's actions stay on its bottom edge, however tall it is.
    <div ref={ref} className={cn('mt-auto flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

import * as React from 'react'
import { Button, type ButtonProps } from './button'
import { Icon, type IconName } from './icon'
import { cn } from '../utils/cn'

const sizes = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const

export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'variant' | 'children' | 'aria-label'> {
  /** What the button does. It is the accessible name and the tooltip; an icon alone names nothing. */
  label: string
  /** The glyph, by name — or an element for a glyph that changes (a copy check, a spinner). */
  icon: IconName | React.ReactElement
  /** sm 32 px for row and inline actions, md 40 px (default) for toolbars and close, lg 50 px for headers and action rows. */
  size?: keyof typeof sizes
  /**
   * `quiet` (default) for close, back, clear, copy, open; `surface` for an
   * action the screen offers (paste, refresh, edit); `secondary` for the one
   * solid violet action. The danger looks follow Button's names, lightest
   * first: `danger-quiet` tints only on hover, for a row's delete where a
   * filled square would be too loud; `danger-subtle` rests in the danger
   * tint, for an action that deletes or revokes and for the controls of an
   * error surface (a destructive toast's copy and close); `destructive` is
   * the solid red fill, the danger counterpart of `secondary`.
   */
  variant?: 'quiet' | 'surface' | 'secondary' | 'danger-quiet' | 'danger-subtle' | 'destructive'
  /**
   * `square` (default), the rounded square; `circle` for a button that sits on
   * a line or over content rather than in a row, like the swap card's flip.
   */
  shape?: 'square' | 'circle'
}

/**
 * The icon-only button. One shape for every glyph button in the library:
 * a rounded square (or a circle) in three sizes that sizes its glyph, the
 * violet hover, and the green focus glow. `label` is required.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, icon, size = 'md', variant = 'quiet', shape = 'square', title, className, type = 'button', ...props }, ref) => (
    <Button
      ref={ref}
      type={type}
      variant={variant}
      size={sizes[size]}
      aria-label={label}
      title={title ?? label}
      data-slot="icon-button"
      className={cn(
        'shrink-0 focus-visible:ring-primary/50 focus-visible:ring-offset-0 focus-visible:shadow-glow-primary-soft',
        shape === 'circle' && 'rounded-full',
        className,
      )}
      {...props}
    >
      {typeof icon === 'string' ? <Icon name={icon as IconName} aria-hidden="true" /> : icon}
    </Button>
  ),
)
IconButton.displayName = 'IconButton'

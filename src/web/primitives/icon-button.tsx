import * as React from 'react'
import { GlyphButton, type GlyphButtonProps } from './glyph-button'
import { Icon, type IconName } from './icon'

export interface IconButtonProps extends Omit<GlyphButtonProps, 'icon'> {
  /** The glyph, by name — or an element for a glyph that changes (a copy check, a spinner). */
  icon: IconName | React.ReactElement
}

/**
 * The icon-only button. One shape for every glyph button in the library:
 * a rounded square (or a circle) in three sizes that sizes its glyph, the
 * violet hover, and the green focus glow. `label` is required.
 *
 * A name is looked up in the whole icon set, so this carries every glyph;
 * `GlyphButton` takes the glyph component instead.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, ...props }, ref) => (
  <GlyphButton
    ref={ref}
    icon={typeof icon === 'string' ? <Icon name={icon as IconName} aria-hidden="true" /> : icon}
    {...props}
  />
))
IconButton.displayName = 'IconButton'

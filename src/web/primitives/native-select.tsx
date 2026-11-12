import * as React from 'react'
import { IconGlyph } from './icon-glyph'
import { ExpandMore } from '../icons/outlined'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

export interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The `<option>`s. */
  children: React.ReactNode
}

/**
 * The browser's own `<select>` in the field's clothes: `fieldSurface`, the
 * `Select` trigger's chevron, the options on the popover colours. For a short
 * fixed list inside a form or dialog (24 hours / 7 days / 30 days), where the
 * platform's picker is the better control on a phone and there is nothing to
 * search. Past a handful of options, or for options with a description, use
 * `Select`.
 *
 * `className` sizes and places the field (the box round the select and its
 * chevron); every other prop and the ref go to the `<select>`.
 */
const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <div data-slot="native-select" className={cn('relative w-full', className)}>
      <select
        ref={ref}
        className={cn(
          'peer flex h-12 w-full cursor-pointer appearance-none py-3 pl-4 pr-11 text-body text-foreground',
          fieldSurface,
          // The open list is drawn by the platform: give it the popover's colours
          // so a light option text never lands on a white list.
          '[&>option]:bg-popover [&>option]:text-popover-foreground'
        )}
        {...props}
      >
        {children}
      </select>
      <IconGlyph
        glyph={ExpandMore}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon-lg text-muted-foreground transition-colors peer-hover:text-secondary-content peer-disabled:opacity-50"
      />
    </div>
  )
)
NativeSelect.displayName = 'NativeSelect'

export { NativeSelect }

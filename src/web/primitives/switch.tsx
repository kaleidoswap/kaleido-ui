import * as React from 'react'
import { cn } from '../utils/cn'

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /**
   * A glyph for each side of the track. With them the switch grows into the
   * wide pill (`ThemeToggle` is this, sun and moon): the raised thumb slides
   * under the current glyph and the glyphs say the state, so the track stays
   * neutral. Without them it is the compact on/off switch.
   */
  icons?: { off: React.ReactNode; on: React.ReactNode }
  /**
   * How the control is named. A `role="switch"` with no accessible name is
   * unreachable by name for screen readers and for tests, so callers that
   * render their own visible label (`SwitchRow`) pass it here.
   */
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  id?: string
  title?: string
  'data-slot'?: string
  'data-mode'?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      className,
      icons,
      id,
      title,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'data-slot': dataSlot = 'switch',
      'data-mode': dataMode,
    },
    ref
  ) => {
    const glyph = (on: boolean) =>
      cn(
        'relative z-10 flex size-7 items-center justify-center transition-colors duration-300',
        checked === on ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground/80'
      )

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        title={title}
        data-slot={dataSlot}
        data-mode={dataMode}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          // The base: an inset track ringed in violet, a raised card thumb.
          'group relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-1 shadow-inner ring-1 ring-inset transition-all duration-300',
          'hover:ring-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft',
          'disabled:pointer-events-none disabled:opacity-50',
          // The wide track is 18 steps: p-1 + two size-7 glyphs + p-1 leaves 2 between
          // them, so the thumb's 9-step slide lands exactly on the second glyph.
          icons ? 'h-9 w-18' : 'h-6 w-11',
          !icons && checked
            ? 'bg-primary bg-gradient-primary ring-transparent hover:ring-transparent'
            : 'bg-foreground/8 ring-secondary/20',
          className
        )}
      >
        {/* The thumb slides under the current side. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-1 top-1 rounded-full shadow-raised transition-transform duration-300 ease-out motion-reduce:transition-none',
            icons ? 'size-7' : 'size-4',
            // Compact and off, a card thumb would vanish into the track.
            !icons && !checked ? 'bg-secondary-content' : 'bg-card bg-gradient-card',
            checked && (icons ? 'translate-x-9' : 'translate-x-5')
          )}
        />
        {icons && (
          <>
            <span aria-hidden="true" className={glyph(false)}>{icons.off}</span>
            <span aria-hidden="true" className={cn(glyph(true), 'ml-auto')}>{icons.on}</span>
          </>
        )}
      </button>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
export type { SwitchProps }

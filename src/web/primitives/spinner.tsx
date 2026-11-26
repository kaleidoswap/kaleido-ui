import type { CSSProperties } from 'react'
import { cn } from '../utils/cn'

/** xs 3 · sm 4 · md 5 · lg 8 · xl 12 · 2xl 16 spacing steps. `4xl` is kept as an alias of `2xl`. */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'

/**
 * `primary` — brand green, for content-area loaders (the default).
 * `inverse` — on a filled primary surface, where the label is dark.
 * `muted` — low emphasis, for inline or secondary waits.
 * `current` — the surrounding text colour (a Button's label).
 * `brand` and `secondary` — the legible brand green and the violet accent.
 */
export type SpinnerTone = 'primary' | 'inverse' | 'muted' | 'current' | 'brand' | 'secondary'

export interface SpinnerProps {
  size?: SpinnerSize
  tone?: SpinnerTone
  /**
   * Announced as a status. Leave it out when the spinner sits inside something
   * that already says it is busy (a Button with `loading`, a LoadingState): a
   * duplicate announcement is worse than none.
   */
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-8',
  xl: 'size-12',
  '2xl': 'size-16',
  '4xl': 'size-16',
}

// The stroke grows with the ring, so small spinners stay legible and large
// ones stay fine rather than turning into a thick donut.
const ringWidth: Record<SpinnerSize, string> = {
  xs: '1.5px',
  sm: '2px',
  md: '2px',
  lg: '2.5px',
  xl: '3px',
  '2xl': '3.5px',
  '4xl': '3.5px',
}

const toneClasses: Record<SpinnerTone, string> = {
  primary: 'text-primary',
  inverse: 'text-primary-foreground',
  muted: 'text-muted-foreground',
  current: '',
  brand: 'text-brand',
  secondary: 'text-secondary-content',
}

/**
 * The library's one indeterminate loading indicator: a single ring whose arc
 * tapers from full colour to a faint track, turning in place. Radially
 * symmetric, so it does not wobble the way a rotating glyph does; under
 * `prefers-reduced-motion` it breathes instead of turning. Never a hand-made
 * border ring or a spinning refresh glyph.
 */
export function Spinner({ size = 'md', tone = 'primary', label, className }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('kui-spinner inline-block animate-spin', sizeClasses[size], toneClasses[tone], className)}
      style={{ '--kui-spinner-ring': ringWidth[size] } as CSSProperties}
    />
  )
}

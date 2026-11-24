import { ProgressActivity } from '../icons/outlined'
import { cn } from '../utils/cn'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
export type SpinnerTone = 'current' | 'brand' | 'secondary' | 'muted'

export interface SpinnerProps {
  /** Glyph size on the icon scale: xs 13, sm 14, md 16 (default), lg 18, xl 20, 2xl, 4xl px. */
  size?: SpinnerSize
  /** `current` (default) takes the surrounding text colour, e.g. inside a Button. */
  tone?: SpinnerTone
  /**
   * Announced to screen readers as a status. Leave it out when the spinner sits
   * inside something that already says it is busy (a Button with `loading`).
   */
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'text-icon-xs',
  sm: 'text-icon-sm',
  md: 'text-icon-md',
  lg: 'text-icon-lg',
  xl: 'text-icon-xl',
  '2xl': 'text-icon-2xl',
  '4xl': 'text-icon-4xl',
}

const toneClasses: Record<SpinnerTone, string> = {
  current: '',
  brand: 'text-brand',
  secondary: 'text-secondary-content',
  muted: 'text-muted-foreground',
}

/**
 * The library's one loading spinner: the progress-activity arc turning in
 * place. Use it instead of hand-made border rings or spinning refresh glyphs,
 * so every busy state reads the same.
 */
export function Spinner({ size = 'md', tone = 'current', label, className }: SpinnerProps) {
  const glyph = (
    <ProgressActivity
      width="1em"
      height="1em"
      aria-hidden="true"
      data-slot="spinner"
      className={cn(
        'inline-block shrink-0 animate-spin motion-reduce:animate-none',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    />
  )
  if (!label) return glyph
  return (
    <span role="status" aria-label={label} className="inline-flex">
      {glyph}
    </span>
  )
}

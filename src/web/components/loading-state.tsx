import { Spinner, type SpinnerSize } from '../primitives/spinner'
import { cn } from '../utils/cn'

export interface LoadingStateProps {
  /** A short present-tense label, "Loading trading data…". Also the accessible name. */
  label: string
  /** A second line for slow waits ("Don't close the popup"). */
  hint?: string
  size?: SpinnerSize
  /**
   * Skip the anti-flash delay, where the wait is known to be long (a network
   * round trip the user just started), so the surface does not sit blank.
   */
  immediate?: boolean
  className?: string
}

/**
 * The centred "this area is loading" block: a Spinner over a label and an
 * optional hint. It stays invisible for 160 ms and then fades in, so a fast
 * load never flashes a spinner, and it announces itself politely once.
 */
export function LoadingState({ label, hint, size = 'xl', immediate = false, className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'kui-loading-reveal flex flex-col items-center justify-center gap-3.5 py-12',
        immediate && 'kui-loading-reveal-now',
        className,
      )}
    >
      <Spinner size={size} tone="primary" />
      <div className="space-y-1.5 text-center">
        <p className="text-body text-muted-foreground">{label}</p>
        {hint && <p className="mx-auto max-w-[18rem] px-4 text-caption text-muted-foreground/70">{hint}</p>}
      </div>
    </div>
  )
}

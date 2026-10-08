import { cn } from '../utils/cn'

/**
 * The leader line that ties a label to its value across a row's gap, as in
 * the Activity details. Put it between the two in a flex row: it takes the
 * free width (a continuous line, not dots) and draws nothing for a screen reader.
 */
export function DottedLeader({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('min-w-4 flex-1 self-center border-b border-solid border-foreground/15', className)}
    />
  )
}

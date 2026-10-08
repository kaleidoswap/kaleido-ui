import type { AriaRole, ReactNode } from 'react'
import { cn } from '../utils/cn'
import { IconButton } from '../primitives/icon-button'

export interface FloatingNoticeProps {
  /** The notice — usually an `InfoPanel`. */
  children: ReactNode
  /** Called by the close button. Where the dismissal is remembered is the consumer's call. */
  onDismiss?: () => void
  /** Show the close button. On by default; it also needs `onDismiss`. */
  dismissible?: boolean
  dismissLabel?: string
  /** `status` (default) is announced politely; `alert` for something urgent. */
  role?: AriaRole
  className?: string
}

/**
 * A notice floating at the bottom centre of the viewport, above dialogs and
 * overlays, until it is closed. Unlike a toast it neither times out nor
 * queues behind other notices.
 *
 * It sits on an opaque card, so a translucent `InfoPanel` inside stays
 * legible over whatever is beneath.
 */
export function FloatingNotice({
  children,
  onDismiss,
  dismissible = true,
  dismissLabel = 'Dismiss',
  role = 'status',
  className,
}: FloatingNoticeProps) {
  const showClose = dismissible && Boolean(onDismiss)
  return (
    <div
      data-slot="floating-notice"
      role={role}
      className={cn(
        'fixed bottom-4 left-1/2 z-[var(--z-modal)] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-card bg-gradient-card-hero shadow-toast',
        className,
      )}
    >
      <div className="relative">
        {children}
        {showClose && (
          <IconButton icon="close" label={dismissLabel} size="sm" onClick={onDismiss} className="absolute right-2 top-2" />
        )}
      </div>
    </div>
  )
}

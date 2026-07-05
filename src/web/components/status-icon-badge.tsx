import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../icons'
import { cn } from '../utils/cn'

export interface StatusIconBadgeProps {
  /** The direction/type circle (or tile) the status badge overlays. */
  icon: ReactNode
  /**
   * Transaction status. `completed`/`success` → green check,
   * `failed`/`error` → red close, `pending` → amber schedule,
   * anything else (refunded, expired, …) → muted remove.
   * `undefined` renders the icon with no badge at all.
   */
  status?: 'completed' | 'failed' | 'pending' | string
  className?: string
}

const STATUS_UI: Record<string, { icon: IconName; className: string }> = {
  completed: { icon: 'check', className: 'bg-primary text-primary-foreground' },
  success: { icon: 'check', className: 'bg-primary text-primary-foreground' },
  failed: { icon: 'close', className: 'bg-danger text-background' },
  error: { icon: 'close', className: 'bg-danger text-background' },
  pending: { icon: 'schedule', className: 'bg-warning text-background' },
}

const FALLBACK_UI = { icon: 'remove' as IconName, className: 'bg-muted text-muted-foreground' }

/**
 * Shared frame for a small badge overlaid bottom-right on an icon inside a
 * `relative` wrapper. The `ring-card` masks the badge edge against the card
 * surface. Used by StatusIconBadge and the AssetSelector network mini-badge.
 */
export const iconBadgeOverlayClass =
  'absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full ring-2 ring-card'

/**
 * Status-on-icon combo: renders a direction/type circle with a small status
 * badge overlaid bottom-right — same pattern as the network-on-asset icon
 * combo. Replaces the full-width Completed/Failed/Pending chips on activity
 * cards, freeing the row for title + date.
 */
export function StatusIconBadge({ icon, status, className }: StatusIconBadgeProps) {
  const ui = status ? (STATUS_UI[status] ?? FALLBACK_UI) : null

  return (
    <div className={cn('relative shrink-0', className)}>
      {icon}
      {ui && (
        <span className={cn(iconBadgeOverlayClass, ui.className)}>
          <Icon name={ui.icon} className="size-3" />
        </span>
      )}
    </div>
  )
}

import { Icon, type IconName } from '../primitives/icon'
import { cn } from '../utils/cn'

export type StatusType = 'success' | 'pending' | 'failed' | 'completed' | 'error'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // No border ring — status pills separate from the card by bg tint alone
  // (DESIGN.md coherence: surfaces layer by background, not ad-hoc borders).
  const config: Record<StatusType, { color: string; bg: string; icon: IconName; label: string }> = {
    success: {
      color: 'text-brand',
      bg: 'bg-primary/10',
      icon: 'check_circle',
      label: 'Success',
    },
    completed: {
      color: 'text-brand',
      bg: 'bg-primary/10',
      icon: 'check_circle',
      label: 'Completed',
    },
    pending: {
      color: 'text-warning-fg',
      bg: 'bg-warning/10',
      icon: 'schedule',
      label: 'Pending',
    },
    failed: {
      color: 'text-danger-fg',
      bg: 'bg-danger/10',
      icon: 'error',
      label: 'Failed',
    },
    error: {
      color: 'text-danger-fg',
      bg: 'bg-danger/10',
      icon: 'error',
      label: 'Error',
    },
  }

  const { color, bg, icon, label } = config[status]

  return (
    <div
      data-slot="status-badge"
      className={cn(
        'inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full font-medium text-caption',
        bg,
        color,
        className
      )}
    >
      {/* Inline SVG, not a Material Symbols ligature: a consumer that has not
          self-hosted the icon font rendered the literal word ("error", "schedule")
          inside the pill. Every glyph this component needs already exists in the
          Icon set, so there is nothing to trade away. */}
      {/* The labels are mostly lowercase, so the eye centres them on the
          x-height, 2px under the cap centre the flex box aligns: 1px down
          splits the difference. */}
      <Icon name={icon} className="text-icon-sm translate-y-px" />
      <span>{label}</span>
    </div>
  )
}

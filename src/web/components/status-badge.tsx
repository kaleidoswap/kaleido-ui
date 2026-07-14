import { cn } from '../utils/cn'

export type StatusType = 'success' | 'pending' | 'failed' | 'completed' | 'error'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // No border ring — status pills separate from the card by bg tint alone
  // (DESIGN.md coherence: surfaces layer by background, not ad-hoc borders).
  const config = {
    success: {
      color: 'text-primary',
      bg: 'bg-primary/10',
      icon: 'check_circle',
      label: 'Success',
    },
    completed: {
      color: 'text-primary',
      bg: 'bg-primary/10',
      icon: 'check_circle',
      label: 'Completed',
    },
    pending: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      icon: 'schedule',
      label: 'Pending',
    },
    failed: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      icon: 'error',
      label: 'Failed',
    },
    error: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      icon: 'error',
      label: 'Error',
    },
  }

  const { color, bg, icon, label } = config[status]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full font-medium text-xs',
        bg,
        color,
        className
      )}
    >
      <span className="material-symbols-outlined text-icon-sm">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

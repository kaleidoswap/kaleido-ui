import { cn } from '../utils/cn'

export type StatusType = 'success' | 'pending' | 'failed' | 'completed' | 'error'

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    success: {
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      icon: 'check_circle',
      label: 'Success',
    },
    completed: {
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      icon: 'check_circle',
      label: 'Completed',
    },
    pending: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      icon: 'schedule',
      label: 'Pending',
    },
    failed: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      icon: 'error',
      label: 'Failed',
    },
    error: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      icon: 'error',
      label: 'Error',
    },
  }

  const { color, bg, border, icon, label } = config[status]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border font-medium text-xs',
        bg,
        border,
        color,
        className
      )}
    >
      <span className="material-symbols-outlined text-icon-sm">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

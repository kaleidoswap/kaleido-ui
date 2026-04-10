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
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: 'schedule',
      label: 'Pending',
    },
    failed: {
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'error',
      label: 'Failed',
    },
    error: {
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'error',
      label: 'Error',
    },
  }

  const { color, bg, border, icon, label } = config[status]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium text-xs',
        bg,
        border,
        color,
        className
      )}
    >
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

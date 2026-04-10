import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'

const variantStyles = {
  error: {
    container: 'bg-red-500/10 border-red-500/20',
    icon: 'text-red-400',
    iconName: 'error',
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-500/20',
    icon: 'text-amber-400',
    iconName: 'warning',
  },
  info: {
    container: 'bg-blue-500/10 border-blue-500/20',
    icon: 'text-blue-400',
    iconName: 'info',
  },
  success: {
    container: 'bg-primary/10 border-primary/20',
    icon: 'text-primary',
    iconName: 'check_circle',
  },
} as const

interface AlertBannerProps {
  variant?: keyof typeof variantStyles
  icon?: string
  children: ReactNode
  className?: string
}

export function AlertBanner({ variant = 'info', icon, children, className }: AlertBannerProps) {
  const styles = variantStyles[variant]
  return (
    <div className={cn('rounded-xl border p-3 flex items-start gap-2', styles.container, className)}>
      <Icon name={icon ?? styles.iconName} size="md" className={cn('shrink-0 mt-0.5', styles.icon)} />
      <div className="text-sm">{children}</div>
    </div>
  )
}

import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'

const variantStyles = {
  error:   { container: 'bg-danger/40',    icon: 'text-danger',    iconName: 'error' },
  warning: { container: 'bg-warning/40', icon: 'text-warning', iconName: 'warning' },
  info:    { container: 'bg-info/40',   icon: 'text-info',   iconName: 'info' },
  success: { container: 'bg-primary/8',     icon: 'text-primary/90', iconName: 'check_circle' },
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
    <div className={cn('rounded-xl p-3 flex items-center gap-2', styles.container, className)}>
      <Icon name={icon ?? styles.iconName} size="md" className={cn('shrink-0', styles.icon)} />
      <div className={cn('text-sm', styles.icon)}>{children}</div>
    </div>
  )
}

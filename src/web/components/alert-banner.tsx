import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'

const variantStyles = {
  error:   { container: 'bg-red-500/20',    icon: 'text-red-500',    iconName: 'error' },
  warning: { container: 'bg-yellow-500/20', icon: 'text-yellow-500', iconName: 'warning' },
  info:    { container: 'bg-blue-500/15',  icon: 'text-blue-400',  iconName: 'info' },
  success: { container: 'bg-primary/10',   icon: 'text-primary',   iconName: 'check_circle' },
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

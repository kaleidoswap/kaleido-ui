import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import type { ReactNode } from 'react'

const variantStyles = {
  error:   { container: 'bg-danger/40',    icon: 'text-danger-fg',    iconName: 'error' },
  warning: { container: 'bg-warning/40', icon: 'text-warning-fg', iconName: 'warning' },
  info:    { container: 'bg-info/40 bg-gradient-card', icon: 'text-info-fg',   iconName: 'info' },
  success: { container: 'bg-primary/10',    icon: 'text-brand/90', iconName: 'check_circle' },
} as const

interface AlertBannerProps {
  variant?: keyof typeof variantStyles
  icon?: IconName
  children: ReactNode
  className?: string
}

export function AlertBanner({ variant = 'info', icon, children, className }: AlertBannerProps) {
  const styles = variantStyles[variant]
  return (
    <div className={cn('rounded-xl p-3 flex items-center gap-2 shadow-raised', styles.container, className)}>
      <Icon name={icon ?? styles.iconName} size="md" className={cn('shrink-0', styles.icon)} />
      <div className={cn('text-body', styles.icon)}>{children}</div>
    </div>
  )
}

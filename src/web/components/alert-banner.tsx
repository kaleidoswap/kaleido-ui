import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'

const variantStyles = {
  error:   { container: 'bg-red-900/40',    icon: 'text-red-500',    iconName: 'error' },
  warning: { container: 'bg-yellow-900/40', icon: 'text-yellow-400', iconName: 'warning' },
  info:    { container: 'bg-blue-900/40',   icon: 'text-blue-300',   iconName: 'info' },
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

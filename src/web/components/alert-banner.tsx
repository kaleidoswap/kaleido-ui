import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import type { ReactNode } from 'react'
import { GlyphButton } from '../primitives/glyph-button'
import { Close } from '../icons/outlined'

const variantStyles = {
  // One tint for every tone: a 10% wash of the colour, its -fg for icon and text.
  error:   { container: 'bg-danger/10',  icon: 'text-danger-fg',  iconName: 'error' },
  warning: { container: 'bg-warning/10', icon: 'text-warning-fg', iconName: 'warning' },
  info:    { container: 'bg-info/10',    icon: 'text-info-fg',    iconName: 'info' },
  success: { container: 'bg-primary/10', icon: 'text-brand/90',  iconName: 'check_circle' },
} as const

export interface AlertBannerProps {
  variant?: keyof typeof variantStyles
  icon?: IconName
  children: ReactNode
  /** One action under the message, e.g. a small Button ("Retry", "Review"). */
  action?: ReactNode
  /** Shows a close button at the top right; called when it is pressed. */
  onDismiss?: () => void
  /** Accessible name of the close button. */
  dismissLabel?: string
  className?: string
}

export function AlertBanner({
  variant = 'info',
  icon,
  children,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
}: AlertBannerProps) {
  const styles = variantStyles[variant]
  return (
    <div className={cn('rounded-xl p-3 flex items-start gap-2', styles.container, className)}>
      <Icon name={icon ?? styles.iconName} size="md" className={cn('shrink-0 mt-0.5', styles.icon)} />
      <div className="min-w-0 flex-1">
        <div className={cn('text-body', styles.icon)}>{children}</div>
        {action && <div className="mt-2 flex flex-wrap items-center gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <GlyphButton
          icon={Close}
          label={dismissLabel}
          size="sm"
          variant="quiet"
          onClick={onDismiss}
          className="-my-1 -mr-1 shrink-0"
        />
      )}
    </div>
  )
}

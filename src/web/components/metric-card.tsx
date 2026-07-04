import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface MetricCardProps {
  label: ReactNode
  value: ReactNode
  description?: ReactNode
  icon?: IconName | ReactNode
  tone?: 'primary' | 'purple' | 'blue' | 'info' | 'warning' | 'success' | 'muted'
  className?: string
}

const toneClasses: Record<NonNullable<MetricCardProps['tone']>, string> = {
  primary: 'bg-primary/10 text-primary',
  purple: 'bg-network-arkade/10 text-network-arkade',
  blue: 'bg-info/10 text-info',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
  muted: 'bg-white/8 text-muted-foreground',
}

export function MetricCard({
  label,
  value,
  description,
  icon,
  tone = 'muted',
  className,
}: MetricCardProps) {
  return (
    <div className={cn('space-y-1 rounded-xl bg-card/70 p-2.5', className)}>
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className={cn('flex size-5 items-center justify-center rounded-md', toneClasses[tone])}>
            {typeof icon === 'string' ? <Icon name={icon as IconName} className="text-icon-xs" /> : icon}
          </span>
        )}
        <span className="text-xxs font-bold uppercase tracking-widest text-white/45">{label}</span>
      </div>
      <p className="font-mono text-sm font-bold text-foreground">{value}</p>
      {description && <p className="text-xxs text-white/45">{description}</p>}
    </div>
  )
}

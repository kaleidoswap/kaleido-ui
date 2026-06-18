import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface SettingsSectionCardProps {
  title: ReactNode
  description?: ReactNode
  badge?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function SettingsSectionCard({
  title,
  description,
  badge,
  children,
  className,
  bodyClassName,
}: SettingsSectionCardProps) {
  return (
    <section className={cn('space-y-4 rounded-xl bg-card p-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {badge}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

export interface ToneBadgeProps {
  children: ReactNode
  tone?: 'primary' | 'info' | 'warning' | 'danger' | 'success' | 'muted'
  className?: string
}

const badgeToneClass: Record<NonNullable<ToneBadgeProps['tone']>, string> = {
  primary: 'border-primary/30 bg-primary/10 text-primary',
  info: 'border-info/30 bg-info/10 text-info',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  success: 'border-success/30 bg-success/10 text-success',
  muted: 'border-white/10 bg-white/[0.05] text-white/55',
}

export function ToneBadge({ children, tone = 'muted', className }: ToneBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-1 text-xxs font-bold uppercase tracking-wider',
        badgeToneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

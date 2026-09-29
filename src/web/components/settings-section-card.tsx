import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

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
    <section className={cn('space-y-4 rounded-xl bg-card/70 p-4', className)}>
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
  /**
   * `upper` (default) is a status — ACTIVE, REVOKED — set as the eyebrow.
   * `none` is a value — a payout total, a count — set in `caption` with no
   * uppercase and no tracking, so a consumer needs no size override.
   */
  case?: 'upper' | 'none'
  className?: string
}

const badgeToneClass: Record<NonNullable<ToneBadgeProps['tone']>, string> = {
  primary: 'border-primary/30 bg-primary/10 text-primary',
  info: 'border-info/30 bg-info/10 text-info',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  success: 'border-success/30 bg-success/10 text-success',
  // Theme tokens, not white alphas: on the light theme a white-on-white badge
  // disappears. On dark these resolve to the same 10% / 5% / 55% white.
  muted: 'border-border bg-foreground/5 text-muted-foreground',
}

export function ToneBadge({ children, tone = 'muted', case: letterCase = 'upper', className }: ToneBadgeProps) {
  return (
    <span
      data-slot="tone-badge"
      className={cn(
        'rounded-full border px-2.5 py-1',
        letterCase === 'upper' ? eyebrow : 'text-caption font-semibold tabular-nums',
        badgeToneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

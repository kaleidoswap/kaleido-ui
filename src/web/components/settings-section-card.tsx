import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export interface SettingsSectionCardProps {
  /** Icon shown in a tile before the title, matching SettingsTile and SettingsSelectorRow. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  badge?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function SettingsSectionCard({
  icon,
  title,
  description,
  badge,
  children,
  className,
  bodyClassName,
}: SettingsSectionCardProps) {
  return (
    <section className={cn('space-y-4 rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-4 shadow-card-secondary', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-body font-bold text-foreground">{title}</h2>
            {description && <p className="mt-1 text-caption text-muted-foreground">{description}</p>}
          </div>
        </div>
        {badge}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

export interface ToneBadgeProps {
  children: ReactNode
  /**
   * The badge's colour. `muted` is the neutral default; `secondary` is the
   * brand violet; `outline` has no fill, only the hairline — for a label that
   * should not compete with a status next to it.
   */
  tone?: 'primary' | 'secondary' | 'info' | 'warning' | 'danger' | 'success' | 'muted' | 'outline'
  /**
   * `upper` (default) is a status — ACTIVE, REVOKED — set as the eyebrow.
   * `none` is a value — a payout total, a count — set in `caption` with no
   * uppercase and no tracking, so a consumer needs no size override.
   */
  case?: 'upper' | 'none'
  className?: string
}

const badgeToneClass: Record<NonNullable<ToneBadgeProps['tone']>, string> = {
  primary: 'border-primary/30 bg-primary/10 text-brand',
  info: 'border-secondary/30 bg-secondary/15 text-secondary-content',
  warning: 'border-warning/30 bg-warning/10 text-warning-fg',
  danger: 'border-danger/30 bg-danger/10 text-danger-fg',
  success: 'border-success/30 bg-success/10 text-success-fg',
  // Theme tokens, not white alphas: on the light theme a white-on-white badge
  // disappears. On dark these resolve to the same 10% / 5% / 55% white.
  muted: 'border-border bg-foreground/5 text-muted-foreground',
  secondary: 'border-secondary/30 bg-secondary/10 text-secondary-content',
  outline: 'border-border bg-transparent text-foreground',
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

import { useId, type HTMLAttributes, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export type MetricCardSize = 'compact' | 'comfortable'

export interface MetricCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode
  value: ReactNode
  /** A line under the value: a comparison, a period, a hint. */
  description?: ReactNode
  icon?: IconName | ReactNode
  tone?: 'primary' | 'purple' | 'blue' | 'info' | 'warning' | 'success' | 'muted'
  /**
   * `compact` (default) is the phone tile: a 10 px padded chip with a small
   * value, for the wallet's dense metric rows. `comfortable` is the desk tile
   * for panel dashboards: a `p-4` card with the value in `headline`, so the
   * figure — the point of the tile — is the largest text on it.
   */
  size?: MetricCardSize
  /**
   * Where the icon sits: beside the `label` (the compact layout) or at the
   * `end` of the tile, to the right of the figure (the panel layout).
   * Defaults to `label` for compact and `end` for comfortable.
   */
  iconPlacement?: 'label' | 'end'
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

/**
 * A single figure with its label: a balance, a count, a rate.
 *
 * The tile is a named group — its accessible name is the label — so a failure
 * that replaces the value (an error line, a dash) is announced as belonging to
 * that metric. Pass `aria-label` to override the name.
 */
export function MetricCard({
  label,
  value,
  description,
  icon,
  tone = 'muted',
  size = 'compact',
  iconPlacement,
  className,
  ...rest
}: MetricCardProps) {
  const labelId = useId()
  const comfortable = size === 'comfortable'
  const placement = iconPlacement ?? (comfortable ? 'end' : 'label')

  const iconNode = icon ? (
    <span
      data-slot="metric-card-icon"
      className={cn(
        'flex shrink-0 items-center justify-center',
        comfortable ? 'size-9 rounded-xl' : 'size-5 rounded-md',
        toneClasses[tone],
      )}
    >
      {typeof icon === 'string' ? (
        <Icon name={icon as IconName} className={comfortable ? 'text-icon-lg' : 'text-icon-xs'} />
      ) : (
        icon
      )}
    </span>
  ) : null

  const labelNode = (
    <span id={labelId} data-slot="metric-card-label" className={cn(eyebrow, 'text-muted-foreground')}>
      {label}
    </span>
  )

  return (
    <div
      role="group"
      aria-labelledby={rest['aria-label'] ? undefined : labelId}
      data-slot="metric-card"
      data-size={size}
      className={cn(
        comfortable ? 'rounded-2xl bg-card p-4' : 'rounded-xl bg-card/70 p-2.5',
        placement === 'end' ? 'flex items-start justify-between gap-3' : 'space-y-1',
        className,
      )}
      {...rest}
    >
      <div className={placement === 'end' ? 'min-w-0 flex-1 space-y-1' : 'contents'}>
        <div className="flex items-center gap-1.5">
          {placement === 'label' && iconNode}
          {labelNode}
        </div>
        <p
          data-slot="metric-card-value"
          className={cn(
            'm-0 font-bold tabular-nums text-foreground',
            comfortable ? 'text-headline' : 'text-body',
          )}
        >
          {value}
        </p>
        {description && (
          <p
            data-slot="metric-card-description"
            className={cn('m-0 text-muted-foreground', comfortable ? 'text-caption' : 'text-xxs')}
          >
            {description}
          </p>
        )}
      </div>
      {placement === 'end' && iconNode}
    </div>
  )
}

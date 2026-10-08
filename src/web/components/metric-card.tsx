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
  /**
   * A small chart of the figure's recent course, at the end of the tile and
   * as tall as the tile's content: pass `<Sparkline height="fill" />`. Pair
   * it with a `description` that says the change in words or a percentage.
   */
  trend?: ReactNode
}

const toneClasses: Record<NonNullable<MetricCardProps['tone']>, string> = {
  primary: 'bg-primary/10 text-brand',
  purple: 'bg-network-arkade/10 text-network-arkade-fg',
  blue: 'bg-info/10 text-info-fg',
  info: 'bg-info/10 text-info-fg',
  warning: 'bg-warning/10 text-warning-fg',
  success: 'bg-success/10 text-success-fg',
  muted: 'bg-secondary/15 text-secondary-content',
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
  trend,
  className,
  ...rest
}: MetricCardProps) {
  const labelId = useId()
  const comfortable = size === 'comfortable'
  const placement = iconPlacement ?? (comfortable ? 'end' : 'label')
  const hasEnd = placement === 'end' || !!trend
  // Beside the label the icon is a glyph the label's height; at the end of the
  // tile it stands on its own, so it steps up a size.
  const iconBox = comfortable ? 'size-9 rounded-xl shadow-raised' : placement === 'end' ? 'size-7 rounded-lg' : 'size-5 rounded-md'
  const iconGlyph = comfortable ? 'text-icon-lg' : placement === 'end' ? 'text-icon-md' : 'text-icon-xs'

  const iconNode = icon ? (
    <span
      data-slot="metric-card-icon"
      className={cn(
        'flex shrink-0 items-center justify-center',
        iconBox,
        toneClasses[tone],
      )}
    >
      {typeof icon === 'string' ? (
        <Icon name={icon as IconName} className={iconGlyph} />
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
        comfortable
          ? 'rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero p-4 shadow-card'
          : 'rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero p-2.5 shadow-raised',
        hasEnd ? 'flex items-stretch justify-between gap-3' : 'space-y-1',
        className,
      )}
      {...rest}
    >
      <div className={hasEnd ? 'min-w-0 flex-1 space-y-1' : 'contents'}>
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
      {hasEnd && (
        <div className="flex shrink-0 flex-col items-end justify-between gap-2">
          {placement === 'end' && iconNode}
          {trend && (
            <div data-slot="metric-card-trend" className="min-h-0 flex-1">
              {trend}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

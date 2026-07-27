import { AppIcon } from './app-icon'
import { ArkadeNetworkIcon, LightningNetworkIcon, SparkNetworkIcon } from './network-icon'
import { cn } from '../utils/cn'

export type ActivityNetworkFilterValue = 'all' | 'onchain' | 'lightning' | 'spark' | 'arkade'

export interface ActivityNetworkFilterOption<TValue extends string = ActivityNetworkFilterValue> {
  value: TValue
  label: string
  icon?: React.ReactNode
}

export interface ActivityNetworkFiltersProps<TValue extends string = ActivityNetworkFilterValue> {
  filters: ActivityNetworkFilterOption<TValue>[]
  activeFilter: TValue
  onChange: (value: TValue) => void
  className?: string
  ariaLabel?: string
}

export function getActivityNetworkFilterIcon(filter: ActivityNetworkFilterValue) {
  // size="xs" → text-icon-sm (14px) so the Material-Symbols glyph's
  // font-size matches the size-icon-sm box and the visible glyph lines up
  // with the 14px <img> network icons (Lightning / Spark / Arkade).
  // Without this, AppIcon defaults to size="lg" (24px) and the glyph
  // overflows the 14px box, rendering visibly larger and above the text.
  switch (filter) {
    case 'onchain':
      return <AppIcon name="onchain" size="xs" className="size-icon-sm" />
    case 'lightning':
      return <LightningNetworkIcon className="size-3.5" alt="" />
    case 'spark':
      return <SparkNetworkIcon className="size-3.5" alt="" />
    case 'arkade':
      return <ArkadeNetworkIcon className="size-3.5 rounded" alt="" />
    default:
      return <AppIcon name="allNetworks" size="xs" className="size-icon-sm" />
  }
}

export function ActivityNetworkFilters<TValue extends string = ActivityNetworkFilterValue>({
  filters,
  activeFilter,
  onChange,
  className,
  ariaLabel = 'Filter activity by network',
}: ActivityNetworkFiltersProps<TValue>) {
  if (filters.length <= 1) return null

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar', className)}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value
        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(filter.value)}
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xxs font-bold uppercase tracking-wider transition-all',
              isActive
                ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-white'
            )}
          >
            <span
              aria-hidden
              className="flex size-3 items-center justify-center"
            >
              {filter.icon ?? getActivityNetworkFilterIcon(filter.value as ActivityNetworkFilterValue)}
            </span>
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

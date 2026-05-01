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
}

export function getActivityNetworkFilterIcon(filter: ActivityNetworkFilterValue) {
  switch (filter) {
    case 'onchain':
      return <AppIcon name="onchain" className="size-icon-sm" />
    case 'lightning':
      return <LightningNetworkIcon className="size-3.5" alt="" />
    case 'spark':
      return <SparkNetworkIcon className="size-3.5" alt="" />
    case 'arkade':
      return <ArkadeNetworkIcon className="size-3.5 rounded" alt="" />
    default:
      return <AppIcon name="allNetworks" className="size-icon-sm" />
  }
}

export function ActivityNetworkFilters<TValue extends string = ActivityNetworkFilterValue>({
  filters,
  activeFilter,
  onChange,
  className,
}: ActivityNetworkFiltersProps<TValue>) {
  if (filters.length <= 1) return null

  return (
    <div className={cn('flex gap-1.5 overflow-x-auto py-0.5 no-scrollbar', className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xxs font-bold uppercase tracking-wider transition-all active:scale-95',
              isActive
                ? 'bg-primary/15 text-primary shadow-inner hover:bg-primary/20'
                : 'bg-surface-card text-white/45 hover:bg-surface-elevated hover:text-white/80'
            )}
          >
            <span
              className={cn(
                'flex items-center justify-center',
                isActive ? 'opacity-100' : 'scale-90 opacity-70'
              )}
            >
              {filter.icon ?? getActivityNetworkFilterIcon(filter.value as ActivityNetworkFilterValue)}
            </span>
            <span>{filter.label}</span>
          </button>
        )
      })}
    </div>
  )
}

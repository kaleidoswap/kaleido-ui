import { AppIcon, type AppIconName } from './app-icon'
import { TabsList, TabsTrigger } from '../primitives/tabs'

export type ActivityTypeTabValue = 'all' | 'received' | 'sent' | 'swaps'

export interface ActivityTypeTabCounts {
  all?: number
  received?: number
  sent?: number
  swaps?: number
}

export function ActivityTypeTabs({ counts = {} }: { counts?: ActivityTypeTabCounts }) {
  const actions: Array<{
    value: ActivityTypeTabValue
    label: string
    icon?: AppIconName
    actionIcon?: string
  }> = [
    { value: 'all', label: 'All' },
    { value: 'received', label: 'In', icon: 'receive', actionIcon: 'call_received' },
    { value: 'sent', label: 'Out', icon: 'send', actionIcon: 'arrow_outward' },
    { value: 'swaps', label: 'Swap', icon: 'swap', actionIcon: 'swap_horiz' },
  ]

  return (
    <TabsList className="grid h-12 w-full grid-cols-4 gap-1 rounded-2xl bg-surface-card p-1 backdrop-blur-xl">
      {actions.map((action) => (
        <TabsTrigger
          key={action.value}
          value={action.value}
          data-action-icon={action.actionIcon}
          className="group h-full rounded-xl px-1.5 text-xs font-bold tracking-wide text-muted-foreground transition-all hover:text-primary data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:hover:bg-primary/20 data-[state=active]:hover:text-primary"
        >
          {action.icon && (
            <AppIcon
              name={action.icon}
              size="sm"
              className="mr-1 shrink-0 leading-none text-muted-foreground transition-colors group-hover:text-primary group-data-[state=active]:text-primary"
            />
          )}
          <span>{action.label}</span>
          {action.value === 'all' && counts.all ? (
            <span className="ml-1">({counts.all})</span>
          ) : null}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

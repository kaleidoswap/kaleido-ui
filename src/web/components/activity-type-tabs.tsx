import { AppIcon } from './app-icon'
import { TabsList, TabsTrigger } from '../primitives/tabs'

export type ActivityTypeTabValue = 'all' | 'received' | 'sent' | 'swaps'

export interface ActivityTypeTabCounts {
  all?: number
  received?: number
  sent?: number
  swaps?: number
}

export function ActivityTypeTabs({ counts = {} }: { counts?: ActivityTypeTabCounts }) {
  return (
    <TabsList className="grid h-12 w-full grid-cols-4 gap-1 rounded-full bg-surface-card p-1 backdrop-blur-xl">
      <TabsTrigger
        value="all"
        className="h-full rounded-full px-2 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-surface-elevated data-[state=active]:text-white"
      >
        All{counts.all ? <span className="ml-1 opacity-60">({counts.all})</span> : null}
      </TabsTrigger>
      <TabsTrigger
        value="received"
        className="group h-full rounded-full px-1.5 text-xs font-bold tracking-wide transition-all hover:text-tx-receive data-[state=active]:bg-tx-receive/15 data-[state=active]:text-tx-receive data-[state=active]:hover:bg-tx-receive/20 data-[state=active]:hover:text-tx-receive"
      >
        <AppIcon
          name="receive"
          size="sm"
          className="mr-1 shrink-0 leading-none text-muted-foreground transition-colors group-hover:text-tx-receive group-data-[state=active]:text-tx-receive"
        />
        <span>In</span>
      </TabsTrigger>
      <TabsTrigger
        value="sent"
        className="group h-full rounded-full px-1.5 text-xs font-bold tracking-wide transition-all hover:text-tx-sent data-[state=active]:bg-tx-sent/15 data-[state=active]:text-tx-sent data-[state=active]:hover:bg-tx-sent/20 data-[state=active]:hover:text-tx-sent"
      >
        <AppIcon
          name="send"
          size="sm"
          className="mr-1 shrink-0 leading-none text-muted-foreground transition-colors group-hover:text-tx-sent group-data-[state=active]:text-tx-sent"
        />
        <span>Out</span>
      </TabsTrigger>
      <TabsTrigger
        value="swaps"
        className="group h-full rounded-full px-1.5 text-xs font-bold tracking-wide transition-all hover:text-network-arkade data-[state=active]:bg-network-arkade/15 data-[state=active]:text-network-arkade data-[state=active]:hover:bg-network-arkade/20 data-[state=active]:hover:text-network-arkade"
      >
        <AppIcon
          name="swap"
          size="sm"
          className="mr-1 shrink-0 leading-none text-muted-foreground transition-colors group-hover:text-network-arkade group-data-[state=active]:text-network-arkade"
        />
        <span>Swaps</span>
      </TabsTrigger>
    </TabsList>
  )
}

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
    <TabsList className="grid w-full grid-cols-4 gap-1 rounded-3xl bg-card/60 p-1 backdrop-blur-xl">
      <TabsTrigger
        value="all"
        className="rounded-2xl px-1.5 py-2 text-xs font-bold tracking-wide text-white/70 transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white"
      >
        All{counts.all ? <span className="ml-1 opacity-60">({counts.all})</span> : null}
      </TabsTrigger>
      <TabsTrigger
        value="received"
        className="group rounded-2xl px-1.5 py-2 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-tx-receive/15 data-[state=active]:text-tx-receive"
      >
        <AppIcon
          name="receive"
          className="mr-1.5 size-icon-sm text-muted-foreground transition-colors group-data-[state=active]:text-tx-receive"
        />
        In
      </TabsTrigger>
      <TabsTrigger
        value="sent"
        className="group rounded-2xl px-1.5 py-2 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-tx-sent/15 data-[state=active]:text-tx-sent"
      >
        <AppIcon
          name="send"
          className="mr-1.5 size-icon-sm text-muted-foreground transition-colors group-data-[state=active]:text-tx-sent"
        />
        Out
      </TabsTrigger>
      <TabsTrigger
        value="swaps"
        className="group rounded-2xl px-1.5 py-2 text-xs font-bold tracking-wide transition-all data-[state=active]:bg-network-arkade/15 data-[state=active]:text-network-arkade"
      >
        <AppIcon
          name="swap"
          className="mr-1.5 size-icon-sm text-muted-foreground transition-colors group-data-[state=active]:text-network-arkade"
        />
        Swaps
      </TabsTrigger>
    </TabsList>
  )
}

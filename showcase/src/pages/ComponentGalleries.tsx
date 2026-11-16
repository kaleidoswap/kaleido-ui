import { useState, type ReactNode } from 'react'
import {
  cn,
  BasicCollapsible,
  cardSurface,
  ActivityDetailRow,
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  CopyButton,
  Copyable,
  DateRangeFilter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DisclosureCard,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  EventTimeline,
  FilterBar,
  FilterChipGroup,
  FilterDropdown,
  LightningNetworkIcon,
  SparkNetworkIcon,
  ArkadeNetworkIcon,
  RgbNetworkIcon,
  IconButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  Icon,
  InfoPanel,
  Input,
  Pager,
  DatePicker,
  Popover,
  Tooltip,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  QueryState,
  RecordField,
  RecordItem,
  RecordList,
  RecoveryPhraseCard,
  SecretRevealCard,
  SummaryRows,
  SwapStepList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToneBadge,
  ValueList,
  useIsNarrow,
  type DateRange,
  ScrollArea,
  HorizontalScrollArea,
} from '@kaleido-ui/index'
import { Demo, Grid } from './blocks'
import { AccountMenuDemo } from './AccountMenuDemo'

// Showcase demos for the components that had none: one card per component or
// variant, on sample data, each saying when to reach for it.

// ─── Sample data ────────────────────────────────────────────────────────────

// A long page of swaps, more than the box shows: the grid scrolls up and down.
const PAIRS = ['BTC → USDT', 'USDT → BTC', 'BTC → L-BTC', 'L-BTC → USDT'] as const
const STATUSES = ['completed', 'completed', 'pending', 'completed', 'failed'] as const
type SwapStatus = (typeof STATUSES)[number]

// A table shows five rows by default; with fewer rows than that, it says exactly how many exist.
const PAGE_SIZE = 5

const swaps = Array.from({ length: PAGE_SIZE }, (_, index) => ({
  id: `sw_${(0x81f2a9c0 - index * 104729).toString(16)}`,
  pair: PAIRS[index % PAIRS.length] as string,
  sent: `${((index + 1) * 250_000).toLocaleString('en-US')} sats`,
  received: `${((index + 1) * 153.1).toFixed(2)} USDT`,
  status: STATUSES[index % STATUSES.length] as SwapStatus,
  app: index % 3 === 0 ? 'Checkout' : 'Wallet',
  at: `30 Sep, ${String(14 - Math.floor(index / 4)).padStart(2, '0')}:${String(59 - (index % 4) * 13).padStart(2, '0')}`,
}))

const statusTone = { completed: 'success', pending: 'warning', failed: 'danger' } as const

// The same swaps with every field a settlement report carries: wider than any
// card, so the table scrolls sideways on its bottom thumb.
const NETWORKS = ['Lightning', 'RGB', 'Liquid', 'Spark'] as const
const swapDetails = swaps.map((swap, index) => ({
  ...swap,
  rate: `${(61_240 + index * 47).toLocaleString('en-US')} USDT/BTC`,
  fee: `${1_200 - index * 90} sats`,
  network: NETWORKS[index % NETWORKS.length] as string,
  apiKey: index % 2 === 0 ? 'Production' : 'Staging',
  install: ['iOS', 'Web', 'Android'][index % 3],
  channel: `ch_${(0x19a0 + index * 331).toString(16)}…${(index * 13 + 15).toString(16)}`,
  order: `ord_${5520 - index}`,
  created: swap.at,
  settled: swap.status === 'completed' ? swap.at : '—',
  duration: swap.status === 'completed' ? `${58 + index} s` : '—',
}))

const WIDE_COLUMNS = [
  ['id', 'Id'], ['pair', 'Pair'], ['sent', 'Sent'], ['received', 'Received'], ['rate', 'Rate'], ['fee', 'Fee'],
  ['network', 'Network'], ['status', 'Status'], ['app', 'App'], ['apiKey', 'API key'], ['install', 'Install'],
  ['channel', 'Channel'], ['order', 'Order'], ['created', 'Created'], ['settled', 'Settled'], ['duration', 'Duration'],
] as const

// Every swap of the day: a box shows five of them and scrolls through the rest.
const SWAP_LOG_TOTAL = 128
const LOG_PAGE_SIZE = 10
const swapLog = Array.from({ length: SWAP_LOG_TOTAL }, (_, index) => ({
  id: `sw_${(0x81f2a9c0 - index * 7919).toString(16)}`,
  pair: PAIRS[index % PAIRS.length],
  sent: `${((index + 3) * 41_250).toLocaleString('en-US')} sats`,
  status: STATUSES[index % STATUSES.length],
  app: index % 3 === 0 ? 'Checkout' : 'Wallet',
  at: `30 Sep, ${String(14 - Math.floor(index / 4)).padStart(2, '0')}:${String(59 - (index % 4) * 13).padStart(2, '0')}`,
}))

// ─── Foundations ────────────────────────────────────────────────────────────

export function TableGallery() {
  const [selected, setSelected] = useState<string>(swaps[0].id)
  const [sortKey, setSortKey] = useState<'id' | 'pair' | 'sent' | 'received' | 'at' | null>(null)
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')
  const [logOffset, setLogOffset] = useState(0)
  const logPage = swapLog.slice(logOffset, logOffset + LOG_PAGE_SIZE)
  const sortBy = (key: NonNullable<typeof sortKey>) => {
    setDir(sortKey === key && dir === 'asc' ? 'desc' : 'asc')
    setSortKey(key)
  }
  const rows = sortKey
    ? [...swaps].sort((a, b) => a[sortKey].localeCompare(b[sortKey], 'en', { numeric: true }) * (dir === 'asc' ? 1 : -1))
    : swaps
  return (
    <Grid>
      <div className="xl:col-span-2">
        <Demo title="Table" use="Dense grids on desk surfaces. Caption-size cells, left-aligned throughout, a hairline between rows; it scrolls inside its own wrapper. Sortable heads are ghost buttons. showRowCount states the rows shown out of those that exist; the title and what the table shows sit above it. Click a row to select it (aria-selected).">
          {/* What the table shows is said under its title, above the grid. */}
          <div className="mb-3 space-y-1 px-4">
            <h4 className="m-0 text-subhead font-semibold text-foreground">Swaps</h4>
            <p className="m-0 text-caption text-muted-foreground">Swaps in the last 24 hours, newest first.</p>
          </div>
          <Table showRowCount>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection={sortKey === 'id' ? dir : 'none'} onSort={() => sortBy('id')}>Id</TableHead>
                <TableHead sortable sortDirection={sortKey === 'pair' ? dir : 'none'} onSort={() => sortBy('pair')}>Pair</TableHead>
                <TableHead sortable sortDirection={sortKey === 'sent' ? dir : 'none'} onSort={() => sortBy('sent')}>Sent</TableHead>
                <TableHead sortable sortDirection={sortKey === 'received' ? dir : 'none'} onSort={() => sortBy('received')}>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>App</TableHead>
                <TableHead sortable sortDirection={sortKey === 'at' ? dir : 'none'} onSort={() => sortBy('at')}>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((swap) => (
                <TableRow
                  key={swap.id}
                  aria-selected={swap.id === selected}
                  onClick={() => setSelected(swap.id)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <Copyable value={swap.id} label="swap id">
                      {swap.id.slice(0, 7)}…
                    </Copyable>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{swap.pair}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{swap.sent}</TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{swap.received}</TableCell>
                  <TableCell>
                    <ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>
                  </TableCell>
                  <TableCell>{swap.app}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{swap.at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>
      </div>
      <div className="xl:col-span-2">
        <Demo title="Table — wide" use="Sixteen columns, wider than the card: the grid scrolls sideways inside its own wrapper, on the HorizontalScrollArea thumb under the last row, and the page never widens. Cells stay on one line (whitespace-nowrap) so every row keeps one height.">
          <div className="mb-3 space-y-1 px-4">
            <h4 className="m-0 text-subhead font-semibold text-foreground">Settlement report</h4>
            <p className="m-0 text-caption text-muted-foreground">Every field of the swaps above. Scroll sideways for the rest.</p>
          </div>
          <Table showRowCount>
            <TableHeader>
              <TableRow>
                {WIDE_COLUMNS.map(([key, label]) => (
                  <TableHead key={key} className="whitespace-nowrap">{label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {swapDetails.map((swap) => (
                <TableRow key={swap.id}>
                  {WIDE_COLUMNS.map(([key]) => (
                    <TableCell
                      key={key}
                      className={cn('whitespace-nowrap', ['sent', 'received', 'rate', 'fee', 'duration'].includes(key) && 'tabular-nums', ['created', 'settled'].includes(key) && 'text-muted-foreground')}
                    >
                      {key === 'status' ? (
                        <ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>
                      ) : key === 'id' ? (
                        <Copyable value={swap.id} label="swap id">
                          {swap.id.slice(0, 7)}…
                        </Copyable>
                      ) : (
                        swap[key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Demo>
      </div>
      <div className="xl:col-span-2">
        <Demo title="Table — tall" use="128 rows, ten to a page, in a box that shows five (max-h-[21rem], the header and five rows): wrap the Table in a ScrollArea with a max height on its viewport and the grid scrolls up and down on the right-edge thumb. The Pager, with its “X of Y rows” summary, sits outside the scroll area, bottom right, so it stays put.">
          <div className="mb-3 space-y-1 px-4">
            <h4 className="m-0 text-subhead font-semibold text-foreground">Swap log</h4>
            <p className="m-0 text-caption text-muted-foreground">Today's swaps, newest first, ten to a page. Scroll down for the rest of the page.</p>
          </div>
          <ScrollArea viewportClassName="max-h-[21rem]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logPage.map((swap) => (
                  <TableRow key={swap.id}>
                    <TableCell>
                      <Copyable value={swap.id} label="swap id">
                        {swap.id.slice(0, 7)}…
                      </Copyable>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{swap.pair}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">{swap.sent}</TableCell>
                    <TableCell>
                      <ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>
                    </TableCell>
                    <TableCell>{swap.app}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{swap.at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <Pager
            className="px-4 pt-3"
            offset={logOffset}
            limit={LOG_PAGE_SIZE}
            returned={logPage.length}
            onOffsetChange={setLogOffset}
            noun="swaps"
            summary={`${logPage.length} of ${SWAP_LOG_TOTAL} rows`}
            alwaysShow
          />
        </Demo>
      </div>
    </Grid>
  )
}

const SCROLL_ROWS = Array.from({ length: 16 }, (_, index) => ({
  id: `sw_${(0x81f2 + index * 97).toString(16)}`,
  amount: `${((index + 1) * 12_500).toLocaleString('en-US')} sats`,
}))

export function ScrollbarsGallery() {
  return (
    <Grid>
      <Demo title="ScrollArea (vertical)" use="Up and down, the thumb on the right edge: 2px at rest, 6px under the pointer, never shorter than 24px. Drag it, or click the track to jump. It takes no width from the rows.">
        <ScrollArea className="h-56 rounded-xl bg-muted" viewportClassName="space-y-1 p-2">
          {SCROLL_ROWS.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-caption hover:bg-foreground/5">
              <span className="font-mono text-foreground">{row.id}</span>
              <span className="tabular-nums text-muted-foreground">{row.amount}</span>
            </div>
          ))}
        </ScrollArea>
      </Demo>
      <Demo title="ScrollArea thickness=&quot;thick&quot;" use="The thick bar, for a whole page's scroller: 6px at rest, 10px under the pointer. The showcase pages scroll on it.">
        <ScrollArea thickness="thick" className="h-56 rounded-xl bg-muted" viewportClassName="space-y-1 p-2 pr-4">
          {SCROLL_ROWS.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-caption hover:bg-foreground/5">
              <span className="font-mono text-foreground">{row.id}</span>
              <span className="tabular-nums text-muted-foreground">{row.amount}</span>
            </div>
          ))}
        </ScrollArea>
      </Demo>
      <Demo title="HorizontalScrollArea" use="Sideways, the same thumb on the bottom edge. CodeBlock and Table scroll on it; content that fits draws no thumb.">
        <div className="space-y-4">
          <HorizontalScrollArea className="rounded-xl bg-muted" viewportClassName="p-3 pb-4">
            <div className="flex w-max gap-2">
              {SCROLL_ROWS.map((row) => (
                <div key={row.id} className="w-32 shrink-0 rounded-lg bg-card px-3 py-2 text-caption">
                  <div className="font-mono text-foreground">{row.id}</div>
                  <div className="tabular-nums text-muted-foreground">{row.amount}</div>
                </div>
              ))}
            </div>
          </HorizontalScrollArea>
          <HorizontalScrollArea className="rounded-xl bg-muted" viewportClassName="p-3 text-caption text-muted-foreground">
            Fits: no thumb.
          </HorizontalScrollArea>
        </div>
      </Demo>
      <Demo title="HorizontalScrollArea thickness=&quot;thick&quot;" use="The thick bar on the bottom edge: 6px at rest, 10px under the pointer — for a wide board or timeline that is a view of its own.">
        <HorizontalScrollArea thickness="thick" className="rounded-xl bg-muted" viewportClassName="p-3 pb-5">
          <div className="flex w-max gap-2">
            {SCROLL_ROWS.map((row) => (
              <div key={row.id} className="w-32 shrink-0 rounded-lg bg-card px-3 py-2 text-caption">
                <div className="font-mono text-foreground">{row.id}</div>
                <div className="tabular-nums text-muted-foreground">{row.amount}</div>
              </div>
            ))}
          </div>
        </HorizontalScrollArea>
      </Demo>
    </Grid>
  )
}

export function FormsGallery() {
  const [url, setUrl] = useState('http://example.com/hook')
  const invalid = !url.startsWith('https://')
  return (
    <Grid>
      <Demo title="FormField" use="A label, its control, a hint and an error, wired with htmlFor, aria-describedby and aria-invalid. Type an https:// URL to clear the error.">
        <div className="space-y-4">
          <FormField label="Webhook URL" hint="We send a POST for every settled swap." error={invalid ? 'Use an https:// URL.' : undefined}>
            <Input value={url} onChange={(event) => setUrl(event.target.value)} />
          </FormField>
          <FormField label="App name" hint="Shown to your users in the wallet.">
            <Input defaultValue="Checkout" />
          </FormField>
        </div>
      </Demo>
    </Grid>
  )
}

// ─── Display ────────────────────────────────────────────────────────────────

export function AvatarGallery() {
  return (
    <Demo title="Avatar" use="A circle with the name's initials on the violet-to-info gradient; a custom image takes their place when there is one. 32 px by default, 40 px with size=&quot;lg&quot;. Decorative unless alt is set with an image.">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar initials="JD" />
        <Avatar initials="JD" size="lg" />
        <Avatar src="/brand/kaleidoswap-pictogram.svg" alt="KaleidoSwap" initials="KS" size="lg" className="bg-card" />
      </div>
    </Demo>
  )
}

export function CollapsibleGallery() {
  const [open, setOpen] = useState(false)
  return (
    <Grid>
      <Demo title="Collapsible row" use="BasicCollapsible. A compact row that opens a few lines of detail inside a surface that already exists: advanced settings under a form, the fine print under an amount. No box of its own (it takes the surface it sits in), a turning chevron, caption text.">
        <div className="rounded-xl bg-surface-inset/40 p-2 shadow-raised">
          <BasicCollapsible title="Advanced settings">
            Slippage, route preferences and the fee cap live here.
          </BasicCollapsible>
        </div>
      </Demo>
      <Demo title="Disclosure card" use="DisclosureCard. The same Collapsible dressed as a card: the box holds both the trigger and the body, with an optional icon. Use it when the explanation is a block of its own on the page (what these fees are); NetworkInfoDisclosure is built on it.">
        <DisclosureCard title="What are these fees?" open={open} onOpenChange={setOpen} icon={<Icon name="info" className="text-icon-md text-muted-foreground" />}>
          <p className="m-0 text-caption text-muted-foreground">The network fee pays the miners; the swap fee pays the market maker.</p>
        </DisclosureCard>
      </Demo>
      <Demo title="Disclosure card with action" use="DisclosureCard with the action prop. A button under the body, inside the same box, that appears once it is open: use it when the explanation ends in a next step (learn more, change the setting).">
        <DisclosureCard title="Why is my deposit pending?" defaultOpen icon={<Icon name="info" className="text-icon-md text-muted-foreground" />} action={<Button variant="surface" size="sm">View status</Button>}>
          <p className="m-0 text-caption text-muted-foreground">On-chain deposits need three confirmations before they are credited.</p>
        </DisclosureCard>
      </Demo>
    </Grid>
  )
}

// ─── Overlays ───────────────────────────────────────────────────────────────

/** The secret-shown-once dialog: no corner X, it closes only through its own action. */
export function DialogShowCloseDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-6 flex flex-col items-start gap-4">
      <p className="m-0 text-caption text-muted-foreground">
        <code>showClose={'{false}'}</code> — a secret shown once must not sit beside a control that reads as “close”.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create API key</Button>
        </DialogTrigger>
        <DialogContent
          showClose={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Your new API key</DialogTitle>
            <DialogDescription>Store it now: it will not be shown again.</DialogDescription>
          </DialogHeader>
          <Copyable value="kx_live_9f2c81d0a3b4e5f6a7b8c9d0" label="API key" />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>I have stored this key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const MENU_APPS = [
  'Acme Wallet (iOS)',
  'Acme Wallet (Android)',
  'Acme Web',
  'Acme Checkout',
  'Acme Extension',
  'Acme Telegram bot',
  'Partner portal',
  'Backoffice',
  'Sandbox',
  'Staging',
]

/**
 * The network filter, as the Popover & Menu demo shows it. Feature Components
 * renders this same element, so a change here shows in both places.
 */
export function NetworkFilterDropdown({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <FilterDropdown
      label="Network"
      value={value}
      onChange={onChange}
      options={[
        { id: 'all', label: 'All Networks', icon: <Icon name="hub" size="sm" /> },
        { id: 'lightning', label: 'Lightning', icon: <LightningNetworkIcon className="size-4" /> },
        { id: 'spark', label: 'Spark', icon: <SparkNetworkIcon className="size-4" /> },
        { id: 'arkade', label: 'Arkade', icon: <ArkadeNetworkIcon className="size-4 rounded-sm" /> },
        { id: 'rgb', label: 'RGB', icon: <RgbNetworkIcon className="size-4" /> },
      ]}
    />
  )
}

export function PopoverMenuGallery() {
  const [environment, setEnvironment] = useState('production')
  const [app, setApp] = useState<string>(MENU_APPS[0])
  const [network, setNetwork] = useState('all')
  const [last, setLast] = useState('—')
  const [date, setDate] = useState('')
  return (
    <Grid>
      <Demo title="Popover" use="A panel anchored to a trigger for content that is not a menu. Tab walks it in order; Escape or a click outside closes it and focus returns to the trigger.">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon name="key" className="text-icon-md" />
              API key details
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-3">
              <p className="m-0 font-semibold text-foreground">Production key</p>
              <Copyable value="kx_live_9f2c81d0a3b4" label="key prefix">kx_live_9f2c…</Copyable>
              <p className="m-0 text-muted-foreground">Created 12 Sep 2026 · last used 2 hours ago.</p>
              <PopoverClose asChild>
                <Button variant="ghost" size="sm" className="mt-2">Close</Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </Demo>
      <Demo title="DropdownMenu" use="A real menu of actions: items, a label, a separator, a destructive item kept last. Arrow keys move, Enter selects. Past four items it scrolls and opens with a search field.">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Key actions">
                <Icon name="apps" className="text-icon-md" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Production key</DropdownMenuLabel>
              <DropdownMenuItem icon={<Icon name="edit" />} onSelect={() => setLast('Rename')}>Rename</DropdownMenuItem>
              <DropdownMenuItem icon={<Icon name="refresh" />} onSelect={() => setLast('Rotate')}>Rotate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive icon={<Icon name="delete" />} onSelect={() => setLast('Revoke')}>Revoke</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-caption text-muted-foreground">Last chosen: {last}</span>
        </div>
      </Demo>
      <Demo title="AccountMenu" use="Who is signed in, at the end of the top bar: avatar, name, company and role, and the account's entries. A disclosure, not a menu; the panel is the same surface as Popover and DropdownMenu.">
        <AccountMenuDemo />
      </Demo>
      <Demo title="DatePicker" use="One date from a month grid in a Popover, under a field-styled trigger. The value is YYYY-MM-DD. The grid is one Tab stop: arrows move by day or week, PageUp/PageDown by month, Enter selects; days outside min/max are disabled.">
        <div className="w-full max-w-64">
          <DatePicker value={date} onChange={setDate} aria-label="Date" max="2026-12-31" />
        </div>
      </Demo>
      <Demo title="Select" use="Picks a value that stays set: the trigger shows it, the menu ticks it. Up to four options it shows them all; past four it shows four, scrolls the rest and opens with a search field. hug makes the trigger as wide as its value. Every select in the library is this one.">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger hug aria-label="Environment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="sandbox">Sandbox</SelectItem>
            </SelectContent>
          </Select>
          <Select value={app} onValueChange={setApp}>
            <SelectTrigger hug aria-label="App">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MENU_APPS.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Demo>
      <Demo title="FilterDropdown" use="A filter with an icon per option, for a narrow wallet surface: a full-width pill with the label and a +N count, opening a panel of options as wide as itself, over the content below. Past four options it shows four and scrolls the rest; it is not a Select, so there is no search. Used by the extension dashboard's network filter.">
        <NetworkFilterDropdown value={network} onChange={setNetwork} />
      </Demo>
    </Grid>
  )
}

// ─── Data ───────────────────────────────────────────────────────────────────

export function CopyGallery() {
  const [revealed, setRevealed] = useState(false)
  const [phraseRevealed, setPhraseRevealed] = useState(false)
  return (
    <Grid>
      <Demo title="CopyButton" use="A 24px icon button: the check only after a real copy, a visible alert when the clipboard refuses. Outside a secure context the second state is what you will see.">
        <div className="flex flex-wrap items-center gap-4 text-caption">
          <span className="flex items-center gap-1">
            Transaction id <CopyButton value="4f1c9a2e7b3d8801c0e5a6f7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f7a8b" label="transaction id" />
          </span>
          <span className="flex items-center gap-1">
            Payout address <CopyButton value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" label="payout address" />
          </span>
        </div>
      </Demo>
      <Demo title="Copyable" use="The value (or a shortened form) plus its copy button. The text stays select-all and its title is the full value — which is also what gets copied.">
        <div className="space-y-2">
          <Copyable value="sw_81f2a9c0d1e2f3a4" label="swap id">sw_81f2…f3a4</Copyable>
          <Copyable value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" label="address" />
        </div>
      </Demo>
      <Demo title="CodeBlock" use="A monospaced block that scrolls sideways inside its margins, with its copy button top right.">
        <CodeBlock
          label="install command"
          language="bash"
          code={'npm install kaleido-ui @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-collapsible'}
        />
      </Demo>
      <Demo title="copyValue on existing components" use="ActivityDetailRow, SecretRevealCard and RecoveryPhraseCard now copy themselves and say when it failed.">
        <div className="space-y-4">
          <ActivityDetailRow label="Swap id" value="sw_81f2…f3a4" copyValue="sw_81f2a9c0d1e2f3a4" />
          <SecretRevealCard
            value="kx_live_9f2c81d0a3b4e5f6a7b8c9d0"
            revealed={revealed}
            onRevealChange={setRevealed}
            copyValue="kx_live_9f2c81d0a3b4e5f6a7b8c9d0"
          />
          <RecoveryPhraseCard
            words={['orbit', 'lemon', 'canvas', 'drift', 'polar', 'violet', 'anchor', 'ember', 'tidal', 'quiet', 'north', 'frost']}
            revealed={phraseRevealed}
            onRevealChange={setPhraseRevealed}
            copyValue="orbit lemon canvas drift polar violet anchor ember tidal quiet north frost"
          />
        </div>
      </Demo>
    </Grid>
  )
}

// The segmented form of FilterChipGroup: a choice between exclusive options,
// shown in Lists & filters beside the chips, the same component.
function SegmentedControlDemo() {
  const [view, setView] = useState<'chart' | 'list'>('chart')
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  return (
    <Demo title="Segmented control" use='FilterChipGroup variant="segmented": mutually exclusive options, one Tab stop, the arrow keys move and select. Options can be icon-only (named by ariaLabel, also their tooltip).'>
      <div className="flex flex-col gap-4">
        {/* One toolbar line: the timeframe at the left, the chart format and the filters at the right. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChipGroup<'7d' | '30d' | '90d'>
            variant="segmented"
            ariaLabel="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
            ]}
          />
          <div className="flex items-center gap-2">
            <IconButton label="Filters" variant="quiet" icon={<Icon name="tune" aria-hidden="true" />} />
            <FilterChipGroup<'chart' | 'list'>
              variant="segmented"
              ariaLabel="Trend view"
              value={view}
              onChange={setView}
              options={[
                { value: 'chart', ariaLabel: 'Chart view', icon: <Icon name="trending_up" className="text-icon-md" /> },
                { value: 'list', ariaLabel: 'List view', icon: <Icon name="menu" className="text-icon-md" /> },
              ]}
            />
          </div>
        </div>
        <p className="m-0 text-caption text-muted-foreground">
          View: {view} · Period: {period}
        </p>
      </div>
    </Demo>
  )
}

const PERIODS = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: 'wtd', label: 'Week to date' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'mtd', label: 'Month to date' },
  { value: '90d', label: 'Last 90 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range' },
] as const

type Period = (typeof PERIODS)[number]['value']
const DEFAULT_PERIOD: Period = '12m'

const ALL = 'all'
type FilterKey = 'app' | 'apiKey' | 'install' | 'pair'

// More than four options, so these menus scroll and open with a search field.
const LIST_FILTERS: { key: FilterKey; label: string; all: string; options: string[] }[] = [
  { key: 'app', label: 'App', all: 'All apps', options: ['Wallet', 'Checkout', 'Extension'] },
  { key: 'apiKey', label: 'API key', all: 'All API keys', options: ['Production', 'Staging', 'Sandbox', 'Mobile app', 'Partner portal', 'Backoffice'] },
  { key: 'install', label: 'Install', all: 'All installs', options: ['iOS', 'Android', 'Web', 'Desktop', 'Browser extension', 'Telegram bot'] },
  { key: 'pair', label: 'Pair', all: 'All pairs', options: ['BTC / USDT', 'BTC / L-BTC', 'USDT / L-BTC', 'BTC / USDC', 'USDT / USDC', 'L-BTC / USDC'] },
]

const logRows = [
  { label: 'Quote accepted', value: '14:02:01', tone: 'muted' as const },
  { label: 'Invoice paid', value: '14:02:09', tone: 'muted' as const },
  { label: 'Swap settled', value: '14:02:50', tone: 'muted' as const },
]

/** Display > Lists: the plain lists, a log in two spacings and a checklist. */
export function DisplayListsGallery() {
  return (
    <Grid>
      <Demo title="Log, short" use='SummaryRows as="ol" and tone="muted". An ordered log: the event, and its timestamp quieter than it. spacing="short" (default) keeps rows tight, for a few lines inside a card.'>
        <SummaryRows as="ol" rows={logRows} />
      </Demo>
      <Demo title="Log, long" use='The same log with spacing="long": more room between lines, for a list that is the content of its block and is read top to bottom.'>
        <SummaryRows as="ol" spacing="long" rows={logRows} />
      </Demo>
      <Demo title="Checklist" use='connector={false}: done / to do / cannot be checked, each with its own glyph and a spoken status, badges and an action.'>
        <SwapStepList
          connector={false}
          steps={[
            { id: 'key', label: 'Create an API key', status: 'done', description: 'kx_live_9f2c… created 12 Sep.' },
            {
              id: 'hook',
              label: 'Register a webhook',
              status: 'pending',
              badges: <ToneBadge tone="warning">Required</ToneBadge>,
              action: <Button variant="surface" size="sm">Open settings</Button>,
            },
            { id: 'sdk', label: 'The SDK reports swaps', status: 'unknown', description: 'We cannot see this until the first swap arrives.' },
          ]}
        />
      </Demo>
    </Grid>
  )
}

/** One swap as a receipt: identity and status, what moved, the fee behind a disclosure, then the log. */
function SwapReceipt() {
  return (
    <div className={cn(cardSurface, 'max-w-md space-y-4 p-5')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-subhead font-semibold text-foreground">BTC → USDT</div>
          <Copyable value="swp_7f3a91c2e84b" label="swap id">
            <span className="text-tiny">swp_7f3a91c2e84b</span>
          </Copyable>
        </div>
        <ToneBadge tone="success">completed</ToneBadge>
      </div>
      <SummaryRows
        rows={[
          { label: 'You paid', value: '1,005 sats' },
          { label: 'You received', value: '0.71 USDT', emphasis: true, hint: '0.5% spread' },
          { label: 'Counterparty', value: '66422c…e3ce', mono: true },
        ]}
      />
      <BasicCollapsible title="Fee breakdown" triggerClassName="px-0">
        <SummaryRows
          rows={[
            { label: 'Network fee', value: '3 sats' },
            { label: 'Service fee', value: '2 sats' },
            { label: 'Total fee', value: '5 sats', emphasis: true },
          ]}
        />
      </BasicCollapsible>
      <div className="border-t border-divider/40 pt-3">
        <div className="mb-1 text-mini font-medium uppercase tracking-eyebrow text-muted-foreground">History</div>
        <SummaryRows as="ol" rows={logRows} />
      </div>
    </div>
  )
}

export function ListsGallery() {
  const narrow = useIsNarrow()
  const [mode, setMode] = useState<'loading' | 'error' | 'forbidden' | 'empty' | 'data'>('data')
  const [offset, setOffset] = useState(0)
  const [range, setRange] = useState<DateRange>({ from: '2026-09-01', to: '' })
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ app: ALL, apiKey: ALL, install: ALL, pair: ALL })
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD)
  const [opened, setOpened] = useState<string | null>(null)
  const activeCount =
    LIST_FILTERS.filter((filter) => filters[filter.key] !== ALL).length + (period !== DEFAULT_PERIOD ? 1 : 0)
  const pageRows = [50, 50, 50, 23]
  const pagerTotal = pageRows.reduce((sum, rows) => sum + rows, 0)

  return (
    <div className="space-y-16">
      <Grid>
        <Demo title="QueryState" align="top" use="Loading, error and empty kept apart, so a failed read never looks like an empty list. Switch the state.">
          <div className="space-y-4">
            <FilterChipGroup
              variant="segmented"
              ariaLabel="Query state"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'data', label: 'Data' },
                { value: 'loading', label: 'Loading' },
                { value: 'error', label: 'Error' },
                { value: 'forbidden', label: 'No access' },
                { value: 'empty', label: 'Empty' },
              ]}
            />
            <QueryState
              isLoading={mode === 'loading'}
              loadingLabel="Loading swaps"
              error={mode === 'error' ? new Error('The server answered 503.') : mode === 'forbidden' ? { status: 403 } : undefined}
              classifyError={(error) =>
                (error as { status?: number }).status === 403
                  ? { title: 'No access', message: 'Only admins can see swaps. Ask one to invite you.', tone: 'info', retryable: false }
                  : { title: 'Could not load swaps', message: (error as Error).message, tone: 'danger', retryable: true }
              }
              errorConsequence="The totals above may be out of date."
              onRetry={() => setMode('data')}
              isEmpty={mode === 'empty'}
              emptyTitle="No swaps in this range"
              emptyDescription="Widen the dates or drop the app filter."
              emptyAction={<Button variant="surface" size="sm" onClick={() => setMode('data')}>Reset filters</Button>}
            >
              <EventTimeline
                label="Status history"
                events={[
                  { id: '1', label: 'Quote accepted', timestamp: '14:02:01' },
                  { id: '2', label: 'Invoice paid', duration: '+8s', timestamp: '14:02:09' },
                  { id: '3', label: 'Swap settled', duration: '+41s', timestamp: '14:02:50' },
                ]}
              />
            </QueryState>
          </div>
        </Demo>
        <Demo title="EmptyState" use="Title, description, one action — centred.">
          <EmptyState
            icon={<Icon name="receipt_long" className="text-icon-4xl" />}
            title="No payouts yet"
            description="Payouts appear here once your first swap settles."
            action={<Button variant="surface" size="sm">Open Quickstart</Button>}
          />
        </Demo>
      </Grid>

      <Demo title="FilterBar + DateRangeFilter" use="The filters of a list: a period, an app, an API key, an install and a pair, as selects that hug their value and show four items before they scroll, with a search field past four. Custom range opens the date inputs; Refresh stays after the last filter. Wide: in a row, with “N filters applied” and Clear all. Narrow (resize below 640px): one Filters toggle that opens them.">
        <FilterBar
          activeCount={activeCount}
          onClear={() => {
            setFilters({ app: ALL, apiKey: ALL, install: ALL, pair: ALL })
            setPeriod(DEFAULT_PERIOD)
            setRange({ from: '', to: '' })
          }}
        >
          <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <SelectTrigger hug aria-label="Period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {LIST_FILTERS.map((filter) => (
            <Select
              key={filter.key}
              value={filters[filter.key]}
              onValueChange={(value) => setFilters((current) => ({ ...current, [filter.key]: value }))}
            >
              <SelectTrigger hug aria-label={filter.label}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{filter.all}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {/* Custom range opens the dates; Clear all, under the bar, empties them too. */}
          {period === 'custom' && <DateRangeFilter showClear={false} value={range} onChange={setRange} />}
          {/* Refresh always sits after the last filter, whichever that is. */}
          <IconButton
            label="Refresh"
            variant="surface"
            size="lg"
            disabled={refreshing}
            aria-busy={refreshing || undefined}
            onClick={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1500)
            }}
            icon={<Icon name="refresh" aria-hidden="true" className={cn(refreshing && 'animate-spin motion-reduce:animate-none')} />}
          />
        </FilterBar>
        <p className="mt-3 text-caption text-muted-foreground">useIsNarrow() is {String(narrow)} at this width.</p>
      </Demo>

      <SegmentedControlDemo />

      <Grid>
        <Demo title="Pager" use="Offset paging: a next page only after a full page. With a known total, summary says “X of Y rows”; without one, the default is the range (“swaps 51–100”), never “of N”.">
          <Pager
            offset={offset}
            limit={50}
            returned={pageRows[offset / 50] ?? 0}
            noun="swaps"
            summary={`${pageRows[offset / 50] ?? 0} of ${pagerTotal} rows`}
            onOffsetChange={setOffset}
          />
        </Demo>
        <Demo title="ValueList" use="A list of strings in a cell, never truncated: a count that opens into copyable values.">
          <ValueList
            singular="address"
            plural="addresses"
            values={['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'bc1q9h6yzl9kh2y0q3v3r8x7a6f5e4d3c2b1a0z9y8', 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx']}
          />
        </Demo>
      </Grid>

      <Demo title="RecordList" use="The stacked form of a table row, for narrow screens. Tap an item or its chevron to open it; the actions do not open it.">
        <RecordList aria-label="Swaps">
          {swaps.map((swap) => (
            <RecordItem
              key={swap.id}
              identifier={swap.id}
              columns={4}
              reserveActions
              summary={swap.pair}
              status={<ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>}
              onOpen={() => setOpened(swap.id)}
              openLabel={`swap ${swap.id}`}
              selected={opened === swap.id}
              actions={swap.status === 'failed' ? <Button variant="surface" size="sm">Refund</Button> : undefined}
            >
              <RecordField label="Sent">{swap.sent}</RecordField>
              <RecordField label="Received">{swap.received}</RecordField>
              <RecordField label="App">{swap.app}</RecordField>
              <RecordField label="Time">{swap.at}</RecordField>
            </RecordItem>
          ))}
        </RecordList>
      </Demo>

      <Demo title="Receipt" use='SummaryRows in a composed card: identity and status, rows with the deciding figure emphasised, a BasicCollapsible holding a second list, and an ordered log with tone="muted".'>
        <SwapReceipt />
      </Demo>
    </div>
  )
}


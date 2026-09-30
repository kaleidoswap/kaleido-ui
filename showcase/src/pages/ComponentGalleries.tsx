import { useState, type ReactNode } from 'react'
import {
  ActivityDetailRow,
  Avatar,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
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
  FloatingNotice,
  FormField,
  Icon,
  InfoPanel,
  Input,
  MetricCard,
  NoticeBar,
  PageHeader,
  Pager,
  Popover,
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  ToneBadge,
  ValueList,
  useIsNarrow,
  type DateRange,
} from '@kaleido-ui/index'

// Showcase demos for the components that had none: one card per component or
// variant, on sample data, each saying when to reach for it.

function Demo({ title, use, children }: { title: string; use: string; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-subhead">{title}</CardTitle>
        <CardDescription className="text-caption">{use}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

// `min-w-0` on the items: a grid item keeps its content's min-content width by
// default, so a wide table would stretch its card past the page.
const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-4 xl:grid-cols-2 [&>*]:min-w-0">{children}</div>
)

// ─── Sample data ────────────────────────────────────────────────────────────

const swaps = [
  { id: 'sw_81f2a9c0d1', pair: 'BTC → USDT', sent: '1,000,000 sats', received: '612.40 USDT', status: 'completed', app: 'Wallet', at: '30 Sep, 14:02' },
  { id: 'sw_7c11e4b2aa', pair: 'USDT → BTC', sent: '250.00 USDT', received: '405,120 sats', status: 'pending', app: 'Checkout', at: '30 Sep, 13:47' },
  { id: 'sw_5d90f1c377', pair: 'BTC → L-BTC', sent: '50,000 sats', received: '49,850 sats', status: 'failed', app: 'Wallet', at: '30 Sep, 12:15' },
] as const

const statusTone = { completed: 'success', pending: 'warning', failed: 'danger' } as const

// ─── Foundations ────────────────────────────────────────────────────────────

export function TableGallery() {
  const [selected, setSelected] = useState<string>(swaps[0].id)
  return (
    <Grid>
      <div className="xl:col-span-2">
        <Demo title="Table" use="Dense grids on desk surfaces. Caption-size cells, eyebrow heads, a hairline between rows; it scrolls inside its own wrapper. Click a row to select it (aria-selected).">
          <Table>
            <TableCaption>Swaps in the last 24 hours</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>App</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swaps.map((swap) => (
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
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{swap.sent}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">{swap.received}</TableCell>
                  <TableCell>
                    <ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>
                  </TableCell>
                  <TableCell>{swap.app}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{swap.at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>3 swaps</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Demo>
      </div>
    </Grid>
  )
}

export function FormsGallery() {
  const [url, setUrl] = useState('http://example.com/hook')
  const [view, setView] = useState<'chart' | 'list'>('chart')
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
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
      <Demo title="Segmented control" use='FilterChipGroup variant="segmented": mutually exclusive options, one Tab stop, the arrow keys move and select. Options can be icon-only (named by ariaLabel, also their tooltip).'>
        <div className="flex flex-col items-start gap-4">
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
          <p className="m-0 text-caption text-muted-foreground">
            View: {view} · Period: {period}
          </p>
        </div>
      </Demo>
    </Grid>
  )
}

// ─── Display ────────────────────────────────────────────────────────────────

export function BadgesGallery() {
  return (
    <Grid>
      <Demo title="ToneBadge — tones" use="A status as the eyebrow. secondary (violet) and outline stand in for a Badge's secondary and outline variants.">
        <div className="flex flex-wrap gap-2">
          {(['muted', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'outline'] as const).map((tone) => (
            <ToneBadge key={tone} tone={tone}>
              {tone}
            </ToneBadge>
          ))}
        </div>
      </Demo>
      <Demo title='ToneBadge case="none"' use="A value rather than a status: caption size, no uppercase, tabular figures.">
        <div className="flex flex-wrap gap-2">
          <ToneBadge tone="primary" case="none">1,250,000 sats</ToneBadge>
          <ToneBadge tone="secondary" case="none">12 installs</ToneBadge>
          <ToneBadge tone="outline" case="none">v2.4.1</ToneBadge>
        </div>
      </Demo>
    </Grid>
  )
}

export function AvatarGallery() {
  return (
    <Grid>
      <Demo title="Avatar" use="sm 32px, lg 40px. An image, or initials / the person glyph on the violet-to-info gradient. Decorative unless alt is set with an image.">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar initials="EJ" />
          <Avatar initials="EJ" size="lg" />
          <Avatar />
          <Avatar size="lg" />
          <Avatar src="/brand/kaleidoswap-pictogram.svg" alt="KaleidoSwap" size="lg" className="bg-card" />
          <Avatar src="/missing-image.png" initials="MW" size="lg" />
        </div>
        <p className="mt-3 text-caption text-muted-foreground">The last one points at a missing image and falls back to its initials.</p>
      </Demo>
    </Grid>
  )
}

export function CollapsibleGallery() {
  const [open, setOpen] = useState(false)
  return (
    <Grid>
      <Demo title="Collapsible" use="A button that opens and closes a section, with aria-expanded / aria-controls and a turning chevron. Uncontrolled here.">
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl bg-muted px-3 py-2 text-caption font-semibold text-foreground">
            Advanced settings
            <CollapsibleChevron />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-xl bg-muted/40 p-3 text-caption text-muted-foreground">
            Slippage, route preferences and the fee cap live here.
          </CollapsibleContent>
        </Collapsible>
      </Demo>
      <Demo title="DisclosureCard" use="A card-styled Collapsible, controlled by its parent. Now built on Collapsible.">
        <DisclosureCard title="What are these fees?" open={open} onOpenChange={setOpen} icon={<Icon name="info" className="text-icon-md text-muted-foreground" />}>
          <p className="m-0 text-caption text-muted-foreground">The network fee pays the miners; the swap fee pays the market maker.</p>
        </DisclosureCard>
        <p className="mt-3 text-caption text-muted-foreground">Open: {String(open)}</p>
      </Demo>
    </Grid>
  )
}

// ─── Overlays ───────────────────────────────────────────────────────────────

/** The secret-shown-once dialog: no corner X, it closes only through its own action. */
export function DialogShowCloseDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-6 space-y-2">
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

export function PopoverMenuGallery() {
  const [last, setLast] = useState('—')
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
                <Button variant="ghost" size="sm">Close</Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </Demo>
      <Demo title="DropdownMenu" use="A real menu: items, a label, a separator, a destructive item kept last. Arrow keys move, Enter selects.">
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
    </Grid>
  )
}

export function NoticesGallery() {
  const [bar, setBar] = useState(false)
  const [floating, setFloating] = useState(false)
  return (
    <Grid>
      <Demo title="NoticeBar" use="Fixed to the top, full width, above the page. It publishes its height as --kui-notice-height so the page can move down. Try it: the bar appears at the very top of the window.">
        <div className="space-y-3">
          <Button variant="outline" size="sm" onClick={() => setBar(!bar)}>
            {bar ? 'Hide the notice bar' : 'Show the notice bar'}
          </Button>
          <p className="m-0 text-caption text-muted-foreground">
            The page padding below uses <code>var(--kui-notice-height, 0px)</code>.
          </p>
        </div>
        <NoticeBar hidden={!bar}>
          <InfoPanel tone="warning" title="Scheduled maintenance">
            Swaps pause on 3 October from 02:00 to 02:30 UTC.
          </InfoPanel>
        </NoticeBar>
        {bar && <div aria-hidden="true" style={{ height: 'var(--kui-notice-height, 0px)' }} />}
      </Demo>
      <Demo title="FloatingNotice" use="Bottom centre, above dialogs, until it is closed. It does not time out or queue like a toast.">
        <Button variant="outline" size="sm" onClick={() => setFloating(true)} disabled={floating}>
          Show the floating notice
        </Button>
        {floating && (
          <FloatingNotice onDismiss={() => setFloating(false)}>
            <InfoPanel tone="info" title="Testnet">
              You are on signet. Funds here have no value.
            </InfoPanel>
          </FloatingNotice>
        )}
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
      <Demo title="CodeBlock" use="A monospaced block that scrolls sideways, with its copy button top right.">
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

export function ListsGallery() {
  const narrow = useIsNarrow()
  const [mode, setMode] = useState<'loading' | 'error' | 'forbidden' | 'empty' | 'data'>('data')
  const [offset, setOffset] = useState(0)
  const [range, setRange] = useState<DateRange>({ from: '2026-09-01', to: '' })
  const [refreshing, setRefreshing] = useState(false)
  const [app, setApp] = useState<'all' | 'wallet' | 'checkout'>('all')
  const [opened, setOpened] = useState<string | null>(null)
  const activeCount = (app !== 'all' ? 1 : 0) + (range.from || range.to ? 1 : 0)
  const pageRows = [50, 50, 50, 23]

  return (
    <div className="space-y-4">
      <Grid>
        <Demo title="QueryState" use="Loading, error and empty kept apart, so a failed read never looks like an empty list. Switch the state.">
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
            icon={<Icon name="receipt_long" className="text-icon-4xl text-muted-foreground" />}
            title="No payouts yet"
            description="Payouts appear here once your first swap settles."
            action={<Button variant="surface" size="sm">Open Quickstart</Button>}
          />
        </Demo>
      </Grid>

      <Demo title="FilterBar + DateRangeFilter" use="The filters of a list. Wide: in a row, with “N filters applied” and Clear all. Narrow (resize below 640px): one Filters toggle that opens them.">
        <FilterBar
          activeCount={activeCount}
          onClear={() => {
            setApp('all')
            setRange({ from: '', to: '' })
          }}
        >
          <DateRangeFilter
            value={range}
            onChange={setRange}
            isRefreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1500)
            }}
          />
          <FilterChipGroup
            ariaLabel="App"
            value={app}
            onChange={setApp}
            options={[
              { value: 'all', label: 'All apps' },
              { value: 'wallet', label: 'Wallet' },
              { value: 'checkout', label: 'Checkout' },
            ]}
          />
        </FilterBar>
        <p className="mt-3 text-caption text-muted-foreground">useIsNarrow() is {String(narrow)} at this width.</p>
      </Demo>

      <Grid>
        <Demo title="RecordList" use="The stacked form of a table row, for narrow screens. Tap an item or its chevron to open it; the actions do not open it.">
          <RecordList aria-label="Swaps">
            {swaps.map((swap) => (
              <RecordItem
                key={swap.id}
                identifier={swap.id}
                summary={swap.pair}
                status={<ToneBadge tone={statusTone[swap.status]}>{swap.status}</ToneBadge>}
                onOpen={() => setOpened(swap.id)}
                openLabel={`swap ${swap.id}`}
                selected={opened === swap.id}
                actions={swap.status === 'failed' ? <Button variant="ghost" size="sm">Refund</Button> : undefined}
              >
                <RecordField label="Sent">{swap.sent}</RecordField>
                <RecordField label="Received">{swap.received}</RecordField>
                <RecordField label="App">{swap.app}</RecordField>
                <RecordField label="Time">{swap.at}</RecordField>
              </RecordItem>
            ))}
          </RecordList>
          <p className="mt-3 text-caption text-muted-foreground">Opened: {opened ?? '—'}</p>
        </Demo>
        <div className="space-y-4">
          <Demo title="Pager" use="Offset paging with no total: a next page only after a full page, never “of N”.">
            <Pager
              offset={offset}
              limit={50}
              returned={pageRows[offset / 50] ?? 0}
              noun="swaps"
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
          <Demo title="Checklist (SwapStepList)" use='connector={false}: done / to do / cannot be checked, each with its own glyph and a spoken status, badges and an action.'>
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
        </div>
      </Grid>
    </div>
  )
}

export function PageLayoutGallery() {
  return (
    <div className="space-y-4">
      <Demo title='PageHeader variant="page"' use="A desk page's header: the page's h1, a line of description and one action aligned with the title, wrapping under it on a phone.">
        <div className="rounded-xl bg-background p-4">
          <PageHeader
            variant="page"
            title="API keys"
            description="Keys your apps use to call the platform."
            action={
              <Button size="sm">
                <Icon name="add" className="text-icon-md" />
                Create key
              </Button>
            }
          />
        </div>
      </Demo>
      <Grid>
        <Demo title="MetricCard — compact and comfortable" use="compact is the phone tile; comfortable the desk tile, with the figure in headline and the icon after it.">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Swaps" value="1,284" icon="swap_horiz" tone="primary" description="this week" />
            <MetricCard size="comfortable" label="Swaps" value="1,284" icon="swap_horiz" tone="primary" description="this week" />
          </div>
        </Demo>
        <Demo title='SummaryRows as="ol" and tone="muted"' use="An ordered log: the event, and its timestamp quieter than it.">
          <SummaryRows
            as="ol"
            rows={[
              { label: 'Quote accepted', value: '14:02:01', tone: 'muted' },
              { label: 'Invoice paid', value: '14:02:09', tone: 'muted' },
              { label: 'Swap settled', value: '14:02:50', tone: 'muted' },
            ]}
          />
        </Demo>
      </Grid>
    </div>
  )
}

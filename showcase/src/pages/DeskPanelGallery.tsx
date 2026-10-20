import { useState, type ReactNode } from 'react'
import {
  AccountMenu,
  AccountMenuItem,
  AccountMenuSeparator,
  Amount,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Choice,
  ChoiceGroup,
  ConfirmDialog,
  Copyable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EnvironmentIndicator,
  Icon,
  InstantsStatement,
  ListField,
  ListSummary,
  MetricCard,
  OneTimeSecretDialog,
  Pager,
  PeriodSelect,
  ReadStatus,
  Restricted,
  Tooltip,
  cn,
  useDiscardGuard,
  type DateRange,
} from '@kaleido-ui/index'

// The pieces a desk app (a dashboard, a back office) is assembled from: role-gated controls,
// confirmations, list fields, the period, how fresh the figures are, and who
// is signed in. One card each, on sample data, saying when to reach for it.

function Demo({ title, use, children, className }: { title: string; use: string; children: ReactNode; className?: string }) {
  return (
    <Card variant="secondary" className={cn('min-w-0', className)}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-subhead">{title}</CardTitle>
        <CardDescription className="text-caption">{use}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto p-4">{children}</CardContent>
    </Card>
  )
}

const Grid = ({ children }: { children: ReactNode }) => (
  <div className="grid gap-4 xl:grid-cols-2 [&>*]:min-w-0">{children}</div>
)

const PERIODS = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'month', label: 'This month' },
  { id: 'custom', label: 'Custom range' },
] as const
type PeriodId = (typeof PERIODS)[number]['id']

const checkOrigin = (item: string) =>
  /^https:\/\/[^/\s]+$/.test(item) ? null : 'An origin is https:// and a host, with no path or trailing slash.'

export function DeskPanelGallery() {
  const [retireOpen, setRetireOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [secret, setSecret] = useState<string | null>(null)
  const [origins, setOrigins] = useState<readonly string[]>(['https://app.example.com'])
  const [scope, setScope] = useState<'view' | 'all'>('view')
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')
  const [period, setPeriod] = useState<PeriodId>('30d')
  const [range, setRange] = useState<DateRange>({ from: '2026-09-01', to: '2026-09-30' })
  const [offset, setOffset] = useState(0)
  const [read, setRead] = useState({ at: Date.now() - 60_000, fetching: false, failed: false })

  const closeEdit = () => {
    setEditOpen(false)
    setDraft('')
  }
  const guard = useDiscardGuard({ dirty: draft !== '', onClose: closeEdit })

  const refetch = () => {
    setRead((r) => ({ ...r, fetching: true }))
    window.setTimeout(() => setRead((r) => ({ at: r.failed ? r.at : Date.now(), fetching: false, failed: r.failed })), 900)
  }
  const pageRows = [50, 50, 12]
  const returned = pageRows[offset / 50] ?? 0

  return (
    <div className="space-y-4">
      <Grid>
        <Demo title="Tooltip & Restricted" use="A control the reader's role cannot use stays listed and focusable, with the reason one hover or one Tab away. Tooltip is the plain description.">
          <div className="flex flex-wrap items-center gap-3">
            <Restricted reason="Only an admin can invite members.">
              <Button>Invite member</Button>
            </Restricted>
            <Tooltip content="Copies the key's id, not the key.">
              <Button variant="outline">
                <Icon name="content_copy" className="text-icon-md" />
                Copy id
              </Button>
            </Tooltip>
          </div>
        </Demo>

        <Demo title="EnvironmentIndicator" use="Which environment, on every page, the live one included. The words carry it; the tone is an accent.">
          <div className="flex flex-wrap gap-3">
            <EnvironmentIndicator name="Mutinynet" qualifier="Test network" isTest />
            <EnvironmentIndicator name="Mainnet" qualifier="Live network" isTest={false} />
          </div>
        </Demo>

        <Demo title="ConfirmDialog & useDiscardGuard" use="Ask before what cannot be undone; ask before closing a dialog that holds unsaved input.">
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" onClick={() => setRetireOpen(true)}>
              Delete project
            </Button>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit app
            </Button>
          </div>
          <ConfirmDialog
            open={retireOpen}
            onOpenChange={setRetireOpen}
            title="Delete this project?"
            description="Its settings are removed. Nothing else changes."
            confirmLabel="Delete"
            destructive
            onConfirm={() => setRetireOpen(false)}
          />
          <Dialog open={editOpen} onOpenChange={(open) => (open ? setEditOpen(true) : guard.request())}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit app</DialogTitle>
              </DialogHeader>
              <input
                aria-label="Name"
                className="h-12 rounded-xl bg-input px-4 text-body text-foreground"
                placeholder="Type, then press Escape"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <DialogFooter>
                <Button variant="outline" onClick={guard.request}>
                  Cancel
                </Button>
                <Button onClick={closeEdit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {guard.confirm}
        </Demo>

        <Demo title="OneTimeSecretDialog" use="A secret the server returns once. The acknowledgement is the only way out.">
          <Button onClick={() => setSecret('sk_test_7f3a9c2e4b1d8f6a0e5c3b7d9a2f4e6c')}>Create API key</Button>
          <OneTimeSecretDialog
            secret={secret}
            onAcknowledge={() => setSecret(null)}
            title="API key created"
            description="Copy and store this key now. For security, it cannot be displayed again."
            copyLabel="Copy key"
            acknowledgeLabel="I have stored this key"
          />
        </Demo>

        <Demo title="ListField" use="A list entered as a list: each item checked as it is added, the accepted ones shown as what will be sent.">
          <ListField
            label="Allowed origins"
            requirement="Required"
            noun="origin"
            items={origins}
            onChange={setOrigins}
            check={checkOrigin}
            form="An origin is a scheme and a host."
            example="https://app.example.com"
          />
        </Demo>

        <Demo title="ChoiceGroup" use="A few exclusive options in a form or dialog, each with one line saying what it means.">
          <div className="space-y-4">
            <ChoiceGroup legend="What to export">
              <Choice checked={scope === 'view'} onChange={() => setScope('view')} title="What this view holds" detail="With the filters in force, in the order shown." />
              <Choice checked={scope === 'all'} onChange={() => setScope('all')} title="The whole dataset" detail="As if the filters were cleared." />
            </ChoiceGroup>
            <ChoiceGroup legend="Format">
              <Choice checked={format === 'csv'} onChange={() => setFormat('csv')} title="CSV" detail="For a spreadsheet; integers as read." />
              <Choice checked={format === 'pdf'} onChange={() => setFormat('pdf')} title="PDF" detail="To read or share; landscape pages." />
            </ChoiceGroup>
          </div>
        </Demo>

        <Demo title="PeriodSelect & InstantsStatement" use="The period a page reads, and the exact instants it sent.">
          <div className="space-y-3">
            <PeriodSelect
              options={PERIODS}
              period={period}
              onPeriodChange={setPeriod}
              range={range}
              onRangeChange={setRange}
              fromLabel="From (UTC)"
              toLabel="To (UTC)"
            />
            <InstantsStatement
              description="1–30 September 2026, UTC"
              start="2026-09-01T00:00:00Z"
              end="2026-09-30T23:59:59.999Z"
            />
          </div>
        </Demo>

        <Demo title="ReadStatus" use="How old the figures are, beside the page's one Refresh. Turn on a failing refresh to see the stale state.">
          <div className="space-y-3">
            <ReadStatus
              reads={[{ data: {}, dataUpdatedAt: read.at, isError: read.failed, isFetching: read.fetching, refetch }]}
              formatTime={(ms) => new Date(ms).toLocaleTimeString()}
            />
            <label className="flex items-center gap-2 text-caption text-muted-foreground">
              <input type="checkbox" checked={read.failed} onChange={(event) => setRead((r) => ({ ...r, failed: event.target.checked }))} />
              The next refresh fails
            </label>
          </div>
        </Demo>

        <Demo title="ListSummary & Pager" use="How many rows, of how many only when the API says; a pager that stays on a one-page list.">
          <div className="space-y-3">
            <ListSummary noun="swaps" shown={returned} offset={offset} />
            <ListSummary noun="keys" shown={4} total={9} filtersActive />
            <Pager offset={offset} limit={50} returned={returned} onOffsetChange={setOffset} noun="swaps" alwaysShow />
          </div>
        </Demo>

        <Demo title="Amount" use="An amount in a table cell: the figure never breaks, the asset is quieter text under it.">
          <div className="flex flex-wrap gap-8 text-body">
            <Amount figure="1,000,000 sat" asset="BTC" stacked />
            <Amount figure="2,500.00" asset="USDT" stacked />
            <Amount figure="42 sat" stacked />
            <Amount figure={null} />
          </div>
        </Demo>

        <Demo title="MetricCard definition & change" use="What the figure counts, under the label; the change against the previous period, under the figure.">
          <MetricCard
            size="comfortable"
            icon="swap_horiz"
            label="Swaps"
            definition="Reached completed, in the period"
            value="1,284"
            change="↑ 12% vs the previous 30 days"
          />
        </Demo>

        <Demo title="AccountMenu" use="Who is signed in, at the end of the top bar. A disclosure: it holds an id with its copy button.">
          <div className="flex justify-end">
            <AccountMenu
              name="alex@example.com"
              secondary="Example Co"
              label="Account: alex@example.com, Owner, Example Co"
              header={
                <div className="min-w-0 space-y-1">
                  <div className="truncate text-caption font-medium">alex@example.com</div>
                  <div className="text-mini text-muted-foreground">
                    Role: <span className="font-medium text-foreground">Owner</span>
                  </div>
                  <Copyable value="org_01J8Z3N4Q5R6S7T8V9W0XYZABC" label="organization id" wrap />
                </div>
              }
            >
              <AccountMenuItem icon={<Icon name="settings" className="text-icon-md" />}>Settings</AccountMenuItem>
              <AccountMenuSeparator />
              <AccountMenuItem destructive icon={<Icon name="arrow_back" className="text-icon-md" />}>
                Log out
              </AccountMenuItem>
            </AccountMenu>
          </div>
        </Demo>
      </Grid>
    </div>
  )
}

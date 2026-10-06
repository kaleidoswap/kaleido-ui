/**
 * Product Previews — the library's components inside the two products that
 * ship them: the rate-extension wallet (popup) and the kaleidoswap-webapp.
 *
 * Each product is a dummy: its real screen layout, built from the live
 * kaleido-ui components, with mock data. Nothing imports product code, so a
 * component change shows up in both products at once, at the size each
 * renders it. Layouts follow rate-extension `src/components/{Dashboard,Swap,
 * Activity,Settings}.tsx` and kaleidoswap-webapp `src/app/**` +
 * `src/components/{layout,swap}`.
 */
/// <reference types="vite/client" />
import { useEffect, useState, type ReactNode } from 'react'
import brandCss from '../../../src/css/brand.css?inline'
import {
  AccountSettingsRow,
  ActivityDetailRow,
  ActivityFilterBar,
  ActivityList,
  ActivityNetworkFilters,
  ActivityTypeTabs,
  BalanceBreakdown,
  BottomNav,
  Button,
  Card,
  CardContent,
  DisclosureCard,
  FilterChipGroup,
  Icon,
  InfoPanel,
  Input,
  KaleidoswapLogo,
  KaleidoswapMark,
  Label,
  NetworkBadge,
  OptionSelector,
  PageHeader,
  QrCode,
  ScrollArea,
  SectionLabel,
  SectionTitle,
  SettingsTile,
  StatusBadge,
  SummaryRows,
  Switch,
  SwapInputCard,
  SwapStepList,
  Tabs,
  TabsContent,
  ToneBadge,
  Toaster,
  WalletAssetList,
  type AssetSelectorOption,
  type IconName,
} from '@kaleido-ui/index'

/** An icon-only button: a square Button with an accessible name. */
function IconAction({
  icon,
  label,
  variant = 'ghost',
  round = false,
  className,
}: {
  icon: IconName
  label: string
  variant?: 'ghost' | 'secondary'
  round?: boolean
  className?: string
}) {
  return (
    <Button variant={variant} size="icon" aria-label={label} title={label} className={round ? `rounded-full ${className ?? ''}` : className}>
      <Icon name={icon} size="sm" />
    </Button>
  )
}

// ─── rate-extension ──────────────────────────────────────────────────────────

type ExtensionView = 'dashboard' | 'swap' | 'activity-list' | 'settings'

// rate-extension src/components/shared/bottom-nav-items.tsx
const EXTENSION_NAV = [
  { id: 'dashboard', label: 'Wallet', iconName: 'account_balance_wallet' },
  { id: 'swap', label: 'Swap', iconName: 'swap_horiz' },
  { id: 'activity-list', label: 'Activity', iconName: 'history' },
  { id: 'settings', label: 'Settings', iconName: 'settings' },
] as const

const WALLET_ASSETS = [
  { id: 'btc', ticker: 'BTC', name: 'Bitcoin', displayBalance: '276,000', networks: ['L1', 'LN', 'Spark', 'Arkade'], accentColor: '#F7931A' },
  { id: 'usdt', ticker: 'USDT', name: 'Tether USD', displayBalance: '1,670.00', networks: ['RGB20', 'RGB-LN'], accentColor: '#26A17B' },
  { id: 'usdb', ticker: 'USDB', name: 'Bitcoin Dollar', displayBalance: '420.50', networks: ['Spark'], accentColor: '#F7931A' },
  { id: 'lbtc', ticker: 'L-BTC', name: 'Liquid Bitcoin', displayBalance: '12,500', networks: ['Liquid'], accentColor: '#46BEAE' },
] as const

const ACTIVITY = [
  { id: 'tx-1', direction: 'inbound', status: 'completed', displayAmount: '42,000', unit: 'sats', timestamp: 1700000000, network: 'LN', label: 'Lightning Receive' },
  { id: 'tx-2', direction: 'outbound', status: 'pending', displayAmount: '125.00', unit: 'USDT', timestamp: 1700086400, network: 'RGB-LN', label: 'RGB Transfer' },
  { id: 'tx-3', direction: 'inbound', status: 'completed', displayAmount: '88,000', unit: 'sats', timestamp: 1699990000, network: 'Spark', label: 'Spark Receive' },
  { id: 'tx-4', direction: 'outbound', status: 'failed', displayAmount: '500', unit: 'sats', timestamp: 1699913600, network: 'L1', label: 'On-chain Send' },
] as const

const SWAP_ASSETS = [
  { id: 'kaleidoswap:LN:btc', ticker: 'BTC', name: 'Bitcoin', network: 'LN' },
  { id: 'flashnet:SPARK:usdb', ticker: 'USDB', name: 'Bitcoin Dollar', network: 'Spark', category: 'stablecoins' },
  { id: 'kaleidoswap:RGB:usdt', ticker: 'USDT', name: 'Tether USD', network: 'RGB-LN', category: 'stablecoins' },
] as const satisfies readonly AssetSelectorOption[]

/** One extension screen: PageHeader, the scrolling body, the floating BottomNav. */
function ExtensionScreen({
  header,
  view,
  onNavigate,
  children,
}: {
  header: ReactNode
  view: ExtensionView
  onNavigate: (view: ExtensionView) => void
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full flex-col bg-background bg-page-radial">
      {header}
      <ScrollArea className="min-h-0 flex-1" viewportClassName="px-4 pb-28">
        {children}
      </ScrollArea>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <div className="pointer-events-auto w-full">
          <BottomNav activeView={view} onChange={onNavigate} position="inline" className="mx-auto" items={EXTENSION_NAV} />
        </div>
      </div>
    </div>
  )
}

function ExtensionDashboard({ onNavigate }: { onNavigate: (view: ExtensionView) => void }) {
  const [visible, setVisible] = useState(true)
  return (
    <ExtensionScreen
      view="dashboard"
      onNavigate={onNavigate}
      header={
        <PageHeader
          left={<KaleidoswapLogo className="h-6 w-auto text-foreground" />}
          right={<ToneBadge tone="success">4/5 ready</ToneBadge>}
        />
      }
    >
      <div className="space-y-4">
        <p className="text-caption text-muted-foreground">4 of 5 accounts ready</p>
        <BalanceBreakdown
          compact
          btcOnchain={125000}
          btcLightning={42000}
          btcSpark={88000}
          btcArkade={21000}
          totalBTC={276000}
          rgbAssets={[
            { asset_id: 'usdt-rgb', ticker: 'USDT', name: 'Tether USD', precision: 2, balance: { future: 167000, offchain_outbound: 42000 } },
          ]}
          accounts={{ RGB: { connected: true } }}
          balanceVisible={visible}
          format={(sats) => `${sats.toLocaleString()} sats`}
          formatFiatValue={(sats) => `$${(sats * 0.00065).toFixed(2)}`}
          unit="sats"
          label="sats"
          cycle={() => setVisible((value) => !value)}
          actionLabels={{ receive: 'Receive', send: 'Send' }}
          onNavigate={() => {}}
          onRefresh={() => {}}
        />
        <div className="flex items-center justify-between pt-1">
          <SectionTitle>Your assets</SectionTitle>
          <div className="flex gap-1">
            <IconAction icon="tune" label="Filter assets" />
            <IconAction icon="edit" label="Manage assets" />
          </div>
        </div>
        <WalletAssetList
          hideHeader
          bottomSpacer={false}
          items={WALLET_ASSETS.map((asset) => ({ ...asset, networks: [...asset.networks], balanceVisible: visible }))}
        />
      </div>
    </ExtensionScreen>
  )
}

function ExtensionSwap({ onNavigate }: { onNavigate: (view: ExtensionView) => void }) {
  const [venue, setVenue] = useState('all')
  return (
    <ExtensionScreen
      view="swap"
      onNavigate={onNavigate}
      header={<PageHeader title="Swap" right={<IconAction icon="refresh" label="Refresh quotes" />} />}
    >
      <div className="space-y-4">
        <FilterChipGroup
          value={venue}
          onChange={setVenue}
          options={[
            { value: 'all', label: 'All · 6' },
            { value: 'kaleidoswap', label: 'KaleidoSwap · 4' },
            { value: 'flashnet', label: 'Flashnet · 2' },
          ]}
        />
        <SwapPanel submitLabel="Review Swap" />
      </div>
    </ExtensionScreen>
  )
}

function ExtensionActivity({ onNavigate }: { onNavigate: (view: ExtensionView) => void }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [network, setNetwork] = useState<'all' | 'onchain' | 'lightning' | 'spark' | 'arkade'>('all')
  const [tab, setTab] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <ExtensionScreen
      view="activity-list"
      onNavigate={onNavigate}
      header={<PageHeader title="Activity" right={<IconAction icon="refresh" label="Refresh" />} />}
    >
      <div className="space-y-3">
        <ActivityFilterBar
          searchTerm={search}
          onSearchTermChange={setSearch}
          statusFilter={status}
          onStatusFilterChange={setStatus}
          searchPlaceholder="Search assets..."
          statusOptions={[
            { value: 'all', label: 'All Status' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
        <ActivityNetworkFilters
          activeFilter={network}
          onChange={setNetwork}
          filters={[
            { value: 'all', label: 'All' },
            { value: 'onchain', label: 'On-chain' },
            { value: 'lightning', label: 'Lightning' },
            { value: 'spark', label: 'Spark' },
            { value: 'arkade', label: 'Arkade' },
          ]}
        />
        <Tabs value={tab} onValueChange={setTab}>
          <ActivityTypeTabs counts={{ all: 4, received: 2, sent: 2, swaps: 0 }} />
          <TabsContent value={tab} className="mt-3">
            <ActivityList
              expandedId={expanded}
              onExpandedChange={setExpanded}
              items={ACTIVITY.map((item) => ({ ...item }))}
              renderDetails={(item) => (
                <>
                  <ActivityDetailRow label="Reference" value={item.id} />
                  <ActivityDetailRow label="Network" value={<NetworkBadge network={item.network ?? 'LN'} showLabel />} />
                  <ActivityDetailRow label="Status" value={<StatusBadge status={item.status} />} />
                </>
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ExtensionScreen>
  )
}

function ExtensionSettings({ onNavigate }: { onNavigate: (view: ExtensionView) => void }) {
  const [unit, setUnit] = useState('sats')
  const [fiat, setFiat] = useState('usd')
  const [language, setLanguage] = useState('en')
  const tileIcon = (name: IconName) => <Icon name={name} className="text-icon-lg text-secondary-content" />
  return (
    <ExtensionScreen view="settings" onNavigate={onNavigate} header={<PageHeader title="Settings" />}>
      <div className="space-y-5">
        <section className="space-y-2">
          <SectionTitle>Accounts</SectionTitle>
          <AccountSettingsRow accountId="SPARK" title="Spark" status="ready" network="testnet" description="Spark wallet and USDB" onClick={() => {}} />
          <AccountSettingsRow accountId="ARKADE" title="Arkade" status="offline" network="testnet" description="Ark rounds and VTXOs" onClick={() => {}} />
          <AccountSettingsRow accountId="RGB" title="RGB" status="ready" network="testnet" description="RGB assets and Lightning" onClick={() => {}} />
          <AccountSettingsRow accountId="NOSTR" title="Nostr" status="optional" network="testnet" description="Sign in to dApps" onClick={() => {}} beta />
        </section>
        <section className="space-y-2">
          <SectionTitle>Payments</SectionTitle>
          <SettingsTile icon={tileIcon('bolt')} title="Lightning Address" description="you@kaleidoswap.com" onClick={() => {}} />
        </section>
        <section className="space-y-2">
          <SectionTitle>Security</SectionTitle>
          <SettingsTile icon={tileIcon('link')} title="Connected Apps" description="2 apps" onClick={() => {}} />
          <SettingsTile icon={tileIcon('shield')} title="Security" description="Password, recovery phrase" onClick={() => {}} />
        </section>
        <section className="space-y-2">
          <SectionTitle>App</SectionTitle>
          <OptionSelector label="Bitcoin Unit" value={unit} onChange={setUnit} options={[{ id: 'sats', label: 'sats' }, { id: 'btc', label: 'BTC' }]} />
          <OptionSelector label="Fiat Currency" value={fiat} onChange={setFiat} options={[{ id: 'usd', label: 'USD' }, { id: 'eur', label: 'EUR' }, { id: 'chf', label: 'CHF' }]} />
          <OptionSelector label="Language" value={language} onChange={setLanguage} options={[{ id: 'en', label: 'English' }, { id: 'it', label: 'Italiano' }, { id: 'es', label: 'Español' }]} />
          <SettingsTile icon={tileIcon('open_in_new')} title="Open in Full Tab" onClick={() => {}} />
          <SettingsTile icon={tileIcon('bug_report')} title="Send Feedback" onClick={() => {}} />
          <SettingsTile icon={tileIcon('info')} title="About" value="v1.4.0" onClick={() => {}} />
        </section>
        <div className="space-y-2 pt-1">
          <Button variant="h2" size="lg"><Icon name="lock" size="sm" />Lock Wallet</Button>
          <Button variant="danger-subtle" size="lg" className="w-full"><Icon name="power_settings_new" size="sm" />Disconnect accounts</Button>
        </div>
      </div>
    </ExtensionScreen>
  )
}

function ExtensionPopup() {
  const [view, setView] = useState<ExtensionView>('dashboard')
  switch (view) {
    case 'swap':
      return <ExtensionSwap onNavigate={setView} />
    case 'activity-list':
      return <ExtensionActivity onNavigate={setView} />
    case 'settings':
      return <ExtensionSettings onNavigate={setView} />
    default:
      return <ExtensionDashboard onNavigate={setView} />
  }
}

/** The extension's swap card, with a live quote. */
function SwapPanel({ submitLabel }: { submitLabel: string }) {
  const [from, setFrom] = useState('BTC')
  const [to, setTo] = useState('USDB')
  const [amount, setAmount] = useState('21000')
  return (
    <SwapInputCard
      fromTicker={from}
      toTicker={to}
      fromInput={amount}
      fromOptions={[...SWAP_ASSETS]}
      toOptions={[...SWAP_ASSETS]}
      categories={[{ id: 'stablecoins', label: 'Stablecoins' }]}
      availableText="125,000 sats"
      selectedPercentage={null}
      fromUnitLabel="sats"
      receiveAmount="20.82"
      receiveUnitLabel={to}
      quoteRateText={`1 ${from} = 99,140 ${to}`}
      quoteFeeText="0.3%"
      quoteExpiresText="24s"
      submitLabel={submitLabel}
      onFromTickerChange={setFrom}
      onToTickerChange={setTo}
      onFromInputChange={setAmount}
      onPercentageClick={(percent) => setAmount(String(Math.floor((125_000 * percent) / 100)))}
      onFlip={() => {
        setFrom(to)
        setTo(from)
      }}
      onSubmit={() => {}}
    />
  )
}

// ─── kaleidoswap-webapp ──────────────────────────────────────────────────────

type WebRoute = 'home' | 'swaps' | 'status'

const SWAPS = [
  { id: 'sw-8f2c', from: 'BTC', fromVenue: 'Lightning', to: 'L-USDT', toVenue: 'Liquid', amount: '0.0021 BTC', when: '2 min ago', status: 'Payment in flight', tone: 'warning' },
  { id: 'sw-11ab', from: 'BTC', fromVenue: 'On-chain', to: 'BTC', toVenue: 'Lightning', amount: '0.0500 BTC', when: '1 h ago', status: 'Complete', tone: 'success' },
  { id: 'sw-90de', from: 'L-BTC', fromVenue: 'Liquid', to: 'BTC', toVenue: 'Arkade', amount: '0.0100 L-BTC', when: 'Yesterday', status: 'Refunded', tone: 'muted' },
  { id: 'sw-4c71', from: 'BTC', fromVenue: 'Lightning', to: 'BTC', toVenue: 'On-chain', amount: '0.0030 BTC', when: '3 days ago', status: 'Expired', tone: 'danger' },
] as const

/** src/components/layout/nav-bar.tsx */
function WebNavBar({ route, onRoute }: { route: WebRoute; onRoute: (route: WebRoute) => void }) {
  const link = (label: string, target?: WebRoute) => (
    <Button
      variant="ghost"
      size="sm"
      className={target && route === target ? 'text-foreground' : 'text-muted-foreground'}
      onClick={() => target && onRoute(target)}
    >
      {label}
    </Button>
  )
  return (
    <header className="sticky top-0 z-30 bg-background/80 shadow-header backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-4">
        <button type="button" onClick={() => onRoute('home')} aria-label="Home">
          <KaleidoswapLogo className="h-6 w-auto text-foreground" />
        </button>
        <ToneBadge tone="warning">Testnet</ToneBadge>
        <nav className="ml-4 flex items-center gap-1">
          {link('Swap', 'home')}
          {link('Your swaps', 'swaps')}
          {link('Docs')}
          {link('Community')}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <IconAction icon="tune" label="Options" />
          <Button variant="surface" size="sm"><Icon name="download" size="sm" />Download</Button>
          <Button size="sm"><Icon name="account_balance_wallet" size="sm" />Connect wallet</Button>
        </div>
      </div>
    </header>
  )
}

/** One side of the swap card: src/components/swap/amount-panel. */
function AmountPanel({ side, ticker, venue, amount }: { side: 'You send' | 'You receive'; ticker: string; venue: string; amount: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-2xl bg-muted/40 p-4">
      <p className="text-caption font-semibold text-muted-foreground">{side}</p>
      <div className="mt-2 flex items-center gap-3">
        <input
          aria-label={`${side} amount`}
          defaultValue={amount}
          className="min-w-0 flex-1 bg-transparent text-title font-bold text-foreground outline-none"
        />
        <Button variant="surface" size="sm">
          {ticker}
          <Icon name="expand_more" size="sm" />
        </Button>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-caption text-muted-foreground">
        <Icon name="layers" size="xs" />
        {venue}
      </p>
    </div>
  )
}

function WebHome({ onRoute }: { onRoute: (route: WebRoute) => void }) {
  const [destination, setDestination] = useState('')
  return (
    <div className="space-y-12 py-10">
      <div className="text-center">
        <h1 className="text-display font-bold tracking-tight text-foreground">
          Swap across <span className="text-gradient-brand">Bitcoin layers</span>
        </h1>
        <p className="mt-3 text-body text-muted-foreground">No account, no custody, no counterparty risk. Just swaps.</p>
      </div>
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-4 p-6">
          <div className="relative flex gap-3">
            <AmountPanel side="You send" ticker="BTC" venue="Lightning" amount="0.0021" />
            <IconAction
              icon="swap_horiz"
              label="Switch direction"
              variant="secondary"
              round
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            />
            <AmountPanel side="You receive" ticker="L-USDT" venue="Liquid" amount="208.21" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 text-caption">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Icon name="sync_alt" size="sm" />
              Lightning → Liquid
              <ToneBadge tone="primary">Reverse</ToneBadge>
            </span>
            <span className="font-semibold text-foreground">1 BTC = 99,140 USDT · fee 0.25%</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Receive address</Label>
            <div className="flex gap-2">
              <Input id="destination" placeholder="Liquid address (lq1…)" value={destination} onChange={(event) => setDestination(event.target.value)} />
              <Button variant="surface"><Icon name="content_paste" size="sm" />Paste</Button>
            </div>
          </div>
          <Button variant="cta" size="cta" disabled={!destination} onClick={() => onRoute('status')}>
            {destination ? 'Review swap' : 'Add a receive address'}
          </Button>
        </CardContent>
      </Card>
      <p className="flex items-center justify-center gap-4 text-caption text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" />Maker live</span>
        <span>Mainnet</span>
      </p>
      <section className="space-y-4">
        <SectionLabel className="text-center">How it works</SectionLabel>
        <div className="grid grid-cols-3 gap-4">
          {([
            ['swap_horiz', 'Pick a pair', 'Any Bitcoin layer to any other: Lightning, on-chain, Liquid, Arkade.'],
            ['account_balance_wallet', 'Pay from any wallet', 'Pay the invoice or address with the wallet you already use.'],
            ['shield', 'Atomic or refunded', 'The swap completes, or your funds come back. Nobody holds them.'],
          ] as const).map(([icon, title, text]) => (
            <Card key={title}>
              <CardContent className="space-y-2 p-5">
                <Icon name={icon} className="text-icon-xl text-brand" />
                <p className="text-body font-semibold text-foreground">{title}</p>
                <p className="text-caption text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function WebSwaps({ onRoute }: { onRoute: (route: WebRoute) => void }) {
  return (
    <div className="space-y-6 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-title font-bold text-foreground">Your swaps</h1>
          <p className="mt-1 text-caption text-muted-foreground">Stored in this browser. Export a receipt to keep it.</p>
        </div>
        <Button variant="surface"><Icon name="upload_file" size="sm" />Import receipt</Button>
      </div>
      <InfoPanel tone="danger" title="One swap needs attention">
        sw-4c71 expired before payment. Nothing was sent.
      </InfoPanel>
      <div className="space-y-2">
        {SWAPS.map((swap) => (
          <div key={swap.id} className="flex items-center gap-4 rounded-2xl bg-card/55 bg-gradient-card px-4 py-3 shadow-card">
            <button type="button" className="flex min-w-0 flex-1 items-center gap-4 text-left" onClick={() => onRoute('status')}>
              <span className="flex items-center gap-1.5 text-caption font-semibold text-foreground">
                {swap.from} <Icon name="arrow_forward" size="xs" className="text-muted-foreground" /> {swap.to}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body font-semibold text-foreground">{swap.amount}</span>
                <span className="flex items-center gap-1 text-caption text-muted-foreground">
                  <Icon name="schedule" size="xs" />
                  {swap.when} · {swap.fromVenue} → {swap.toVenue}
                </span>
              </span>
              <ToneBadge tone={swap.tone}>{swap.status}</ToneBadge>
            </button>
            <IconAction icon="delete" label={`Delete ${swap.id}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

function WebStatus({ onRoute }: { onRoute: (route: WebRoute) => void }) {
  const [details, setDetails] = useState(false)
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-10">
      <Button variant="ghost" size="sm" onClick={() => onRoute('swaps')}>
        <Icon name="arrow_back" size="sm" />
        Your swaps
      </Button>
      <Card>
        <CardContent className="grid grid-cols-[1fr_auto] gap-8 p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-title font-bold text-foreground">Swap sw-8f2c</h1>
              <p className="text-caption text-muted-foreground">0.0021 BTC on Lightning → 208.21 L-USDT on Liquid</p>
            </div>
            <SwapStepList
              steps={[
                { id: 'created', label: 'Swap created', status: 'done' },
                { id: 'pay', label: 'Pay the invoice', description: 'Waiting for your Lightning payment', status: 'active' },
                { id: 'lockup', label: 'Maker locks funds', status: 'pending' },
                { id: 'claim', label: 'Claim on Liquid', status: 'pending' },
              ]}
            />
          </div>
          <div className="rounded-2xl bg-white p-3">
            <QrCode value="lightning:lnbc21000sampleinvoice" size={208} />
          </div>
        </CardContent>
      </Card>
      <SummaryRows
        rows={[
          { label: 'Swap id', value: 'sw-8f2c', mono: true },
          { label: 'Type', value: 'Reverse' },
          { label: 'Maker status', value: 'invoice.set' },
          { label: 'Timeout block', value: '3,124,880', mono: true },
          { label: 'Created', value: '2 min ago' },
        ]}
      />
      <DisclosureCard title="Technical details" open={details} onOpenChange={setDetails} icon={<Icon name="code" size="sm" />}>
        <p className="font-mono text-caption text-muted-foreground">lockup: lq1qq2xv…8e4k · preimage hash: 9f2c…a1b0</p>
      </DisclosureCard>
    </div>
  )
}

function WebApp() {
  const [route, setRoute] = useState<WebRoute>('home')
  return (
    <div className="flex h-full flex-col bg-background bg-page-radial text-foreground">
      <ScrollArea className="min-h-0 flex-1">
        <WebNavBar route={route} onRoute={setRoute} />
        <main className="mx-auto max-w-[1200px] px-4">
          {route === 'home' && <WebHome onRoute={setRoute} />}
          {route === 'swaps' && <WebSwaps onRoute={setRoute} />}
          {route === 'status' && <WebStatus onRoute={setRoute} />}
        </main>
        {/* src/components/layout/footer.tsx */}
        <footer className="mt-8 bg-surface-raised">
          <div className="mx-auto grid max-w-[1200px] grid-cols-4 gap-8 px-4 py-10 text-caption text-muted-foreground">
            <div className="space-y-3">
              <KaleidoswapLogo className="h-6 w-auto text-foreground" />
              <p>Swaps across Bitcoin layers.</p>
            </div>
            {[
              ['Product', ['Swap', 'Your swaps', 'Download']],
              ['Developers', ['Docs', 'API', 'GitHub']],
              ['Community', ['Telegram', 'X', 'Nostr']],
            ].map(([title, items]) => (
              <div key={title as string} className="space-y-2">
                <p className="font-semibold text-foreground">{title}</p>
                {(items as string[]).map((item) => <p key={item}>{item}</p>)}
              </div>
            ))}
          </div>
        </footer>
      </ScrollArea>
    </div>
  )
}

// ─── The page ────────────────────────────────────────────────────────────────

type Product = 'both' | 'extension' | 'webapp'

/** The extension popup: 400 × 600, as rate-extension sizes it (src/index.css). */
function PopupFrame({ children }: { children: ReactNode }) {
  return (
    <figure className="shrink-0">
      <div className="h-[600px] w-[400px] overflow-hidden rounded-2xl shadow-popover">{children}</div>
      <figcaption className="mt-3 text-center text-caption text-muted-foreground">rate-extension · popup 400 × 600</figcaption>
    </figure>
  )
}

/** A desktop browser window at 1280 × 800, its address bar on top. */
function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <figure className="min-w-0 max-w-full flex-1">
      <div className="overflow-x-auto rounded-2xl shadow-popover">
        <div className="w-[1280px]">
          <div className="flex h-10 items-center gap-2 bg-muted px-4">
            <span className="size-3 rounded-full bg-danger/70" />
            <span className="size-3 rounded-full bg-warning/70" />
            <span className="size-3 rounded-full bg-success/70" />
            <span className="ml-4 flex-1 truncate rounded-lg bg-background/70 px-3 py-1 text-caption text-muted-foreground">
              kaleidoswap.com
            </span>
          </div>
          <div className="h-[800px]">{children}</div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-caption text-muted-foreground">kaleidoswap-webapp · desktop 1280 × 800</figcaption>
    </figure>
  )
}

export function ProductPreviews({ onBack }: { onBack?: () => void }) {
  const [product, setProduct] = useState<Product>('both')
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  // kaleidoswap-webapp also imports kaleido-ui/css/brand. It is global, so it
  // is a switch here: on, the whole page (extension included) takes it.
  const [brand, setBrand] = useState(false)

  // The page drives the document theme, as each product does.
  useEffect(() => {
    const root = document.documentElement.classList
    root.toggle('dark', dark)
    root.toggle('light', !dark)
  }, [dark])
  useEffect(() => {
    if (!brand) return
    const style = document.createElement('style')
    style.dataset.kuiBrand = ''
    style.textContent = brandCss
    document.head.appendChild(style)
    return () => style.remove()
  }, [brand])
  useEffect(() => {
    document.title = 'Product previews · kaleido-ui showcase'
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-40 flex flex-wrap items-center gap-x-4 gap-y-2 bg-background/80 px-6 py-3 shadow-header backdrop-blur-xl">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <Icon name="arrow_back" size="sm" />
          Components
        </Button>
        <KaleidoswapMark className="size-6" />
        <h1 className="text-subhead font-bold">Product previews</h1>
        <FilterChipGroup
          variant="segmented"
          ariaLabel="Products shown"
          value={product}
          onChange={setProduct}
          options={[
            { value: 'both', label: 'Both' },
            { value: 'extension', label: 'Extension' },
            { value: 'webapp', label: 'Web app' },
          ]}
        />
        <div className="ml-auto flex items-center gap-5">
          <label className="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
            Brand theme
            <Switch checked={brand} onCheckedChange={setBrand} aria-label="Brand theme" />
          </label>
          <label className="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
            <Icon name="dark_mode" size="sm" />
            Dark
            <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark theme" />
          </label>
        </div>
      </header>
      <main className="px-6 py-8">
        <p className="mb-6 max-w-3xl text-body text-muted-foreground">
          Dummy versions of the two products, built from the live kaleido-ui components with mock data. They are
          clickable: the extension's bottom nav, the web app's nav, swap rows and swap card all move between screens.
          The web app ships with the brand theme; switch it on to see it as users do.
        </p>
        <div className="flex flex-wrap items-start gap-8">
          {product !== 'webapp' && (
            <PopupFrame>
              <ExtensionPopup />
            </PopupFrame>
          )}
          {product !== 'extension' && (
            <BrowserFrame>
              <WebApp />
            </BrowserFrame>
          )}
        </div>
      </main>
    </div>
  )
}

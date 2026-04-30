import { useEffect, useState } from 'react'
import { StateSnapshot } from './pages/StateSnapshot'
import { Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, NumberInput } from '@kaleido-ui/index'
import {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Icon,
  Icons,
  Toaster,
  ToastAction,
  useToast,
  StatusBadge,
  NetworkBadge,
  AssetCard,
  TransactionCard,
  SettingItem,
  SectionLabel,
  AlertBanner,
  ActionTile,
  AccountChoiceChip,
  AccountInfoGrid,
  AccountNetworkSelector,
  AccountNotice,
  AccountStatusTabs,
  AssetSelector,
  BalanceBreakdown,
  BottomNav,
  CopyIcon,
  InvoiceStatusBanner,
  MethodChoiceChip,
  NetworkInfoDisclosure,
  PaidOverlay,
  QrCode,
  SectionTitle,
  WalletAssetList,
  ActivityList,
  ActivityDetailRow,
  ActivityFilterBar,
  ActivityNetworkFilters,
  ActivityTypeTabs,
  WithdrawAmountInput,
  WithdrawDestinationInput,
  WithdrawInvoiceInfo,
  WithdrawRouteSelector,
  NETWORK_CONFIG,
} from '@kaleido-ui/index'
import type { StatusType, NetworkType } from '@kaleido-ui/index'

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-primary/40 via-white/10 to-transparent" />
      </div>
      {children}
    </section>
  )
}

function Row({
  label,
  children,
  wrap = true,
}: {
  label: string
  children: React.ReactNode
  wrap?: boolean
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''}`}>{children}</div>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'icons', label: 'Icons' },
  { id: 'status-badges', label: 'Status Badges' },
  { id: 'network-badges', label: 'Network Badges' },
  { id: 'cards', label: 'Cards' },
  { id: 'asset-cards', label: 'Asset Cards' },
  { id: 'transaction-cards', label: 'Transaction Cards' },
  { id: 'feature-components', label: 'Feature Components' },
  { id: 'activity-components', label: 'Activity Components' },
  { id: 'deposit-components', label: 'Deposit Components' },
  { id: 'withdraw-components', label: 'Withdraw Components' },
  { id: 'account-components', label: 'Account Components' },
  { id: 'alert-banners', label: 'Alert Banners' },
  { id: 'setting-items', label: 'Setting Items' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'toast', label: 'Toast' },
]

// ─── App ────────────────────────────────────────────────────────────────────

export function App() {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')
  const [activeView, setActiveView] = useState('dashboard')
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>('tx-1')
  const [activityTab, setActivityTab] = useState('all')
  const [activityStatus, setActivityStatus] = useState('all')
  const [activityNetwork, setActivityNetwork] = useState('all')
  const [activitySearch, setActivitySearch] = useState('')
  const [selectedAssetTicker, setSelectedAssetTicker] = useState('BTC')
  const [accountNetwork, setAccountNetwork] = useState<'mainnet' | 'testnet' | 'signet' | 'regtest'>('testnet')
  const [withdrawDestination, setWithdrawDestination] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
  const [withdrawAmount, setWithdrawAmount] = useState('21000')
  const [feeRate, setFeeRate] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [donation, setDonation] = useState(true)

  // Hash-based route: `#/state-snapshot` renders the State Snapshot page,
  // anything else renders the normal component showcase.
  const [route, setRoute] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  if (route.startsWith('#/state-snapshot')) {
    return (
      <StateSnapshot
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/kaleidoswap-pictogram.svg" alt="KaleidoSwap" className="h-7" />
            <span className="font-bold text-white tracking-tight">kaleido-ui</span>
            <span className="text-xs text-slate-500 font-mono">showcase</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#/state-snapshot"
              className="text-xs font-bold text-white/90 px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-colors"
            >
              State Snapshot →
            </a>
            <span className="text-xs font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              v0.1.0
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 flex gap-8 py-8">

        {/* Sidebar nav */}
        <nav className="hidden lg:block w-48 shrink-0">
          <ul className="sticky top-24 space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── Buttons ─────────────────────────────────────────────────── */}
          <Section id="buttons" title="Buttons" description="12 variants, 9 sizes.">
            <Row label="Enabled Variants">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="hyperlink">Hyperlink</Button>
              <Button variant="surface">Surface</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="danger-subtle">Danger Subtle</Button>
            </Row>
            <Row label="Disabled Variants">
              <Button variant="default" disabled>Default</Button>
              <Button variant="outline" disabled>Outline</Button>
              <Button variant="ghost" disabled>Ghost</Button>
              <Button variant="hyperlink" disabled>Hyperlink</Button>
              <Button variant="surface" disabled>Surface</Button>
              <Button variant="destructive" disabled>Destructive</Button>
              <Button variant="danger-subtle" disabled>Danger Subtle</Button>
            </Row>
            <Row label="CTA variants (full-width)" wrap={false}>
              <div className="flex flex-col gap-3 w-full max-w-sm">
                <Button variant="cta" size="cta">Swap Now</Button>
                <Button variant="destructive" size="cta">Delete</Button>
              </div>
            </Row>
            <Row label="Sizes">
              <Button size="xs">X-Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">X-Large</Button>
              <Button size="icon"><Icon name="add" /></Button>
              <Button size="icon-lg"><Icon name="send" /></Button>
              <Button size="icon-xl"><Icon name="swap_horiz" /></Button>
            </Row>
            <Row label="With icons">
              <Button><Icon name="send" size="sm" />Send</Button>
              <Button variant="outline"><Icon name="qr_code" size="sm" />Receive</Button>
              <Button variant="ghost"><Icon name="swap_horiz" size="sm" />Swap</Button>
              <Button variant="hyperlink" className="no-underline"><Icon name="open_in_new" size="xs" className="!text-[15px] leading-none translate-y-[1.5px] icon" /><span className="underline underline-offset-2 group-hover:decoration-[#31ff8b]">Learn more</span></Button>
            </Row>
          </Section>

          {/* ── Icons ───────────────────────────────────────────────────── */}
          <Section id="icons" title="Icons" description="Material Symbols wrapper with size variants.">
            <Row label="Named shortcuts (Icons.*)">
              <div className="flex flex-wrap gap-4">
                {Object.entries(Icons).map(([key, IconComp]) => (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <div className="size-10 rounded-xl bg-primary/15 hover:bg-primary/25 hover:scale-105 transition-all flex items-center justify-center cursor-default">
                      <IconComp size="md" className="text-[#31ff8b]" />
                    </div>
                    <span className="text-xxs text-slate-500 font-mono">{key}</span>
                  </div>
                ))}
              </div>
            </Row>
            <Row label="Common icons">
              <div className="flex flex-wrap gap-4">
                {[
                  'home', 'settings', 'person', 'notifications', 'search',
                  'arrow_back', 'close', 'check', 'add', 'remove',
                  'visibility', 'visibility_off', 'copy_all', 'download', 'upload',
                ].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-1">
                    <div className="size-10 rounded-xl bg-primary/15 hover:bg-primary/25 hover:scale-105 transition-all flex items-center justify-center cursor-default">
                      <Icon name={name} size="md" className="text-[#31ff8b]" />
                    </div>
                    <span className="text-xxs text-slate-500 font-mono">{name}</span>
                  </div>
                ))}
              </div>
            </Row>
          </Section>

          {/* ── Status Badges ───────────────────────────────────────────── */}
          <Section id="status-badges" title="Status Badges" description="Transaction and state indicators.">
            <Row label="All statuses">
              {(['success', 'completed', 'pending', 'failed', 'error'] as StatusType[]).map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </Row>
          </Section>

          {/* ── Network Badges ──────────────────────────────────────────── */}
          <Section id="network-badges" title="Network Badges" description="Layer/protocol indicators.">
            <Row label="Network chips with text">
              {(['L1', 'LN', 'RGB20', 'RGB21', 'RGB-L1', 'RGB-LN', 'Spark', 'Arkade'] as NetworkType[]).map((n) => (
                <NetworkBadge key={n} network={n} />
              ))}
            </Row>
            <Row label="Network chips without text">
              {(['L1', 'LN', 'RGB20', 'Spark', 'Arkade'] as NetworkType[]).map((n) => (
                <NetworkBadge key={n} network={n} iconOnly />
              ))}
            </Row>
          </Section>

          {/* ── Cards ───────────────────────────────────────────────────── */}
          <Section id="cards" title="Cards" description="Compositional card primitives.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>With header and content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">Card body content goes here. Cards can hold any child elements.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>Actions in the footer slot.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400">Use CardFooter for action buttons or summary information.</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">Confirm</Button>
                  <Button variant="outline" size="sm">Cancel</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* ── Asset Cards ─────────────────────────────────────────────── */}
          <Section id="asset-cards" title="Asset Cards" description="Asset display with icon, name, networks, and balance.">
            <div className="flex flex-col gap-3 max-w-md">
              <AssetCard
                ticker="BTC"
                name="Bitcoin"
                displayBalance="0.00142000"
                networks={['L1', 'LN', 'Spark']}
                accentColor="#F7931A"
                onClick={() => {}}
              />
              <AssetCard
                ticker="USDT"
                name="Tether USD"
                displayBalance="1,250.00"
                networks={['RGB20', 'RGB-LN']}
                accentColor="#26A17B"
                onClick={() => {}}
              />
              <AssetCard
                ticker="BTC"
                name="Bitcoin (hidden)"
                displayBalance="0.05000000"
                networks={['L1']}
                accentColor="#F7931A"
                balanceVisible={false}
                onClick={() => {}}
              />
            </div>
          </Section>

          {/* ── Transaction Cards ───────────────────────────────────────── */}
          <Section id="transaction-cards" title="Transaction Cards" description="Transaction rows with direction, status, and amount.">
            <div className="flex flex-col gap-3 max-w-md">
              <TransactionCard
                direction="inbound"
                status="completed"
                displayAmount="21,000"
                unit="sats"
                timestamp={1700000000}
                onClick={() => {}}
              />
              <TransactionCard
                direction="outbound"
                status="pending"
                displayAmount="5,000"
                unit="sats"
                timestamp={1700086400}
                onClick={() => {}}
              />
              <TransactionCard
                direction="outbound"
                status="failed"
                displayAmount="500"
                unit="sats"
                timestamp={1699913600}
                onClick={() => {}}
              />
            </div>
          </Section>

          {/* ── Feature Components ─────────────────────────────────────── */}
          <Section id="feature-components" title="Feature Components" description="Wallet feature surfaces used by the extension.">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-5 max-w-md">
                <BalanceBreakdown
                  btcOnchain={125000}
                  btcLightning={42000}
                  btcSpark={88000}
                  btcArkade={21000}
                  totalBTC={276000}
                  rgbAssets={[
                    {
                      asset_id: 'usdt-rgb',
                      ticker: 'USDT',
                      name: 'Tether USD',
                      precision: 2,
                      balance: { future: 125000, offchain_outbound: 42000 },
                    },
                  ]}
                  accounts={{ RGB: { connected: true } }}
                  nodeInfo={{ pubkey: '028f73c947c2197c21f4abfe9024a7b762bd99122de4b7f9d1d25d5e6a0f99b0a1', num_peers: 3, num_channels: 2 }}
                  balanceVisible
                  format={(sats) => `${sats.toLocaleString()} sats`}
                  formatFiatValue={(sats) => `$${(sats * 0.00065).toFixed(2)}`}
                  unit="sats"
                  label="sats"
                  cycle={() => {}}
                  onNavigate={setActiveView}
                  onRefresh={() => {}}
                />
                <div className="relative rounded-2xl border border-border bg-card/60 p-4">
                  <BottomNav
                    activeView={activeView}
                    onChange={setActiveView}
                    position="inline"
                    className="mx-auto"
                    items={[
                      { id: 'dashboard', label: 'Wallet', iconName: 'account_balance_wallet' },
                      { id: 'swap', label: 'Swap', iconName: 'swap_horiz' },
                      { id: 'activity-list', label: 'Activity', iconName: 'history' },
                      { id: 'settings', label: 'Settings', iconName: 'settings' },
                    ]}
                  />
                </div>
              </div>
              <div className="space-y-5 max-w-md">
                <WalletAssetList
                  title="Assets"
                  bottomSpacer={false}
                  items={[
                    { id: 'btc', ticker: 'BTC', name: 'Bitcoin', displayBalance: '276,000', networks: ['L1', 'LN', 'Spark'], accentColor: '#F7931A' },
                    { id: 'usdt', ticker: 'USDT', name: 'Tether USD', displayBalance: '1,670.00', networks: ['RGB-LN'], accentColor: '#26A17B' },
                  ]}
                />
              </div>
              <div className="space-y-5 max-w-md">
                <div className="flex gap-2.5">
                  <ActionTile icon={<Icon name="call_received" size="sm" />} label="Deposit" onClick={() => {}} />
                  <ActionTile icon={<Icon name="swap_horiz" size="sm" />} label="Swap" onClick={() => {}} />
                  <ActionTile icon={<Icon name="send" size="sm" />} label="Withdraw" onClick={() => {}} />
                </div>
                <AssetSelector
                  label="From"
                  selectedTicker={selectedAssetTicker}
                  onChange={setSelectedAssetTicker}
                  categories={[
                    { id: 'stablecoins', label: 'Stablecoins' },
                    { id: 'rwa', label: 'RWA' },
                    { id: 'meme', label: 'Meme' },
                  ]}
                  defaultActiveCategories={['stablecoins', 'rwa']}
                  options={[
                    { ticker: 'BTC', name: 'Bitcoin', network: 'LN' },
                    { ticker: 'USDB', name: 'Bitcoin Dollar', network: 'Spark', category: 'stablecoins' },
                    { ticker: 'MSTR', name: 'MicroStrategy', network: 'RGB-LN', category: 'rwa' },
                  ]}
                />
                <QrCode value="kaleidoswap:receive:sample" size={168} />
              </div>
              <div className="max-w-md rounded-2xl border border-border bg-card/60 p-4">
                <AccountStatusTabs
                  accounts={[
                    {
                      id: 'RGB',
                      label: 'RLN',
                      state: 'Ready',
                      detail: 'RGB and Lightning features are available.',
                      icon: <img src="/icons/rgb/rgb-logo.svg" alt="" className="size-5" />,
                      dotTone: 'bg-primary',
                      title: 'RGB & Lightning',
                      description: 'RGB assets and Lightning channels.',
                      capabilityBullets: ['RGB assets', 'Lightning invoices', 'On-chain receive'],
                      networkLabel: 'Testnet',
                      networkBannerClassName: 'border-primary/20 bg-primary/10 text-primary',
                      accentBg: 'bg-primary/10',
                      accentBorder: 'border-primary/20',
                    },
                    {
                      id: 'SPARK',
                      label: 'Spark',
                      state: 'Ready',
                      detail: 'Spark account is connected.',
                      icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="" className="size-5" />,
                      dotTone: 'bg-blue-300',
                      title: 'Spark',
                      description: 'Fast Spark BTC and native assets.',
                      capabilityBullets: ['Instant receive', 'Native assets'],
                      networkLabel: 'Signet',
                      networkBannerClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
                      accentBg: 'bg-blue-500/10',
                      accentBorder: 'border-blue-500/20',
                    },
                  ]}
                />
              </div>
            </div>
          </Section>

          {/* ── Activity Components ────────────────────────────────────── */}
          <Section id="activity-components" title="Activity Components" description="Search, filters, tabs, list rows, and expanded details from the extension Activity page.">
            <div className="max-w-md space-y-4">
              <ActivityFilterBar
                searchTerm={activitySearch}
                onSearchTermChange={setActivitySearch}
                statusFilter={activityStatus}
                onStatusFilterChange={setActivityStatus}
                hasActiveFilters={activitySearch !== '' || activityStatus !== 'all' || activityNetwork !== 'all'}
                onClearFilters={() => {
                  setActivitySearch('')
                  setActivityStatus('all')
                  setActivityNetwork('all')
                }}
                statusOptions={[
                  { value: 'all', label: 'All Status' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
              />
              <ActivityNetworkFilters
                activeFilter={activityNetwork}
                onChange={setActivityNetwork}
                filters={[
                  { value: 'all', label: 'All' },
                  { value: 'onchain', label: 'On-chain' },
                  { value: 'lightning', label: 'Lightning' },
                  { value: 'spark', label: 'Spark' },
                  { value: 'arkade', label: 'Arkade' },
                ]}
              />
              <Tabs value={activityTab} onValueChange={setActivityTab}>
                <ActivityTypeTabs counts={{ all: 12, received: 7, sent: 3, swaps: 2 }} />
                <TabsContent value={activityTab} className="mt-3">
                  <ActivityList
                    expandedId={expandedActivityId}
                    onExpandedChange={setExpandedActivityId}
                    items={[
                      { id: 'tx-1', direction: 'inbound', status: 'completed', displayAmount: '42,000', unit: 'sats', timestamp: 1700000000, network: 'LN', label: 'Lightning Receive' },
                      { id: 'tx-2', direction: 'outbound', status: 'pending', displayAmount: '125.00', unit: 'USDT', timestamp: 1700086400, network: 'RGB-LN', label: 'RGB Transfer' },
                    ]}
                    renderDetails={(item) => (
                      <>
                        <ActivityDetailRow label="Reference" value={item.id} />
                        <ActivityDetailRow label="Network" value={<NetworkBadge network={item.network ?? 'LN'} />} />
                        <ActivityDetailRow label="Status" value={<StatusBadge status={item.status} />} />
                      </>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </Section>

          {/* ── Deposit Components ─────────────────────────────────────── */}
          <Section id="deposit-components" title="Deposit Components" description="Reusable receive-flow pieces.">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-4">
                <Row label="Account and Method Choices">
                  <AccountChoiceChip account="RGB" active onClick={() => {}} />
                  <AccountChoiceChip account="SPARK" active={false} onClick={() => {}} />
                  <AccountChoiceChip account="ARKADE" active={false} onClick={() => {}} />
                  <MethodChoiceChip method="bitcoin_l1" active enabled onClick={() => {}} />
                  <MethodChoiceChip method="lightning" active={false} enabled onClick={() => {}} />
                  <MethodChoiceChip method="spark" active={false} enabled={false} disabledReason="offline" onClick={() => {}} />
                </Row>
                <InvoiceStatusBanner
                  invoiceStatus="pending"
                  isInvoicePending
                  isInvoicePaid={false}
                  isInvoiceFailedOrExpired={false}
                />
                <NetworkInfoDisclosure networks={['onchain', 'lightning', 'spark', 'arkade']} />
              </div>
              <div className="space-y-4">
                <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl border border-border bg-card/70 p-5">
                  <div className="relative rounded-2xl border-2 border-primary/30 bg-white p-3">
                    <QrCode value="lightning:lnbc21000sampleinvoice" size={168} />
                    <PaidOverlay />
                  </div>
                </div>
                <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-white">
                  <CopyIcon copied={false} />
                  Copy invoice
                </button>
                <div className="rounded-xl border border-border bg-card/70 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white">
                    <span className={`flex size-5 items-center justify-center rounded-md ${NETWORK_CONFIG.lightning.bg}`}>
                      {NETWORK_CONFIG.lightning.icon}
                    </span>
                    {NETWORK_CONFIG.lightning.label}
                  </div>
                  <p className="text-xs text-muted-foreground">Lightning invoice generation, payment state, copy affordance, and network disclosure all come from the library.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Withdraw Components ────────────────────────────────────── */}
          <Section id="withdraw-components" title="Withdraw Components" description="Reusable send-flow controls.">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-4">
                <WithdrawDestinationInput
                  destination={withdrawDestination}
                  setDestination={setWithdrawDestination}
                  addressType="bitcoin"
                  detectedNetworkLabel="Bitcoin L1"
                  isDecoding={false}
                  isResolvingLnurl={false}
                  handlePaste={() => setWithdrawDestination('bc1qsampledestinationaddress')}
                  handleReset={() => {}}
                />
                <WithdrawAmountInput
                  addressType="bitcoin"
                  amount={withdrawAmount}
                  handleAmountChange={(event) => setWithdrawAmount(event.target.value)}
                  handleSetMax={() => setWithdrawAmount('125000')}
                  selectedAssetId="BTC"
                  selectedAssetTicker="BTC"
                  formattedBalance="125,000"
                  decodedLnInvoice={null}
                  decodedRgbInvoice={null}
                  lnurlPayData={null}
                  witnessAmountSat={512}
                  setWitnessAmountSat={() => {}}
                  feeRate={feeRate}
                  setFeeRate={setFeeRate}
                  feeRates={{ slow: 2, normal: 5, fast: 9 }}
                  donation={donation}
                  setDonation={setDonation}
                />
              </div>
              <div className="space-y-4">
                <WithdrawInvoiceInfo
                  addressType="bitcoin"
                  decodedLnInvoice={null}
                  decodedRgbInvoice={null}
                  allAssets={[{ asset_id: 'BTC', ticker: 'BTC', precision: 0 }]}
                  selectedAssetId="BTC"
                  selectedAssetTicker="BTC"
                  assetBalance={125000}
                  maxLightningCapacity={750000}
                />
                <WithdrawRouteSelector
                  routes={[
                    { account: 'RGB', method: 'bitcoin_l1', summary: 'Spend from the RGB on-chain wallet.', accountTitle: 'RGB & Lightning', methodLabel: 'Bitcoin L1 transfer', feeHint: 'Miner fee' },
                    { account: 'ARKADE', method: 'boarding', summary: 'Spend from Arkade and board out to Bitcoin.', accountTitle: 'Arkade', methodLabel: 'Arkade boarding', feeHint: 'Low' },
                  ]}
                  activeRouteAccount="RGB"
                  recommendedRouteAccount="RGB"
                  selectedRouteSummary={{ method: 'bitcoin_l1', summary: 'Standard on-chain Bitcoin transfer.', methodLabel: 'Bitcoin L1 transfer' }}
                  selectedAccountTitle="RGB & Lightning"
                  onRouteChange={() => {}}
                />
              </div>
            </div>
          </Section>

          {/* ── Account Components ─────────────────────────────────────── */}
          <Section id="account-components" title="Account Components" description="Settings surfaces shared with the extension.">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-4">
                <SectionTitle>Network</SectionTitle>
                <AccountNetworkSelector
                  accountId="SPARK"
                  value={accountNetwork}
                  onChange={setAccountNetwork}
                />
                <AccountNotice>
                  Spark will reconnect using the selected network after saving in the consuming app.
                </AccountNotice>
              </div>
              <div className="space-y-4">
                <SectionTitle>Account Info</SectionTitle>
                <AccountInfoGrid
                  items={[
                    { label: 'Status', value: 'Ready' },
                    { label: 'Network', value: accountNetwork },
                    { label: 'Pubkey', value: '02c4f7...91ac' },
                    { label: 'Assets', value: 'BTC, USDB' },
                  ]}
                />
                <AccountNotice tone="warning">
                  Network switching affects addresses and invoices generated after the change.
                </AccountNotice>
              </div>
            </div>
          </Section>

          {/* ── Alert Banners ───────────────────────────────────────────── */}
          <Section id="alert-banners" title="Alert Banners" description="Contextual feedback messages.">
            <div className="flex flex-col gap-3 max-w-lg">
              <AlertBanner variant="info">
                Your transaction is being confirmed on the network. This may take a few minutes.
              </AlertBanner>
              <AlertBanner variant="success">
                Swap completed successfully! Funds have been credited to your wallet.
              </AlertBanner>
              <AlertBanner variant="warning">
                High network fees detected. Consider waiting for lower fees.
              </AlertBanner>
              <AlertBanner variant="error">
                Transaction failed. Insufficient funds to cover network fees.
              </AlertBanner>
            </div>
          </Section>

          {/* ── Setting Items ───────────────────────────────────────────── */}
          <Section id="setting-items" title="Setting Items" description="Settings rows with icon, title, description, and value.">
            <div className="flex flex-col gap-3 max-w-lg">
              <SectionLabel>Account</SectionLabel>
              <SettingItem
                icon="person"
                title="Profile"
                description="Manage your account details"
                onClick={() => {}}
              />
              <SettingItem
                icon="security"
                title="Security"
                description="PIN, biometrics, 2FA"
                onClick={() => {}}
              />
              <SettingItem
                icon="language"
                title="Language"
                showChevron={false}
                value={
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-auto py-1.5 px-3 text-xs font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: 'en', label: '🇬🇧 English' },
                        { value: 'it', label: '🇮🇹 Italiano' },
                        { value: 'es', label: '🇪🇸 Español' },
                        { value: 'fr', label: '🇫🇷 Français' },
                        { value: 'de', label: '🇩🇪 Deutsch' },
                        { value: 'pt', label: '🇵🇹 Português' },
                        { value: 'ja', label: '🇯🇵 日本語' },
                      ].map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              />
              <SectionLabel className="mt-4">Preferences</SectionLabel>
              <SettingItem
                icon="dark_mode"
                title="Dark Mode"
                value={<Switch checked={darkMode} onCheckedChange={setDarkMode} />}
                showChevron={false}
              />
              <SettingItem
                icon="notifications"
                title="Notifications"
                description="Push alerts for transactions"
                onClick={() => {}}
              />
            </div>
          </Section>

          {/* ── Inputs ──────────────────────────────────────────────────── */}
          <Section id="inputs" title="Inputs & Labels" description="Form controls.">
            <div className="flex flex-col gap-4 max-w-sm">
              <div className="flex flex-col gap-2">
                <Label htmlFor="addr">Bitcoin Address</Label>
                <Input id="addr" placeholder="bc1q..." />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Amount (sats)</Label>
                <NumberInput id="amount" placeholder="21000" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="disabled">Disabled</Label>
                <Input id="disabled" placeholder="Not editable" disabled />
              </div>
            </div>
          </Section>

          {/* ── Tabs ────────────────────────────────────────────────────── */}
          <Section id="tabs" title="Tabs" description="Tab navigation via Radix UI.">
            <div className="max-w-md">
              <Tabs defaultValue="send">
                <TabsList className="w-full">
                  <TabsTrigger value="send" className="flex-1">Send</TabsTrigger>
                  <TabsTrigger value="receive" className="flex-1">Receive</TabsTrigger>
                  <TabsTrigger value="swap" className="flex-1">Swap</TabsTrigger>
                </TabsList>
                <TabsContent value="send">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <Label>Recipient</Label>
                          <Input placeholder="bc1q..." />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Amount</Label>
                          <NumberInput placeholder="0" />
                        </div>
                        <Button className="mt-2">Send Bitcoin</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="receive">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-slate-400 text-center py-4">
                        Your receive address QR code would appear here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="swap">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-slate-400 text-center py-4">
                        Swap interface would appear here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Section>

          {/* ── Dialog ──────────────────────────────────────────────────── */}
          <Section id="dialog" title="Dialog" description="Modal dialog via Radix UI.">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Transaction</DialogTitle>
                  <DialogDescription>
                    You are about to send <span className="text-white font-semibold">21,000 sats</span> to the following address. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="my-2 p-3 rounded-xl bg-white/8">
                  <p className="text-xs font-mono text-slate-300 break-all">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                  </p>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm & Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          {/* ── Toast ───────────────────────────────────────────────────── */}
          <Section id="toast" title="Toast Notifications" description="Non-blocking feedback messages.">
            <Row label="Trigger toasts">
              <Button
                variant="outline"
                onClick={() =>
                  toast({ title: 'Transaction sent', description: 'Your transaction is being processed.' })
                }
              >
                Default Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: 'Swap completed',
                    description: 'You received 21,000 sats.',
                    action: <ToastAction altText="View">View</ToastAction>,
                  })
                }
              >
                With Action
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: 'Transaction failed',
                    description: 'Insufficient funds.',
                    variant: 'destructive',
                  })
                }
              >
                Destructive
              </Button>
            </Row>
          </Section>

        </main>
      </div>
    </div>
  )
}

import { createContext, Fragment, useContext, useEffect, useState } from 'react'
import { StateSnapshot } from './pages/StateSnapshot'
import { ProductPreviews } from './pages/ProductPreviews'
import { version } from '../../package.json'
import { ChartsGallery } from './pages/ChartsGallery'
import {
  AvatarGallery,
  BadgesGallery,
  CollapsibleGallery,
  CopyGallery,
  DialogShowCloseDemo,
  FormsGallery,
  ListsGallery,
  NoticesGallery,
  PageLayoutGallery,
  PopoverMenuGallery,
  TableGallery,
  ScrollbarsGallery,
} from './pages/ComponentGalleries'
import { ThemeToggle, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, NumberInput } from '@kaleido-ui/index'
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
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerSidebar,
  DrawerBody,
  DrawerSection,
  DrawerNavItem,
  DrawerNavGroup,
  DrawerFooter,
  Icon,
  Icons,
  Toaster,
  ToastAction,
  useToast,
  StatusBadge,
  NetworkBadge,
  InfoChip,
  NetworkInfoChip,
  AssetInfoChip,
  AssetCard,
  TransactionCard,
  SettingItem,
  SectionLabel,
  AlertBanner,
  ActionTile,
  AccountChoiceChip,
  AccountCapabilitiesCard,
  AccountInfoGrid,
  AccountNetworkNotice,
  AccountNetworkSelector,
  AccountNotice,
  AccountSettingsRow,
  AccountStatusPills,
  AccountStatusTabs,
  AppIcon,
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
  SettingsActionButton,
  SettingsStatusPanel,
  SettingsTile,
  FilterDropdown,
  SwapInputCard,
  TransferRouteCard,
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
  SwapStepList,
  SummaryRows,
  KaleidoswapLogo,
  KaleidoswapMark,
  HaloBackdrop,
} from '@kaleido-ui/index'
import type { StatusType, NetworkType, IconName } from '@kaleido-ui/index'
import { outlinedMap } from '@kaleido-ui/icons'

// ─── Section wrapper ────────────────────────────────────────────────────────

// The page on screen. Every section is written in one tree, as before, and
// renders only when it is the current page — so each component group is its
// own page without splitting this file into a module per page.
const CurrentPage = createContext<string>('')

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
  if (useContext(CurrentPage) !== id) return null
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div className="mb-6">
        <h1 id={`${id}-title`} className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        <div className="mt-3 h-px bg-gradient-to-r from-primary/40 via-foreground/10 to-transparent" />
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
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">{label}</p>
      <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''}`}>{children}</div>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

interface NavPage {
  id: string
  label: string
  icon: IconName
}

// One page per component group, grouped by what the components are for.
const NAV_CATEGORIES: { label: string; icon: IconName; pages: NavPage[] }[] = [
  {
    label: 'Foundations',
    icon: 'layers',
    pages: [
      { id: 'brand', label: 'Brand', icon: 'bolt' },
      { id: 'buttons', label: 'Buttons', icon: 'touch_app' },
      { id: 'icons', label: 'Icons', icon: 'palette' },
      { id: 'inputs', label: 'Inputs', icon: 'edit' },
      { id: 'tabs', label: 'Tabs', icon: 'tune' },
      { id: 'forms', label: 'Forms', icon: 'radio_button_unchecked' },
    ],
  },
  {
    label: 'Display',
    icon: 'visibility',
    pages: [
      { id: 'status-badges', label: 'Status Badges', icon: 'verified' },
      { id: 'network-badges', label: 'Network Badges', icon: 'hub' },
      { id: 'info-chips', label: 'Info Chips', icon: 'info' },
      { id: 'cards', label: 'Cards', icon: 'grid_view' },
      { id: 'alert-banners', label: 'Alert Banners', icon: 'warning' },
      { id: 'tone-badges', label: 'Tone Badges', icon: 'toll' },
      { id: 'avatar', label: 'Avatar', icon: 'person' },
      { id: 'collapsible', label: 'Collapsible', icon: 'expand_more' },
    ],
  },
  {
    label: 'Overlays',
    icon: 'apps',
    pages: [
      { id: 'dialog', label: 'Dialog', icon: 'chat_bubble' },
      { id: 'drawer', label: 'Drawer', icon: 'menu' },
      { id: 'toast', label: 'Toast', icon: 'description' },
      { id: 'popover-menu', label: 'Popover & Menu', icon: 'open_in_new' },
      { id: 'notices', label: 'Notices', icon: 'error' },
    ],
  },
  {
    label: 'Wallet',
    icon: 'account_balance_wallet',
    pages: [
      { id: 'asset-cards', label: 'Asset Cards', icon: 'token' },
      { id: 'transaction-cards', label: 'Transaction Cards', icon: 'receipt_long' },
      { id: 'feature-components', label: 'Feature Components', icon: 'inventory_2' },
      { id: 'account-components', label: 'Account Components', icon: 'fingerprint' },
      { id: 'setting-items', label: 'Setting Items', icon: 'settings' },
    ],
  },
  {
    label: 'Flows',
    icon: 'sync_alt',
    pages: [
      { id: 'activity-components', label: 'Activity', icon: 'history' },
      { id: 'deposit-components', label: 'Deposit', icon: 'arrow_downward' },
      { id: 'withdraw-components', label: 'Withdraw', icon: 'arrow_outward' },
      { id: 'swap-flow', label: 'Swap Flow', icon: 'swap_horiz' },
    ],
  },
  {
    label: 'Patterns',
    icon: 'hexagon',
    pages: [
      { id: 'copy', label: 'Copy', icon: 'content_copy' },
      { id: 'lists', label: 'Lists & filters', icon: 'search' },
      { id: 'page-layout', label: 'Page layout', icon: 'code' },
    ],
  },
  {
    label: 'Data',
    icon: 'trending_up',
    pages: [
      { id: 'table', label: 'Table', icon: 'table_rows' },
      { id: 'scrollbars', label: 'Scrollbars', icon: 'swap_vert' },
      { id: 'charts', label: 'Charts', icon: 'bar_chart' },
    ],
  },
]

// Every glyph in the set, read from the set itself, so the Icons page cannot
// list a name that draws nothing.
const ALL_ICON_NAMES = (Object.keys(outlinedMap) as IconName[]).sort()

// The Icons page's grid: fixed, narrow columns, so the space between icons
// is the same whatever the length of their names; a long name wraps under
// its own icon.
const ICON_GRID = 'grid w-full grid-cols-[repeat(auto-fill,4.5rem)] gap-x-3 gap-y-4'
const ICON_CELL = 'flex min-w-0 flex-col items-center gap-1'
const ICON_LABEL = 'w-full text-center font-mono text-xxs leading-tight text-slate-500 [overflow-wrap:anywhere]'

/**
 * An icon's name, allowed to wrap between its words — after an underscore
 * (`arrow_outward`) or before a capital (`VisibilityOff`) — rather than
 * mid-word.
 */
const IconLabel = ({ name }: { name: string }) => (
  <span className={ICON_LABEL}>
    {name.split(/(?<=_)|(?=[A-Z])/).map((part, index) => (
      <Fragment key={index}>
        {index > 0 && <wbr />}
        {part}
      </Fragment>
    ))}
  </span>
)

const NAV_PAGES = NAV_CATEGORIES.flatMap((category) => category.pages)

/**
 * The page a hash names. `#/buttons` is the page address; a bare `#buttons`
 * (the old in-page anchors) still lands on the same page. Anything else opens
 * the first page.
 */
const pageFromHash = (hash: string): string => {
  const id = hash.replace(/^#\/?/, '')
  return NAV_PAGES.some((page) => page.id === id) ? id : NAV_PAGES[0].id
}

const readCollapsed = () => {
  try {
    return window.localStorage.getItem('showcase:nav-collapsed') === '1'
  } catch {
    return false
  }
}

const writeCollapsed = (collapsed: boolean) => {
  try {
    window.localStorage.setItem('showcase:nav-collapsed', collapsed ? '1' : '0')
  } catch {
    // Private mode or blocked storage: the rail just does not persist.
  }
}

// ─── App ────────────────────────────────────────────────────────────────────

export function App() {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showcaseNavActive, setShowcaseNavActive] = useState('Dashboard')
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')
  const [activeView, setActiveView] = useState('dashboard')
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>('tx-1')
  const [activityTab, setActivityTab] = useState('all')
  const [activityStatus, setActivityStatus] = useState('all')
  const [activityNetwork, setActivityNetwork] = useState('all')
  const [activitySearch, setActivitySearch] = useState('')
  const [featureFilter, setFeatureFilter] = useState('all')
  const [selectedAssetTicker, setSelectedAssetTicker] = useState('BTC')
  const [swapToTicker, setSwapToTicker] = useState('USDB')
  const [swapAmount, setSwapAmount] = useState('21000')
  const [accountNetwork, setAccountNetwork] = useState<'mainnet' | 'testnet' | 'signet' | 'regtest'>('testnet')
  const [withdrawDestination, setWithdrawDestination] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
  const [withdrawAmount, setWithdrawAmount] = useState('21000')
  const [feeRate, setFeeRate] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [donation, setDonation] = useState(true)

  // Hash-based route: `#/state-snapshot` renders the State Snapshot page,
  // `#/products` the product previews, anything else the component showcase.
  const [route, setRoute] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  )
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const [navCollapsed, setNavCollapsed] = useState(readCollapsed)
  const [navOpen, setNavOpen] = useState(false)
  const page = pageFromHash(route)
  const pageIndex = NAV_PAGES.findIndex((item) => item.id === page)
  const previousPage = NAV_PAGES[pageIndex - 1]
  const nextPage = NAV_PAGES[pageIndex + 1]

  // A page change is a navigation: start at the top, and name the tab.
  useEffect(() => {
    if (route.startsWith('#/state-snapshot') || route.startsWith('#/products')) return
    window.scrollTo({ top: 0 })
    document.title = `${NAV_PAGES[pageIndex].label} · kaleido-ui showcase`
  }, [route, pageIndex])

  if (route.startsWith('#/products')) {
    return (
      <ProductPreviews
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  if (route.startsWith('#/state-snapshot')) {
    return (
      <StateSnapshot
        onBack={() => {
          window.location.hash = ''
        }}
      />
    )
  }

  // The showcase's own navigation, rendered by the desktop sidebar and the
  // mobile drawer alike: each category is a submenu, as Trade and Liquidity
  // are in the desktop app, and its pages show when it is opened.
  const pageNav = (
    <DrawerSection label="Components">
      {NAV_CATEGORIES.map((category) => (
        <DrawerNavGroup
          key={category.label}
          label={category.label}
          icon={<Icon name={category.icon} className="text-icon-xl" />}
          active={category.pages.some((item) => item.id === page)}
          href={`#/${category.pages[0].id}`}
        >
          {category.pages.map((item) => (
            <DrawerNavItem
              key={item.id}
              href={`#/${item.id}`}
              label={item.label}
              icon={<Icon name={item.icon} className="text-icon-md" />}
              active={item.id === page}
            />
          ))}
        </DrawerNavGroup>
      ))}
    </DrawerSection>
  )

  // The drawer's header and version line, the same in the showcase's own
  // navigation and in the Drawer page's demo.
  // The logo component: its wordmark is currentColor, so it reads on both themes.
  const lockup = <KaleidoswapLogo className="h-8 w-auto text-foreground" />
  const drawerVersion = <p className="truncate text-center text-tiny text-content-tertiary">v{version}</p>

  const navFooter = (
    <DrawerFooter className="space-y-3">
      <DrawerSection label="Quick actions">
        <DrawerNavItem
          href="#/products"
          label="Product previews"
          icon={<Icon name="grid_view" className="text-icon-xl" />}
        />
        <DrawerNavItem
          href="#/state-snapshot"
          label="State Snapshot"
          icon={<Icon name="science" className="text-icon-xl" />}
        />
      </DrawerSection>
      {drawerVersion}
    </DrawerFooter>
  )

  // One navigation list, rendered by both drawer demos.
  const showcaseNav = [
    { label: 'Wallet',
    icon: 'account_balance_wallet', items: [
      { label: 'Dashboard', icon: 'account_balance_wallet' as const },
      { label: 'Swaps', icon: 'swap_horiz' as const },
      { label: 'Activity', icon: 'history' as const },
    ] },
    { label: 'Account', items: [{ label: 'Settings', icon: 'settings' as const }] },
  ].map((section) => (
    <DrawerSection key={section.label} label={section.label}>
      {section.items.map((item) => (
        <DrawerNavItem
          key={item.label}
          href="#/drawer"
          label={item.label}
          icon={<Icon name={item.icon} className="text-icon-xl" />}
          active={showcaseNavActive === item.label}
          onClick={(event) => {
            event.preventDefault()
            setShowcaseNavActive(item.label)
          }}
        />
      ))}
    </DrawerSection>
  ))

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Toaster />

      {/* Left bar — desktop: the sidebar, folding to an icon rail */}
      <DrawerSidebar
        aria-label="Showcase navigation"
        className="hidden lg:flex"
        collapsed={navCollapsed}
        onCollapsedChange={(collapsed) => {
          setNavCollapsed(collapsed)
          writeCollapsed(collapsed)
        }}
        header={lockup}
      >
        <DrawerBody>
          <nav aria-label="Components">{pageNav}</nav>
        </DrawerBody>
        {navFooter}
      </DrawerSidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar — the theme switch on the right; on mobile also the navigation drawer */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-foreground/5 bg-background/80 px-4 backdrop-blur-xl">
          <div className="lg:hidden">
          <Drawer open={navOpen} onOpenChange={setNavOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label={`Open navigation, current page: ${NAV_PAGES[pageIndex].label}`}
              >
                <Icon name="menu" size="md" />
              </Button>
            </DrawerTrigger>
            <DrawerContent header={lockup}>
              <DrawerTitle className="sr-only">Showcase navigation</DrawerTitle>
              <DrawerDescription>Component pages, by category</DrawerDescription>
              <DrawerBody>
                <nav aria-label="Components">{pageNav}</nav>
              </DrawerBody>
              {navFooter}
            </DrawerContent>
          </Drawer>
          </div>
          <ThemeToggle className="ml-auto" />
        </header>

        {/* The current page */}
        <CurrentPage.Provider value={page}>
        <main className="mx-auto w-full max-w-5xl min-w-0 flex-1 px-6 py-8">

          {/* ── Brand ───────────────────────────────────────────────────── */}
          <Section id="brand" title="Brand" description="Logo, per-theme foregrounds, brand gradient, glows and the halo backdrop.">
            <Row label="KaleidoswapLogo / KaleidoswapMark">
              <KaleidoswapLogo className="h-8 w-auto text-foreground" />
              <KaleidoswapLogo orientation="vertical" className="h-16 w-auto text-foreground" />
              <KaleidoswapMark className="size-8" />
              <KaleidoswapMark className="size-14" />
            </Row>
            <Row label="ThemeToggle — light / dark (the one in the top bar drives the page)">
              <ThemeToggle mode="light" onModeChange={() => {}} />
              <ThemeToggle mode="dark" onModeChange={() => {}} />
            </Row>
            <Row label="Per-theme foregrounds (text-*-fg)">
              <span className="text-brand font-bold">text-brand</span>
              <span className="text-accent-send-fg font-bold">text-accent-send-fg</span>
              <span className="text-accent-recv-fg font-bold">text-accent-recv-fg</span>
              <span className="text-success-fg">success</span>
              <span className="text-warning-fg">warning</span>
              <span className="text-danger-fg">danger</span>
              <span className="text-info-fg">info</span>
              <span className="text-network-bitcoin-fg">bitcoin</span>
              <span className="text-network-lightning-fg">lightning</span>
              <span className="text-network-liquid-fg">liquid</span>
              <span className="text-network-arkade-fg">arkade</span>
              <span className="text-network-spark-fg">spark</span>
              <span className="text-network-rgb-fg">rgb</span>
            </Row>
            <Row label="text-gradient-brand">
              <span className="text-gradient-brand text-display font-bold">Swap across layers</span>
            </Row>
            <Row label="shadow-glow-send / shadow-glow-recv / shadow-glow-card">
              <div className="rounded-2xl bg-card px-5 py-4 shadow-glow-send">Send</div>
              <div className="rounded-2xl bg-card px-5 py-4 shadow-glow-recv">Receive</div>
              <div className="rounded-2xl bg-card px-5 py-4 shadow-glow-card">Card</div>
            </Row>
            <Row label="bg-page-brand + HaloBackdrop">
              <div className="bg-page-brand h-40 w-64 rounded-2xl bg-background" />
              <div className="relative isolate h-40 w-64 overflow-hidden rounded-2xl bg-background">
                <HaloBackdrop />
              </div>
            </Row>
          </Section>

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
              <Button size="icon-lg"><Icon name="arrow_outward" /></Button>
              <Button size="icon-xl"><Icon name="swap_horiz" /></Button>
            </Row>
            <Row label="With icons">
              <Button><Icon name="arrow_outward" size="sm" />Send</Button>
              <Button variant="outline"><Icon name="south_west" size="sm" />Receive</Button>
              <Button variant="ghost"><Icon name="swap_horiz" size="sm" />Swap</Button>
              <Button variant="hyperlink" className="no-underline"><Icon name="open_in_new" size="xs" className="!text-[15px] leading-none translate-y-[1.5px] icon" /><span className="underline underline-offset-2 group-hover:decoration-[#31ff8b]">Learn more</span></Button>
            </Row>
          </Section>

          {/* ── Icons ───────────────────────────────────────────────────── */}
          <Section id="icons" title="Icons" description="Material Symbols wrapper with size variants.">
            <Row label="Named shortcuts (Icons.*)">
              <div className={ICON_GRID}>
                {Object.entries(Icons).map(([key, IconComp]) => (
                  <div key={key} className={ICON_CELL}>
                    <div className="size-10 rounded-xl bg-primary/15 hover:bg-primary/25 hover:scale-105 transition-all flex items-center justify-center cursor-default">
                      <IconComp size="md" className="text-[#31ff8b]" />
                    </div>
                    <IconLabel name={key} />
                  </div>
                ))}
              </div>
            </Row>
            <Row label={`The whole set (${ALL_ICON_NAMES.length})`}>
              <div className={ICON_GRID}>
                {ALL_ICON_NAMES.map((name) => (
                  <div key={name} className={ICON_CELL}>
                    <div className="size-10 rounded-xl bg-primary/15 hover:bg-primary/25 hover:scale-105 transition-all flex items-center justify-center cursor-default">
                      <Icon name={name} size="md" className="text-[#31ff8b]" />
                    </div>
                    <IconLabel name={name} />
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
              {(['L1', 'LN', 'RGB20', 'RGB21', 'RGB-L1', 'RGB-LN', 'Spark', 'Arkade', 'Liquid', 'Taproot'] as NetworkType[]).map((n) => (
                <NetworkBadge key={n} network={n} showLabel />
              ))}
            </Row>
            <Row label="Network chips without text">
              {(['L1', 'LN', 'RGB20', 'Spark', 'Arkade', 'Liquid', 'Taproot'] as NetworkType[]).map((n) => (
                <NetworkBadge key={n} network={n} />
              ))}
            </Row>
          </Section>

          {/* ── Info Chips ─────────────────────────────────────────────── */}
          <Section id="info-chips" title="Info Chips" description="Compact, readable, read-only information for 400px popup layouts.">
            <div className="grid max-w-[400px] gap-3">
              <NetworkInfoChip
                network="LN"
                value="Lightning Network"
                status="success"
                statusLabel="Connected"
                onEdit={() => toast({ title: 'Edit network' })}
                editLabel="Edit selected network"
              />
              <AssetInfoChip
                ticker="BTC"
                value="Bitcoin · BTC"
                status="info"
                statusLabel="Native asset"
              />
              <InfoChip
                leading={<Icon name="hub" />}
                label="Node endpoint"
                value="https://node.kaleidoswap.example/a-very-long-readable-path"
                status="warning"
                statusLabel="Needs review"
                onEdit={() => toast({ title: 'Edit node endpoint' })}
                editLabel="Edit node endpoint"
              />
            </div>
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
                  <p className="text-sm text-muted-foreground">Card body content goes here. Cards can hold any child elements.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>Actions in the footer slot.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Use CardFooter for action buttons or summary information.</p>
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
                <div className="relative rounded-2xl bg-card/60 p-4">
                  <BottomNav
                    activeView={activeView}
                    onChange={setActiveView}
                    position="inline"
                    className="mx-auto"
                    items={[
                      { id: 'dashboard', label: 'Wallet',
    icon: 'account_balance_wallet', iconName: 'account_balance_wallet' },
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
                <FilterDropdown
                  label="Network"
                  value={featureFilter}
                  onChange={setFeatureFilter}
                  options={[
                    { value: 'all', label: 'All Networks' },
                    { value: 'lightning', label: 'Lightning' },
                    { value: 'spark', label: 'Spark' },
                    { value: 'arkade', label: 'Arkade' },
                  ]}
                />
                <div className="space-y-3">
                  <SettingsTile
                    icon={<AppIcon name="vault" className="size-5 text-blue-400" />}
                    title="Change Password"
                    description="Update your wallet password"
                    onClick={() => {}}
                  />
                  <SettingsStatusPanel label="Wallet status" value="ready" />
                  <SettingsActionButton
                    icon={<AppIcon name="lock" className="size-5" />}
                    onClick={() => {}}
                  >
                    Lock Wallet
                  </SettingsActionButton>
                </div>
              </div>
              <div className="space-y-5 max-w-md">
                <div className="flex gap-2.5">
                  <ActionTile icon={<Icon name="call_received" size="sm" />} label="Deposit" onClick={() => {}} />
                  <ActionTile icon={<Icon name="swap_horiz" size="sm" />} label="Swap" onClick={() => {}} />
                  <ActionTile icon={<Icon name="arrow_outward" size="sm" />} label="Withdraw" onClick={() => {}} />
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
                    { id: 'kaleidoswap:BTC:btc', ticker: 'BTC', name: 'Bitcoin', network: 'LN' },
                    { id: 'flashnet:SPARK:usdb', ticker: 'USDB', name: 'Bitcoin Dollar', network: 'Spark', category: 'stablecoins' },
                    { id: 'kaleidoswap:RGB:mstr', ticker: 'MSTR', name: 'MicroStrategy', network: 'RGB-LN', category: 'rwa' },
                  ]}
                />
                <QrCode value="kaleidoswap:receive:sample" size={168} />
              </div>
              <div className="max-w-md rounded-2xl bg-card/60 p-4">
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
                      networkBannerClassName: 'border-primary/20 bg-primary/10 text-brand',
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
              <div className="space-y-4 max-w-md">
                <AccountSettingsRow
                  accountId="SPARK"
                  title="Spark Account"
                  status="ready"
                  network="mainnet"
                  description="Spark balance, operator connection, SDK details, and network selection."
                  onClick={() => {}}
                />
                <AccountCapabilitiesCard
                  accountId="ARKADE"
                  title="Arkade"
                  description="Arkade BTC and Arkade-native assets are available on mainnet."
                  status="ready"
                  capabilities={['Direct receive', 'Bitcoin boarding', 'VTXO lifecycle controls']}
                  accent="purple"
                  isExpanded
                  onToggle={() => {}}
                  collapsible={false}
                >
                  <div className="space-y-4">
                    <AccountStatusPills status="ready" network="mainnet" />
                    <AccountInfoGrid
                      items={[
                        { label: 'Summary', value: 'Arkade-native assets and BTC routing.' },
                        { label: 'Network', value: 'Mainnet' },
                        { label: 'Server', value: 'https://arkade.example' },
                        { label: 'SDKs', value: '@arkade-os/sdk' },
                      ]}
                    />
                    <AccountNetworkNotice network="mainnet">
                      Network changes affect destination validation and route safety warnings.
                    </AccountNetworkNotice>
                    <AccountNotice tone="warning">
                      Double-check addresses and invoices after changing networks.
                    </AccountNotice>
                  </div>
                </AccountCapabilitiesCard>
                <TransferRouteCard
                  label="Spark"
                  summary="Fast Spark-native transfers when the destination supports it."
                  eta="Instant"
                  feeHint="Low fee"
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
                hasActiveFilters={activitySearch !== '' || activityStatus !== 'all'}
                onClearFilters={() => {
                  setActivitySearch('')
                  setActivityStatus('all')
                }}
                searchPlaceholder="Search assets..."
                statusOptions={[
                  { value: 'all', label: 'All Status' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
              />
              <ActivityNetworkFilters
                activeFilter={activityNetwork}
                onChange={(nextNetwork) =>
                  setActivityNetwork((currentNetwork) =>
                    nextNetwork !== 'all' && nextNetwork === currentNetwork ? 'all' : nextNetwork
                  )
                }
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
                        <ActivityDetailRow label="Network" value={<NetworkBadge network={item.network ?? 'LN'} showLabel />} />
                        <ActivityDetailRow label="Status" value={<StatusBadge status={item.status} />} />
                      </>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <ActivityList
                items={[]}
                renderEmptyActions={() => (
                  <div className="w-full max-w-56">
                    <Button variant="h1" size="lg">
                      <AppIcon name="receive" size="sm" />
                      Receive
                    </Button>
                  </div>
                )}
              />
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
                <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl bg-card/70 p-5">
                  <div className="relative rounded-2xl border-2 border-primary/30 bg-white p-3">
                    <QrCode value="lightning:lnbc21000sampleinvoice" size={168} />
                    <PaidOverlay />
                  </div>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-xs font-bold text-foreground">
                  <CopyIcon copied={false} />
                  Copy invoice
                </button>
                <div className="rounded-xl bg-card/70 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-foreground">
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
          <Section id="swap-flow" title="Swap Flow" description="Deciding on a pending swap (SummaryRows) and following it (SwapStepList).">
            <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-card/70 p-4">
                <SectionLabel>Review</SectionLabel>
                <SummaryRows
                  className="mt-3"
                  rows={[
                    { label: 'You pay', value: '1,005 sats', emphasis: true },
                    { label: 'Invoice receives', value: '1,000 sats' },
                    { label: 'Fee', value: '5 sats', hint: '0.5% spread' },
                    { label: 'Refund opens', value: 'in 90 min', tone: 'warning' },
                    { label: 'Solver', value: '66422c…e3ce', mono: true },
                  ]}
                />
              </div>
              <div className="rounded-2xl bg-card/70 p-4">
                <SectionLabel>Progress</SectionLabel>
                <SwapStepList
                  className="mt-3"
                  steps={[
                    {
                      id: 'quote',
                      label: 'Quote locked',
                      description: '1,005 sats → 1,000 sat invoice',
                      status: 'done',
                    },
                    {
                      id: 'fund',
                      label: 'Contract funded',
                      description: 'txid a91c…04d7',
                      status: 'done',
                    },
                    { id: 'fill', label: 'Solver paying invoice', status: 'active' },
                    { id: 'claim', label: 'Invoice paid', status: 'pending' },
                  ]}
                />
              </div>
            </div>
          </Section>

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
          <Section id="tabs" title="Tabs" description="Tabbed wallet workflow using send, receive, and swap components together.">
            <div className="max-w-lg">
              <Tabs defaultValue="send">
                <TabsList className="w-full">
                  <TabsTrigger value="send" className="flex-1">Send</TabsTrigger>
                  <TabsTrigger value="receive" className="flex-1">Receive</TabsTrigger>
                  <TabsTrigger value="swap" className="flex-1">Swap</TabsTrigger>
                </TabsList>
                <TabsContent value="send" className="mt-4">
                  <div className="space-y-4 rounded-3xl bg-card/60 p-4">
                    <WithdrawDestinationInput
                      destination={withdrawDestination}
                      setDestination={setWithdrawDestination}
                      addressType="bitcoin"
                      detectedNetworkLabel="Bitcoin L1"
                      isDecoding={false}
                      isResolvingLnurl={false}
                      handlePaste={() => setWithdrawDestination('bc1qsampledestinationaddress')}
                      handleReset={() => setWithdrawDestination('')}
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
                    <Button variant="cta" size="cta">Review Send</Button>
                  </div>
                </TabsContent>
                <TabsContent value="receive" className="mt-4">
                  <div className="space-y-4 rounded-3xl bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Receive
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">Lightning Invoice</p>
                      </div>
                      <NetworkBadge network="LN" showLabel />
                    </div>
                    <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl bg-black/20 p-5">
                      <div className="relative rounded-2xl bg-white p-3">
                        <QrCode value="lightning:lnbc21000sampleinvoice" size={168} />
                        <PaidOverlay />
                      </div>
                    </div>
                    <InvoiceStatusBanner
                      invoiceStatus="pending"
                      isInvoicePending
                      isInvoicePaid={false}
                      isInvoiceFailedOrExpired={false}
                    />
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground/[0.05] px-3 py-3 text-xs font-bold text-foreground transition-colors hover:bg-foreground/[0.08]">
                      <CopyIcon copied={false} />
                      Copy invoice
                    </button>
                    <NetworkInfoDisclosure networks={['onchain', 'lightning', 'spark', 'arkade']} />
                  </div>
                </TabsContent>
                <TabsContent value="swap" className="mt-4">
                  <SwapInputCard
                    fromTicker={selectedAssetTicker}
                    toTicker={swapToTicker}
                    fromInput={swapAmount}
                    fromOptions={[
                      { ticker: 'BTC', name: 'Bitcoin', network: 'LN', networkId: 'bitcoin' },
                      { ticker: 'USDB', name: 'Bitcoin Dollar', network: 'Spark', category: 'stablecoins' },
                      { ticker: 'MSTR', name: 'MicroStrategy', network: 'RGB-LN', category: 'rwa' },
                      { id: 'ethereum:USDT', ticker: 'USDT', name: 'Tether (Ethereum)', networkId: 'ethereum', category: 'stablecoins', networkTag: { label: 'Ethereum', color: '#627eea' } },
                      { id: 'tron:USDT', ticker: 'USDT', name: 'Tether (Tron)', networkId: 'tron', category: 'stablecoins', networkTag: { label: 'Tron', color: '#ff0013' } },
                      { id: 'ethereum:USDC', ticker: 'USDC', name: 'USD Coin', networkId: 'ethereum', category: 'stablecoins', networkTag: { label: 'Ethereum', color: '#627eea' } },
                    ]}
                    fromNetworks={[
                      { id: 'bitcoin', label: 'Bitcoin', iconUrl: '/icons/bitcoin/bitcoin-logo.svg' },
                      { id: 'ethereum', label: 'Ethereum' },
                      { id: 'tron', label: 'Tron' },
                    ]}
                    fromQuickAssets={[{ ticker: 'BTC' }, { ticker: 'USDT' }, { ticker: 'USDC' }]}
                    toOptions={[
                      { ticker: 'BTC', name: 'Bitcoin', network: 'LN' },
                      { ticker: 'USDB', name: 'Bitcoin Dollar', network: 'Spark', category: 'stablecoins' },
                      { ticker: 'MSTR', name: 'MicroStrategy', network: 'RGB-LN', category: 'rwa' },
                    ]}
                    categories={[
                      { id: 'stablecoins', label: 'Stablecoins' },
                      { id: 'rwa', label: 'RWA' },
                      { id: 'meme', label: 'Meme' },
                    ]}
                    defaultActiveCategories={['stablecoins', 'rwa']}
                    availableText="125,000 sats"
                    selectedPercentage={50}
                    fromUnitLabel="sats"
                    receiveAmount="20.82"
                    receiveUnitLabel={swapToTicker}
                    quoteRateText="1 BTC = 99,140 USDB"
                    quoteFeeText="0.3%"
                    quoteExpiresText="24s"
                    submitLabel="Review Swap"
                    onFromTickerChange={setSelectedAssetTicker}
                    onToTickerChange={setSwapToTicker}
                    onFromInputChange={setSwapAmount}
                    onPercentageClick={(percent) => setSwapAmount(String(Math.floor((125000 * percent) / 100)))}
                    onFlip={() => {
                      setSelectedAssetTicker(swapToTicker)
                      setSwapToTicker(selectedAssetTicker)
                    }}
                    onSubmit={() => {}}
                  />
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
                    You are about to send <span className="text-foreground font-semibold">21,000 sats</span> to the following address. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="my-2 p-3 rounded-xl bg-foreground/8">
                  <p className="text-xs font-mono text-foreground/80 break-all">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                  </p>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm & Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DialogShowCloseDemo />
          </Section>

          {/* ── Drawer ──────────────────────────────────────────────────── */}
          <Section id="drawer" title="Drawer" description="The desktop app's left sidebar: on the desktop it folds to an icon rail, on a phone it opens over the page. One navigation list renders in both.">
            <Row label="Desktop · DrawerSidebar (chevron folds it to the rail)" wrap={false}>
              <div className="flex h-[440px] w-full overflow-hidden rounded-2xl ring-1 ring-foreground/10">
                <DrawerSidebar
                  className="static h-full"
                  collapsed={sidebarCollapsed}
                  onCollapsedChange={setSidebarCollapsed}
                  header={lockup}
                >
                  <DrawerBody>{showcaseNav}</DrawerBody>
                  <DrawerFooter>{drawerVersion}</DrawerFooter>
                </DrawerSidebar>
                <div className="flex-1 bg-surface-raised p-6">
                  <p className="text-caption text-content-secondary">
                    Current page: <span className="font-semibold text-foreground">{showcaseNavActive}</span>
                  </p>
                </div>
              </div>
            </Row>
            <Row label="Mobile · Drawer (the same list, over the page)">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label={`Open navigation, current page: ${showcaseNavActive}`}
                  >
                    <Icon name="menu" size="md" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent header={lockup}>
                  <DrawerTitle className="sr-only">Navigation</DrawerTitle>
                  <DrawerDescription>Main navigation</DrawerDescription>
                  <DrawerBody>{showcaseNav}</DrawerBody>
                  <DrawerFooter>{drawerVersion}</DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Row>
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

          <Section id="forms" title="Forms" description="FormField: a label, its control, a hint and an error.">
            <FormsGallery />
          </Section>
          <Section id="table" title="Table" description="The dense data grid for desk surfaces.">
            <TableGallery />
          </Section>
          <Section id="scrollbars" title="Scrollbars" description="ScrollArea and HorizontalScrollArea: the one overlay thumb every scroller in the library uses.">
            <ScrollbarsGallery />
          </Section>
          <Section id="tone-badges" title="Tone Badges" description="ToneBadge tones, including secondary and outline, and case=&quot;none&quot; for values.">
            <BadgesGallery />
          </Section>
          <Section id="avatar" title="Avatar" description="Image, initials or the person glyph.">
            <AvatarGallery />
          </Section>
          <Section id="collapsible" title="Collapsible" description="The open/close primitive, and DisclosureCard built on it.">
            <CollapsibleGallery />
          </Section>
          <Section id="popover-menu" title="Popover & Menu" description="An anchored panel, and a real menu.">
            <PopoverMenuGallery />
          </Section>
          <Section id="notices" title="Notices" description="Notices that stay until closed: the top bar and the floating notice.">
            <NoticesGallery />
          </Section>
          <Section id="copy" title="Copy" description="Copying that says whether it worked.">
            <CopyGallery />
          </Section>
          <Section id="lists" title="Lists & filters" description="QueryState, EmptyState, RecordList, FilterBar, the segmented control, Pager, ValueList, EventTimeline and checklists.">
            <ListsGallery />
          </Section>
          <Section id="page-layout" title="Page layout" description="The desk page header, MetricCard sizes and an ordered log.">
            <PageLayoutGallery />
          </Section>

          {/* ── Charts ──────────────────────────────────────────────────── */}
          <Section
            id="charts"
            title="Charts"
            description="The common chart forms, one per job: trend, comparison, part-to-whole, relation, a single figure. Plain SVG, theme colours, a table view on every chart."
          >
            <ChartsGallery />
          </Section>

          {/* Page to page, in nav order */}
          <nav aria-label="Pages" className="mt-16 flex items-center justify-between gap-4 border-t border-foreground/5 pt-6">
            {previousPage ? (
              <a href={`#/${previousPage.id}`} className={buttonVariants({ variant: 'ghost' })}>
                <Icon name="arrow_back" size="sm" /> {previousPage.label}
              </a>
            ) : (
              <span />
            )}
            {nextPage && (
              <a href={`#/${nextPage.id}`} className={buttonVariants({ variant: 'ghost' })}>
                {nextPage.label} <Icon name="arrow_forward" size="sm" />
              </a>
            )}
          </nav>
        </main>
        </CurrentPage.Provider>
      </div>
    </div>
  )
}

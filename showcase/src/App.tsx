import { createContext, Fragment, useContext, useEffect, useState } from 'react'
import { ProductPreviews } from './pages/ProductPreviews'
import { version } from '../../package.json'
import { ChartsGallery } from './pages/ChartsGallery'
import { MetricsGallery } from './pages/MetricsGallery'
import { PanelsGallery } from './pages/PanelsGallery'
import {
  AvatarGallery,
  CollapsibleGallery,
  DisplayListsGallery,
  CopyGallery,
  DialogShowCloseDemo,
  FormsGallery,
  ListsGallery,
    PopoverMenuGallery,
  TableGallery,
  ScrollbarsGallery,
  NetworkFilterDropdown,
} from './pages/ComponentGalleries'
import { ActionsGallery } from './pages/ActionsGallery'
import { InputFieldsGallery } from './pages/InputFieldsGallery'
import { eyebrow } from '@kaleido-ui/utils/type-roles'
import { Demo, Grid } from './pages/blocks'
import { slug } from './search/slug'
import { SearchBar } from './search/SearchBar'
import { cn, ScrollArea, ThemeToggle, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, NumberInput } from '@kaleido-ui/index'
import {
  Button,
  IconButton,
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
  SegmentedTabs,
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
  useDrawerCollapsed,
  Icon,
  Icons,
  Toaster,
  ToastAction,
  useToast,
  StatusBadge,
  NetworkBadge,
  StatusChip,
  Tag,
  ToneBadge,
  AssetCard,
  SettingItem,
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
  InvoiceStatusBanner,
  MethodChoiceChip,
  NetworkInfoDisclosure,
  PaidOverlay,
  QrCode,
  SettingsActionButton,
  SettingsStatusPanel,
  SettingsTile,
  LiquidNetworkIcon,
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

/** The element the page scrolls in: a page change starts it back at the top. */
const SHOWCASE_SCROLL_ID = 'showcase-scroll'

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
      <div className="mb-16">
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
    <div className="mb-16" data-search-key={slug(label)}>
      <h3 className={cn('m-0 mb-4', eyebrow, 'text-secondary-content')}>{label}</h3>
      <div className={`flex items-center gap-3 ${wrap ? 'flex-wrap' : ''}`}>{children}</div>
    </div>
  )
}

/** SegmentedTabs: a choice that switches no panel, full width in a form and compact in a card header. */
function SegmentedTabsDemo() {
  const [environment, setEnvironment] = useState('test')
  const [period, setPeriod] = useState('30d')
  const [view, setView] = useState('list')
  return (
    <div className="mt-16 flex max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label id="environment-label">Environment — full width, Live disabled</Label>
        <SegmentedTabs
          aria-labelledby="environment-label"
          value={environment}
          onValueChange={setEnvironment}
          options={[
            { value: 'test', label: 'Test' },
            { value: 'live', label: 'Live', disabled: true },
          ]}
        />
      </div>
      <Row label='size="compact" fullWidth={false} — a card header period'>
        <SegmentedTabs
          aria-label="Period"
          size="compact"
          fullWidth={false}
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
          ]}
        />
      </Row>
      <Row label="With icon — option.icon before the label">
        <SegmentedTabs
          aria-label="View"
          fullWidth={false}
          value={view}
          onValueChange={setView}
          options={[
            { value: 'list', label: 'List', icon: <Icon name="menu" size="sm" /> },
            { value: 'grid', label: 'Grid', icon: <Icon name="grid_view" size="sm" /> },
          ]}
        />
      </Row>
    </div>
  )
}

// ─── External logos ─────────────────────────────────────────────────────────

/**
 * Third-party marks, served from /logos. `on` is the backdrop a variant is
 * drawn for: a white mark sits on a dark swatch, a black one on a light swatch,
 * and full-colour marks on the card in either theme.
 */
interface LogoVariant {
  label: string
  src: string
  on?: 'dark' | 'light'
}

const PROTOCOL_LOGOS: { name: string; variants: LogoVariant[] }[] = [
  { name: 'Bitcoin', variants: [{ label: 'Logo', src: '/logos/protocols/bitcoin.svg' }] },
  { name: 'Lightning', variants: [{ label: 'Logo', src: '/logos/protocols/lightning.svg' }] },
  {
    name: 'Liquid',
    variants: [
      { label: 'Logo', src: '/logos/protocols/liquid.svg' },
      { label: 'Wordmark, dark', src: '/logos/protocols/liquid-wordmark-dark.svg', on: 'light' },
      { label: 'Wordmark, white', src: '/logos/protocols/liquid-wordmark-white.svg', on: 'dark' },
    ],
  },
  { name: 'Arkade', variants: [{ label: 'Logo', src: '/logos/protocols/arkade.svg' }] },
  {
    name: 'Spark',
    variants: [
      { label: 'Logo, black', src: '/logos/protocols/spark-logo-black.svg', on: 'light' },
      { label: 'Logo, white', src: '/logos/protocols/spark-logo-white.svg', on: 'dark' },
      { label: 'Asterisk, black', src: '/logos/protocols/spark-asterisk-black.svg', on: 'light' },
      { label: 'Asterisk, white', src: '/logos/protocols/spark-asterisk-white.svg', on: 'dark' },
      { label: 'Badge, black', src: '/logos/protocols/spark-badge-black.svg', on: 'light' },
      { label: 'Badge, white', src: '/logos/protocols/spark-badge-white.svg', on: 'dark' },
    ],
  },
  { name: 'RGB', variants: [{ label: 'Logo', src: '/logos/protocols/rgb.webp' }] },
  { name: 'Taproot Assets', variants: [{ label: 'Logo', src: '/logos/protocols/taproot-assets.webp' }] },
  { name: 'Cashu', variants: [{ label: 'Logo', src: '/logos/protocols/cashu.svg' }] },
  { name: 'Nostr', variants: [{ label: 'Logo', src: '/logos/protocols/nostr.svg' }] },
  {
    name: 'Lightning Labs (Wavelength)',
    variants: [
      { label: 'Logo, black', src: '/logos/protocols/lightning-labs-black.svg', on: 'light' },
      { label: 'Logo, white', src: '/logos/protocols/lightning-labs-white.svg', on: 'dark' },
    ],
  },
]

const ASSET_LOGOS: { name: string; variants: LogoVariant[] }[] = [
  {
    name: 'Tether USDt',
    variants: [
      { label: 'Token', src: '/logos/assets/usdt.svg' },
      { label: 'With background', src: '/logos/assets/usdt-background.svg' },
      { label: 'White', src: '/logos/assets/usdt-white.svg', on: 'dark' },
    ],
  },
  {
    name: 'Tether Gold XAUt',
    variants: [
      { label: 'Token', src: '/logos/assets/xaut.svg' },
      { label: 'With background', src: '/logos/assets/xaut-background.svg' },
    ],
  },
]

const LOGO_SWATCH = {
  card: 'bg-foreground/[0.04] border-foreground/5',
  dark: 'bg-[#0b0d10] border-white/10',
  light: 'bg-white border-black/10',
} as const

function LogoGroup({ name, variants }: { name: string; variants: LogoVariant[] }) {
  return (
    <div>
      <p className="mb-3 text-body font-semibold text-foreground">{name}</p>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => (
          <figure key={v.src} className="flex w-28 flex-col gap-1.5">
            <div
              className={`flex h-20 items-center justify-center rounded-xl border p-3 ${LOGO_SWATCH[v.on ?? 'card']}`}
            >
              <img src={v.src} alt={`${name} — ${v.label}`} className="max-h-full max-w-full object-contain" />
            </div>
            <figcaption className="font-mono text-xxs leading-tight text-muted-foreground">
              <span className="block text-foreground/80">{v.label}</span>
              <span className="[overflow-wrap:anywhere]">{v.src.replace('/logos/', '')}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

interface NavPage {
  id: string
  label: string
  icon: IconName
}

interface NavCategory {
  label: string
  icon: IconName
  pages: NavPage[]
}

// One page per component group, grouped by what the components are for:
// the generic building blocks first, then the wallet's own surfaces and flows.
const NAV_SECTIONS: { label: string; categories: NavCategory[] }[] = [
  {
    label: 'Basic Components',
    categories: [
      {
        label: 'Foundations',
        icon: 'layers',
        pages: [
          { id: 'brand', label: 'Brand', icon: 'rocket_launch' },
          { id: 'icons', label: 'Icons', icon: 'palette' },
          { id: 'external-logos', label: 'External logos', icon: 'hub' },
          { id: 'buttons', label: 'Buttons', icon: 'touch_app' },
          { id: 'inputs', label: 'Inputs', icon: 'edit' },
          { id: 'forms', label: 'Forms', icon: 'radio_button_unchecked' },
          { id: 'toggle', label: 'Toggles', icon: 'dark_mode' },
          { id: 'tabs', label: 'Tabs', icon: 'tune' },
        ],
      },
      {
        label: 'Display',
        icon: 'visibility',
        pages: [
          { id: 'chips', label: 'Chips', icon: 'verified' },
          { id: 'network-badges', label: 'Network Badges', icon: 'hub' },
          { id: 'cards', label: 'Cards', icon: 'grid_view' },
          { id: 'alert-banners', label: 'Alert Banners', icon: 'warning' },
          { id: 'avatar', label: 'Avatars', icon: 'person' },
          { id: 'collapsible', label: 'Disclosures', icon: 'expand_more' },
          { id: 'display-lists', label: 'Lists', icon: 'menu' },
          { id: 'scrollbars', label: 'Scrollbars', icon: 'swap_vert' },
        ],
      },
      {
        label: 'Overlays',
        icon: 'hexagon',
        pages: [
          { id: 'dialog', label: 'Dialog', icon: 'chat_bubble' },
          { id: 'drawer', label: 'Drawer', icon: 'menu' },
          { id: 'toast', label: 'Toast', icon: 'description' },
          { id: 'popover-menu', label: 'Popover & Menu', icon: 'open_in_new' },
        ],
      },
      {
        label: 'Data',
        icon: 'trending_up',
        pages: [
          { id: 'metrics', label: 'Metrics', icon: 'show_chart' },
          { id: 'table', label: 'Table', icon: 'table_rows' },
          { id: 'charts', label: 'Charts', icon: 'bar_chart' },
        ],
      },
      {
        label: 'Compositions',
        icon: 'apps',
        pages: [
          { id: 'lists', label: 'Lists & Filters', icon: 'search' },
          { id: 'actions', label: 'Actions', icon: 'touch_app' },
          { id: 'panels', label: 'Panels', icon: 'layers' },
        ],
      },
    ],
  },
  {
    label: 'Wallet',
    categories: [
      {
        label: 'Surfaces',
        icon: 'payments',
        pages: [
          { id: 'asset-cards', label: 'Assets', icon: 'token' },
          { id: 'transaction-cards', label: 'Transactions', icon: 'receipt_long' },
          { id: 'feature-components', label: 'Wallet', icon: 'account_balance_wallet' },
          { id: 'account-components', label: 'Account', icon: 'fingerprint' },
          { id: 'setting-items', label: 'Settings', icon: 'settings' },
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
    ],
  },
]

const NAV_CATEGORIES = NAV_SECTIONS.flatMap((section) => section.categories)

// Every glyph in the set, read from the set itself, so the Icons page cannot
// list a name that draws nothing.
const ALL_ICON_NAMES = (Object.keys(outlinedMap) as IconName[]).sort()

// The Icons page's grid: fixed, narrow columns, so the space between icons
// is the same whatever the length of their names; a long name wraps under
// its own icon.
const ICON_GRID = 'grid w-full grid-cols-[repeat(auto-fill,4.5rem)] gap-x-3 gap-y-4'
const ICON_CELL = 'flex min-w-0 flex-col items-center gap-1'
// Each icon's tile: a faint mint wash on light, where the glyph is the dark
// brand green; the stronger wash and the neon mint on dark.
const ICON_TILE =
  'flex size-10 cursor-default items-center justify-center rounded-xl bg-primary/5 transition-all hover:scale-105 hover:bg-primary/10 dark:bg-primary/15 dark:hover:bg-primary/25'
const ICON_GLYPH = 'text-brand dark:text-[#31ff8b]'
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

const REPO_URL = 'https://github.com/kaleidoswap/kaleido-ui'

/** GitHub's mark (Octicons `mark-github`) — the icon set has no brand icons. */
const GitHubMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
)

/**
 * The footer's actions: previews and GitHub side by side.
 * On the rail there is no room for their labels, so they stack as icon-only
 * tiles.
 */
function NavFooterActions() {
  const collapsed = useDrawerCollapsed()
  return (
    <div className={collapsed ? 'flex flex-col items-center gap-2' : 'grid grid-cols-2 gap-2'}>
      <ActionTile
        icon={<Icon name="grid_view" />}
        label="Previews"
        href="#/products"
        hideLabel={collapsed}
      />
      <ActionTile
        icon={<GitHubMark />}
        label="GitHub"
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        hideLabel={collapsed}
      />
    </div>
  )
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
  const [expandedTransactionId, setExpandedTransactionId] = useState<string | null>('tx-completed')
  const [activityTab, setActivityTab] = useState('all')
  const [activityStatus, setActivityStatus] = useState('all')
  const [activityNetwork, setActivityNetwork] = useState('all')
  const [activitySearch, setActivitySearch] = useState('')
  const [featureFilter, setFeatureFilter] = useState('all')
  const [selectedAssetTicker, setSelectedAssetTicker] = useState('BTC')
  const [swapToTicker, setSwapToTicker] = useState('USDB')
  const [swapAmount, setSwapAmount] = useState('21000')
  const [swapPercent, setSwapPercent] = useState<number | null>(null)
  const [accountNetwork, setAccountNetwork] = useState<'mainnet' | 'testnet' | 'signet' | 'regtest'>('mainnet')
  const [withdrawDestination, setWithdrawDestination] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
  const [withdrawAmount, setWithdrawAmount] = useState('21000')
  const [feeRate, setFeeRate] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [donation, setDonation] = useState(true)

  // Hash-based route: `#/products` renders the previews, anything else the
  // component showcase.
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
    if (route.startsWith('#/products')) return
    document.getElementById(SHOWCASE_SCROLL_ID)?.scrollTo({ top: 0 })
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

  // The showcase's own navigation, rendered by the desktop sidebar and the
  // mobile drawer alike: each category is a submenu, as Trade and Liquidity
  // are in the desktop app, and its pages show when it is opened.
  const pageNav = NAV_SECTIONS.map((section) => (
    <DrawerSection key={section.label} label={section.label}>
      {section.categories.map((category) => (
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
  ))

  // The drawer's header and version line, the same in the showcase's own
  // navigation and in the Drawer page's demo.
  // The logo component: its wordmark is currentColor, so it reads on both themes.
  const lockup = <KaleidoswapLogo className="h-8 w-auto text-foreground" />
  const drawerVersion = (
    <p className="truncate text-center text-xxs font-light text-content-tertiary">v{version}</p>
  )

  const navFooter = (
    <DrawerFooter className="space-y-3">
      <NavFooterActions />
      {drawerVersion}
    </DrawerFooter>
  )

  // One navigation list, rendered by both drawer demos.
  // The Drawer demo's list: the Wallet section holds a Transact group with a
  // submenu (it opens by itself while one of its pages is current), then two
  // plain entries; Account is a plain section.
  const showcaseNavItem = (item: { label: string; icon: IconName }) => (
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
  )
  const actionPages: { label: string; icon: IconName }[] = [
    { label: 'Deposit', icon: 'arrow_downward' },
    { label: 'Withdraw', icon: 'arrow_outward' },
    { label: 'Swap', icon: 'swap_horiz' },
  ]
  const showcaseNav = (
    <>
      <DrawerSection label="Wallet">
        <DrawerNavGroup
          icon={<Icon name="sync_alt" className="text-icon-xl" />}
          label="Transact"
          active={actionPages.some((page) => page.label === showcaseNavActive)}
          defaultOpen
        >
          {actionPages.map(showcaseNavItem)}
        </DrawerNavGroup>
        {showcaseNavItem({ label: 'Dashboard', icon: 'grid_view' })}
        {showcaseNavItem({ label: 'Activity', icon: 'history' })}
      </DrawerSection>
      <DrawerSection label="Account">{showcaseNavItem({ label: 'Settings', icon: 'settings' })}</DrawerSection>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
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
          <nav aria-label="Showcase">{pageNav}</nav>
        </DrawerBody>
        {navFooter}
      </DrawerSidebar>

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Top bar — the theme switch on the right; on mobile also the navigation drawer */}
        <header className="z-40 grid h-14 shrink-0 grid-cols-[1fr_minmax(0,36rem)_1fr] items-center gap-3 border-b border-foreground/5 bg-background/80 px-4 backdrop-blur-xl">
          <div className="lg:hidden">
          <Drawer open={navOpen} onOpenChange={setNavOpen}>
            <DrawerTrigger asChild>
              <IconButton icon="menu" label={`Open navigation, current page: ${NAV_PAGES[pageIndex].label}`} />
            </DrawerTrigger>
            <DrawerContent header={lockup}>
              <DrawerTitle className="sr-only">Showcase navigation</DrawerTitle>
              <DrawerDescription>Component pages, by category</DrawerDescription>
              <DrawerBody>
                <nav aria-label="Showcase">{pageNav}</nav>
              </DrawerBody>
              {navFooter}
            </DrawerContent>
          </Drawer>
          </div>
          <div className="col-start-2 row-start-1"><SearchBar page={page} /></div>
          <ThemeToggle className="col-start-3 row-start-1 justify-self-end" />
        </header>

        {/* The current page */}
        <CurrentPage.Provider value={page}>
        {/* The page scrolls in the library's ScrollArea: the overlay thumb, not the browser's bar. */}
        <ScrollArea className="flex-1" thickness="thick" viewportAs="main" viewportProps={{ id: SHOWCASE_SCROLL_ID }}>
        <div className="mx-auto w-full max-w-5xl min-w-0 px-6 py-8">

          {/* ── Brand ───────────────────────────────────────────────────── */}
          <Section id="brand" title="Brand" description="Logo, per-theme foregrounds, brand gradient, glows and the halo backdrop.">
            <Row label="KaleidoswapLogo / KaleidoswapMark">
              <KaleidoswapLogo className="h-8 w-auto text-foreground" />
              <KaleidoswapLogo orientation="vertical" className="h-16 w-auto text-foreground" />
              <KaleidoswapMark className="size-8" />
              <KaleidoswapMark className="size-14" />
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
            </Row>
            <Row label="Action tiles (ActionTile)" wrap={false}>
              <div className="flex w-full max-w-md gap-2.5">
                <ActionTile icon={<Icon name="call_received" size="sm" />} label="Deposit" onClick={() => {}} />
                <ActionTile icon={<Icon name="swap_horiz" size="sm" />} label="Swap" onClick={() => {}} />
                <ActionTile icon={<Icon name="arrow_outward" size="sm" />} label="Withdraw" onClick={() => {}} />
              </div>
            </Row>
            <Row label="Disabled action tiles" wrap={false}>
              <div className="flex w-full max-w-md gap-2.5">
                <ActionTile icon={<Icon name="content_copy" size="sm" />} label="Copy" disabled />
                <ActionTile icon={<Icon name="edit" size="sm" />} label="Amount" disabled />
                <ActionTile icon={<Icon name="ios_share" size="sm" />} label="Share" disabled />
              </div>
            </Row>
            <Row label="With icons">
              <Button><Icon name="arrow_outward" size="sm" />Send</Button>
              <Button variant="outline"><Icon name="south_west" size="sm" />Receive</Button>
              <Button variant="ghost"><Icon name="swap_horiz" size="sm" />Swap</Button>
              <Button variant="hyperlink" className="no-underline"><Icon name="open_in_new" size="xs" className="!text-[15px] leading-none translate-y-[1.5px] icon" /><span className="underline underline-offset-2 group-hover:decoration-[#31ff8b]">Learn more</span></Button>
            </Row>
            <Row label="Icon-only · quiet, surface, secondary — sizes sm 32 / md 40 / lg 50, then disabled">
              <IconButton icon="close" label="Close" size="sm" />
              <IconButton icon="close" label="Close" />
              <IconButton icon="close" label="Close" size="lg" />
              <IconButton icon="close" label="Close" disabled />
              <IconButton icon="refresh" label="Refresh" variant="surface" size="sm" />
              <IconButton icon="refresh" label="Refresh" variant="surface" />
              <IconButton icon="refresh" label="Refresh" variant="surface" size="lg" />
              <IconButton icon="refresh" label="Refresh" variant="surface" disabled />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" size="sm" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" size="lg" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" disabled />
            </Row>
            <Row label="Icon-only · danger-quiet, danger-subtle, destructive — sizes sm / md / lg, then disabled">
              <IconButton icon="delete" label="Delete" variant="danger-quiet" size="sm" />
              <IconButton icon="delete" label="Delete" variant="danger-quiet" />
              <IconButton icon="delete" label="Delete" variant="danger-quiet" size="lg" />
              <IconButton icon="delete" label="Delete" variant="danger-quiet" disabled />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" size="sm" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" size="lg" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" disabled />
              <IconButton icon="delete" label="Delete" variant="destructive" size="sm" />
              <IconButton icon="delete" label="Delete" variant="destructive" />
              <IconButton icon="delete" label="Delete" variant="destructive" size="lg" />
              <IconButton icon="delete" label="Delete" variant="destructive" disabled />
            </Row>
            <Row label="Icon-only · shape=&quot;circle&quot; — on a line or over content, like the swap flip">
              <IconButton icon="refresh" label="Refresh" variant="surface" shape="circle" size="sm" />
              <IconButton icon="refresh" label="Refresh" variant="surface" shape="circle" />
              <IconButton icon="refresh" label="Refresh" variant="surface" shape="circle" size="lg" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" shape="circle" size="sm" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" shape="circle" />
              <IconButton icon="swap_vert" label="Swap direction" variant="secondary" shape="circle" size="lg" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" shape="circle" size="sm" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" shape="circle" />
              <IconButton icon="delete" label="Delete" variant="danger-subtle" shape="circle" size="lg" />
            </Row>
          </Section>

          {/* ── Icons ───────────────────────────────────────────────────── */}
          <Section id="icons" title="Icons" description="Material Symbols wrapper with size variants.">
            <Row label="Named shortcuts (Icons.*)">
              <div className={ICON_GRID}>
                {Object.entries(Icons).map(([key, IconComp]) => (
                  <div key={key} className={ICON_CELL}>
                    <div className={ICON_TILE}>
                      <IconComp size="md" className={ICON_GLYPH} />
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
                    <div className={ICON_TILE}>
                      <Icon name={name} size="md" className={ICON_GLYPH} />
                    </div>
                    <IconLabel name={name} />
                  </div>
                ))}
              </div>
            </Row>
          </Section>

          {/* ── External logos ──────────────────────────────────────────── */}
          <Section id="external-logos" title="External logos" description="Protocol and asset marks, served from /logos. White and black variants are shown on the backdrop they are drawn for.">
            <Row label="Protocols" wrap={false}>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {PROTOCOL_LOGOS.map((g) => <LogoGroup key={g.name} {...g} />)}
              </div>
            </Row>
            <Row label="Assets" wrap={false}>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {ASSET_LOGOS.map((g) => <LogoGroup key={g.name} {...g} />)}
              </div>
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

          {/* ── Chips ───────────────────────────────────────────────────── */}
          <Section id="chips" title="Chips" description="Every label pill: StatusBadge for the five transaction states, the dot StatusChip an InfoChip carries, Tag for what a thing is (no dot), and ToneBadge for any status or value in any tone.">
            <Row label="Status badges">
              {(['success', 'completed', 'pending', 'failed', 'error'] as StatusType[]).map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </Row>
            <Row label="Info chips">
              <StatusChip status="success" label="Connected" />
              <StatusChip status="info" label="Native asset" />
              <StatusChip status="warning" label="Needs review" />
              <StatusChip status="danger" label="Offline" />
            </Row>
            <Row label="Tags — what a thing is, no dot">
              <Tag tone="info">Revenue share</Tag>
              <Tag tone="bitcoin">Markup</Tag>
              {(['neutral', 'success', 'warning', 'danger', 'violet'] as const).map((tone) => (
                <Tag key={tone} tone={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </Tag>
              ))}
            </Row>
            <Row label="Tone badges — a status, any tone">
              {(['muted', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'outline'] as const).map((tone) => (
                <ToneBadge key={tone} tone={tone}>
                  {tone}
                </ToneBadge>
              ))}
            </Row>
            <Row label='Tone badges — case="none", a value'>
              <ToneBadge tone="primary" case="none">1,250,000 sats</ToneBadge>
              <ToneBadge tone="secondary" case="none">12 installs</ToneBadge>
              <ToneBadge tone="outline" case="none">v2.4.1</ToneBadge>
            </Row>
          </Section>

          {/* ── Cards ───────────────────────────────────────────────────── */}
          <Section id="cards" title="Cards" description="Compositional card primitives. variant=&quot;secondary&quot; is the same card without the glass edge, for one that ranks under a primary card beside it.">
            <Row label="Primary card">
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Card</CardTitle>
                    <CardDescription>With header and content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-caption text-muted-foreground">Card body content goes here. Cards can hold any child elements.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>With Actions</CardTitle>
                    <CardDescription>Actions in the footer slot.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-caption text-muted-foreground">Use CardFooter for action buttons or summary information.</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm">Confirm</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </CardFooter>
                </Card>
              </div>
            </Row>
            <Row label="Secondary card — the same composition, without the glass edge">
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <Card variant="secondary">
                  <CardHeader>
                    <CardTitle>Secondary Card</CardTitle>
                    <CardDescription>With header and content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-caption text-muted-foreground">Card body content goes here. Cards can hold any child elements.</p>
                  </CardContent>
                </Card>
                <Card variant="secondary">
                  <CardHeader>
                    <CardTitle>With Actions</CardTitle>
                    <CardDescription>Actions in the footer slot.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-caption text-muted-foreground">Use CardFooter for action buttons or summary information.</p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button size="sm">Confirm</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </CardFooter>
                </Card>
              </div>
            </Row>
          </Section>

          {/* ── Asset Cards ─────────────────────────────────────────────── */}
          <Section id="asset-cards" title="Assets" description="An asset as the wallet shows it: icon, name, rails and balance, in a list row or opened to its detail.">
            <Grid>
              <Demo title="Asset card" use="AssetCard. A row of the asset list: icon, name, the rails it lives on and its balance, tinted with the asset's colour. The balance can be hidden.">
                <div className="flex max-w-md flex-col gap-3">
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
              </Demo>
              <Demo title="Asset card with detail" use="The same card opened: the balance by rail under it, and the three things to do with the asset.">
                <div className="flex max-w-md flex-col gap-4">
                  <AssetCard
                    ticker="BTC"
                    name="Bitcoin"
                    displayBalance="0.00276000"
                    networks={['L1', 'LN', 'Spark']}
                    accentColor="#F7931A"
                  />
                  <SummaryRows
                    rows={[
                      { label: 'On-chain', value: '125,000 sats' },
                      { label: 'Lightning', value: '42,000 sats' },
                      { label: 'Spark', value: '88,000 sats' },
                      { label: 'Arkade', value: '21,000 sats' },
                      { label: 'Total', value: '276,000 sats', emphasis: true },
                    ]}
                  />
                  <div className="flex gap-2.5">
                    <ActionTile icon={<Icon name="call_received" size="sm" />} label="Deposit" onClick={() => {}} />
                    <ActionTile icon={<Icon name="swap_horiz" size="sm" />} label="Swap" onClick={() => {}} />
                    <ActionTile icon={<Icon name="arrow_outward" size="sm" />} label="Withdraw" onClick={() => {}} />
                  </div>
                </div>
              </Demo>
            </Grid>
          </Section>

          {/* ── Transaction Cards ───────────────────────────────────────── */}
          <Section id="transaction-cards" title="Transactions" description="A transaction as a row, with direction, status and amount, opening to its details.">
            <Demo title="Transaction row" use="ActivityList items. Direction and network, the state, and the amount; a row opens to its reference, network and status.">
            <div className="max-w-md">
              <ActivityList
                expandedId={expandedTransactionId}
                onExpandedChange={setExpandedTransactionId}
                items={[
                  { id: 'tx-completed', direction: 'inbound', status: 'completed', displayAmount: '21,000', unit: 'sats', timestamp: 1700000000, network: 'LN', label: 'Lightning Deposit' },
                  { id: 'tx-pending', direction: 'outbound', status: 'pending', displayAmount: '5,000', unit: 'sats', timestamp: 1700086400, network: 'L1', label: 'On-chain Withdraw' },
                  { id: 'tx-failed', direction: 'outbound', status: 'failed', displayAmount: '500', unit: 'sats', timestamp: 1699913600, network: 'Spark', label: 'Spark Withdraw' },
                ]}
                renderDetails={(item) => (
                  <>
                    <ActivityDetailRow label="Reference" value={item.id} />
                    <ActivityDetailRow label="Network" value={<NetworkBadge network={item.network ?? 'LN'} showLabel />} />
                    <ActivityDetailRow label="Status" value={<StatusBadge status={item.status} />} />
                  </>
                )}
              />
            </div>
            </Demo>
          </Section>

          {/* ── Feature Components ─────────────────────────────────────── */}
          <Section id="feature-components" title="Wallet" description="The wallet's own surfaces: what it holds, how to move around it, and the assets in it.">
            <Grid>
              <Demo title="Available Balance" use="BalanceBreakdown. The total, split by rail — on-chain, Lightning, Spark, Arkade and RGB assets — with the node it runs on.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <div className="space-y-16">
                <Demo title="Bottom navigation" use="BottomNav. The wallet's main places, one active; inline here, floating over the page in the app.">
                  <div className="mx-auto w-full max-w-md">
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
                </Demo>
                <Demo title="Asset list" use="WalletAssetList. The assets held, each with its rails and balance.">
                  <div className="max-w-md">
                    <WalletAssetList
                  title="Assets"
                  bottomSpacer={false}
                  items={[
                    { id: 'btc', ticker: 'BTC', name: 'Bitcoin', displayBalance: '276,000', networks: ['L1', 'LN', 'Spark'], accentColor: '#F7931A' },
                    { id: 'usdt', ticker: 'USDT', name: 'Tether USD', displayBalance: '1,670.00', networks: ['RGB-LN'], accentColor: '#26A17B' },
                  ]}
                />
                  </div>
                </Demo>
              </div>
              <Demo title="Network filter" use="NetworkFilterDropdown. A filter with an icon per option, for a narrow wallet surface.">
                <div className="max-w-md">
                  <NetworkFilterDropdown value={featureFilter} onChange={setFeatureFilter} />
                </div>
              </Demo>
              <Demo title="Asset selector" use="AssetSelector. Pick an asset from a searchable list, with categories to narrow it.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="QR code" use="QrCode. An address or an invoice to scan, on white so every camera reads it.">
                <div className="w-fit rounded-2xl bg-white p-3">
                  <QrCode value="kaleidoswap:receive:sample" size={168} />
                </div>
              </Demo>
              <Demo title="Wallet settings" use="SettingsTile, SettingsStatusPanel and SettingsActionButton. A place to go, a state to read, an action to take.">
                <div className="max-w-md space-y-3">
                  <SettingsTile
                    icon={<AppIcon name="vault" className="size-5" />}
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
              </Demo>
            </Grid>
          </Section>

          {/* ── Activity Components ────────────────────────────────────── */}
          <Section id="activity-components" title="Activity" description="Search, filters, tabs, list rows, and expanded details from the extension Activity page.">
            <Grid>
              <Demo title="Search and status" use="ActivityFilterBar. Search the history and narrow it by status; Clear appears once a filter is on.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Network filter" use="ActivityNetworkFilters. One chip per rail; choosing the active one again clears it.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Type tabs and list" use="ActivityTypeTabs over an ActivityList: all, in, out or swaps, each row opening to its details.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Empty history" use="ActivityList with no items: the shared EmptyState, with one way forward.">
                <div className="max-w-md">
                  <ActivityList
                items={[]}
                renderEmptyActions={() => (
                  <Button variant="surface" size="sm">
                    <AppIcon name="receive" size="sm" />
                    Deposit
                  </Button>
                )}
              />
                </div>
              </Demo>
            </Grid>
          </Section>

          {/* ── Deposit Components ─────────────────────────────────────── */}
          <Section id="deposit-components" title="Deposit" description="The receive flow: choosing where the funds arrive, the invoice to pay and what to do with it.">
            <Grid>
              <Demo title="Account" use="AccountChoiceChip. Which account receives the funds; the active one takes the green ring.">
                <div className="flex flex-wrap gap-2">
                  <AccountChoiceChip account="RGB" active onClick={() => {}} />
                  <AccountChoiceChip account="SPARK" active={false} onClick={() => {}} />
                  <AccountChoiceChip account="ARKADE" active={false} onClick={() => {}} />
                </div>
              </Demo>
              <Demo title="Method" use="MethodChoiceChip. How the funds arrive: the active method is filled, one that is unavailable says why.">
                <div className="flex flex-wrap gap-2">
                  <MethodChoiceChip method="bitcoin_l1" active enabled onClick={() => {}} />
                  <MethodChoiceChip method="lightning" active={false} enabled onClick={() => {}} />
                  <MethodChoiceChip method="spark" active={false} enabled={false} disabledReason="offline" onClick={() => {}} />
                </div>
              </Demo>
              <Demo title="Invoice" use="QrCode and PaidOverlay. The invoice as a code to scan, which turns to a paid mark once it settles.">
                <div className="max-w-md">
                  <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl bg-card/70 p-5">
                  <div className="relative rounded-2xl border-2 border-primary/30 bg-white p-3">
                    <QrCode value="lightning:lnbc21000sampleinvoice" size={168} />
                    <PaidOverlay />
                  </div>
                </div>
                </div>
              </Demo>
              <Demo title="Invoice status" use="InvoiceStatusBanner. Where the invoice is: waiting, paid, or expired.">
                <div className="max-w-md">
                  <InvoiceStatusBanner
                  invoiceStatus="pending"
                  isInvoicePending
                  isInvoicePaid={false}
                  isInvoiceFailedOrExpired={false}
                />
                </div>
              </Demo>
              <Demo title="Invoice actions" use="ActionTile. What to do with the invoice: copy it, set an amount, share it.">
                <div className="max-w-md">
                  <div className="flex gap-2.5">
                  <ActionTile icon={<Icon name="content_copy" size="sm" />} label="Copy" onClick={() => {}} />
                  <ActionTile icon={<Icon name="edit" size="sm" />} label="Amount" onClick={() => {}} />
                  <ActionTile icon={<Icon name="ios_share" size="sm" />} label="Share" onClick={() => {}} />
                </div>
                </div>
              </Demo>
              <Demo title="Network info" use="NetworkInfoDisclosure. A DisclosureCard that explains the rails on offer, closed until asked.">
                <div className="max-w-md">
                  <NetworkInfoDisclosure networks={['onchain', 'lightning', 'spark', 'arkade']} />
                </div>
              </Demo>
            </Grid>
          </Section>

          {/* ── Withdraw Components ────────────────────────────────────── */}
          <Section id="withdraw-components" title="Withdraw" description="The send flow: where the funds go, how much and at what fee, and which route they take.">
            <Grid>
              <Demo title="Destination" use="WithdrawDestinationInput. The address or invoice, pasted or typed, with the network it was recognised as.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Invoice details" use="WithdrawInvoiceInfo. What the destination asks for, against what the wallet can send.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Amount and fee" use="WithdrawAmountInput. The amount with its Max shortcut, the fee rate and the donation, for an on-chain send.">
                <div className="flex max-w-md flex-col gap-4">
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
              </Demo>
              <Demo title="Amount in another unit" use="WithdrawAmountInput with unitSlot. The unit label is replaced by the caller's own control, here a sats / USD switch.">
                <div className="max-w-md">
                  <WithdrawAmountInput
                  addressType="lightning-address"
                  amount="4"
                  handleAmountChange={() => {}}
                  handleSetMax={() => {}}
                  selectedAssetId="__fiat__"
                  selectedAssetTicker="USD"
                  unitSlot={
                    <>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-muted/40 p-0.5">
                        <span className="rounded-full px-2.5 py-1 text-xxs font-bold text-muted-foreground">sats</span>
                        <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xxs font-bold text-primary">USD</span>
                      </span>
                      <span className="truncate text-xxs tabular-nums text-muted-foreground">≈ 4,907 sats</span>
                    </>
                  }
                  formattedBalance="16.03"
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
              </Demo>
              <Demo title="Route" use="WithdrawRouteSelector. Which account the funds leave from and how, with the recommended route marked.">
                <div className="max-w-md">
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
              </Demo>
            </Grid>
          </Section>

          {/* ── Account Components ─────────────────────────────────────── */}
          <Section id="account-components" title="Account" description="Settings surfaces shared with the extension: the accounts, their networks and what they can do.">
            <Grid>
              <Demo title="Account status" use="AccountStatusTabs. One tab per account — RLN, Spark, Liquid — with its state, what it can do and the network it is on.">
                <div className="max-w-md">
                  <AccountStatusTabs
                  accounts={[
                    {
                      id: 'RGB',
                      label: 'RLN',
                      state: 'Ready',
                      detail: 'RGB and Lightning features are available.',
                      icon: <img src="/icons/rgb/rgb-logo.svg" alt="" className="size-5" />,
                      network: 'RGB-LN',
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
                      state: 'Connecting',
                      detail: 'Spark account is connecting.',
                      icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="" className="kui-mono-icon size-5" />,
                      network: 'Spark',
                      dotTone: 'bg-warning',
                      title: 'Spark',
                      description: 'Fast Spark BTC and native assets.',
                      capabilityBullets: ['Instant receive', 'Native assets'],
                      networkLabel: 'Signet',
                      networkBannerClassName: 'border-warning/20 bg-warning/10 text-warning-fg',
                      accentBg: 'bg-warning/10',
                      accentBorder: 'border-warning/20',
                    },
                    {
                      id: 'LIQUID',
                      label: 'Liquid',
                      state: 'Unavailable',
                      detail: 'Liquid account is unavailable.',
                      icon: <LiquidNetworkIcon className="size-5" />,
                      network: 'Liquid',
                      dotTone: 'bg-danger',
                      title: 'Liquid',
                      description: 'L-BTC and Liquid assets.',
                      capabilityBullets: ['L-BTC', 'Liquid assets'],
                      networkLabel: 'Mainnet',
                      networkBannerClassName: 'border-danger/20 bg-danger/10 text-danger-fg',
                      accentBg: 'bg-danger/10',
                      accentBorder: 'border-danger/20',
                    },
                  ]}
                />
                </div>
              </Demo>
              <Demo title="Account row" use="AccountSettingsRow. An account in the settings list, with its state and network.">
                <div className="max-w-md">
                  <AccountSettingsRow
                  accountId="SPARK"
                  title="Spark Account"
                  status="ready"
                  network="mainnet"
                  description="Spark balance, operator connection, SDK details, and network selection."
                  onClick={() => {}}
                />
                </div>
              </Demo>
              <Demo title="Account capabilities" use="AccountCapabilitiesCard. What an account can do, its details, and the network notices that go with them.">
                <div className="max-w-md">
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
                </div>
              </Demo>
              <Demo title="Transfer route" use="TransferRouteCard. A way to move funds, with how long it takes and what it costs.">
                <div className="max-w-md">
                  <TransferRouteCard
                  account="SPARK"
                  label="Spark"
                  summary="Fast Spark-native transfers when the destination supports it."
                  eta="Instant"
                  feeHint="Low fee"
                />
                </div>
              </Demo>
            </Grid>
            <div className="mt-16"></div>
            <div className="max-w-4xl">
              <Grid>
                <Demo title="Network" use="AccountNetworkSelector. The networks an account can run on, as a tab menu; the choice applies after saving in the consuming app.">
                  <div className="space-y-4">
                    <AccountNetworkSelector
                      accountId="SPARK"
                      value={accountNetwork}
                      onChange={setAccountNetwork}
                    />
                    <AccountNotice>
                      Spark will reconnect using the selected network after saving in the consuming app.
                    </AccountNotice>
                  </div>
                </Demo>
                <Demo title="Account Info" use="AccountInfoGrid. The account's status, network, key and assets, as tiles.">
                  <div className="space-y-4">
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
                </Demo>
              </Grid>
            </div>
          </Section>

          {/* ── Alert Banners ───────────────────────────────────────────── */}
          <Section id="alert-banners" title="Alert Banners" description="Contextual feedback messages, one tone each.">
            <Grid>
              <Demo title="Info" use="Something in progress or worth knowing.">
                <AlertBanner variant="info">
                  Your transaction is being confirmed on the network. This may take a few minutes.
                </AlertBanner>
              </Demo>
              <Demo title="Success" use="Something that finished as asked.">
                <AlertBanner variant="success">
                  Swap completed successfully! Funds have been credited to your wallet.
                </AlertBanner>
              </Demo>
              <Demo title="Warning" use="Something to look at before going on.">
                <AlertBanner variant="warning">
                  High network fees detected. Consider waiting for lower fees.
                </AlertBanner>
              </Demo>
              <Demo title="Error" use="Something that failed, and why.">
                <AlertBanner variant="error">
                  Transaction failed. Insufficient funds to cover network fees.
                </AlertBanner>
              </Demo>
            </Grid>
          </Section>

          {/* ── Setting Items ───────────────────────────────────────────── */}
          <Section id="swap-flow" title="Swap Flow" description="A swap from start to finish: choosing the pair and the amount, reviewing what will happen, then following it.">
            <Grid>
              <Demo title="Swap" use="SwapInputCard. The two assets, the amount with its quick percentages, the quote under them, and the one action.">
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
                        { id: 'bitcoin', label: 'Bitcoin', iconUrl: '/logos/protocols/bitcoin.svg' },
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
                      selectedPercentage={swapPercent}
                      fromUnitLabel="sats"
                      receiveAmount="20.82"
                      receiveUnitLabel={swapToTicker}
                      quoteRateText="1 BTC = 99,140 USDB"
                      quoteFeeText="0.3%"
                      quoteExpiresText="24s"
                      submitLabel="Review Swap"
                      submitIcon={<Icon name="receipt_long" size="sm" />}
                      onFromTickerChange={setSelectedAssetTicker}
                      onToTickerChange={setSwapToTicker}
                      onFromInputChange={(value) => {
                        setSwapPercent(null)
                        setSwapAmount(value)
                      }}
                      onPercentageClick={(percent) => {
                        setSwapPercent(percent)
                        setSwapAmount(String(Math.floor((125000 * percent) / 100)))
                      }}
                      onFlip={() => {
                        setSelectedAssetTicker(swapToTicker)
                        setSwapToTicker(selectedAssetTicker)
                      }}
                      onSubmit={() => {}}
                    />
              </Demo>
              <div className="space-y-16">
                <Demo title="Review" use="SummaryRows. What is paid, what is received and what the swap costs, before anything is sent.">
                  <SummaryRows
                                    rows={[
                    { label: 'You pay', value: '1,005 sats', emphasis: true },
                    { label: 'Invoice receives', value: '1,000 sats' },
                    { label: 'Fee', value: '5 sats', hint: '0.5% spread' },
                    { label: 'Refund opens', value: 'in 90 min', tone: 'warning' },
                    { label: 'Solver', value: '66422c…e3ce', mono: true },
                  ]}
                />
                </Demo>
                <Demo title="Progress" use="SwapStepList. Where a swap in flight is: done, in progress, still to come.">
                  <SwapStepList
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
                </Demo>
              </div>
            </Grid>
          </Section>

          <Section id="setting-items" title="Settings" description="Settings rows with icon, title, description, and value.">
            <Grid>
              <Demo title="Account" use="SettingItem. A place to go: icon, title, description and a chevron; or a control in the value slot.">
                <div className="flex max-w-lg flex-col gap-3">
              <SettingItem
                icon="person"
                title="Profile"
                description="Manage your account details"
                onClick={() => {}}
              />
              <SettingItem
                icon="shield"
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
                    <SelectTrigger hug aria-label="Language">
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
                </div>
              </Demo>
              <Demo title="Preferences" use="SettingItem with a Switch in the value slot: the row states the setting, the control sets it.">
                <div className="flex max-w-lg flex-col gap-3">
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
              </Demo>
            </Grid>
          </Section>

          {/* ── Toggles ─────────────────────────────────────────────────── */}
          <Section id="toggle" title="Toggles" description="One switch, two forms: the compact on/off Switch (the one in SettingItem and SwitchRow), and the wide pill with a glyph per side — ThemeToggle is that one.">
            <Row label="Switch — off">
              <Switch aria-label="Off" checked={false} />
            </Row>
            <Row label="Switch — on">
              <Switch aria-label="On" checked />
            </Row>
            <Row label="Switch — disabled">
              <Switch aria-label="Disabled off" checked={false} disabled />
              <Switch aria-label="Disabled on" checked disabled />
            </Row>
            <Row label="ThemeToggle — light / dark (the one in the top bar drives the page)">
              <ThemeToggle mode="light" onModeChange={() => {}} />
              <ThemeToggle mode="dark" onModeChange={() => {}} />
            </Row>
          </Section>

          {/* ── Inputs ──────────────────────────────────────────────────── */}
          <Section id="inputs" title="Inputs & Labels" description="Form controls, each under its label.">
            <Grid>
              <Demo title="Text input" use="Input under its Label. The placeholder shows the shape of the value.">
                <div className="flex max-w-sm flex-col gap-2">
                  <Label htmlFor="addr">Bitcoin Address</Label>
                  <Input id="addr" placeholder="bc1q..." />
                </div>
              </Demo>
              <Demo title="Text input (Disabled)" use="A field that is shown but cannot be edited: dimmed, out of the Tab order.">
                <div className="flex max-w-sm flex-col gap-2">
                  <Label htmlFor="disabled">Label</Label>
                  <Input id="disabled" placeholder="Not editable" disabled />
                </div>
              </Demo>
              <Demo title="Number input" use="NumberInput: digits only, with the numeric keypad on a phone.">
                <div className="flex max-w-sm flex-col gap-2">
                  <Label htmlFor="amount">Amount (sats)</Label>
                  <NumberInput id="amount" placeholder="21000" />
                </div>
              </Demo>
              <Demo title="Amount with a suffix" use="The unit sits inside the field, in the suffix slot: the value stays a plain number, the unit is not typed.">
                <div className="flex max-w-sm flex-col gap-2">
                  <Label htmlFor="amount-sats">Amount</Label>
                  <Input id="amount-sats" defaultValue="50" inputMode="numeric" suffix="%" />
                </div>
              </Demo>
            </Grid>
            <div className="mt-16">
              <InputFieldsGallery />
            </div>
          </Section>

          {/* ── Tabs ────────────────────────────────────────────────────── */}
          <Section id="tabs" title="Tabs" description="The Tabs bar; then SegmentedTabs, the same bar as a radio group.">
            <div className="max-w-lg">
              <Row label="Tabs">
                <Tabs defaultValue="send" className="w-full">
                  <TabsList fullWidth>
                    <TabsTrigger value="send">Send</TabsTrigger>
                    <TabsTrigger value="receive">Receive</TabsTrigger>
                    <TabsTrigger value="swap">Swap</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Row>
              <Row label="Tabs with icon — a glyph before each label">
                <Tabs defaultValue="send" className="w-full">
                  <TabsList fullWidth>
                    <TabsTrigger value="send"><Icon name="arrow_upward" size="sm" />Send</TabsTrigger>
                    <TabsTrigger value="receive"><Icon name="arrow_downward" size="sm" />Receive</TabsTrigger>
                    <TabsTrigger value="swap"><Icon name="swap_horiz" size="sm" />Swap</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Row>
            </div>
            <SegmentedTabsDemo />
          </Section>

          {/* ── Dialog ──────────────────────────────────────────────────── */}
          <Section id="dialog" title="Dialog" description="Modal dialog via Radix UI.">
            <Demo title="Dialog" use="A decision over the current screen: a title, what is about to happen, and the two ways out.">
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
            </Demo>
            <Demo className="mt-16" title="Without a close control" use="showCloseFalse: for a secret shown exactly once, the dialog closes only through its own action.">
              <DialogShowCloseDemo />
            </Demo>
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
                  <IconButton icon="menu" label={`Open navigation, current page: ${showcaseNavActive}`} />
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
          <Section id="avatar" title="Avatar" description="The person, as initials or an image.">
            <AvatarGallery />
          </Section>
          <Section id="collapsible" title="Disclosures" description="Two ways to show and hide a section, both built on the Collapsible primitive: a compact row inside a surface, and a card of its own.">
            <CollapsibleGallery />
          </Section>
          <Section id="display-lists" title="Lists" description="Plain lists of rows: a log in two spacings, and a checklist with a status on every step.">
            <DisplayListsGallery />
          </Section>
          <Section id="popover-menu" title="Popover & Menu" description="An anchored panel, and a real menu.">
            <PopoverMenuGallery />
          </Section>
          <Section id="lists" title="Lists & Filters" description="QueryState, EmptyState, RecordList, FilterBar, the segmented control, Pager, ValueList and EventTimeline, then a composed receipt.">
            <ListsGallery />
          </Section>
          <Section id="actions" title="Actions" description="How fresh the figures are with the refresh that updates them, and copying that says whether it worked.">
            <ActionsGallery />
            <div className="mt-16">
              <CopyGallery />
            </div>
          </Section>
          <Section id="panels" title="Panels" description="Whole dashboard panels: a ranked list beside the chart it drives.">
            <PanelsGallery />
          </Section>

          {/* ── Charts ──────────────────────────────────────────────────── */}
          <Section
            id="charts"
            title="Charts"
            description="The common chart forms, one per job: trend, comparison, part-to-whole, relation, a single figure. Plain SVG, theme colours, a table view on every chart."
          >
            <ChartsGallery />
          </Section>

          {/* ── Metrics ─────────────────────────────────────────────────── */}
          <Section
            id="metrics"
            title="Metrics"
            description="A single figure at a glance: the value, its change against the previous period, and a sparkline of the run-up."
          >
            <MetricsGallery />
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
        </div>
        </ScrollArea>
        </CurrentPage.Provider>
      </div>
    </div>
  )
}

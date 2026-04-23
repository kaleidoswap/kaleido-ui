/**
 * State Snapshot page — renders the CURRENT visual state of rate-extension
 * components that we plan to redesign. This page is for visual review BEFORE
 * we ship the redesign. Worker units 3–7 own the actual redesign.
 *
 * All rate-extension JSX is INLINED (copy/paste, no live imports) so this
 * showcase stays independent from the prod wallet code.
 *
 * Notes on substitutions made to keep the page buildable without the full
 * rate-extension preset:
 *   - `AssetIcon` / `LightningNetworkIcon` / `SparkNetworkIcon` / `ArkadeNetworkIcon`
 *     are replaced with inline SVG or emoji stand-ins. Shape + size preserved.
 *   - `AppIcon` from BottomNav is replaced with `Icon` (Material Symbols wrapper).
 *   - Tailwind classes used by rate-extension (`bg-card`, `border-border`,
 *     `text-muted-foreground`, `rounded-nav`, `animate-stagger-up`,
 *     `border-network-arkade`, `bg-network-arkade`) may or may not resolve under
 *     the showcase's Tailwind preset — that's intentional per the task spec;
 *     it proves the "needs tokens" point for the redesign discussion.
 */

import { Button, Icon } from '@kaleido-ui/index'

// ─── Panel scaffolding ───────────────────────────────────────────────────────

function Panel({
  id,
  title,
  concern,
  children,
}: {
  id: string
  title: string
  concern: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="mb-14 scroll-mt-20 rounded-2xl border border-white/10 bg-[#061F14] p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{concern}</p>
        <div className="mt-3 h-px bg-gradient-to-r from-primary/40 via-white/10 to-transparent" />
      </div>
      {children}
    </section>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-3 text-xxs font-mono uppercase tracking-widest text-slate-500">
      {children}
    </p>
  )
}

// ─── Inline icon stand-ins ───────────────────────────────────────────────────

function LightningIcon({ className }: { className?: string }) {
  // Stand-in for rate-extension's <LightningNetworkIcon>
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  )
}

function SparkIcon({ className }: { className?: string }) {
  // Stand-in for rate-extension's <SparkNetworkIcon>
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l2.39 6.36L21 11l-6.61 2.64L12 20l-2.39-6.36L3 11l6.61-2.64z" />
    </svg>
  )
}

function ArkadeIcon({ className }: { className?: string }) {
  // Stand-in for rate-extension's <ArkadeNetworkIcon>
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="3" />
    </svg>
  )
}

function BitcoinIcon({ size = 32 }: { size?: number }) {
  // Stand-in for <AssetIcon ticker="BTC" size={32} />
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: '#F7931A',
        fontSize: size * 0.55,
        lineHeight: 1,
      }}
    >
      ₿
    </div>
  )
}

// Tiny wrapper to reproduce the `material-symbols-outlined` markup rate-extension uses.
function MS({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={`material-symbols-outlined ${className ?? ''}`} style={style}>
      {children}
    </span>
  )
}

// ─── Panel 1 — Primary buttons ───────────────────────────────────────────────

const BUTTON_VARIANTS = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
  'glow',
  'surface',
  'cta',
  'cta-gradient',
  'danger-subtle',
] as const

function Panel1Buttons() {
  return (
    <Panel
      id="panel-buttons"
      title="Panel 1 — Primary buttons"
      concern="Primary action button styling feels flat and does not match the asset-card visual weight. The Deposit/Swap/Withdraw trio below is the one the user says 'has no style.'"
    >
      <SubLabel>kaleido-ui Button primitive — all 11 variants</SubLabel>
      <div className="flex flex-wrap gap-3">
        {BUTTON_VARIANTS.filter((v) => v !== 'cta' && v !== 'cta-gradient').map((v) => (
          <Button key={v} variant={v as any}>
            {v}
          </Button>
        ))}
      </div>

      <SubLabel>CTA variants (full-width)</SubLabel>
      <div className="flex max-w-sm flex-col gap-3">
        <Button variant="cta" size="cta">
          cta
        </Button>
        <Button variant="cta-gradient" size="cta">
          cta-gradient
        </Button>
      </div>

      <SubLabel>Size coverage</SubLabel>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">sm</Button>
        <Button size="default">default</Button>
        <Button size="lg">lg</Button>
        <Button variant="cta" size="cta">
          cta
        </Button>
        <Button size="icon" aria-label="icon">
          <Icon name="add" />
        </Button>
      </div>

      <SubLabel>rate-extension main-action trio (inlined — current)</SubLabel>
      <p className="mb-3 text-xs text-slate-500">
        Copied verbatim from{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
          rate-extension/src/components/AssetDetail.tsx:833-858
        </code>
      </p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <button className="flex flex-col items-center gap-3 group">
          <div className="size-14 rounded-2xl bg-card flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all  group-hover:shadow-[0_0_30px_rgba(43,238,121,0.5)] active:scale-95">
            <span className="material-symbols-outlined text-[28px]">arrow_downward</span>
          </div>
          <span className="text-sm font-bold text-slate-300 group-hover:text-white tracking-wide">
            Deposit
          </span>
        </button>

        <button className="flex flex-col items-center gap-3 group">
          <div className="size-14 rounded-2xl bg-card flex items-center justify-center text-white border border-border group-hover:bg-white group-hover:text-black transition-all shadow-inner active:scale-95 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <span className="material-symbols-outlined text-[28px]">sync_alt</span>
          </div>
          <span className="text-sm font-bold text-slate-300 group-hover:text-white tracking-wide">
            Swap
          </span>
        </button>

        <button className="flex flex-col items-center gap-3 group">
          <div className="size-14 rounded-2xl bg-card flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all  group-hover:shadow-[0_0_30px_rgba(43,238,121,0.5)] active:scale-95">
            <span className="material-symbols-outlined text-[28px]">arrow_upward</span>
          </div>
          <span className="text-sm font-bold text-slate-300 group-hover:text-white tracking-wide">
            Withdraw
          </span>
        </button>
      </div>
    </Panel>
  )
}

// ─── Panel 2 — Asset card (Bitcoin) ──────────────────────────────────────────

function Panel2AssetCard() {
  const btcTotal = '100.147.648 sats'
  const fiatValue = '~ $62,491.00'

  return (
    <Panel
      id="panel-asset-card"
      title="Panel 2 — Asset card (Bitcoin)"
      concern="This is the visual we want every other card/row in the app to harmonize with. Looking for feedback on icon/name/amount hierarchy, pill cluster density, and overall padding."
    >
      <SubLabel>rate-extension (inlined — current)</SubLabel>
      <p className="mb-3 text-xs text-slate-500">
        Copied from{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
          rate-extension/src/components/Dashboard.tsx:499-600
        </code>
        . AssetIcon replaced with inline stand-in.
      </p>

      <div className="max-w-md">
        <button
          className="flex animate-stagger-up flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:bg-accent active:scale-[0.98] w-full"
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <BitcoinIcon size={32} />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-bold text-white leading-tight">Bitcoin</span>
                <span className="text-xs font-medium text-muted-foreground leading-tight mt-0.5">
                  BTC
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-end text-right">
              <span className="max-w-[170px] break-words text-lg font-bold leading-tight tracking-tight text-white">
                {btcTotal}
              </span>
              <span className="mt-1 text-xxs font-mono text-muted-foreground">{fiatValue}</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-orange-300 shadow-sm leading-none">
                <span className="material-symbols-outlined text-[13px] leading-none mb-0.5 mt-0.5 ml-0.5">
                  link
                </span>
                <span className="truncate mr-1 my-0.5">On-chain</span>
              </span>
              <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-yellow-300 shadow-sm leading-none">
                <LightningIcon className="mb-0.5 ml-0.5 mt-0.5 size-3" />
                <span className="truncate mr-1 my-0.5">RLN</span>
              </span>
            </div>
          </div>
        </button>
      </div>
    </Panel>
  )
}

// ─── Panel 3 — Filter pill cluster ───────────────────────────────────────────

function Panel3FilterPills() {
  // Static "collapsed" representation of the FilterDropdown at
  // rate-extension/src/components/Dashboard.tsx:34-129.
  //
  // Two pills: NETWORK (shows the "all" icon cluster) and ASSET (shows the
  // specific "Bitcoin" option selected so the reviewer can see both states).
  const networkOptions = [
    { id: 'onchain', label: 'On-chain', icon: <MS>link</MS> },
    { id: 'lightning', label: 'Lightning', icon: <LightningIcon className="size-3.5" /> },
    { id: 'spark', label: 'Spark', icon: <SparkIcon className="size-3.5" /> },
    { id: 'arkade', label: 'Arkade', icon: <ArkadeIcon className="size-3.5" /> },
  ]
  const assetOptions = [
    {
      id: 'bitcoin',
      label: 'Bitcoin',
      icon: <span className="text-[12px]" style={{ color: '#F7931A' }}>₿</span>,
    },
    { id: 'rgb', label: 'RGB', icon: <MS style={{ fontSize: 12 }}>palette</MS> },
  ]

  return (
    <Panel
      id="panel-filter-pills"
      title="Panel 3 — Filter pill cluster (Dashboard)"
      concern="Icons in the filter cluster are too big — they overpower the text label and the overall pill feels heavy. Both collapsed and filtered states shown."
    >
      <SubLabel>rate-extension (inlined — current)</SubLabel>
      <p className="mb-3 text-xs text-slate-500">
        Inlined from FilterDropdown at{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
          rate-extension/src/components/Dashboard.tsx:34-129
        </code>
      </p>

      <div className="flex max-w-md items-center gap-2">
        {/* NETWORK — "All" state (icon cluster) */}
        <div className="relative flex-1">
          <button className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl border transition-all outline-none leading-none bg-white/[0.09] border-white/[0.15] hover:border-white/25 hover:bg-white/[0.13] backdrop-blur-md">
            <span className="text-[9px] font-black uppercase tracking-widest shrink-0 text-white/45">
              NETWORK
            </span>
            <div className="flex items-center gap-1.5 flex-1 justify-center min-w-0">
              <div className="flex items-center gap-1">
                {networkOptions.map((o) => (
                  <div key={o.id} className="flex items-center justify-center opacity-50">
                    {o.icon}
                  </div>
                ))}
              </div>
            </div>
            <Icon name="expand_more" className="text-[12px] text-white/40 shrink-0" />
          </button>
        </div>

        {/* ASSET — "Bitcoin" selected */}
        <div className="relative flex-1">
          <button className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl border transition-all outline-none leading-none bg-white/[0.13] border-white/25 shadow-inner">
            <span className="text-[9px] font-black uppercase tracking-widest shrink-0 text-muted-foreground">
              ASSET
            </span>
            <div className="flex items-center gap-1.5 flex-1 justify-center min-w-0">
              <div className="flex items-center justify-center size-4 shrink-0">
                {assetOptions[0].icon}
              </div>
              <span className="text-tiny font-bold text-white truncate">Bitcoin</span>
            </div>
            <Icon name="expand_more" className="text-[12px] text-white/40 shrink-0" />
          </button>
        </div>
      </div>
    </Panel>
  )
}

// ─── Panel 4 — Status pill row ───────────────────────────────────────────────

function Panel4StatusPills() {
  return (
    <Panel
      id="panel-status-pills"
      title="Panel 4 — Status pill row (network badges)"
      concern="Color palette for network pills — are the orange / yellow / sky / violet choices still right? They currently use Tailwind's raw color scale rather than semantic tokens."
    >
      <SubLabel>rate-extension (inlined — current) — Dashboard.tsx:568-607</SubLabel>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-orange-300 shadow-sm leading-none">
          <span className="material-symbols-outlined text-[13px] leading-none mb-0.5 mt-0.5 ml-0.5">
            link
          </span>
          <span className="truncate mr-1 my-0.5">On-chain</span>
        </span>

        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-yellow-300 shadow-sm leading-none">
          <LightningIcon className="mb-0.5 ml-0.5 mt-0.5 size-3" />
          <span className="truncate mr-1 my-0.5">RLN</span>
        </span>

        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-sky-300 shadow-sm leading-none">
          <SparkIcon className="mb-0.5 ml-0.5 mt-0.5 size-3 opacity-80" />
          <span className="truncate mr-1 my-0.5">Spark</span>
        </span>

        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-violet-400/25 bg-violet-400/10 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-violet-300 shadow-sm leading-none">
          <ArkadeIcon className="mb-0.5 ml-0.5 mt-0.5 size-3 rounded-sm" />
          <span className="truncate mr-1 my-0.5">Arkade</span>
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Note: rate-extension currently uses{' '}
        <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-slate-300">
          border-network-arkade/25
        </code>{' '}
        / <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-slate-300">bg-blue-400</code>{' '}
        for Spark — substituted with semantic Tailwind colors here so the pill renders without
        rate-extension's custom tokens.json.
      </p>
    </Panel>
  )
}

// ─── Panel 5 — Bottom nav ────────────────────────────────────────────────────

function Panel5BottomNav() {
  const active: 'dashboard' | 'swap' | 'activity-list' | 'settings' = 'dashboard'
  const walletConnected = true

  return (
    <Panel
      id="panel-bottom-nav"
      title="Panel 5 — Bottom navigation bar"
      concern="Overall size/padding of the nav vs. the '14px' rounded-nav radius — does the pill shape still feel right? The active tab uses a subtle primary background tint."
    >
      <SubLabel>rate-extension (inlined — current) — BottomNav.tsx:16-29</SubLabel>
      <p className="mb-4 text-xs text-slate-500">
        Displayed inline here (rather than fixed-position) so it sits inside the showcase flow.
        AppIcon replaced with Material Symbols equivalents.
      </p>

      {/* Demo stage — darker backdrop to simulate the bottom-of-screen overlay */}
      <div className="relative flex h-40 items-end justify-center rounded-2xl bg-black/40 p-4">
        <nav className="w-[90%] max-w-[340px] bg-card/90 backdrop-blur-2xl rounded-full shadow-lg z-40 border border-primary/20">
          <div className="flex items-center justify-around px-2 py-2">
            {/* Wallet (active) */}
            <button
              className={`flex flex-col items-center justify-center h-[52px] w-[64px] rounded-nav transition-all duration-300 relative group ${
                active === 'dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-white/75 active:scale-95'
              }`}
            >
              {active === 'dashboard' && (
                <div className="absolute inset-0 bg-primary/[0.14] rounded-nav transition-all duration-300" />
              )}
              <div className="relative z-10">
                <Icon name="account_balance_wallet" className="text-[22px]" />
                <span
                  className={`absolute -top-0.5 -right-0.5 size-[7px] rounded-full ${walletConnected ? 'bg-primary shadow-sm' : 'bg-white/20'}`}
                />
              </div>
              <span className="text-xxs font-semibold mt-0.5 z-10 transition-colors duration-300">
                Wallet
              </span>
            </button>

            {/* Swap */}
            <button className="flex flex-col items-center justify-center h-[52px] w-[64px] rounded-nav transition-all duration-300 relative group text-muted-foreground hover:text-white/75 active:scale-95">
              <Icon name="swap_horiz" className="z-10 text-[22px]" />
              <span className="text-xxs font-semibold mt-0.5 z-10 transition-colors duration-300">
                Swap
              </span>
            </button>

            {/* Activity */}
            <button className="flex flex-col items-center justify-center h-[52px] w-[64px] rounded-nav transition-all duration-300 relative group text-muted-foreground hover:text-white/75 active:scale-95">
              <Icon name="list_alt" className="z-10 text-[22px]" />
              <span className="text-xxs font-semibold mt-0.5 z-10 transition-colors duration-300">
                Activity
              </span>
            </button>

            {/* Settings */}
            <button className="flex flex-col items-center justify-center h-[52px] w-[64px] rounded-nav transition-all duration-300 relative group text-muted-foreground hover:text-white/75 active:scale-95">
              <Icon name="settings" className="z-10 text-[22px]" />
              <span className="text-xxs font-semibold mt-0.5 z-10 transition-colors duration-300">
                Settings
              </span>
            </button>
          </div>
        </nav>
      </div>
    </Panel>
  )
}

// ─── Panel 6 — Section-header "you are here" ─────────────────────────────────

function Panel6SectionHeaders() {
  return (
    <Panel
      id="panel-section-headers"
      title="Panel 6 — Section-header 'you-are-here' highlights"
      concern="The current 'you're in this section' signal is a simple uppercase tracking-wider label. It's subtle — maybe too subtle? Decide whether the redesign needs a stronger visual anchor per section."
    >
      <SubLabel>Settings.tsx — 'Security' group header (inlined — current)</SubLabel>
      <p className="mb-3 text-xs text-slate-500">
        From{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
          rate-extension/src/components/Settings.tsx:177-196
        </code>
      </p>
      <div className="max-w-lg space-y-3">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          Security <span className="ml-2 text-xxs font-mono font-normal text-slate-500">(Current)</span>
        </h2>
        {/* Tile stand-in to give the header context */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-400/10">
            <MS className="text-blue-300">vpn_key</MS>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Change Password</p>
            <p className="text-xs text-muted-foreground">Update your wallet password</p>
          </div>
          <MS className="text-muted-foreground">chevron_right</MS>
        </div>
      </div>

      <SubLabel>Activity.tsx — tab-bar 'you-are-here' (inlined — current)</SubLabel>
      <p className="mb-3 text-xs text-slate-500">
        From{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
          rate-extension/src/components/Activity.tsx:800-838
        </code>{' '}
        — "received" tab shown as the active "you're here" state.
      </p>
      <div className="max-w-md">
        <div className="w-full grid grid-cols-4 gap-1 p-1 bg-card/40 backdrop-blur-xl border border-border rounded-xl shadow-inner">
          <button className="text-xxs px-1.5 py-2 rounded-lg transition-all font-bold tracking-wide text-muted-foreground">
            All <span className="ml-1 opacity-60">(12)</span>
          </button>
          <button
            className="text-xxs px-1.5 py-2 rounded-lg bg-[#2BEE79]/15 text-[#2BEE79] shadow-[0_0_12px_rgba(43,238,121,0.2)] transition-all font-bold group tracking-wide flex items-center justify-center"
            aria-current="page"
          >
            <MS className="mr-1.5 text-[14px] text-[#2BEE79]">call_received</MS>
            In <span className="ml-2 text-xxs font-mono font-normal text-white/60">(Current)</span>
          </button>
          <button className="text-xxs px-1.5 py-2 rounded-lg transition-all font-bold tracking-wide text-muted-foreground flex items-center justify-center">
            <MS className="mr-1.5 text-[14px]">call_made</MS>Out
          </button>
          <button className="text-xxs px-1.5 py-2 rounded-lg transition-all font-bold tracking-wide text-muted-foreground flex items-center justify-center">
            <MS className="mr-1.5 text-[14px]">swap_horiz</MS>Swaps
          </button>
        </div>
      </div>
    </Panel>
  )
}

// ─── Page shell ──────────────────────────────────────────────────────────────

const TOC = [
  { id: 'panel-buttons', label: 'Primary buttons' },
  { id: 'panel-asset-card', label: 'Asset card' },
  { id: 'panel-filter-pills', label: 'Filter pills' },
  { id: 'panel-status-pills', label: 'Status pills' },
  { id: 'panel-bottom-nav', label: 'Bottom nav' },
  { id: 'panel-section-headers', label: 'Section headers' },
]

export function StateSnapshot({ onBack }: { onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                ← showcase
              </button>
            )}
            <span className="font-bold text-white tracking-tight">State Snapshot</span>
            <span className="text-xs text-slate-500 font-mono">pre-redesign review</span>
          </div>
          <span className="text-xs font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            rate-extension · current
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex gap-8 py-8">
        <nav className="hidden lg:block w-52 shrink-0">
          <ul className="sticky top-24 space-y-1">
            {TOC.map((item) => (
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

        <main className="flex-1 min-w-0">
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h1 className="text-xl font-bold text-white tracking-tight">What you're looking at</h1>
            <p className="mt-2 text-sm text-slate-400">
              Six panels below render the CURRENT visual state of components we plan to redesign
              in the <span className="font-mono text-slate-300">rate-extension</span> browser
              wallet. JSX is copy/pasted from the live wallet source (not imported), so this page
              stays independent. Some classes (<code className="font-mono text-xs">bg-card</code>,{' '}
              <code className="font-mono text-xs">rounded-nav</code>,{' '}
              <code className="font-mono text-xs">animate-stagger-up</code>) may render without
              their rate-extension overrides — that's intentional. Use the panels to call out
              "change this" vs "leave alone" before worker units 3–7 ship the redesign.
            </p>
          </div>

          <Panel1Buttons />
          <Panel2AssetCard />
          <Panel3FilterPills />
          <Panel4StatusPills />
          <Panel5BottomNav />
          <Panel6SectionHeaders />
        </main>
      </div>
    </div>
  )
}

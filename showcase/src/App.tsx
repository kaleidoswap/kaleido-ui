import { useEffect, useState } from 'react'
import { StateSnapshot } from './pages/StateSnapshot'
import { Switch } from '@kaleido-ui/primitives/switch'
import { Select } from '@kaleido-ui/primitives/select'
import { NumberInput } from '@kaleido-ui/primitives/number-input'
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
          <Section id="buttons" title="Buttons" description="11 variants, 9 sizes.">
            <Row label="Enabled Variants">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="surface">Surface</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="danger-subtle">Danger Subtle</Button>
            </Row>
            <Row label="Disabled Variants">
              <Button variant="default" disabled>Default</Button>
              <Button variant="outline" disabled>Outline</Button>
              <Button variant="ghost" disabled>Ghost</Button>
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
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                    options={[
                      { value: 'en', label: 'English',    prefix: '🇬🇧' },
                      { value: 'it', label: 'Italiano',   prefix: '🇮🇹' },
                      { value: 'es', label: 'Español',    prefix: '🇪🇸' },
                      { value: 'fr', label: 'Français',   prefix: '🇫🇷' },
                      { value: 'de', label: 'Deutsch',    prefix: '🇩🇪' },
                      { value: 'pt', label: 'Português',  prefix: '🇵🇹' },
                      { value: 'ja', label: '日本語',      prefix: '🇯🇵' },
                    ]}
                  />
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

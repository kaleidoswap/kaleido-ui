import { useState } from 'react'
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
  AssetIcon,
  AssetCard,
  TransactionCard,
  PageHeader,
  SettingItem,
  SectionLabel,
  AlertBanner,
  ErrorBoundary,
  cn,
} from '@kaleido-ui/index'

type Align = 'center' | 'stretch'

function Showcase({
  title,
  description,
  align = 'center',
  children,
}: {
  title: string
  description?: string
  align?: Align
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col border-r border-b border-border bg-card">
      <div className="px-5 py-3 border-b border-border/60">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div
        className={cn(
          'flex-1 p-6 min-h-[200px]',
          align === 'center'
            ? 'flex items-center justify-center'
            : 'flex flex-col justify-start'
        )}
      >
        <div className={align === 'stretch' ? 'w-full' : ''}>{children}</div>
      </div>
    </div>
  )
}

function ButtonsShowcase() {
  const variants = [
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'link',
  ] as const

  return (
    <Showcase title="Button" description="Variants & sizes.">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(['sm', 'default', 'lg'] as const).map((s) => (
            <Button key={s} size={s}>
              {s}
            </Button>
          ))}
          <Button size="icon" aria-label="icon">
            <Icons.Swap size="sm" />
          </Button>
          <Button disabled>disabled</Button>
        </div>
      </div>
    </Showcase>
  )
}

function ExtendedButtonsShowcase() {
  return (
    <Showcase title="Button — extended" description="Kaleido brand variants.">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2">
          {(['glow', 'surface', 'danger-subtle'] as const).map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="cta" className="max-w-[200px]">
            cta
          </Button>
          <Button variant="cta-gradient" className="max-w-[200px]">
            cta-gradient
          </Button>
        </div>
        <a
          className={buttonVariants({ variant: 'outline' })}
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          asChild anchor
        </a>
      </div>
    </Showcase>
  )
}

function CardShowcase() {
  return (
    <Showcase title="Card" description="Compositional primitive." align="stretch">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Header / content / footer slots.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Built from Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" variant="secondary">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </CardFooter>
      </Card>
    </Showcase>
  )
}

function InputShowcase() {
  const [v, setV] = useState('')
  return (
    <Showcase title="Input" description="Form primitives with focus ring." align="stretch">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@kaleidoswap.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amt">Amount</Label>
          <Input
            id="amt"
            placeholder="0.00"
            value={v}
            onChange={(e) => setV(e.target.value)}
          />
        </div>
        <Input placeholder="Disabled" disabled />
      </div>
    </Showcase>
  )
}

function TabsShowcase() {
  return (
    <Showcase title="Tabs" description="Radix tabs with themed trigger + panel." align="stretch">
      <Tabs defaultValue="wallet" className="w-full">
        <TabsList>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet" className="text-sm text-muted-foreground">
          Wallet panel content.
        </TabsContent>
        <TabsContent value="activity" className="text-sm text-muted-foreground">
          Activity panel content.
        </TabsContent>
        <TabsContent value="settings" className="text-sm text-muted-foreground">
          Settings panel content.
        </TabsContent>
      </Tabs>
    </Showcase>
  )
}

function DialogShowcase() {
  return (
    <Showcase title="Dialog" description="Radix dialog with header/footer slots.">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm swap</DialogTitle>
            <DialogDescription>This action is irreversible once broadcast.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The dialog uses Portal, Overlay and Close internally.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Showcase>
  )
}

function ToastShowcase() {
  const { toast, dismiss } = useToast()
  return (
    <Showcase title="Toast" description="Toaster + useToast.">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: 'Swap submitted',
              description: 'Your transaction is being broadcast.',
            })
          }
        >
          default
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            toast({
              variant: 'destructive',
              title: 'Swap failed',
              description: 'Insufficient liquidity on the selected route.',
            })
          }
        >
          destructive
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            toast({
              title: 'Action required',
              description: 'Re-sign the transaction to continue.',
              duration: 8000,
              action: (
                <ToastAction altText="Retry" onClick={() => toast({ title: 'Retrying…' })}>
                  Retry
                </ToastAction>
              ),
            })
          }
        >
          action
        </Button>
        <Button variant="ghost" size="sm" onClick={() => dismiss()}>
          dismiss
        </Button>
      </div>
    </Showcase>
  )
}

function IconsShowcase() {
  const named = [
    ['Send', Icons.Send],
    ['Receive', Icons.Receive],
    ['Swap', Icons.Swap],
    ['Copy', Icons.Copy],
    ['QrCode', Icons.QrCode],
    ['Refresh', Icons.Refresh],
    ['Wallet', Icons.Wallet],
    ['Lightning', Icons.Lightning],
  ] as const

  return (
    <Showcase title="Icon" description="Material Symbols wrapper." align="stretch">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Icon name="bolt" size={s} className="text-primary" />
              <span className="text-[10px] text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {named.map(([label, C]) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 p-2 rounded-md border border-border bg-background/40"
            >
              <C size="md" className="text-foreground" />
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Showcase>
  )
}

function StatusBadgeShowcase() {
  return (
    <Showcase title="StatusBadge" description="Transaction / swap status.">
      <div className="flex flex-wrap justify-center gap-2">
        {(['success', 'completed', 'pending', 'failed', 'error'] as const).map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </div>
    </Showcase>
  )
}

function NetworkBadgeShowcase() {
  return (
    <Showcase title="NetworkBadge" description="Layer / protocol pill.">
      <div className="flex flex-wrap justify-center gap-2">
        {(['L1', 'LN', 'RGB20', 'RGB21', 'RGB-L1', 'RGB-LN', 'Spark', 'Arkade'] as const).map(
          (n) => (
            <NetworkBadge key={n} network={n} />
          )
        )}
      </div>
    </Showcase>
  )
}

function AssetIconShowcase() {
  return (
    <Showcase title="AssetIcon" description="Circular asset logo, CDN + fallback.">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          {['BTC', 'ETH', 'USDT', 'USDC', 'XYZ'].map((t) => (
            <div key={t} className="flex flex-col items-center gap-1">
              <AssetIcon ticker={t} size={40} />
              <span className="text-[10px] text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-end justify-center gap-3">
          {[24, 32, 44, 56].map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <AssetIcon ticker="BTC" size={size} />
              <span className="text-[10px] text-muted-foreground">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </Showcase>
  )
}

function AssetCardShowcase() {
  return (
    <Showcase title="AssetCard" description="Asset row with ticker, balance, networks." align="stretch">
      <div className="flex flex-col gap-2">
        <AssetCard
          ticker="BTC"
          name="Bitcoin"
          displayBalance="0.00142000"
          networks={['L1', 'LN']}
          onClick={() => {}}
        />
        <AssetCard
          ticker="USDT"
          name="Tether"
          displayBalance="1,250.00"
          networks={['RGB20', 'Spark']}
        />
        <AssetCard
          ticker="ETH"
          name="Ethereum"
          displayBalance="0.00"
          networks={['Arkade']}
          balanceVisible={false}
        />
      </div>
    </Showcase>
  )
}

function TransactionCardShowcase() {
  const now = Math.floor(Date.now() / 1000)
  return (
    <Showcase title="TransactionCard" description="Direction + status + amount row." align="stretch">
      <div className="flex flex-col gap-2">
        <TransactionCard
          direction="inbound"
          status="completed"
          displayAmount="1,234"
          timestamp={now - 3600}
          onClick={() => {}}
        />
        <TransactionCard
          direction="outbound"
          status="pending"
          displayAmount="250"
          timestamp={now - 86400}
        />
        <TransactionCard
          direction="outbound"
          status="failed"
          displayAmount="0.0042"
          unit="BTC"
          timestamp={now - 172800}
        />
      </div>
    </Showcase>
  )
}

function PageHeaderShowcase() {
  return (
    <Showcase title="PageHeader" description="Sticky header with slots." align="stretch">
      <div className="flex flex-col gap-2">
        <div className="rounded-lg overflow-hidden border border-border">
          <PageHeader
            left={
              <Button variant="ghost" size="icon">
                <Icons.ArrowBack size="sm" />
              </Button>
            }
            title="Settings"
            right={
              <Button variant="ghost" size="icon">
                <Icons.Settings size="sm" />
              </Button>
            }
          />
        </div>
        <div className="rounded-lg overflow-hidden border border-border">
          <PageHeader
            left={<span className="font-bold">Kaleido</span>}
            right={
              <Button size="sm" variant="outline">
                Connect
              </Button>
            }
          />
        </div>
      </div>
    </Showcase>
  )
}

function SettingItemShowcase() {
  return (
    <Showcase title="SettingItem" description="Settings row." align="stretch">
      <div className="flex flex-col gap-2">
        <SettingItem
          icon="language"
          title="Language"
          description="Interface language"
          value="English"
          onClick={() => {}}
        />
        <SettingItem
          icon="fingerprint"
          title="Biometric unlock"
          description="Use device biometrics"
          showChevron={false}
        />
        <SettingItem
          icon="notifications"
          title="Notifications"
          description="Manage push alerts"
          onClick={() => {}}
        />
      </div>
    </Showcase>
  )
}

function SectionLabelShowcase() {
  return (
    <Showcase title="SectionLabel" description="Uppercase section heading.">
      <div className="flex flex-col items-center gap-2">
        <SectionLabel>Your assets</SectionLabel>
        <SectionLabel>Recent activity</SectionLabel>
        <SectionLabel>Network settings</SectionLabel>
      </div>
    </Showcase>
  )
}

function AlertBannerShowcase() {
  return (
    <Showcase title="AlertBanner" description="Info / warning / error / success." align="stretch">
      <div className="flex flex-col gap-2">
        <AlertBanner variant="info">Heads up — your session expires soon.</AlertBanner>
        <AlertBanner variant="warning">Low on gas. Top up to continue.</AlertBanner>
        <AlertBanner variant="error">Swap failed. Please retry.</AlertBanner>
        <AlertBanner variant="success">Deposit confirmed.</AlertBanner>
      </div>
    </Showcase>
  )
}

function BrokenChild() {
  throw new Error('Intentional error for ErrorBoundary demo')
}

function ErrorBoundaryShowcase() {
  const [explode, setExplode] = useState(false)
  const fallback = (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <Icon name="error" size="sm" />
      <span>Caught: intentional error</span>
    </div>
  )
  return (
    <Showcase title="ErrorBoundary" description="Class boundary with reset + custom fallback." align="stretch">
      <div className="flex flex-col gap-3">
        <Button size="sm" variant="outline" onClick={() => setExplode((v) => !v)}>
          {explode ? 'Reset' : 'Trigger error'}
        </Button>
        <ErrorBoundary key={explode ? 'err' : 'ok'} fallback={fallback}>
          {explode ? <BrokenChild /> : <p className="text-sm text-muted-foreground">All good.</p>}
        </ErrorBoundary>
      </div>
    </Showcase>
  )
}

export function App() {
  const [dark, setDark] = useState(true)

  const toggleTheme = () => {
    setDark((v) => {
      const next = !v
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14">
        <header className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            {dark ? (
              <img
                src="/brand/kaleidoswap-fullogo-horizontal.svg"
                alt="KaleidoSwap"
                className="h-9 w-auto"
              />
            ) : (
              <>
                <img
                  src="/brand/kaleidoswap-pictogram.svg"
                  alt="KaleidoSwap"
                  className="h-9 w-auto"
                />
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  kaleido-ui
                </span>
              </>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">
              showcase
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            <Icon name={dark ? 'light_mode' : 'dark_mode'} size="sm" />
            {dark ? 'Light' : 'Dark'}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-border rounded-lg overflow-hidden bg-card">
          <ButtonsShowcase />
          <ExtendedButtonsShowcase />
          <CardShowcase />
          <InputShowcase />
          <TabsShowcase />
          <DialogShowcase />
          <ToastShowcase />
          <StatusBadgeShowcase />
          <NetworkBadgeShowcase />
          <IconsShowcase />
          <AssetIconShowcase />
          <AssetCardShowcase />
          <TransactionCardShowcase />
          <PageHeaderShowcase />
          <SettingItemShowcase />
          <AlertBannerShowcase />
          <SectionLabelShowcase />
          <ErrorBoundaryShowcase />
        </div>
      </div>

      <Toaster />
    </div>
  )
}

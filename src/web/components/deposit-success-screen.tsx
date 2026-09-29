import { Icon } from '../primitives/icon'
import { Button } from '../primitives/button'
import { AssetIcon } from './asset-icon'
import { NETWORK_CONFIG, type DepositNetworkKey } from './deposit-ui-shared'
import { cn } from '../utils/cn'

export interface DepositSuccessScreenProps {
  handleDone: () => void
  displayTicker: string
  selectedAsset?: { name?: string } | null
  network: DepositNetworkKey
  arkSubMode?: 'ark' | 'boarding'
}

export function DepositSuccessScreen({
  handleDone,
  displayTicker,
  selectedAsset,
  network,
  arkSubMode = 'ark',
}: DepositSuccessScreenProps) {
  const net = NETWORK_CONFIG[network]
  const networkLabel =
    network === 'arkade' ? (arkSubMode === 'boarding' ? 'Arkade Boarding' : 'Arkade') : net.label

  const isInstant = network === 'lightning' || network === 'spark'
  const title = isInstant ? 'Payment Received!' : 'Deposit Detected!'
  const subtitle = isInstant
    ? `Your ${displayTicker} has arrived via ${networkLabel}.`
    : `Incoming deposit detected via ${networkLabel}. Funds will be available after confirmation.`

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-display text-foreground">
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-primary/15 shadow-sm">
            <Icon name="check_circle" className="size-12 text-primary animate-in zoom-in-50 duration-500" />
          </div>
        </div>

        <h1 className="mb-2 text-headline font-bold text-white">{title}</h1>
        <p className="mb-8 max-w-[260px] text-caption leading-relaxed text-muted-foreground">
          {subtitle}
        </p>

        <div className="mb-10 flex items-center gap-3 rounded-2xl bg-card/70 px-4 py-3">
          <AssetIcon ticker={displayTicker} size={36} />
          <div className="text-left">
            <p className="text-body font-bold text-white">{displayTicker}</p>
            <p className="text-caption text-white/40">{selectedAsset?.name ?? displayTicker}</p>
          </div>
          <div
            className={cn(
              'ml-1 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xxs font-bold',
              net.bg,
              net.text,
              net.border
            )}
          >
            {net.icon}
            <span>{networkLabel}</span>
          </div>
        </div>

        <Button variant="cta" size="cta" onClick={handleDone}>
          <Icon name="account_balance_wallet" className="text-icon-lg" />
          Back to Wallet
        </Button>
      </div>
    </div>
  )
}

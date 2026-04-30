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
          <div className="relative flex size-28 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 shadow-sm">
            <span className="material-symbols-outlined text-display text-primary animate-in zoom-in-50 duration-500">
              check_circle
            </span>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white">{title}</h1>
        <p className="mb-8 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>

        <div className="mb-10 flex items-center gap-3 rounded-2xl border bg-white/5 px-4 py-3">
          <AssetIcon ticker={displayTicker} size={36} />
          <div className="text-left">
            <p className="text-sm font-bold text-white">{displayTicker}</p>
            <p className="text-xs text-white/40">{selectedAsset?.name ?? displayTicker}</p>
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
          <span className="material-symbols-outlined text-icon-lg">home</span>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

import { Icon } from '../primitives/icon'
import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { LiquidNetworkIcon, OnchainNetworkIcon } from './network-icon'
import type { DepositAccountId, DepositNetworkKey } from './deposit-ui-shared'
import { eyebrow } from '../utils/type-roles'

export interface DepositNetworkOption {
  network: DepositNetworkKey
  account: DepositAccountId
  label: string
  description: string
  icon: ReactNode
  accentBg: string
  /** @deprecated Borderless sweep (DESIGN.md Coherence Rules): the suggested row is tinted via `accentBg` only. Kept for source compat. */
  accentBorder: string
  accentText: string
}

const NETWORK_OPTIONS: Record<DepositAccountId, DepositNetworkOption> = {
  RGB: {
    network: 'onchain',
    account: 'RGB',
    label: 'On-chain / Lightning',
    description: 'Classic Bitcoin address or Lightning invoice via the RLN node.',
    icon: <OnchainNetworkIcon className="size-5" />,
    accentBg: 'bg-network-bitcoin/10',
    accentBorder: 'border-network-bitcoin/30',
    accentText: 'text-network-bitcoin-fg',
  },
  SPARK: {
    network: 'spark',
    account: 'SPARK',
    label: 'Spark',
    description: 'Receive directly into your Spark account. Fast and free.',
    icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="" className="kui-mono-icon h-[18px]" />,
    accentBg: 'bg-info/10',
    accentBorder: 'border-info/30',
    accentText: 'text-info-fg',
  },
  ARKADE: {
    network: 'arkade',
    account: 'ARKADE',
    label: 'Arkade',
    description: 'Receive directly into your Arkade account. Low fees, near-instant settlement.',
    icon: <img src="/icons/arkade/arkade-icon.svg" alt="" className="h-[18px]" />,
    accentBg: 'bg-network-arkade/10',
    accentBorder: 'border-network-arkade/30',
    accentText: 'text-network-arkade-fg',
  },
  LIQUID: {
    // Liquid is its own chain; reuse the "onchain" network key for the modal's
    // network callback (there's no dedicated Liquid DepositNetworkKey).
    network: 'onchain',
    account: 'LIQUID',
    label: 'Liquid',
    description: 'Receive L-BTC or a Liquid asset (USDt) via a confidential Liquid address.',
    icon: <LiquidNetworkIcon className="h-[18px] w-[18px]" />,
    accentBg: 'bg-network-liquid/10',
    accentBorder: 'border-network-liquid/30',
    accentText: 'text-network-liquid-fg',
  },
}

export interface DepositNetworkDefaultModalProps {
  open: boolean
  assetTicker: string
  availableAccounts: DepositAccountId[]
  suggestedAccount: DepositAccountId
  onSelect: (network: DepositNetworkKey) => void
}

export function DepositNetworkDefaultModal({
  open,
  assetTicker,
  availableAccounts,
  suggestedAccount,
  onSelect,
}: DepositNetworkDefaultModalProps) {
  if (!open) return null

  const options = availableAccounts.map((id) => NETWORK_OPTIONS[id]).filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-lg">
      <div className="w-full space-y-4 rounded-t-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card-hero px-4 pb-7 pt-5 shadow-popover animate-in slide-in-from-bottom-4 duration-200">
        <div className="-mt-1 mb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-secondary/40" />
        </div>

        <div>
          <p className="text-body font-bold text-foreground">Choose your default network</p>
          <p className="mt-0.5 text-tiny text-foreground/55">
            Pick how you would like to receive{' '}
            <span className="font-semibold text-muted-foreground">{assetTicker}</span> by default.
            You can always switch in the deposit screen.
          </p>
        </div>

        <div className="space-y-2">
          {options.map((option) => {
            const isSuggested = option.account === suggestedAccount
            return (
              <button
                key={option.account}
                type="button"
                onClick={() => onSelect(option.network)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all',
                  isSuggested
                    ? cn(option.accentBg, 'shadow-glow-violet-soft ring-1 ring-inset ring-secondary/50')
                    : 'bg-muted/40 shadow-raised hover-gradient-violet'
                )}
              >
                <div
                  className={cn(
                    'flex size-8 flex-shrink-0 items-center justify-center rounded-lg',
                    isSuggested ? cn(option.accentBg, 'shadow-raised') : 'bg-secondary/15 ring-1 ring-inset ring-secondary/25',
                    isSuggested ? option.accentText : 'text-secondary-content'
                  )}
                >
                  {option.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-caption font-bold', isSuggested ? option.accentText : 'text-foreground')}>
                      {option.label}
                    </span>
                    {isSuggested && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5', eyebrow,
                          option.accentBg,
                          option.accentText
                        )}
                      >
                        recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xxs leading-snug text-foreground/55">{option.description}</p>
                </div>

                <Icon
                  name="chevron_right"
                  className={cn(
                    'flex-shrink-0 text-icon-lg',
                    isSuggested ? option.accentText : 'text-foreground/25'
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

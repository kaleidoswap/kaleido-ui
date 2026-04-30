import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import type { DepositAccountId, DepositNetworkKey } from './deposit-ui-shared'

export interface DepositNetworkOption {
  network: DepositNetworkKey
  account: DepositAccountId
  label: string
  description: string
  icon: ReactNode
  accentBg: string
  accentBorder: string
  accentText: string
}

const NETWORK_OPTIONS: Record<DepositAccountId, DepositNetworkOption> = {
  RGB: {
    network: 'onchain',
    account: 'RGB',
    label: 'On-chain / Lightning',
    description: 'Classic Bitcoin address or Lightning invoice via the RLN node.',
    icon: <span className="material-symbols-outlined text-[18px]">link</span>,
    accentBg: 'bg-network-bitcoin/10',
    accentBorder: 'border-network-bitcoin/30',
    accentText: 'text-network-bitcoin',
  },
  SPARK: {
    network: 'spark',
    account: 'SPARK',
    label: 'Spark',
    description: 'Receive directly into your Spark account. Fast and free.',
    icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="" className="h-[18px]" />,
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/30',
    accentText: 'text-blue-300',
  },
  ARKADE: {
    network: 'arkade',
    account: 'ARKADE',
    label: 'Arkade',
    description: 'Receive directly into your Arkade account. Low fees, near-instant settlement.',
    icon: <img src="/icons/arkade/arkade-icon.svg" alt="" className="h-[18px]" />,
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
    accentText: 'text-purple-300',
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full space-y-4 rounded-t-2xl border-t border-border bg-background px-4 pb-7 pt-5 animate-in slide-in-from-bottom-4 duration-200">
        <div className="-mt-1 mb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        <div>
          <p className="text-sm font-bold text-white">Choose your default network</p>
          <p className="mt-0.5 text-tiny text-white/45">
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
                  'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  isSuggested
                    ? cn('border-2', option.accentBorder, option.accentBg)
                    : 'border border-white/8 bg-white/4 hover:bg-white/8'
                )}
              >
                <div
                  className={cn(
                    'flex size-8 flex-shrink-0 items-center justify-center rounded-lg',
                    isSuggested ? option.accentBg : 'bg-white/8',
                    isSuggested ? option.accentText : 'text-white/60'
                  )}
                >
                  {option.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-bold', isSuggested ? option.accentText : 'text-white')}>
                      {option.label}
                    </span>
                    {isSuggested && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider',
                          option.accentBg,
                          option.accentText
                        )}
                      >
                        recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xxs leading-snug text-white/45">{option.description}</p>
                </div>

                <span
                  className={cn(
                    'material-symbols-outlined flex-shrink-0 text-[18px]',
                    isSuggested ? option.accentText : 'text-white/25'
                  )}
                >
                  chevron_right
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

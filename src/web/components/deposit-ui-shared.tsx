import { useState, type CSSProperties, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { colors } from '../../tokens/colors'

/**
 * 15%-alpha brand-tinted QR glow. Tailwind cannot statically generate
 * per-network shadow utilities, so this is exposed as an inline style
 * object that consumers spread into the QR backdrop's `style` prop.
 */
const GLOW_ALPHA = '26'
function qrGlowStyle(hex: string): CSSProperties {
  return { boxShadow: `0 0 30px ${hex}${GLOW_ALPHA}` }
}

export type DepositAccountId = 'RGB' | 'SPARK' | 'ARKADE'
export type DepositTransferMethod =
  | 'bitcoin_l1'
  | 'lightning'
  | 'spark'
  | 'arkade'
  | 'boarding'
  | 'submarine_swap'
export type DepositNetworkKey = 'onchain' | 'lightning' | 'spark' | 'arkade'

export interface DepositNetworkConfigEntry {
  label: string
  color: string
  bg: string
  text: string
  border: string
  qrBorder: string
  /** Inline style. Apply via `style={network.qrGlow}`. */
  qrGlow: CSSProperties
  icon: ReactNode
}

export const NETWORK_CONFIG: Record<DepositNetworkKey, DepositNetworkConfigEntry> = {
  onchain: {
    label: 'On-chain',
    color: colors.network.bitcoin,
    bg: 'bg-network-bitcoin/15',
    text: 'text-network-bitcoin',
    border: 'border-network-bitcoin/40',
    qrBorder: 'border-network-bitcoin/30',
    qrGlow: qrGlowStyle(colors.network.bitcoin),
    icon: <span className="material-symbols-outlined text-icon-xs leading-none">link</span>,
  },
  lightning: {
    label: 'Lightning',
    color: colors.network.lightning,
    bg: 'bg-network-lightning/15',
    text: 'text-network-lightning',
    border: 'border-network-lightning/40',
    qrBorder: 'border-network-lightning/30',
    qrGlow: qrGlowStyle(colors.network.lightning),
    icon: <img src="/icons/lightning/lightning.svg" className="size-3" alt="" />,
  },
  spark: {
    label: 'Spark',
    color: colors.info,
    bg: 'bg-info/15',
    text: 'text-info',
    border: 'border-info/40',
    qrBorder: 'border-info/30',
    qrGlow: qrGlowStyle(colors.info),
    icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" className="h-3 w-3" alt="" />,
  },
  arkade: {
    label: 'Arkade',
    color: colors.network.arkade,
    bg: 'bg-network-arkade/15',
    text: 'text-network-arkade',
    border: 'border-network-arkade/40',
    qrBorder: 'border-network-arkade/30',
    qrGlow: qrGlowStyle(colors.network.arkade),
    icon: <img src="/icons/arkade/arkade-icon.svg" className="h-3 w-3 rounded-sm" alt="" />,
  },
}

const ACCOUNT_META: Record<
  DepositAccountId,
  {
    shortLabel: string
    accentBg: string
    accentText: string
    accentBorder: string
    icon: ReactNode
  }
> = {
  RGB: {
    shortLabel: 'RLN',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    accentBorder: 'border-primary/30',
    icon: <img src="/icons/rgb/rgb-logo.svg" alt="" className="h-2.5 w-2.5 object-contain" />,
  },
  SPARK: {
    shortLabel: 'Spark',
    accentBg: 'bg-info/10',
    accentText: 'text-info',
    accentBorder: 'border-info/30',
    icon: (
      <img
        src="/icons/spark/Asterisk/Spark Asterisk White.svg"
        alt=""
        className="h-2.5 w-2.5 object-contain"
      />
    ),
  },
  ARKADE: {
    shortLabel: 'Arkade',
    accentBg: 'bg-network-arkade/10',
    accentText: 'text-network-arkade',
    accentBorder: 'border-network-arkade/30',
    icon: <img src="/icons/arkade/arkade-icon.svg" alt="" className="h-2.5 w-2.5 rounded-[1px] object-contain" />,
  },
}

const METHOD_META: Record<DepositTransferMethod, { label: string }> = {
  bitcoin_l1: { label: 'On-chain' },
  lightning: { label: 'Lightning' },
  spark: { label: 'Spark' },
  arkade: { label: 'Arkade' },
  boarding: { label: 'Boarding' },
  submarine_swap: { label: 'Submarine Swap' },
}

export function InvoiceStatusBanner({
  isInvoicePending,
  isInvoicePaid,
  isInvoiceFailedOrExpired,
  invoiceStatus,
}: {
  isInvoicePending: boolean
  isInvoicePaid: boolean
  isInvoiceFailedOrExpired: boolean
  invoiceStatus: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold',
        isInvoicePaid
          ? 'border-primary/30 bg-primary/10 text-primary'
          : isInvoiceFailedOrExpired
            ? 'border-danger/20 bg-danger/10 text-danger'
            : 'border-warning/20 bg-warning/10 text-warning'
      )}
    >
      {isInvoicePending && (
        <>
          <span className="material-symbols-outlined animate-spin text-icon-sm">
            progress_activity
          </span>
          <span>Waiting for payment...</span>
        </>
      )}
      {isInvoicePaid && (
        <>
          <span className="material-symbols-outlined text-icon-sm">check_circle</span>
          <span>Payment received!</span>
        </>
      )}
      {isInvoiceFailedOrExpired && (
        <>
          <span className="material-symbols-outlined text-icon-sm">cancel</span>
          <span>Invoice {invoiceStatus?.toLowerCase() === 'expired' ? 'expired' : 'failed'}</span>
        </>
      )}
    </div>
  )
}

export function PaidOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary">
          <span className="material-symbols-outlined text-icon-4xl text-background">check</span>
        </div>
        <span className="text-sm font-bold text-primary">Received!</span>
      </div>
    </div>
  )
}

export function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 rounded-lg p-2 transition-all',
        copied
          ? 'bg-primary/15 text-primary'
          : 'bg-white/5 text-white/40 group-hover:bg-primary/10 group-hover:text-primary'
      )}
    >
      {copied ? <Icon name="check" size="sm" /> : <Icon name="content_copy" size="sm" />}
    </div>
  )
}

export function AccountChoiceChip({
  account,
  active,
  onClick,
}: {
  account: DepositAccountId
  active: boolean
  onClick: () => void
}) {
  const meta = ACCOUNT_META[account]

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`deposit-account-${account.toLowerCase()}`}
      className={cn(
        'flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-icon-xxs font-bold transition-all',
        active
          ? cn(meta.accentBg, meta.accentText, meta.accentBorder)
          : 'border-white/8 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white/80'
      )}
    >
      {meta.icon}
      <span>{meta.shortLabel}</span>
    </button>
  )
}

interface NetworkInfoEntry {
  title: string
  detail: string
  bullets: string[]
}

const NETWORK_INFO: Record<DepositNetworkKey, NetworkInfoEntry> = {
  onchain: {
    title: 'On-chain (Bitcoin L1)',
    detail: 'Standard Bitcoin transaction. Anyone can pay you from any Bitcoin wallet.',
    bullets: [
      'Settles in about 10 minutes per confirmation',
      'Pays Bitcoin miner fees, which vary with network load',
      'Spark deposits are auto-claimed once confirmed',
    ],
  },
  lightning: {
    title: 'Lightning',
    detail: 'Instant Bitcoin payments off-chain. Best for small amounts, near-zero fees.',
    bullets: [
      'Settles in seconds, very low fees',
      'Sender needs a Lightning wallet with outbound liquidity',
      'Invoice expires, so generate a fresh one if needed',
    ],
  },
  spark: {
    title: 'Spark',
    detail: 'Native Spark transfer between Spark wallets. Instant and effectively free.',
    bullets: [
      'Settles instantly between Spark wallets',
      'Sender must use a Spark-compatible wallet',
      'Cannot receive from a regular Bitcoin or Lightning wallet directly',
    ],
  },
  arkade: {
    title: 'Arkade',
    detail: 'Off-chain VTXO on the Ark protocol. Instant receive, with periodic on-chain settlement.',
    bullets: [
      'Settles instantly between Arkade wallets',
      'Boarding address accepts on-chain Bitcoin and joins the next round',
      'VTXOs require periodic refresh to stay valid',
    ],
  },
}

export function NetworkInfoDisclosure({
  networks,
  className,
}: {
  networks: DepositNetworkKey[]
  className?: string
}) {
  const [open, setOpen] = useState(false)
  if (networks.length === 0) return null

  return (
    <div className={cn('overflow-hidden rounded-xl border border-white/8 bg-white/3 transition-all', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors hover:bg-white/4"
      >
        <Icon name="info" size="xs" className="text-white/40" />
        <span className="flex-1 text-xxs font-bold uppercase tracking-widest text-white/50">
          What are these networks?
        </span>
        <Icon name={open ? 'expand_less' : 'expand_more'} size="xs" className="text-white/40" />
      </button>
      {open && (
        <div className="space-y-2 px-2.5 pb-2.5 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {networks.map((network) => {
            const info = NETWORK_INFO[network]
            const cfg = NETWORK_CONFIG[network]
            return (
              <div key={network} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={cn('flex size-4 flex-shrink-0 items-center justify-center rounded-md', cfg.bg)}>
                    {cfg.icon}
                  </div>
                  <span className={cn('text-xxs font-bold uppercase tracking-widest', cfg.text)}>
                    {info.title}
                  </span>
                </div>
                <p className="pl-5 text-tiny leading-snug text-muted-foreground">{info.detail}</p>
                <ul className="space-y-0.5 pl-5">
                  {info.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-1.5 text-xxs leading-snug text-white/50">
                      <span className="mt-[1px] text-white/30">-</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function MethodChoiceChip({
  method,
  active,
  enabled,
  disabledReason,
  onClick,
}: {
  method: DepositTransferMethod
  active: boolean
  enabled: boolean
  disabledReason?: string
  onClick: () => void
}) {
  const meta = METHOD_META[method]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      data-testid={`deposit-method-${method}`}
      className={cn(
        'flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-icon-xxs font-bold transition-all',
        active
          ? 'border-white/20 bg-white/12 text-white shadow-sm'
          : enabled
            ? 'border-white/8 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white/80'
            : 'cursor-not-allowed border-border bg-white/3 text-white/20'
      )}
    >
      {meta.label}
      {!enabled && disabledReason && (
        <span className="text-xxs font-normal opacity-60">{disabledReason}</span>
      )}
    </button>
  )
}

import type { CSSProperties, ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { colors } from '../../tokens/colors'
import { LiquidNetworkIcon, OnchainNetworkIcon, RgbNetworkIcon } from './network-icon'
import { DisclosureCard } from './disclosure-card'
import { eyebrow } from '../utils/type-roles'

/**
 * 15%-alpha brand-tinted QR glow. Tailwind cannot statically generate
 * per-network shadow utilities, so this is exposed as an inline style
 * object that consumers spread into the QR backdrop's `style` prop.
 */
const GLOW_ALPHA = '26'
function qrGlowStyle(hex: string): CSSProperties {
  return { boxShadow: `0 0 30px ${hex}${GLOW_ALPHA}` }
}

export type DepositAccountId = 'RGB' | 'SPARK' | 'ARKADE' | 'LIQUID'
export type DepositTransferMethod =
  | 'bitcoin_l1'
  | 'lightning'
  | 'spark'
  | 'arkade'
  | 'boarding'
  | 'submarine_swap'
export type DepositNetworkKey = 'onchain' | 'lightning' | 'spark' | 'arkade' | 'liquid'

export interface DepositNetworkConfigEntry {
  label: string
  color: string
  bg: string
  text: string
  /** @deprecated Borderless sweep (DESIGN.md Coherence Rules): tone comes from `bg`; no border rings. Kept for source compat. */
  border: string
  /** @deprecated Borderless sweep: the QR panel carries only `qrGlow` now. Kept for source compat. */
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
    text: 'text-network-bitcoin-fg',
    border: 'border-network-bitcoin/40',
    qrBorder: 'border-network-bitcoin/30',
    qrGlow: qrGlowStyle(colors.network.bitcoin),
    // On-chain uses the chain mark (as in NetworkBadge) rather than the ₿ coin — the coin reads
    // as "the BTC asset", whereas this row is specifically the *on-chain* (L1)
    // receive rail alongside Lightning/Spark/Arkade, so a chain mark disambiguates.
    icon: <OnchainNetworkIcon className="size-3" />,
  },
  lightning: {
    label: 'Lightning',
    color: colors.network.lightning,
    bg: 'bg-network-lightning/15',
    text: 'text-network-lightning-fg',
    border: 'border-network-lightning/40',
    qrBorder: 'border-network-lightning/30',
    qrGlow: qrGlowStyle(colors.network.lightning),
    icon: <img src="/icons/lightning/lightning.svg" className="size-3" alt="" />,
  },
  spark: {
    label: 'Spark',
    color: colors.info,
    bg: 'bg-info/15',
    text: 'text-info-fg',
    border: 'border-info/40',
    qrBorder: 'border-info/30',
    qrGlow: qrGlowStyle(colors.info),
    icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" className="kui-mono-icon h-3 w-3" alt="" />,
  },
  arkade: {
    label: 'Arkade',
    color: colors.network.arkade,
    bg: 'bg-network-arkade/15',
    text: 'text-network-arkade-fg',
    border: 'border-network-arkade/40',
    qrBorder: 'border-network-arkade/30',
    qrGlow: qrGlowStyle(colors.network.arkade),
    icon: <img src="/icons/arkade/arkade-icon.svg" className="h-3 w-3 rounded-sm" alt="" />,
  },
  liquid: {
    label: 'Liquid',
    color: colors.network.liquid,
    bg: 'bg-network-liquid/15',
    text: 'text-network-liquid-fg',
    border: 'border-network-liquid/40',
    qrBorder: 'border-network-liquid/30',
    qrGlow: qrGlowStyle(colors.network.liquid),
    icon: <LiquidNetworkIcon className="h-3 w-3" />,
  },
}

const ACCOUNT_META: Record<
  DepositAccountId,
  {
    shortLabel: string
    accentBg: string
    accentText: string
    /** @deprecated Borderless sweep (DESIGN.md Coherence Rules): the selected chip takes the green selection ring. Kept for source compat. */
    accentBorder: string
    icon: ReactNode
  }
> = {
  RGB: {
    shortLabel: 'RGB',
    accentBg: 'bg-primary/10',
    accentText: 'text-brand',
    accentBorder: 'border-primary/30',
    // Bundled RGB mark (protocolIcons) — a host-served /icons/rgb/... path
    // renders as a broken box in consumers that don't ship that asset.
    icon: <RgbNetworkIcon className="h-2.5 w-2.5" />,
  },
  SPARK: {
    shortLabel: 'Spark',
    accentBg: 'bg-network-spark/10',
    accentText: 'text-network-spark-fg',
    accentBorder: 'border-network-spark/30',
    icon: (
      <img
        src="/icons/spark/Asterisk/Spark Asterisk White.svg"
        alt=""
        className="kui-mono-icon h-2.5 w-2.5 object-contain"
      />
    ),
  },
  ARKADE: {
    shortLabel: 'Arkade',
    accentBg: 'bg-network-arkade/10',
    accentText: 'text-network-arkade-fg',
    accentBorder: 'border-network-arkade/30',
    icon: <img src="/icons/arkade/arkade-icon.svg" alt="" className="h-2.5 w-2.5 rounded-[1px] object-contain" />,
  },
  LIQUID: {
    shortLabel: 'Liquid',
    accentBg: 'bg-network-liquid/10',
    accentText: 'text-network-liquid-fg',
    accentBorder: 'border-network-liquid/30',
    icon: <LiquidNetworkIcon className="h-2.5 w-2.5" />,
  },
}

const METHOD_META: Record<DepositTransferMethod, { label: string; icon: ReactNode }> = {
  bitcoin_l1: { label: 'On-chain', icon: <OnchainNetworkIcon className="size-3" /> },
  lightning: { label: 'Lightning', icon: <img src="/icons/lightning/lightning.svg" className="size-3" alt="" /> },
  spark: {
    label: 'Spark',
    icon: <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" className="kui-mono-icon size-3 object-contain" alt="" />,
  },
  arkade: { label: 'Arkade', icon: <img src="/icons/arkade/arkade-icon.svg" className="size-3 rounded-sm object-contain" alt="" /> },
  // Boarding is on-chain BTC joining Arkade; a submarine swap is a swap between rails.
  boarding: { label: 'Boarding', icon: <OnchainNetworkIcon className="size-3" /> },
  submarine_swap: { label: 'Submarine Swap', icon: <Icon name="swap_horiz" className="text-icon-xs" /> },
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
        'flex items-center justify-center gap-2 rounded-xl px-3 py-1.5 text-caption font-bold',
        isInvoicePaid
          ? 'bg-primary/10 text-brand shadow-glow-primary-soft'
          : isInvoiceFailedOrExpired
            ? 'bg-danger/10 text-danger-fg'
            : 'bg-warning/10 text-warning-fg'
      )}
    >
      {isInvoicePending && (
        <>
          <Icon name="progress_activity" className="animate-spin text-icon-sm" />
          <span>Waiting for payment...</span>
        </>
      )}
      {isInvoicePaid && (
        <>
          <Icon name="check_circle" className="text-icon-sm" />
          <span>Payment received!</span>
        </>
      )}
      {isInvoiceFailedOrExpired && (
        <>
          <Icon name="cancel" className="text-icon-sm" />
          <span>Invoice {invoiceStatus?.toLowerCase() === 'expired' ? 'expired' : 'failed'}</span>
        </>
      )}
    </div>
  )
}

export function PaidOverlay() {
  return (
    // Reaches 3px past the QR card, its radius concentric with the card's
    // rounded-2xl, so neither the card's anti-aliased white edge nor a frame
    // of up to 3px shows at the corners.
    <div className="absolute -inset-[3px] flex items-center justify-center rounded-[calc(var(--radius-2xl)+3px)] bg-background/95 bg-gradient-card-hero">
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary bg-gradient-primary shadow-glow-brand">
          <Icon name="check" className="text-icon-4xl text-background" />
        </div>
        <span className="text-body font-bold text-gradient-brand">Received!</span>
      </div>
    </div>
  )
}

export interface CopyIconProps {
  copied: boolean
  /**
   * `tile` (default) is the padded, tinted tile for a row that is itself the
   * button. `bare` is the glyph alone — copy, or the check once copied — for a
   * control that draws its own surface, such as `CopyButton`.
   */
  variant?: 'tile' | 'bare'
  className?: string
}

export function CopyIcon({ copied, variant = 'tile', className }: CopyIconProps) {
  if (variant === 'bare') {
    return (
      <Icon
        name={copied ? 'check' : 'content_copy'}
        aria-hidden="true"
        className={cn('text-icon-sm', copied && 'text-brand', className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'flex-shrink-0 rounded-lg p-2 transition-all',
        copied
          ? 'bg-primary/15 text-brand shadow-glow-primary-soft'
          : 'bg-secondary/15 text-secondary-content group-hover:bg-secondary group-hover:bg-gradient-violet group-hover:text-white'
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
  label,
}: {
  account: DepositAccountId
  active: boolean
  onClick: () => void
  /** Override the short label, e.g. "RLN" vs "RGB" for the RGB account's backing. */
  label?: string
}) {
  const meta = ACCOUNT_META[account]

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`deposit-account-${account.toLowerCase()}`}
      className={cn(
        'flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-icon-xxs font-bold transition-all',
        active
          ? cn(meta.accentText, 'bg-primary/10 bg-gradient-active ring-1 ring-inset ring-primary/40 shadow-glow-primary-faint')
          : 'bg-foreground/5 text-muted-foreground hover-gradient-violet hover:text-foreground/80'
      )}
    >
      {meta.icon}
      <span>{label ?? meta.shortLabel}</span>
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
  liquid: {
    title: 'Liquid',
    detail:
      'Bitcoin sidechain transaction (L-BTC or Liquid assets). One confidential address receives any Liquid asset.',
    bullets: [
      'Blocks every minute; ~2 confirmations to settle',
      'Amounts are confidential on-chain by default',
      'Sender needs a Liquid wallet (L-BTC or Liquid assets)',
    ],
  },
}

// The protocol marks (the same files as the showcase's External logos, served
// from /logos/protocols) and each network's per-theme foreground from Brand.
// Spark's asterisk is white; kui-mono-icon draws it black on the light theme.
const NETWORK_INFO_MARK: Record<DepositNetworkKey, { src: string; text: string; mono?: boolean }> = {
  onchain: { src: '/logos/protocols/bitcoin.svg', text: 'text-network-bitcoin-fg' },
  lightning: { src: '/logos/protocols/lightning.svg', text: 'text-network-lightning-fg' },
  spark: { src: '/logos/protocols/spark-asterisk-white.svg', text: 'text-network-spark-fg', mono: true },
  arkade: { src: '/logos/protocols/arkade.svg', text: 'text-network-arkade-fg' },
  liquid: { src: '/logos/protocols/liquid.svg', text: 'text-network-liquid-fg' },
}

export function NetworkInfoDisclosure({
  networks,
  className,
}: {
  networks: DepositNetworkKey[]
  className?: string
}) {
  if (networks.length === 0) return null

  return (
    <DisclosureCard
      className={className}
      triggerClassName="px-2.5 py-1.5"
      contentClassName="space-y-2 px-2.5 pb-2.5 pt-1"
      icon={<Icon name="info" size="xs" className="text-secondary-content" />}
      title={<span className={cn('text-muted-foreground', eyebrow)}>What are these networks?</span>}
    >
      {networks.map((network) => {
        const info = NETWORK_INFO[network]
        const mark = NETWORK_INFO_MARK[network]
        return (
          <div key={network} className="space-y-1">
            <div className="flex items-center gap-1.5">
              {network === 'onchain' ? (
                <OnchainNetworkIcon />
              ) : (
                <img
                  src={mark.src}
                  alt=""
                  className={cn('size-3.5 flex-shrink-0 object-contain', mark.mono && 'kui-mono-icon')}
                />
              )}
              <span className={cn(eyebrow, mark.text)}>
                {info.title}
              </span>
            </div>
            <p className="pl-5 text-tiny leading-snug text-muted-foreground">{info.detail}</p>
            <ul className="space-y-0.5 pl-5">
              {info.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-1.5 text-xxs leading-snug text-foreground/50">
                  <span className="mt-[1px] text-foreground/55">-</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </DisclosureCard>
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
        'flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-icon-xxs font-bold transition-all',
        active
          ? 'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary'
          : enabled
            ? 'bg-foreground/5 text-muted-foreground hover-gradient-violet hover:text-foreground/80'
            : 'cursor-not-allowed bg-foreground/3 text-foreground/20'
      )}
    >
      <span className={cn('flex shrink-0 items-center', !enabled && 'opacity-40 grayscale')}>{meta.icon}</span>
      {meta.label}
      {!enabled && disabledReason && (
        <span className="text-xxs font-normal opacity-60">{disabledReason}</span>
      )}
    </button>
  )
}

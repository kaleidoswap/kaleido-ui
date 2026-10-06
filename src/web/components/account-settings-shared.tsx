import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { ScrollArea } from '../primitives/scroll-area'
import { cn } from '../utils/cn'
import { AlertBanner } from './alert-banner'
import { NostrNetworkIcon, RgbNetworkIcon } from './network-icon'
import { eyebrow } from '../utils/type-roles'
import { IconButton } from '../primitives/icon-button'

export type AccountSettingsProtocol = 'RGB' | 'SPARK' | 'ARKADE' | 'NOSTR'
export type AccountSettingsNetwork = 'mainnet' | 'testnet' | 'regtest' | 'signet'

const SUPPORTED_ACCOUNT_NETWORKS: Record<AccountSettingsProtocol, AccountSettingsNetwork[]> = {
  RGB: ['regtest', 'testnet', 'signet'],
  SPARK: ['regtest', 'mainnet'],
  ARKADE: ['signet', 'mainnet'],
  // Nostr is network-agnostic; mainnet is the placeholder consumers pass
  // (the network chip is typically hidden for NOSTR rows anyway).
  NOSTR: ['mainnet'],
}

export function getAccountNetworkLabel(network: AccountSettingsNetwork): string {
  switch (network) {
    case 'mainnet':
      return 'Mainnet'
    case 'testnet':
      return 'Testnet'
    case 'regtest':
      return 'Regtest'
    case 'signet':
      return 'Signet'
  }
}

export function getAccountNetworkUi(network: AccountSettingsNetwork) {
  const label = getAccountNetworkLabel(network)
  if (network === 'mainnet') {
    return {
      label,
      badgeClassName: 'bg-success/12 text-success-fg',
      bannerClassName: 'bg-success/10 text-success-fg',
    }
  }
  if (network === 'regtest') {
    return {
      label,
      badgeClassName: 'bg-danger/12 text-danger-fg',
      bannerClassName: 'bg-danger/10 text-danger-fg',
    }
  }
  return {
    label,
    badgeClassName: 'bg-warning/12 text-warning-fg',
    bannerClassName: 'bg-warning/10 text-warning-fg',
  }
}

export function AccountHeaderIcons({ accountId }: { accountId: AccountSettingsProtocol }) {
  if (accountId === 'RGB') {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 shadow-raised">
        <RgbNetworkIcon className="size-5" />
      </span>
    )
  }

  if (accountId === 'SPARK') {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-info/10 shadow-raised">
        <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="Spark" className="kui-mono-icon size-5 object-contain" />
      </span>
    )
  }

  if (accountId === 'NOSTR') {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-network-arkade/10 shadow-raised">
        <NostrNetworkIcon className="size-5" />
      </span>
    )
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-network-arkade/10 shadow-raised">
      <img src="/icons/arkade/arkade-icon.svg" alt="Arkade" className="size-5 rounded-sm object-contain" />
    </span>
  )
}

export function getAccountStatusUi(status: 'ready' | 'offline' | 'optional' | string) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        className: 'bg-success/10 text-success-fg',
      }
    case 'offline':
      return {
        label: 'Offline',
        className: 'bg-warning/10 text-warning-fg',
      }
    default:
      return {
        label: 'Optional',
        className: 'bg-secondary/15 text-secondary-content',
      }
  }
}

export function AccountNetworkSelector({
  accountId,
  value,
  onChange,
  disabled = false,
}: {
  accountId: AccountSettingsProtocol
  value: AccountSettingsNetwork
  onChange: (network: AccountSettingsNetwork) => void
  disabled?: boolean
}) {
  const networks = SUPPORTED_ACCOUNT_NETWORKS[accountId]

  return (
    <div
      role="radiogroup"
      aria-label="Network"
      className={cn(
        'grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-muted p-1 shadow-inner',
        disabled && 'opacity-60'
      )}
    >
      {networks.map((network) => {
        const ui = getAccountNetworkUi(network)
        const selected = value === network
        return (
          <button
            key={network}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(network)}
            className={cn(
              'rounded-xl px-3 py-2.5 transition-all', eyebrow,
              selected
                ? `${ui.badgeClassName} shadow-raised`
                : 'text-muted-foreground hover-gradient-violet hover:text-secondary-content'
            )}
          >
            {ui.label}
          </button>
        )
      })}
    </div>
  )
}

export function AccountNetworkPicker({
  accountId,
  current,
  onSave,
}: {
  accountId: AccountSettingsProtocol
  current: AccountSettingsNetwork
  onSave: (network: AccountSettingsNetwork) => Promise<unknown>
}) {
  const [draft, setDraft] = useState<AccountSettingsNetwork>(current)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setDraft(current)
  }, [current])

  const isDirty = draft !== current

  const handleSave = async () => {
    if (!isDirty) return
    setIsSaving(true)
    try {
      await onSave(draft)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <AccountNetworkSelector
        accountId={accountId}
        value={draft}
        onChange={setDraft}
        disabled={isSaving}
      />
      {isDirty && (
        <Button variant="cta" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Reconnecting...
            </>
          ) : (
            <>Save - Switch to {getAccountNetworkLabel(draft)}</>
          )}
        </Button>
      )}
    </div>
  )
}

export function AccountSettingsShell({
  accountId,
  title,
  subtitle,
  children,
  onBack,
}: {
  accountId: AccountSettingsProtocol
  title: string
  subtitle: string
  children: ReactNode
  /** Optional back callback — if provided, renders a back button inline with the title. */
  onBack?: () => void
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-display text-foreground">
      {/* Fixed chrome: back button, account icons, and title share one header
          row that never scrolls with content (matches the PageHeader pattern
          every other settings page uses). */}
      <header className="flex h-14 shrink-0 items-center gap-2 px-2">
        {onBack && (
          <IconButton icon="arrow_back" label="Go back" size="lg" onClick={onBack} />
        )}
        <AccountHeaderIcons accountId={accountId} />
        <h1 className="text-subhead font-bold text-foreground">{title}</h1>
      </header>

      <ScrollArea className="flex-1" viewportAs="main" viewportClassName="space-y-6 px-5 pb-28 pt-2">
        {subtitle && <p className="text-caption text-muted-foreground">{subtitle}</p>}
        {children}
      </ScrollArea>
    </div>
  )
}

export function AccountInfoGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl kui-well p-3 text-caption">
          <p className="text-muted-foreground">{item.label}</p>
          <div className="mt-1 break-words text-foreground/90">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

/** An account's notice: the Alert Banner, `info` by default and `warning` for a caution. */
export function AccountNotice({
  tone = 'default',
  children,
}: {
  tone?: 'default' | 'warning'
  children: ReactNode
}) {
  return <AlertBanner variant={tone === 'warning' ? 'warning' : 'info'}>{children}</AlertBanner>
}

/** A network's notice: the Alert Banner in the tone of that network — success on mainnet, error on regtest, warning on the other test networks. */
export function AccountNetworkNotice({
  network,
  children,
}: {
  network: AccountSettingsNetwork
  children: ReactNode
}) {
  const variant = network === 'mainnet' ? 'success' : network === 'regtest' ? 'error' : 'warning'
  return <AlertBanner variant={variant}>{children}</AlertBanner>
}

export function AccountStatusPills({
  status,
  network,
  hideNetworkChip = false,
}: {
  status: 'ready' | 'offline' | 'optional' | string
  network: AccountSettingsNetwork
  /**
   * Drop the network (MAINNET / Regtest / …) chip. Used on the Settings
   * main page where the network is implicit context and the chip is
   * design noise next to the connected/offline status.
   */
  hideNetworkChip?: boolean
}) {
  const statusUi = getAccountStatusUi(status)
  const networkUi = getAccountNetworkUi(network)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          'rounded-full px-2.5 py-1', eyebrow,
          statusUi.className
        )}
      >
        {statusUi.label === 'Ready' ? 'Connected' : statusUi.label}
      </span>
      {!hideNetworkChip && (
        <span
          className={cn(
            'rounded-full px-2.5 py-1', eyebrow,
            networkUi.badgeClassName
          )}
        >
          {networkUi.label}
        </span>
      )}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className={cn('text-muted-foreground', eyebrow)}>{children}</h3>
  )
}

export function InlineAction({
  title,
  description,
  accent = 'primary',
  onClick,
}: {
  title: string
  description: string
  accent?: 'purple' | 'blue' | 'primary'
  onClick: () => void
}) {
  const className =
    accent === 'purple'
      ? 'bg-network-arkade/10 text-network-arkade-fg hover:bg-network-arkade/15'
      : accent === 'blue'
        ? 'bg-info/10 text-info-fg hover:bg-info/15'
        : 'bg-primary/10 text-brand hover:bg-primary/15'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left shadow-raised transition-all',
        className
      )}
    >
      <div>
        <p className="text-body font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-caption text-muted-foreground">{description}</p>
      </div>
      <Icon name="chevron_right" className="text-icon-lg" />
    </button>
  )
}

export function TransferRouteCard({
  label,
  summary,
  eta,
  feeHint,
  account,
}: {
  label: string
  summary: string
  eta: string
  feeHint: string
  /** The account the route goes through — its logo leads the card. Without it, a generic transfer glyph. */
  account?: AccountSettingsProtocol
}) {
  return (
    <div className="rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-4 shadow-card-secondary">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {account ? (
            <AccountHeaderIcons accountId={account} />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25">
              <Icon name="swap_horiz" size="sm" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-body font-bold text-foreground">{label}</p>
            <p className="mt-1 text-caption text-muted-foreground">{summary}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-muted-foreground', eyebrow)}>{eta}</p>
          <p className="mt-1 text-tiny text-brand">{feeHint}</p>
        </div>
      </div>
    </div>
  )
}

export function ExpandIcon({ expanded }: { expanded: boolean }) {
  return <Icon name={expanded ? 'expand_less' : 'expand_more'} size="md" />
}

/**
 * Per-account accent class used as the row's background hue. Mirrors the
 * accent treatment on dashboard asset cards so account rows in Settings
 * have the same visual rhythm.
 */
const ACCOUNT_ACCENT_BG: Record<AccountSettingsProtocol, string> = {
  RGB: 'bg-gradient-to-br from-primary/[0.06] via-card/70 to-primary/[0.10]',
  SPARK: 'bg-gradient-to-br from-info/[0.06] via-card/70 to-info/[0.10]',
  ARKADE: 'bg-gradient-to-br from-network-arkade/[0.06] via-card/70 to-network-arkade/[0.10]',
  NOSTR: 'bg-gradient-to-br from-network-arkade/[0.06] via-card/70 to-network-arkade/[0.10]',
}

export function AccountSettingsRow({
  accountId,
  title,
  status,
  network,
  description,
  onClick,
  hideNetworkChip = false,
  accent = false,
  beta = false,
}: {
  accountId: AccountSettingsProtocol
  title: string
  status: 'ready' | 'offline' | 'optional' | string
  network: AccountSettingsNetwork
  description: string
  onClick: () => void
  /** Drop the MAINNET / Regtest pill — useful in Settings where the row
      is one of many and the network chip is redundant noise. */
  hideNetworkChip?: boolean
  /** Render the row with the per-account accent gradient (used on the
      Settings main page so account rows mirror dashboard asset cards). */
  accent?: boolean
  /** Show a small BETA chip next to the title — used for accounts that
      haven't graduated to mainnet yet (e.g. RGB on testchains only). */
  beta?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full rounded-2xl p-4 text-left shadow-card-secondary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover-soft',
        accent ? ACCOUNT_ACCENT_BG[accountId] : 'bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card'
      )}
    >
      <div className="flex items-start gap-3">
        <AccountHeaderIcons accountId={accountId} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-body font-bold text-foreground">{title}</p>
                {beta && (
                  <span className={cn('rounded-full bg-warning/15 px-1.5 py-0.5 text-warning-fg', eyebrow)}>
                    Beta
                  </span>
                )}
              </div>
              <p className="mt-1 text-caption text-muted-foreground">{description}</p>
            </div>
            <Icon name="chevron_right" size="sm" className="text-muted-foreground transition-colors group-hover:text-secondary-content" />
          </div>
          <div className="mt-3">
            <AccountStatusPills
              status={status}
              network={network}
              hideNetworkChip={hideNetworkChip}
            />
          </div>
        </div>
      </div>
    </button>
  )
}

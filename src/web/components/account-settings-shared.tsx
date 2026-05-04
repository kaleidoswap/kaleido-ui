import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { PageHeader } from './page-header'
import { cn } from '../utils/cn'

export type AccountSettingsProtocol = 'RGB' | 'SPARK' | 'ARKADE'
export type AccountSettingsNetwork = 'mainnet' | 'testnet' | 'regtest' | 'signet'

const SUPPORTED_ACCOUNT_NETWORKS: Record<AccountSettingsProtocol, AccountSettingsNetwork[]> = {
  RGB: ['regtest', 'testnet', 'signet'],
  SPARK: ['regtest', 'mainnet'],
  ARKADE: ['signet', 'mainnet'],
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
      badgeClassName: 'bg-success/12 text-success',
      bannerClassName: 'bg-success/10 text-success',
    }
  }
  if (network === 'regtest') {
    return {
      label,
      badgeClassName: 'bg-danger/12 text-danger',
      bannerClassName: 'bg-danger/10 text-danger',
    }
  }
  return {
    label,
    badgeClassName: 'bg-warning/12 text-warning',
    bannerClassName: 'bg-warning/10 text-warning',
  }
}

export function AccountHeaderIcons({ accountId }: { accountId: AccountSettingsProtocol }) {
  if (accountId === 'RGB') {
    return (
      <div className="flex -space-x-1">
        <span className="flex size-10 items-center justify-center rounded-full bg-network-bitcoin/15 shadow-inner">
          <img src="/icons/lightning/lightning.svg" alt="Lightning" className="size-5 object-contain" />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 shadow-inner">
          <img src="/icons/rgb/rgb-logo.svg" alt="RGB" className="size-5 object-contain" />
        </span>
      </div>
    )
  }

  if (accountId === 'SPARK') {
    return (
      <span className="flex size-10 items-center justify-center rounded-full bg-info/10 shadow-inner">
        <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="Spark" className="size-5 object-contain" />
      </span>
    )
  }

  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-network-arkade/10 shadow-inner">
      <img src="/icons/arkade/arkade-icon.svg" alt="Arkade" className="size-5 rounded-sm object-contain" />
    </span>
  )
}

export function getAccountStatusUi(status: 'ready' | 'offline' | 'optional' | string) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        className: 'bg-success/10 text-success',
      }
    case 'offline':
      return {
        label: 'Offline',
        className: 'bg-warning/10 text-warning',
      }
    default:
      return {
        label: 'Optional',
        className: 'bg-white/[0.05] text-white/55',
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
        'grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-black/30 p-1 shadow-inner',
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
              'rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all',
              selected
                ? `${ui.badgeClassName} shadow-inner`
                : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
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
    <div className="min-h-screen bg-background pb-28 font-display text-foreground">
      <PageHeader
        title={title}
        subtitle={subtitle}
        titleAlign="start"
        left={<AccountHeaderIcons accountId={accountId} />}
        onBack={onBack}
        className="px-5 py-4"
      />

      <main className="space-y-6 px-5 py-6">{children}</main>
    </div>
  )
}

export function AccountInfoGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-black/20 p-3 text-xs">
          <p className="text-muted-foreground">{item.label}</p>
          <div className="mt-1 break-all text-white/90">{item.value}</div>
        </div>
      ))}
    </div>
  )
}

export function AccountNotice({
  tone = 'default',
  children,
}: {
  tone?: 'default' | 'warning'
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl px-3 py-3 text-xs',
        tone === 'warning'
          ? 'bg-warning/10 text-warning'
          : 'bg-black/20 text-white/80'
      )}
    >
      {children}
    </div>
  )
}

export function AccountNetworkNotice({
  network,
  children,
}: {
  network: AccountSettingsNetwork
  children: ReactNode
}) {
  return (
    <div className={cn('rounded-xl px-3 py-3 text-xs', getAccountNetworkUi(network).bannerClassName)}>
      {children}
    </div>
  )
}

export function AccountStatusPills({
  status,
  network,
}: {
  status: 'ready' | 'offline' | 'optional' | string
  network: AccountSettingsNetwork
}) {
  const statusUi = getAccountStatusUi(status)
  const networkUi = getAccountNetworkUi(network)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          'rounded-full px-2.5 py-1 text-xxs font-bold uppercase tracking-wider',
          statusUi.className
        )}
      >
        {statusUi.label === 'Ready' ? 'Connected' : statusUi.label}
      </span>
      <span
        className={cn(
          'rounded-full px-2.5 py-1 text-xxs font-bold uppercase tracking-wider',
          networkUi.badgeClassName
        )}
      >
        {networkUi.label}
      </span>
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</h3>
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
      ? 'bg-network-arkade/10 text-network-arkade hover:bg-network-arkade/15'
      : accent === 'blue'
        ? 'bg-info/10 text-info hover:bg-info/15'
        : 'bg-primary/10 text-primary hover:bg-primary/15'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors',
        className
      )}
    >
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="material-symbols-outlined text-icon-lg">chevron_right</span>
    </button>
  )
}

export function TransferRouteCard({
  label,
  summary,
  eta,
  feeHint,
}: {
  label: string
  summary: string
  eta: string
  feeHint: string
}) {
  return (
    <div className="rounded-2xl bg-card/60 p-4 shadow-inner">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
        </div>
        <div className="text-right">
          <p className="text-xxs font-bold uppercase tracking-wider text-white/60">{eta}</p>
          <p className="mt-1 text-tiny text-primary">{feeHint}</p>
        </div>
      </div>
    </div>
  )
}

export function ExpandIcon({ expanded }: { expanded: boolean }) {
  return <Icon name={expanded ? 'expand_less' : 'expand_more'} size="md" />
}

export function AccountSettingsRow({
  accountId,
  title,
  status,
  network,
  description,
  onClick,
}: {
  accountId: AccountSettingsProtocol
  title: string
  status: 'ready' | 'offline' | 'optional' | string
  network: AccountSettingsNetwork
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl bg-white/[0.03] p-4 text-left shadow-inner transition-colors hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <AccountHeaderIcons accountId={accountId} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
            <Icon name="chevron_right" size="sm" className="text-white/40" />
          </div>
          <div className="mt-3">
            <AccountStatusPills status={status} network={network} />
          </div>
        </div>
      </div>
    </button>
  )
}

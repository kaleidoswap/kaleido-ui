import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export type AccountSettingsProtocol = 'RGB' | 'SPARK' | 'ARKADE'
export type AccountSettingsNetwork = 'mainnet' | 'testnet' | 'regtest' | 'signet'

const SUPPORTED_ACCOUNT_NETWORKS: Record<AccountSettingsProtocol, AccountSettingsNetwork[]> = {
  RGB: ['regtest', 'testnet', 'signet'],
  SPARK: ['regtest', 'mainnet'],
  ARKADE: ['signet', 'mainnet'],
}

function getAccountNetworkLabel(network: AccountSettingsNetwork): string {
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

function getAccountNetworkUi(network: AccountSettingsNetwork) {
  const label = getAccountNetworkLabel(network)
  if (network === 'mainnet') {
    return {
      label,
      badgeClassName: 'border-emerald-500/35 bg-emerald-500/12 text-emerald-200',
    }
  }
  if (network === 'regtest') {
    return {
      label,
      badgeClassName: 'border-red-500/35 bg-red-500/12 text-red-200',
    }
  }
  return {
    label,
    badgeClassName: 'border-orange-500/35 bg-orange-500/12 text-orange-200',
  }
}

export function AccountHeaderIcons({ accountId }: { accountId: AccountSettingsProtocol }) {
  if (accountId === 'RGB') {
    return (
      <div className="flex -space-x-1">
        <span className="flex size-10 items-center justify-center rounded-full border border-border bg-network-bitcoin/15 shadow-inner">
          <img src="/icons/lightning/lightning.svg" alt="Lightning" className="size-5 object-contain" />
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-border bg-primary/15 shadow-inner">
          <img src="/icons/rgb/rgb-logo.svg" alt="RGB" className="size-5 object-contain" />
        </span>
      </div>
    )
  }

  if (accountId === 'SPARK') {
    return (
      <span className="flex size-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 shadow-inner">
        <img src="/icons/spark/Asterisk/Spark Asterisk White.svg" alt="Spark" className="size-5 object-contain" />
      </span>
    )
  }

  return (
    <span className="flex size-10 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 shadow-inner">
      <img src="/icons/arkade/arkade-icon.svg" alt="Arkade" className="size-5 rounded-sm object-contain" />
    </span>
  )
}

export function getAccountStatusUi(status: 'ready' | 'offline' | 'optional' | string) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
      }
    case 'offline':
      return {
        label: 'Offline',
        className: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
      }
    default:
      return {
        label: 'Optional',
        className: 'border-border bg-white/[0.05] text-white/55',
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
        'grid auto-cols-fr grid-flow-col gap-1 rounded-2xl border border-border bg-black/30 p-1 shadow-inner',
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
}: {
  accountId: AccountSettingsProtocol
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-28 font-display text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
        <div className="flex items-start gap-3">
          <AccountHeaderIcons accountId={accountId} />
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold">{title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="space-y-6 px-5 py-6">{children}</main>
    </div>
  )
}

export function AccountInfoGrid({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-white/8 bg-black/20 p-3 text-xs">
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
        'rounded-xl border px-3 py-3 text-xs',
        tone === 'warning'
          ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
          : 'border-white/8 bg-black/20 text-white/80'
      )}
    >
      {children}
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
      ? 'border-purple-500/20 bg-purple-500/10 text-purple-200 hover:bg-purple-500/15'
      : accent === 'blue'
        ? 'border-blue-500/20 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15'
        : 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors',
        className
      )}
    >
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
    </button>
  )
}

export function ExpandIcon({ expanded }: { expanded: boolean }) {
  return <Icon name={expanded ? 'expand_less' : 'expand_more'} size="md" />
}

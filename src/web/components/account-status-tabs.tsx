import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog'
import { cn } from '../utils/cn'

export interface AccountStatusTabItem<TId extends string = string> {
  id: TId
  label: string
  state: string
  detail: string
  icon: ReactNode
  dotTone: string
  title: string
  description: string
  capabilityBullets: string[]
  networkLabel: string
  networkBannerClassName: string
  accentBg?: string
  accentBorder?: string
}

export interface AccountStatusTabsProps<TId extends string = string> {
  accounts: AccountStatusTabItem<TId>[]
}

export function AccountStatusTabs<TId extends string = string>({
  accounts,
}: AccountStatusTabsProps<TId>) {
  const [selectedAccountId, setSelectedAccountId] = useState<TId | null>(null)
  const selectedAccount = selectedAccountId
    ? accounts.find((account) => account.id === selectedAccountId)
    : null

  return (
    <>
      <div className="flex max-w-full items-center justify-end overflow-x-auto no-scrollbar pl-3">
        <div className="flex items-center gap-2 px-1">
          {accounts.map((account) => (
            <div key={account.id} className="group relative shrink-0">
              <button
                type="button"
                onClick={() => setSelectedAccountId(account.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border bg-white/[0.06] px-3 py-2 backdrop-blur-md transition-all hover:border-white/15 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30'
                )}
                aria-label={`Open ${account.title} details`}
              >
                <span className="shrink-0">{account.icon}</span>
                <span className={cn('size-2 rounded-full', account.dotTone)} />
              </button>

              <div
                className={cn(
                  'pointer-events-none absolute bottom-[calc(100%+12px)] right-0 z-20 hidden w-64 rounded-2xl border bg-popover/95 p-3.5 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-150 group-hover:opacity-100 md:block'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0">{account.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xxs font-black uppercase tracking-[0.18em] text-white/55">
                        {account.label}
                      </div>
                      <span className={cn('size-2 rounded-full', account.dotTone)} />
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white/90">
                      {account.title}
                    </div>
                    <div className="mt-1 text-xs font-medium text-white/45">{account.state}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/60">{account.detail}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/45">
                  {account.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {account.capabilityBullets.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-full border bg-white/[0.05] px-2 py-1 text-xxs font-medium text-white/60"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedAccountId !== null}
        onOpenChange={(open) => !open && setSelectedAccountId(null)}
      >
        {selectedAccount && (
          <DialogContent className="max-w-md border bg-popover p-0 text-white">
            <div className="p-6">
              <DialogHeader className="text-left">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'rounded-2xl border p-3',
                      selectedAccount.accentBg,
                      selectedAccount.accentBorder
                    )}
                  >
                    {selectedAccount.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xxs font-black uppercase tracking-[0.18em] text-muted-foreground">
                        {selectedAccount.label}
                      </span>
                      <span className={cn('size-2 rounded-full', selectedAccount.dotTone)} />
                    </div>
                    <DialogTitle className="mt-1 text-xl font-bold text-white">
                      {selectedAccount.title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm leading-relaxed text-white/60">
                      {selectedAccount.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    'rounded-2xl border px-4 py-3',
                    selectedAccount.networkBannerClassName
                  )}
                >
                  <div className="text-icon-xxs font-black uppercase tracking-[0.18em]">
                    Network
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {selectedAccount.networkLabel}
                  </div>
                </div>
                <div className="rounded-2xl border bg-white/[0.04] px-4 py-3">
                  <div className="text-icon-xxs font-black uppercase tracking-[0.18em] text-white/45">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/90">
                    {selectedAccount.state}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {selectedAccount.detail}
              </p>

              <div className="mt-5">
                <div className="text-icon-xxs font-black uppercase tracking-[0.18em] text-white/45">
                  Capabilities
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedAccount.capabilityBullets.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-full border bg-white/[0.05] px-2.5 py-1 text-xxs font-medium text-white/65"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

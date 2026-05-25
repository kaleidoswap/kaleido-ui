import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface WithdrawRouteOption<TAccount extends string = string> {
  account: TAccount
  method: string
  summary: string
  accountTitle: string
  methodLabel: string
  feeHint: string
  /** When true, the route is unavailable (e.g. insufficient liquidity) and not clickable. */
  disabled?: boolean
  /** Short reason shown under the disabled card. Pair with `disabled`. */
  disabledReason?: string
  /** Optional account/protocol logo rendered on the left of the card (e.g. NetworkBadge). */
  accountIcon?: ReactNode
  /** Optional pre-formatted balance label (e.g. "1.23 BTC available") shown on the card. */
  balanceLabel?: string
}

export interface WithdrawRouteSummary {
  method: string
  summary: string
  methodLabel: string
}

export interface WithdrawRouteSelectorProps<TAccount extends string = string> {
  routes: WithdrawRouteOption<TAccount>[]
  activeRouteAccount: TAccount | undefined
  recommendedRouteAccount: TAccount | undefined
  selectedRouteSummary: WithdrawRouteSummary | null
  selectedAccountTitle?: string
  onRouteChange: (account: TAccount) => void
}

function RouteChoiceCard<TAccount extends string>({
  route,
  selected,
  recommended,
  onClick,
  displayOnly,
}: {
  route: WithdrawRouteOption<TAccount>
  selected: boolean
  recommended: boolean
  onClick: () => void
  displayOnly?: boolean
}) {
  const { disabled = false, disabledReason, accountIcon, balanceLabel } = route

  if (displayOnly) {
    return (
      <div className="rounded-2xl bg-card/50 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {accountIcon && <div className="shrink-0">{accountIcon}</div>}
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white">{route.accountTitle}</span>
              <p className="mt-0.5 text-xs text-white/45">{route.methodLabel}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-xxs font-bold uppercase tracking-wider text-white/35">
              {route.feeHint}
            </span>
            {balanceLabel && (
              <span className="font-mono text-xxs text-white/50">{balanceLabel}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      data-testid={`withdraw-route-${route.account.toLowerCase()}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      title={disabled ? disabledReason : undefined}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all',
        disabled
          ? 'cursor-not-allowed border-danger/15 bg-danger/5 opacity-60'
          : selected
            ? 'border-primary/30 bg-primary/10'
            : 'border-border bg-white/4 hover:border-white/20 hover:bg-white/6'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {accountIcon && <div className="mt-0.5 shrink-0">{accountIcon}</div>}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">{route.accountTitle}</span>
              {recommended && !disabled && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-primary">
                  Recommended
                </span>
              )}
              {disabled && (
                <span className="rounded-full border border-danger/20 bg-danger/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-danger">
                  Insufficient
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-white/45">{route.methodLabel}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xxs font-bold uppercase tracking-wider text-white/35">
            {route.feeHint}
          </span>
          {balanceLabel && (
            <span className="font-mono text-xxs text-white/50">{balanceLabel}</span>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{route.summary}</p>
      {disabled && disabledReason && (
        <p className="mt-2 text-xxs leading-relaxed text-danger/80">{disabledReason}</p>
      )}
    </button>
  )
}

export function WithdrawRouteSelector<TAccount extends string = string>({
  routes,
  activeRouteAccount,
  recommendedRouteAccount,
  onRouteChange,
}: WithdrawRouteSelectorProps<TAccount>) {
  const isDisplayOnly = routes.length === 1 && !routes[0].disabled

  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Route
      </label>

      <div className="space-y-2">
        {routes.map((route) => (
          <RouteChoiceCard
            key={route.account}
            route={route}
            selected={activeRouteAccount === route.account}
            recommended={recommendedRouteAccount === route.account}
            onClick={() => onRouteChange(route.account)}
            displayOnly={isDisplayOnly}
          />
        ))}
      </div>
    </div>
  )
}

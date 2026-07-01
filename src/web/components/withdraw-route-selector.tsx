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
  /** Optional protocol-tinted classes applied when the card is selected
   * (e.g. "bg-network-spark/12"). Falls back to the brand primary tint. */
  accentClassName?: string
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
  const { disabled = false, disabledReason, accountIcon, balanceLabel, accentClassName } = route

  // Card body: protocol name, current amount below it, and the fee hint.
  const body = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {accountIcon && <div className="mt-0.5 shrink-0">{accountIcon}</div>}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white">{route.accountTitle}</span>
            {recommended && !disabled && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-primary">
                Recommended
              </span>
            )}
            {disabled && (
              <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-danger">
                Insufficient
              </span>
            )}
          </div>
          {balanceLabel && (
            <p className="mt-0.5 font-mono text-xs text-white/55">{balanceLabel}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 text-xxs font-bold uppercase tracking-wider text-white/40">
        {route.feeHint}
      </span>
    </div>
  )

  if (displayOnly) {
    return <div className="rounded-2xl bg-card/50 px-4 py-3.5">{body}</div>
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
        'w-full rounded-2xl p-4 text-left transition-all',
        disabled
          ? 'cursor-not-allowed bg-danger/5 opacity-60'
          : selected
            ? (accentClassName ?? 'bg-primary/10')
            : 'bg-white/4 hover:bg-white/6'
      )}
    >
      {body}
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

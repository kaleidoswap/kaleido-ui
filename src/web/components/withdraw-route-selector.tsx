import { cn } from '../utils/cn'

export interface WithdrawRouteOption<TAccount extends string = string> {
  account: TAccount
  method: string
  summary: string
  accountTitle: string
  methodLabel: string
  feeHint: string
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
}: {
  route: WithdrawRouteOption<TAccount>
  selected: boolean
  recommended: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-testid={`withdraw-route-${route.account.toLowerCase()}`}
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition-all',
        selected
          ? 'border-primary/30 bg-primary/10'
          : 'border-border bg-white/4 hover:border-white/20 hover:bg-white/6'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{route.accountTitle}</span>
            {recommended && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wider text-primary">
                Recommended
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-white/45">{route.methodLabel}</p>
        </div>
        <span className="text-xxs font-bold uppercase tracking-wider text-white/35">
          {route.feeHint}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{route.summary}</p>
    </button>
  )
}

export function WithdrawRouteSelector<TAccount extends string = string>({
  routes,
  activeRouteAccount,
  recommendedRouteAccount,
  selectedRouteSummary,
  selectedAccountTitle,
  onRouteChange,
}: WithdrawRouteSelectorProps<TAccount>) {
  return (
    <div className="space-y-3">
      <div>
        <label className="ml-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Route
        </label>
        <p className="ml-1 mt-1 text-xs text-muted-foreground">
          Choose the account to spend from. The transfer method is derived from the destination you
          entered.
        </p>
      </div>

      <div className="space-y-2">
        {routes.map((route) => (
          <RouteChoiceCard
            key={route.account}
            route={route}
            selected={activeRouteAccount === route.account}
            recommended={recommendedRouteAccount === route.account}
            onClick={() => onRouteChange(route.account)}
          />
        ))}
      </div>

      {selectedRouteSummary && activeRouteAccount && (
        <div className="rounded-2xl border bg-white/4 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-wider text-white/35">Selected path</span>
            <span className="text-xs font-bold text-white">{selectedAccountTitle}</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-white">
            {selectedRouteSummary.methodLabel}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{selectedRouteSummary.summary}</p>
        </div>
      )}
    </div>
  )
}

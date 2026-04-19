import { cn } from '../utils/cn'
import { Card } from '../primitives/card'

export type TxDirection = 'sent' | 'received' | 'swap'
export type TxStatus   = 'completed' | 'pending' | 'failed'
export type TxNetwork  = 'L1' | 'LN' | 'RGB-LN' | 'RGB-L1' | 'Spark' | 'Arkade'

export interface TransactionItemProps {
  direction: TxDirection
  status: TxStatus
  /** Pre-formatted amount string, e.g. "12,450" */
  amount: string
  ticker: string
  /** Optional secondary fiat line, e.g. "$0.42" */
  fiatAmount?: string
  network?: TxNetwork
  /** Unix timestamp (seconds) or ISO/formatted date string */
  date: number | string
  /** Override the auto direction label */
  label?: string
  onClick?: () => void
  className?: string
}

// ── status ─────────────────────────────────────────────────────────────────────
const STATUS: Record<TxStatus, { bg: string; border: string; color: string; icon: string; label: string }> = {
  completed: { bg: 'bg-primary/10',    border: 'border-primary/20',     color: 'text-primary',      icon: 'check_circle', label: 'Completed' },
  pending:   { bg: 'bg-yellow-400/10', border: 'border-yellow-400/20',  color: 'text-yellow-400',   icon: 'schedule',     label: 'Pending'   },
  failed:    { bg: 'bg-destructive/10',border: 'border-destructive/20', color: 'text-destructive',  icon: 'error',        label: 'Failed'    },
}

// ── network ────────────────────────────────────────────────────────────────────
const NETWORK: Record<TxNetwork, { bg: string; border: string; color: string; label: string }> = {
  L1:      { bg: 'bg-network-bitcoin/10', border: 'border-network-bitcoin/20', color: 'text-network-bitcoin', label: 'L1'      },
  LN:      { bg: 'bg-yellow-400/10',      border: 'border-yellow-400/20',      color: 'text-yellow-400',      label: 'LN'      },
  'RGB-LN':{ bg: 'bg-network-rgb/10',     border: 'border-network-rgb/20',     color: 'text-network-rgb',     label: 'RGB LN'  },
  'RGB-L1':{ bg: 'bg-network-rgb/10',     border: 'border-network-rgb/20',     color: 'text-network-rgb',     label: 'RGB L1'  },
  Spark:   { bg: 'bg-network-spark/10',   border: 'border-network-spark/20',   color: 'text-network-spark',   label: 'Spark'   },
  Arkade:  { bg: 'bg-network-arkade/10',  border: 'border-network-arkade/20',  color: 'text-network-arkade',  label: 'Arkade'  },
}

// ── direction ──────────────────────────────────────────────────────────────────
const DIRECTION: Record<TxDirection, {
  icon: string; defaultLabel: string; iconBg: string; iconColor: string; amountColor: string; prefix: string
}> = {
  received: { icon: 'arrow_downward', defaultLabel: 'Received', iconBg: 'bg-primary/15', iconColor: 'text-primary',     amountColor: 'text-primary',     prefix: '+' },
  sent:     { icon: 'arrow_outward',  defaultLabel: 'Sent',     iconBg: 'bg-muted',      iconColor: 'text-foreground',  amountColor: 'text-foreground',  prefix: '-' },
  swap:     { icon: 'swap_horiz',     defaultLabel: 'Swap',     iconBg: 'bg-blue-500/15',iconColor: 'text-blue-400',    amountColor: 'text-blue-400',    prefix: ''  },
}

function formatDate(date: number | string): string {
  if (typeof date === 'number') {
    return new Date(date * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  return date
}

export function TransactionItem({
  direction, status, amount, ticker, fiatAmount, network, date, label, onClick, className,
}: TransactionItemProps) {
  const dir  = DIRECTION[direction]
  const stat = STATUS[status]
  const net  = network ? NETWORK[network] : null

  return (
    <Card
      className={cn(
        'flex items-center justify-between px-4 py-3.5 gap-3',
        onClick && 'cursor-pointer hover:border-primary/30 active:scale-[0.99]',
        className,
      )}
      onClick={onClick}
    >
      {/* left — icon + labels */}
      <div className="flex items-center gap-3">
        <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', dir.iconBg)}>
          <span className={cn('material-symbols-outlined text-[18px]', dir.iconColor)}>
            {dir.icon}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
            {label ?? dir.defaultLabel}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* status badge */}
            <span className={cn(
              'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xxs font-bold',
              stat.bg, stat.border, stat.color,
            )}>
              <span className="material-symbols-outlined text-[10px]">{stat.icon}</span>
              {stat.label}
            </span>

            {/* network badge */}
            {net && (
              <span className={cn(
                'rounded-full border px-1.5 py-0.5 text-xxs font-bold',
                net.bg, net.border, net.color,
              )}>
                {net.label}
              </span>
            )}

            <span className="text-tiny text-muted-foreground">{formatDate(date)}</span>
          </div>
        </div>
      </div>

      {/* right — amounts */}
      <div className="shrink-0 text-right">
        <p className={cn('text-sm font-bold tabular-nums', dir.amountColor)}>
          {dir.prefix}{amount}
        </p>
        <p className="text-tiny uppercase tracking-wide text-muted-foreground">{ticker}</p>
        {fiatAmount && (
          <p className="text-tiny tabular-nums text-muted-foreground/60">{fiatAmount}</p>
        )}
      </div>
    </Card>
  )
}

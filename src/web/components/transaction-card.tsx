import { cn } from '../utils/cn'
import { StatusBadge, type StatusType } from './status-badge'

export interface TransactionCardProps {
  /** Direction of the transaction */
  direction: 'inbound' | 'outbound'
  /** Status of the transaction */
  status: StatusType
  /** Formatted amount string (e.g. "1,234") */
  displayAmount: string
  /** Unit label (e.g. "sats", "BTC") */
  unit?: string
  /** Unix timestamp in seconds */
  timestamp: number
  onClick?: () => void
  className?: string
}

export function TransactionCard({
  direction,
  status,
  displayAmount,
  unit = 'sats',
  timestamp,
  onClick,
  className,
}: TransactionCardProps) {
  const isInbound = direction === 'inbound'

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString()

  const statusStyle = {
    success:   { base: 'bg-primary/10', hover: 'hover:bg-primary/15' },
    completed: { base: 'bg-primary/10', hover: 'hover:bg-primary/15' },
    pending:   { base: 'bg-warning/10', hover: 'hover:bg-warning/15' },
    failed:    { base: 'bg-danger/10',  hover: 'hover:bg-danger/15' },
    error:     { base: 'bg-danger/10',  hover: 'hover:bg-danger/15' },
  }[status] ?? { base: 'bg-surface-card', hover: 'hover:bg-surface-elevated' }

  const iconStyle = {
    success:   'bg-primary/20 text-primary',
    completed: 'bg-primary/20 text-primary',
    pending:   'bg-warning/20 text-warning',
    failed:    'bg-danger/20 text-danger',
    error:     'bg-danger/20 text-danger',
  }[status] ?? 'bg-accent text-muted-foreground'

  const textColor = {
    success:   'text-primary',
    completed: 'text-primary',
    pending:   'text-warning',
    failed:    'text-danger',
    error:     'text-danger',
  }[status] ?? 'text-foreground'

  return (
    <div
      className={cn(
        'rounded-3xl p-4 backdrop-blur-xl flex items-center justify-between transition-all shadow-sm relative overflow-hidden group',
        statusStyle.base,
        onClick && `cursor-pointer active:scale-[0.98] ${statusStyle.hover}`,
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={cn(
            'size-11 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform',
            iconStyle
          )}
        >
          <span className="material-symbols-outlined text-icon-xl">
            {isInbound ? 'arrow_downward' : 'arrow_outward'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-wide text-foreground">
            {isInbound ? 'Received' : 'Sent'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={status} />
            <span className="text-tiny text-muted-foreground font-medium tracking-wide">
              {formatDate(timestamp)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right relative z-10">
        <p
          className={cn(
            'font-bold text-lg tracking-tight group-hover:opacity-90 transition-opacity',
            textColor
          )}
        >
          {isInbound ? '+' : '-'}
          {displayAmount}
        </p>
        <p className="text-tiny text-muted-foreground font-medium tracking-wide uppercase mt-0.5">
          {unit}
        </p>
      </div>
    </div>
  )
}

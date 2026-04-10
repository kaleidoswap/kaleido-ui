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

  return (
    <div
      className={cn(
        'p-4 rounded-card bg-background-dark/40 backdrop-blur-xl border border-white/5 flex items-center justify-between transition-all shadow-sm relative overflow-hidden group',
        onClick && 'cursor-pointer hover:border-primary/40 hover:shadow-glow-subtle active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={cn(
            'size-11 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform',
            isInbound
              ? 'bg-primary/20 text-primary border border-primary/20'
              : 'bg-white/5 text-slate-300 border border-white/10'
          )}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isInbound ? 'arrow_downward' : 'arrow_outward'}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className={cn(
              'font-bold text-sm text-white tracking-wide',
              onClick && 'group-hover:text-primary transition-colors'
            )}
          >
            {isInbound ? 'Received' : 'Sent'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={status} className="text-xxs px-1.5 py-0.5" />
            <span className="text-tiny text-slate-400 font-medium tracking-wide">
              {formatDate(timestamp)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right relative z-10">
        <p
          className={cn(
            'font-bold text-base tracking-tight group-hover:opacity-90 transition-opacity',
            isInbound ? 'text-primary' : 'text-white'
          )}
        >
          {isInbound ? '+' : '-'}
          {displayAmount}
        </p>
        <p className="text-tiny text-slate-400 font-medium tracking-wide uppercase mt-0.5">
          {unit}
        </p>
      </div>
    </div>
  )
}

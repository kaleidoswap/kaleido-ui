import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import { StatusBadge, type StatusType } from './status-badge'
import { cn } from '../utils/cn'

export interface ActivityRowProps {
  title: ReactNode
  amount: ReactNode
  direction?: 'inbound' | 'outbound' | 'swap' | 'neutral'
  status?: StatusType
  timestamp?: ReactNode
  networkBadge?: ReactNode
  unit?: ReactNode
  icon?: IconName | ReactNode
  onClick?: () => void
  className?: string
}

const directionUi = {
  inbound: { icon: 'south_west', iconClass: 'bg-primary/20 text-primary', amountClass: 'text-primary', sign: '+' },
  outbound: { icon: 'north_east', iconClass: 'bg-white/10 text-muted-foreground', amountClass: 'text-foreground', sign: '-' },
  swap: { icon: 'swap_horiz', iconClass: 'bg-white/10 text-foreground', amountClass: 'text-foreground', sign: '' },
  neutral: { icon: 'receipt_long', iconClass: 'bg-white/10 text-muted-foreground', amountClass: 'text-foreground', sign: '' },
} as const

export function ActivityRow({
  title,
  amount,
  direction = 'neutral',
  status,
  timestamp,
  networkBadge,
  unit,
  icon,
  onClick,
  className,
}: ActivityRowProps) {
  const ui = directionUi[direction]
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl shadow-inner', ui.iconClass)}>
          {typeof icon === 'string' || !icon ? (
            <Icon name={(icon as IconName | undefined) ?? ui.icon} className="text-icon-xl" />
          ) : (
            icon
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-bold tracking-wide text-foreground">{title}</span>
            {networkBadge}
          </div>
          {(status || timestamp) && (
            <div className="mt-1 flex items-center gap-2">
              {status && <StatusBadge status={status} className="px-1.5 py-0.5 text-xxs" />}
              {timestamp && <span className="text-xxs text-muted-foreground">{timestamp}</span>}
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={cn('text-sm font-bold tracking-wide', ui.amountClass)}>
          {ui.sign}
          {amount}
        </p>
        {unit && (
          <p className="mt-0.5 text-xxs font-bold uppercase tracking-wider text-muted-foreground">
            {unit}
          </p>
        )}
      </div>
    </>
  )

  const rowClassName = cn(
    'flex w-full items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-inner transition-colors',
    onClick && 'hover:bg-accent',
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClassName}>
        {content}
      </button>
    )
  }

  return <div className={rowClassName}>{content}</div>
}

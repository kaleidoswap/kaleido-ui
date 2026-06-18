import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Icon } from '../primitives/icon'

export interface DisclosureCardProps {
  title: ReactNode
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  icon?: ReactNode
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

export function DisclosureCard({
  title,
  children,
  open,
  onOpenChange,
  icon,
  className,
  triggerClassName,
  contentClassName,
}: DisclosureCardProps) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border border-border bg-white/3 px-3 py-2 text-left transition-colors hover:bg-white/6',
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {icon}
          <span className="truncate text-xs font-bold text-foreground">{title}</span>
        </span>
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          className="text-icon-md text-muted-foreground"
        />
      </button>
      {open && (
        <div
          className={cn(
            'mt-3 rounded-xl border border-border bg-white/3 px-3 py-3',
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

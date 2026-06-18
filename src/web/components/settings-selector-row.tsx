import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface SettingsSelectorRowProps {
  icon: ReactNode
  title: string
  description?: ReactNode
  control: ReactNode
  className?: string
  iconClassName?: string
}

export function SettingsSelectorRow({
  icon,
  title,
  description,
  control,
  className,
  iconClassName,
}: SettingsSelectorRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 rounded-2xl bg-card p-5', className)}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted',
            iconClassName,
          )}
        >
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-body font-bold tracking-wide text-foreground">{title}</span>
          {description && (
            <span className="mt-0.5 text-sm font-medium text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

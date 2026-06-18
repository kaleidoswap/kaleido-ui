import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import { cn } from '../utils/cn'

type InfoPanelTone = 'default' | 'primary' | 'info' | 'warning' | 'danger' | 'success'

const toneClass: Record<InfoPanelTone, { panel: string; icon: string; title: string }> = {
  default: {
    panel: 'border-white/8 bg-white/[0.03]',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
  },
  primary: {
    panel: 'border-primary/30 bg-primary/5',
    icon: 'text-primary',
    title: 'text-primary',
  },
  info: {
    panel: 'border-info/20 bg-info/10',
    icon: 'text-info',
    title: 'text-info',
  },
  warning: {
    panel: 'border-warning/20 bg-warning/5',
    icon: 'text-warning',
    title: 'text-warning',
  },
  danger: {
    panel: 'border-danger/20 bg-danger/10',
    icon: 'text-danger',
    title: 'text-danger',
  },
  success: {
    panel: 'border-success/20 bg-success/10',
    icon: 'text-success',
    title: 'text-success',
  },
}

export interface InfoPanelProps {
  tone?: InfoPanelTone
  title?: ReactNode
  icon?: IconName | ReactNode
  children: ReactNode
  className?: string
}

export function InfoPanel({
  tone = 'info',
  title,
  icon = tone === 'danger' ? 'warning' : tone === 'success' ? 'check_circle' : 'info',
  children,
  className,
}: InfoPanelProps) {
  const styles = toneClass[tone]
  const renderedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon as IconName} className={cn('mt-0.5 shrink-0 text-icon-xl', styles.icon)} />
    ) : (
      icon
    )

  return (
    <div className={cn('rounded-xl border p-4', styles.panel, className)}>
      <div className="flex items-start gap-3">
        {renderedIcon}
        <div className="min-w-0 flex-1">
          {title && <p className={cn('text-sm font-bold', styles.title)}>{title}</p>}
          <div className={cn('text-xs leading-relaxed', title ? 'mt-1' : '', styles.title)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

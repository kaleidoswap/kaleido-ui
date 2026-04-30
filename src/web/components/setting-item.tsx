import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

interface SettingItemProps {
  icon?: string
  iconSrc?: string
  iconAlt?: string
  title: string
  description?: string
  value?: string | ReactNode
  onClick?: () => void
  showChevron?: boolean
  className?: string
  iconColor?: string
}

export function SettingItem({
  icon,
  iconSrc,
  iconAlt,
  title,
  description,
  value,
  onClick,
  showChevron = true,
  className,
  iconColor = 'text-primary',
}: SettingItemProps) {
  const isClickable = !!onClick

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-card transition-all duration-200 group',
        isClickable && 'cursor-pointer active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(icon || iconSrc) && (
            <div
              className={cn(
                'flex-shrink-0 size-10 rounded-xl flex items-center justify-center bg-primary/15 group-hover:bg-primary/25 group-hover:scale-105 transition-all',
                iconColor
              )}
            >
              {iconSrc ? (
                <img src={iconSrc} alt={iconAlt ?? title} className="size-5 object-contain" />
              ) : (
                <span className="material-symbols-outlined text-icon-xl">{icon}</span>
              )}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-body text-foreground tracking-wide">{title}</span>
            {description && (
              <span className="text-sm text-muted-foreground mt-0.5 font-medium">{description}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && <span className="text-xs text-muted-foreground font-mono">{value}</span>}
          {showChevron && isClickable && (
            <span className="material-symbols-outlined text-icon-md text-muted-foreground group-hover:scale-110 group-hover:text-white transition-all">chevron_right</span>
          )}
        </div>
      </div>
    </div>
  )
}

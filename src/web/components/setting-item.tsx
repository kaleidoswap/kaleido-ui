import { Icon } from '../primitives/icon'
import { isIconName, type IconName } from '../icons'
import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

interface SettingItemProps {
  /** A glyph name from the Icon set, or your own node. An unknown name draws nothing. */
  icon?: IconName | ReactNode
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
  iconColor = 'text-secondary-content',
}: SettingItemProps) {
  const isClickable = !!onClick

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card transition-all duration-200 group',
        isClickable && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {(icon || iconSrc) && (
            <div
              className={cn(
                'flex-shrink-0 size-10 rounded-xl flex items-center justify-center bg-secondary/15 ring-1 ring-inset ring-secondary/25 group-hover:bg-secondary/25 group-hover:shadow-glow-violet-soft group-hover:scale-105 transition-all',
                iconColor
              )}
            >
              {iconSrc ? (
                <img src={iconSrc} alt={iconAlt ?? title} className="size-5 object-contain" />
              ) : (
                isIconName(icon) ? (
                  <Icon name={icon} className="text-icon-xl" />
                ) : typeof icon === 'string' ? null : (
                  icon
                )
              )}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-body text-foreground tracking-wide">{title}</span>
            {description && (
              <span className="text-caption text-muted-foreground mt-0.5 font-medium">{description}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && <span className="text-caption text-muted-foreground font-mono">{value}</span>}
          {showChevron && isClickable && (
            <Icon name="chevron_right" className="text-icon-md text-muted-foreground group-hover:scale-110 group-hover:text-secondary-content transition-all" />
          )}
        </div>
      </div>
    </div>
  )
}

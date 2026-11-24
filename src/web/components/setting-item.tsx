import { Icon } from '../primitives/icon'
import { IconGlyph } from '../primitives/icon-glyph'
import { ChevronRight } from '../icons/outlined'
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
  /** A clickable row that cannot be used now; it stays visible, dimmed. */
  disabled?: boolean
  'data-testid'?: string
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
  disabled = false,
  'data-testid': testId,
}: SettingItemProps) {
  const isClickable = !!onClick
  // A clickable row is a real button, so it is reachable and usable by keyboard.
  const Root = isClickable ? 'button' : 'div'

  return (
    <Root
      {...(isClickable ? { type: 'button' as const, disabled } : {})}
      data-testid={testId}
      className={cn(
        'block w-full p-5 text-left rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card-secondary transition-all duration-200 group',
        isClickable &&
          'cursor-pointer hover:shadow-card-hover-soft hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={onClick}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3 flex-1 min-w-0">
          {(icon || iconSrc) && (
            <span
              className={cn(
                'flex-shrink-0 size-10 rounded-xl flex items-center justify-center bg-secondary/15 group-hover-gradient-violet group-hover:shadow-glow-violet-faint group-hover:scale-105 transition-all',
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
            </span>
          )}
          <span className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-body text-foreground tracking-wide">{title}</span>
            {description && (
              <span className="text-caption text-muted-foreground mt-0.5 font-medium">{description}</span>
            )}
          </span>
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          {value && <span className="text-caption text-muted-foreground font-mono">{value}</span>}
          {showChevron && isClickable && (
            <IconGlyph glyph={ChevronRight} className="text-icon-md text-muted-foreground group-hover:scale-110 group-hover:text-secondary-content transition-all" />
          )}
        </span>
      </span>
    </Root>
  )
}

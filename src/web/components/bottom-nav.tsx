import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface BottomNavItem<TValue extends string = string> {
  id: TValue
  label: string
  icon?: ReactNode
  iconName?: string
  testId?: string
}

export interface BottomNavProps<TValue extends string = string> {
  activeView?: TValue
  items: readonly BottomNavItem<TValue>[]
  onChange: (view: TValue) => void
  position?: 'fixed' | 'inline'
  className?: string
}

export function BottomNav<TValue extends string = string>({
  activeView,
  items,
  onChange,
  position = 'fixed',
  className,
}: BottomNavProps<TValue>) {
  return (
    <nav
      className={cn(
        'w-[90%] max-w-[340px] rounded-full bg-card/60 shadow-lg backdrop-blur-xl',
        position === 'fixed'
          ? 'fixed bottom-6 left-1/2 z-40 -translate-x-1/2'
          : 'relative',
        className
      )}
    >
      <div className="flex items-center justify-around px-0 py-2">
        {items.map(({ id, label, icon, iconName, testId }) => {
          const isActive = activeView === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              data-testid={testId ?? `bottom-nav-${id}`}
              className={cn(
                'relative flex h-[52px] w-[64px] flex-col items-center justify-center rounded-full transition-all duration-300',
                isActive
                  ? 'bg-white/10 text-primary'
                  : 'text-muted-foreground hover:text-white/75 active:scale-95'
              )}
            >
              {icon ?? (iconName ? <Icon name={iconName} className="text-icon-xl" /> : null)}
              <span className="mt-0.5 text-xxs font-semibold transition-colors duration-300">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

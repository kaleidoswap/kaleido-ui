import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface BottomNavItem<TValue extends string = string> {
  id: TValue
  label: string
  /** Static icon node — used when iconName is not provided */
  icon?: ReactNode
  /** Icon name from the SVG icon set — enables filled/outlined animation on selection */
  iconName?: IconName
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
  const trackRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLSpanElement>(null)
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>())
  // Where the blob currently sits, so a move can stretch from here to the target.
  const placed = useRef<{ x: number; w: number } | null>(null)

  // The green sphere is one element that slides under the active item. On a
  // move it stretches toward the target and then settles, like a drop of liquid.
  useLayoutEffect(() => {
    const blob = blobRef.current
    const button = activeView !== undefined ? buttonRefs.current.get(activeView) : undefined
    if (!blob) return
    if (!button) {
      blob.style.opacity = '0'
      placed.current = null
      return
    }
    const to = { x: button.offsetLeft, w: button.offsetWidth }
    const from = placed.current
    blob.style.opacity = '1'
    blob.style.width = `${to.w}px`
    blob.style.transform = `translateX(${to.x}px)`
    placed.current = to
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!from || reduce || (from.x === to.x && from.w === to.w)) return
    // Without the Web Animations API (older webviews, jsdom) the blob just jumps.
    if (typeof blob.animate !== 'function') return
    // Mid-flight the sphere pinches in and sinks lower, then swells back over the new item.
    const frame = (center: number, width: number, scaleY = 1) =>
      `translateX(${center - width / 2}px) scaleY(${scaleY})`
    const fromC = from.x + from.w / 2
    const toC = to.x + to.w / 2
    const midC = (fromC + toC) / 2
    const pinched = Math.min(from.w, to.w) * 0.68
    const swollen = to.w * 1.08
    blob.animate(
      [
        { transform: frame(fromC, from.w), width: `${from.w}px`, offset: 0 },
        { transform: frame(midC, pinched, 0.72), width: `${pinched}px`, offset: 0.45, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
        { transform: frame(toC, swollen, 1.04), width: `${swollen}px`, offset: 0.78, easing: 'ease-out' },
        { transform: frame(toC, to.w), width: `${to.w}px`, offset: 1 },
      ],
      { duration: 560, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' }
    )
  }, [activeView, items.length])

  // Keep the blob on its item when the nav is resized.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      const blob = blobRef.current
      const button = activeView !== undefined ? buttonRefs.current.get(activeView) : undefined
      if (!blob || !button) return
      blob.style.width = `${button.offsetWidth}px`
      blob.style.transform = `translateX(${button.offsetLeft}px)`
      placed.current = { x: button.offsetLeft, w: button.offsetWidth }
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [activeView])

  return (
    <nav
      className={cn(
        'w-[90%] max-w-[21.25rem] rounded-full bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-card-secondary',
        position === 'fixed'
          ? 'fixed bottom-6 left-1/2 z-[var(--z-nav)] -translate-x-1/2'
          : 'relative',
        className
      )}
    >
      <div ref={trackRef} className="relative flex items-center justify-around px-0 py-2">
        <span
          ref={blobRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-2 h-[3.25rem] rounded-full bg-primary bg-gradient-primary opacity-0 shadow-button-primary"
        />
        {items.map(({ id, label, icon, iconName, testId }) => {
          const isActive = activeView === id
          return (
            <button
              key={id}
              ref={(node) => {
                if (node) buttonRefs.current.set(id, node)
                else buttonRefs.current.delete(id)
              }}
              type="button"
              onClick={() => onChange(id)}
              data-testid={testId ?? `bottom-nav-${id}`}
              className={cn(
                'relative z-10 flex h-[3.25rem] w-[4rem] flex-col items-center justify-center rounded-full transition-all duration-300',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover-gradient-violet hover:text-secondary-content active:scale-95'
              )}
            >
              {iconName ? (
                <div className="relative size-icon-nav">
                  <Icon
                    name={iconName}
                    className={cn(
                      'absolute inset-0 size-icon-nav transition-all duration-300',
                      isActive ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                    )}
                  />
                  <Icon
                    name={iconName}
                    filled
                    className={cn(
                      'absolute inset-0 size-icon-nav transition-all duration-300',
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    )}
                  />
                </div>
              ) : (
                icon ?? null
              )}
              <span className="mt-0.5 max-w-full truncate text-xxs font-semibold leading-none transition-colors duration-300">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

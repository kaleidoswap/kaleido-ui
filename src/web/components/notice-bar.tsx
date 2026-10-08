import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cn } from '../utils/cn'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export interface NoticeBarProps {
  /** What the bar holds — usually an `InfoPanel`. The bar has no text of its own. */
  children: ReactNode
  /** Hide the bar without unmounting its owner; the height variable is removed too. */
  hidden?: boolean
  /**
   * The CSS custom property the bar's height is published as, on
   * `document.documentElement`, so the page can pad itself: `padding-top:
   * var(--kui-notice-height, 0px)`.
   */
  heightVariable?: string
  className?: string
}

/**
 * A bar fixed to the top of the viewport, full width, above the page — for a
 * notice that concerns everything below it (an outage, a read-only mode).
 *
 * It measures its own height (ResizeObserver, or on window resize where there
 * is none) and publishes it as a CSS variable on the document root, so fixed
 * headers and the page can move down by exactly that much. The variable is
 * removed when the bar is hidden or unmounted.
 */
export function NoticeBar({ children, hidden = false, heightVariable = '--kui-notice-height', className }: NoticeBarProps) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    const root = typeof document === 'undefined' ? null : document.documentElement
    if (!root) return
    if (hidden || !element) {
      root.style.removeProperty(heightVariable)
      return
    }
    const publish = () => root.style.setProperty(heightVariable, `${Math.round(element.getBoundingClientRect().height)}px`)
    publish()
    let cleanup: () => void
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(publish)
      observer.observe(element)
      cleanup = () => observer.disconnect()
    } else {
      window.addEventListener('resize', publish)
      cleanup = () => window.removeEventListener('resize', publish)
    }
    return () => {
      cleanup()
      root.style.removeProperty(heightVariable)
    }
  }, [hidden, heightVariable])

  if (hidden) return null
  return (
    <div
      ref={ref}
      data-slot="notice-bar"
      className={cn('fixed inset-x-0 top-0 z-[var(--z-popover)] bg-background/90 bg-gradient-card px-4 py-2 shadow-raised backdrop-blur-xl backdrop-saturate-150', className)}
    >
      {children}
    </div>
  )
}

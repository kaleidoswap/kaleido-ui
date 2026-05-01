import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
} from 'react'
import { cn } from '../utils/cn'

type ScrollViewportElement = 'div' | 'main'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children?: any
  viewportClassName?: string
  thumbClassName?: string
  viewportAs?: ScrollViewportElement
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function readPxToken(name: string, fallback: number) {
  if (typeof window === 'undefined') return fallback
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name)
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function ScrollArea({
  children,
  className,
  viewportClassName,
  thumbClassName,
  viewportAs: Viewport = 'div',
  ...props
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement & HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; startY: number; startScrollTop: number } | null>(null)
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false })
  const [isHoveringThumb, setIsHoveringThumb] = useState(false)

  const updateThumb = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const { scrollHeight, clientHeight, scrollTop } = viewport
    const visible = scrollHeight > clientHeight + 1
    if (!visible) {
      setThumb((current) => (current.visible ? { top: 0, height: 0, visible: false } : current))
      return
    }

    const minThumbHeight = readPxToken('--spacing-scrollbar-thumb-min', 24)
    const height = Math.max(minThumbHeight, (clientHeight / scrollHeight) * clientHeight)
    const maxTop = Math.max(0, clientHeight - height)
    const maxScroll = Math.max(1, scrollHeight - clientHeight)
    const top = (scrollTop / maxScroll) * maxTop

    setThumb({ top, height, visible: true })
  }, [])

  const scrollFromThumbDelta = useCallback((deltaY: number, startScrollTop: number) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxThumbTop = Math.max(1, viewport.clientHeight - thumb.height)
    const maxScroll = Math.max(1, viewport.scrollHeight - viewport.clientHeight)
    viewport.scrollTop = startScrollTop + (deltaY / maxThumbTop) * maxScroll
  }, [thumb.height])

  const handleTrackPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const rect = track.getBoundingClientRect()
    const targetTop = event.clientY - rect.top - thumb.height / 2
    const maxThumbTop = Math.max(1, viewport.clientHeight - thumb.height)
    const maxScroll = Math.max(1, viewport.scrollHeight - viewport.clientHeight)
    viewport.scrollTop = (targetTop / maxThumbTop) * maxScroll
  }, [thumb.height])

  const handleThumbPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: viewport.scrollTop,
    }
    setIsHoveringThumb(true)
  }, [])

  const handleThumbPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    scrollFromThumbDelta(event.clientY - drag.startY, drag.startScrollTop)
  }, [scrollFromThumbDelta])

  const handleThumbPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateThumb()
    viewport.addEventListener('scroll', updateThumb, { passive: true })
    window.addEventListener('resize', updateThumb)

    const resizeObserver = new ResizeObserver(updateThumb)
    resizeObserver.observe(viewport)
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild)
    }

    return () => {
      viewport.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
      resizeObserver.disconnect()
    }
  }, [updateThumb])

  return (
    <div className={cn('relative min-h-0 overflow-hidden', className)} {...props}>
      <Viewport
        ref={viewportRef}
        className={cn('h-full min-h-0 overflow-y-auto no-scrollbar', viewportClassName)}
      >
        {children}
      </Viewport>
      {thumb.visible && (
        <div
          aria-hidden
          ref={trackRef}
          className="absolute inset-y-0 right-0 flex w-[var(--spacing-scrollbar-hover)] justify-end"
          onPointerEnter={() => setIsHoveringThumb(true)}
          onPointerLeave={() => setIsHoveringThumb(false)}
          onPointerDown={handleTrackPointerDown}
          style={{ zIndex: 'var(--z-scrollbar)' }}
        >
          <div
            className={cn(
              'absolute right-0 rounded-full bg-scrollbar-thumb transition-[width,background-color]',
              thumbClassName,
            )}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            style={{
              height: thumb.height,
              width: isHoveringThumb ? 'var(--spacing-scrollbar-hover)' : 'var(--spacing-scrollbar)',
              transform: `translateY(${thumb.top}px)`,
              cursor: isHoveringThumb ? 'grab' : 'default',
            }}
          />
        </div>
      )}
    </div>
  )
}

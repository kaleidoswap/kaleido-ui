import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '../utils/cn'

// The library's scrollbars. The native bar is hidden and an overlay thumb is
// drawn instead: 2px at rest, 6px under the pointer, on `scrollbar-thumb`,
// and it takes no width or height from the content. One engine drives both
// axes, so the vertical and the horizontal bar look and behave the same:
//
//   * `ScrollArea` (alias `VerticalScrollArea`) scrolls up and down, thumb on
//     the right edge.
//   * `HorizontalScrollArea` scrolls sideways, thumb on the bottom edge.
//
// Every component that scrolls builds on one of the two, so a scrollbar looks
// the same in a code block, a table, a sheet or the drawer.

type ScrollAxis = 'x' | 'y'

type ScrollViewportElement = 'div' | 'main' | 'pre'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Classes for the element that scrolls: its padding, max height, layout. */
  viewportClassName?: string
  thumbClassName?: string
  /** The element that scrolls: `main` for a page's content, `pre` for code. */
  viewportAs?: ScrollViewportElement
  /** Attributes for the element that scrolls (`data-slot`, `aria-*`, `tabIndex`). */
  viewportProps?: HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined>
  /**
   * `thin` (default): 2px at rest, 6px under the pointer — for panels, lists,
   * code. `thick`: 6px at rest, 10px under the pointer — for a whole page's
   * scroller, where the bar is the main way to see and move through it.
   */
  thickness?: 'thin' | 'thick'
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function readPxToken(name: string, fallback: number) {
  if (typeof window === 'undefined') return fallback
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name)
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

interface ThumbState {
  /** Offset along the axis, in px from the track's start. */
  offset: number
  /** Length along the axis, in px. */
  length: number
  visible: boolean
}

const hiddenThumb: ThumbState = { offset: 0, length: 0, visible: false }

/** The viewport's size, scroll size and scroll position along one axis. */
function metrics(viewport: HTMLElement, axis: ScrollAxis) {
  return axis === 'y'
    ? { client: viewport.clientHeight, scroll: viewport.scrollHeight, position: viewport.scrollTop }
    : { client: viewport.clientWidth, scroll: viewport.scrollWidth, position: viewport.scrollLeft }
}

function setScrollPosition(viewport: HTMLElement, axis: ScrollAxis, value: number) {
  if (axis === 'y') viewport.scrollTop = value
  else viewport.scrollLeft = value
}

const pointerAlong = (event: PointerEvent<HTMLElement>, axis: ScrollAxis) =>
  axis === 'y' ? event.clientY : event.clientX

function OverlayScrollArea({
  axis,
  children,
  className,
  viewportClassName,
  thumbClassName,
  viewportAs: Viewport = 'div',
  viewportProps,
  thickness: size = 'thin',
  ...props
}: ScrollAreaProps & { axis: ScrollAxis }) {
  const viewportRef = useRef<HTMLDivElement & HTMLPreElement & HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; start: number; startScroll: number } | null>(null)
  const [thumb, setThumb] = useState<ThumbState>(hiddenThumb)
  const [isDragging, setIsDragging] = useState(false)
  const [isHoveringThumb, setIsHoveringThumb] = useState(false)

  const updateThumb = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const { client, scroll, position } = metrics(viewport, axis)
    if (scroll <= client + 1) {
      setThumb((current) => (current.visible ? hiddenThumb : current))
      return
    }

    const minLength = readPxToken('--spacing-scrollbar-thumb-min', 24)
    const length = Math.max(minLength, (client / scroll) * client)
    const maxOffset = Math.max(0, client - length)
    const maxScroll = Math.max(1, scroll - client)
    const offset = (position / maxScroll) * maxOffset

    // Only a real change re-renders: the effect below runs after every render.
    setThumb((current) =>
      current.visible && current.offset === offset && current.length === length
        ? current
        : { offset, length, visible: true },
    )
  }, [axis])

  const scrollFromThumbDelta = useCallback((delta: number, startScroll: number) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const { client, scroll } = metrics(viewport, axis)
    const maxOffset = Math.max(1, client - thumb.length)
    const maxScroll = Math.max(1, scroll - client)
    setScrollPosition(viewport, axis, startScroll + (delta / maxOffset) * maxScroll)
  }, [axis, thumb.length])

  const handleTrackPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const rect = track.getBoundingClientRect()
    const start = axis === 'y' ? rect.top : rect.left
    const target = pointerAlong(event, axis) - start - thumb.length / 2
    const { client, scroll } = metrics(viewport, axis)
    const maxOffset = Math.max(1, client - thumb.length)
    const maxScroll = Math.max(1, scroll - client)
    setScrollPosition(viewport, axis, (target / maxOffset) * maxScroll)
  }, [axis, thumb.length])

  const handleThumbPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    if (!viewport) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      start: pointerAlong(event, axis),
      startScroll: metrics(viewport, axis).position,
    }
    setIsHoveringThumb(true)
    setIsDragging(true)
  }, [axis])

  const handleThumbPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    scrollFromThumbDelta(pointerAlong(event, axis) - drag.start, drag.startScroll)
  }, [axis, scrollFromThumbDelta])

  const handleThumbPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateThumb()
    viewport.addEventListener('scroll', updateThumb, { passive: true })
    window.addEventListener('resize', updateThumb)

    let resizeObserver: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateThumb)
      resizeObserver.observe(viewport)
      if (viewport.firstElementChild) {
        resizeObserver.observe(viewport.firstElementChild)
      }
    }

    return () => {
      viewport.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
      resizeObserver?.disconnect()
    }
  }, [updateThumb])

  // New content (a longer line of code, another row) can change the scroll
  // size without resizing anything the observer watches.
  useIsomorphicLayoutEffect(() => {
    updateThumb()
  })

  const vertical = axis === 'y'
  const restVar = size === 'thick' ? 'var(--spacing-scrollbar-thick)' : 'var(--spacing-scrollbar)'
  const hoverVar = size === 'thick' ? 'var(--spacing-scrollbar-thick-hover)' : 'var(--spacing-scrollbar-hover)'
  const thickness = isHoveringThumb ? hoverVar : restVar

  return (
    <div className={cn('relative min-h-0 min-w-0 overflow-hidden', className)} {...props}>
      <Viewport
        {...viewportProps}
        ref={viewportRef}
        data-scroll-axis={axis}
        className={cn(
          vertical ? 'h-full min-h-0 overflow-y-auto' : 'w-full min-w-0 overflow-x-auto',
          'no-scrollbar',
          viewportClassName,
        )}
      >
        {children}
      </Viewport>
      {thumb.visible && (
        <div
          aria-hidden
          ref={trackRef}
          data-slot="scrollbar"
          data-orientation={vertical ? 'vertical' : 'horizontal'}
          data-thickness={size}
          className={
            vertical ? 'absolute inset-y-0 right-0 flex justify-end' : 'absolute inset-x-0 bottom-0 flex items-end'
          }
          onPointerEnter={() => setIsHoveringThumb(true)}
          onPointerLeave={() => setIsHoveringThumb(false)}
          onPointerDown={handleTrackPointerDown}
          // The track is as wide as the hovered thumb, so the pointer finds it.
          style={{ zIndex: 'var(--z-scrollbar)', ...(vertical ? { width: hoverVar } : { height: hoverVar }) }}
        >
          <div
            data-slot="scrollbar-thumb"
            className={cn(
              'absolute rounded-full bg-scrollbar-thumb',
              vertical ? 'right-0 transition-[width,background-color]' : 'bottom-0 transition-[height,background-color]',
              // Held and dragged: a brighter green than the hover.
              isDragging ? 'bg-scrollbar-thumb-active' : isHoveringThumb && 'bg-scrollbar-thumb-hover',
              thumbClassName,
            )}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            style={{
              ...(vertical
                ? { height: thumb.length, width: thickness, transform: `translateY(${thumb.offset}px)` }
                : { width: thumb.length, height: thickness, transform: `translateX(${thumb.offset}px)` }),
              cursor: isDragging ? 'grabbing' : isHoveringThumb ? 'grab' : 'default',
            }}
          />
        </div>
      )}
    </div>
  )
}

/** Scrolls up and down, with the overlay thumb on the right edge. */
export function ScrollArea(props: ScrollAreaProps) {
  return <OverlayScrollArea axis="y" {...props} />
}

/** `ScrollArea` by its axis, beside `HorizontalScrollArea`. */
export const VerticalScrollArea = ScrollArea

/** Scrolls sideways, with the overlay thumb on the bottom edge. */
export function HorizontalScrollArea(props: ScrollAreaProps) {
  return <OverlayScrollArea axis="x" {...props} />
}

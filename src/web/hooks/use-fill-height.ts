import { useLayoutEffect, useRef, useState } from 'react'

/**
 * A chart's plot height that fills the room its parent leaves.
 *
 * Put `slotRef` on a box with no height of its own (`relative flex-1`, with a
 * `min-h-*` for when it is stacked) and the chart's figure in an `absolute
 * inset-0` child. The row is then as tall as its other cells, and the plot takes
 * the slot's height less the chrome around it inside the figure (head, gaps,
 * legend). Measured on every resize, so a taller or shorter neighbour moves the
 * plot with it.
 */
export function useFillHeight(fallback: number, min = 160) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(fallback)
  const heightRef = useRef(height)
  heightRef.current = height

  useLayoutEffect(() => {
    const slot = slotRef.current
    const figure = slot?.firstElementChild?.firstElementChild
    if (!slot || !(figure instanceof HTMLElement) || typeof ResizeObserver === 'undefined') return
    const fit = () => {
      const chrome = figure.getBoundingClientRect().height - heightRef.current
      const next = Math.max(min, Math.floor(slot.clientHeight - chrome))
      if (next !== heightRef.current) setHeight(next)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(slot)
    return () => observer.disconnect()
  })

  return { slotRef, height }
}

import { useEffect, useState } from 'react'
import { breakpoint } from '../../tokens/breakpoints'

const matches = (query: string) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false

/**
 * Whether a media query matches, kept up to date as it changes. Safe on the
 * server and in jsdom: where `matchMedia` does not exist it is `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [value, setValue] = useState(() => matches(query))
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const list = window.matchMedia(query)
    const update = () => setValue(list.matches)
    update()
    list.addEventListener?.('change', update)
    return () => list.removeEventListener?.('change', update)
  }, [query])
  return value
}

/** Narrower than the library's `sm` breakpoint (40rem): a phone. */
export function useIsNarrow(): boolean {
  return useMediaQuery(`(max-width: calc(${breakpoint.sm} - 0.02px))`)
}

import * as React from 'react'
import { Icon } from './icon'

/**
 * Past this many items a menu caps its height at this many, scrolls the rest and
 * offers search. Up to it, the menu shows everything (labels and separators
 * included) and never scrolls.
 */
export const MENU_VISIBLE_ITEMS = 4

const textOf = (node: React.ReactNode): string => {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

type IsItem = (element: React.ReactElement) => boolean

/**
 * Whether an element is of the given component. By identity, or by display name
 * when hot reload has swapped the component for a fresh copy: identity alone
 * would count no items and drop the search field until a full reload.
 */
export const isElementOf = (component: { displayName?: string }) => (element: React.ReactElement) =>
  element.type === component ||
  (!!component.displayName && (element.type as { displayName?: string }).displayName === component.displayName)

/** How many items the menu holds, looking through groups. */
export function countMenuItems(children: React.ReactNode, isItem: IsItem): number {
  let count = 0
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return
    count += isItem(child) ? 1 : countMenuItems(child.props.children, isItem)
  })
  return count
}

/** The items whose text contains the query, case-insensitive; labels and separators drop out. */
export function filterMenuItems(children: React.ReactNode, isItem: IsItem, query: string): React.ReactNode[] {
  const needle = query.trim().toLowerCase()
  const found: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return
    if (isItem(child)) {
      if (textOf(child.props.children).toLowerCase().includes(needle)) found.push(child)
    } else {
      found.push(...filterMenuItems(child.props.children, isItem, query))
    }
  })
  return found
}

interface MenuSearchProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

/**
 * The search field at the top of a long menu. Radix menus jump to an item on a
 * typed letter and move focus with it; here typing stays in the field, and only
 * the arrows, Escape and Tab reach the menu.
 */
export function MenuSearch({ value, onChange, label = 'Search' }: MenuSearchProps) {
  const ref = React.useRef<HTMLInputElement>(null)
  // The menu moves focus to its selected item as it opens; take it back after.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div data-slot="menu-search" className="relative mb-1.5">
      <Icon
        name="search"
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-icon-md text-muted-foreground"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        placeholder={label}
        aria-label={label}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (['ArrowDown', 'ArrowUp', 'Escape', 'Tab'].includes(event.key)) return
          event.stopPropagation()
        }}
        className="h-9 w-full rounded-xl bg-foreground/[0.06] pl-9 pr-3 text-caption text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 [&::-webkit-search-cancel-button]:hidden"
      />
    </div>
  )
}

export function MenuNoResults({ children = 'No results' }: { children?: React.ReactNode }) {
  return <p className="px-3 py-3 text-caption text-muted-foreground">{children}</p>
}

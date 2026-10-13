import * as React from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'
import { floatingSurface } from './popover'
import { ScrollArea } from './scroll-area'
import { MENU_VISIBLE_ITEMS, MenuNoResults, MenuSearch, countMenuItems, filterMenuItems, isElementOf } from './menu-search'

/**
 * A real menu (`role="menu"`): items, separators, labels, a destructive item.
 * Radix DropdownMenu underneath, so the arrow keys move between items,
 * typing jumps to one, Escape and a click outside close it, and focus goes
 * back to the trigger. For a panel of controls rather than a list of
 * actions, use `Popover`.
 */
const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger
const DropdownMenuGroup = MenuPrimitive.Group
const DropdownMenuPortal = MenuPrimitive.Portal

export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>

// Four items at 38 px (py-2 plus the caption line); the fifth is reached by scrolling.
const MENU_MAX_HEIGHT = 'max-h-[152px]'

const isMenuItem = (element: React.ReactElement) => isElementOf(DropdownMenuItem)(element)

/** The items, the search field above them past four, and the scroll area that shows four. */
function MenuBody({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = React.useState('')
  const searchable = countMenuItems(children, isMenuItem) > MENU_VISIBLE_ITEMS
  const searching = searchable && query.trim() !== ''
  const shown = searching ? filterMenuItems(children, isMenuItem, query) : children
  return (
    <>
      {searchable && <MenuSearch value={query} onChange={setQuery} />}
      <ScrollArea viewportClassName={searchable ? MENU_MAX_HEIGHT : undefined}>
        {shown}
        {searching && React.Children.count(shown) === 0 && <MenuNoResults />}
      </ScrollArea>
    </>
  )
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, children, sideOffset = 6, align = 'end', ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Content
      ref={ref}
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      align={align}
      className={cn(floatingSurface, 'min-w-44 p-1.5', className)}
      {...props}
    >
      <MenuBody>{children}</MenuBody>
    </MenuPrimitive.Content>
  </MenuPrimitive.Portal>
))
DropdownMenuContent.displayName = MenuPrimitive.Content.displayName

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  /** A destructive action (Revoke, Delete): danger text, and always the last group. */
  destructive?: boolean
  /** Leading glyph. */
  icon?: React.ReactNode
}

const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof MenuPrimitive.Item>, DropdownMenuItemProps>(
  ({ className, destructive = false, icon, children, ...props }, ref) => (
    <MenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      data-destructive={destructive || undefined}
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-caption font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        destructive
          ? 'text-danger-fg data-[highlighted]:bg-danger/10'
          : 'text-foreground data-[highlighted]:bg-secondary/15',
        className,
      )}
      {...props}
    >
      {icon && (
        <span aria-hidden="true" className="flex shrink-0 text-icon-md">
          {icon}
        </span>
      )}
      {children}
    </MenuPrimitive.Item>
  ),
)
DropdownMenuItem.displayName = MenuPrimitive.Item.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Label
    ref={ref}
    className={cn('px-3 pb-1 pt-2 text-muted-foreground', eyebrow, className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = MenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator ref={ref} className={cn('-mx-1.5 my-1.5 h-px bg-secondary/15', className)} {...props} />
))
DropdownMenuSeparator.displayName = MenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}

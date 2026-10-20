import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { IconGlyph } from './icon-glyph'
import { Check, ExpandMore } from '../icons/outlined'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'
import { ScrollArea } from './scroll-area'
import { MENU_VISIBLE_ITEMS, MenuNoResults, MenuSearch, countMenuItems, filterMenuItems, isElementOf } from './menu-search'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Compact pill style — matches the FilterDropdown button aesthetic. */
  compact?: boolean
  /** Hug the value instead of filling the width: the trigger is as wide as its content. */
  hug?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, compact = false, hug = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group flex items-center justify-between transition-all outline-none',
      compact
        ? [
            'w-auto gap-1 rounded-2xl bg-foreground/[0.09] px-2 py-1.5 text-caption leading-none shadow-raised backdrop-blur-md',
            'hover-gradient-violet data-[state=open]:bg-secondary/20 data-[state=open]:text-secondary-content',
          ]
        : [
            hug ? 'w-auto' : 'w-full',
            'gap-3 px-4 py-3 text-left text-body',
            fieldSurface,
            'data-[state=open]:ring-primary/50',
          ],
      'focus:ring-1 focus:ring-primary/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <IconGlyph
        glyph={ExpandMore}
        className={cn(
          'shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
          compact
            ? 'text-icon-xs text-foreground/55 group-data-[state=open]:text-secondary-content'
            : 'text-icon-lg text-muted-foreground group-hover:text-secondary-content group-data-[state=open]:text-secondary-content',
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// Four items at 51 px (py-3 plus the body line); the fifth is reached by scrolling.
const SELECT_MAX_HEIGHT = 'max-h-[204px]'

const isSelectItem = (element: React.ReactElement) => isElementOf(SelectItem)(element)

/**
 * The list, the search field above it when there are more than four items, and
 * the scroll area that shows four and scrolls the rest. Its own component so the
 * query starts empty each time the menu opens.
 */
function SelectBody({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = React.useState('')
  const searchable = countMenuItems(children, isSelectItem) > MENU_VISIBLE_ITEMS
  const searching = searchable && query.trim() !== ''
  const shown = searching ? filterMenuItems(children, isSelectItem, query) : children
  return (
    <>
      {searchable && <MenuSearch value={query} onChange={setQuery} />}
      {/* A long list reaches into the content's right padding (-mr-1.5) and pads
          its rows back (pr-1.5): the rows keep their width and the thumb runs in
          the gutter by the edge, clear of the rows and their selected ring. */}
      <ScrollArea
        className={searchable ? '-mr-1.5' : undefined}
        viewportClassName={searchable ? cn(SELECT_MAX_HEIGHT, 'pr-1.5') : undefined}
      >
        <SelectPrimitive.Viewport style={{ overflow: 'visible' }}>{shown}</SelectPrimitive.Viewport>
        {searching && React.Children.count(shown) === 0 && <MenuNoResults />}
      </ScrollArea>
    </>
  )
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative min-w-[8rem] overflow-hidden rounded-2xl bg-popover/95 bg-gradient-card p-2 shadow-popover backdrop-blur',
        'z-[var(--z-popover)]',
        position === 'popper' && 'w-max min-w-[var(--radix-select-trigger-width)]',
        className
      )}
      position={position}
      sideOffset={8}
      {...props}
    >
      <SelectBody>{children}</SelectBody>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-3 py-1.5 text-caption font-semibold text-secondary-content/80', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  description?: string
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer whitespace-nowrap select-none items-center justify-between rounded-xl px-3 py-3 text-body outline-none transition-colors',
      'data-[highlighted]:bg-secondary/15',
      'data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:ring-1 data-[state=checked]:ring-inset data-[state=checked]:ring-primary/40 data-[state=checked]:text-brand',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <div className="min-w-0">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {description && (
        <p className="mt-0.5 text-icon-xxs text-muted-foreground">{description}</p>
      )}
    </div>
    <SelectPrimitive.ItemIndicator>
      <IconGlyph glyph={Check} className="text-icon-md text-brand" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}

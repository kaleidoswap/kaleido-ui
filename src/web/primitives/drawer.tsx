import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { Icon } from './icon'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

// The desktop app's left sidebar, in its two forms.
//
//   * Desktop — `DrawerSidebar`: always on screen, pinned left, full height,
//     and folded by its own chevron between the labelled sidebar (w-72) and an
//     icon rail (w-20), exactly as the desktop app's is.
//   * Mobile — `Drawer` + `DrawerContent`: the same panel, expanded, over the
//     page, opened from a `DrawerTrigger` and closed by the chevron, Escape, the
//     overlay or choosing a destination. Radix Dialog underneath, so focus is
//     trapped and the title is announced.
//
// Both hold the same parts — `DrawerBody`, `DrawerSection`, `DrawerNavItem`,
// `DrawerFooter` — so one navigation list is written once and rendered in
// whichever form the width calls for.
//
// It is navigation only. A record opened from a list stays a `Dialog`.

interface DrawerContextValue {
  /** The icon rail: labels hidden, items centred. Desktop only. */
  collapsed: boolean
  /** Inside the mobile overlay, the way to close it: choosing a destination does. */
  close?: () => void
}

const DrawerContext = React.createContext<DrawerContextValue>({ collapsed: false })

// The mobile drawer's own open state, so an item can close it whatever the
// link's click handler did with the event.
const DrawerOpenContext = React.createContext<(() => void) | undefined>(undefined)

/** Whether the surrounding drawer is folded to its icon rail. */
export const useDrawerCollapsed = () => React.useContext(DrawerContext).collapsed

// The panel itself: surface-base, the rule on its right edge, the heavy shadow.
const panel = 'flex h-full flex-col border-r border-divider/30 bg-surface-base text-foreground shadow-2xl shadow-black/30'

// The sidebar's collapse button, which is also the mobile drawer's close.
const edgeButton =
  'shrink-0 rounded-lg p-3 text-content-secondary ring-1 ring-divider/10 transition-all duration-300 hover:scale-110 hover:bg-surface-overlay/50 hover:text-primary hover:ring-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100'

// The group label: the library's eyebrow, in the desktop sidebar's colour.
const sectionLabel = cn(eyebrow, 'text-content-tertiary')

// ── Desktop ────────────────────────────────────────────────────────────────

export interface DrawerSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Folded to the icon rail. Controlled: the consumer keeps it, and usually persists it. */
  collapsed?: boolean
  /** Called by the chevron. Leave it out and the sidebar has no collapse control. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** The header's leading slot — a logo or a lockup. Hidden on the rail, as the desktop app's is. */
  header?: React.ReactNode
  /** Accessible names for the chevron, in either state. */
  collapseLabel?: string
  expandLabel?: string
}

const DrawerSidebar = React.forwardRef<HTMLElement, DrawerSidebarProps>(
  (
    {
      className,
      children,
      collapsed = false,
      onCollapsedChange,
      header,
      collapseLabel = 'Collapse sidebar',
      expandLabel = 'Expand sidebar',
      ...props
    },
    ref
  ) => (
    <aside
      ref={ref}
      data-state={collapsed ? 'collapsed' : 'expanded'}
      className={cn(
        panel,
        // Sticky rather than fixed, so the page beside it needs no margin
        // kept in step with its width.
        'sticky top-0 h-screen shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
        collapsed ? 'w-20' : 'w-72',
        className
      )}
      {...props}
    >
      {(header || onCollapsedChange) && (
        <div className={cn('flex items-center px-4 py-5', collapsed ? 'justify-center' : 'justify-between gap-3')}>
          {!collapsed && header && <div className="min-w-0 flex-1">{header}</div>}
          {onCollapsedChange && (
            <button
              type="button"
              aria-expanded={!collapsed}
              aria-label={collapsed ? expandLabel : collapseLabel}
              className={edgeButton}
              onClick={() => onCollapsedChange(!collapsed)}
            >
              <Icon name={collapsed ? 'chevron_right' : 'chevron_left'} className="text-icon-lg" />
            </button>
          )}
        </div>
      )}
      <DrawerContext.Provider value={{ collapsed }}>{children}</DrawerContext.Provider>
    </aside>
  )
)
DrawerSidebar.displayName = 'DrawerSidebar'

// ── Mobile ─────────────────────────────────────────────────────────────────

/**
 * The mobile drawer's root: Radix Dialog's, controlled or not, with the same
 * `open` / `defaultOpen` / `onOpenChange`.
 */
const Drawer = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolled
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )
  const close = React.useCallback(() => setOpen(false), [setOpen])
  return (
    <DrawerOpenContext.Provider value={close}>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DrawerOpenContext.Provider>
  )
}
Drawer.displayName = 'Drawer'
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerPortal = DialogPrimitive.Portal
const DrawerClose = DialogPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-lg data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out motion-reduce:animate-none',
      className
    )}
    {...props}
  />
))
DrawerOverlay.displayName = 'DrawerOverlay'

export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** The header's leading slot, as on `DrawerSidebar`. `DrawerTitle` is the usual one. */
  header?: React.ReactNode
  /**
   * The chevron that closes the drawer. On by default; turn it off only where
   * the drawer closes through its own explicit action.
   */
  showClose?: boolean
  closeLabel?: string
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, header, showClose = true, closeLabel = 'Close navigation', ...props }, ref) => {
  const close = React.useContext(DrawerOpenContext)
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          panel,
          // The expanded sidebar's width, never more than 85% of the viewport so
          // a strip of the page stays visible to tap away.
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] focus:outline-none data-[state=open]:animate-drawer-in-left data-[state=closed]:animate-drawer-out-left motion-reduce:animate-none',
          className
        )}
        {...props}
      >
        {(header || showClose) && (
          <div className="flex items-center justify-between gap-3 px-4 py-5">
            <div className="min-w-0 flex-1">{header}</div>
            {showClose && (
              <DialogPrimitive.Close aria-label={closeLabel} className={edgeButton}>
                <Icon name="chevron_left" className="text-icon-lg" />
              </DialogPrimitive.Close>
            )}
          </div>
        )}
        <DrawerContext.Provider value={{ collapsed: false, close }}>{children}</DrawerContext.Provider>
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
})
DrawerContent.displayName = 'DrawerContent'

/** The mobile drawer's name. Required by Radix; make it `sr-only` where a logo already says it. */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('px-4', sectionLabel, className)} {...props} />
))
DrawerTitle.displayName = 'DrawerTitle'

/** Announced with the title. Visually hidden by default: the list says what the drawer holds. */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('sr-only', className)} {...props} />
))
DrawerDescription.displayName = 'DrawerDescription'

// ── Shared parts ───────────────────────────────────────────────────────────

/** The scrolling list between the header and the footer. */
const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 pt-4', className)} {...props} />
)
DrawerBody.displayName = 'DrawerBody'

export interface DrawerSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The group's eyebrow. On the rail, groups after the first are split by a rule instead. */
  label?: React.ReactNode
}

const DrawerSection = ({ className, label, children, ...props }: DrawerSectionProps) => {
  const { collapsed } = React.useContext(DrawerContext)
  return (
    <div className={cn('group/section [&+&]:mt-6', className)} {...props}>
      {collapsed ? (
        <div role="separator" className="mx-2 my-3 border-t border-divider/20 group-first/section:hidden" />
      ) : (
        label && <div className={cn('mb-2 px-4', sectionLabel)}>{label}</div>
      )}
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}
DrawerSection.displayName = 'DrawerSection'

export interface DrawerNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode
  label: React.ReactNode
  /** The current destination: marked, and announced as the current page. */
  active?: boolean
  /**
   * Render the consumer's link instead (`<NavLink>`, `<Link>`), as `Button`
   * does. Pass it as the only child, with no children of its own.
   */
  asChild?: boolean
}

const DrawerNavItem = React.forwardRef<HTMLAnchorElement, DrawerNavItemProps>(
  ({ className, icon, label, active = false, asChild = false, children, title, onClick, ...props }, ref) => {
    const { collapsed, close } = React.useContext(DrawerContext)
    const content = (
      <>
        {icon && (
          <span
            aria-hidden="true"
            className="flex shrink-0 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
          >
            {icon}
          </span>
        )}
        {/* On the rail the label stays for assistive tech and becomes the tooltip. */}
        <span className={cn('truncate text-body font-semibold', collapsed && 'sr-only')}>{label}</span>
      </>
    )
    const itemProps = {
      ref,
      'aria-current': active ? ('page' as const) : undefined,
      title: title ?? (collapsed && typeof label === 'string' ? label : undefined),
      className: cn(
        'group flex min-w-0 items-center rounded-xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100',
        collapsed ? 'justify-center' : 'gap-4',
        active
          ? 'border-l-2 border-status-success/60 bg-status-success/10 font-semibold text-status-success shadow-lg shadow-status-success/5'
          : 'text-content-secondary hover:bg-surface-overlay/80 hover:text-foreground hover:shadow-md',
        className
      ),
      // In the mobile drawer, choosing a destination is the end of the errand
      // -- even when the link prevents the default, as a router link does.
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        close?.()
      },
      ...props,
    }
    // The consumer's link keeps its own props and gets the item's look and content.
    const item =
      asChild && React.isValidElement(children) ? (
        <Slot {...itemProps}>{React.cloneElement(children as React.ReactElement, undefined, content)}</Slot>
      ) : (
        <a {...itemProps}>{content}</a>
      )
    return item
  }
)
DrawerNavItem.displayName = 'DrawerNavItem'

/** Below the list, kept on screen while it scrolls: quick actions, the version. */
const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-4 pb-4 pt-6', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerSidebar,
  DrawerBody,
  DrawerSection,
  DrawerNavItem,
  DrawerFooter,
}

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Avatar } from '../primitives/avatar'
import { Button } from '../primitives/button'
import { floatingSurface } from '../primitives/popover'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

const AccountMenuContext = React.createContext<() => void>(() => {})

export interface AccountMenuProps {
  /** Who is signed in, as the trigger shows it: an email, a name. */
  name: string
  /** One quieter line under it: the organization. */
  secondary?: React.ReactNode
  /**
   * The trigger's accessible name. Below `sm` the trigger is the avatar
   * alone, so this carries everything it stands for: "Account: alex@example.com, Owner, Example Co".
   */
  label: string
  /** Replaces the default initials avatar. */
  avatar?: React.ReactNode
  /** The panel's top section: the identity in full, the role, an id to copy. */
  header?: React.ReactNode
  /** Under the identity, across the panel's full width, left-aligned with the avatar: the organization and its id. */
  details?: React.ReactNode
  /** Top right of the panel, level with the name: the role. */
  badge?: React.ReactNode
  /** `AccountMenuItem`s and `AccountMenuSeparator`s. */
  children?: React.ReactNode
  /** Which edge of the trigger the panel lines up with. `end` (default) suits the top bar's right end; `start` a menu at the left of its container. */
  align?: 'start' | 'end'
  className?: string
}

const initialsOf = (name: string) => (name.trim()[0] ?? '?').toUpperCase()

/**
 * Who is signed in, behind one control at the end of the top bar: the avatar,
 * the name and one secondary line as the trigger; the identity in full and
 * the account's entries (Settings, then Log out under a rule) in a panel
 * aligned to its right edge.
 *
 * A disclosure, not a WAI-ARIA `menu`: the panel may hold an id with its copy
 * button, which is not a menu item, and the arrow keys of a menu would skip
 * it. So Tab walks everything in order, Escape closes the panel and returns
 * focus to the trigger, and a click outside or focus leaving closes it. For a
 * list of actions alone, use `DropdownMenu`.
 */
export function AccountMenu({ name, secondary, label, avatar, header, details, badge, children, align = 'end', className }: AccountMenuProps) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const panelId = React.useId()

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = React.useCallback(() => setOpen(false), [])
  const triggerAvatar = avatar ?? <Avatar size="sm" initials={initialsOf(name)} />
  const panelAvatar = avatar ?? <Avatar size="lg" className="size-12 text-body" initials={initialsOf(name)} />

  return (
    <div
      ref={rootRef}
      data-slot="account-menu"
      className={cn('relative', className)}
      // Focus moving to another control closes the panel. Focus moving to
      // nothing does not: a click on the panel's own text does that.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null
        if (next && !rootRef.current?.contains(next)) setOpen(false)
      }}
    >
      <Button
        ref={triggerRef}
        type="button"
        variant="surface"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((next) => !next)}
        // Closed, the trigger is a card that hugs its content: avatar, name,
        // chevron. A long name truncates at the max width.
        className="group h-auto max-w-72 gap-3 px-3 py-2"
      >
        {triggerAvatar}
        <span className="hidden min-w-0 flex-1 flex-col gap-0.5 text-left sm:flex">
          <span className="truncate text-body font-semibold leading-tight text-foreground">{name}</span>
          {secondary && <span className="truncate text-mini font-normal leading-tight text-muted-foreground">{secondary}</span>}
        </span>
        <Icon
          name="expand_more"
          className={cn(
            'hidden shrink-0 text-icon-md text-muted-foreground transition-transform motion-reduce:transition-none sm:block',
            open && 'rotate-180'
          )}
        />
      </Button>

      {open && (
        <div
          id={panelId}
          // The same surface as Popover and DropdownMenu: opaque, the floating light and shadow.
          className={cn(
            floatingSurface,
            'absolute top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden p-2 animate-fade-in',
            align === 'start' ? 'left-0' : 'right-0',
          )}
        >
          {/* Identity first: the avatar beside who and what they are, then `details` across the full width, and one rule under both. */}
          <div className="relative mx-2 mb-2 border-b border-divider/40 pb-3 pt-2">
            <div className="flex items-center gap-3">
              {panelAvatar}
              <div className="min-w-0 flex-1">{header ?? <div className="truncate text-body font-semibold">{name}</div>}</div>
              {badge && <div className="absolute right-0 top-2">{badge}</div>}
            </div>
            {details && <div className="mt-3">{details}</div>}
          </div>
          <AccountMenuContext.Provider value={close}>
            <div className="space-y-0.5">{children}</div>
          </AccountMenuContext.Provider>
        </div>
      )}
    </div>
  )
}

export interface AccountMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  /** Log out, Delete account: red, and kept last. */
  destructive?: boolean
  /** Render the consumer's link instead (`<NavLink>`), as `Button` does. */
  asChild?: boolean
}

/** One entry of the account panel. Choosing it closes the panel. */
export const AccountMenuItem = React.forwardRef<HTMLButtonElement, AccountMenuItemProps>(
  ({ icon, destructive = false, asChild = false, className, children, onClick, ...props }, ref) => {
    const close = React.useContext(AccountMenuContext)
    const iconNode = icon && (
      <span aria-hidden="true" className={cn('flex shrink-0', destructive ? 'text-danger-fg' : 'text-brand')}>
        {icon}
      </span>
    )
    const itemProps = {
      className: cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-caption font-medium transition-colors focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
        destructive ? 'text-danger-fg hover:bg-danger/10' : 'text-foreground hover:bg-primary/10',
        className
      ),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        close()
      },
      ...props,
    }
    // The consumer's link keeps its own props and gets the item's look, with
    // the icon before its text.
    if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
      return (
        <Slot ref={ref} {...itemProps}>
          {React.cloneElement(children, undefined, (
            <>
              {iconNode}
              {children.props.children}
            </>
          ))}
        </Slot>
      )
    }
    return (
      <button ref={ref} type="button" {...itemProps}>
        {iconNode}
        {children}
      </button>
    )
  }
)
AccountMenuItem.displayName = 'AccountMenuItem'

/** The rule between the account's entries and Log out. */
export function AccountMenuSeparator() {
  return <div role="separator" className="mx-2 my-1 border-t border-divider/40" />
}

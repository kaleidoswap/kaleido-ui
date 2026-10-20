import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Avatar } from '../primitives/avatar'
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
  /** `AccountMenuItem`s and `AccountMenuSeparator`s. */
  children?: React.ReactNode
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
export function AccountMenu({ name, secondary, label, avatar, header, children, className }: AccountMenuProps) {
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
  const avatarNode = (size: 'sm' | 'lg') => avatar ?? <Avatar size={size} initials={initialsOf(name)} />

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
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((next) => !next)}
        className="group flex items-center gap-2 rounded-xl p-1.5 text-foreground transition-colors duration-300 hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-2"
      >
        {avatarNode('sm')}
        <span className="hidden min-w-0 flex-col text-left sm:flex">
          <span className="max-w-[14rem] truncate text-caption font-medium">{name}</span>
          {secondary && <span className="max-w-[14rem] truncate text-mini text-muted-foreground">{secondary}</span>}
        </span>
        <Icon
          name="expand_more"
          className={cn(
            'hidden text-icon-md text-muted-foreground transition-transform motion-reduce:transition-none sm:block',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-popover animate-fade-in motion-reduce:animate-none"
        >
          <div className="bg-foreground/[0.03] p-3">
            <div className="flex items-center gap-3">
              {avatarNode('lg')}
              <div className="min-w-0 flex-1">{header ?? <div className="truncate text-caption font-medium">{name}</div>}</div>
            </div>
          </div>
          <AccountMenuContext.Provider value={close}>
            <div className="py-1">{children}</div>
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
        'flex w-full items-center gap-3 px-4 py-3 text-left text-caption font-medium transition-colors focus-visible:bg-foreground/[0.06] focus-visible:outline-none',
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
  return <div role="separator" className="my-1 border-t border-divider/40" />
}

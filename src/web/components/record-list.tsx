import * as React from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'
import { IconButton } from '../primitives/icon-button'

// The stacked form of a table row, for narrow screens: the same data as the
// row, laid out as a card. A `Table` on the desktop and a `RecordList` below
// `sm` show the same records, never a subset.

export interface RecordListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Required: a list of records needs a name ("Swaps"). */
  'aria-label': string
}

/** A `<ul>` of records, each a soft row of its own. */
const RecordList = React.forwardRef<HTMLUListElement, RecordListProps>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="record-list"
    className={cn('m-0 list-none space-y-2 p-0', className)}
    {...props}
  />
))
RecordList.displayName = 'RecordList'

export interface RecordItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** The record's id or name, top left. */
  identifier: React.ReactNode
  /** Its state, top right (a `ToneBadge`, a `StatusBadge`). */
  status?: React.ReactNode
  /** One line under the identifier. */
  summary?: React.ReactNode
  /** `RecordField`s, in a two-column grid. */
  children?: React.ReactNode
  /** Buttons at the bottom right. They do not open the record. */
  actions?: React.ReactNode
  /**
   * Opens the record. The whole item becomes clickable, and an explicit
   * chevron button is added — a clickable `<li>` is not reachable by keyboard.
   */
  onOpen?: () => void
  /** Names the open button: "Open {openLabel}". Defaults to "record". */
  openLabel?: string
  /** The record open elsewhere on the page: highlighted, and `aria-current`. */
  selected?: boolean
}

const RecordItem = React.forwardRef<HTMLLIElement, RecordItemProps>(
  ({ identifier, status, summary, children, actions, onOpen, openLabel = 'record', selected = false, className, ...props }, ref) => {
    const stop = (event: React.MouseEvent) => event.stopPropagation()
    return (
      <li
        ref={ref}
        data-slot="record-item"
        aria-current={selected ? 'true' : undefined}
        onClick={onOpen}
        className={cn(
          'space-y-3 rounded-xl kui-well px-4 py-3 transition-all duration-200',
          onOpen && 'cursor-pointer shadow-raised hover-gradient-violet',
          selected && 'bg-primary/10 bg-gradient-active shadow-glow-primary-soft ring-1 ring-inset ring-primary/40 hover:bg-primary/10',
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className={cn('truncate text-body font-semibold', selected ? 'text-brand' : 'text-foreground')}>{identifier}</div>
            {summary && <div className="mt-0.5 text-caption text-muted-foreground">{summary}</div>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {status}
            {onOpen && (
              <IconButton
                icon="chevron_right"
                label={`Open ${openLabel}`}
                size="sm"
                onClick={(event) => {
                  stop(event)
                  onOpen()
                }}
              />
            )}
          </div>
        </div>
        {children && <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2">{children}</dl>}
        {actions && (
          <div className="mt-3 flex justify-start gap-2" onClick={stop}>
            {actions}
          </div>
        )}
      </li>
    )
  },
)
RecordItem.displayName = 'RecordItem'

export interface RecordFieldProps {
  label: React.ReactNode
  children: React.ReactNode
  /** Span both columns: a long value, an address. */
  wide?: boolean
  className?: string
}

/** A label (`<dt>`) and its value (`<dd>`) in a record's grid. */
function RecordField({ label, children, wide = false, className }: RecordFieldProps) {
  return (
    <div data-slot="record-field" className={cn('min-w-0', wide && 'col-span-2', className)}>
      <dt className={cn('text-muted-foreground', eyebrow)}>{label}</dt>
      <dd className="m-0 mt-0.5 break-words text-caption text-foreground">{children}</dd>
    </div>
  )
}

export { RecordList, RecordItem, RecordField }

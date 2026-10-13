import * as React from 'react'
import { cn } from '../utils/cn'
import { HorizontalScrollArea } from './scroll-area'
import { Button } from './button'
import { Icon } from './icon'
import { eyebrow } from '../utils/type-roles'

/**
 * A dense data table: many columns, many rows, read across.
 *
 * With `showRowCount` the table states, under the grid, how many rows it shows
 * out of how many exist ("3 of 120 rows", with `totalRowCount`).
 *
 * `ActivityList` is a transaction feed — one amount, one direction, one
 * timestamp — and bending it into a nine-column grid loses the columns. This is
 * the primitive for the grid, on a desk surface (partner panel, admin panel),
 * not a phone one.
 *
 * - The table scrolls horizontally inside its own wrapper and never widens the
 *   page: the wrapper is `min-w-0`, so it does not hold a grid or flex column
 *   open at the table's min-content width.
 * - Cells are `caption` (13 px) at `px-4 py-3`. A grid is scanned, not read, and
 *   at 15 px a grid as wide as a swaps table scrolls where 13 px still fits;
 *   the 16 px inset lines the first column up with a card title padded `p-4`.
 * - Column heads are the eyebrow label in `muted-foreground`. Everything in the
 *   grid, heads and cells, is left-aligned. A head with `sortable` is a ghost
 *   `Button` with its sort icon inside (the click target is the label and its sort icon, nudged left by
 *   its own padding so the label still lines up with the cells below); pass
 *   `sortDirection` and `onSort` and the head sets `aria-sort` for you.
 * - Rows divide with a `border` hairline. That is the one exception to
 *   DESIGN.md's "separate by spacing, no dividers": across nine columns an eye
 *   cannot follow a row on whitespace alone. It does not extend to other
 *   components.
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * Show how many rows the table shows out of how many exist, under the grid
   * ("3 of 120 rows"). The shown count comes from the rows in `TableBody`, so
   * it follows filtering and paging without a prop to keep in sync.
   */
  showRowCount?: boolean
  /** How many rows exist, when the table shows a page or a filtered slice. Without it, everything is shown: "3 of 3 rows". */
  totalRowCount?: number
  /** The count's text; override to translate. */
  rowCountLabel?: (shown: number, total?: number) => string
}

// Always shown against what exists: "3 of 120 rows", and "3 of 3 rows" when
// the table holds everything, so the reader never wonders whether there is more.
const defaultRowCountLabel = (shown: number, total?: number) => {
  const of = total ?? shown
  return `${shown} of ${of} ${of === 1 ? 'row' : 'rows'}`
}

/** The rows in the table's body: the children of its `TableBody` elements. */
function countBodyRows(children: React.ReactNode): number {
  let count = 0
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return
    const type = child.type as { displayName?: string }
    if (child.type === TableBody || type.displayName === 'TableBody') {
      React.Children.forEach(child.props.children, (row) => {
        if (React.isValidElement(row)) count += 1
      })
    }
  })
  return count
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, showRowCount = false, totalRowCount, rowCountLabel = defaultRowCountLabel, ...props }, ref) => {
    const table = (
      <HorizontalScrollArea className="w-full" viewportProps={{ 'data-slot': 'table-scroll' }}>
        <table
          ref={ref}
          data-slot="table"
          className={cn('w-full caption-bottom border-collapse text-caption', className)}
          {...props}
        >
          {children}
        </table>
      </HorizontalScrollArea>
    )
    if (!showRowCount) return table
    return (
      <div data-slot="table-with-count" className="min-w-0">
        {table}
        {/* Outside the scroll area, so it stays put when the grid scrolls sideways;
            px-4 lines it up with the first column. Polite: a filter that changes
            the count is announced. */}
        <p data-slot="table-row-count" aria-live="polite" className="m-0 px-4 pt-3 text-caption text-muted-foreground tabular-nums">
          {rowCountLabel(countBodyRows(children), totalRowCount)}
        </p>
      </div>
    )
  },
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    data-slot="table-header"
    // A header row is not a data row: it keeps the hairline, not the hover.
    className={cn('[&_tr]:border-b [&_tr]:border-border [&_tr]:hover:bg-transparent', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    data-slot="table-body"
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    data-slot="table-footer"
    className={cn('border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        // Selected by `aria-selected="true"` (a selectable grid row) or
        // `data-state="selected"` (a row the consumer marks itself).
        'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted aria-selected:bg-muted',
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

export type SortDirection = 'asc' | 'desc' | 'none'

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Render the head as a ghost button with a sort icon. */
  sortable?: boolean
  /** The column's current order; `none` (default) shows the neutral up-down icon. */
  sortDirection?: SortDirection
  /** Called when the head button is pressed. The consumer owns the order. */
  onSort?: () => void
}

const ariaSort = { asc: 'ascending', desc: 'descending', none: 'none' } as const

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection = 'none', onSort, children, ...props }, ref) => {
    const sortIcon = sortDirection === 'asc' ? 'arrow_upward' : sortDirection === 'desc' ? 'arrow_downward' : 'swap_vert'
    return (
      <th
        ref={ref}
        data-slot="table-head"
        aria-sort={sortable ? ariaSort[sortDirection] : undefined}
        className={cn(
          'whitespace-nowrap px-4 py-3 text-left align-middle text-muted-foreground [&:has([role=checkbox])]:pr-0',
          eyebrow,
          className,
        )}
        {...props}
      >
        {sortable ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            data-slot="table-sort"
            onClick={onSort}
            className={cn(
              '-ml-2 uppercase tracking-eyebrow font-medium text-mini text-muted-foreground',
              sortDirection !== 'none' && 'text-foreground',
            )}
          >
            {children}
            <Icon name={sortIcon} size="sm" />
          </Button>
        ) : (
          children
        )}
      </th>
    )
  },
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    data-slot="table-cell"
    className={cn('px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    data-slot="table-caption"
    className={cn('mt-4 text-caption text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}

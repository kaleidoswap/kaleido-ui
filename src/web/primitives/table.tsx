import * as React from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

/**
 * A dense data table: many columns, many rows, read across.
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
 * - Column heads are the eyebrow label in `muted-foreground`.
 * - Rows divide with a `border` hairline. That is the one exception to
 *   DESIGN.md's "separate by spacing, no dividers": across nine columns an eye
 *   cannot follow a row on whitespace alone. It does not extend to other
 *   components.
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div data-slot="table-scroll" className="relative w-full min-w-0 overflow-x-auto">
      <table
        ref={ref}
        data-slot="table"
        className={cn('w-full caption-bottom border-collapse text-caption', className)}
        {...props}
      />
    </div>
  ),
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
        'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    data-slot="table-head"
    className={cn(
      'whitespace-nowrap px-4 py-3 text-left align-middle text-muted-foreground [&:has([role=checkbox])]:pr-0',
      eyebrow,
      className,
    )}
    {...props}
  />
))
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

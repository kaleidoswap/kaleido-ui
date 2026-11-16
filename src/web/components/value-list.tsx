import { BasicCollapsible } from './basic-collapsible'
import { CopyButton } from './copy-button'
import { cn } from '../utils/cn'

export interface ValueListProps {
  values: readonly string[]
  /** One value: "address". */
  singular: string
  /** Several: "addresses". */
  plural: string
  /** Shown when there are none. */
  emptyLabel?: string
  defaultOpen?: boolean
  className?: string
}

/**
 * A list of strings inside a table cell, never truncated. Closed, it is one
 * button: "3 addresses". Open, one value per line — monospaced, selectable,
 * each with its own copy button. The disclosure is the `BasicCollapsible`
 * row in the box it is shown in: the inset surface, since the row draws none.
 */
export function ValueList({ values, singular, plural, emptyLabel = 'None', defaultOpen = false, className }: ValueListProps) {
  if (values.length === 0) {
    return <span className={cn('text-caption text-muted-foreground', className)}>{emptyLabel}</span>
  }
  const summary = `${values.length} ${values.length === 1 ? singular : plural}`
  return (
    <div data-slot="value-list" className={cn('min-w-0 rounded-xl bg-surface-inset/40 p-2 shadow-raised', className)}>
      <BasicCollapsible title={summary} defaultOpen={defaultOpen}>
        <ul className="m-0 list-none space-y-1.5 p-0">
          {values.map((value, index) => (
            <li key={`${index}-${value}`} className="flex items-center gap-1 rounded-xl kui-well px-3 py-1.5">
              <span className="min-w-0 select-all break-all font-mono text-caption text-foreground">{value}</span>
              <CopyButton value={value} label={singular} />
            </li>
          ))}
        </ul>
      </BasicCollapsible>
    </div>
  )
}

import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../primitives/collapsible'
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
 * each with its own copy button.
 */
export function ValueList({ values, singular, plural, emptyLabel = 'None', defaultOpen = false, className }: ValueListProps) {
  if (values.length === 0) {
    return <span className={cn('text-caption text-muted-foreground', className)}>{emptyLabel}</span>
  }
  const summary = `${values.length} ${values.length === 1 ? singular : plural}`
  return (
    <Collapsible defaultOpen={defaultOpen} data-slot="value-list" className={cn('min-w-0', className)}>
      <CollapsibleTrigger
        type="button"
        className="inline-flex items-center gap-1 rounded-lg text-caption font-semibold text-foreground transition-colors hover:text-secondary-content data-[state=open]:text-secondary-content"
      >
        {summary}
        <CollapsibleChevron />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="m-0 mt-2 list-none space-y-1 p-0">
          {values.map((value, index) => (
            <li key={`${index}-${value}`} className="flex items-center gap-1 rounded-xl bg-muted/40 px-3 py-1.5">
              <span className="min-w-0 select-all break-all font-mono text-caption text-foreground">{value}</span>
              <CopyButton value={value} label={singular} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

import type { ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { cn } from '../utils/cn'

export interface CopyableProps {
  /** The full value: what the clipboard gets, and the tooltip. */
  value: string
  /** What is copied, for the button's name: "transaction id". */
  label: string
  /**
   * What is shown, when it is not the whole value — a truncated id. The
   * clipboard always gets `value`.
   */
  children?: ReactNode
  /** Monospace for ids, hashes and keys. On by default. */
  mono?: boolean
  /**
   * Show the whole value, breaking it across lines, instead of truncating it
   * to one: for a value read in full (an address, an organization id) rather
   * than recognised by its start in a dense row.
   */
  wrap?: boolean
  className?: string
}

/**
 * A value and its copy button. The text stays selectable (`select-all`, so
 * one click selects it all for a manual copy) and carries the full value as
 * its `title`, so a shortened display never hides what will be copied.
 */
export function Copyable({ value, label, children, mono = true, wrap = false, className }: CopyableProps) {
  return (
    <span data-slot="copyable" className={cn('inline-flex min-w-0 max-w-full items-center gap-1', className)}>
      <span
        title={value}
        className={cn('min-w-0 select-all text-foreground', wrap ? 'break-all' : 'truncate', mono && 'font-mono text-caption')}
      >
        {children ?? value}
      </span>
      <CopyButton value={value} label={label} />
    </span>
  )
}

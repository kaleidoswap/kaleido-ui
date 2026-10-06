import type { ReactNode } from 'react'
import { CopyButton } from './copy-button'
import { DottedLeader } from './dotted-leader'
import { eyebrow } from '../utils/type-roles'
import { cn } from '../utils/cn'
import { IconButton } from '../primitives/icon-button'

export interface ActivityDetailRowProps {
  label: string
  value: ReactNode
  fullValue?: string
  /**
   * The row copies this itself, with a `CopyButton` that reports failure.
   * Prefer it to `onCopy`; when both are given, `onCopy` wins.
   */
  copyValue?: string
  /** Kept for compatibility: the consumer copies and drives `isCopied` itself. */
  onCopy?: () => void
  isCopied?: boolean
}

export function ActivityDetailRow({
  label,
  value,
  fullValue,
  copyValue,
  onCopy,
  isCopied,
}: ActivityDetailRowProps) {
  return (
    // min-h-8 equalizes text-only rows with taller value content (badges,
    // pills) so the label-to-label rhythm stays uniform down the list.
    <div className="flex min-h-8 items-center gap-3 py-1 last:pb-0">
      <span className={cn('shrink-0 text-muted-foreground', eyebrow)}>
        {label}
      </span>
      <DottedLeader />
      <div className="flex max-w-[65%] items-center gap-2">
        <span className="truncate font-mono text-caption font-medium text-foreground/90">{value}</span>
        {onCopy && (
          <IconButton
            icon={isCopied ? 'check' : 'content_copy'}
            label={`Copy ${label.toLowerCase()}`}
            title={fullValue ? `Copy: ${fullValue}` : 'Copy'}
            size="sm"
            variant="surface"
            className="-my-1"
            onClick={(event) => {
              event.stopPropagation()
              onCopy()
            }}
          />
        )}
        {!onCopy && copyValue !== undefined && <CopyButton value={copyValue} label={label.toLowerCase()} variant="surface" />}
      </div>
    </div>
  )
}

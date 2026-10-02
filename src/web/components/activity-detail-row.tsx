import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { CopyButton } from './copy-button'

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
      <span className="shrink-0 text-mini font-bold uppercase tracking-eyebrow text-muted-foreground">
        {label}
      </span>
      {/* Dotted leader tying each label to its value across the row gap. */}
      <span aria-hidden className="min-w-4 flex-1 self-center border-b border-dotted border-white/15" />
      <div className="flex max-w-[65%] items-center gap-2">
        <span className="truncate font-mono text-caption font-medium text-white/90">{value}</span>
        {onCopy && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onCopy()
            }}
            className="-my-1 rounded-md p-1 text-white/30 transition-colors hover:bg-accent hover:text-primary active:scale-95"
            title={fullValue ? `Copy: ${fullValue}` : 'Copy'}
          >
            {/* Inline SVG rather than a Material Symbols ligature -- see
                status-badge.tsx. Icon sizes off 1em, so fontSize still drives it. */}
            <Icon name={isCopied ? 'check' : 'content_copy'} style={{ fontSize: '14px' }} />
          </button>
        )}
        {!onCopy && copyValue !== undefined && <CopyButton value={copyValue} label={label.toLowerCase()} />}
      </div>
    </div>
  )
}

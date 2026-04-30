import type { ReactNode } from 'react'

export interface ActivityDetailRowProps {
  label: string
  value: ReactNode
  fullValue?: string
  onCopy?: () => void
  isCopied?: boolean
}

export function ActivityDetailRow({
  label,
  value,
  fullValue,
  onCopy,
  isCopied,
}: ActivityDetailRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1 last:border-0 last:pb-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex max-w-[65%] items-center gap-2">
        <span className="truncate font-mono text-xs font-medium text-white/90">{value}</span>
        {onCopy && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onCopy()
            }}
            className="rounded-md p-1 text-white/30 transition-colors hover:bg-accent hover:text-primary active:scale-95"
            title={fullValue ? `Copy: ${fullValue}` : 'Copy'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              {isCopied ? 'check' : 'content_copy'}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

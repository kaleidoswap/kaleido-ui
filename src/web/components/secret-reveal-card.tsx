import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface SecretRevealCardProps {
  value: ReactNode
  revealed: boolean
  onRevealChange: (revealed: boolean) => void
  onCopy?: () => void
  revealLabel?: string
  hideLabel?: string
  copyLabel?: string
  className?: string
  valueClassName?: string
}

export function SecretRevealCard({
  value,
  revealed,
  onRevealChange,
  onCopy,
  revealLabel = 'Tap to reveal',
  hideLabel = 'Hide',
  copyLabel = 'Copy',
  className,
  valueClassName,
}: SecretRevealCardProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <div className="rounded-xl bg-card px-3 py-3">
          <p
            className={cn(
              'break-all font-mono text-sm text-foreground transition-all duration-300',
              !revealed && 'pointer-events-none select-none blur-sm',
              valueClassName,
            )}
          >
            {value}
          </p>
        </div>
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onRevealChange(true)}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-card px-4 py-2 text-sm font-bold text-foreground shadow-lg transition-all hover:bg-accent"
            >
              <Icon name="visibility" className="text-icon-lg" />
              {revealLabel}
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRevealChange(!revealed)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
        >
          <Icon name={revealed ? 'visibility_off' : 'visibility'} className="text-icon-lg" />
          {revealed ? hideLabel : revealLabel}
        </button>
        {revealed && onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <Icon name="content_copy" className="text-icon-lg" />
            {copyLabel}
          </button>
        )}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'
import { COPY_FAILED_MESSAGE } from './copy-button'

export interface SecretRevealCardProps {
  value: ReactNode
  revealed: boolean
  onRevealChange: (revealed: boolean) => void
  /**
   * The card copies this itself once revealed, and says when the copy failed.
   * Prefer it to `onCopy`; when both are given, `onCopy` wins.
   */
  copyValue?: string
  /** Shown instead of `copyLabel` after a successful copy. */
  copiedLabel?: string
  /** Shown, as an alert, when the copy failed. */
  copyFailedMessage?: string
  /** Kept for compatibility: the consumer copies. */
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
  copyValue,
  copiedLabel = 'Copied',
  copyFailedMessage = COPY_FAILED_MESSAGE,
  onCopy,
  revealLabel = 'Tap to reveal',
  hideLabel = 'Hide',
  copyLabel = 'Copy',
  className,
  valueClassName,
}: SecretRevealCardProps) {
  const clipboard = useCopyToClipboard()
  const selfCopy = !onCopy && copyValue !== undefined
  const handleCopy = onCopy ?? (selfCopy ? () => void clipboard.copy(copyValue!) : undefined)
  const copied = selfCopy && clipboard.state === 'copied'
  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <div className="rounded-xl bg-card bg-gradient-card px-3 py-3 shadow-card">
          <p
            className={cn(
              'break-all font-mono text-body text-foreground transition-all duration-300',
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
              className="flex items-center gap-2 rounded-xl bg-secondary bg-gradient-violet px-4 py-2 text-body font-bold text-secondary-foreground shadow-button-violet transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-violet"
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary/15 py-3 text-caption font-semibold text-secondary-content shadow-raised ring-1 ring-inset ring-secondary/25 transition-all duration-200 hover:bg-secondary/25 hover:text-foreground"
        >
          <Icon name={revealed ? 'visibility_off' : 'visibility'} className="text-icon-lg" />
          {revealed ? hideLabel : revealLabel}
        </button>
        {revealed && handleCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary/15 py-3 text-caption font-semibold text-secondary-content shadow-raised ring-1 ring-inset ring-secondary/25 transition-all duration-200 hover:bg-secondary/25 hover:text-foreground',
              copied && 'bg-primary/10 bg-gradient-active text-brand ring-primary/40 shadow-glow-primary-soft hover:bg-primary/15 hover:text-brand',
            )}
          >
            <Icon name={copied ? 'check' : 'content_copy'} className="text-icon-lg" />
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>
      {selfCopy && clipboard.state === 'failed' && (
        <p role="alert" className="m-0 text-caption text-danger-fg">
          {copyFailedMessage}
        </p>
      )}
      {selfCopy && (
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ''}
        </span>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
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
        {/* The value sits in a read-only text field: the field surface, at rest. */}
        <div className="rounded-xl bg-card/55 bg-gradient-card px-3 py-3 shadow-inner ring-1 ring-inset ring-secondary/15 backdrop-blur-xl backdrop-saturate-150">
          <p
            className={cn(
              'break-all font-mono text-body text-foreground transition-all duration-300',
              // Hidden: blurred and faded, so the reveal button reads over it.
              !revealed && 'pointer-events-none select-none opacity-[var(--app-hidden-opacity)] blur-md',
              valueClassName,
            )}
          >
            {value}
          </p>
        </div>
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button type="button" variant="surface" size="sm" onClick={() => onRevealChange(true)}>
              <Icon name="visibility" className="text-icon-lg" />
              {revealLabel}
            </Button>
          </div>
        )}
      </div>
      {/* While hidden, the button over the value is the only way to reveal it. */}
      {revealed && (
        <div className="flex gap-2">
          <Button type="button" variant="surface" className="flex-1" onClick={() => onRevealChange(false)}>
            <Icon name="visibility_off" className="text-icon-lg" />
            {hideLabel}
          </Button>
          {handleCopy && (
            <Button
              type="button"
              variant="surface"
              onClick={handleCopy}
              className={cn('flex-1', copied && 'bg-primary/10 bg-gradient-active text-brand ring-primary/40 hover:ring-primary/50')}
            >
              <Icon name={copied ? 'check' : 'content_copy'} className="text-icon-lg" />
              {copied ? copiedLabel : copyLabel}
            </Button>
          )}
        </div>
      )}
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

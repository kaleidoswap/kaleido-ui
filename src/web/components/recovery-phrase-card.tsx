import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'
import { COPY_FAILED_MESSAGE } from './copy-button'

export interface RecoveryPhraseCardProps {
  words: string[]
  revealed?: boolean
  onRevealChange?: (revealed: boolean) => void
  /**
   * The card copies this itself (usually `words.join(' ')`) and says when the
   * copy failed. Prefer it to `onCopy`; when both are given, `onCopy` wins.
   */
  copyValue?: string
  copyLabel?: string
  copiedLabel?: string
  copyFailedMessage?: string
  /** Kept for compatibility: the consumer copies. */
  onCopy?: () => void
  title?: string
  emptyMessage?: string
  className?: string
}

export function RecoveryPhraseCard({
  words,
  revealed = false,
  onRevealChange,
  copyValue,
  copyLabel = 'Copy to clipboard',
  copiedLabel = 'Copied',
  copyFailedMessage = COPY_FAILED_MESSAGE,
  onCopy,
  title = 'Recovery Phrase',
  emptyMessage = 'Recovery phrase is not available yet.',
  className,
}: RecoveryPhraseCardProps) {
  const hasWords = words.length > 0
  const clipboard = useCopyToClipboard()
  const selfCopy = !onCopy && copyValue !== undefined
  const handleCopy = onCopy ?? (selfCopy ? () => void clipboard.copy(copyValue!) : undefined)
  const copied = selfCopy && clipboard.state === 'copied'

  return (
    <section className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between px-0.5">
        <p className="text-mini font-bold uppercase tracking-eyebrow text-muted-foreground">{title}</p>
        {hasWords && revealed && onRevealChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRevealChange(!revealed)}
            className="h-auto rounded-lg px-2 py-1 text-caption text-muted-foreground hover:bg-secondary/10 hover:text-secondary-content"
          >
            <Icon name="visibility_off" className="text-icon-md" />
            Hide
          </Button>
        )}
      </div>

      <div className="relative">
        {hasWords ? (
          <div
            className={cn(
              'grid grid-cols-3 gap-2 transition-all duration-300',
              !revealed && 'pointer-events-none select-none blur-sm',
            )}
          >
            {words.map((word, index) => (
              <div key={`${index}-${word}`} className="flex items-center gap-2 rounded-xl bg-card bg-gradient-card px-3 py-2.5 shadow-raised">
                <span className="w-4 shrink-0 text-caption font-bold text-secondary-content">
                  {index + 1}
                </span>
                <span className="font-mono text-body text-white">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-warning/10 px-4 py-3 text-body text-warning">
            {emptyMessage}
          </div>
        )}

        {hasWords && !revealed && onRevealChange && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="surface"
              size="sm"
              onClick={() => onRevealChange(true)}
            >
              <Icon name="visibility" className="text-icon-lg" />
              Tap to reveal
            </Button>
          </div>
        )}
      </div>

      {hasWords && revealed && handleCopy && (
        <Button
          type="button"
          variant="h3"
          size="lg"
          onClick={handleCopy}
          className={cn('w-full', copied && 'bg-primary/10 shadow-glow-primary-soft')}
        >
          <Icon name={copied ? 'check' : 'content_copy'} className="text-icon-lg" />
          {copied ? copiedLabel : copyLabel}
        </Button>
      )}
      {selfCopy && clipboard.state === 'failed' && (
        <p role="alert" className="m-0 text-caption text-danger">
          {copyFailedMessage}
        </p>
      )}
      {selfCopy && (
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ''}
        </span>
      )}
    </section>
  )
}

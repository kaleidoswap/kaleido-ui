import { Button } from '../primitives/button'
import { IconGlyph } from '../primitives/icon-glyph'
import { Check, ContentCopy, Visibility, VisibilityOff } from '../icons/outlined'
import { cn } from '../utils/cn'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'
import { COPY_FAILED_MESSAGE } from './copy-button'
import { eyebrow } from '../utils/type-roles'

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
  /** The reveal button's text. */
  revealLabel?: string
  /** The hide button's text. */
  hideLabel?: string
  /** Offer a Hide button once revealed. On by default. */
  hideable?: boolean
  /** Test id on the words grid. */
  secretTestId?: string
  className?: string
}

/** What stands in for a word until the phrase is revealed. */
const MASK = '••••••'

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
  revealLabel = 'Tap to reveal',
  hideLabel = 'Hide',
  hideable = true,
  secretTestId,
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
        <p className={cn('text-muted-foreground', eyebrow)}>{title}</p>
        {hasWords && revealed && hideable && onRevealChange && (
          <Button
            type="button"
            variant="surface"
            size="xs"
            onClick={() => onRevealChange(!revealed)}
          >
            <IconGlyph glyph={VisibilityOff} className="text-icon-md" />
            {hideLabel}
          </Button>
        )}
      </div>

      <div className="relative">
        {hasWords ? (
          <div
            data-testid={secretTestId}
            data-revealed={revealed}
            className={cn(
              'grid grid-cols-3 gap-2 transition-all duration-300',
              !revealed && 'pointer-events-none select-none blur-sm',
            )}
          >
            {/* Until revealed, each word is a mask: the phrase is not in the
                document, so nothing reading the page can lift it early. */}
            {words.map((word, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl bg-card bg-gradient-card px-3 py-2.5 shadow-raised">
                <span className="w-4 shrink-0 text-caption font-bold text-secondary-content">
                  {index + 1}
                </span>
                <span className="font-mono text-body text-foreground">{revealed ? word : MASK}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-warning/10 px-4 py-3 text-body text-warning-fg">
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
              <IconGlyph glyph={Visibility} className="text-icon-lg" />
              {revealLabel}
            </Button>
          </div>
        )}
      </div>

      {hasWords && revealed && handleCopy && (
        <Button
          type="button"
          variant="surface"
          size="lg"
          onClick={handleCopy}
          className={cn('w-full', copied && 'bg-primary/10 bg-gradient-active text-brand ring-primary/40 hover:ring-primary/50')}
        >
          <IconGlyph glyph={copied ? Check : ContentCopy} className="text-icon-lg" />
          {copied ? copiedLabel : copyLabel}
        </Button>
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
    </section>
  )
}

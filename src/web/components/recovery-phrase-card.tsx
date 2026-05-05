import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface RecoveryPhraseCardProps {
  words: string[]
  revealed?: boolean
  onRevealChange?: (revealed: boolean) => void
  onCopy?: () => void
  title?: string
  emptyMessage?: string
  className?: string
}

export function RecoveryPhraseCard({
  words,
  revealed = false,
  onRevealChange,
  onCopy,
  title = 'Recovery Phrase',
  emptyMessage = 'Recovery phrase is not available yet.',
  className,
}: RecoveryPhraseCardProps) {
  const hasWords = words.length > 0

  return (
    <section className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between px-0.5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
        {hasWords && revealed && onRevealChange && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRevealChange(!revealed)}
            className="h-auto rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-white"
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
              <div key={`${index}-${word}`} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2.5">
                <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="font-mono text-sm text-white">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
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

      {hasWords && revealed && onCopy && (
        <Button
          type="button"
          variant="h3"
          size="lg"
          onClick={onCopy}
          className="w-full"
        >
          <Icon name="content_copy" className="text-icon-lg" />
          Copy to clipboard
        </Button>
      )}
    </section>
  )
}

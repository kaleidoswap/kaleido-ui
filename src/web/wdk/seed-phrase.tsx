import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export type SeedPhraseMode = 'view' | 'edit' | 'loading'

export interface SeedPhraseProps {
  /** Array of seed words. In 'edit' mode each item is an editable input. */
  words: string[]
  mode?: SeedPhraseMode
  /** Called with the full updated word array when any word changes (edit mode) */
  onChange?: (words: string[]) => void
  /** When true, the words are blurred (privacy reveal guard) */
  isBlurred?: boolean
  /** Called when the user clicks the reveal button while isBlurred=true */
  onReveal?: () => void
  className?: string
}

function SkeletonWord() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
      <span className="w-5 shrink-0 text-center text-xxs font-bold text-muted-foreground">··</span>
      <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
    </div>
  )
}

export function SeedPhrase({
  words,
  mode = 'view',
  onChange,
  isBlurred = false,
  onReveal,
  className,
}: SeedPhraseProps) {
  const handleWordChange = (index: number, newWord: string) => {
    if (!onChange) return
    const updated = [...words]
    updated[index] = newWord.toLowerCase().trim()
    onChange(updated)
  }

  if (mode === 'loading') {
    return (
      <div className={cn('grid grid-cols-2 gap-2', className)}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonWord key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn('grid grid-cols-2 gap-2', isBlurred && 'pointer-events-none select-none')}>
        {words.map((word, index) => {
          const num = index + 1

          if (mode === 'edit') {
            return (
              <div
                key={index}
                className="flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20"
              >
                <span className="w-5 shrink-0 text-center text-xxs font-bold text-muted-foreground">
                  {num}
                </span>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={cn(
                    'min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/30 focus:outline-none',
                    isBlurred && 'blur-sm',
                  )}
                  placeholder="word"
                />
              </div>
            )
          }

          // view mode
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <span className="w-5 shrink-0 text-center text-xxs font-bold text-muted-foreground">
                {num}
              </span>
              <span
                className={cn(
                  'flex-1 text-sm font-semibold text-foreground transition-all',
                  isBlurred && 'blur-sm select-none',
                )}
              >
                {word || <span className="text-muted-foreground/60">———</span>}
              </span>
            </div>
          )
        })}
      </div>

      {/* blur overlay + reveal button */}
      {isBlurred && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/90 backdrop-blur-sm">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted">
            <span className="material-symbols-outlined text-[24px] text-muted-foreground">lock</span>
          </div>
          <p className="text-caption font-medium text-muted-foreground">
            Tap to reveal your recovery phrase
          </p>
          {onReveal && (
            <Button
              type="button"
              variant="outline"
              onClick={onReveal}
              className="mt-1 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
            >
              Reveal
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

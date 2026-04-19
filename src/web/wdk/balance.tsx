import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export type BalanceSize = 'sm' | 'md' | 'lg'

export interface BalanceProps {
  value: string | number
  ticker?: string
  isVisible?: boolean
  onToggleVisibility?: () => void
  isLoading?: boolean
  size?: BalanceSize
  className?: string
}

const sizeMap: Record<BalanceSize, { value: string; ticker: string }> = {
  sm: { value: 'text-title  font-bold', ticker: 'text-caption' },
  md: { value: 'text-headline font-bold', ticker: 'text-body' },
  lg: { value: 'text-display  font-bold', ticker: 'text-subhead' },
}

export function Balance({
  value,
  ticker,
  isVisible = true,
  onToggleVisibility,
  isLoading = false,
  size = 'md',
  className,
}: BalanceProps) {
  const s = sizeMap[size]

  const display = isVisible
    ? typeof value === 'number'
      ? value.toLocaleString()
      : value
    : '••••••'

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {isLoading ? (
        <div
          className={cn(
            'rounded-lg bg-muted animate-pulse',
            size === 'sm' && 'h-5 w-20',
            size === 'md' && 'h-7 w-28',
            size === 'lg' && 'h-9 w-36',
          )}
        />
      ) : (
        <span className={cn(s.value, 'tabular-nums text-foreground transition-all')}>
          {display}
        </span>
      )}

      {ticker && !isLoading && (
        <span className={cn(s.ticker, 'uppercase tracking-widest text-muted-foreground')}>
          {ticker}
        </span>
      )}

      {onToggleVisibility && !isLoading && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
          className="size-6 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={isVisible ? 'Hide balance' : 'Show balance'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isVisible ? 'visibility_off' : 'visibility'}
          </span>
        </Button>
      )}
    </div>
  )
}

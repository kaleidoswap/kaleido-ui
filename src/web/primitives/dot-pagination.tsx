import * as React from 'react'
import { cn } from '../utils/cn'

export type DotTone = 'primary' | 'warning'

export interface DotPaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  count: number
  index: number
  tone?: DotTone
  onSelect?: (index: number) => void
  ariaLabel?: string
}

const toneClasses: Record<DotTone, string> = {
  primary: 'bg-primary',
  warning: 'bg-warning',
}

const DotPagination = React.forwardRef<HTMLDivElement, DotPaginationProps>(
  ({ count, index, tone = 'primary', onSelect, ariaLabel, className, ...props }, ref) => {
    if (count <= 1) return null
    const interactive = typeof onSelect === 'function'

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel ?? 'Pagination'}
        className={cn('flex items-center justify-center gap-1.5', className)}
        {...props}
      >
        {Array.from({ length: count }).map((_, i) => {
          const active = i === index
          const dotClass = cn(
            'rounded-full transition-all duration-200',
            active ? cn('h-2 w-5 shadow-sm', toneClasses[tone]) : 'h-2 w-2 bg-white/25',
            interactive && 'cursor-pointer hover:bg-white/40',
          )
          const Tag = interactive ? 'button' : 'span'
          return (
            <Tag
              key={i}
              type={interactive ? 'button' : undefined}
              role="tab"
              aria-selected={active}
              aria-label={`Page ${i + 1} of ${count}`}
              onClick={interactive ? () => onSelect!(i) : undefined}
              className={dotClass}
            />
          )
        })}
      </div>
    )
  },
)
DotPagination.displayName = 'DotPagination'

export { DotPagination }

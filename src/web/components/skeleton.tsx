import { cn } from '../utils/cn'

export type SkeletonTone = 'primary' | 'secondary' | 'card'

export interface SkeletonProps {
  className?: string
  tone?: SkeletonTone
}

const toneClass: Record<SkeletonTone, string> = {
  primary: 'bg-white/10',
  secondary: 'bg-white/5',
  card: 'bg-white/[0.06]',
}

export function Skeleton({ className, tone = 'primary' }: SkeletonProps) {
  return <div aria-hidden className={cn('animate-pulse rounded', toneClass[tone], className)} />
}

export interface ListSkeletonRowsProps {
  rows?: number
  className?: string
  rowClassName?: string
}

export function ListSkeletonRows({ rows = 3, className, rowClassName }: ListSkeletonRowsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-3 rounded-2xl bg-white/[0.02] p-4 animate-pulse',
            rowClassName,
          )}
        >
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton tone="secondary" className="h-2.5 w-20" />
          </div>
          <div className="flex flex-col items-end space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton tone="secondary" className="h-2 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}

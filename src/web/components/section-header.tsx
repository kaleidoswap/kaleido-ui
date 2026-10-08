import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export interface SectionHeaderProps {
  children: ReactNode
  right?: ReactNode
  as?: 'h2' | 'h3' | 'p' | 'span'
  className?: string
}

export function SectionHeader({
  children,
  right,
  as: Tag = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-1', className)}>
      <Tag className={cn('text-muted-foreground', eyebrow)}>
        {children}
      </Tag>
      {right}
    </div>
  )
}

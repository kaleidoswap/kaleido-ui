import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn('text-xxs font-black uppercase tracking-eyebrow-wide text-muted-foreground', className)}
    >
      {children}
    </span>
  )
}

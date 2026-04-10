import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn('text-xxs font-black uppercase tracking-[0.22em] text-white/30', className)}>
      {children}
    </span>
  )
}

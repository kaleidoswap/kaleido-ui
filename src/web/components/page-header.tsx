import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface PageHeaderProps {
  left?: ReactNode
  title?: string
  right?: ReactNode
  className?: string
  /** Border class for network-aware styling (e.g. "border-network-bitcoin/30") */
  borderClassName?: string
}

export function PageHeader({ left, title, right, className, borderClassName = 'border-border' }: PageHeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur',
      borderClassName,
      className,
    )}>
      {title ? (
        <>
          <div className="flex min-w-0 flex-1 items-center">{left}</div>
          <span className="shrink-0 font-bold text-body text-foreground">{title}</span>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{right}</div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center">{left}</div>
          <div className="ml-auto flex min-w-0 items-center justify-end gap-2">{right}</div>
        </>
      )}
    </header>
  )
}

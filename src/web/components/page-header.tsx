import type { ReactNode } from 'react'

export interface PageHeaderProps {
  left?: ReactNode
  title?: string
  right?: ReactNode
  /** Border class for network-aware styling (e.g. "border-network-bitcoin/30") */
  borderClassName?: string
}

export function PageHeader({ left, title, right, borderClassName = 'border-border' }: PageHeaderProps) {
  if (!title) {
    return (
      <header className={`sticky top-0 z-20 flex items-center border-b bg-background/95 px-4 py-3.5 backdrop-blur ${borderClassName}`}>
        <div className="flex shrink-0 items-center">{left}</div>
        <div className="ml-auto flex min-w-0 items-center justify-end gap-2">{right}</div>
      </header>
    )
  }

  return (
    <header className={`sticky top-0 z-20 flex items-center border-b bg-background/95 px-4 py-3.5 backdrop-blur ${borderClassName}`}>
      <div className="flex min-w-0 flex-1 items-center">{left}</div>
      <span className="font-bold text-body text-foreground shrink-0">{title}</span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{right}</div>
    </header>
  )
}

import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface PageHeaderProps {
  left?: ReactNode
  title?: string
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
  titleAlign?: 'center' | 'start'
  onBack?: () => void
  backLabel?: string
  /** @deprecated Headers no longer render a border by default. Passing this opts back into a bottom border. */
  borderClassName?: string
}

export function PageHeader({
  left,
  title,
  subtitle,
  right,
  className,
  titleAlign = 'center',
  onBack,
  backLabel = 'Go back',
  borderClassName,
}: PageHeaderProps) {
  const backButton = onBack ? (
    <button
      type="button"
      onClick={onBack}
      aria-label={backLabel}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-card text-muted-foreground shadow-inner transition-all hover:bg-accent hover:text-foreground active:scale-95"
    >
      <Icon name="arrow_back" size="lg" />
    </button>
  ) : null
  const resolvedLeft =
    backButton && left ? (
      <div className="flex min-w-0 items-center gap-2">
        {backButton}
        {left}
      </div>
    ) : (
      backButton ?? left
    )
  const titleBlock = title ? (
    <div className={cn('min-w-0', titleAlign === 'center' ? 'max-w-xs text-center' : 'text-left')}>
      <div className="truncate font-bold text-body text-foreground">{title}</div>
      {subtitle && <div className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  ) : null

  return (
    <header className={cn(
      'sticky top-0 z-[var(--z-header)] flex min-h-14 shrink-0 items-center bg-background px-4 py-2 shadow-header backdrop-blur-xl',
      borderClassName && 'border-b',
      borderClassName,
      className,
    )}>
      {title && titleAlign === 'start' ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {resolvedLeft}
            {titleBlock}
          </div>
          <div className="ml-3 flex shrink-0 items-center justify-end gap-2">{right}</div>
        </>
      ) : title ? (
        <>
          <div className="flex min-w-0 flex-1 items-center">{resolvedLeft}</div>
          <div className="shrink-0">{titleBlock}</div>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{right}</div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center">{resolvedLeft}</div>
          <div className="ml-auto flex min-w-0 items-center justify-end gap-2">{right}</div>
        </>
      )}
    </header>
  )
}

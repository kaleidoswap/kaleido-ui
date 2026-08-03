import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface PageHeaderProps {
  left?: ReactNode
  title?: string
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
  /** @deprecated Page titles are now always left-aligned. */
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
  onBack,
  backLabel = 'Go back',
  borderClassName,
}: PageHeaderProps) {
  const backButton = onBack ? (
    <Button
      type="button"
      variant="ghost"
      size="icon-xl"
      onClick={onBack}
      aria-label={backLabel}
      className="shrink-0"
    >
      <Icon name="arrow_back" size="xl" />
    </Button>
  ) : null
  const titleBlock = title ? (
    <div className="min-w-0 text-left">
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
      <div
        data-slot="page-header-leading"
        className={cn(
          'flex min-w-0 items-center',
          title ? 'flex-1 gap-3' : 'shrink-0',
        )}
      >
        {backButton}
        {left}
        {titleBlock}
      </div>
      <div
        data-slot="page-header-actions"
        className={cn(
          'flex min-w-0 items-center justify-end gap-2',
          title ? 'ml-3 shrink-0' : 'ml-auto',
        )}
      >
        {right}
      </div>
    </header>
  )
}

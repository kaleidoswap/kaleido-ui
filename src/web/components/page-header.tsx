import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { IconButton } from '../primitives/icon-button'

export interface PageHeaderProps {
  /**
   * `bar` (default) is the mobile app bar: sticky, a back button, a small
   * title and a `right` slot. `page` is a desk page's header: the page's `h1`,
   * a one-line `description`, and one `action` aligned with the title that
   * wraps under it on a narrow screen. No back button unless `onBack` is
   * passed.
   */
  variant?: 'bar' | 'page'
  left?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  /** `page` variant: the line under the title. */
  description?: ReactNode
  /** `page` variant: the page's action (Refresh, Create key), at the end of the title row. */
  action?: ReactNode
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
  variant = 'bar',
  left,
  title,
  subtitle,
  description,
  action,
  right,
  className,
  onBack,
  backLabel = 'Go back',
  borderClassName,
}: PageHeaderProps) {
  if (variant === 'page') {
    return (
      <header
        data-slot="page-header"
        data-variant="page"
        className={cn('flex flex-wrap items-start justify-between gap-x-4 gap-y-3', className)}
      >
        <div data-slot="page-header-leading" className="flex min-w-0 flex-[1_1_16rem] items-start gap-3">
          {onBack && (
            <IconButton icon="arrow_back" label={backLabel} onClick={onBack} className="-ml-2" />
          )}
          <div className="min-w-0">
            <h1 className="m-0 text-title font-bold text-foreground">{title}</h1>
            {description && (
              <p className="m-0 mt-1 text-caption text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {(action ?? right) && (
          // The title's line box is 28px; the action is centred on it, so it
          // lines up with the title rather than with the title-plus-description block.
          <div
            data-slot="page-header-actions"
            className="flex min-h-7 shrink-0 items-center gap-2"
          >
            {action ?? right}
          </div>
        )}
      </header>
    )
  }

  const backButton = onBack ? (
    <IconButton icon="arrow_back" label={backLabel} size="lg" onClick={onBack} />
  ) : null
  const titleBlock = title ? (
    <div className="min-w-0 text-left">
      <div className="truncate font-bold text-body text-foreground">{title}</div>
      {subtitle && <div className="mt-1 truncate text-caption text-muted-foreground">{subtitle}</div>}
    </div>
  ) : null

  return (
    <header className={cn(
      'sticky top-0 z-[var(--z-header)] flex min-h-14 shrink-0 items-center bg-background bg-gradient-card px-4 py-2 shadow-header backdrop-blur-xl',
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

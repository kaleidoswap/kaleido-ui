import type { ReactNode } from 'react'
import { PageHeader, type PageHeaderProps } from './page-header'
import { ScrollArea } from './scroll-area'
import { FadeOverlay } from './page-shell'
import { cn } from '../utils/cn'

export interface ExtensionPageFrameProps {
  children: ReactNode
  header?: ReactNode
  title?: PageHeaderProps['title']
  subtitle?: PageHeaderProps['subtitle']
  left?: PageHeaderProps['left']
  right?: PageHeaderProps['right']
  onBack?: PageHeaderProps['onBack']
  backLabel?: PageHeaderProps['backLabel']
  titleAlign?: PageHeaderProps['titleAlign']
  bottomNav?: ReactNode
  bottomFade?: boolean
  scroll?: boolean
  viewportAs?: 'div' | 'main'
  className?: string
  contentClassName?: string
  viewportClassName?: string
  fadeClassName?: string
}

export function ExtensionPageFrame({
  children,
  header,
  title,
  subtitle,
  left,
  right,
  onBack,
  backLabel,
  titleAlign,
  bottomNav,
  bottomFade = Boolean(bottomNav),
  scroll = true,
  viewportAs = 'main',
  className,
  contentClassName,
  viewportClassName,
  fadeClassName,
}: ExtensionPageFrameProps) {
  const renderedHeader =
    header ??
    (title || subtitle || left || right || onBack ? (
      <PageHeader
        title={title}
        subtitle={subtitle}
        left={left}
        right={right}
        onBack={onBack}
        backLabel={backLabel}
        titleAlign={titleAlign}
      />
    ) : null)

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col overflow-hidden bg-background font-display text-foreground',
        className,
      )}
    >
      {renderedHeader}
      {scroll ? (
        <ScrollArea
          className={cn('flex-1', contentClassName)}
          viewportAs={viewportAs}
          viewportClassName={viewportClassName}
        >
          {children}
        </ScrollArea>
      ) : (
        <div className={cn('min-h-0 flex-1', contentClassName)}>{children}</div>
      )}
      {bottomNav}
      {bottomFade && (
        <FadeOverlay
          heightClassName="h-20"
          className={cn('fixed inset-x-0 bottom-0 z-20', fadeClassName)}
        />
      )}
    </div>
  )
}

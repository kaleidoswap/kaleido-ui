import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

/**
 * Full-bleed page shell that paints the brand radial-gradient backdrop and
 * renders children in a centered column. Replaces the duplicated
 * `bg-page-radial` + min-h-screen layouts in Welcome / LockScreen / Onboarding.
 */
export interface PageShellProps {
  children: ReactNode
  /** When true, sets min-h-screen (default). Set false to constrain to h-screen. */
  fullHeight?: boolean
  /** Default `flex flex-col items-center justify-center p-6`. Disable to provide your own layout. */
  centered?: boolean
  className?: string
}

export function PageShell({
  children,
  fullHeight = true,
  centered = true,
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-background text-foreground font-display',
        fullHeight ? 'min-h-screen' : 'h-screen',
        centered && 'flex flex-col items-center justify-center p-6',
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 bg-page-radial pointer-events-none" />
      <div className={cn('relative z-10 w-full', !centered && 'h-full min-h-0')}>{children}</div>
    </div>
  )
}

/**
 * Brand headline gradient — the white-to-slate-fade treatment used on
 * Welcome / LockScreen titles. Uses CSS variables so dark/light modes
 * can be re-themed without component changes.
 */
export interface HeadlineGradientProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function HeadlineGradient({
  children,
  as: Tag = 'h1',
  className,
}: HeadlineGradientProps) {
  return (
    <Tag
      className={cn(
        'font-bold tracking-tight bg-gradient-headline bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Centered loading state — used by ActivityList and other async surfaces.
 * Replaces ad-hoc spinner-and-text duplicates across the extension.
 */
export interface LoadingCardProps {
  message?: string
  className?: string
}

export function LoadingCard({ message = 'Loading...', className }: LoadingCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-muted-foreground',
        className,
      )}
    >
      <div className="mb-4 size-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

/**
 * Centered error state with an optional retry button. Replaces the bespoke
 * red-icon-circle + title + description card in ActivityList and elsewhere.
 */
export interface ErrorCardProps {
  title?: string
  description: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorCard({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try Again',
  className,
}: ErrorCardProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-danger/10">
        <span className="material-symbols-outlined text-danger" style={{ fontSize: '32px' }}>
          error
        </span>
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="mb-4 max-w-xs text-xs text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-primary/15 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/25"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}

/**
 * A bottom-fade overlay used over scrolling content (e.g. dashboard lists)
 * to soften the cut against the bottom navigation bar.
 */
export interface FadeOverlayProps {
  /** Direction of the fade. Defaults to bottom. */
  edge?: 'bottom' | 'top'
  /** Tailwind height class — defaults to h-12. */
  heightClassName?: string
  className?: string
}

export function FadeOverlay({
  edge = 'bottom',
  heightClassName = 'h-12',
  className,
}: FadeOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 z-10',
        heightClassName,
        edge === 'bottom'
          ? 'bottom-0 bg-gradient-to-t from-background to-transparent'
          : 'top-0 bg-gradient-to-b from-background to-transparent',
        className,
      )}
    />
  )
}

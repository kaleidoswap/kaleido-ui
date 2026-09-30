import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { InfoPanel } from './info-panel'
import { ListSkeletonRows } from './skeleton'
import { EmptyState } from './empty-state'

export interface QueryErrorView {
  title: ReactNode
  message: ReactNode
  tone: 'danger' | 'info'
  /** Whether trying again can help. The retry button needs this and `onRetry`. */
  retryable: boolean
}

/**
 * The fallback classifier: every error is a retryable failure, titled "Could
 * not load", with the error's own message. Pass `classifyError` to say more —
 * a 403 is not retryable, an unreleased endpoint is `info`, not `danger`.
 */
export function defaultClassifyError(error: unknown): QueryErrorView {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Something went wrong.'
  return { title: 'Could not load', message, tone: 'danger', retryable: true }
}

export interface QueryStateProps {
  isLoading?: boolean
  /** Anything truthy is an error; it is shown instead of the children. */
  error?: unknown
  isEmpty?: boolean
  children?: ReactNode
  classifyError?: (error: unknown) => QueryErrorView
  /** Shown as "Try again" only when the classified error is retryable. */
  onRetry?: () => void
  retryLabel?: string
  /** What the failure means for the reader, shown above the message: "The figures below are from yesterday." */
  errorConsequence?: ReactNode
  emptyTitle?: ReactNode
  emptyDescription?: ReactNode
  emptyAction?: ReactNode
  skeletonRows?: number
  /** The loading status's accessible name; nothing is shown as text. */
  loadingLabel?: string
}

/**
 * Loading, error and empty, kept apart: a read that failed never looks like
 * an empty list, and a list still loading never looks like either.
 *
 * - Loading: skeleton rows inside `role="status"`, named by `loadingLabel`.
 * - Error: an `InfoPanel` inside `role="alert"`, worded by `classifyError`,
 *   with "Try again" when the error is retryable and `onRetry` is passed.
 * - Empty: an `EmptyState`.
 * - Otherwise: the children.
 */
export function QueryState({
  isLoading = false,
  error,
  isEmpty = false,
  children,
  classifyError = defaultClassifyError,
  onRetry,
  retryLabel = 'Try again',
  errorConsequence,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyAction,
  skeletonRows = 3,
  loadingLabel = 'Loading',
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div role="status" aria-label={loadingLabel} data-slot="query-state" data-state="loading">
        <ListSkeletonRows rows={skeletonRows} />
      </div>
    )
  }

  if (error) {
    const view = classifyError(error)
    return (
      <div role="alert" data-slot="query-state" data-state="error">
        <InfoPanel tone={view.tone} title={view.title}>
          <div className="space-y-3">
            {errorConsequence && <p className="m-0 font-semibold">{errorConsequence}</p>}
            <p className="m-0">{view.message}</p>
            {view.retryable && onRetry && (
              <Button type="button" variant="surface" size="sm" onClick={onRetry}>
                {retryLabel}
              </Button>
            )}
          </div>
        </InfoPanel>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div data-slot="query-state" data-state="empty">
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </div>
    )
  }

  return <>{children}</>
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  /**
   * Under the error panel: what only the consumer can say about this error —
   * a request id to quote to support, say. Return nothing to show nothing.
   */
  errorDetail?: (error: unknown) => ReactNode
  /**
   * What the read returned, said politely once the view it answers changes:
   * `key` is the view (filters, page), `message` the result ("12 swaps
   * shown"). Said when the key moves, never when the same view refetches, and
   * not on the first load, which the page's own arrival announces.
   */
  announce?: { key: string; message: string }
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
export function QueryState({ announce, ...props }: QueryStateProps) {
  const message = useResultAnnouncement(announce, !props.isLoading && !props.error)
  const body = <QueryStateBody {...props} />
  if (!announce) return body
  return (
    <>
      {/* Mounted before it has anything to say: a live region that appears
          together with its text is often not read at all. */}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
      {body}
    </>
  )
}

function useResultAnnouncement(announce: QueryStateProps['announce'], settled: boolean): string {
  const [message, setMessage] = useState('')
  const spokenFor = useRef<string | null>(null)
  const key = announce?.key
  const next = announce?.message ?? ''
  useEffect(() => {
    if (key === undefined || !settled) return
    if (spokenFor.current === null) {
      spokenFor.current = key
      return
    }
    if (spokenFor.current === key) return
    spokenFor.current = key
    setMessage(next)
  }, [key, next, settled])
  return message
}

function QueryStateBody({
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
  errorDetail,
}: Omit<QueryStateProps, 'announce'>) {
  if (isLoading) {
    return (
      // aria-busy, so a screen reader reports the region as loading rather than empty.
      <div role="status" aria-label={loadingLabel} aria-busy="true" data-slot="query-state" data-state="loading">
        <ListSkeletonRows rows={skeletonRows} />
      </div>
    )
  }

  if (error) {
    const view = classifyError(error)
    const detail = errorDetail?.(error)
    return (
      <div role="alert" data-slot="query-state" data-state="error" className="space-y-3">
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
        {detail ? <div data-slot="query-state-detail" className="text-caption text-muted-foreground">{detail}</div> : null}
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

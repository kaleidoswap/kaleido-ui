import { useCallback, useRef, useState } from 'react'

export type CopyState = 'idle' | 'copied' | 'failed'

export interface CopyCallbacks {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export interface UseCopyToClipboard {
  state: CopyState
  /** Writes `value`; resolves to whether it was written. `callbacks` hear this attempt's outcome. */
  copy: (value: string, callbacks?: CopyCallbacks) => Promise<boolean>
  /** Back to `idle`. */
  reset: () => void
  /** Why the last copy failed, when it did. */
  error: unknown
}

/**
 * Copy to the clipboard and report what actually happened.
 *
 * `navigator.clipboard.writeText` is missing outside a secure context and
 * rejects in some iframes or without permission; both end in `failed`, never
 * in `copied`. The failure is never hidden. There is no timer back to
 * `idle`: the state changes only on the next `copy` or on `reset`, so a
 * consumer decides how long "Copied" stays up.
 */
export function useCopyToClipboard(): UseCopyToClipboard {
  const [state, setState] = useState<CopyState>('idle')
  const [error, setError] = useState<unknown>(undefined)
  // The latest call wins: a slow rejection of an earlier write cannot
  // overwrite the result of a later one.
  const attempt = useRef(0)

  const copy = useCallback(async (value: string, callbacks?: CopyCallbacks) => {
    const id = ++attempt.current
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('The clipboard is not available in this context')
      }
      await navigator.clipboard.writeText(value)
      if (id === attempt.current) {
        setError(undefined)
        setState('copied')
      }
      callbacks?.onSuccess?.()
      return true
    } catch (cause) {
      if (id === attempt.current) {
        setError(cause)
        setState('failed')
      }
      callbacks?.onError?.(cause)
      return false
    }
  }, [])

  const reset = useCallback(() => {
    attempt.current += 1
    setError(undefined)
    setState('idle')
  }, [])

  return { state, copy, reset, error }
}

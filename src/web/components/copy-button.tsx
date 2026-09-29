import { useEffect, useRef, useState } from 'react'
import { Button, type ButtonProps } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export type CopyButtonStatus = 'idle' | 'copied' | 'failed'

export interface CopyButtonProps
  extends Omit<ButtonProps, 'value' | 'onClick' | 'children' | 'asChild'> {
  /** The text written to the clipboard. */
  value: string
  /** What is being copied, for the button's name: "API key prefix" → "Copy API key prefix". */
  label: string
  /** How long the success or failure state stays up, in ms. */
  resetAfter?: number
  onCopied?: () => void
  onCopyError?: (error: unknown) => void
}

const FAILURE_TEXT = 'Could not copy — select the text instead'

async function writeClipboard(value: string): Promise<void> {
  // Outside a secure context, in some iframes and without permission,
  // `navigator.clipboard` is missing or its write rejects. Both are failures.
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    throw new Error('Clipboard unavailable')
  }
  await navigator.clipboard.writeText(value)
}

/**
 * A real copy button: it writes `value` to the clipboard and says whether that
 * worked.
 *
 * The part consumers got wrong is the failure. `navigator.clipboard.writeText`
 * rejects outside a secure context, in some iframes and when permission is
 * denied; a button that shows "Copied" anyway tells the user something false.
 * On success this shows a check and announces "Copied"; on failure it shows
 * and announces that copying failed, and never the check.
 *
 * `CopyIcon` stays what it is: the glyph, for a row that is itself the button.
 */
export function CopyButton({
  value,
  label,
  resetAfter = 2000,
  onCopied,
  onCopyError,
  variant = 'ghost',
  size = 'icon-lg',
  className,
  disabled,
  ...props
}: CopyButtonProps) {
  const [status, setStatus] = useState<CopyButtonStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const settle = (next: CopyButtonStatus) => {
    setStatus(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), resetAfter)
  }

  const copy = async () => {
    try {
      await writeClipboard(value)
      settle('copied')
      onCopied?.()
    } catch (error) {
      settle('failed')
      onCopyError?.(error)
    }
  }

  return (
    <span data-slot="copy-button" data-status={status} className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant={variant}
        size={size}
        aria-label={`Copy ${label}`}
        disabled={disabled}
        onClick={() => void copy()}
        className={cn(status === 'failed' && 'text-danger', className)}
        {...props}
      >
        <Icon
          name={status === 'copied' ? 'check' : status === 'failed' ? 'error' : 'content_copy'}
          className="text-icon-md"
        />
      </Button>
      {status === 'failed' && (
        <span data-slot="copy-button-error" aria-hidden="true" className="text-caption text-danger">
          {FAILURE_TEXT}
        </span>
      )}
      {/* Always mounted, so the change of text is what gets announced. */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'copied' ? 'Copied' : status === 'failed' ? FAILURE_TEXT : ''}
      </span>
    </span>
  )
}

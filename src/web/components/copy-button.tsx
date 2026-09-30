import type { MouseEvent } from 'react'
import { Button, type ButtonProps } from '../primitives/button'
import { CopyIcon } from './deposit-ui-shared'
import { useCopyToClipboard, type CopyState } from '../hooks/use-copy-to-clipboard'
import { cn } from '../utils/cn'

/** @deprecated Use `CopyState` from `useCopyToClipboard`; kept as an alias. */
export type CopyButtonStatus = CopyState

export interface CopyButtonProps
  extends Omit<ButtonProps, 'value' | 'onClick' | 'children' | 'asChild' | 'size'> {
  /** The full value written to the clipboard. */
  value: string
  /** What is copied, for the button's name and the announcement: "transaction id". */
  label: string
  /** The visible failure message. */
  failedMessage?: string
  /** The accessible name. Defaults to `Copy ${label}`. */
  copyLabel?: string
  /** The success announcement. Defaults to `${label} copied to the clipboard`. */
  copiedAnnouncement?: string
  onCopied?: () => void
  onCopyError?: (error: unknown) => void
}

export const COPY_FAILED_MESSAGE = 'Copy failed — select it and copy by hand.'

/**
 * A 24×24 ghost icon button that copies `value` and says whether it worked:
 * the copy glyph, a check once copied, and on failure a visible message
 * (`role="alert"`) instead of a check — never "copied" when nothing was.
 * A success is announced through a polite live region.
 *
 * It stops the click's propagation: it usually sits inside a clickable row.
 * The state stays until the next copy; there is no timer.
 */
export function CopyButton({
  value,
  label,
  failedMessage = COPY_FAILED_MESSAGE,
  copyLabel,
  copiedAnnouncement,
  onCopied,
  onCopyError,
  variant = 'ghost',
  className,
  disabled,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard()

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    void copy(value, { onSuccess: onCopied, onError: onCopyError })
  }

  return (
    <span data-slot="copy-button" data-status={state} className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant={variant}
        size="icon"
        aria-label={copyLabel ?? `Copy ${label}`}
        disabled={disabled}
        onClick={onClick}
        className={cn('rounded-md text-muted-foreground hover:text-primary', className)}
        {...props}
      >
        <CopyIcon copied={state === 'copied'} variant="bare" />
      </Button>
      {state === 'failed' && (
        <span data-slot="copy-button-error" role="alert" className="text-caption text-danger">
          {failedMessage}
        </span>
      )}
      {/* Always mounted, so a change of text is what gets announced. */}
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? (copiedAnnouncement ?? `${label} copied to the clipboard`) : ''}
      </span>
    </span>
  )
}

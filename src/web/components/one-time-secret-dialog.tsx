import { useEffect, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog'
import { Icon } from '../primitives/icon'
import { InfoPanel } from './info-panel'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'

export interface OneTimeSecretDialogProps {
  /** The secret to show. The dialog is open while this is set. */
  secret: string | null
  /** The only way out: the reader says they have stored it. */
  onAcknowledge: () => void
  title?: ReactNode
  description?: ReactNode
  copyLabel?: ReactNode
  copiedLabel?: ReactNode
  acknowledgeLabel?: ReactNode
  /** Shown as a warning when the clipboard refused the copy. */
  copyFailedMessage?: ReactNode
  /** Announced once the copy succeeded. */
  copiedAnnouncement?: string
  /**
   * Ask the browser to confirm a reload or a tab close while the secret is on
   * screen. On by default: the dialog cannot survive a navigation it does not own.
   */
  warnOnUnload?: boolean
}

/**
 * A secret the server returns once — a new API key — shown until the reader
 * says they have stored it.
 *
 * Escape, a click outside and the close control do nothing: the acknowledge
 * button is the only exit, because the secret cannot be shown again. The
 * value stays selectable, so a refused clipboard still leaves a way to copy it
 * by hand, and a refused copy says so instead of pretending it worked. Hold
 * the secret above the router if a Back press must not lose it.
 */
export function OneTimeSecretDialog({
  secret,
  onAcknowledge,
  title = 'Copy your secret now',
  description = 'For security, it cannot be displayed again.',
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  acknowledgeLabel = 'I have stored it',
  copyFailedMessage = 'Could not copy to the clipboard. Select the value above and copy it by hand before closing — it cannot be shown again.',
  copiedAnnouncement = 'Copied to the clipboard',
  warnOnUnload = true,
}: OneTimeSecretDialogProps) {
  const { state, copy, reset } = useCopyToClipboard()
  const open = secret !== null

  // A new secret starts from "not copied".
  useEffect(() => {
    reset()
  }, [secret, reset])

  useEffect(() => {
    if (!open || !warnOnUnload) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // Legacy browsers need returnValue set; the string itself is ignored.
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [open, warnOnUnload])

  return (
    <Dialog open={open}>
      <DialogContent
        data-slot="one-time-secret-dialog"
        showClose={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {secret !== null && (
          <div className="rounded-xl kui-well p-4">
            <div className="select-all break-all font-mono text-caption text-foreground">{secret}</div>
          </div>
        )}
        {state === 'failed' && (
          <div role="alert">
            <InfoPanel tone="warning">{copyFailedMessage}</InfoPanel>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => secret !== null && void copy(secret)}>
            <Icon name={state === 'copied' ? 'check' : 'content_copy'} className="text-icon-md" />
            {state === 'copied' ? copiedLabel : copyLabel}
          </Button>
          <Button type="button" onClick={onAcknowledge}>
            {acknowledgeLabel}
          </Button>
        </DialogFooter>
        <span aria-live="polite" className="sr-only">
          {state === 'copied' ? copiedAnnouncement : ''}
        </span>
      </DialogContent>
    </Dialog>
  )
}

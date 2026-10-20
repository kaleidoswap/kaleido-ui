import { useState, type ReactNode } from 'react'
import { Button } from '../primitives/button'
import { IconGlyph } from '../primitives/icon-glyph'
import { Refresh } from '../icons/outlined'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  /** Anything more the decision needs: what survives, what does not. */
  children?: ReactNode
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  /** The confirm button is `destructive`: Delete, Revoke, Discard. */
  destructive?: boolean
  /**
   * While the action runs: the confirm button spins, says it is busy and
   * ignores presses, and Cancel is held, since the request is already on its way.
   */
  busy?: boolean
  /** The action cannot be taken yet: nothing chosen, or something blocks it (say what in `children`). */
  confirmDisabled?: boolean
  onConfirm: () => void
  /** Classes for the dialog box: a wider one for a longer explanation. */
  className?: string
}

/**
 * Asks before an action that cannot be taken back. Cancel, Escape and a click
 * outside all leave things as they were; only the confirm button acts. The
 * confirm button stays enabled while `busy` (it spins, reports `aria-busy`
 * and ignores presses), so focus never lands on a dead control. Put what the
 * decision needs — what survives, a failure — in `children`.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  busy = false,
  confirmDisabled = false,
  onConfirm,
  className,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-slot="confirm-dialog" className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={busy} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'destructive' : 'default'}
            disabled={confirmDisabled}
            aria-busy={busy || undefined}
            onClick={() => {
              if (!busy) onConfirm()
            }}
          >
            {busy && <IconGlyph glyph={Refresh} className="animate-spin text-icon-md motion-reduce:animate-none" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export interface UseDiscardGuardOptions {
  /** Whether closing would lose something the reader entered. */
  dirty: boolean
  /** Closes the dialog the guard sits over. */
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  keepLabel?: ReactNode
  discardLabel?: ReactNode
}

/**
 * For a dialog holding unsaved input: Cancel, Escape, a click outside and the
 * close control all call `request`, which closes at once when there is
 * nothing to lose and asks when there is. Render `confirm` beside the dialog;
 * the question is a dialog of its own, over the first.
 */
export function useDiscardGuard({
  dirty,
  onClose,
  title = 'Discard what you entered?',
  description = 'You have unsaved input. If you close this now, it is lost.',
  keepLabel = 'Keep editing',
  discardLabel = 'Discard',
}: UseDiscardGuardOptions): { request: () => void; confirm: ReactNode } {
  const [asking, setAsking] = useState(false)

  const request = () => {
    if (dirty) setAsking(true)
    else onClose()
  }

  const confirm = (
    <ConfirmDialog
      open={asking}
      onOpenChange={setAsking}
      title={title}
      description={description}
      cancelLabel={keepLabel}
      confirmLabel={discardLabel}
      destructive
      onConfirm={() => {
        setAsking(false)
        onClose()
      }}
    />
  )

  return { request, confirm }
}

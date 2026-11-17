import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../primitives/icon-button'
import { Popover, PopoverAnchor, PopoverContent } from '../primitives/popover'
import { cn } from '../utils/cn'

/** How long the pointer may be away from both parts before the note closes. */
const CLOSE_DELAY_MS = 120

export interface InfoTipProps {
  /** The button's accessible name: what the note is about. */
  label: string
  /** The note. */
  children: ReactNode
  className?: string
  contentClassName?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  /** Passed to the note, for a test or a hook to find it by. */
  'data-testid'?: string
}

/**
 * An icon-only info button that explains the figure beside it. It opens on
 * hover with a mouse and on click or tap, so it works on a touch screen.
 *
 * A hover keeps it open while the pointer is on the button or the note; a
 * click pins it open until Escape, a click outside, or another click on the
 * button. The note is anchored to the button rather than toggled by it, so a
 * click after a hover keeps the note instead of closing it. Focus stays on the
 * button: the note is a description, not a dialog.
 */
export function InfoTip({
  label,
  children,
  className,
  contentClassName,
  side = 'bottom',
  align = 'start',
  'data-testid': testId,
}: InfoTipProps) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const cancelClose = () => clearTimeout(timer.current)
  const hoverOpen = () => {
    cancelClose()
    setOpen(true)
  }
  const hoverClose = () => {
    cancelClose()
    if (pinned) return
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        // Escape or a click outside: the note goes, and so does the pin.
        setOpen(next)
        if (!next) setPinned(false)
      }}
    >
      <PopoverAnchor asChild>
        <IconButton
          ref={button}
          type="button"
          icon="info"
          label={label}
          // The note is the explanation; a native tooltip repeating the label
          // would sit on top of it.
          title=""
          size="sm"
          aria-expanded={open}
          data-slot="info-tip"
          onPointerEnter={(event) => event.pointerType === 'mouse' && hoverOpen()}
          onPointerLeave={(event) => event.pointerType === 'mouse' && hoverClose()}
          onClick={() => {
            cancelClose()
            const next = !pinned
            setPinned(next)
            setOpen(next)
          }}
          // 24 px in the 32 px row of a metric's change line, the glyph muted:
          // it explains the figure and does not compete with it.
          className={cn('relative z-10 size-6 shrink-0 rounded-md text-muted-foreground', className)}
        />
      </PopoverAnchor>
      <PopoverContent
        side={side}
        align={align}
        data-testid={testId}
        className={cn('w-auto max-w-[min(22rem,calc(100vw-2rem))] p-3 text-caption text-muted-foreground', contentClassName)}
        onPointerEnter={hoverOpen}
        onPointerLeave={hoverClose}
        // The button is the note's own control: pressing it is not an
        // interaction "outside" that should close the note it just opened.
        onInteractOutside={(event) => {
          if (button.current?.contains(event.target as Node)) event.preventDefault()
        }}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}

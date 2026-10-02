import { useEffect, useState } from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'
import { useToast } from '../hooks/use-toast'
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard'
import { Icon } from './icon'

function toPlainText(node: any): string {
  if (node == null || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(toPlainText).join('')
  // React element with string/array children (e.g. a ToastDescription node).
  const kids = node?.props?.children
  return kids != null ? toPlainText(kids) : ''
}

function ToastWithProgress({ id, title, description, action, duration = 4000, variant, ...props }: any) {
  const [progress, setProgress] = useState(100)
  const clipboard = useCopyToClipboard()
  const copied = clipboard.state === 'copied'
  const copyFailed = clipboard.state === 'failed'

  // "Copied" goes back to the copy glyph after a moment; a failure stays until
  // the next attempt, so it is never mistaken for a success.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(clipboard.reset, 1500)
    return () => clearTimeout(timer)
  }, [copied, clipboard.reset])

  useEffect(() => {
    const interval = 50
    const decrement = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        return next <= 0 ? 0 : next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [duration])

  const getIcon = () => {
    if (variant === 'destructive') {
      return <Icon name="error" size="md" className="text-danger-fg" />
    }
    return <Icon name="check_circle" size="md" className="text-brand" />
  }

  // Errors are often the thing you most need to paste into a bug report — let
  // the user copy the full title + message. Shown for destructive toasts.
  const showCopy = variant === 'destructive'
  const copyText = () => {
    const text = [toPlainText(title), toPlainText(description)].filter(Boolean).join('\n')
    if (!text) return
    // It used to show "Copied" whether or not the write succeeded.
    void clipboard.copy(text)
  }
  const copyLabel = copied ? 'Copied' : copyFailed ? 'Copy failed — select the message and copy it by hand' : 'Copy error'

  return (
    <Toast {...props} variant={variant}>
      <div className="flex items-start gap-3 flex-1">
        {getIcon()}
        <div className="grid gap-1 flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {/* Selectable so the message can be highlighted + copied manually too. */}
          {description && (
            <ToastDescription className="select-text">{description}</ToastDescription>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action}
        {showCopy && (
          <button
            type="button"
            onClick={copyText}
            aria-label={copyLabel}
            title={copyLabel}
            className="rounded-md p-1 text-foreground/60 hover:text-secondary-content hover:bg-secondary/15 transition-colors"
          >
            <Icon name={copied ? 'check' : copyFailed ? 'error' : 'content_copy'} size="sm" />
          </button>
        )}
        {showCopy && (
          <span aria-live="polite" className="sr-only">
            {copied ? 'Copied' : copyFailed ? copyLabel : ''}
          </span>
        )}
        <ToastClose />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10 overflow-hidden">
        <div
          className={`h-full transition-all ease-linear ${
            variant === 'destructive' ? 'bg-danger' : 'bg-primary bg-gradient-brand'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </Toast>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, duration, ...props }) {
        return (
          <ToastWithProgress
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            duration={duration}
            {...props}
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

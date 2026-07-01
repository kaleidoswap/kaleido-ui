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
  const [copied, setCopied] = useState(false)

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
      return <Icon name="error" size="md" className="text-danger" />
    }
    return <Icon name="check_circle" size="md" className="text-primary" />
  }

  // Errors are often the thing you most need to paste into a bug report — let
  // the user copy the full title + message. Shown for destructive toasts.
  const showCopy = variant === 'destructive'
  const copyText = () => {
    const text = [toPlainText(title), toPlainText(description)].filter(Boolean).join('\n')
    if (!text) return
    void Promise.resolve(navigator?.clipboard?.writeText?.(text)).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

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
            aria-label={copied ? 'Copied' : 'Copy error'}
            title={copied ? 'Copied' : 'Copy error'}
            className="rounded-md p-1 text-foreground/60 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <Icon name={copied ? 'check' : 'content_copy'} size="sm" />
          </button>
        )}
        <ToastClose />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all ease-linear ${
            variant === 'destructive' ? 'bg-danger' : 'bg-primary'
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

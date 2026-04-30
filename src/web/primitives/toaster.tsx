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

function ToastWithProgress({ id, title, description, action, duration = 4000, variant, ...props }: any) {
  const [progress, setProgress] = useState(100)

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

  return (
    <Toast {...props} variant={variant}>
      <div className="flex items-start gap-3 flex-1">
        {getIcon()}
        <div className="grid gap-1 flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action}
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

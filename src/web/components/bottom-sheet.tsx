import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { Button, type ButtonProps } from '../primitives/button'
import { Icon } from '../primitives/icon'
import type { IconName } from '../primitives/icon'

export interface BottomSheetAction {
  label: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: ButtonProps['variant']
  icon?: IconName
}

export interface BottomSheetProps {
  open: boolean
  title?: ReactNode
  icon?: ReactNode
  children: ReactNode
  onClose?: () => void
  closeOnBackdrop?: boolean
  actions?: BottomSheetAction[]
  className?: string
  contentClassName?: string
}

export function BottomSheet({
  open,
  title,
  icon,
  children,
  onClose,
  closeOnBackdrop = true,
  actions,
  className,
  contentClassName,
}: BottomSheetProps) {
  if (!open) return null

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) onClose?.()
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm',
        className,
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border-t border-border bg-background px-4 pb-6 pt-5 shadow-xl animate-in slide-in-from-bottom-4 duration-200',
          contentClassName,
        )}
      >
        <div className="-mt-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>
        {(title || icon) && (
          <div className="mt-4 flex items-center gap-2">
            {icon}
            <p className="text-sm font-bold text-foreground">{title}</p>
          </div>
        )}
        <div className={cn((title || icon) && 'mt-3')}>{children}</div>
        {actions && actions.length > 0 && (
          <div className="mt-4 flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                type="button"
                variant={action.variant ?? (index === actions.length - 1 ? 'cta' : 'outline')}
                size="cta"
                className="flex-1"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <Icon name={action.icon} className="text-icon-md" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

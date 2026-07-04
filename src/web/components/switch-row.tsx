import { cn } from '../utils/cn'
import { Switch } from '../primitives/switch'

interface SwitchRowProps {
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

/**
 * A settings toggle row: label + optional description on the left, Switch on
 * the right. The canonical way to render a permission / preference toggle —
 * borderless by design: rows sit on `bg-muted/40` and separate by spacing,
 * never hairlines. Use this instead of hand-rolling a flex row around Switch.
 */
export function SwitchRow({
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
  className,
}: SwitchRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 rounded-xl bg-muted/40 p-3', className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  )
}

export type { SwitchRowProps }

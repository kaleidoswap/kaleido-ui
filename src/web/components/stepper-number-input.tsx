import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface StepperNumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  inputClassName?: string
  ariaLabel?: string
}

export function StepperNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  inputClassName,
  ariaLabel,
}: StepperNumberInputProps) {
  const clamp = (next: number) => {
    const boundedMin = min === undefined ? next : Math.max(min, next)
    const bounded = max === undefined ? boundedMin : Math.min(max, boundedMin)
    onChange(Number.isFinite(bounded) ? bounded : min ?? 0)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 overflow-hidden rounded-lg border border-border bg-black/25',
        className,
      )}
    >
      <button
        type="button"
        className="px-3 py-1.5 text-white/70 transition-colors hover:bg-white/8 hover:text-white disabled:opacity-30"
        disabled={disabled || (min !== undefined && value <= min)}
        onClick={() => clamp(value - step)}
        aria-label="Decrease"
      >
        <Icon name="remove" className="text-icon-md" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => clamp(Number(event.target.value))}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-center text-sm font-bold text-foreground focus:outline-none',
          inputClassName,
        )}
      />
      <button
        type="button"
        className="px-3 py-1.5 text-white/70 transition-colors hover:bg-white/8 hover:text-white disabled:opacity-30"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => clamp(value + step)}
        aria-label="Increase"
      >
        <Icon name="add" className="text-icon-md" />
      </button>
    </div>
  )
}

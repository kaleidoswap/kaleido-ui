import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface FilterChipOption<TValue extends string = string> {
  value: TValue
  /** Visible text. Optional when `icon` is set; then `ariaLabel` names the option. */
  label?: ReactNode
  count?: number
  icon?: ReactNode
  disabled?: boolean
  /**
   * The option's accessible name, and its tooltip. Required for an icon-only
   * option ("Chart view"); otherwise the visible label is the name.
   */
  ariaLabel?: string
}

export interface FilterChipGroupProps<TValue extends string = string> {
  options: readonly FilterChipOption<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
  /**
   * `chips` (default) is the filter strip: a row of pill buttons, each a Tab
   * stop, as it always was. `segmented` is a segmented control — mutually
   * exclusive options such as a chart/list view toggle — exposed as a radio
   * group: one Tab stop, arrow keys move and select.
   */
  variant?: 'chips' | 'segmented'
  /** The group's accessible name. Recommended for `segmented`. */
  ariaLabel?: string
  className?: string
}

export function FilterChipGroup<TValue extends string = string>({
  options,
  value,
  onChange,
  variant = 'chips',
  ariaLabel,
  className,
}: FilterChipGroupProps<TValue>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const segmented = variant === 'segmented'

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!segmented) return
    const enabled = options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option.disabled)
    if (enabled.length === 0) return
    const at = Math.max(0, enabled.findIndex(({ option }) => option.value === value))
    let next: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (at + 1) % enabled.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (at - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = enabled.length - 1
    if (next === undefined) return
    event.preventDefault()
    const target = enabled[next]
    onChange(target.option.value)
    refs.current[target.index]?.focus()
  }

  return (
    <div
      role={segmented ? 'radiogroup' : undefined}
      aria-label={ariaLabel}
      data-variant={variant}
      onKeyDown={onKeyDown}
      className={cn(
        segmented
          ? 'inline-flex gap-0.5 rounded-xl bg-card p-0.5 shadow-raised ring-1 ring-inset ring-secondary/15'
          : 'flex gap-1.5 overflow-x-auto no-scrollbar',
        className,
      )}
    >
      {options.map((option, index) => {
        const active = option.value === value
        const iconOnly = option.label === undefined || option.label === null
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role={segmented ? 'radio' : undefined}
            aria-checked={segmented ? active : undefined}
            // A radio group is one Tab stop: the checked option.
            tabIndex={segmented ? (active ? 0 : -1) : undefined}
            aria-label={option.ariaLabel}
            title={iconOnly ? option.ariaLabel : undefined}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              segmented
                ? cn(
                    'flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft',
                    iconOnly ? 'size-8' : 'h-8 px-3 text-caption',
                    active
                      ? 'bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary'
                      : 'text-muted-foreground hover:bg-secondary/15 hover:text-secondary-content',
                  )
                : cn(
                    'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-tiny font-bold transition-all',
                    active
                      ? 'border-transparent bg-primary bg-gradient-primary text-primary-foreground shadow-button-primary'
                      : 'border-foreground/8 bg-foreground/5 text-muted-foreground hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary-content',
                  ),
              option.disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            {option.icon}
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xxs',
                  segmented ? (active ? 'bg-primary-foreground/15' : 'bg-secondary/15 text-secondary-content') : active ? 'bg-foreground/20' : 'bg-secondary/15 text-secondary-content',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

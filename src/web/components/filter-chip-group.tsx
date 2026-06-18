import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export interface FilterChipOption<TValue extends string = string> {
  value: TValue
  label: ReactNode
  count?: number
  icon?: ReactNode
  disabled?: boolean
}

export interface FilterChipGroupProps<TValue extends string = string> {
  options: readonly FilterChipOption<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
  className?: string
}

export function FilterChipGroup<TValue extends string = string>({
  options,
  value,
  onChange,
  className,
}: FilterChipGroupProps<TValue>) {
  return (
    <div className={cn('flex gap-1.5 overflow-x-auto no-scrollbar', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-tiny font-bold transition-all',
              active
                ? 'border-white/20 bg-white/12 text-white'
                : 'border-white/8 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white/80',
              option.disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            {option.icon}
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xxs',
                  active ? 'bg-white/20' : 'bg-white/8',
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

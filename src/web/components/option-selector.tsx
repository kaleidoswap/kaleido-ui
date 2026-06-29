import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { InlineSelector, type InlineSelectorOption } from './inline-selector'
import { cn } from '../utils/cn'

export interface OptionSelectorOption extends InlineSelectorOption {
  description?: string
  icon?: ReactNode
}

export interface OptionSelectorProps {
  label: string
  value: string
  options: OptionSelectorOption[]
  onChange: (id: string) => void
  compact?: boolean
  className?: string
  onOpenPanelHeightChange?: (height: number) => void
  /** Horizontal alignment of the trigger content. Defaults to 'between'
   * (label left, chevron right). Use 'center' to center the value + chevron. */
  triggerAlign?: 'between' | 'center'
}

export function OptionSelector({
  label,
  value,
  options,
  onChange,
  compact = false,
  className,
  onOpenPanelHeightChange,
  triggerAlign = 'between',
}: OptionSelectorProps) {
  const selected = options.find((option) => option.id === value) ?? options[0]

  return (
    <InlineSelector
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={cn(compact ? 'w-auto shrink-0' : 'w-full', className)}
      panelClassName="right-0 left-auto min-w-[11rem]"
      optionClassName="px-3 py-2.5"
      onOpenPanelHeightChange={onOpenPanelHeightChange}
      renderTrigger={({ open }) => (
        <span
          className={cn(
            'flex items-center gap-1 rounded-2xl bg-white/[0.09] px-2 py-1.5 text-xs leading-none backdrop-blur-md transition-all hover:bg-white/[0.13]',
            triggerAlign === 'center' ? 'justify-center' : 'justify-between',
            open && 'bg-white/[0.13]',
            !compact && 'w-full px-3 py-3',
          )}
        >
          <span className="truncate font-bold text-white">{selected?.label}</span>
          <Icon
            name="expand_more"
            className={cn('shrink-0 text-icon-xs text-white/40 transition-transform', open && 'rotate-180')}
          />
        </span>
      )}
      renderOption={({ option, selected: optionSelected }) => (
        <span className="flex w-full items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            {option.icon && <span className="flex size-5 shrink-0 items-center justify-center">{option.icon}</span>}
            <span className="min-w-0">
              <span
                className={cn(
                  'block truncate text-xs',
                  optionSelected ? 'font-bold text-white' : 'font-medium text-white/70',
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 block truncate text-tiny text-white/35">
                  {option.description}
                </span>
              )}
            </span>
          </span>
          {optionSelected && <Icon name="check" className="text-icon-sm text-primary" />}
        </span>
      )}
    />
  )
}

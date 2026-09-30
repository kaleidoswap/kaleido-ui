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
      panelClassName="right-0 left-auto min-w-[11rem] rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card"
      optionClassName="px-3.5 py-2.5 data-[selected]:shadow-none"
      onOpenPanelHeightChange={onOpenPanelHeightChange}
      renderTrigger={({ open }) => (
        <span
          className={cn(
            'flex h-9 min-w-[4.5rem] items-center gap-1.5 rounded-full bg-white/8 px-3.5 text-body font-semibold leading-none text-foreground shadow-raised transition-all hover:bg-secondary/15',
            triggerAlign === 'center' ? 'justify-center' : 'justify-between',
            open && 'bg-secondary/20 text-secondary-content ring-1 ring-inset ring-secondary/40 shadow-glow-violet-soft hover:bg-secondary/20',
            !compact && 'w-full',
          )}
        >
          {/* leading-normal (not the pill's leading-none) so descenders like
              the "g" in "English" aren't clipped by truncate's overflow. */}
          <span className="truncate leading-normal">{selected?.label}</span>
          <Icon
            name="expand_more"
            className={cn(
              'shrink-0 text-icon-xs transition-transform',
              open ? 'rotate-180 text-secondary-content' : 'text-muted-foreground',
            )}
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
                  'block truncate text-body',
                  optionSelected ? 'font-semibold text-primary' : 'font-medium text-foreground',
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 block truncate text-tiny text-muted-foreground">
                  {option.description}
                </span>
              )}
            </span>
          </span>
          {optionSelected && <Icon name="check" className="text-icon-sm text-secondary-content" />}
        </span>
      )}
    />
  )
}

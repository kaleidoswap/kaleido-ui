import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { InlineSelector, type InlineSelectorOption } from './inline-selector'
import { cn } from '../utils/cn'

export interface FilterDropdownOption extends InlineSelectorOption {
  icon: ReactNode
  /** @deprecated The closed trigger no longer shows a cluster of icons. */
  clusterIcon?: ReactNode
  tintClass?: string
}

export interface FilterDropdownProps {
  label: string
  value: string
  options: FilterDropdownOption[]
  onChange: (id: string) => void
  /** @deprecated The closed trigger shows a +N count, not a cluster of icons. */
  clusterMax?: number
  className?: string
  /**
   * Tighten paddings and shrink the label so more cluster icons fit
   * horizontally. Useful on narrow popups.
   */
  compact?: boolean
  onOpenPanelHeightChange?: (height: number) => void
  /**
   * Hide the label text entirely (kept available via `aria-label`). Combine
   * with `compact` for the densest variant.
   */
  hideLabel?: boolean
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className,
  compact = false,
  onOpenPanelHeightChange,
  hideLabel = false,
}: FilterDropdownProps) {
  const selected = options.find((option) => option.id === value) ?? options[0]
  const specificOptions = options.filter((option) => option.id !== 'all')
  const isFiltered = value !== 'all'

  const overflowBadge =
    value === 'all' && specificOptions.length > 0 ? (
      <span className="shrink-0 text-xxs font-semibold leading-none text-muted-foreground">+{specificOptions.length}</span>
    ) : null

  return (
    <InlineSelector
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={cn('flex-1', className)}
      panelClassName="min-w-[140px]"
      optionClassName="px-3 py-2.5"
      onOpenPanelHeightChange={onOpenPanelHeightChange}
      renderTrigger={({ open }) => (
        <span
          className={cn(
            'flex w-full items-center justify-between rounded-2xl leading-none outline-none transition-all',
            compact ? 'gap-1 px-2 py-1.5' : 'gap-1.5 px-2.5 py-2',
            isFiltered
              ? 'bg-primary/10 bg-gradient-active shadow-glow-primary-faint ring-1 ring-inset ring-primary/40'
              : 'bg-foreground/[0.09] shadow-raised backdrop-blur-md hover-gradient-violet',
            open && !isFiltered && 'bg-secondary/15 ring-1 ring-inset ring-secondary/30',
          )}
        >
          {!hideLabel && (
            <span
              className={cn(
                'shrink-0 font-medium uppercase tracking-eyebrow',
                compact ? 'text-xxs' : 'text-mini',
                isFiltered ? 'text-brand' : 'text-foreground/55',
              )}
            >
              {label}
            </span>
          )}
          {!hideLabel && overflowBadge}

          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            {value === 'all' ? (
              hideLabel ? overflowBadge : null
            ) : (
              <>
                <span className="flex size-6 shrink-0 items-center justify-center">
                  {selected?.icon}
                </span>
                <span className="truncate text-tiny font-bold text-foreground">{selected?.label}</span>
              </>
            )}
          </span>

          <Icon
            name="expand_more"
            className={cn(
              'shrink-0 text-icon-xs text-foreground/55 transition-transform',
              (open || isFiltered) && 'text-secondary-content',
              open && 'rotate-180',
            )}
          />
        </span>
      )}
      renderOption={({ option, selected: optionSelected }) => (
        <span
          className={cn(
            'flex w-full items-center gap-2 leading-none transition-all',
            optionSelected ? 'text-foreground' : 'text-foreground/60 hover:text-foreground/90',
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center">{option.icon}</span>
          <span className={cn('text-caption', optionSelected ? 'font-bold' : 'font-medium')}>
            {option.label}
          </span>
        </span>
      )}
    />
  )
}

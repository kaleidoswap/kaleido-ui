import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { InlineSelector, type InlineSelectorOption } from './inline-selector'
import { cn } from '../utils/cn'

export interface FilterDropdownOption extends InlineSelectorOption {
  icon: ReactNode
  clusterIcon?: ReactNode
  tintClass?: string
}

export interface FilterDropdownProps {
  label: string
  value: string
  options: FilterDropdownOption[]
  onChange: (id: string) => void
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
  clusterMax = 3,
  className,
  compact = false,
  onOpenPanelHeightChange,
  hideLabel = false,
}: FilterDropdownProps) {
  const selected = options.find((option) => option.id === value) ?? options[0]
  const specificOptions = options.filter((option) => option.id !== 'all')
  const displayedCluster = specificOptions.slice(0, clusterMax)
  const clusterOverflow = specificOptions.length - displayedCluster.length
  const isFiltered = value !== 'all'

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
              ? 'bg-white/[0.13] shadow-inner'
              : 'bg-white/[0.09] backdrop-blur-md hover:bg-white/[0.13]',
          )}
        >
          {!hideLabel && (
            <span
              className={cn(
                'shrink-0 font-bold uppercase tracking-wider',
                compact ? 'text-xxs' : 'text-mini',
                isFiltered ? 'text-muted-foreground' : 'text-white/45',
              )}
            >
              {label}
            </span>
          )}

          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            {value === 'all' ? (
              <span className="flex min-w-0 items-center justify-center">
                <span className="flex shrink-0 items-center -space-x-2">
                  {displayedCluster.map((option) => (
                    <span key={option.id} className="inline-flex shrink-0 items-center justify-center">
                      {option.clusterIcon ?? option.icon}
                    </span>
                  ))}
                </span>
                {clusterOverflow > 0 && (
                  <span className="ml-1 text-xxs font-semibold leading-none text-muted-foreground">
                    +{clusterOverflow}
                  </span>
                )}
              </span>
            ) : (
              <>
                <span className="flex size-6 shrink-0 items-center justify-center">
                  {selected?.icon}
                </span>
                <span className="truncate text-tiny font-bold text-white">{selected?.label}</span>
              </>
            )}
          </span>

          <Icon
            name="expand_more"
            className={cn(
              'shrink-0 text-icon-xs text-white/40 transition-transform',
              open && 'rotate-180',
            )}
          />
        </span>
      )}
      renderOption={({ option, selected: optionSelected }) => (
        <span
          className={cn(
            'flex w-full items-center gap-2 leading-none transition-all',
            optionSelected ? 'text-white' : 'text-white/60 hover:text-white/90',
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center">{option.icon}</span>
          <span className={cn('text-xs', optionSelected ? 'font-bold' : 'font-medium')}>
            {option.label}
          </span>
        </span>
      )}
    />
  )
}

import { useState, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface FilterDropdownOption {
  id: string
  label: string
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
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  clusterMax = 3,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find((option) => option.id === value) ?? options[0]
  const specificOptions = options.filter((option) => option.id !== 'all')
  const displayedCluster = specificOptions.slice(0, clusterMax)
  const clusterOverflow = specificOptions.length - displayedCluster.length
  const isFiltered = value !== 'all'

  return (
    <div className={cn('relative flex-1', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between gap-1.5 rounded-2xl px-2.5 py-2 leading-none outline-none transition-all',
          isFiltered
            ? 'bg-white/[0.13] shadow-inner'
            : 'bg-white/[0.09] backdrop-blur-md hover:bg-white/[0.13]'
        )}
      >
        <span
          className={cn(
            'shrink-0 text-mini font-bold uppercase tracking-wider',
            isFiltered ? 'text-muted-foreground' : 'text-white/45'
          )}
        >
          {label}
        </span>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
          {value === 'all' ? (
            <div className="flex min-w-0 items-center justify-center">
              <div className="flex shrink-0 items-center -space-x-2">
                {displayedCluster.map((option) => (
                  <span key={option.id} className="inline-flex shrink-0 items-center justify-center">
                    {option.clusterIcon ?? option.icon}
                  </span>
                ))}
              </div>
              {clusterOverflow > 0 && (
                <span className="ml-1 text-xxs font-semibold leading-none text-muted-foreground">
                  +{clusterOverflow}
                </span>
              )}
            </div>
          ) : (
            <>
              <div className="flex size-6 shrink-0 items-center justify-center">
                {selected?.icon}
              </div>
              <span className="truncate text-tiny font-bold text-white">{selected?.label}</span>
            </>
          )}
        </div>

        <Icon
          name="expand_more"
          className={cn(
            'shrink-0 text-icon-xs text-white/40 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          <div className="absolute left-0 top-full z-50 mt-1.5 flex min-w-[140px] flex-col gap-0.5 rounded-2xl bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left leading-none transition-all',
                  value === option.id
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/60 hover:bg-accent hover:text-white/90'
                )}
              >
                <div className="flex size-6 shrink-0 items-center justify-center">{option.icon}</div>
                <span className={cn('text-xs', value === option.id ? 'font-bold' : 'font-medium')}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

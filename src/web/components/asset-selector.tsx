import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AssetIcon } from './asset-icon'
import { NetworkBadge, type NetworkType } from './network-badge'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface AssetSelectorOption {
  ticker: string
  name?: string
  icon?: string
  network?: NetworkType
  category?: string | null
  categoryLabel?: string
}

export interface AssetSelectorCategory {
  id: string
  label: string
}

export interface AssetSelectorProps {
  label: string
  selectedTicker: string
  options: AssetSelectorOption[]
  categories?: AssetSelectorCategory[]
  defaultActiveCategories?: string[]
  disabled?: boolean
  disabledTicker?: string
  compact?: boolean
  onChange: (ticker: string) => void
}

export function AssetSelector({
  label,
  selectedTicker,
  options,
  categories = [],
  defaultActiveCategories,
  disabled,
  disabledTicker,
  compact,
  onChange,
}: AssetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>(
    defaultActiveCategories ?? categories.map((category) => category.id),
  )
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((option) => option.ticker === selectedTicker)
  const hasCategoryFilters = categories.length > 0

  const filtered = options.filter((option) => {
    const category = option.category ?? null
    const matchesCategory =
      !hasCategoryFilters ||
      category === null ||
      activeCategories.includes(category) ||
      option.ticker === selectedTicker ||
      option.ticker === disabledTicker

    if (!search) return matchesCategory

    const searchValue = search.toLowerCase()
    const matchesSearch =
      option.ticker.toLowerCase().includes(searchValue) ||
      (option.name?.toLowerCase().includes(searchValue) ?? false)

    return matchesCategory && matchesSearch
  })

  const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

  const modalOverlay =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
            onClick={() => {
              setOpen(false)
              setSearch('')
            }}
          >
            <div
              className="flex max-h-[85vh] w-full max-w-[26rem] flex-col overflow-hidden rounded-t-3xl border-t border-border bg-popover/95 shadow-[0_18px_55px_rgba(0,0,0,0.65)] backdrop-blur-2xl duration-300 animate-in slide-in-from-bottom-8 sm:max-h-[80vh] sm:rounded-3xl sm:border sm:slide-in-from-bottom-0 sm:zoom-in-95"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex-shrink-0 border-b border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xxs font-bold uppercase tracking-[0.24em] text-white/35">
                      {label} Asset
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">
                      {filtered.length} option{filtered.length === 1 ? '' : 's'} available
                    </p>
                  </div>
                  {selected && (
                    <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1">
                      <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={18} />
                      <span className="text-tiny font-semibold text-primary">
                        {selected.ticker}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 border-b border-white/[0.08] px-4 py-3">
                <div className="relative">
                  <Icon
                    name="search"
                    size="sm"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className="h-11 w-full rounded-2xl border bg-black/20 pl-10 pr-3 text-sm text-white placeholder:text-white/25 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                {hasCategoryFilters && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {categories.map((category) => {
                      const isActive = activeCategories.includes(category.id)
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            setActiveCategories((current) =>
                              current.includes(category.id)
                                ? current.filter((value) => value !== category.id)
                                : [...current, category.id],
                            )
                          }
                          className={cn(
                            'rounded-full border px-3 py-1 text-xxs font-bold uppercase tracking-[0.16em] transition-colors',
                            isActive
                              ? 'border-primary/35 bg-primary/[0.14] text-primary'
                              : 'border-border bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/65',
                          )}
                        >
                          {category.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="overflow-y-auto px-2 py-2 app-scrollbar">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-white/30">
                    <Icon name="search" size="md" className="opacity-40" />
                    <span>No results{search ? ` for "${search}"` : ''}</span>
                  </div>
                ) : (
                  filtered.map((option) => {
                    const isSelected = option.ticker === selectedTicker
                    const isDisabled = option.ticker === disabledTicker
                    const optionCategoryLabel =
                      option.categoryLabel ||
                      (option.category ? categoryLabelById.get(option.category) : undefined)

                    return (
                      <button
                        key={option.ticker}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            onChange(option.ticker)
                            setOpen(false)
                            setSearch('')
                          }
                        }}
                        className={cn(
                          'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all duration-200',
                          isSelected
                            ? 'border-primary/30 bg-primary/[0.12]'
                            : isDisabled
                              ? 'cursor-not-allowed border-white/[0.04] bg-white/[0.015] opacity-45'
                              : 'border-transparent bg-transparent hover:border-border hover:bg-accent',
                        )}
                      >
                        <AssetIcon
                          ticker={option.ticker}
                          logoUri={option.icon}
                          size={32}
                          className={cn(
                            'transition-transform duration-200',
                            !isDisabled && 'group-hover:scale-[1.04]',
                          )}
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center justify-between gap-2 font-semibold text-white">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span>{option.ticker}</span>
                              {option.network && (
                                <NetworkBadge
                                  network={option.network}
                                  className="border-none bg-black/20 py-[1px]"
                                />
                              )}
                            </div>
                            {isSelected && (
                              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wide text-primary">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center justify-between gap-3">
                            <div className="truncate text-xs text-white/35">
                              {option.name ?? option.ticker}
                            </div>
                            <div className="flex items-center gap-2">
                              {optionCategoryLabel && (
                                <span className="rounded-full border border-white/[0.08] bg-black/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">
                                  {optionCategoryLabel}
                                </span>
                              )}
                              {isDisabled && (
                                <span className="text-xxs font-medium uppercase tracking-wide text-white/25">
                                  In use
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  if (compact) {
    return (
      <div ref={ref} className="relative w-[10.5rem] flex-shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((value) => !value)}
          className={cn(
            'group flex w-full items-center gap-2 rounded-2xl px-2.5 py-2 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
            open ? 'bg-primary/[0.12] shadow-md' : 'bg-black/20 hover:bg-black/35',
          )}
        >
          {selected ? (
            <>
              <div className="relative shrink-0">
                <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={30} />
                <span className="absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full border border-background bg-primary shadow-sm" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/24">
                  {label}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 leading-tight">
                  <span className="truncate text-[15px] font-bold text-white">
                    {selected.ticker}
                  </span>
                  {selected.network && (
                    <span className="shrink-0 rounded-full border border-white/8 bg-white/[0.04] px-1.5 py-0 text-[8px] font-medium uppercase tracking-[0.08em] text-white/45">
                      {selected.network}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-[10px] leading-tight text-white/40">
                  {selected.name}
                </div>
              </div>
            </>
          ) : (
            <div className="px-1 py-1">
              <div className="text-xxs font-bold uppercase tracking-[0.22em] text-white/35">
                {label}
              </div>
              <div className="mt-1 text-sm font-semibold text-white/45">Select...</div>
            </div>
          )}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white/5 transition-colors duration-200 group-hover:border-primary/25 group-hover:bg-primary/[0.08]">
            <Icon
              name="expand_more"
              size="xs"
              className={`text-white/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {modalOverlay}
      </div>
    )
  }

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="ml-1 text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((value) => !value)}
          className="flex w-full items-center justify-between rounded-xl border bg-card/70 p-3 text-left transition-all duration-200 hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            {selected ? (
              <>
                <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={32} />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    {selected.ticker}
                    {selected.network && (
                      <NetworkBadge
                        network={selected.network}
                        className="border-border px-1.5 py-0 text-[9px]"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-white/35">{selected.name}</div>
                </div>
              </>
            ) : (
              <span className="text-sm text-white/35">Select asset...</span>
            )}
          </div>
          <Icon
            name="expand_more"
            size="sm"
            className={`ml-2 flex-shrink-0 text-white/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {modalOverlay}
      </div>
    </div>
  )
}

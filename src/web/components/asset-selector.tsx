import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AssetIcon } from './asset-icon'
import { InlineSelector, type InlineSelectorOption } from './inline-selector'
import { NetworkBadge, type NetworkType } from './network-badge'
import { iconBadgeOverlayClass } from './status-icon-badge'
import { ScrollArea } from './scroll-area'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface AssetSelectorOption {
  id: string
  ticker: string
  name?: string
  icon?: string
  network?: NetworkType
  protocol?: string
  venue?: string
  assetId?: string
  category?: string | null
  categoryLabel?: string
  /** Network id matched against the network filter slider; options without one always pass. */
  networkId?: string
  /** URL of the network mark rendered as a mini-badge over the asset icon. */
  networkIconUrl?: string
  /** Right-aligned network tag: label pill tinted with `color`, ticker beneath. */
  networkTag?: { label: string; color?: string }
}

/**
 * Mini network badge overlaid bottom-right on an asset icon — the same
 * icon+badge combo the activity cards use (see StatusIconBadge). Renders the
 * network mark image when available, otherwise a lettered fallback circle.
 */
function NetworkMiniBadge({ iconUrl, label }: { iconUrl?: string; label?: string }) {
  return (
    <span className={cn(iconBadgeOverlayClass, 'overflow-hidden')}>
      {iconUrl ? (
        <img src={iconUrl} alt={label ?? ''} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-muted text-xxs font-bold uppercase leading-none text-muted-foreground">
          {label?.charAt(0)}
        </span>
      )}
    </span>
  )
}

/**
 * Network-tag text color: dark brand hexes (e.g. near-black chain colors) are
 * unreadable on the dark card, so when the color's relative luminance drops
 * below 0.45 the text is lightened via color-mix — the pill's 15% tint
 * background keeps the original brand color either way.
 */
function readableTagColor(color: string): string {
  const raw = color.replace('#', '')
  const hex =
    raw.length === 3
      ? raw
          .split('')
          .map((char) => char + char)
          .join('')
      : raw
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return color
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance < 0.45 ? `color-mix(in srgb, ${color} 45%, white)` : color
}

export interface AssetSelectorCategory {
  id: string
  label: string
}

/** One entry of the single-select network filter slider inside the picker panel. */
export interface AssetSelectorNetworkOption {
  id: string
  label: string
  /** Network mark rendered inside the chip; falls back to a lettered dot. */
  iconUrl?: string
}

/** One entry of the quick-asset filter chips (e.g. BTC / USDT / USDC). */
export interface AssetSelectorQuickAsset {
  ticker: string
  /** Icon URL for the chip; falls back to AssetIcon's local/CDN resolution. */
  iconUrl?: string
}

export interface AssetSelectorProps {
  label: string
  selectedTicker: string
  selectedId?: string
  options: AssetSelectorOption[]
  categories?: AssetSelectorCategory[]
  defaultActiveCategories?: string[]
  /**
   * Single-select network filter rendered as a dropdown button in the panel's
   * top-right corner ("All" by default). Selecting a network keeps only
   * options whose `networkId` matches (options without a `networkId` always
   * pass, mirroring the category convention).
   */
  networks?: AssetSelectorNetworkOption[]
  /**
   * Quick-asset chips rendered under the search input. Pressing one narrows
   * the list to that ticker; pressing it again clears the filter.
   */
  quickAssets?: AssetSelectorQuickAsset[]
  networkFilter?: NetworkType | null
  venueFilter?: string | null
  disabled?: boolean
  disabledTicker?: string
  disabledId?: string
  compact?: boolean
  onOpenPanelHeightChange?: (height: number) => void
  onChange: (id: string) => void
}

type AssetSelectorInlineOption = AssetSelectorOption & InlineSelectorOption

export function AssetSelector({
  label,
  selectedTicker,
  selectedId,
  options,
  categories = [],
  defaultActiveCategories,
  networks = [],
  quickAssets = [],
  networkFilter,
  venueFilter,
  disabled,
  disabledTicker,
  disabledId,
  compact,
  onOpenPanelHeightChange,
  onChange,
}: AssetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>(
    defaultActiveCategories ?? categories.map((category) => category.id),
  )
  // Single-select network filter — null means "All".
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null)
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false)
  // Quick-asset ticker filter — null means no ticker narrowing.
  const [activeQuickAsset, setActiveQuickAsset] = useState<string | null>(null)

  const selectedKey = selectedId ?? selectedTicker
  const selected =
    options.find((option) => option.id === selectedKey) ??
    options.find((option) => option.ticker === selectedTicker)
  const selectedOptionId = selected?.id ?? selectedKey
  const hasCategoryFilters = categories.length > 0
  const hasNetworkFilter = networks.length > 0
  const hasQuickAssets = quickAssets.length > 0
  const activeNetworkOption = networks.find((network) => network.id === activeNetwork) ?? null

  const filtered = options
    .filter((option) => {
      const category = option.category ?? null
      const matchesCategory =
        !hasCategoryFilters || category === null || activeCategories.includes(category)
      const matchesNetwork = !networkFilter || option.network === networkFilter
      const matchesNetworkFilter =
        !activeNetwork || option.networkId == null || option.networkId === activeNetwork
      const matchesQuickAsset =
        !activeQuickAsset || option.ticker.toUpperCase() === activeQuickAsset
      const matchesVenue = !venueFilter || option.venue === venueFilter

      if (
        !matchesCategory ||
        !matchesNetwork ||
        !matchesNetworkFilter ||
        !matchesQuickAsset ||
        !matchesVenue
      )
        return false
      if (!search) return true

      const searchValue = search.toLowerCase()
      const matchesSearch =
        option.ticker.toLowerCase().includes(searchValue) ||
        (option.name?.toLowerCase().includes(searchValue) ?? false) ||
        (option.assetId?.toLowerCase().includes(searchValue) ?? false) ||
        (option.network?.toLowerCase().includes(searchValue) ?? false) ||
        (option.networkTag?.label.toLowerCase().includes(searchValue) ?? false) ||
        (option.category?.toLowerCase().includes(searchValue) ?? false)

      return matchesSearch
    })
    .sort((a, b) => {
      if (a.id === selectedOptionId) return -1
      if (b.id === selectedOptionId) return 1
      return a.ticker.localeCompare(b.ticker)
    })

  const inlineOptions: AssetSelectorInlineOption[] = filtered.map((option) => ({
    ...option,
    id: option.id,
    label: option.ticker,
    disabled: option.id === disabledId || option.ticker === disabledTicker,
  }))
  const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

  const chipBaseClass =
    'shrink-0 rounded-full text-tiny font-bold uppercase tracking-wide shadow-inner transition-colors'
  const chipActiveClass = 'bg-primary/[0.14] text-primary'
  const chipIdleClass = 'bg-surface-card text-text-dimmed hover:text-white/75'

  // Small network mark used by the dropdown button and its menu rows.
  const networkMark = (network: AssetSelectorNetworkOption) =>
    network.iconUrl ? (
      <img src={network.iconUrl} alt="" className="size-4 shrink-0 rounded-full" />
    ) : (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-xxs font-bold uppercase leading-none text-muted-foreground">
        {network.label.charAt(0)}
      </span>
    )

  // Single-select network filter: a dropdown button that sits in the panel's
  // top-right corner, defaulting to "All".
  const networkFilterButton = hasNetworkFilter && (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setNetworkMenuOpen((value) => !value)}
        className={cn(
          chipBaseClass,
          'flex items-center gap-1.5 py-1.5 pl-2 pr-2.5',
          activeNetworkOption || networkMenuOpen ? chipActiveClass : chipIdleClass,
        )}
      >
        {activeNetworkOption ? (
          networkMark(activeNetworkOption)
        ) : (
          <Icon name="hub" size="xs" className="shrink-0" />
        )}
        {activeNetworkOption ? activeNetworkOption.label : 'All'}
        <Icon
          name="expand_more"
          size="xs"
          className={cn(
            'shrink-0 transition-transform duration-200',
            networkMenuOpen && 'rotate-180',
          )}
        />
      </button>
      {networkMenuOpen && (
        <div className="absolute right-0 top-full z-10 mt-1.5 w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-popover shadow-popover">
          <div className="max-h-60 overflow-y-auto p-1">
            <button
              type="button"
              onClick={() => {
                setActiveNetwork(null)
                setNetworkMenuOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors',
                activeNetwork === null
                  ? 'bg-primary/[0.14] text-primary'
                  : 'text-white/75 hover:bg-accent hover:text-white',
              )}
            >
              <Icon name="hub" size="xs" className="shrink-0" />
              <span className="min-w-0 flex-1 truncate text-left">All networks</span>
              {activeNetwork === null && (
                <Icon name="check" size="xs" className="shrink-0 text-primary" />
              )}
            </button>
            {networks.map((network) => {
              const isActive = activeNetwork === network.id
              return (
                <button
                  key={network.id}
                  type="button"
                  onClick={() => {
                    setActiveNetwork(network.id)
                    setNetworkMenuOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-primary/[0.14] text-primary'
                      : 'text-white/75 hover:bg-accent hover:text-white',
                  )}
                >
                  {networkMark(network)}
                  <span className="min-w-0 flex-1 truncate text-left">{network.label}</span>
                  {isActive && <Icon name="check" size="xs" className="shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  // Filter chip rows shared by the compact bottom-sheet and the inline panel:
  // quick-asset chips under the search input, then the legacy multi-toggle
  // category chips.
  const filterControls = (hasQuickAssets || hasCategoryFilters) && (
    <>
      {hasQuickAssets && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {quickAssets.map((quick) => {
            const tickerKey = quick.ticker.toUpperCase()
            const isActive = activeQuickAsset === tickerKey
            return (
              <button
                key={tickerKey}
                type="button"
                onClick={() => setActiveQuickAsset(isActive ? null : tickerKey)}
                className={cn(
                  chipBaseClass,
                  'flex items-center gap-1.5 py-1 pl-1.5 pr-2.5',
                  isActive ? chipActiveClass : chipIdleClass,
                )}
              >
                {quick.iconUrl ? (
                  <img src={quick.iconUrl} alt="" className="size-4 shrink-0 rounded-full" />
                ) : (
                  <AssetIcon ticker={quick.ticker} size={16} className="shrink-0" />
                )}
                {quick.ticker}
              </button>
            )
          })}
        </div>
      )}
      {hasCategoryFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategories(categories.map((category) => category.id))}
            className={cn(
              chipBaseClass,
              'px-2.5 py-1',
              activeCategories.length === categories.length ? chipActiveClass : chipIdleClass,
            )}
          >
            All
          </button>
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
                  chipBaseClass,
                  'px-2.5 py-1',
                  isActive ? chipActiveClass : chipIdleClass,
                )}
              >
                {category.label}
              </button>
            )
          })}
        </div>
      )}
    </>
  )

  const renderAssetOption = (
    option: AssetSelectorOption,
    optionSelected: boolean,
    optionDisabled: boolean,
  ) => {
    const optionCategoryLabel =
      option.categoryLabel || (option.category ? categoryLabelById.get(option.category) : undefined)
    const hasNetworkBadge = Boolean(option.networkIconUrl || option.networkTag)

    return (
      <span className="group flex w-full items-center gap-3 text-sm">
        <span className="relative shrink-0">
          <AssetIcon
            ticker={option.ticker}
            logoUri={option.icon}
            size={38}
            className={cn(
              'shrink-0 transition-transform duration-200',
              !optionDisabled && 'group-hover:scale-[1.04]',
            )}
          />
          {hasNetworkBadge && (
            <NetworkMiniBadge
              iconUrl={option.networkIconUrl}
              label={option.networkTag?.label}
            />
          )}
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left">
          <span className="min-w-0 flex flex-col leading-tight">
            <span
              className="max-w-full truncate text-base font-bold tracking-wide text-white"
              title={option.name ?? option.ticker}
            >
              {option.name ?? option.ticker}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-0.5">
            {optionSelected ? (
              <span className="rounded-full bg-primary/[0.14] px-2 py-0.5 text-xxs font-bold uppercase tracking-wide text-primary">
                Current
              </span>
            ) : option.networkTag ? (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xxs font-bold uppercase tracking-wide',
                  !option.networkTag.color && 'bg-white/[0.08] text-muted-foreground',
                )}
                style={
                  option.networkTag.color
                    ? {
                        backgroundColor: `color-mix(in srgb, ${option.networkTag.color} 15%, transparent)`,
                        color: readableTagColor(option.networkTag.color),
                      }
                    : undefined
                }
              >
                {option.networkTag.label}
              </span>
            ) : (
              optionCategoryLabel && (
                <span className="rounded-full bg-surface-card px-2 py-0.5 text-tiny font-bold uppercase tracking-wide text-text-dimmed shadow-inner">
                  {optionCategoryLabel}
                </span>
              )
            )}
            <span
              className={cn(
                'max-w-24 truncate',
                option.networkTag
                  ? 'text-xs text-muted-foreground'
                  : 'text-tiny font-medium uppercase tracking-wide text-white/35',
              )}
              title={optionDisabled ? 'In use' : option.ticker}
            >
              {optionDisabled ? 'In use' : option.ticker}
            </span>
          </span>
        </span>
      </span>
    )
  }

  if (compact) {
    const closePanel = () => {
      setOpen(false)
      setSearch('')
      setNetworkMenuOpen(false)
    }

    return (
      <div className="relative w-36 flex-shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((value) => !value)}
          className={cn(
            'group flex w-full items-center gap-3 rounded-full px-3 py-2 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
            open ? 'bg-primary/[0.12] shadow-md' : 'bg-black/20 hover:bg-black/35',
          )}
        >
          {selected ? (
            <>
              <span className="relative shrink-0">
                <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={38} />
                {selected.networkIconUrl || selected.networkTag ? (
                  <NetworkMiniBadge
                    iconUrl={selected.networkIconUrl}
                    label={selected.networkTag?.label}
                  />
                ) : (
                  selected.network && (
                    <NetworkBadge
                      network={selected.network}
                      size="sm"
                      className="absolute -bottom-2 -right-2 border-2 border-background"
                    />
                  )
                )}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-xl font-bold leading-tight text-white">
                  {selected.ticker}
                </span>
              </span>
            </>
          ) : (
            <span className="px-1 py-1 text-sm font-semibold text-white/45">Select...</span>
          )}
        </button>

        {open &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center bg-black/60 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
              onClick={closePanel}
            >
              <div
                className="flex max-h-[85vh] w-full max-w-[26rem] flex-col overflow-hidden rounded-t-2xl bg-popover/95 shadow-popover backdrop-blur-2xl duration-300 animate-in slide-in-from-bottom-8 sm:max-h-[80vh] sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex-shrink-0 bg-white/[0.03] px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xxs font-bold uppercase tracking-eyebrow-wide text-text-dimmed">
                        {label} Asset
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white/90">
                        {filtered.length} option{filtered.length === 1 ? '' : 's'} available
                      </p>
                    </div>
                    {networkFilterButton ||
                      (selected && (
                        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1">
                          <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={18} />
                          <span className="text-tiny font-semibold text-white">
                            {selected.ticker}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex-shrink-0 px-4 py-3">
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
                      className="h-11 w-full rounded-2xl border border-transparent bg-black/20 pl-10 pr-3 text-sm text-white placeholder:text-white/25 focus:border-primary/25 focus:outline-none"
                    />
                  </div>
                  {filterControls}
                </div>

                <div className="mx-4 h-px bg-white/[0.06]" />
                <ScrollArea className="min-h-0 flex-1" viewportClassName="max-h-[56vh] px-2 py-2 pb-6">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-white/30">
                      <Icon name="search" size="md" className="opacity-40" />
                      <span>
                        No assets match {search ? `"${search}"` : 'the active filters'}
                      </span>
                    </div>
                  ) : (
                    filtered.map((option) => {
                      const optionKey = option.id
                      const optionSelected = optionKey === selectedOptionId
                      const optionDisabled =
                        option.id === disabledId || option.ticker === disabledTicker
                      return (
                        <button
                          key={optionKey}
                          type="button"
                          disabled={optionDisabled}
                          onClick={() => {
                            if (optionDisabled) return
                            onChange(optionKey)
                            closePanel()
                          }}
                          className={cn(
                            'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-all duration-200',
                            optionSelected
                              ? 'border-transparent bg-primary/[0.14]'
                              : optionDisabled
                                ? 'cursor-not-allowed border-transparent bg-white/[0.015] opacity-45'
                                : 'border-transparent bg-transparent hover:bg-accent',
                          )}
                        >
                          {renderAssetOption(option, optionSelected, optionDisabled)}
                        </button>
                      )
                    })
                  )}
                </ScrollArea>
              </div>
            </div>,
            document.body,
          )}
      </div>
    )
  }

  return (
    <InlineSelector
      label={label}
      value={selectedOptionId}
      options={inlineOptions}
      onChange={(ticker) => {
        onChange(ticker)
        setSearch('')
      }}
      disabled={disabled}
      className="space-y-1.5"
      panelClassName="bg-popover/95 p-0 shadow-popover"
      optionClassName="mx-1.5 px-3 py-3"
      onOpenPanelHeightChange={onOpenPanelHeightChange}
      renderTrigger={({ open }) =>
        <span className="block">
          <span className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wider text-white/40">
            {label}
          </span>
          <span className="flex w-full items-center justify-between rounded-2xl bg-card/70 px-4 py-3 text-left transition-all duration-200 hover:bg-card/90">
            <span className="flex items-center gap-3">
              {selected ? (
                <>
                  <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={32} />
                  <span>
                    <span className="text-sm font-semibold text-white">
                      {selected.ticker}
                    </span>
                    <span className="mt-0.5 block text-xs text-white/35">{selected.name}</span>
                  </span>
                </>
              ) : (
                <span className="text-sm text-white/35">Select asset...</span>
              )}
            </span>
            <Icon
              name="expand_more"
              size="sm"
              className={cn(
                'ml-2 flex-shrink-0 text-white/35 transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </span>
        </span>
      }
      renderPanelHeader={() => (
        <>
          <div className="bg-white/[0.03] px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xxs font-bold uppercase tracking-eyebrow-wide text-text-dimmed">
                  {label} Asset
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {filtered.length} option{filtered.length === 1 ? '' : 's'} available
                </p>
              </div>
              {networkFilterButton ||
                (selected && (
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1">
                    <AssetIcon ticker={selected.ticker} logoUri={selected.icon} size={18} />
                    <span className="text-tiny font-semibold text-white">{selected.ticker}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="px-4 py-3">
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
                className="h-11 w-full rounded-2xl border border-transparent bg-black/20 pl-10 pr-3 text-sm text-white placeholder:text-white/25 focus:border-primary/25 focus:outline-none"
              />
            </div>
            {filterControls}
          </div>
        </>
      )}
      renderOption={({ option, selected: optionSelected, disabled: optionDisabled }) => {
        return renderAssetOption(option, optionSelected, optionDisabled)
      }}
    />
  )
}

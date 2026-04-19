import { useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../utils/cn'
import { Button } from '../primitives/button'

export interface WdkToken {
  id: string
  symbol: string
  name: string
  /** URL or data-URI for the asset logo */
  icon?: string
  /** Pre-formatted balance string, e.g. "12,450" */
  balance?: string
  /** Network / layer label shown as badge */
  network?: string
  /** Arbitrary grouping label, e.g. "Stable", "Growth" */
  category?: string
  /** When true, the token is rendered as disabled with an "In use" label */
  disabled?: boolean
}

export interface AssetSelectorProps {
  label?: string
  /** Currently selected token id */
  selectedId?: string
  tokens: WdkToken[]
  /** When provided, shows a "Recent" section with these token ids first */
  recentIds?: string[]
  /** Visual style of the trigger button */
  variant?: 'compact' | 'full'
  disabled?: boolean
  onChange: (token: WdkToken) => void
  className?: string
}

// ─── Asset icon ───────────────────────────────────────────────────────────────
function TokenIcon({ token, size = 32 }: { token: WdkToken; size?: number }) {
  if (token.icon) {
    return (
      <img
        src={token.icon}
        alt={token.symbol}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  // Fallback: coloured initials circle
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {token.symbol.slice(0, 2).toUpperCase()}
    </div>
  )
}

export function AssetSelector({
  label = 'Asset',
  selectedId,
  tokens,
  recentIds = [],
  variant = 'compact',
  disabled = false,
  onChange,
  className,
}: AssetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = tokens.find((t) => t.id === selectedId)

  const filtered = tokens.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    )
  })

  const recent = recentIds
    .map((id) => tokens.find((t) => t.id === id))
    .filter((t): t is WdkToken => !!t && t.id !== selectedId)

  const close = () => {
    setOpen(false)
    setSearch('')
  }

  // ─── modal ──────────────────────────────────────────────────────────────────
  const modal =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 animate-in fade-in duration-200 sm:items-center sm:p-4"
            onClick={close}
          >
            <div
              className="flex max-h-[85vh] w-full max-w-[26rem] flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-lg animate-in slide-in-from-bottom-8 duration-300 sm:max-h-[80vh] sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5">
                <div>
                  <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {filtered.length} option{filtered.length === 1 ? '' : 's'} available
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selected && (
                    <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1">
                      <TokenIcon token={selected} size={18} />
                      <span className="text-tiny font-semibold text-primary">{selected.symbol}</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={close}
                    className="size-8 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </Button>
                </div>
              </div>

              {/* search */}
              <div className="shrink-0 border-b border-border px-4 py-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] text-muted-foreground">
                    search
                  </span>
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search…"
                    className="h-11 w-full rounded-xl border border-border bg-muted pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* list */}
              <div className="overflow-y-auto px-2 py-2">
                {/* recent section */}
                {!search && recent.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1.5 px-2 text-xxs font-bold uppercase tracking-widest text-muted-foreground">
                      Recent
                    </p>
                    {recent.map((token) => (
                      <TokenRow
                        key={token.id}
                        token={token}
                        isSelected={token.id === selectedId}
                        onSelect={() => { onChange(token); close() }}
                      />
                    ))}
                    <div className="my-2 h-px bg-border" />
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                    <span className="material-symbols-outlined text-[32px] text-muted-foreground">search</span>
                    <span className="text-sm text-muted-foreground">No results{search ? ` for "${search}"` : ''}</span>
                  </div>
                ) : (
                  filtered.map((token) => (
                    <TokenRow
                      key={token.id}
                      token={token}
                      isSelected={token.id === selectedId}
                      onSelect={() => { onChange(token); close() }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  // ─── compact trigger ─────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <div className={cn('relative min-w-0 shrink-0', className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={cn(
            'group flex min-w-[9.5rem] max-w-[12.25rem] items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
            open
              ? 'border-primary/40 bg-primary/10'
              : 'border-border bg-card hover:border-primary/30 hover:bg-muted',
          )}
        >
          {selected ? (
            <>
              <div className="relative shrink-0">
                <TokenIcon token={selected} size={30} />
                <span className="absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full border-2 border-card bg-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="truncate text-[15px] font-bold text-foreground">{selected.symbol}</span>
                  {selected.network && (
                    <span className="shrink-0 rounded-full border border-border bg-muted px-1.5 py-0 text-[8px] font-medium uppercase tracking-wide text-muted-foreground">
                      {selected.network}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-[10px] leading-tight text-muted-foreground">{selected.name}</div>
              </div>
            </>
          ) : (
            <div className="px-1 py-1">
              <div className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-semibold text-muted-foreground">Select…</div>
            </div>
          )}
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:border-primary/25 group-hover:bg-primary/10">
            <span className={cn('material-symbols-outlined text-[16px] text-muted-foreground transition-transform', open && 'rotate-180')}>
              expand_more
            </span>
          </div>
        </button>
        {modal}
      </div>
    )
  }

  // ─── full-width trigger ───────────────────────────────────────────────────────
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-3 text-left transition-all duration-200 hover:border-primary/30 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <TokenIcon token={selected} size={32} />
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {selected.symbol}
                  {selected.network && (
                    <span className="rounded-full border border-border bg-muted px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {selected.network}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{selected.name}</div>
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Select asset…</span>
          )}
        </div>
        <span className={cn('material-symbols-outlined text-[20px] text-muted-foreground transition-transform', open && 'rotate-180')}>
          expand_more
        </span>
      </button>
      {modal}
    </div>
  )
}

// ─── internal row ─────────────────────────────────────────────────────────────
function TokenRow({
  token,
  isSelected,
  onSelect,
}: {
  token: WdkToken
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={token.disabled}
      onClick={onSelect}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all duration-200',
        isSelected
          ? 'border-primary/30 bg-primary/10'
          : token.disabled
            ? 'cursor-not-allowed border-border bg-muted/50 opacity-50'
            : 'border-transparent bg-transparent hover:border-border hover:bg-muted',
      )}
    >
      <TokenIcon token={token} size={32} />

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center justify-between gap-2 font-semibold text-foreground">
          <div className="flex min-w-0 items-center gap-1.5">
            <span>{token.symbol}</span>
            {token.network && (
              <span className="rounded-full border border-border bg-muted px-1.5 py-[1px] text-[9px] font-medium uppercase text-muted-foreground">
                {token.network}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isSelected && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xxs font-bold uppercase tracking-wide text-primary">
                Current
              </span>
            )}
            {token.disabled && (
              <span className="text-xxs font-medium uppercase tracking-wide text-muted-foreground">In use</span>
            )}
          </div>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-3">
          <span className="truncate text-xs text-muted-foreground">{token.name}</span>
          <div className="flex items-center gap-2">
            {token.balance && (
              <span className="text-xs font-medium tabular-nums text-muted-foreground">{token.balance}</span>
            )}
            {token.category && (
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                {token.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

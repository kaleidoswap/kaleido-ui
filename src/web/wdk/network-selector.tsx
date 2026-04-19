import { cn } from '../utils/cn'

export interface NetworkOption {
  id: string
  label: string
  /** Icon URL */
  icon?: string
  /** Tailwind color token for text, e.g. "text-network-bitcoin" */
  color?: string
  /** Tailwind bg token, e.g. "bg-network-bitcoin/10" */
  bg?: string
  /** Tailwind border token */
  border?: string
  disabled?: boolean
}

export interface NetworkSelectorProps {
  options: NetworkOption[]
  selectedId?: string
  onChange: (option: NetworkOption) => void
  /** "badge" renders pill-shaped buttons in a row (default).
   *  "list" renders stacked rows with more detail. */
  variant?: 'badge' | 'list'
  label?: string
  disabled?: boolean
  className?: string
}

// ─── built-in network presets ─────────────────────────────────────────────────
export const NETWORK_PRESETS: Record<string, NetworkOption> = {
  L1: {
    id: 'L1',
    label: 'L1',
    icon: '/icons/bitcoin/bitcoin-logo.svg',
    color: 'text-network-bitcoin',
    bg: 'bg-network-bitcoin/10',
    border: 'border-network-bitcoin/25',
  },
  LN: {
    id: 'LN',
    label: 'Lightning',
    icon: '/icons/lightning/lightning.svg',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/25',
  },
  Spark: {
    id: 'Spark',
    label: 'Spark',
    icon: '/icons/spark/Asterisk/Spark Asterisk White.svg',
    color: 'text-network-spark',
    bg: 'bg-network-spark/10',
    border: 'border-network-spark/25',
  },
  Arkade: {
    id: 'Arkade',
    label: 'Arkade',
    icon: '/icons/arkade/arkade-icon.svg',
    color: 'text-network-arkade',
    bg: 'bg-network-arkade/10',
    border: 'border-network-arkade/25',
  },
  RGB: {
    id: 'RGB',
    label: 'RGB',
    icon: '/icons/rgb/rgb-logo.svg',
    color: 'text-network-rgb',
    bg: 'bg-network-rgb/10',
    border: 'border-network-rgb/25',
  },
}

export function NetworkSelector({
  options,
  selectedId,
  onChange,
  variant = 'badge',
  label,
  disabled = false,
  className,
}: NetworkSelectorProps) {
  if (variant === 'badge') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {label && (
          <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = opt.id === selectedId
            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled || opt.disabled}
                onClick={() => onChange(opt)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xxs font-bold uppercase tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
                  isSelected
                    ? cn(opt.bg ?? 'bg-primary/10', opt.border ?? 'border-primary/30', opt.color ?? 'text-primary')
                    : 'border-border bg-muted text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
                )}
              >
                {opt.icon && (
                  <img src={opt.icon} alt={opt.label} className="size-3 object-contain" />
                )}
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // list variant
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <p className="text-xxs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      )}
      {options.map((opt) => {
        const isSelected = opt.id === selectedId
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled || opt.disabled}
            onClick={() => onChange(opt)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
              isSelected
                ? cn(opt.bg ?? 'bg-primary/10', opt.border ?? 'border-primary/30')
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            {opt.icon && (
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border',
                  isSelected
                    ? cn(opt.bg ?? 'bg-primary/15', opt.border ?? 'border-primary/20')
                    : 'border-border bg-muted',
                )}
              >
                <img src={opt.icon} alt={opt.label} className="size-4 object-contain" />
              </div>
            )}
            <span
              className={cn(
                'flex-1 text-left font-semibold',
                isSelected ? (opt.color ?? 'text-primary') : 'text-foreground',
              )}
            >
              {opt.label}
            </span>
            {isSelected && (
              <span className={cn('material-symbols-outlined text-[18px]', opt.color ?? 'text-primary')}>
                check_circle
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

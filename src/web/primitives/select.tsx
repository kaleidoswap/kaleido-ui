import * as React from 'react'
import { cn } from '../utils/cn'

export interface SelectOption {
  value: string
  label: string
  prefix?: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onValueChange, className }, ref) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const selected = options.find(o => o.value === value) ?? options[0]

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      if (open) document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* Trigger */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono hover:text-white transition-colors"
        >
          {selected?.prefix && <span>{selected.prefix}</span>}
          <span>{selected?.label}</span>
          <span
            className={cn(
              'material-symbols-outlined text-[14px] transition-transform duration-200 group-hover:text-white',
              open ? 'rotate-180' : 'rotate-0'
            )}
          >
            expand_more
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 bottom-full mb-2 z-50 min-w-[140px] rounded-xl bg-card border border-border/30 shadow-xl overflow-hidden">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onValueChange?.(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-left transition-colors',
                  opt.value === selected?.value
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {opt.prefix && <span>{opt.prefix}</span>}
                <span>{opt.label}</span>
                {opt.value === selected?.value && (
                  <span className="material-symbols-outlined text-[12px] text-primary ml-auto">check</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }

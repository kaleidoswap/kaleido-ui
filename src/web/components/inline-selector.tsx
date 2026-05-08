import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export interface InlineSelectorOption {
  id: string
  label: string
  disabled?: boolean
}

export interface InlineSelectorRenderArgs<TOption extends InlineSelectorOption> {
  open: boolean
  selected: TOption | undefined
  disabled: boolean
}

export interface InlineSelectorOptionRenderArgs<TOption extends InlineSelectorOption> {
  option: TOption
  selected: boolean
  disabled: boolean
}

export interface InlineSelectorProps<TOption extends InlineSelectorOption> {
  label: string
  value: string
  options: TOption[]
  onChange: (id: string) => void
  disabled?: boolean
  className?: string
  triggerClassName?: string
  panelClassName?: string
  optionClassName?: string
  closeOnSelect?: boolean
  onOpenPanelHeightChange?: (height: number) => void
  renderTrigger: (args: InlineSelectorRenderArgs<TOption>) => ReactNode
  renderPanelHeader?: (args: InlineSelectorRenderArgs<TOption>) => ReactNode
  renderOption: (args: InlineSelectorOptionRenderArgs<TOption>) => ReactNode
}

export function InlineSelector<TOption extends InlineSelectorOption>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  panelClassName,
  optionClassName,
  closeOnSelect = true,
  onOpenPanelHeightChange,
  renderTrigger,
  renderPanelHeader,
  renderOption,
}: InlineSelectorProps<TOption>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onOpenPanelHeightChangeRef = useRef(onOpenPanelHeightChange)
  const selected = options.find((option) => option.id === value)

  const renderArgs = { open, selected, disabled }

  useEffect(() => {
    onOpenPanelHeightChangeRef.current = onOpenPanelHeightChange
  }, [onOpenPanelHeightChange])

  useLayoutEffect(() => {
    if (!onOpenPanelHeightChangeRef.current) return
    if (!open) {
      onOpenPanelHeightChangeRef.current(0)
      return
    }

    const panel = panelRef.current
    if (!panel) return

    const reportHeight = () => {
      onOpenPanelHeightChangeRef.current?.(Math.ceil(panel.getBoundingClientRect().height + 12))
    }

    reportHeight()
    const resizeObserver = new ResizeObserver(reportHeight)
    resizeObserver.observe(panel)

    return () => {
      resizeObserver.disconnect()
      onOpenPanelHeightChangeRef.current?.(0)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root || root.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative min-w-0', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-expanded={open}
        onClick={() => !disabled && setOpen((current) => !current)}
        className={cn(
          'w-full outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
          triggerClassName,
        )}
      >
        {renderTrigger(renderArgs)}
      </button>

      {open && (
        <div
          ref={panelRef}
          className={cn(
            'absolute left-0 top-full z-[var(--z-popover)] mt-2 w-full rounded-2xl border border-white/[0.08] bg-popover/95 p-1.5 shadow-2xl backdrop-blur-xl duration-200 animate-in fade-in slide-in-from-top-1',
            panelClassName,
          )}
        >
          {renderPanelHeader?.(renderArgs)}
          <div className="space-y-1">
            {options.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-white/30">
                <Icon name="search" size="md" className="opacity-40" />
                <span>No results</span>
              </div>
            ) : (
              options.map((option) => {
                const selectedOption = option.id === value
                const disabledOption = disabled || Boolean(option.disabled)
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabledOption}
                    data-selected={selectedOption ? 'true' : undefined}
                    onClick={() => {
                      if (disabledOption) return
                      onChange(option.id)
                      if (closeOnSelect) setOpen(false)
                    }}
                    className={cn(
                      'w-full rounded-xl text-left outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
                      selectedOption ? 'bg-white/15 shadow-sm' : 'hover:bg-accent',
                      optionClassName,
                    )}
                  >
                    {renderOption({
                      option,
                      selected: selectedOption,
                      disabled: disabledOption,
                    })}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

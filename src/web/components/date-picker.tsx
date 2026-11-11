import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover'
import { GlyphButton } from '../primitives/glyph-button'
import { IconGlyph } from '../primitives/icon-glyph'
import { ChevronLeft, ChevronRight, Event } from '../icons/outlined'
import { cn } from '../utils/cn'
import { fieldSurface } from '../utils/field-styles'

export interface DatePickerProps {
  /** `YYYY-MM-DD`, or empty for no date. */
  value: string
  onChange: (value: string) => void
  /** Shown on the trigger while there is no date. */
  placeholder?: string
  /** Earliest / latest selectable day, `YYYY-MM-DD`. */
  min?: string
  max?: string
  disabled?: boolean
  /** Locale for the month name, the weekday heads and the trigger text. Default `en-US`. */
  locale?: string
  /** 0 = Sunday … 6 = Saturday. Default 1 (Monday). */
  weekStartsOn?: number
  /** Accessible name of the trigger when no visible `Label` is tied to it. */
  'aria-label'?: string
  id?: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  clearLabel?: string
  todayLabel?: string
  className?: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function parseIso(value: string | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return toIso(d) === value ? d : null
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)

/**
 * A single date, picked from a month grid in a `Popover` under a field-styled
 * trigger. The value is a `YYYY-MM-DD` string (what `DateRangeFilter` uses), so
 * no time zone is involved. The grid is one Tab stop: arrows move by a day or a
 * week, Home/End to the week's ends, PageUp/PageDown by a month, Enter selects.
 * Days outside `min`/`max` are disabled. It carries no product text: every
 * label has an English default and a prop to override it.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  min,
  max,
  disabled,
  locale = 'en-US',
  weekStartsOn = 1,
  id,
  previousMonthLabel = 'Previous month',
  nextMonthLabel = 'Next month',
  clearLabel = 'Clear',
  todayLabel = 'Today',
  className,
  ...rest
}: DatePickerProps) {
  const selected = parseIso(value)
  const minDate = parseIso(min)
  const maxDate = parseIso(max)
  const [open, setOpen] = React.useState(false)
  const [focused, setFocused] = React.useState<Date>(() => selected ?? new Date())
  const gridRef = React.useRef<HTMLDivElement>(null)
  const wantFocus = React.useRef(false)

  const inRange = (d: Date) => !(minDate && d < minDate) && !(maxDate && d > maxDate)

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFocused(selected ?? new Date())
      wantFocus.current = true
    }
    setOpen(next)
  }

  // Keep DOM focus on the focused day while the keyboard moves it.
  React.useEffect(() => {
    if (!open || !wantFocus.current) return
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus()
  }, [open, focused])

  const month = startOfMonth(focused)
  const lead = (month.getDay() - weekStartsOn + 7) % 7
  const gridStart = addDays(month, -lead)
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const rows = [0, 1, 2, 3, 4, 5].filter((r) => days.slice(r * 7, r * 7 + 7).some((d) => d.getMonth() === month.getMonth()))

  const monthFmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' })
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const dayFull = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })
  const triggerFmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const heads = Array.from({ length: 7 }, (_, i) => addDays(gridStart, i))

  const move = (next: Date) => {
    wantFocus.current = true
    setFocused(next)
  }
  const shiftMonth = (delta: number) => {
    const last = new Date(focused.getFullYear(), focused.getMonth() + delta + 1, 0).getDate()
    move(new Date(focused.getFullYear(), focused.getMonth() + delta, Math.min(focused.getDate(), last)))
  }
  const choose = (d: Date) => {
    if (!inRange(d)) return
    onChange(toIso(d))
    setOpen(false)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step: Record<string, () => Date | null> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      shiftMonth(event.key === 'PageUp' ? -1 : 1)
      return
    }
    const next = step[event.key]?.()
    if (next) {
      event.preventDefault()
      move(next)
    }
  }

  const todayIso = toIso(new Date())

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={rest['aria-label']}
          data-slot="date-picker-trigger"
          className={cn(
            'flex h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-body',
            fieldSurface,
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{selected ? triggerFmt.format(selected) : placeholder}</span>
          <IconGlyph glyph={Event} aria-hidden="true" className="shrink-0 text-secondary-content" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-3"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div data-slot="date-picker" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <GlyphButton size="sm" icon={ChevronLeft} label={previousMonthLabel} onClick={() => shiftMonth(-1)} />
            <p aria-live="polite" className="m-0 text-caption font-semibold text-foreground">
              {monthFmt.format(month)}
            </p>
            <GlyphButton size="sm" icon={ChevronRight} label={nextMonthLabel} onClick={() => shiftMonth(1)} />
          </div>
          <div
            ref={gridRef}
            role="grid"
            aria-label={monthFmt.format(month)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-1"
          >
            <div role="row" className="grid grid-cols-7">
              {heads.map((d) => (
                <span
                  key={d.getDay()}
                  role="columnheader"
                  aria-label={weekdayLong.format(d)}
                  className="py-1 text-center text-mini font-medium uppercase tracking-eyebrow text-muted-foreground"
                >
                  {weekdayShort.format(d).slice(0, 2)}
                </span>
              ))}
            </div>
            {rows.map((r) => (
              <div key={r} role="row" className="grid grid-cols-7 gap-1">
                {days.slice(r * 7, r * 7 + 7).map((d) => {
                  const iso = toIso(d)
                  const outside = d.getMonth() !== month.getMonth()
                  const isSelected = iso === value
                  const isFocused = iso === toIso(focused)
                  const enabled = inRange(d)
                  return (
                    <span key={iso} role="gridcell" aria-selected={isSelected}>
                      <button
                        type="button"
                        tabIndex={isFocused ? 0 : -1}
                        disabled={!enabled}
                        aria-label={dayFull.format(d)}
                        aria-current={iso === todayIso ? 'date' : undefined}
                        data-date={iso}
                        onClick={() => choose(d)}
                        className={cn(
                          'size-9 rounded-xl text-caption tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-30',
                          isSelected
                            ? 'bg-primary font-semibold text-primary-foreground shadow-button-primary'
                            : cn(
                                'hover:bg-foreground/10',
                                outside ? 'text-foreground/55' : 'text-foreground',
                                iso === todayIso && 'font-semibold text-brand',
                              ),
                        )}
                      >
                        {d.getDate()}
                      </button>
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="rounded-lg px-2 py-1 text-caption font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-40"
            >
              {clearLabel}
            </button>
            <button
              type="button"
              disabled={!inRange(parseIso(todayIso)!)}
              onClick={() => choose(parseIso(todayIso)!)}
              className="rounded-lg px-2 py-1 text-caption font-medium text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-40"
            >
              {todayLabel}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

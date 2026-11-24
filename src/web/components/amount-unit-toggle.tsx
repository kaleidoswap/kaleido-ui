import { useState } from 'react'
import { ExpandMore } from '../icons/outlined'
import { IconGlyph } from '../primitives/icon-glyph'
import { cn } from '../utils/cn'
import { BottomSheet } from './bottom-sheet'

export interface AmountUnitChoice {
  /** The unit's code, shown on its segment and in the chooser: "USD", "EUR". */
  id: string
  /** Its sign, shown beside the code in the chooser: "$", "€". */
  symbol?: string
}

export interface AmountUnitToggleProps {
  /** The unit amounts are native to, always the first segment: "sats". */
  baseUnit: string
  /** The second segment: the alternative unit the user thinks in, e.g. a fiat currency. */
  altUnit: string
  /** The unit the field currently takes input in. */
  value: string
  onChange: (unit: string) => void
  /**
   * Every alternative the second segment can become. With more than one, a
   * chevron opens a sheet listing them; the pick is passed to `onChange`, and
   * the caller makes it the new `altUnit`.
   */
  choices?: readonly AmountUnitChoice[]
  /** Title of the chooser sheet, and the chevron's accessible name. */
  chooserTitle?: string
  /** Accessible name of the toggle. */
  'aria-label'?: string
  /**
   * Prefix for test ids: the group gets `testId`, each segment
   * `${testId}-${unit}`, the chevron `${testId}-more`, the sheet's options
   * `${testId}-option-${id}`.
   */
  testId?: string
  className?: string
}

/**
 * The unit switch beside an amount field: a two-segment pill, base unit and
 * one alternative (`sats | USD`), because flipping between sats and the one
 * currency you think in is almost every use. When there are more
 * alternatives, a chevron opens the full list in a BottomSheet.
 */
export function AmountUnitToggle({
  baseUnit,
  altUnit,
  value,
  onChange,
  choices = [],
  chooserTitle = 'Choose currency',
  'aria-label': ariaLabel = 'Amount entry unit',
  testId,
  className,
}: AmountUnitToggleProps) {
  const [chooserOpen, setChooserOpen] = useState(false)
  const tid = (suffix?: string) => (testId ? (suffix ? `${testId}-${suffix}` : testId) : undefined)

  const segment = (unit: string) => {
    const active = value === unit
    return (
      <button
        type="button"
        aria-pressed={active}
        data-testid={tid(unit)}
        onClick={() => onChange(unit)}
        className={cn(
          'min-w-[2.75rem] rounded-full px-2.5 py-1 text-xxs font-bold transition-all active:scale-[0.97]',
          active ? 'bg-primary/15 text-brand' : 'text-muted-foreground hover:text-secondary-content',
        )}
      >
        {unit}
      </button>
    )
  }

  return (
    <>
      <div
        role="group"
        aria-label={ariaLabel}
        data-testid={tid()}
        className={cn('inline-flex shrink-0 items-center gap-0.5 rounded-full bg-foreground/[0.06] p-0.5', className)}
      >
        {segment(baseUnit)}
        {segment(altUnit)}
        {choices.length > 1 && (
          <button
            type="button"
            aria-label={chooserTitle}
            data-testid={tid('more')}
            onClick={() => setChooserOpen(true)}
            className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-secondary/20 hover:text-secondary-content"
          >
            <IconGlyph glyph={ExpandMore} className="text-icon-sm" />
          </button>
        )}
      </div>

      {choices.length > 1 && (
        <BottomSheet open={chooserOpen} onClose={() => setChooserOpen(false)} title={chooserTitle}>
          <div className="grid grid-cols-2 gap-1.5" data-testid={tid('sheet')}>
            {choices.map(({ id, symbol }) => {
              const active = value === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  data-testid={tid(`option-${id}`)}
                  onClick={() => {
                    onChange(id)
                    setChooserOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-body font-bold transition-all active:scale-[0.98]',
                    active ? 'bg-primary/15 text-brand' : 'bg-foreground/[0.05] text-foreground/80 hover:bg-secondary/15',
                  )}
                >
                  <span>{id}</span>
                  {symbol && <span className="text-caption font-semibold text-muted-foreground">{symbol}</span>}
                </button>
              )
            })}
          </div>
        </BottomSheet>
      )}
    </>
  )
}

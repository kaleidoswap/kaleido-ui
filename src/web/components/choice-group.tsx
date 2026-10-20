import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

const ChoiceGroupContext = createContext<string | undefined>(undefined)

export interface ChoiceGroupProps {
  /** What is being chosen, as the group's eyebrow: "Format". */
  legend: ReactNode
  children: ReactNode
  /** The radios' shared `name`. Generated when left out. */
  name?: string
  className?: string
}

/**
 * A short set of mutually exclusive options in a form or dialog, each with a
 * title and one line saying what it means: an export's format, its scope.
 * Native radios in a `fieldset`, so the arrow keys move between them and the
 * legend names the group. For a view toggle use `FilterChipGroup
 * variant="segmented"`; for options shown as cards, `SelectableCard`.
 */
export function ChoiceGroup({ legend, children, name, className }: ChoiceGroupProps) {
  const generated = useId()
  return (
    <fieldset data-slot="choice-group" className={cn('m-0 min-w-0 space-y-2 border-0 p-0', className)}>
      <legend className={cn(eyebrow, 'mb-1 p-0 text-muted-foreground')}>{legend}</legend>
      <ChoiceGroupContext.Provider value={name ?? generated}>{children}</ChoiceGroupContext.Provider>
    </fieldset>
  )
}

export interface ChoiceProps {
  checked: boolean
  onChange: () => void
  title: ReactNode
  /** One line under the title. Truncated, with the whole of it as the tooltip when it is a string. */
  detail?: ReactNode
  disabled?: boolean
  /** Overrides the group's name, for a choice outside a `ChoiceGroup`. */
  name?: string
  className?: string
}

/** One option of a `ChoiceGroup`. */
export function Choice({ checked, onChange, title, detail, disabled, name, className }: ChoiceProps) {
  const groupName = useContext(ChoiceGroupContext)
  return (
    <label
      data-slot="choice"
      className={cn(
        'flex min-w-0 items-start gap-3 text-body text-foreground',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className
      )}
    >
      <input
        type="radio"
        name={name ?? groupName}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <span className="min-w-0">
        <span className="font-medium">{title}</span>
        {detail && (
          <span
            className="block truncate text-caption text-muted-foreground"
            title={typeof detail === 'string' ? detail : undefined}
          >
            {detail}
          </span>
        )}
      </span>
    </label>
  )
}

import { useId, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { Input } from '../primitives/input'
import { Label } from '../primitives/label'
import { cn } from '../utils/cn'

export interface ListFieldProps {
  label: ReactNode
  /** What one item is, singular, for the help line: "origin". */
  noun: string
  /** Beside the label, in words: "Required", "Optional". */
  requirement?: ReactNode
  items: readonly string[]
  onChange: (items: readonly string[]) => void
  /** Checks one item: `null` when it is accepted, the reason otherwise. */
  check?: (item: string) => string | null
  /** The accepted form, as a sentence: "An origin is a scheme and a host, with no path." */
  form?: ReactNode
  /** One accepted item, shown as the placeholder and in the help line. */
  example?: string
  /** A problem the field does not know about: a server rejection or a submit check. */
  error?: ReactNode
  /** Said when nothing has been added. */
  emptyLabel?: ReactNode
  /** The group of accepted items, for assistive tech: "Allowed origins: added". */
  itemsLabel?: string
  /** The accessible name of one item's remove button. */
  removeLabel?: (item: string) => string
  /** Monospace for ids, origins and hosts. On by default. */
  mono?: boolean
  className?: string
}

const SEPARATORS = /[\s,]+/

/**
 * A list, entered as a list: one item at a time, each checked as it is added,
 * with what has been accepted shown as the chips that will be sent.
 *
 * Enter or a comma adds what is in the box; Backspace in an empty box takes the
 * last item back; a pasted list is split on commas and whitespace. Items that
 * fail `check` stay in the box with the first reason under it, so a typo is
 * corrected rather than retyped. Leaving the box with something in it adds it,
 * so a value typed and then submitted is not silently dropped.
 */
export function ListField({
  label,
  noun,
  requirement,
  items,
  onChange,
  check = () => null,
  form,
  example,
  error,
  emptyLabel = 'None added.',
  itemsLabel,
  removeLabel = (item) => `Remove ${item}`,
  mono = true,
  className,
}: ListFieldProps) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState<string | null>(null)

  /** Adds what is valid, and keeps what is not in the box, with the reason. */
  const commit = (text: string) => {
    const pieces = text.split(SEPARATORS).filter(Boolean)
    if (pieces.length === 0) {
      setDraftError(null)
      return
    }
    const accepted: string[] = []
    const rejected: string[] = []
    let firstProblem: string | null = null
    for (const piece of pieces) {
      const problem = check(piece)
      if (problem === null) {
        if (!items.includes(piece) && !accepted.includes(piece)) accepted.push(piece)
      } else {
        rejected.push(piece)
        firstProblem ??= problem
      }
    }
    if (accepted.length > 0) onChange([...items, ...accepted])
    setDraft(rejected.join(', '))
    setDraftError(firstProblem)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit(draft)
    } else if (event.key === 'Backspace' && draft === '' && items.length > 0) {
      onChange(items.slice(0, -1))
    }
  }

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (SEPARATORS.test(text.trim())) {
      event.preventDefault()
      commit(`${draft} ${text}`)
    }
  }

  const shown = draftError ?? error ?? null
  const groupLabel = itemsLabel ?? (typeof label === 'string' ? `${label}: added` : undefined)

  return (
    <div data-slot="list-field" className={cn('space-y-2', className)}>
      <Label htmlFor={id}>
        {label}
        {requirement && <span className="font-normal text-muted-foreground"> ({requirement})</span>}
      </Label>
      <Input
        id={id}
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value)
          if (draftError) setDraftError(null)
        }}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={() => draft.trim() !== '' && commit(draft)}
        placeholder={example}
        autoComplete="off"
        spellCheck={false}
        aria-invalid={shown ? true : undefined}
        aria-describedby={`${id}-help${shown ? ` ${id}-error` : ''}`}
        className={cn(mono && 'font-mono')}
      />
      <p id={`${id}-help`} className="m-0 text-caption text-muted-foreground">
        {form}
        {form ? ' ' : ''}
        {example && (
          <>
            Example: <span className="font-mono">{example}</span>.{' '}
          </>
        )}
        Press Enter or comma to add each {noun}.
      </p>
      {shown && (
        <p id={`${id}-error`} role="alert" className="m-0 text-caption text-danger-fg">
          {shown}
        </p>
      )}
      <div role="group" aria-label={groupLabel}>
        {items.length === 0 ? (
          <p className="m-0 text-caption text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {items.map((item) => (
              <li
                key={item}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full bg-foreground/[0.07] py-1 pl-3 pr-1 text-caption text-foreground',
                  mono && 'font-mono'
                )}
              >
                {item}
                <button
                  type="button"
                  aria-label={removeLabel(item)}
                  className="flex rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onChange(items.filter((other) => other !== item))}
                >
                  <Icon name="close" className="text-icon-xs" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

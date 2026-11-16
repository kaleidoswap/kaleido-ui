import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { cn, AppIcon, GlyphButton, Input } from '@kaleido-ui/index'
import { Close } from '@kaleido-ui/icons/outlined'
import { searchEntries, type SearchEntry } from './index'
import { SEARCH_HIT_ATTR, SEARCH_KEY_ATTR } from './slug'

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim()

/**
 * The showcase's search: type a component's name (or something close to it),
 * pick a result, and the showcase opens the page it is on and outlines the box
 * that holds it in green — for as long as the field still contains that name.
 */
export function SearchBar({ page }: { page: string }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selected, setSelected] = useState<SearchEntry | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const results = useMemo(() => searchEntries(query), [query])

  // Ctrl/Cmd+K, or "/" outside a field, jumps to the search.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // A click outside closes the results.
  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // The green border: on the picked block, on its page, while the field still
  // holds its name.
  const highlighted =
    selected && selected.key && selected.page === page && normalize(query).includes(normalize(selected.title))
      ? selected
      : null
  useEffect(() => {
    if (!highlighted) return
    const marked: Element[] = []
    let frame = 0
    let tries = 0
    const apply = () => {
      const found = document.querySelectorAll(`[${SEARCH_KEY_ATTR}="${highlighted.key}"]`)
      if (!found.length) {
        // The page may still be mounting after a navigation.
        if (tries++ < 30) frame = requestAnimationFrame(apply)
        return
      }
      found.forEach((el) => {
        // A bare title (BlockTitle) outlines the block after it.
        const target = el.hasAttribute('data-search-after') ? el.nextElementSibling : el
        if (target) {
          target.setAttribute(SEARCH_HIT_ATTR, '')
          marked.push(target)
        }
      })
      marked[0]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
    // After the page's own scroll-to-top on navigation.
    frame = requestAnimationFrame(apply)
    return () => {
      cancelAnimationFrame(frame)
      marked.forEach((el) => el.removeAttribute(SEARCH_HIT_ATTR))
    }
  }, [highlighted])

  const choose = (entry: SearchEntry) => {
    setQuery(entry.title)
    setSelected(entry)
    setOpen(false)
    if (entry.page !== page) window.location.hash = `#/${entry.page}`
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      const entry = results[activeIndex]
      if (open && entry) {
        event.preventDefault()
        choose(entry)
      }
    } else if (event.key === 'Escape') {
      if (open) setOpen(false)
      else inputRef.current?.blur()
    }
  }

  const showList = open && query.trim() !== ''

  return (
    <div ref={rootRef} className="relative w-full">
      {/* The same field as ActivityFilterBar's search: the library Input, the glyph its prefix, the clear button its suffix. */}
      <Input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        aria-label="Search components"
        placeholder="Search components…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        prefix={<AppIcon name="search" size="sm" />}
        suffix={
          query ? (
            <GlyphButton
              icon={Close}
              label="Clear search"
              size="sm"
              onClick={() => {
                setQuery('')
                setSelected(null)
                inputRef.current?.focus()
              }}
            />
          ) : undefined
        }
        className="h-10 gap-2.5 px-3 text-caption text-foreground"
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-foreground/10 bg-background/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {results.length === 0 && <li className="px-3 py-3 text-sm text-muted-foreground">No component matches “{query}”.</li>}
          {results.map((entry, index) => (
            <li
              key={`${entry.page}/${entry.key}/${entry.kind}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                choose(entry)
              }}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2',
                index === activeIndex && 'bg-foreground/[0.07]',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-sm font-medium text-foreground">{entry.title}</p>
                {entry.use && <p className="m-0 truncate text-xs text-muted-foreground">{entry.use}</p>}
              </div>
              <span className="shrink-0 rounded-lg bg-foreground/[0.06] px-2 py-0.5 text-xs text-muted-foreground">
                {entry.kind === 'page' ? 'Page' : entry.pageTitle}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

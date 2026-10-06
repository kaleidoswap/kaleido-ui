import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { dom, interact, key, mount } from './helpers/dom'
import { Popover, PopoverContent, PopoverTrigger } from '../src/web/primitives/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../src/web/primitives/dropdown-menu'
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../src/web/primitives/collapsible'
import { Avatar } from '../src/web/primitives/avatar'
import { FormField } from '../src/web/components/form-field'
import { FilterChipGroup } from '../src/web/components/filter-chip-group'
import { DisclosureCard } from '../src/web/components/disclosure-card'
import { ToneBadge } from '../src/web/components/settings-section-card'
import { Table, TableBody, TableCell, TableRow } from '../src/web/primitives/table'
import { useIsNarrow, useMediaQuery } from '../src/web/hooks/use-media-query'
import * as ui from '../src/web/index'

// Radix positions floating content with ResizeObserver and DOMRect; jsdom has neither.
;(globalThis as Record<string, unknown>).ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
dom.window.HTMLElement.prototype.hasPointerCapture ??= () => false
dom.window.HTMLElement.prototype.scrollIntoView ??= () => undefined

const $ = (selector: string) => document.querySelector(selector)

// ── Popover ─────────────────────────────────────────────────────────────────

test('a popover opens from its trigger and closes on Escape, returning focus', async () => {
  const view = mount(
    h(Popover, null, h(PopoverTrigger, null, 'Details'), h(PopoverContent, null, h('button', null, 'Copy'))),
  )
  const trigger = view.container.querySelector('button')!
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  await interact(() => trigger.click())
  assert.equal(trigger.getAttribute('aria-expanded'), 'true')
  const content = $('[data-slot="popover-content"]')!
  assert.ok(content, 'no popover content')
  assert.match(content.className, /bg-popover/)
  assert.match(content.className, /shadow-popover/)
  assert.doesNotMatch(content.className, /ring-1/)
  await interact(() => void key(content, 'Escape'))
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  assert.equal(document.activeElement, trigger)
  view.unmount()
})

// ── DropdownMenu ────────────────────────────────────────────────────────────

test('a dropdown menu is a real menu: role="menu", items, a separator, a destructive item', async () => {
  const chosen: string[] = []
  const view = mount(
    h(
      DropdownMenu,
      null,
      h(DropdownMenuTrigger, null, 'Actions'),
      h(
        DropdownMenuContent,
        null,
        h(DropdownMenuItem, { onSelect: () => chosen.push('rename') }, 'Rename'),
        h(DropdownMenuSeparator),
        h(DropdownMenuItem, { destructive: true, onSelect: () => chosen.push('revoke') }, 'Revoke'),
      ),
    ),
  )
  const trigger = view.container.querySelector('button')!
  trigger.focus()
  await interact(() => void key(trigger, 'Enter'))
  const menu = $('[role="menu"]')!
  assert.ok(menu, 'no role=menu')
  const items = [...document.querySelectorAll('[role="menuitem"]')]
  assert.equal(items.length, 2)
  assert.ok($('[role="separator"]'))
  assert.equal(items[1].getAttribute('data-destructive'), 'true')
  assert.match(items[1].className, /text-danger/)
  await interact(() => (items[0] as HTMLElement).click())
  assert.deepEqual(chosen, ['rename'])
  view.unmount()
})

// ── Collapsible ─────────────────────────────────────────────────────────────

test('a collapsible trigger reports aria-expanded and controls its content, uncontrolled', async () => {
  const view = mount(
    h(
      Collapsible,
      null,
      h(CollapsibleTrigger, null, 'Filters', h(CollapsibleChevron)),
      h(CollapsibleContent, null, 'Panel'),
    ),
  )
  const trigger = view.container.querySelector('button')!
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  await interact(() => trigger.click())
  assert.equal(trigger.getAttribute('aria-expanded'), 'true')
  const content = document.getElementById(trigger.getAttribute('aria-controls')!)
  assert.ok(content && content.textContent === 'Panel')
  view.unmount()
})

test('a collapsible works controlled, and DisclosureCard is built on it', async () => {
  function Harness() {
    const [open, setOpen] = useState(false)
    return h(DisclosureCard, { title: 'Details', open, onOpenChange: setOpen }, 'Body')
  }
  const view = mount(h(Harness))
  const trigger = view.container.querySelector('button')!
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  assert.doesNotMatch(view.container.textContent!, /Body/)
  await interact(() => trigger.click())
  assert.equal(trigger.getAttribute('aria-expanded'), 'true')
  assert.match(view.container.textContent!, /Body/)
  assert.ok(document.getElementById(trigger.getAttribute('aria-controls')!))
  view.unmount()
})

// ── Avatar ──────────────────────────────────────────────────────────────────

test('an avatar is decorative by default: a custom image, or the initials', () => {
  const initials = renderToStaticMarkup(h(Avatar, { initials: 'ej' }))
  assert.match(initials, /aria-hidden="true"/)
  assert.match(initials, /from-secondary to-info/)
  assert.match(initials, />ej</)
  assert.match(initials, /size-8/)
  assert.match(renderToStaticMarkup(h(Avatar, { initials: 'ej', size: 'lg' })), /size-10/)
  // No stock glyph: the fallback is always letters.
  assert.doesNotMatch(initials, /<svg/)
  const photo = renderToStaticMarkup(h(Avatar, { src: '/me.png', alt: 'Emile', initials: 'EJ' }))
  assert.doesNotMatch(photo, /aria-hidden/)
  assert.match(photo, /<img src="\/me.png" alt="Emile"/)
  assert.doesNotMatch(photo, /from-secondary/)
})

// ── FormField ───────────────────────────────────────────────────────────────

test('a form field wires label, hint and error to its control', () => {
  const markup = renderToStaticMarkup(
    h(FormField, { label: 'Webhook URL', hint: 'HTTPS only', error: 'Not a URL' }, h('input', { type: 'url' })),
  )
  const id = /<input[^>]*\sid="([^"]+)"/.exec(markup)![1]
  assert.match(markup, new RegExp(`<label[^>]*for="${id}"`))
  assert.match(markup, new RegExp(`aria-describedby="${id}-hint ${id}-error"`))
  assert.match(markup, /aria-invalid="true"/)
  assert.match(markup, new RegExp(`id="${id}-error" role="alert"`))
  const plain = renderToStaticMarkup(h(FormField, { label: 'Name', id: 'name' }, h('input')))
  assert.doesNotMatch(plain, /aria-invalid|aria-describedby/)
  assert.match(plain, /id="name"/)
})

// ── SegmentedControl (FilterChipGroup variant="segmented") ──────────────────

test('segmented options are a radio group with one Tab stop, driven by the arrow keys', async () => {
  function Harness() {
    const [value, setValue] = useState<'chart' | 'list'>('chart')
    return h(FilterChipGroup<'chart' | 'list'>, {
      variant: 'segmented',
      ariaLabel: 'Trend view',
      value,
      onChange: setValue,
      options: [
        { value: 'chart', icon: h('svg'), ariaLabel: 'Chart view' },
        { value: 'list', icon: h('svg'), label: 'List' },
      ],
    })
  }
  const view = mount(h(Harness))
  const group = view.container.querySelector('[role="radiogroup"]')!
  assert.equal(group.getAttribute('aria-label'), 'Trend view')
  const radios = [...view.container.querySelectorAll('[role="radio"]')] as HTMLButtonElement[]
  assert.equal(radios[0].getAttribute('aria-label'), 'Chart view')
  assert.equal(radios[0].getAttribute('title'), 'Chart view')
  assert.deepEqual(radios.map((r) => r.tabIndex), [0, -1])
  radios[0].focus()
  await interact(() => void key(radios[0], 'ArrowRight'))
  assert.equal(radios[1].getAttribute('aria-checked'), 'true')
  assert.equal(document.activeElement, radios[1])
  await interact(() => void key(radios[1], 'ArrowRight'))
  assert.equal(radios[0].getAttribute('aria-checked'), 'true', 'arrows wrap')
  view.unmount()
})

test('the default chips variant is unchanged: plain buttons, every one a Tab stop', () => {
  const markup = renderToStaticMarkup(
    h(FilterChipGroup, { value: 'a', onChange: () => undefined, options: [{ value: 'a', label: 'All' }, { value: 'b', label: 'Paid' }] }),
  )
  assert.doesNotMatch(markup, /role="radio|tabindex/)
})

// ── Badge (ToneBadge) and Table ─────────────────────────────────────────────

test('ToneBadge covers the Badge variants: secondary and outline added', () => {
  assert.match(renderToStaticMarkup(h(ToneBadge, { tone: 'secondary' }, 'Beta')), /bg-secondary\/10/)
  const outline = renderToStaticMarkup(h(ToneBadge, { tone: 'outline' }, 'Draft'))
  assert.match(outline, /border-border bg-transparent/)
})

test('a table row is selected by aria-selected or data-state', () => {
  const markup = renderToStaticMarkup(
    h(Table, null, h(TableBody, null, h(TableRow, { 'aria-selected': true }, h(TableCell, null, 'x')))),
  )
  assert.match(markup, /aria-selected="true"[^>]*class="[^"]*aria-selected:bg-muted|class="[^"]*aria-selected:bg-muted[^"]*"[^>]*aria-selected="true"/)
})

// ── useMediaQuery / useIsNarrow ─────────────────────────────────────────────

test('useMediaQuery is false without matchMedia, and follows it when it exists', async () => {
  const seen: boolean[] = []
  function Probe() {
    seen.push(useMediaQuery('(max-width: 100px)'))
    return null
  }
  assert.equal(renderToStaticMarkup(h(Probe)), '')
  assert.equal(seen.at(-1), false)

  let listener: (() => void) | undefined
  let current = true
  ;(window as unknown as Record<string, unknown>).matchMedia = (query: string) => ({
    get matches() {
      return current
    },
    media: query,
    addEventListener: (_: string, fn: () => void) => {
      listener = fn
    },
    removeEventListener: () => undefined,
  })
  const narrow: boolean[] = []
  function NarrowProbe() {
    narrow.push(useIsNarrow())
    return null
  }
  const view = mount(h(NarrowProbe))
  assert.equal(narrow.at(-1), true)
  current = false
  await interact(() => listener?.())
  assert.equal(narrow.at(-1), false)
  view.unmount()
  delete (window as unknown as Record<string, unknown>).matchMedia
})

test('every priority-1 export is reachable from the package root', () => {
  for (const name of [
    'Popover', 'PopoverTrigger', 'PopoverContent', 'DropdownMenu', 'DropdownMenuItem', 'DropdownMenuSeparator',
    'Collapsible', 'CollapsibleTrigger', 'CollapsibleContent', 'CollapsibleChevron', 'Avatar', 'FormField',
    'useMediaQuery', 'useIsNarrow',
  ]) {
    assert.ok(name in ui, `${name} is not exported`)
  }
})

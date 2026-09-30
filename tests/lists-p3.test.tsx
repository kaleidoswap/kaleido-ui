import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { dom, interact, mount } from './helpers/dom'
import { EmptyState } from '../src/web/components/empty-state'
import { QueryState } from '../src/web/components/query-state'
import { RecordField, RecordItem, RecordList } from '../src/web/components/record-list'
import { FilterBar, activeFiltersLabel } from '../src/web/components/filter-bar'
import { Pager } from '../src/web/components/pager'
import { DateRangeFilter, type DateRange } from '../src/web/components/date-range-filter'
import { ValueList } from '../src/web/components/value-list'
import { EventTimeline } from '../src/web/components/event-timeline'
import { SwapStepList } from '../src/web/components/swap-step-list'
import { ActivityList } from '../src/web/components/activity-list'

;(globalThis as Record<string, unknown>).ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// ── EmptyState ──────────────────────────────────────────────────────────────

test('EmptyState: a required title, optional description and action; ActivityList renders through it', () => {
  const markup = renderToStaticMarkup(
    h(EmptyState, { title: 'No swaps yet', description: 'They appear here.', action: h('button', null, 'Open Quickstart') }),
  )
  assert.match(markup, /data-slot="empty-state"/)
  assert.match(markup, /<h3[^>]*>No swaps yet<\/h3>/)
  assert.match(markup, /They appear here\./)
  assert.match(markup, /Open Quickstart/)
  assert.match(renderToStaticMarkup(h(ActivityList, { items: [] })), /data-slot="empty-state"/)
})

// ── QueryState ──────────────────────────────────────────────────────────────

test('QueryState: loading is a named status with skeletons and no visible text', () => {
  const markup = renderToStaticMarkup(h(QueryState, { isLoading: true, loadingLabel: 'Loading swaps', skeletonRows: 2 }, 'rows'))
  assert.match(markup, /role="status" aria-label="Loading swaps"/)
  assert.doesNotMatch(markup, />Loading swaps</)
  assert.doesNotMatch(markup, /rows/)
})

test('QueryState: an error is an alert, worded by the classifier, retry only when retryable', async () => {
  let retries = 0
  const retryable = mount(
    h(QueryState, { error: new Error('503'), onRetry: () => (retries += 1), errorConsequence: 'The figures are from yesterday.' }, 'rows'),
  )
  const alert = retryable.container.querySelector('[role="alert"]')!
  assert.match(alert.textContent!, /Could not load/)
  assert.match(alert.textContent!, /The figures are from yesterday\..*503/)
  await interact(() => (alert.querySelector('button') as HTMLButtonElement).click())
  assert.equal(retries, 1)
  retryable.unmount()

  const forbidden = renderToStaticMarkup(
    h(QueryState, {
      error: { status: 403 },
      onRetry: () => undefined,
      classifyError: () => ({ title: 'No access', message: 'Ask an admin.', tone: 'info', retryable: false }),
    }),
  )
  assert.match(forbidden, /No access/)
  assert.doesNotMatch(forbidden, /Try again/)
  assert.match(forbidden, /bg-info\/10/)
})

test('QueryState: empty renders EmptyState, and data renders the children', () => {
  const empty = renderToStaticMarkup(h(QueryState, { isEmpty: true, emptyTitle: 'No swaps in this range' }))
  assert.match(empty, /data-slot="empty-state"[^]*No swaps in this range/)
  assert.equal(renderToStaticMarkup(h(QueryState, {}, 'rows')), 'rows')
})

// ── RecordList ──────────────────────────────────────────────────────────────

test('RecordList: a named ul; an item opens by click or by its explicit button, actions do not open it', async () => {
  let opened = 0
  let acted = 0
  const view = mount(
    h(
      RecordList,
      { 'aria-label': 'Swaps' },
      h(
        RecordItem,
        {
          identifier: 'sw_81',
          status: h('span', null, 'Completed'),
          summary: 'BTC → USDT',
          onOpen: () => (opened += 1),
          openLabel: 'swap sw_81',
          selected: true,
          actions: h('button', { onClick: () => (acted += 1) }, 'Refund'),
        },
        h(RecordField, { label: 'Amount' }, '1,000 sats'),
        h(RecordField, { label: 'Address', wide: true }, 'bc1q…'),
      ),
    ),
  )
  assert.equal(view.container.querySelector('ul')!.getAttribute('aria-label'), 'Swaps')
  const item = view.container.querySelector('li')!
  assert.equal(item.getAttribute('aria-current'), 'true')
  assert.equal(item.querySelectorAll('dl dt').length, 2)
  assert.match(item.querySelectorAll('[data-slot="record-field"]')[1].className, /col-span-2/)
  const open = item.querySelector('button[aria-label="Open swap sw_81"]') as HTMLButtonElement
  await interact(() => open.click())
  assert.equal(opened, 1, 'the open button opens once, not twice')
  await interact(() => item.click())
  assert.equal(opened, 2)
  await interact(() => ([...item.querySelectorAll('button')].find((b) => b.textContent === 'Refund') as HTMLButtonElement).click())
  assert.equal(acted, 1)
  assert.equal(opened, 2, 'an action opened the record')
  view.unmount()
})

// ── FilterBar ───────────────────────────────────────────────────────────────

test('FilterBar wide: controls in a row, the count and Clear all only with filters set', () => {
  assert.equal(activeFiltersLabel(1), '1 filter applied')
  assert.equal(activeFiltersLabel(3), '3 filters applied')
  const none = renderToStaticMarkup(h(FilterBar, { activeCount: 0, onClear: () => undefined }, h('select')))
  assert.doesNotMatch(none, /applied|Clear all/)
  const two = renderToStaticMarkup(h(FilterBar, { activeCount: 2, onClear: () => undefined }, h('select')))
  assert.match(two, /2 filters applied/)
  assert.match(two, /Clear all/)
})

test('FilterBar narrow: one Filters toggle named with its count, Clear all beside it', async () => {
  ;(dom.window as unknown as Record<string, unknown>).matchMedia = () => ({
    matches: true,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })
  let cleared = 0
  const view = mount(h(FilterBar, { activeCount: 2, onClear: () => (cleared += 1) }, h('input', { 'aria-label': 'Search' })))
  const toggle = view.container.querySelector('button[aria-expanded]')!
  assert.equal(toggle.getAttribute('aria-label'), 'Filters, 2 active')
  assert.equal(toggle.getAttribute('aria-expanded'), 'false')
  assert.equal(view.container.querySelector('input'), null)
  await interact(() => (toggle as HTMLButtonElement).click())
  assert.ok(view.container.querySelector('input[aria-label="Search"]'))
  await interact(() => ([...view.container.querySelectorAll('button')].find((b) => b.textContent === 'Clear all') as HTMLButtonElement).click())
  assert.equal(cleared, 1)
  view.unmount()
  delete (dom.window as unknown as Record<string, unknown>).matchMedia
})

// ── Pager ───────────────────────────────────────────────────────────────────

test('Pager: next only after a full page, never a total, nothing when there is one page', async () => {
  assert.equal(renderToStaticMarkup(h(Pager, { offset: 0, limit: 50, returned: 12, onOffsetChange: () => undefined })), '')
  const offsets: number[] = []
  const view = mount(h(Pager, { offset: 50, limit: 50, returned: 50, noun: 'swaps', onOffsetChange: (o: number) => offsets.push(o) }))
  assert.match(view.container.textContent!, /swaps 51–100/)
  assert.doesNotMatch(view.container.textContent!, / of /)
  const [previous, next] = [...view.container.querySelectorAll('button')] as HTMLButtonElement[]
  await interact(() => next.click())
  await interact(() => previous.click())
  assert.deepEqual(offsets, [100, 0])
  view.unmount()
  const last = renderToStaticMarkup(h(Pager, { offset: 100, limit: 50, returned: 7, onOffsetChange: () => undefined }))
  assert.match(last, /rows 101–107/)
  assert.match(last, /disabled=""[^>]*>Next|Next[^]*disabled/)
})

// ── DateRangeFilter ─────────────────────────────────────────────────────────

test('DateRangeFilter: labelled dates, Clear empties both and is disabled when empty, refresh spins', async () => {
  function Harness() {
    const [range, setRange] = useState<DateRange>({ from: '2026-09-01', to: '' })
    return h(DateRangeFilter, { value: range, onChange: setRange, onRefresh: () => undefined, isRefreshing: true })
  }
  const view = mount(h(Harness))
  const inputs = [...view.container.querySelectorAll('input[type="date"]')] as HTMLInputElement[]
  assert.equal(inputs.length, 2)
  for (const input of inputs) assert.ok(view.container.querySelector(`label[for="${input.id}"]`))
  const clear = [...view.container.querySelectorAll('button')].find((b) => b.textContent === 'Clear') as HTMLButtonElement
  assert.equal(clear.disabled, false)
  const refresh = view.container.querySelector('button[aria-label="Refresh"]') as HTMLButtonElement
  assert.equal(refresh.disabled, true)
  assert.match(refresh.innerHTML, /animate-spin/)
  await interact(() => clear.click())
  assert.equal(inputs[0].value, '')
  assert.equal(clear.disabled, true)
  view.unmount()
})

// ── ValueList ───────────────────────────────────────────────────────────────

test('ValueList: closed it is "N plural"; open, one copyable value per line', async () => {
  const view = mount(h(ValueList, { values: ['bc1qaaa', 'bc1qbbb', 'bc1qccc'], singular: 'address', plural: 'addresses' }))
  const toggle = view.container.querySelector('button[aria-expanded]') as HTMLButtonElement
  assert.equal(toggle.textContent, '3 addresses')
  await interact(() => toggle.click())
  const items = view.container.querySelectorAll('li')
  assert.equal(items.length, 3)
  assert.match(items[0].innerHTML, /select-all/)
  assert.equal(items[0].querySelector('button')!.getAttribute('aria-label'), 'Copy address')
  view.unmount()
  assert.match(renderToStaticMarkup(h(ValueList, { values: [], singular: 'a', plural: 'b' })), />None</)
  assert.match(renderToStaticMarkup(h(ValueList, { values: ['x'], singular: 'address', plural: 'addresses' })), /1 address</)
})

// ── EventTimeline ───────────────────────────────────────────────────────────

test('EventTimeline: an ordered list with pre-formatted duration and a <time>', () => {
  const markup = renderToStaticMarkup(
    h(EventTimeline, {
      label: 'Status history',
      events: [
        { id: 'a', label: 'Created', timestamp: '12:00:01', dateTime: '2026-09-30T12:00:01Z' },
        { id: 'b', label: 'Paid', duration: '+8s', timestamp: '12:00:09' },
      ],
    }),
  )
  assert.match(markup, /^<ol aria-label="Status history"/)
  assert.equal(markup.match(/<li /g)?.length, 2)
  assert.match(markup, /<time dateTime="2026-09-30T12:00:01Z">12:00:01<\/time>/)
  assert.match(markup, /\+8s/)
})

// ── ChecklistStep (SwapStepList) ────────────────────────────────────────────

test('a checklist step: done / to do / cannot be checked, never colour alone, with badges and an action', () => {
  const markup = renderToStaticMarkup(
    h(SwapStepList, {
      connector: false,
      steps: [
        { id: '1', label: 'Create an API key', status: 'done' },
        { id: '2', label: 'Register a webhook', status: 'pending', badges: h('span', null, 'Required'), action: h('button', null, 'Open settings') },
        { id: '3', label: 'SDK reports swaps', status: 'unknown' },
      ],
    }),
  )
  assert.match(markup, /<span class="sr-only">Done: <\/span>Create an API key/)
  assert.match(markup, /<span class="sr-only">To do: <\/span>Register a webhook/)
  assert.match(markup, /<span class="sr-only">Cannot be checked: <\/span>SDK reports swaps/)
  assert.match(markup, /Required/)
  assert.match(markup, /Open settings/)
  // Three different glyph treatments: check, number, question mark.
  assert.equal(markup.match(/<svg/g)?.length, 2)
  assert.match(markup, />2<\/span>/)
  assert.doesNotMatch(markup, /w-0\.5 flex-1/, 'a checklist has no connector')
})

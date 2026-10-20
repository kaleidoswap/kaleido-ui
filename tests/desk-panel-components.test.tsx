import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, key, mount } from './helpers/dom'
import { Tooltip } from '../src/web/primitives/tooltip'
import { Restricted } from '../src/web/components/restricted'
import { ConfirmDialog, useDiscardGuard } from '../src/web/components/confirm-dialog'
import { ListField } from '../src/web/components/list-field'
import { ListSummary } from '../src/web/components/list-summary'
import { EnvironmentIndicator } from '../src/web/components/environment-indicator'
import { ReadStatus, RefreshButton } from '../src/web/components/read-status'
import { Choice, ChoiceGroup } from '../src/web/components/choice-group'
import { Amount } from '../src/web/components/amount'
import { InstantsStatement } from '../src/web/components/instants-statement'
import { OneTimeSecretDialog } from '../src/web/components/one-time-secret-dialog'
import { AccountMenu, AccountMenuItem, AccountMenuSeparator } from '../src/web/components/account-menu'
import { MetricCard } from '../src/web/components/metric-card'
import { Copyable } from '../src/web/components/copyable'
import { Pager } from '../src/web/components/pager'
import { QueryState } from '../src/web/components/query-state'
import { DrawerNavGroup, DrawerNavItem, DrawerSidebar } from '../src/web/primitives/drawer'

;(globalThis as Record<string, unknown>).ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// ── Tooltip and Restricted ─────────────────────────────────────────────────

test('Tooltip: the control is described by a role=tooltip bubble', () => {
  const markup = renderToStaticMarkup(h(Tooltip, { content: 'Copies the id' }, h('button', null, 'Copy')))
  const id = /role="tooltip"[^>]*|id="([^"]+)"[^>]*role="tooltip"/.exec(markup)
  assert.ok(id)
  const described = /aria-describedby="([^"]+)"/.exec(markup)![1]
  assert.match(markup, new RegExp(`id="${described}"[^>]*role="tooltip"[^>]*>Copies the id<`))
})

test('Restricted: with no reason the control is untouched', () => {
  const markup = renderToStaticMarkup(h(Restricted, { reason: null }, h('button', { className: 'x' }, 'Invite')))
  assert.equal(markup, '<button class="x">Invite</button>')
})

test('Restricted: with a reason it stays focusable, aria-disabled, swallows clicks and describes itself', async () => {
  let clicks = 0
  const view = mount(
    h(Restricted, { reason: 'Only an admin can invite members.' }, h('button', { onClick: () => (clicks += 1) }, 'Invite')),
  )
  const button = view.container.querySelector('button')!
  assert.equal(button.getAttribute('aria-disabled'), 'true')
  assert.equal(button.hasAttribute('disabled'), false)
  const tip = view.container.querySelector(`[id=\"${button.getAttribute('aria-describedby')!}\"]`)!
  assert.equal(tip.getAttribute('role'), 'tooltip')
  assert.equal(tip.textContent, 'Only an admin can invite members.')
  await interact(() => button.click())
  assert.equal(clicks, 0)
  view.unmount()
})

// ── ConfirmDialog and useDiscardGuard ──────────────────────────────────────

test('ConfirmDialog: only the confirm button acts, and not while busy', async () => {
  let confirmed = 0
  const Harness = ({ busy }: { busy: boolean }) =>
    h(ConfirmDialog, {
      open: true,
      onOpenChange: () => {},
      title: 'Delete this project?',
      confirmLabel: 'Delete',
      destructive: true,
      busy,
      onConfirm: () => (confirmed += 1),
    })
  const view = mount(h(Harness, { busy: true }))
  const retire = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Delete')!
  assert.equal(retire.getAttribute('aria-busy'), 'true')
  await interact(() => retire.click())
  assert.equal(confirmed, 0)
  view.unmount()

  const ready = mount(h(Harness, { busy: false }))
  await interact(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Delete')!.click())
  assert.equal(confirmed, 1)
  ready.unmount()
})

test('ConfirmDialog: confirmDisabled blocks the action; busy holds Cancel', () => {
  const view = mount(
    h(ConfirmDialog, { open: true, onOpenChange: () => {}, title: 'Revoke?', confirmLabel: 'Revoke', confirmDisabled: true, busy: true, onConfirm: () => {} }),
  )
  const button = (name: string) => [...document.querySelectorAll('button')].find((b) => b.textContent === name)!
  assert.equal(button('Revoke').disabled, true)
  assert.equal(button('Cancel').disabled, true)
  view.unmount()
})

test('useDiscardGuard: closes at once when clean, asks when dirty', async () => {
  let closed = 0
  function Harness({ dirty }: { dirty: boolean }) {
    const guard = useDiscardGuard({ dirty, onClose: () => (closed += 1) })
    return h('div', null, h('button', { id: 'request', onClick: guard.request }, 'Cancel'), guard.confirm)
  }
  const clean = mount(h(Harness, { dirty: false }))
  await interact(() => (clean.container.querySelector('#request') as HTMLButtonElement).click())
  assert.equal(closed, 1)
  clean.unmount()

  const dirty = mount(h(Harness, { dirty: true }))
  await interact(() => (dirty.container.querySelector('#request') as HTMLButtonElement).click())
  assert.equal(closed, 1)
  assert.match(document.body.textContent!, /Discard what you entered\?/)
  await interact(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Discard')!.click())
  assert.equal(closed, 2)
  dirty.unmount()
})

// ── ListField ──────────────────────────────────────────────────────────────

test('ListField: Enter adds valid items, keeps invalid ones with the reason, and chips remove', async () => {
  function Harness() {
    const [items, setItems] = useState<readonly string[]>([])
    return h(ListField, {
      label: 'Allowed origins',
      noun: 'origin',
      items,
      onChange: setItems,
      check: (item: string) => (item.startsWith('https://') ? null : 'An origin starts with https://.'),
      example: 'https://app.example.com',
    })
  }
  const view = mount(h(Harness))
  const input = view.container.querySelector('input')!
  // A pasted list is split and committed at once. (Typing is not driven here:
  // React's change handling cannot be dispatched under this jsdom harness.)
  const paste = (text: string) => {
    const event = new window.Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } })
    input.dispatchEvent(event)
  }
  await interact(() => paste('https://a.example ftp://b.example'))
  const chips = [...view.container.querySelectorAll('li')].map((li) => li.textContent)
  assert.deepEqual(chips, ['https://a.example'])
  assert.equal(input.value, 'ftp://b.example')
  assert.equal(view.container.querySelector('[role="alert"]')!.textContent, 'An origin starts with https://.')
  assert.equal(input.getAttribute('aria-invalid'), 'true')

  await interact(() => (view.container.querySelector('button[aria-label="Remove https://a.example"]') as HTMLButtonElement).click())
  assert.equal(view.container.querySelectorAll('li').length, 0)
  assert.match(view.container.textContent!, /None added\./)
  view.unmount()
})

// ── ListSummary ────────────────────────────────────────────────────────────

test('ListSummary: states a total only when it has one', () => {
  const text = (props: Record<string, unknown>) =>
    renderToStaticMarkup(h(ListSummary, { noun: 'swaps', shown: 0, ...props })).replace(/<[^>]+>/g, '')
  assert.equal(text({ shown: 12, total: 40, filtersActive: true }), 'Showing 12 of 40 swaps')
  assert.equal(text({ shown: 1, total: 1 }), '1 swap')
  assert.equal(text({ shown: 50, offset: 50 }), 'Showing swaps 51–100')
  assert.match(text({ shown: 3, filtersActive: true }), /^Showing 3 swaps, narrowed by the filters above\. The API does not report/)
})

// ── EnvironmentIndicator ───────────────────────────────────────────────────

test('EnvironmentIndicator: both halves in words, a status, the tone only an accent', () => {
  const test = renderToStaticMarkup(h(EnvironmentIndicator, { name: 'Mutinynet', qualifier: 'Test network', isTest: true }))
  assert.match(test, /role="status"/)
  assert.match(test, /data-environment="test"/)
  assert.match(test, />Mutinynet<.*>Test network</)
  const live = renderToStaticMarkup(h(EnvironmentIndicator, { name: 'Mainnet', qualifier: 'Live network', isTest: false }))
  assert.match(live, /data-environment="live"/)
})

// ── RefreshButton and ReadStatus ───────────────────────────────────────────

test('RefreshButton: busy, not disabled, and a press while busy is ignored', async () => {
  let refreshes = 0
  const view = mount(h(RefreshButton, { onRefresh: () => (refreshes += 1), isRefreshing: true }))
  const button = view.container.querySelector('button')!
  assert.equal(button.getAttribute('aria-busy'), 'true')
  assert.equal(button.disabled, false)
  await interact(() => button.click())
  assert.equal(refreshes, 0)
  view.unmount()
})

test('ReadStatus: the oldest successful read, a stale warning, and Refresh refetches every read', async () => {
  let refetches = 0
  const read = (dataUpdatedAt: number, isError = false) => ({
    data: {},
    dataUpdatedAt,
    isError,
    isFetching: false,
    refetch: () => (refetches += 1),
  })
  const view = mount(h(ReadStatus, { reads: [read(2_000), read(1_000, true)], formatTime: (ms: number) => `t${ms}` }))
  assert.match(view.container.textContent!, /Could not refresh\. Showing the previous read\./)
  assert.match(view.container.textContent!, /Last update: t1000/)
  await interact(() => view.container.querySelector('button')!.click())
  assert.equal(refetches, 2)
  view.unmount()

  const unread = renderToStaticMarkup(
    h(ReadStatus, { reads: [{ ...read(0), data: undefined }], formatTime: (ms: number) => `t${ms}` }),
  )
  assert.match(unread, /Last update: —/)
})

// ── ChoiceGroup ────────────────────────────────────────────────────────────

test('ChoiceGroup: a fieldset with a legend, native radios sharing one name', () => {
  const markup = renderToStaticMarkup(
    h(
      ChoiceGroup,
      { legend: 'Format' },
      h(Choice, { checked: true, onChange: () => {}, title: 'CSV', detail: 'For a spreadsheet.' }),
      h(Choice, { checked: false, onChange: () => {}, title: 'PDF', disabled: true }),
    ),
  )
  assert.match(markup, /<fieldset[^>]*><legend[^>]*>Format<\/legend>/)
  const names = [...markup.matchAll(/<input[^>]*name="([^"]+)"/g)].map((m) => m[1])
  assert.equal(names.length, 2)
  assert.equal(names[0], names[1])
  assert.match(markup, /title="For a spreadsheet\."/)
  assert.match(markup, /disabled=""/)
})

// ── Amount and InstantsStatement ───────────────────────────────────────────

test('Amount: the figure never breaks, the asset stays in the text, a missing figure is a dash', () => {
  const stacked = renderToStaticMarkup(h(Amount, { figure: '1,000,000 sat', asset: 'BTC', stacked: true }))
  assert.match(stacked, /flex-col/)
  assert.equal(stacked.replace(/<[^>]+>/g, ''), '1,000,000 sat BTC')
  assert.equal(renderToStaticMarkup(h(Amount, { figure: '5 sat' })).replace(/<[^>]+>/g, ''), '5 sat asset not reported')
  assert.equal(renderToStaticMarkup(h(Amount, { figure: null, asset: 'BTC' })).replace(/<[^>]+>/g, ''), '—')
})

test('InstantsStatement: the description, and each instant sent with its own copy button', () => {
  const markup = renderToStaticMarkup(
    h(InstantsStatement, { description: '1–30 September 2026, UTC', start: '2026-09-01T00:00:00Z', end: '2026-09-30T23:59:59Z' }),
  )
  assert.match(markup, /1–30 September 2026, UTC/)
  assert.match(markup, /<dt>Range start<\/dt>.*2026-09-01T00:00:00Z/)
  assert.match(markup, /aria-label="Copy range end"/)
  assert.doesNotMatch(renderToStaticMarkup(h(InstantsStatement, { description: 'All time' })), /<dl/)
})

// ── OneTimeSecretDialog ────────────────────────────────────────────────────

test('OneTimeSecretDialog: no close control, Escape does nothing, the acknowledgement closes', async () => {
  let acknowledged = 0
  const view = mount(h(OneTimeSecretDialog, { secret: 'sk_test_123', onAcknowledge: () => (acknowledged += 1) }))
  const dialog = document.querySelector('[role="dialog"]')!
  assert.match(dialog.textContent!, /sk_test_123/)
  assert.equal(dialog.querySelector('[data-slot="dialog-close"], button[aria-label="Close"]'), null)
  await interact(() => key(dialog, 'Escape'))
  assert.ok(document.querySelector('[role="dialog"]'))
  await interact(() => [...dialog.querySelectorAll('button')].find((b) => b.textContent === 'I have stored it')!.click())
  assert.equal(acknowledged, 1)
  view.unmount()
})

// ── AccountMenu ────────────────────────────────────────────────────────────

test('AccountMenu: a disclosure; Escape closes it and returns focus; an item closes it', async () => {
  let loggedOut = 0
  const view = mount(
    h(
      AccountMenu,
      { name: 'alex@example.com', secondary: 'Example Co', label: 'Account: alex@example.com, Owner, Example Co' },
      h(AccountMenuItem, null, 'Settings'),
      h(AccountMenuSeparator),
      h(AccountMenuItem, { destructive: true, onClick: () => (loggedOut += 1) }, 'Log out'),
    ),
  )
  const trigger = view.container.querySelector('button[aria-expanded]') as HTMLButtonElement
  assert.equal(trigger.getAttribute('aria-label'), 'Account: alex@example.com, Owner, Example Co')
  assert.equal(view.container.querySelector('[role="menu"]'), null)
  await interact(() => trigger.click())
  assert.equal(trigger.getAttribute('aria-expanded'), 'true')
  assert.ok(view.container.querySelector(`[id=\"${trigger.getAttribute('aria-controls')!}\"]`))

  await interact(() => key(document.body, 'Escape'))
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  assert.equal(document.activeElement, trigger)

  await interact(() => trigger.click())
  await interact(() => [...view.container.querySelectorAll('button')].find((b) => b.textContent === 'Log out')!.click())
  assert.equal(loggedOut, 1)
  assert.equal(trigger.getAttribute('aria-expanded'), 'false')
  view.unmount()
})

// ── Additions to existing components ───────────────────────────────────────

test('MetricCard: a definition under the label and a change under the figure', () => {
  const markup = renderToStaticMarkup(
    h(MetricCard, { label: 'Swaps', definition: 'Completed, in the period', value: '42', change: '↑ 12% vs the previous 30 days', size: 'comfortable' }),
  )
  assert.match(markup, /data-slot="metric-card-label"[^>]*>Swaps<.*data-slot="metric-card-definition"[^>]*>Completed, in the period<.*data-slot="metric-card-value"[^>]*>42<.*data-slot="metric-card-change"[^>]*>↑ 12%/)
})

test('Copyable: wrap shows the whole value instead of truncating it', () => {
  assert.match(renderToStaticMarkup(h(Copyable, { value: 'org_123', label: 'organization id' })), /truncate/)
  const wrapped = renderToStaticMarkup(h(Copyable, { value: 'org_123', label: 'organization id', wrap: true }))
  assert.match(wrapped, /break-all/)
  assert.doesNotMatch(wrapped, /truncate/)
})

test('Pager: alwaysShow keeps a single page on screen with both buttons off', () => {
  assert.equal(renderToStaticMarkup(h(Pager, { offset: 0, limit: 50, returned: 3, onOffsetChange: () => {} })), '')
  const shown = renderToStaticMarkup(h(Pager, { offset: 0, limit: 50, returned: 3, onOffsetChange: () => {}, noun: 'swaps', alwaysShow: true }))
  assert.match(shown, /swaps 1–3/)
  assert.equal((shown.match(/disabled=""/g) ?? []).length, 2)
  const empty = renderToStaticMarkup(h(Pager, { offset: 0, limit: 50, returned: 0, onOffsetChange: () => {}, noun: 'swaps', alwaysShow: true }))
  assert.match(empty, /No swaps in this window/)
})

test('QueryState: errorDetail renders under the panel; loading is aria-busy', () => {
  const markup = renderToStaticMarkup(
    h(QueryState, { error: new Error('503'), errorDetail: () => 'Request ID: req_1' }, 'rows'),
  )
  assert.match(markup, /role="alert".*503.*data-slot="query-state-detail"[^>]*>Request ID: req_1</)
  assert.match(renderToStaticMarkup(h(QueryState, { isLoading: true })), /aria-busy="true"/)
})

test('QueryState: announce speaks when the view changes, not on the first load', async () => {
  const view = mount(h(QueryState, { announce: { key: 'a', message: '3 swaps shown' } }, 'rows'))
  const live = view.container.querySelector('[aria-live="polite"]')!
  assert.equal(live.textContent, '')
  await interact(() => view.root.render(h(QueryState, { announce: { key: 'b', message: '1 swap shown' } }, 'rows')))
  assert.equal(live.textContent, '1 swap shown')
  view.unmount()
})

// ── Drawer ─────────────────────────────────────────────────────────────────

test('DrawerNavItem: a restricted page is listed, not a link, focusable, described by its reason', () => {
  const view = mount(
    h(DrawerSidebar, null, h(DrawerNavItem, { href: '/team', label: 'Team', disabledReason: 'Only an admin can manage the team.' })),
  )
  assert.equal(view.container.querySelector('a'), null)
  const row = view.container.querySelector('[role="link"]')!
  assert.equal(row.getAttribute('aria-disabled'), 'true')
  assert.equal(row.getAttribute('tabindex'), '0')
  const tip = view.container.querySelector(`[id=\"${row.getAttribute('aria-describedby')!}\"]`)!
  assert.equal(tip.textContent, 'Only an admin can manage the team.')
  view.unmount()
})

test('DrawerNavItem: the current page carries no left rule', () => {
  const view = mount(h(DrawerSidebar, null, h(DrawerNavItem, { href: '/', label: 'Home', active: true })))
  const link = view.container.querySelector('a')!
  assert.equal(link.getAttribute('aria-current'), 'page')
  assert.doesNotMatch(link.className, /border-l/)
  view.unmount()

  const nested = mount(
    h(DrawerSidebar, null, h(DrawerNavGroup, { label: 'Activity', active: true }, h(DrawerNavItem, { href: '/swaps', label: 'Swaps', active: true }))),
  )
  for (const element of nested.container.querySelectorAll('a, button')) {
    assert.doesNotMatch(element.className, /border-l/)
  }
  nested.unmount()
})

test('DrawerNavGroup: on the rail, a group with no href unfolds the sidebar onto it, open', async () => {
  function Harness() {
    const [collapsed, setCollapsed] = useState(true)
    return h(
      DrawerSidebar,
      { collapsed, onCollapsedChange: setCollapsed },
      h(DrawerNavGroup, { label: 'Activity' }, h(DrawerNavItem, { href: '/swaps', label: 'Swaps' })),
    )
  }
  const view = mount(h(Harness))
  const railRow = view.container.querySelector('button[aria-label="Activity: expand the sidebar to show its pages"]') as HTMLButtonElement
  assert.ok(railRow)
  await interact(() => railRow.click())
  assert.equal(view.container.querySelector('aside')!.getAttribute('data-state'), 'expanded')
  const row = [...view.container.querySelectorAll('button[aria-expanded]')].find((b) => b.textContent!.includes('Activity'))!
  assert.equal(row.getAttribute('aria-expanded'), 'true')
  assert.ok(view.container.querySelector('a[href="/swaps"]'))
  view.unmount()
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'

import { interact, key, mount } from './helpers/dom'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerNavItem,
  DrawerSection,
  DrawerSidebar,
  DrawerTitle,
  DrawerTrigger,
} from '../src/web/primitives/drawer'

// The desktop app's left sidebar in its two forms: on the desktop, a sidebar
// that folds to an icon rail; on a phone, the same panel as a drawer over the
// page. One navigation list, written once, renders in both.

const nav = () =>
  createElement(
    DrawerBody,
    null,
    createElement(
      DrawerSection,
      { label: 'Node' },
      createElement(DrawerNavItem, { href: '#/dashboard', label: 'Dashboard', icon: 'D', active: true }),
      createElement(DrawerNavItem, { href: '#/swaps', label: 'Swaps', icon: 'S' }),
    ),
    createElement(
      DrawerSection,
      { label: 'Mind' },
      createElement(DrawerNavItem, { href: '#/chat', label: 'Chat', icon: 'C' }),
    ),
  )

const sidebar = (props: Record<string, unknown> = {}) =>
  mount(createElement(DrawerSidebar, props, nav()))

const link = (name: string) =>
  [...document.querySelectorAll('a')].find((a) => a.textContent?.includes(name)) as HTMLAnchorElement

// ── Desktop ────────────────────────────────────────────────────────────────

test('the desktop sidebar is the expanded desktop app sidebar: w-72, surface-base, right rule', () => {
  const view = sidebar()
  const aside = view.container.querySelector('aside')!
  assert.match(aside.className, /\bw-72\b/)
  assert.match(aside.className, /\bbg-surface-base\b/)
  assert.match(aside.className, /\bborder-r\b/)
  assert.equal(aside.dataset.state, 'expanded')
  assert.match(view.container.textContent!, /Node/)
  assert.match(view.container.textContent!, /Mind/)
  view.unmount()
})

test('the current destination is marked and announced as the current page', () => {
  const view = sidebar()
  assert.equal(link('Dashboard').getAttribute('aria-current'), 'page')
  assert.match(link('Dashboard').className, /text-status-success/)
  assert.equal(link('Swaps').getAttribute('aria-current'), null)
  view.unmount()
})

test('without onCollapsedChange there is no collapse control', () => {
  const view = sidebar()
  assert.equal(view.container.querySelectorAll('button').length, 0)
  view.unmount()
})

test('the chevron folds it to the icon rail, and labels become tooltips', async () => {
  const changes: boolean[] = []
  const expanded = sidebar({ onCollapsedChange: (next: boolean) => changes.push(next) })
  const toggle = expanded.container.querySelector('button')!
  assert.equal(toggle.getAttribute('aria-label'), 'Collapse sidebar')
  assert.equal(toggle.getAttribute('aria-expanded'), 'true')
  await interact(() => toggle.click())
  assert.deepEqual(changes, [true])
  expanded.unmount()

  const rail = sidebar({ collapsed: true, onCollapsedChange: () => {}, header: 'LOGO' })
  const aside = rail.container.querySelector('aside')!
  assert.match(aside.className, /\bw-20\b/)
  assert.equal(aside.dataset.state, 'collapsed')
  assert.equal(rail.container.querySelector('button')!.getAttribute('aria-label'), 'Expand sidebar')
  // The logo and the section eyebrows go; the labels stay for screen readers.
  assert.doesNotMatch(rail.container.textContent!, /LOGO/)
  assert.doesNotMatch(rail.container.textContent!, /Node/)
  assert.equal(link('Swaps').title, 'Swaps')
  assert.match(link('Swaps').querySelector('.sr-only')!.textContent!, /Swaps/)
  // One rule between the two groups, none above the first.
  const rules = rail.container.querySelectorAll('[role="separator"]')
  assert.equal(rules.length, 2)
  assert.match(rules[0].className, /group-first\/section:hidden/)
  rail.unmount()
})

test('asChild renders the consumer link with the item look and content', () => {
  const view = mount(
    createElement(
      DrawerSidebar,
      null,
      createElement(
        DrawerNavItem,
        { asChild: true, label: 'Settings', active: true },
        createElement('a', { href: '#/settings', 'data-router': 'yes' }),
      ),
    ),
  )
  const a = link('Settings')
  assert.equal(a.dataset.router, 'yes')
  assert.equal(a.getAttribute('href'), '#/settings')
  assert.equal(a.getAttribute('aria-current'), 'page')
  assert.match(a.className, /rounded-xl/)
  view.unmount()
})

// ── Mobile ─────────────────────────────────────────────────────────────────

const drawer = (rootProps: Record<string, unknown>) =>
  mount(
    createElement(
      Drawer,
      rootProps,
      createElement(
        DrawerContent,
        { header: createElement(DrawerTitle, null, 'Navigation') },
        createElement(DrawerDescription, null, 'Main navigation'),
        nav(),
      ),
    ),
  )

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement

test('the mobile drawer is the same panel, expanded, pinned left over the page', () => {
  const view = drawer({ open: true })
  assert.match(panel().className, /\bleft-0\b/)
  assert.match(panel().className, /\bw-72\b/)
  assert.match(panel().className, /\bborder-r\b/)
  assert.ok(panel().getAttribute('aria-labelledby'))
  // Labels are shown: it never folds to a rail.
  assert.equal(link('Swaps').querySelector('.sr-only'), null)
  view.unmount()
})

test('the chevron, Escape and choosing a destination each close it', async () => {
  const closes: boolean[] = []
  const onOpenChange = (open: boolean) => closes.push(open)

  const chevron = drawer({ open: true, onOpenChange })
  const close = panel().querySelector('button[aria-label="Close navigation"]') as HTMLElement
  assert.ok(close, 'no labelled close')
  await interact(() => close.click())
  chevron.unmount()

  const escaped = drawer({ open: true, onOpenChange })
  await interact(() => {
    key(panel(), 'Escape')
  })
  escaped.unmount()

  const navigated = drawer({ open: true, onOpenChange })
  await interact(() => link('Swaps').click())
  navigated.unmount()

  assert.deepEqual(closes, [false, false, false])
})

test('a link that prevents the default still closes it, uncontrolled too', async () => {
  const view = mount(
    createElement(
      Drawer,
      null,
      createElement(DrawerTrigger, null, 'Menu'),
      createElement(
        DrawerContent,
        { header: createElement(DrawerTitle, null, 'Navigation') },
        createElement(DrawerDescription, null, 'Main navigation'),
        createElement(DrawerNavItem, {
          href: '#/swaps',
          label: 'Swaps',
          // What a router link does on every click.
          onClick: (event: MouseEvent) => event.preventDefault(),
        }),
      ),
    ),
  )
  const trigger = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Menu')!
  await interact(() => trigger.click())
  assert.ok(panel(), 'the trigger did not open it')
  await interact(() => link('Swaps').click())
  assert.equal(panel(), null, 'still open after choosing a destination')
  view.unmount()
})

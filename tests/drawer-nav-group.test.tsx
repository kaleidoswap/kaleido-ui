import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'

import { interact, mount } from './helpers/dom'
import { DrawerNavGroup, DrawerNavItem, DrawerSidebar } from '../src/web/primitives/drawer'

// A navigation row with a submenu, as the desktop app's Trade and Liquidity:
// the row shows and hides its pages, opens by itself on one of them, goes to
// its first page when it opens, and on the icon rail is a link that unfolds
// the sidebar.

const group = (
  props: Record<string, unknown>,
  collapsed = false,
  onCollapsedChange?: (collapsed: boolean) => void,
) =>
  mount(
    h(
      DrawerSidebar,
      { collapsed, onCollapsedChange },
      h(
        DrawerNavGroup,
        { label: 'Flows', ...props },
        h(DrawerNavItem, { href: '#/activity', label: 'Activity', active: props.active === true }),
        h(DrawerNavItem, { href: '#/deposit', label: 'Deposit' }),
      ),
    ),
  )

test('a closed group hides its pages; its row opens and closes them', async () => {
  const view = group({})
  const row = view.container.querySelector('button[aria-expanded]')!
  assert.equal(row.getAttribute('aria-expanded'), 'false')
  assert.equal(view.container.querySelectorAll('a').length, 0)

  await interact(() => (row as HTMLButtonElement).click())
  assert.equal(row.getAttribute('aria-expanded'), 'true')
  const links = [...view.container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
  assert.deepEqual(links, ['#/activity', '#/deposit'])
  assert.equal(row.getAttribute('aria-controls'), view.container.querySelector('[id]:not(button)')?.id)

  await interact(() => (row as HTMLButtonElement).click())
  assert.equal(view.container.querySelectorAll('a').length, 0)
  view.unmount()
})

test('a group holding the current page opens by itself and is marked', () => {
  const view = group({ active: true, href: '#/activity' })
  const row = view.container.querySelector('button[aria-expanded]')!
  assert.equal(row.getAttribute('aria-expanded'), 'true')
  assert.match(row.className, /text-status-success/)
  const current = view.container.querySelector('a[aria-current="page"]')!
  assert.equal(current.textContent, 'Activity')
  // A submenu row is the smaller, indented one.
  assert.match(current.className, /text-caption/)
  view.unmount()
})

test('a closed group with a first page links there, and opening it shows the submenu', async () => {
  const view = group({ href: '#/activity' })
  const row = view.container.querySelector('a[aria-expanded]') as HTMLAnchorElement
  assert.equal(row.getAttribute('href'), '#/activity')
  assert.equal(row.getAttribute('aria-expanded'), 'false')

  await interact(() => row.click())
  // Open, it is a button again: activating it closes the submenu.
  const open = view.container.querySelector('button[aria-expanded]')!
  assert.equal(open.getAttribute('aria-expanded'), 'true')
  const links = [...view.container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
  assert.deepEqual(links, ['#/activity', '#/deposit'])
  view.unmount()
})

test('on the icon rail the row is a link to its first page, named for assistive tech', () => {
  const view = group({ href: '#/activity' }, true)
  assert.equal(view.container.querySelector('button[aria-expanded]'), null)
  const link = view.container.querySelector('a')!
  assert.equal(link.getAttribute('href'), '#/activity')
  assert.equal(link.getAttribute('title'), 'Flows')
  assert.match(link.textContent!, /Flows/)
  view.unmount()
})

test('choosing a group on the icon rail unfolds the sidebar', async () => {
  const calls: boolean[] = []
  const view = group({ href: '#/activity' }, true, (collapsed) => calls.push(collapsed))
  await interact(() => (view.container.querySelector('a[href="#/activity"]') as HTMLAnchorElement).click())
  assert.deepEqual(calls, [false])
  view.unmount()
})

test('railHref still names the first page', () => {
  const view = group({ railHref: '#/activity' }, true)
  assert.equal(view.container.querySelector('a')!.getAttribute('href'), '#/activity')
  view.unmount()
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'

import { interact, mount } from './helpers/dom'
import { DrawerNavGroup, DrawerNavItem, DrawerSidebar } from '../src/web/primitives/drawer'

// A navigation row with a submenu, as the desktop app's Trade and Liquidity:
// the row shows and hides its pages, opens by itself on one of them, and on
// the icon rail is a link instead.

const group = (props: Record<string, unknown>, collapsed = false) =>
  mount(
    h(
      DrawerSidebar,
      { collapsed },
      h(
        DrawerNavGroup,
        { label: 'Flows', railHref: '#/activity', ...props },
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
  const view = group({ active: true })
  const row = view.container.querySelector('button[aria-expanded]')!
  assert.equal(row.getAttribute('aria-expanded'), 'true')
  assert.match(row.className, /text-status-success/)
  const current = view.container.querySelector('a[aria-current="page"]')!
  assert.equal(current.textContent, 'Activity')
  // A submenu row is the smaller, indented one.
  assert.match(current.className, /text-caption/)
  view.unmount()
})

test('on the icon rail the row is a link to its first page, named for assistive tech', () => {
  const view = group({}, true)
  assert.equal(view.container.querySelector('button[aria-expanded]'), null)
  const link = view.container.querySelector('a')!
  assert.equal(link.getAttribute('href'), '#/activity')
  assert.equal(link.getAttribute('title'), 'Flows')
  assert.match(link.textContent!, /Flows/)
  view.unmount()
})

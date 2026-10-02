import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, mount } from './helpers/dom'
import { NoticeBar } from '../src/web/components/notice-bar'
import { FloatingNotice } from '../src/web/components/floating-notice'

const root = () => document.documentElement.style

test('NoticeBar publishes its height on the root and removes it when hidden or unmounted', async () => {
  let notify: (() => void) | undefined
  ;(globalThis as Record<string, unknown>).ResizeObserver = class {
    constructor(callback: () => void) {
      notify = callback
    }
    observe() {}
    disconnect() {}
  }
  let height = 48
  const original = window.HTMLElement.prototype.getBoundingClientRect
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    return { height, width: 800, top: 0, left: 0, right: 800, bottom: height, x: 0, y: 0, toJSON() {} } as DOMRect
  }

  function Harness() {
    const [hidden, setHidden] = useState(false)
    return h('div', null,
      h('button', { onClick: () => setHidden(!hidden) }, 'toggle'),
      h(NoticeBar, { hidden }, h('p', null, 'Read-only while we migrate')),
    )
  }
  const view = mount(h(Harness))
  assert.equal(root().getPropertyValue('--kui-notice-height'), '48px')
  height = 72
  await interact(() => notify?.())
  assert.equal(root().getPropertyValue('--kui-notice-height'), '72px')
  await interact(() => (view.container.querySelector('button') as HTMLButtonElement).click())
  assert.equal(root().getPropertyValue('--kui-notice-height'), '')
  assert.equal(view.container.querySelector('[data-slot="notice-bar"]'), null)
  await interact(() => (view.container.querySelector('button') as HTMLButtonElement).click())
  assert.equal(root().getPropertyValue('--kui-notice-height'), '72px')
  view.unmount()
  assert.equal(root().getPropertyValue('--kui-notice-height'), '')

  const custom = mount(h(NoticeBar, { heightVariable: '--banner-h' }, 'x'))
  assert.equal(root().getPropertyValue('--banner-h'), '72px')
  custom.unmount()
  window.HTMLElement.prototype.getBoundingClientRect = original
  delete (globalThis as Record<string, unknown>).ResizeObserver
})

test('NoticeBar is fixed, full width, with no text of its own', () => {
  const markup = renderToStaticMarkup(h(NoticeBar, null, h('span', null, 'content')))
  assert.match(markup, /class="fixed inset-x-0 top-0/)
  assert.equal(markup.replace(/<[^>]+>/g, ''), 'content')
})

test('FloatingNotice: a status on an opaque card, dismissible by a named X', async () => {
  let dismissed = 0
  const view = mount(h(FloatingNotice, { onDismiss: () => (dismissed += 1) }, h('p', null, 'Testnet funds only')))
  const notice = view.container.querySelector('[data-slot="floating-notice"]')!
  assert.equal(notice.getAttribute('role'), 'status')
  assert.match(notice.className, /bg-card/)
  assert.match(notice.className, /fixed bottom-4/)
  const close = view.container.querySelector('button[aria-label="Dismiss"]') as HTMLButtonElement
  await interact(() => close.click())
  assert.equal(dismissed, 1)
  view.unmount()

  const fixed = renderToStaticMarkup(h(FloatingNotice, { onDismiss: () => undefined, dismissible: false }, 'x'))
  assert.doesNotMatch(fixed, /<button/)
  const alert = renderToStaticMarkup(h(FloatingNotice, { role: 'alert', dismissLabel: 'Schließen', onDismiss: () => undefined }, 'x'))
  assert.match(alert, /role="alert"/)
  assert.match(alert, /aria-label="Schließen"/)
})

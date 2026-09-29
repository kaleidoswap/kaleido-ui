import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'

import { interact, mount } from './helpers/dom'
import { CopyButton } from '../src/web/components/copy-button'

const setClipboard = (writeText?: (value: string) => Promise<void>) =>
  Object.defineProperty(navigator, 'clipboard', {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  })

// A long reset by default, so a loaded machine cannot clear the state before
// the assertion reads it; the reset itself is tested with a short one.
const render = (resetAfter = 60_000) => {
  const view = mount(h(CopyButton, { value: 'kx_live_1234', label: 'API key prefix', resetAfter }))
  const button = view.container.querySelector('button')!
  const status = view.container.querySelector('[role="status"]')!
  return { view, button, status }
}

test('it is a real, named button', () => {
  setClipboard(async () => undefined)
  const { view, button } = render()
  assert.equal(button.tagName, 'BUTTON')
  assert.equal(button.getAttribute('type'), 'button')
  assert.equal(button.getAttribute('aria-label'), 'Copy API key prefix')
  view.unmount()
})

test('a successful write shows a check and announces Copied', async () => {
  const written: string[] = []
  setClipboard(async (value) => void written.push(value))
  const { view, button, status } = render()
  await interact(() => button.click())
  assert.deepEqual(written, ['kx_live_1234'])
  assert.equal(status.textContent, 'Copied')
  assert.equal(view.container.querySelector('[data-slot="copy-button"]')!.getAttribute('data-status'), 'copied')
  view.unmount()
})

test('the state clears after resetAfter', async () => {
  setClipboard(async () => undefined)
  const { view, button, status } = render(20)
  await interact(() => button.click())
  await interact(() => new Promise((resolve) => setTimeout(resolve, 300)))
  assert.equal(status.textContent, '')
  view.unmount()
})

test('a rejected write says so, and never says Copied', async () => {
  setClipboard(async () => {
    throw new DOMException('Denied', 'NotAllowedError')
  })
  const { view, button, status } = render()
  await interact(() => button.click())
  assert.match(status.textContent!, /Could not copy/)
  assert.doesNotMatch(view.container.innerHTML, />Copied</)
  assert.match(view.container.textContent!, /select the text instead/)
  view.unmount()
})

test('no clipboard at all (insecure context) is a failure too', async () => {
  setClipboard(undefined)
  const { view, button, status } = render()
  await interact(() => button.click())
  assert.match(status.textContent!, /Could not copy/)
  view.unmount()
})

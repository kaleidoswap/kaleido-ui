import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'

import { interact, mount } from './helpers/dom'
import { CopyButton } from '../src/web/components/copy-button'
import { Copyable } from '../src/web/components/copyable'
import { CodeBlock } from '../src/web/components/code-block'
import { ActivityDetailRow } from '../src/web/components/activity-detail-row'
import { SecretRevealCard } from '../src/web/components/secret-reveal-card'
import { RecoveryPhraseCard } from '../src/web/components/recovery-phrase-card'
import { useCopyToClipboard, type UseCopyToClipboard } from '../src/web/hooks/use-copy-to-clipboard'

const setClipboard = (writeText?: (value: string) => Promise<void>) =>
  Object.defineProperty(navigator, 'clipboard', {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  })
const written: string[] = []
const accept = () => setClipboard(async (value) => void written.push(value))
const reject = () =>
  setClipboard(async () => {
    throw new DOMException('Denied', 'NotAllowedError')
  })

// ── useCopyToClipboard ──────────────────────────────────────────────────────

function hookProbe() {
  const box: { current?: UseCopyToClipboard } = {}
  function Probe() {
    box.current = useCopyToClipboard()
    return null
  }
  return { box, view: mount(h(Probe)) }
}

test('the hook reports copied only when the write succeeded, and has no timer', async () => {
  accept()
  const { box, view } = hookProbe()
  assert.equal(box.current!.state, 'idle')
  await interact(async () => void (await box.current!.copy('abc')))
  assert.equal(box.current!.state, 'copied')
  await interact(() => new Promise((resolve) => setTimeout(resolve, 60)))
  assert.equal(box.current!.state, 'copied', 'went back to idle on its own')
  await interact(() => box.current!.reset())
  assert.equal(box.current!.state, 'idle')
  view.unmount()
})

test('a rejected write and a missing clipboard both end in failed', async () => {
  reject()
  const { box, view } = hookProbe()
  let heard: unknown
  await interact(async () => void (await box.current!.copy('abc', { onError: (error) => (heard = error) })))
  assert.equal(box.current!.state, 'failed')
  assert.ok(heard instanceof Error || heard instanceof DOMException)
  setClipboard(undefined)
  await interact(() => box.current!.reset())
  await interact(async () => void (await box.current!.copy('abc')))
  assert.equal(box.current!.state, 'failed')
  view.unmount()
})

// ── CopyButton ──────────────────────────────────────────────────────────────

const renderButton = (props: Record<string, unknown> = {}) => {
  const view = mount(h(CopyButton, { value: 'tx_81f2a9c0', label: 'transaction id', ...props }))
  return {
    view,
    button: view.container.querySelector('button')!,
    live: view.container.querySelector('[aria-live="polite"]')!,
  }
}

test('the small quiet icon button, named for what it copies', () => {
  accept()
  const { view, button } = renderButton()
  assert.equal(button.getAttribute('type'), 'button')
  assert.equal(button.getAttribute('aria-label'), 'Copy transaction id')
  assert.match(button.className, /\bsize-7\b/)
  view.unmount()
})

test('a success shows the check and announces it; the click does not reach the row', async () => {
  written.length = 0
  accept()
  let rowClicks = 0
  const view = mount(
    h('div', { onClick: () => (rowClicks += 1) }, h(CopyButton, { value: 'tx_81f2a9c0', label: 'transaction id' })),
  )
  await interact(() => view.container.querySelector('button')!.click())
  assert.deepEqual(written, ['tx_81f2a9c0'])
  assert.equal(rowClicks, 0)
  assert.equal(view.container.querySelector('[aria-live="polite"]')!.textContent, 'transaction id copied to the clipboard')
  assert.equal(view.container.querySelector('[data-slot="copy-button"]')!.getAttribute('data-status'), 'copied')
  view.unmount()
})

test('a failure says so as an alert, and never says copied', async () => {
  reject()
  const { view, button, live } = renderButton()
  await interact(() => button.click())
  const alert = view.container.querySelector('[role="alert"]')!
  assert.equal(alert.textContent, 'Copy failed — select it and copy by hand.')
  assert.equal(live.textContent, '')
  assert.doesNotMatch(view.container.textContent!, /copied/)
  view.unmount()
})

test('the failure message and names can be overridden', async () => {
  setClipboard(undefined)
  const { view, button } = renderButton({ failedMessage: 'Kopieren fehlgeschlagen', copyLabel: 'ID kopieren' })
  assert.equal(button.getAttribute('aria-label'), 'ID kopieren')
  await interact(() => button.click())
  assert.equal(view.container.querySelector('[role="alert"]')!.textContent, 'Kopieren fehlgeschlagen')
  view.unmount()
})

// ── Copyable and CodeBlock ──────────────────────────────────────────────────

test('Copyable shows a short form and copies the whole value', async () => {
  written.length = 0
  accept()
  const view = mount(h(Copyable, { value: 'sw_0123456789abcdef', label: 'swap id' }, 'sw_0123…cdef'))
  const text = view.container.querySelector('[title]')!
  assert.equal(text.getAttribute('title'), 'sw_0123456789abcdef')
  assert.match(text.className, /select-all/)
  assert.equal(text.textContent, 'sw_0123…cdef')
  await interact(() => view.container.querySelector('button')!.click())
  assert.deepEqual(written, ['sw_0123456789abcdef'])
  view.unmount()
})

test('CodeBlock is a scrolling pre with a copy button and an optional language label', async () => {
  written.length = 0
  accept()
  const view = mount(h(CodeBlock, { code: 'npm i kaleido-ui', label: 'install command', language: 'bash' }))
  assert.match(view.container.querySelector('pre')!.className, /overflow-x-auto/)
  assert.equal(view.container.querySelector('figcaption')!.textContent, 'bash')
  assert.equal(view.container.querySelector('button')!.getAttribute('aria-label'), 'Copy install command')
  await interact(() => view.container.querySelector('button')!.click())
  assert.deepEqual(written, ['npm i kaleido-ui'])
  view.unmount()
})

// ── The destructive toast's copy button ─────────────────────────────────────

test('the destructive toast no longer says Copied when the copy failed', async () => {
  const { Toaster } = await import('../src/web/primitives/toaster')
  const { toast } = await import('../src/web/hooks/use-toast')
  reject()
  const view = mount(h(Toaster))
  // A long finite duration: `Infinity` overflows setTimeout to 1ms and closes the toast at once.
  await interact(() => void toast({ title: 'Swap failed', description: 'Route expired', variant: 'destructive', duration: 60_000 }))
  const copy = document.querySelector('button[aria-label="Copy error"]') as HTMLButtonElement
  assert.ok(copy, 'no copy button on the destructive toast')
  await interact(() => copy.click())
  const after = document.querySelector('button[title]')!.getAttribute('aria-label')!
  assert.doesNotMatch(after, /^Copied$/)
  assert.match(after, /Copy failed/)
  view.unmount()
})

// ── Existing components that copy ───────────────────────────────────────────

test('ActivityDetailRow copies itself with copyValue, and keeps onCopy working', async () => {
  written.length = 0
  accept()
  const self = mount(h(ActivityDetailRow, { label: 'Swap id', value: 'sw_01…ef', copyValue: 'sw_0123456789abcdef' }))
  const button = self.container.querySelector('button')!
  assert.equal(button.getAttribute('aria-label'), 'Copy swap id')
  await interact(() => button.click())
  assert.deepEqual(written, ['sw_0123456789abcdef'])
  self.unmount()

  let called = 0
  const legacy = mount(h(ActivityDetailRow, { label: 'Swap id', value: 'x', onCopy: () => (called += 1) }))
  await interact(() => legacy.container.querySelector('button')!.click())
  assert.equal(called, 1)
  legacy.unmount()
})

test('SecretRevealCard and RecoveryPhraseCard report a failed copy instead of hiding it', async () => {
  reject()
  const secret = mount(
    h(SecretRevealCard, { value: 'kx_live_secret', revealed: true, onRevealChange: () => undefined, copyValue: 'kx_live_secret' }),
  )
  const copy = [...secret.container.querySelectorAll('button')].find((b) => b.textContent === 'Copy')!
  await interact(() => copy.click())
  assert.match(secret.container.querySelector('[role="alert"]')!.textContent!, /Copy failed/)
  secret.unmount()

  written.length = 0
  accept()
  const phrase = mount(
    h(RecoveryPhraseCard, { words: ['alpha', 'bravo', 'charlie'], revealed: true, copyValue: 'alpha bravo charlie' }),
  )
  const copyPhrase = [...phrase.container.querySelectorAll('button')].find((b) => /Copy/.test(b.textContent!))!
  await interact(() => copyPhrase.click())
  assert.deepEqual(written, ['alpha bravo charlie'])
  assert.match(copyPhrase.textContent!, /Copied/)
  phrase.unmount()
})

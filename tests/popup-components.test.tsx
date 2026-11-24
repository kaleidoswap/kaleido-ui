import { mount } from './helpers/dom'

import assert from 'node:assert/strict'
import test from 'node:test'
import { act, createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AlertBanner } from '../src/web/components/alert-banner'
import { AmountUnitToggle } from '../src/web/components/amount-unit-toggle'
import { AssetCard } from '../src/web/components/asset-card'
import { QrCode } from '../src/web/components/qr-code'
import { Button } from '../src/web/primitives/button'
import { Checkbox, CheckboxRow } from '../src/web/primitives/checkbox'
import { Spinner } from '../src/web/primitives/spinner'
import { SegmentedTabs } from '../src/web/primitives/tabs'
import { Textarea } from '../src/web/primitives/textarea'

const html = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element)

test('Spinner is decorative by default and a status when labelled', () => {
  assert.match(html(createElement(Spinner)), /^<svg[^>]*aria-hidden="true"[^>]*class="[^"]*animate-spin/)
  assert.doesNotMatch(html(createElement(Spinner)), /role="status"/)
  assert.match(html(createElement(Spinner, { label: 'Loading' })), /role="status" aria-label="Loading"/)
  assert.match(html(createElement(Spinner, { size: 'xl', tone: 'brand' })), /text-icon-xl text-brand/)
})

test('Button loading shows a spinner, disables the button and sets aria-busy', () => {
  const markup = html(createElement(Button, { loading: true }, 'Send'))
  assert.match(markup, /disabled=""/)
  assert.match(markup, /aria-busy="true"/)
  assert.match(markup, /data-slot="spinner"[^]*Send/)
  const idle = html(createElement(Button, null, 'Send'))
  assert.doesNotMatch(idle, /aria-busy|data-slot="spinner"|disabled=""/)
})

test('Button asChild still forwards disabled', () => {
  const markup = html(createElement(Button, { asChild: true, disabled: true }, createElement('button', null, 'Go')))
  assert.match(markup, /<button[^>]*disabled=""/)
})

test('Textarea wears the field surface and resizes vertically only', () => {
  const markup = html(createElement(Textarea, { placeholder: 'Message' }))
  assert.match(markup, /<textarea[^>]*rows="4"/)
  assert.match(markup, /ring-field-edge/)
  assert.match(markup, /resize-y/)
})

test('Checkbox is a native checkbox and reports its new state', () => {
  const seen: boolean[] = []
  const { container, unmount } = mount(createElement(Checkbox, { onCheckedChange: (value: boolean) => seen.push(value) }))
  const input = container.querySelector('input')!
  assert.equal(input.type, 'checkbox')
  act(() => input.click())
  assert.deepEqual(seen, [true])
  unmount()
})

test('CheckboxRow labels its checkbox, so a click anywhere on the row toggles it', () => {
  const { container, unmount } = mount(
    createElement(CheckboxRow, { label: 'Include logs', description: 'Helps us debug' }),
  )
  const input = container.querySelector('input')!
  const label = container.querySelector('label')!
  assert.equal(label.htmlFor, input.id)
  act(() => (container.querySelector('label span span') as HTMLElement).click())
  assert.equal(input.checked, true)
  assert.match(container.textContent ?? '', /Helps us debug/)
  unmount()
})

test('AlertBanner renders an action and a dismiss button only when asked', () => {
  const plain = html(createElement(AlertBanner, { variant: 'warning' }, 'Offline'))
  assert.doesNotMatch(plain, /aria-label="Dismiss"/)

  let dismissed = 0
  const { container, unmount } = mount(
    createElement(
      AlertBanner,
      {
        variant: 'warning',
        action: createElement('button', { 'data-testid': 'retry' }, 'Retry'),
        onDismiss: () => dismissed++,
      },
      'Offline',
    ),
  )
  assert.ok(container.querySelector('[data-testid="retry"]'))
  act(() => (container.querySelector('button[aria-label="Dismiss"]') as HTMLButtonElement).click())
  assert.equal(dismissed, 1)
  unmount()
})

test('AssetCard loading keeps the amount in place and shows a spinner for it', () => {
  const loading = html(createElement(AssetCard, { ticker: 'USDT', displayBalance: '12.5', loading: true }))
  assert.match(loading, /<p[^>]*class="[^"]*invisible[^"]*"[^>]*aria-hidden="true"/)
  assert.match(loading, /role="status" aria-label="Loading balance"/)

  const ready = html(createElement(AssetCard, { ticker: 'USDT', displayBalance: '12.5' }))
  assert.doesNotMatch(ready, /invisible|Loading balance/)
})

test('QrCode fluid fills its container and stays square', () => {
  const fluid = html(createElement(QrCode, { value: 'bitcoin:bc1qexample', size: 'fluid', maxSize: 232 }))
  assert.match(fluid, /data-qr-size="fluid" style="width:100%;max-width:232px;aspect-ratio:1 \/ 1"/)
  const fixed = html(createElement(QrCode, { value: 'bitcoin:bc1qexample', size: 188 }))
  assert.match(fixed, /style="width:188px;height:188px"/)
})

test('SegmentedTabs shows an option description as a second line', () => {
  const markup = html(
    createElement(SegmentedTabs, {
      'aria-label': 'Venue',
      value: 'all',
      onValueChange: () => undefined,
      options: [
        { value: 'all', label: 'All' },
        { value: 'ks', label: 'KaleidoSwap', description: 'RGB Lightning' },
      ],
    }),
  )
  assert.match(markup, /KaleidoSwap<\/span><span class="text-xxs[^"]*">RGB Lightning<\/span>/)
  assert.doesNotMatch(markup.split('KaleidoSwap')[0], /text-xxs/)
})

test('AmountUnitToggle switches between the two units and offers the rest in a sheet', () => {
  const picks: string[] = []
  const { container, unmount } = mount(
    createElement(AmountUnitToggle, {
      baseUnit: 'sats',
      altUnit: 'USD',
      value: 'sats',
      onChange: (unit: string) => picks.push(unit),
      choices: [{ id: 'USD', symbol: '$' }, { id: 'EUR', symbol: '€' }],
      testId: 'amount-unit',
    }),
  )
  const sats = container.querySelector('[data-testid="amount-unit-sats"]')!
  assert.equal(sats.getAttribute('aria-pressed'), 'true')
  act(() => (container.querySelector('[data-testid="amount-unit-USD"]') as HTMLButtonElement).click())
  assert.deepEqual(picks, ['USD'])

  act(() => (container.querySelector('[data-testid="amount-unit-more"]') as HTMLButtonElement).click())
  const eur = document.querySelector('[data-testid="amount-unit-option-EUR"]') as HTMLButtonElement | null
  assert.ok(eur, 'the chooser lists every alternative')
  act(() => eur!.click())
  assert.deepEqual(picks, ['USD', 'EUR'])
  unmount()
})

test('AmountUnitToggle has no chooser with a single alternative', () => {
  const markup = html(
    createElement(AmountUnitToggle, {
      baseUnit: 'sats',
      altUnit: 'USD',
      value: 'sats',
      onChange: () => undefined,
      choices: [{ id: 'USD' }],
      testId: 'amount-unit',
    }),
  )
  assert.doesNotMatch(markup, /amount-unit-more/)
})

test('AssetCard loading takes a custom spinner label and keeps the amount a direct child', () => {
  const markup = html(
    createElement(AssetCard, { ticker: 'USDT', displayBalance: '1', loading: true, loadingLabel: 'Loading asset balance' }),
  )
  assert.match(markup, /aria-label="Loading asset balance"/)
  assert.match(markup, /max-w-\[45%\][^"]*"><p /)
})

test('BottomSheet closes from its close button and Escape, unless closing is held back', async () => {
  const { BottomSheet } = await import('../src/web/components/bottom-sheet')
  let closed = 0
  const sheet = (closeOnBackdrop: boolean) =>
    createElement(BottomSheet, { open: true, title: 'Choose', onClose: () => closed++, closeOnBackdrop }, 'Body')

  const held = mount(sheet(false))
  assert.equal(document.querySelector('button[aria-label="Close"]'), null)
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })))
  assert.equal(closed, 0)
  held.unmount()

  const open = mount(sheet(true))
  assert.equal(document.querySelector('[role="dialog"]')?.getAttribute('aria-label'), 'Choose')
  act(() => (document.querySelector('button[aria-label="Close"]') as HTMLButtonElement).click())
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })))
  assert.equal(closed, 2)
  open.unmount()
})

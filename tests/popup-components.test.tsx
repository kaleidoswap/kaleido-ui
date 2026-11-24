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

test('LoadingCard uses the Spinner; ErrorCard can leave out the description', async () => {
  const { LoadingCard, ErrorCard } = await import('../src/web/components/page-shell')
  const loading = html(createElement(LoadingCard, { message: 'Loading…' }))
  assert.match(loading, /role="status"/)
  assert.match(loading, /data-slot="spinner"/)
  assert.doesNotMatch(loading, /border-t-primary/)
  const error = html(createElement(ErrorCard, { title: 'Could not load' }))
  assert.match(error, /Could not load/)
  assert.doesNotMatch(error, /<p class="mb-4/)
})

test('SegmentedTabs grows with a description and takes a test id; InfoPanel takes a test id', async () => {
  const { InfoPanel } = await import('../src/web/components/info-panel')
  const tabs = html(
    createElement(SegmentedTabs, {
      'aria-label': 'Venue',
      'data-testid': 'venue',
      value: 'a',
      onValueChange: () => undefined,
      options: [{ value: 'a', label: 'A', description: 'first' }],
    }),
  )
  assert.match(tabs, /data-testid="venue"/)
  assert.match(tabs, /class="[^"]*\bh-auto\b/)
  assert.doesNotMatch(tabs.match(/data-slot="segmented-tabs"[^>]*/)![0], /\bh-12\b/)
  assert.match(html(createElement(InfoPanel, { 'data-testid': 'note' }, 'x')), /data-testid="note"/)
})

test('CopyButton visibleLabel shows text and lets it name the button; Copyable passes labels on', async () => {
  const { CopyButton } = await import('../src/web/components/copy-button')
  const { Copyable } = await import('../src/web/components/copyable')
  const pill = html(createElement(CopyButton, { value: 'lnbc1', label: 'invoice', visibleLabel: 'Copy invoice' }))
  assert.match(pill, /Copy invoice<\/button>/)
  assert.doesNotMatch(pill, /aria-label=/)
  const icon = html(createElement(CopyButton, { value: 'lnbc1', label: 'invoice' }))
  assert.match(icon, /aria-label="Copy invoice"/)
  const copyable = html(createElement(Copyable, { value: 'abc', label: 'id', copyLabel: 'Copier l’id' }))
  assert.match(copyable, /aria-label="Copier l’id"/)
})

test('A clickable SettingItem is a keyboard-reachable button; a static one is not', async () => {
  const { SettingItem } = await import('../src/web/components/setting-item')
  const clickable = html(createElement(SettingItem, { title: 'Pay', onClick: () => undefined, disabled: true, 'data-testid': 'pay' }))
  assert.match(clickable, /^<button type="button" disabled="" data-testid="pay"/)
  assert.doesNotMatch(clickable, /<div/)
  assert.match(html(createElement(SettingItem, { title: 'Info' })), /^<div/)
})

test('SelectableCard takes an icon, disabled and a test id', async () => {
  const { SelectableCard } = await import('../src/web/components/selectable-card')
  const markup = html(
    createElement(SelectableCard, {
      title: 'Phrase',
      onClick: () => undefined,
      disabled: true,
      icon: createElement('svg', { 'data-icon': 'x' }),
      'data-testid': 'method',
    }),
  )
  assert.match(markup, /^<button type="button" disabled="" data-testid="method"/)
  assert.match(markup, /data-icon="x"/)
  assert.doesNotMatch(markup, /<div/)
})

test('Tooltip aligns to an edge, opens on plain :hover and can hold blocks', async () => {
  const { Tooltip } = await import('../src/web/primitives/tooltip')
  const markup = html(
    createElement(Tooltip, { content: createElement('div', null, 'rows'), placement: 'bottom-end', block: true }, createElement('button', null, 'i')),
  )
  assert.match(markup, /^<div class="group\/tooltip/)
  assert.match(markup, /<div[^>]*role="tooltip"[^>]*class="[^"]*right-0 top-full/)
  assert.match(markup, /group-\[:hover\]\/tooltip:block/)
  assert.doesNotMatch(markup, /group-hover\/tooltip/)
})

test('The icon set has more_vert', async () => {
  const { isIconName } = await import('../src/web/icons/index')
  assert.equal(isIconName('more_vert'), true)
})

test('RecoveryPhraseCard keeps the words out of the page until revealed', async () => {
  const { RecoveryPhraseCard } = await import('../src/web/components/recovery-phrase-card')
  const words = ['abandon', 'ability', 'able']
  const hidden = html(
    createElement(RecoveryPhraseCard, {
      words,
      revealed: false,
      onRevealChange: () => undefined,
      revealLabel: 'Révéler',
      secretTestId: 'secret',
    }),
  )
  // As element text, not class names ("disabled:" contains "able").
  assert.doesNotMatch(hidden, />(abandon|ability|able)</)
  assert.match(hidden, /Révéler/)
  assert.match(hidden, /data-testid="secret" data-revealed="false"/)
  const shown = html(
    createElement(RecoveryPhraseCard, { words, revealed: true, onRevealChange: () => undefined, hideable: false }),
  )
  assert.match(shown, />abandon</)
  assert.doesNotMatch(shown, />Hide</)
})

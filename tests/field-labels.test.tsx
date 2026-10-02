import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Input } from '../src/web/primitives/input'
import { Label } from '../src/web/primitives/label'
import { FormField } from '../src/web/components/form-field'
import { WithdrawAmountInput } from '../src/web/components/withdraw-amount-input'
import { WithdrawDestinationInput } from '../src/web/components/withdraw-destination-input'
import { WithdrawRouteSelector } from '../src/web/components/withdraw-route-selector'

const labelFor = (markup: string, text: string) => markup.match(new RegExp(`<label[^>]*for="([^"]+)"[^>]*>${text}</label>`))?.[1]

test('Label is the shared eyebrow in violet (secondary-content), in a form as in a wallet flow', () => {
  const markup = renderToStaticMarkup(createElement(Label, { htmlFor: 'x' }, 'Amount'))
  assert.match(markup, /text-mini font-bold uppercase tracking-eyebrow text-secondary-content/)
  assert.doesNotMatch(markup, /text-body/)
  const field = renderToStaticMarkup(createElement(FormField, { label: 'Webhook URL' }, createElement(Input)))
  assert.match(field, /<label[^>]*text-mini font-bold uppercase tracking-eyebrow/)
})

test('withdraw destination: its label points at the input', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawDestinationInput, {
      destination: '',
      setDestination: () => undefined,
      addressType: 'unknown',
      isDecoding: false,
      isResolvingLnurl: false,
      handlePaste: () => undefined,
      handleReset: () => undefined,
    }),
  )
  const id = labelFor(markup, 'Destination')
  assert.ok(id)
  assert.match(markup, new RegExp(`<input id="${id}"`))
})

test('withdraw amount: amount label points at its input; fee rate names its button group', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawAmountInput, {
      addressType: 'bitcoin',
      amount: '',
      handleAmountChange: () => undefined,
      handleSetMax: () => undefined,
      selectedAssetId: 'BTC',
      selectedAssetTicker: 'BTC',
      formattedBalance: '0',
      decodedLnInvoice: null,
      decodedRgbInvoice: null,
      lnurlPayData: null,
      witnessAmountSat: 512,
      setWitnessAmountSat: () => undefined,
      feeRate: 'normal',
      setFeeRate: () => undefined,
      feeRates: { slow: 1, normal: 2, fast: 3 },
      donation: false,
      setDonation: () => undefined,
    }),
  )
  const id = labelFor(markup, 'Amount')
  assert.ok(id)
  assert.match(markup, new RegExp(`<input id="${id}"`))

  const headingId = markup.match(/<p id="([^"]+)"[^>]*>Fee Rate<\/p>/)?.[1]
  assert.ok(headingId)
  assert.match(markup, new RegExp(`role="group" aria-labelledby="${headingId}"`))
  assert.match(markup, /aria-pressed="true"/)
  assert.doesNotMatch(markup, />Fee Rate<\/label>/)
})

test('withdraw route: the heading names the group of routes', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawRouteSelector, {
      routes: [],
      activeRouteAccount: undefined,
      onRouteChange: () => undefined,
    } as never),
  )
  const headingId = markup.match(/<p id="([^"]+)"[^>]*>Route<\/p>/)?.[1]
  assert.ok(headingId)
  assert.match(markup, new RegExp(`role="group" aria-labelledby="${headingId}"`))
})

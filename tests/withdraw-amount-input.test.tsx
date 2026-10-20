import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { WithdrawAmountInput } from '../src/web/components/withdraw-amount-input'

const base = {
  addressType: 'bitcoin' as const,
  amount: '4',
  handleAmountChange: () => undefined,
  handleSetMax: () => undefined,
  selectedAssetId: 'BTC',
  selectedAssetTicker: 'BTC',
  formattedBalance: '16.03',
  decodedLnInvoice: null,
  decodedRgbInvoice: null,
  lnurlPayData: null,
  witnessAmountSat: 0,
  setWitnessAmountSat: () => undefined,
  feeRate: 'normal' as const,
  setFeeRate: () => undefined,
  feeRates: { slow: 1, normal: 2, fast: 3 },
  donation: false,
  setDonation: () => undefined,
}

test('the unit caption under the amount reads the asset unit by default', () => {
  const markup = renderToStaticMarkup(createElement(WithdrawAmountInput, base))
  assert.doesNotMatch(markup, /data-slot="amount-unit"/)
  assert.match(markup, /<p class="[^"]*">sats<\/p>/)
})

test('unitSlot takes the caption place inside the amount card', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawAmountInput, {
      ...base,
      unitSlot: createElement('button', { 'data-testid': 'unit-toggle' }, 'USD'),
    }),
  )
  assert.match(markup, /data-slot="amount-unit"[^>]*><button data-testid="unit-toggle">USD<\/button>/)
  assert.doesNotMatch(markup, /<p class="[^"]*">sats<\/p>/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { WithdrawConfirmation } from '../src/web/components/withdraw-confirmation'
import { DEFAULT_AMOUNT_LOCALE, formatAmount } from '../src/web/utils/amount-display'

// `toLocaleString()` with no locale reads the host. On a machine with Italian
// ICU data it grouped 1000 as "1000", so the same component printed different
// figures in a browser, on a server and in CI. The locale is now always named.

test('amounts group in en-US unless a locale is passed', () => {
  assert.equal(DEFAULT_AMOUNT_LOCALE, 'en-US')
  assert.equal(formatAmount(1_000), '1,000')
  assert.equal(formatAmount(1_234_567.5), '1,234,567.5')
  assert.equal(formatAmount(1_000, { locale: 'de-DE' }), '1.000')
})

test('the payment review uses the locale it is given, not the host one', () => {
  const props = {
    isConfirming: false,
    isPollingStatus: false,
    setShowConfirmation: () => undefined,
    displayAmount: 1_000,
    selectedAssetId: 'BTC',
    destination: 'bc1qexample',
    networkLabel: 'On-chain',
    estimatedFee: 1_250,
    feeRate: 'medium',
    addressType: 'bitcoin' as const,
    decodedRgbInvoice: null,
    witnessAmountSat: 0,
    amount: '1000',
    handleConfirmSend: () => undefined,
  }
  const english = renderToStaticMarkup(createElement(WithdrawConfirmation, props))
  assert.match(english, />1,000</)
  assert.match(english, /~1,250 sats/)
  assert.match(english, /2,250/)

  const german = renderToStaticMarkup(
    createElement(WithdrawConfirmation, { ...props, locale: 'de-DE' }),
  )
  assert.match(german, />1\.000</)
  assert.match(german, /~1\.250 sats/)
  assert.match(german, /2\.250/)
})

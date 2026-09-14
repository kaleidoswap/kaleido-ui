import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { WithdrawConfirmation } from '../src/web/components/withdraw-confirmation'

test('payment review separates recipient amount, estimated fee, and total deduction', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawConfirmation, {
      isConfirming: false,
      isPollingStatus: false,
      setShowConfirmation: () => undefined,
      displayAmount: 1_000,
      selectedAssetId: 'BTC',
      selectedAsset: { ticker: 'BTC' },
      destination: 'bc1qexample',
      networkLabel: 'On-chain',
      estimatedFee: 250,
      feeRate: 'medium',
      addressType: 'bitcoin',
      decodedRgbInvoice: null,
      witnessAmountSat: 0,
      amount: '1000',
      reviewLabels: {
        recipientReceives: 'Recipient receives',
        estimatedNetworkFee: 'Estimated network fee',
        totalDeducted: 'Total deducted',
      },
      handleConfirmSend: () => undefined,
    }),
  )

  assert.match(markup, /Recipient receives/)
  assert.match(markup, /1,000/)
  assert.match(markup, /data-testid="payment-review-fee"/)
  assert.match(markup, /Estimated network fee/)
  assert.match(markup, /~250 sats/)
  assert.match(markup, /data-testid="payment-review-total"/)
  assert.match(markup, /Total deducted/)
  assert.match(markup, /1,250/)
})

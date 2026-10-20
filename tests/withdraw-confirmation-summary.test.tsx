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

test('a quoted fee is shown exactly, without the estimate marker', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawConfirmation, {
      isConfirming: false,
      isPollingStatus: false,
      setShowConfirmation: () => undefined,
      displayAmount: 700,
      selectedAssetId: 'BTC',
      selectedAsset: { ticker: 'BTC' },
      destination: 'lnbc7u1example',
      networkLabel: 'Lightning',
      estimatedFee: 9,
      feeIsExact: true,
      feeRate: 'Arkade solver',
      addressType: 'lightning',
      decodedRgbInvoice: null,
      witnessAmountSat: 0,
      amount: '700',
      handleConfirmSend: () => undefined,
    }),
  )

  assert.match(markup, />9 sats</)
  assert.doesNotMatch(markup, /~9 sats/)
  assert.match(markup, /709/)
})

const arkadeReview = {
  isConfirming: false,
  isPollingStatus: false,
  setShowConfirmation: () => undefined,
  displayAmount: 5_000,
  selectedAssetId: 'BTC',
  selectedAsset: { ticker: 'BTC' },
  destination: 'tark1qqcpq7yq3e8hhsx6ml3fud93m7827qggaurtzu3zwsr4a0qs0gf84yrsq03jfvmagawwhlgtn6kky2l99k0k6vxyk3zg8v6934z47p593azmnu',
  networkLabel: 'Arkade',
  routeAccount: 'Arkade',
  routeMethod: 'Arkade transfer',
  estimatedFee: 0,
  feeRate: 'normal',
  addressType: 'arkade' as const,
  decodedRgbInvoice: null,
  witnessAmountSat: 0,
  amount: '5,000',
  handleConfirmSend: () => undefined,
}

test('the review drops rows the hero and the network row already say', () => {
  const markup = renderToStaticMarkup(createElement(WithdrawConfirmation, arkadeReview))

  assert.match(markup, />5,000</)
  assert.doesNotMatch(markup, /Route Method|Arkade transfer/)
  assert.doesNotMatch(markup, />Asset</)
  assert.doesNotMatch(markup, /From Account/)
  // Paying from the destination's own network: no "from …".
  assert.doesNotMatch(markup, /from Arkade/)
})

test('the network row names a different paying account and shows the network mark', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawConfirmation, {
      ...arkadeReview,
      networkLabel: 'Lightning',
      routeAccount: 'Spark',
      networkIcon: createElement('svg', { 'data-testid': 'ln-mark' }),
    }),
  )

  assert.match(markup, /data-testid="payment-review-network"[\s\S]*data-testid="ln-mark"[\s\S]*Lightning[\s\S]*from Spark/)
  assert.match(markup, /data-slot="payment-review-network-badge"/)
})

test('the total reads a grouped amount', () => {
  const markup = renderToStaticMarkup(
    createElement(WithdrawConfirmation, {
      ...arkadeReview,
      estimatedFee: 35,
      feeIsExact: true,
    }),
  )

  assert.match(markup, /data-testid="payment-review-total"[\s\S]*5,035/)
})

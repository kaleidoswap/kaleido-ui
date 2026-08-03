import assert from 'node:assert/strict'
import test from 'node:test'

import { getRgbBtcBreakdownLabels } from '../src/web/components/balance-breakdown'

test('RLN mode separates its on-chain wallet from its channel balance', () => {
  assert.deepEqual(
    getRgbBtcBreakdownLabels({
      RGB: { connected: true, configured: true },
      RGB_L1: { connected: false, configured: false },
    }),
    {
      onchainLabel: 'BTC wallet on RLN',
      onchainSublabel: 'RLN on-chain wallet',
      showLightning: true,
      lightningLabel: 'BTC channels on RLN',
      lightningSublabel: 'RLN channel balance',
    },
  )
})

test('RGB L1 mode names its independent BTC wallet and hides the RLN row', () => {
  assert.deepEqual(
    getRgbBtcBreakdownLabels({
      RGB: { connected: false, configured: false },
      RGB_L1: { connected: true, configured: true },
    }),
    {
      onchainLabel: 'BTC on RGB L1',
      onchainSublabel: 'RGB L1 wallet balance',
      showLightning: false,
      lightningLabel: 'BTC channels on RLN',
      lightningSublabel: 'RLN channel balance',
    },
  )
})

test('RGB L1 mode wins when old RLN configuration remains saved', () => {
  assert.equal(
    getRgbBtcBreakdownLabels({
      RGB: { connected: false, configured: true },
      RGB_L1: { connected: true, configured: true },
    }).onchainLabel,
    'BTC on RGB L1',
  )
})

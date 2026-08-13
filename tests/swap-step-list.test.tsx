import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { SwapStepList, type SwapStepItem } from '../src/web/components/swap-step-list'

const steps: SwapStepItem[] = [
  { id: 'quote', label: 'Quote locked', description: '1,005 sats in', status: 'done' },
  { id: 'fund', label: 'Contract funded', description: 'txid a91c…04d7', status: 'done' },
  { id: 'fill', label: 'Solver paying invoice', status: 'active' },
  { id: 'claim', label: 'Invoice paid', status: 'pending' },
]

test('each step publishes its own status so callers map protocol state directly', () => {
  const markup = renderToStaticMarkup(createElement(SwapStepList, { steps }))
  const statuses = [...markup.matchAll(/data-slot="swap-step" data-status="([a-z]+)"/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(statuses, ['done', 'done', 'active', 'pending'])
})

test('the filled rail stops at the frontier of the flow', () => {
  const markup = renderToStaticMarkup(createElement(SwapStepList, { steps }))
  // Two done steps draw a filled connector; the active one does not, so a
  // reader never sees progress the flow has not actually made.
  assert.equal(markup.match(/bg-primary\/60/g)?.length, 2)
})

test('a failed step reads as failed even while a later step is still pending', () => {
  const markup = renderToStaticMarkup(
    createElement(SwapStepList, {
      steps: [
        { id: 'a', label: 'Funded', status: 'done' },
        { id: 'b', label: 'Solver never paid', status: 'failed' },
        { id: 'c', label: 'Refund', status: 'pending' },
      ],
    }),
  )
  assert.match(markup, /data-status="failed"/)
  assert.match(markup, /text-danger/)
})

test('descriptions are optional', () => {
  const markup = renderToStaticMarkup(
    createElement(SwapStepList, { steps: [{ id: 'a', label: 'Only a label', status: 'pending' }] }),
  )
  assert.match(markup, /Only a label/)
  assert.doesNotMatch(markup, /text-muted-foreground">undefined/)
})

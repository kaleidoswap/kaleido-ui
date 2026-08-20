import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ActivityList, SwapBadge } from '../src/web/index'

test('SwapBadge names both networks and the direction for screen readers', () => {
  const markup = renderToStaticMarkup(
    createElement(SwapBadge, { from: 'LN', to: 'Arkade' }),
  )

  // The glyphs carry no text, so the accessible name is the only description a
  // screen reader gets — an unlabelled pair would read as nothing at all.
  assert.match(markup, /aria-label="LN to Arkade"/)
  assert.match(markup, /role="img"/)
  // The arrow is decorative once the pair is labelled.
  assert.match(markup, /aria-hidden="true"/)
})

test('ActivityList shows a swap badge only when a destination network is given', () => {
  const base = {
    id: '1',
    direction: 'inbound' as const,
    status: 'success' as const,
    displayAmount: '1,000',
    timestamp: 1_700_000_000,
    network: 'LN' as const,
  }

  // The network badge lives in the expanded details, not the collapsed row.
  const single = renderToStaticMarkup(
    createElement(ActivityList, { items: [base], expandedId: '1' }),
  )
  assert.doesNotMatch(single, /aria-label="LN to /)

  const crossed = renderToStaticMarkup(
    createElement(ActivityList, {
      items: [{ ...base, networkTo: 'Spark' as const }],
      expandedId: '1',
    }),
  )
  assert.match(crossed, /aria-label="LN to Spark"/)
})

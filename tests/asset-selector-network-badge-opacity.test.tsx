import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetSelector } from '../src/web/components/asset-selector'

const OPTIONS = [
  {
    id: 'btc-spark',
    ticker: 'BTC',
    name: 'Bitcoin on Spark',
    networkIconUrl: '/icons/spark/asterisk.svg',
    networkTag: { label: 'Spark' },
  },
]

test('the network mini-badge has an opaque backing, since its mark is a transparent-background glyph', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetSelector, {
      label: 'From',
      selectedTicker: 'BTC',
      options: OPTIONS,
      compact: true,
      onChange: () => undefined,
    }),
  )

  assert.match(markup, /src="\/icons\/spark\/asterisk\.svg"/)
  // The badge overlay span must carry a solid background class alongside the
  // image, or a transparent-glyph network mark (Spark's asterisk, Lightning's
  // bolt) renders as a washed-out ring instead of a legible badge.
  assert.match(
    markup,
    /rounded-full ring-2 ring-card overflow-hidden bg-card"[^>]*><img src="\/icons\/spark\/asterisk\.svg"/,
  )
})

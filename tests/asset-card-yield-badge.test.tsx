import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetCard } from '../src/web/components/asset-card'

const baseProps = {
  name: 'USD Bitcoin',
  ticker: 'USDB',
  displayBalance: '10',
}

test('the yield badge sits before the ticker, keeping ticker text the trailing, right-aligned element', () => {
  const markup = renderToStaticMarkup(createElement(AssetCard, baseProps))

  assert.match(markup, /Yield Generating Asset/)
  // The row is right-aligned (justify-end): whatever renders last visually
  // sits flush against the card's right edge. The ticker must be that last
  // element, or the decorative badge pushes it out of alignment with every
  // other card's plain, flush-right ticker text.
  assert.match(markup, /Yield Generating Asset[\s\S]*USDB/)
})

test('a non-yielding asset renders no badge and keeps the ticker flush right', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetCard, { ...baseProps, ticker: 'USDT', name: 'Tether USD' }),
  )

  assert.doesNotMatch(markup, /Yield Generating Asset/)
  assert.match(markup, /USDT/)
})

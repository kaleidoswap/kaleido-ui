import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetCard } from '../src/web/components/asset-card'

const baseProps = {
  name: 'Test Asset',
  ticker: 'TST',
  balance: '10',
  icon: createElement('span', null, 'T'),
}

test('pending assets render the unchanged shared status pill before the ticker', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetCard, { ...baseProps, status: 'pending' }),
  )

  assert.match(markup, /data-slot="status-badge"/)
  assert.match(markup, /rounded-full/)
  assert.match(markup, /schedule/)
  assert.match(markup, /Pending/)
  assert.match(markup, /data-slot="status-badge"[\s\S]*Pending[\s\S]*·[\s\S]*TST/)
})

test('ready assets render ticker metadata without an empty status pill', () => {
  const markup = renderToStaticMarkup(createElement(AssetCard, baseProps))
  assert.doesNotMatch(markup, /data-slot="status-badge"/)
  assert.match(markup, /TST/)
})

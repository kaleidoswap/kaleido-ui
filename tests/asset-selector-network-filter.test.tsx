import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetSelectorNetworkFilterTrigger } from '../src/web/components/asset-selector'

const renderTrigger = (activeNetworkOption: { id: string; label: string; iconUrl?: string } | null) =>
  renderToStaticMarkup(
    createElement(AssetSelectorNetworkFilterTrigger, {
      activeNetworkOption,
      open: false,
      onClick: () => undefined,
    }),
  )

test('the All network-filter trigger has no leading generic icon', () => {
  const markup = renderTrigger(null)

  assert.match(markup, />All</)
  assert.doesNotMatch(markup, />hub</)
  assert.equal(markup.match(/<svg/g)?.length, 1, 'only the trailing chevron should render')
})

test('a selected network still displays its own mark', () => {
  const markup = renderTrigger({
    id: 'Spark',
    label: 'Spark',
    iconUrl: '/icons/crypto/spark.png',
  })

  assert.match(markup, /src="\/icons\/crypto\/spark\.png"/)
  assert.match(markup, />Spark</)
})

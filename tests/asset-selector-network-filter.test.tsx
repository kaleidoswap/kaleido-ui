import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetSelectorNetworkFilterTrigger } from '../src/web/components/asset-selector'

const NETWORKS = [
  { id: 'LN', label: 'Lightning', iconUrl: '/icons/crypto/ln.png' },
  { id: 'Spark', label: 'Spark', iconUrl: '/icons/crypto/spark.png' },
  { id: 'RGB-LN', label: 'RGB', iconUrl: '/icons/crypto/rgb.png' },
]

const renderTrigger = (activeNetworkOption: { id: string; label: string; iconUrl?: string } | null) =>
  renderToStaticMarkup(
    createElement(AssetSelectorNetworkFilterTrigger, {
      activeNetworkOption,
      networks: NETWORKS,
      open: false,
      onClick: () => undefined,
    }),
  )

test('the All state has no generic icon and no "All" text — a condensed network-icon stack instead', () => {
  const markup = renderTrigger(null)

  assert.doesNotMatch(markup, />All</)
  assert.doesNotMatch(markup, />hub</)
  assert.equal(markup.match(/<img/g)?.length, NETWORKS.length, 'one mark per network in the stack')
  assert.match(markup, /src="\/icons\/crypto\/ln\.png"/)
  assert.match(markup, /src="\/icons\/crypto\/spark\.png"/)
  assert.match(markup, /src="\/icons\/crypto\/rgb\.png"/)
  assert.equal(markup.match(/<svg/g)?.length, 1, 'only the trailing chevron should render')
})

test('a selected network still displays its own mark and label, not the stack', () => {
  const markup = renderTrigger({
    id: 'Spark',
    label: 'Spark',
    iconUrl: '/icons/crypto/spark.png',
  })

  assert.equal(markup.match(/<img/g)?.length, 1, 'only the active network mark renders')
  assert.match(markup, /src="\/icons\/crypto\/spark\.png"/)
  assert.match(markup, />Spark</)
})

test('overflow networks beyond the visible cap fold into a "+N" tail', () => {
  const manyNetworks = [
    ...NETWORKS,
    { id: 'Liquid', label: 'Liquid', iconUrl: '/icons/crypto/liquid.png' },
    { id: 'Arkade', label: 'Arkade', iconUrl: '/icons/crypto/arkade.png' },
  ]
  const markup = renderToStaticMarkup(
    createElement(AssetSelectorNetworkFilterTrigger, {
      activeNetworkOption: null,
      networks: manyNetworks,
      open: false,
      onClick: () => undefined,
    }),
  )

  assert.match(markup, />\+2</)
  assert.equal(markup.match(/<img/g)?.length, 3, 'only the visible cap renders marks')
})

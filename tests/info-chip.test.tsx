import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  AssetInfoChip,
  InfoChip,
  Icon,
  NetworkInfoChip,
} from '../src/web/index'

test('InfoChip keeps its label, long value, semantic status, and edit action readable', () => {
  const value = 'https://node.example/a-very-long-path-that-must-remain-readable'
  const markup = renderToStaticMarkup(
    createElement(InfoChip, {
      leading: createElement(Icon, { name: 'info' }),
      label: 'Node address',
      value,
      status: 'success',
      statusLabel: 'Connected',
      onEdit: () => undefined,
      editLabel: 'Edit node address',
    }),
  )

  assert.match(markup, /data-slot="info-chip"/)
  assert.match(markup, /data-status="success"/)
  assert.match(markup, />Node address</)
  assert.match(markup, new RegExp(`>${value.replaceAll('/', '\\/')}</`))
  assert.match(markup, />Connected</)
  assert.match(markup, /aria-label="Edit node address"/)
  assert.match(markup, /title="Edit node address"/)
  assert.match(markup, /\[overflow-wrap:anywhere\]/)
})

test('NetworkInfoChip always pairs its network visual with readable text', () => {
  const markup = renderToStaticMarkup(
    createElement(NetworkInfoChip, {
      network: 'LN',
    }),
  )

  assert.match(markup, />Network</)
  assert.match(markup, />LN</)
  assert.match(markup, /data-info-kind="network"/)
})

test('AssetInfoChip always pairs its asset visual with readable text', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetInfoChip, {
      ticker: 'BTC',
      value: 'Bitcoin',
    }),
  )

  assert.match(markup, />Asset</)
  assert.match(markup, />Bitcoin</)
  assert.match(markup, /data-info-kind="asset"/)
})

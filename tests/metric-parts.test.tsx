import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AssetLabel, InfoTip, MetricDelta, MetricFigure, MetricNoDelta } from '../src/web/index'

test('MetricFigure sets the unit in muted caps after the amount, and the amount alone without one', () => {
  const withUnit = renderToStaticMarkup(createElement(MetricFigure, { amount: '9.4', unit: 'BTC' }))
  assert.match(withUnit, /data-slot="metric-figure"/)
  assert.match(withUnit, /9\.4 <span class="[^"]*uppercase[^"]*text-muted-foreground[^"]*">BTC<\/span>/)

  const bare = renderToStaticMarkup(createElement(MetricFigure, { amount: '1,284' }))
  assert.equal(bare, '<span>1,284</span>')
})

test('MetricDelta says the direction three ways, and up is good news unless told otherwise', () => {
  const up = renderToStaticMarkup(createElement(MetricDelta, { direction: 'up', value: '+12.7%' }))
  assert.match(up, /data-direction="up"/)
  assert.match(up, /text-success-fg/)
  assert.match(up, /<span class="sr-only">Up <\/span>\+12\.7%/)
  assert.match(up, /against the preceding period/)
  assert.match(up, /<svg/)

  const badRise = renderToStaticMarkup(createElement(MetricDelta, { direction: 'up', value: '+3%', good: false }))
  assert.match(badRise, /text-danger-fg/)

  const down = renderToStaticMarkup(createElement(MetricDelta, { direction: 'down', value: '-8.7%' }))
  assert.match(down, /text-danger-fg/)
  assert.match(down, /<span class="sr-only">Down <\/span>-8\.7%/)

  const flat = renderToStaticMarkup(createElement(MetricDelta, { direction: 'flat' }))
  assert.match(flat, /text-muted-foreground/)
  assert.match(flat, /Unchanged <\/span>0%/)
  assert.doesNotMatch(flat, /<svg/)
})

test('MetricDelta and MetricNoDelta put their info beside the line', () => {
  const info = createElement(InfoTip, { label: 'Compared period' }, 'The preceding 7 days')
  const delta = renderToStaticMarkup(createElement(MetricDelta, { direction: 'up', value: '+1%', info }))
  assert.match(delta, /aria-label="Compared period"/)
  assert.match(delta, /data-slot="info-tip"/)
  assert.match(delta, /aria-expanded="false"/)

  const none = renderToStaticMarkup(createElement(MetricNoDelta, { info }))
  assert.match(none, /data-slot="metric-no-delta"/)
  assert.match(none, />No trend data</)
  assert.match(none, /aria-label="Compared period"/)
  assert.match(renderToStaticMarkup(createElement(MetricNoDelta, null, 'Comparing…')), />Comparing…</)
})

test('AssetLabel puts the asset logo before what is written about it', () => {
  const markup = renderToStaticMarkup(createElement(AssetLabel, { ticker: 'BTC', size: 20 }, '1,005 sats'))
  assert.match(markup, /data-slot="asset-label"/)
  assert.match(markup, /1,005 sats<\/span>$/)
})

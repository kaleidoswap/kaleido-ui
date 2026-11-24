import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MoneyTrendPanel } from '../src/web/components/money-trend-panel'
import { StatTrendPanel } from '../src/web/components/stat-trend-panel'

const series = [
  { key: '2026-11-12', label: '12 Nov', value: 0 },
  { key: '2026-11-13', label: '13 Nov', value: 0.0012 },
]

test('the headline is in BTC with the USD counter-value under it', () => {
  const markup = renderToStaticMarkup(
    h(MoneyTrendPanel, { label: 'Wallet revenue', btc: 0.0842, usd: 5120.456, series, chartTitle: 'Daily revenue' }),
  )
  assert.match(markup, /data-slot="stat-trend-panel"/)
  assert.match(markup, />0\.0842 <span[^>]*>BTC</)
  assert.match(markup, /data-slot="money-trend-usd"[^>]*>\$5,120\.46</)
  // Under the figure, not beside it.
  assert.match(markup, /data-slot="stat-trend-value" class="[^"]*flex-col/)
})

test('without a USD figure only BTC is shown', () => {
  const bare = renderToStaticMarkup(h(MoneyTrendPanel, { label: 'Revenue', btc: 1, series, chartTitle: 'Revenue' }))
  assert.doesNotMatch(bare, /money-trend-usd/)
})

test('StatTrendPanel puts its suffix under the figure, in the tone asked for', () => {
  const render = (props: object) =>
    renderToStaticMarkup(
      h(StatTrendPanel, { label: 'Members', value: '3,718', valueSuffix: '+126 this month', series, chartTitle: 'Check-ins', ...props }),
    )
  assert.match(render({}), /data-slot="stat-trend-value" class="[^"]*flex-col/)
  assert.match(render({ valueSuffixPlacement: 'beside' }), /data-slot="stat-trend-value" class="[^"]*flex-wrap/)
  assert.match(render({ valueSuffixTone: 'success' }), /data-slot="stat-trend-suffix" class="[^"]*text-success-fg/)
  assert.match(render({ valueSuffixTone: 'danger' }), /data-slot="stat-trend-suffix" class="[^"]*text-danger-fg/)
})

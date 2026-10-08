import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, key, mount } from './helpers/dom'
import {
  AreaChart,
  BarChart,
  BarList,
  DonutChart,
  LineChart,
  Meter,
  MixedChart,
  ScatterChart,
  Sparkline,
  chartValueTicks,
  foldSegments,
  type ChartDatum,
} from '../src/web/components/charts'
import { chartSeries } from '../src/tokens/chart'

// The charts follow the dataviz rules they were designed against: honest
// axes, colour by slot from the theme, a legend for two or more series, a
// table view on every chart, marks that are thin and hover targets that are
// not, and no empty frame.

const months: ChartDatum[] = ['Jan', 'Feb', 'Mar', 'Apr'].map((label, index) => ({
  key: label,
  label,
  detail: `${label} 2026`,
  values: { a: [3, 5, 4, 9][index], b: [2, 2, 6, 1][index] },
}))
const two = [
  { id: 'a', label: 'Lightning' },
  { id: 'b', label: 'On-chain' },
]

const hexFill = /(fill|stroke)="#/

test('the value axis never labels a value the data does not reach', () => {
  for (const max of [0.37, 1, 6.8, 37, 204, 18.4, 1795]) {
    const ticks = chartValueTicks(max)
    assert.equal(ticks[0], 0)
    assert.equal(ticks.at(-1), max)
    assert.ok(ticks.every((t) => t <= max))
  }
  assert.ok(chartValueTicks(37, { integer: true }).every(Number.isInteger))
})

test('the series palette has one step per slot in both themes', () => {
  assert.equal(chartSeries.dark.length, chartSeries.light.length)
  assert.equal(chartSeries.dark.length, 6)
})

test('a line chart: 2px lines in slot colours, a legend for two series, width 100%', () => {
  const markup = renderToStaticMarkup(h(LineChart, { data: months, series: two, label: 'Volume', scaleLabel: 'BTC' }))
  assert.match(markup, /data-series="a"[^>]*stroke="var\(--series-1\)"[^>]*stroke-width="2"/)
  assert.match(markup, /data-series="b"[^>]*stroke="var\(--series-2\)"/)
  assert.match(markup, /data-slot="chart-legend"/)
  assert.match(markup, /<svg width="100%"/)
  assert.match(markup, /BTC · linear, from 0/)
  assert.doesNotMatch(markup, hexFill)
  // Gridlines are solid hairlines, never dashed.
  assert.doesNotMatch(markup, /stroke-dasharray/)
})

test('a mixed chart draws one view at a time, and its switch offers every view and the table', async () => {
  const view = mount(h(MixedChart, { data: months, series: two, label: 'Volume', scaleLabel: 'BTC' }))
  const switchOptions = () =>
    [...view.container.querySelectorAll('[data-slot="chart-view-toggle"] button[aria-label]')].map((o) => o.getAttribute('aria-label'))
  assert.deepEqual(switchOptions(), ['Bars', 'Stacked bars', 'Lines', 'Areas', 'Dots', 'Table'])
  const viewOf = () => view.container.querySelector('[data-slot="chart-marks"]')?.getAttribute('data-view')
  assert.equal(viewOf(), 'bar')

  for (const [name, mark] of [['Stacked bars', 'stacked'], ['Lines', 'line'], ['Areas', 'area'], ['Dots', 'dots']]) {
    const option = view.container.querySelector(`[data-slot="chart-view-toggle"] [aria-label="${name}"]`) as HTMLElement
    await interact(() => option.click())
    assert.equal(viewOf(), mark)
    // Every series is drawn in the one view, in its slot colour.
    assert.ok(view.container.querySelector(`[data-mark="${mark}"][data-series="a"]`))
    assert.ok(view.container.querySelector(`[data-mark="${mark}"][data-series="b"]`))
  }
  assert.doesNotMatch(view.container.innerHTML, hexFill)

  const table = view.container.querySelector('[data-slot="chart-view-toggle"] [aria-label="Table"]') as HTMLElement
  await interact(() => table.click())
  assert.ok(view.container.querySelector('table'))
  assert.equal(view.container.querySelector('[data-slot="chart-legend"]'), null)
  view.unmount()
})

test('stacked, the mixed chart scales to the largest total', () => {
  const markup = renderToStaticMarkup(h(MixedChart, { data: months, series: two, label: 'Volume', scaleLabel: 'BTC', marks: ['stacked'] }))
  // Apr: 9 + 1 = 10 is the largest total, so the axis tops out at 10.
  assert.match(markup, />10</)
})

test('one series needs no legend; an area chart draws its wash', () => {
  const markup = renderToStaticMarkup(
    h(AreaChart, { data: months, series: [two[0]], label: 'Balance', scaleLabel: 'sats' }),
  )
  assert.doesNotMatch(markup, /data-slot="chart-legend"/)
  assert.match(markup, /data-slot="chart-area"/)
})

test('no data renders the empty state, never an empty frame', () => {
  const empty = h('p', null, 'No swaps yet')
  assert.equal(renderToStaticMarkup(h(LineChart, { data: [], series: two, label: 'x', scaleLabel: 'y', empty })), '<p>No swaps yet</p>')
  assert.equal(renderToStaticMarkup(h(BarChart, { data: [], series: two, label: 'x', scaleLabel: 'y', empty })), '<p>No swaps yet</p>')
  assert.equal(renderToStaticMarkup(h(DonutChart, { segments: [], label: 'x', empty })), '<p>No swaps yet</p>')
  assert.equal(renderToStaticMarkup(h(BarList, { items: [], label: 'x', empty })), '<p>No swaps yet</p>')
})

test('bars are at most 24px thick and round only their data end', () => {
  const markup = renderToStaticMarkup(
    h(BarChart, { data: months.slice(0, 1), series: [two[0]], label: 'x', scaleLabel: 'y' }),
  )
  // Vertical bar path: M x,base V.. Q.. H.. — its width is the H run plus the two radii.
  const path = /data-series="a" d="M([\d.]+),[\d.]+V[\d.]+Q[\d.]+,[\d.]+ [\d.]+,[\d.]+H([\d.]+)Q([\d.]+)/.exec(markup)
  assert.ok(path, 'no rounded-top bar')
  const width = Number(path[3]) - Number(path[1])
  assert.ok(width <= 24.001, `bar is ${width}px wide`)
})

test('a stacked bar chart adds a total column to its table', async () => {
  const view = mount(h(BarChart, { data: months, series: two, layout: 'stacked', label: 'Swaps', scaleLabel: 'n' }))
  await interact(() => (view.container.querySelector('[data-slot="chart-view-toggle"] [aria-label="Table"]') as HTMLButtonElement).click())
  const head = [...view.container.querySelectorAll('thead th')].map((th) => th.textContent)
  assert.deepEqual(head, ['Period', 'Lightning', 'On-chain', 'Total'])
  assert.equal(view.container.querySelectorAll('tbody tr').length, months.length)
  assert.equal(view.container.querySelector('tbody tr')!.lastElementChild!.textContent, '5')
  view.unmount()
})

test('every chart is focusable, and the arrow keys announce each point', async () => {
  const view = mount(h(BarChart, { data: months, series: two, label: 'Swaps', scaleLabel: 'n' }))
  const plot = view.container.querySelector('[role="group"][tabindex="0"]')!
  const live = view.container.querySelector('[aria-live="polite"]')!
  await interact(() => {
    key(plot, 'ArrowRight')
    key(plot, 'ArrowRight')
  })
  assert.equal(live.textContent, 'Feb 2026 · 5 Lightning · 2 On-chain')
  await interact(() => void key(plot, 'End'))
  assert.match(live.textContent!, /^Apr 2026/)
  await interact(() => void key(plot, 'Escape'))
  assert.equal(live.textContent, '')
  view.unmount()
})

test('a bar list prints every value and ranks on request', () => {
  const markup = renderToStaticMarkup(
    h(BarList, {
      label: 'Pairs',
      sort: 'desc',
      items: [
        { id: 'x', label: 'BTC/USDB', value: 3 },
        { id: 'y', label: 'BTC/USDT', value: 9, valueText: '9 / 10' },
      ],
    }),
  )
  assert.match(markup, /^<ol /)
  assert.equal(markup.match(/<li /g)?.length, 2)
  assert.ok(markup.indexOf('BTC/USDT') < markup.indexOf('BTC/USDB'), 'not ranked')
  assert.match(markup, /9 \/ 10/)
  assert.doesNotMatch(markup, /divide-|border-t/)
})

test('a donut folds the tail into Other past six parts, keeping survivors in order', () => {
  const segments = Array.from({ length: 8 }, (_, index) => ({ id: `s${index}`, label: `S${index}`, value: 10 - index }))
  const folded = foldSegments(segments)
  assert.equal(folded.length, 6)
  assert.deepEqual(folded.slice(0, 5).map((s) => s.id), ['s0', 's1', 's2', 's3', 's4'])
  assert.equal(folded[5].label, 'Other')
  assert.equal(folded[5].value, 5 + 4 + 3)
})

test('a scatter plot refuses a fourth series rather than borrow a colour', () => {
  const series = Array.from({ length: 4 }, (_, index) => ({ id: `s${index}`, label: `S${index}`, points: [{ id: 'p', x: 1, y: 1 }] }))
  assert.throws(() => renderToStaticMarkup(h(ScatterChart, { series, label: 'x', xLabel: 'a', yLabel: 'b' })), /at most 3 series/)
})

test('a meter says its state in words and an icon, not colour alone', () => {
  const normal = renderToStaticMarkup(h(Meter, { label: 'Capacity', value: 10, max: 100 }))
  assert.match(normal, /role="meter"[^>]*aria-valuenow="10"/)
  assert.doesNotMatch(normal, /Getting full|Almost full/)
  const danger = renderToStaticMarkup(h(Meter, { label: 'Capacity', value: 95, max: 100 }))
  assert.match(danger, /data-state="danger"/)
  assert.match(danger, /Almost full · 95%/)
  assert.match(danger, /<svg/)
})

test('a sparkline is a labelled image, and needs two values', () => {
  assert.match(renderToStaticMarkup(h(Sparkline, { values: [1, 3, 2], label: 'Swaps: 1 to 3' })), /role="img" aria-label="Swaps: 1 to 3"/)
  assert.equal(renderToStaticMarkup(h(Sparkline, { values: [1], label: 'x' })), '')
})

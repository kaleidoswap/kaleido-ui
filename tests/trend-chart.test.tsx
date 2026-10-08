import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, key, mount } from './helpers/dom'
import {
  TrendChart,
  trendChartLabelIndices,
  trendChartTicks,
  type TrendChartPoint,
  type TrendChartSeries,
} from '../src/web/components/trend-chart'

const SERIES: TrendChartSeries[] = [
  { id: 'completed', label: 'completed', tone: 'primary' },
  { id: 'failed', label: 'not completed', tone: 'danger' },
]

const points = (count: number, peak = 37): TrendChartPoint[] =>
  Array.from({ length: count }, (_, index) => ({
    key: `2026-06-${String(index).padStart(3, '0')}`,
    label: `D${index + 1}`,
    detail: `Day ${index + 1}`,
    // The peak lands on one period only; everything else stays below it.
    values: index === 7 ? { completed: peak - 3, failed: 3 } : { completed: index % 11, failed: index % 3 },
  }))

const chart = (count: number, extra: Record<string, unknown> = {}) =>
  renderToStaticMarkup(
    h(TrendChart, {
      points: points(count),
      series: SERIES,
      label: 'Swap trend',
      scaleLabel: 'Swaps per day',
      ...extra,
    }),
  )

const yLabels = (markup: string) => {
  const axis = /data-slot="trend-chart-y-axis">(.*?)<\/g><rect|data-slot="trend-chart-y-axis">(.*?)<\/g><g data-slot="trend-chart-bars"/s.exec(markup)
  assert.ok(axis, 'no value axis')
  return [...(axis[1] ?? axis[2]).matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => Number(m[1].replace(/,/g, '')))
}

test('the value axis tops out at the tallest bar and labels nothing above it', () => {
  for (const max of [1, 2, 3, 7, 37, 40, 99, 101, 1234]) {
    const ticks = trendChartTicks(max)
    assert.equal(ticks[0], 0, `${max}: axis does not start at zero`)
    assert.equal(ticks.at(-1), max, `${max}: top label is not the peak`)
    assert.ok(ticks.every((t) => t <= max), `${max}: a label names a height no bar reaches`)
    assert.ok(ticks.every((t) => Number.isInteger(t)), `${max}: a fractional count`)
    assert.deepEqual([...ticks].sort((a, b) => a - b), ticks)
  }
  assert.deepEqual(trendChartTicks(0), [0])
})

test('the rendered value axis is the tick set: top label is the peak (37)', () => {
  const labels = yLabels(chart(90))
  assert.equal(Math.max(...labels), 37)
  assert.ok(labels.every((value) => value <= 37))
})

test('the time axis always labels the first and last period', () => {
  for (const [count, room] of [[2, 8], [30, 8], [90, 9], [120, 10], [120, 2]] as const) {
    const indices = trendChartLabelIndices(count, room)
    assert.equal(indices[0], 0)
    assert.equal(indices.at(-1), count - 1)
    assert.ok(indices.length <= Math.max(2, room))
  }
  const markup = chart(90)
  assert.match(markup, />D1<\/text>/)
  assert.match(markup, />D90<\/text>/)
})

test('ninety periods fit: the SVG is a percentage width with a measured viewBox', () => {
  const markup = chart(90)
  const svg = /<svg width="100%" height="220" viewBox="0 0 (\d+) 220"/.exec(markup)
  assert.ok(svg, 'the plot SVG must be width="100%" — a fixed width holds the grid column open')
  assert.equal(markup.match(/data-period=/g)?.length, 90)
})

test('colour comes from theme custom properties, and series stay apart without it', () => {
  const markup = chart(30)
  assert.doesNotMatch(markup, /(fill|stroke)="#/, 'a literal colour in the chart')
  assert.match(markup, /data-series="completed"[^>]*fill="var\(--series-1\)"/)
  // The second series is hatched: a texture, not only a hue.
  assert.match(markup, /data-series="failed"[^>]*fill="url\(#trend-[^"]*-hatch-1\)"/)
  assert.match(markup, /<pattern [^>]*patternTransform="rotate\(45\)"/)
})

test('the scale is stated on the chart', () => {
  assert.match(chart(30), /Swaps per day · linear, from 0/)
})

test('no points renders the empty state, never an empty chart frame', () => {
  const markup = renderToStaticMarkup(
    h(TrendChart, {
      points: [],
      series: SERIES,
      label: 'Swap trend',
      scaleLabel: 'Swaps per day',
      empty: h('p', null, 'No swaps yet'),
    }),
  )
  assert.equal(markup, '<p>No swaps yet</p>')
  assert.equal(
    renderToStaticMarkup(h(TrendChart, { points: [], series: SERIES, label: 'x', scaleLabel: 'y' })),
    '',
  )
})

test('the plot is focusable and the arrow keys walk the periods, announced live', async () => {
  const view = mount(
    h(TrendChart, { points: points(5), series: SERIES, label: 'Swap trend', scaleLabel: 'Swaps per day' }),
  )
  const plot = view.container.querySelector('[role="group"][tabindex="0"]')
  assert.ok(plot, 'the plot is not focusable')
  const readout = view.container.querySelector('[data-slot="trend-chart-readout"]')!
  assert.equal(readout.getAttribute('aria-live'), 'polite')
  assert.equal(plot.getAttribute('aria-describedby'), readout.id)

  await interact(() => void key(plot, 'ArrowRight'))
  assert.match(readout.textContent!, /^Day 1 · 0 completed · 0 not completed$/)
  await interact(() => void key(plot, 'ArrowRight'))
  assert.match(readout.textContent!, /^Day 2 · 1 completed · 1 not completed$/)
  await interact(() => void key(plot, 'End'))
  assert.match(readout.textContent!, /^Day 5/)
  await interact(() => void key(plot, 'ArrowRight'))
  assert.match(readout.textContent!, /^Day 5/, 'moved past the last period')
  await interact(() => void key(plot, 'Home'))
  assert.match(readout.textContent!, /^Day 1/)
  await interact(() => void key(plot, 'Escape'))
  assert.equal(readout.textContent, '', 'Escape clears the period, with no hint left behind')
  assert.equal(view.container.querySelector('[data-slot="chart-tooltip"]'), null)
  view.unmount()
})

test('hovering a period shows its figures in a tooltip, as the area chart does', async () => {
  const view = mount(
    h(TrendChart, { points: points(5), series: SERIES, label: 'Swap trend', scaleLabel: 'Swaps per day' }),
  )
  assert.equal(view.container.querySelector('[data-slot="chart-tooltip"]'), null, 'no tooltip at rest')
  const band = view.container.querySelector('[data-period="2026-06-003"] rect[fill="transparent"]')!
  await interact(() => {
    // React listens for pointerenter through pointerover on the root.
    band.dispatchEvent(new window.MouseEvent('pointerover', { bubbles: true }))
  })
  const tooltip = view.container.querySelector('[data-slot="chart-tooltip"]')
  assert.ok(tooltip, 'no tooltip on hover')
  assert.match(tooltip.textContent!, /^Day 4/)
  assert.match(view.container.querySelector('[data-slot="trend-chart-readout"]')!.textContent!, /^Day 4/)
  view.unmount()
})

test('the viewBox follows the measured container width', async () => {
  let notify: ((entries: { contentRect: { width: number } }[]) => void) | undefined
  ;(globalThis as Record<string, unknown>).ResizeObserver = class {
    constructor(callback: typeof notify) {
      notify = callback
    }
    observe() {}
    disconnect() {}
  }
  const view = mount(
    h(TrendChart, { points: points(90), series: SERIES, label: 'Swap trend', scaleLabel: 'Swaps per day' }),
  )
  await interact(() => notify?.([{ contentRect: { width: 480 } }]))
  // The plot's own SVG: the header's view toggle draws icon SVGs too.
  const svg = view.container.querySelector('[role="group"] > svg[viewBox]')!
  assert.equal(svg.getAttribute('width'), '100%')
  assert.equal(svg.getAttribute('viewBox'), '0 0 480 220')
  view.unmount()
  delete (globalThis as Record<string, unknown>).ResizeObserver
})

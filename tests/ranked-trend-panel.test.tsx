import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, mount } from './helpers/dom'
import { RankedTrendPanel, type RankedTrendItem } from '../src/web/components/ranked-trend-panel'
import * as web from '../src/web/index'

const series = (values: number[]) =>
  values.map((value, index) => ({ key: `2026-11-0${index + 1}`, label: `${index + 1} Nov`, value }))

const items: RankedTrendItem[] = [
  { id: 'pier', name: 'Pier 9 Club', value: 6_470, count: 16, series: series([100, 200]) },
  { id: 'lumen', name: 'Lumen Hall', value: 58_640, count: 37, series: series([3_000, 2_500, 4_500]) },
  { id: 'mill', name: 'Old Mill Stage', value: 11_305, count: 1, series: [] },
]

const noop = () => undefined
const shows = (count: number) => `${count} ${count === 1 ? 'show' : 'shows'}`

test('ranks the items by value over their total and charts the top one by default', () => {
  const markup = renderToStaticMarkup(
    h(RankedTrendPanel, { items, title: 'Sales by venue', period: '30d', onPeriodChange: noop, onSelect: noop, countText: shows, bucketLabel: 'per day' }),
  )
  assert.match(markup, /role="region" aria-labelledby="([^"]+)"[\s\S]*<h3 [^>]*id="\1">Sales by venue</)
  assert.match(markup, /data-slot="ranked-trend-backdrop" class="[^"]*border-r border-border/)
  const order = ['Lumen Hall', 'Old Mill Stage', 'Pier 9 Club'].map((name) => markup.indexOf(`>${name}<`))
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'ranked by value')
  assert.match(markup, />58,640</)
  assert.match(markup, />1 show</)
  assert.match(markup, /data-slot="ranked-trend-total"[\s\S]*>76,415</)
  assert.match(markup, />37 shows · per day</)
  assert.match(markup, /data-slot="ranked-trend-series-total"[^>]*>10,000</)
  assert.match(markup, /role="radiogroup" aria-label="Period"/)
})

test('without onPeriodChange there is no period control; an item with no points shows the chart empty state', () => {
  const markup = renderToStaticMarkup(h(RankedTrendPanel, { items, title: 'Sales', selectedId: 'mill', onSelect: noop }))
  assert.doesNotMatch(markup, /role="radiogroup"/)
  assert.match(markup, />No data in this period</)
})

test('no items renders the empty state, never an empty split', () => {
  const markup = renderToStaticMarkup(h(RankedTrendPanel, { items: [], title: 'Sales', onSelect: noop }))
  assert.match(markup, />Nothing in this period</)
  assert.doesNotMatch(markup, /21rem/)
})

test('picking an item reports it to the host', async () => {
  function Host() {
    const [selected, setSelected] = useState<string | undefined>(undefined)
    return h(RankedTrendPanel, { items, title: 'Sales', selectedId: selected, onSelect: setSelected })
  }
  const view = mount(h(Host))
  const rows = [...view.container.querySelectorAll('[data-slot="bar-list-row"] > button')] as HTMLButtonElement[]
  await interact(() => rows[2].click())
  assert.match(view.container.querySelector('h4')!.textContent!, /Pier 9 Club/)
  assert.equal(web.RankedTrendPanel, RankedTrendPanel)
  view.unmount()
})

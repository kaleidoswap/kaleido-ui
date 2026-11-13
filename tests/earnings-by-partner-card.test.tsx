import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, mount } from './helpers/dom'
import { EarningsByPartnerCard, type EarningsPartner } from '../src/web/components/earnings-by-partner-card'
import * as web from '../src/web/index'

// One card for the admin overview and the partner dashboard: the partners
// ranked by revenue beside the selected one's swap volume. Data comes in
// through props; period and selection are the host's state.

const series = (values: number[]) =>
  values.map((volume, index) => ({ key: `2026-11-0${index + 1}`, label: `${index + 1} Nov`, volume }))

const partners: EarningsPartner[] = [
  { id: 'orbit', name: 'Orbit Pay', revenue: 97_500, swaps: 301, volumeSeries: series([10_000, 20_000]) },
  { id: 'acme', name: 'Acme Wallet', revenue: 412_300, swaps: 1_284, volumeSeries: series([300_000, 250_000, 450_000]) },
  { id: 'nimbus', name: 'Nimbus Wallet', revenue: 164_200, swaps: 1, volumeSeries: [] },
]

const noop = () => undefined

test('the left ranks partners by revenue over the total; the right charts the top one by default', () => {
  const markup = renderToStaticMarkup(
    h(EarningsByPartnerCard, { partners, period: '30d', onPeriodChange: noop, onSelect: noop, unit: 'sat', bucketLabel: 'per day' }),
  )
  assert.match(markup, /role="region" aria-labelledby="([^"]+)"[\s\S]*<h3 [^>]*id="\1">Earnings by partner</)
  // The platform dashboard's split, left on the hero gradient, no divider between the halves.
  assert.match(markup, /lg:grid-cols-\[21rem_minmax\(0,1fr\)\]/)
  assert.match(markup, /bg-gradient-card-hero/)
  assert.doesNotMatch(markup, /lg:border-r|border-l\b|divide-x/)
  const order = ['Acme Wallet', 'Nimbus Wallet', 'Orbit Pay'].map((name) => markup.indexOf(`>${name}<`))
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'ranked by revenue')
  assert.match(markup, />412,300 sat</)
  assert.match(markup, />1,284 swaps</)
  assert.match(markup, />1 swap</)
  assert.match(markup, /data-slot="earnings-total"[\s\S]*>674,000 sat</)
  // The selected partner is the top one: pressed in the list, named over the chart.
  assert.match(markup, /aria-pressed="true"[^>]*>[\s\S]*?Acme Wallet/)
  assert.match(markup, />Swap volume · Acme Wallet</)
  assert.match(markup, />1,284 swaps · per day</)
  assert.match(markup, /data-slot="earnings-volume"[^>]*>1,000,000 sat</)
  assert.match(markup, /data-slot="chart-end-halo"/)
  // The period is a compact radio group in the header.
  assert.match(markup, /role="radiogroup" aria-label="Period" data-slot="segmented-tabs" data-size="compact"/)
  assert.match(markup, /aria-checked="true" tabindex="0"[^>]*>30D</)
})

test('in BTC, amounts given in sats print as bitcoin; a partner with no volume shows the chart empty state', () => {
  const markup = renderToStaticMarkup(
    h(EarningsByPartnerCard, { partners, selectedId: 'nimbus', period: '7d', onPeriodChange: noop, onSelect: noop, unit: 'BTC' }),
  )
  assert.match(markup, />0.004123 BTC</)
  assert.match(markup, />Swap volume · Nimbus Wallet</)
  assert.match(markup, />No swaps in this period</)
})

test('no partners renders the empty state, never an empty split', () => {
  const markup = renderToStaticMarkup(
    h(EarningsByPartnerCard, { partners: [], period: '30d', onPeriodChange: noop, onSelect: noop, unit: 'sat' }),
  )
  assert.match(markup, />No partner earnings in this period</)
  assert.doesNotMatch(markup, /21rem/)
})

test('picking a partner and a period reports them to the host', async () => {
  function Host() {
    const [period, setPeriod] = useState('30d')
    const [selected, setSelected] = useState<string | undefined>(undefined)
    return h(EarningsByPartnerCard, { partners, period, onPeriodChange: setPeriod, selectedId: selected, onSelect: setSelected, unit: 'sat' })
  }
  const view = mount(h(Host))
  const rows = [...view.container.querySelectorAll('[data-slot="bar-list-row"] > button')] as HTMLButtonElement[]
  await interact(() => rows[2].click())
  assert.match(view.container.querySelector('h4')!.textContent!, /Orbit Pay/)
  assert.equal(rows[2].getAttribute('aria-pressed'), 'true')
  const radios = [...view.container.querySelectorAll('[role="radio"]')] as HTMLButtonElement[]
  await interact(() => radios[2].click())
  assert.equal(radios[2].getAttribute('aria-checked'), 'true')
  assert.equal(web.EarningsByPartnerCard, EarningsByPartnerCard)
  view.unmount()
})

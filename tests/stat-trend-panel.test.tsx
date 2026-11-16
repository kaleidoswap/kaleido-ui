import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { StatTrendPanel } from '../src/web/components/stat-trend-panel'

const series = [
  { key: '2026-11-12', label: '12 Nov', value: 0 },
  { key: '2026-11-13', label: '13 Nov', value: 1200 },
]

test('the column holds the figure under its eyebrow, the breakdown and the action; the chart sits beside it', () => {
  const markup = renderToStaticMarkup(
    h(StatTrendPanel, {
      label: 'Active members',
      value: '3,718',
      valueSuffix: '+126 this month',
      rows: [
        { label: 'On a free trial', value: '284' },
        { label: 'Frozen memberships', value: '57' },
      ],
      action: h('a', { href: '/members' }, 'Open member list'),
      series,
      chartTitle: 'Daily check-ins',
      chartDescription: 'Scans per local day',
    }),
  )
  // The region is named by the eyebrow.
  assert.match(markup, /role="region" aria-labelledby="([^"]+)"[\s\S]*<p id="\1"[^>]*>Active members</)
  assert.match(markup, /lg:grid-cols-\[21rem_minmax\(0,1fr\)\]/)
  // The column is on the hero gradient with a hairline beside it.
  assert.match(markup, /data-slot="stat-trend-column" class="[^"]*bg-gradient-card-hero[^"]*lg:border-r lg:border-border/)
  assert.match(markup, />3,718<[\s\S]*>\+126 this month</)
  assert.match(markup, /<dt[^>]*>On a free trial<\/dt>[\s\S]*284/)
  assert.match(markup, /href="\/members"/)
  assert.match(markup, />Daily check-ins</)
  assert.match(markup, />Scans per local day</)
})

test('no rows and no action leave the column to the figure', () => {
  const markup = renderToStaticMarkup(h(StatTrendPanel, { label: 'Stock', value: '0', series, chartTitle: 'Stock' }))
  assert.doesNotMatch(markup, /data-slot="summary-rows"/)
})

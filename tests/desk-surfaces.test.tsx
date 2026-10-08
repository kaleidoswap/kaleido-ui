import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { MetricCard } from '../src/web/components/metric-card'
import { PageHeader } from '../src/web/components/page-header'
import { SummaryRows } from '../src/web/components/summary-rows'

const TAILWIND_DEFAULT_SIZE = /(?<![\w-])text-(xs|sm|base|lg|[2-9]?xl)(?![\w-])/

// ── MetricCard ──────────────────────────────────────────────────────────────

test('a comfortable MetricCard is a p-4 tile: eyebrow label, headline value', () => {
  const markup = renderToStaticMarkup(
    h(MetricCard, { size: 'comfortable', label: 'Swaps', value: '1,204', description: 'last 30 days', icon: 'swap_horiz' }),
  )
  assert.match(markup, /data-size="comfortable"[^>]*class="[^"]*\bp-4\b/)
  assert.match(markup, /data-slot="metric-card-label" class="text-mini font-medium uppercase tracking-eyebrow text-muted-foreground"/)
  assert.match(markup, /data-slot="metric-card-value" class="[^"]*text-headline[^"]*tabular-nums|data-slot="metric-card-value" class="[^"]*tabular-nums[^"]*text-headline/)
  assert.match(markup, /last 30 days/)
  assert.doesNotMatch(markup, TAILWIND_DEFAULT_SIZE)
})

test('the comfortable icon sits after the figure; compact keeps it beside the label', () => {
  const comfortable = renderToStaticMarkup(h(MetricCard, { size: 'comfortable', label: 'L', value: '1', icon: 'bolt' }))
  assert.ok(comfortable.indexOf('metric-card-value') < comfortable.indexOf('metric-card-icon'))
  const compact = renderToStaticMarkup(h(MetricCard, { label: 'L', value: '1', icon: 'bolt' }))
  assert.ok(compact.indexOf('metric-card-icon') < compact.indexOf('metric-card-label'))
  assert.match(compact, /data-size="compact"[^>]*class="[^"]*p-2\.5/)
})

test('the tile is a group named by its label, or by aria-label', () => {
  const markup = renderToStaticMarkup(h(MetricCard, { label: 'Volume', value: '—' }))
  const labelId = /data-slot="metric-card-label"/.test(markup) && /<span id="([^"]+)" data-slot="metric-card-label"/.exec(markup)![1]
  assert.match(markup, new RegExp(`role="group" aria-labelledby="${labelId}"`))
  const named = renderToStaticMarkup(h(MetricCard, { label: 'Volume', value: '—', 'aria-label': 'Volume, failed to load' }))
  assert.match(named, /aria-label="Volume, failed to load"/)
  assert.doesNotMatch(named, /aria-labelledby/)
})

// ── PageHeader variant="page" ───────────────────────────────────────────────

test('a page header is the page h1 with a description and an action, no back button', () => {
  const markup = renderToStaticMarkup(
    h(PageHeader, {
      variant: 'page',
      title: 'API keys',
      description: 'Keys your apps use to call the platform.',
      action: h('button', { type: 'button' }, 'Create key'),
    }),
  )
  assert.equal(markup.match(/<h1/g)?.length, 1)
  assert.match(markup, /<h1[^>]*>API keys<\/h1>/)
  assert.match(markup, /Keys your apps use/)
  assert.doesNotMatch(markup, /aria-label="Go back"/)
  // The action is the title row's end, and the row wraps on a narrow screen.
  assert.match(markup, /data-variant="page" class="[^"]*flex-wrap[^"]*justify-between/)
  assert.match(markup, /data-slot="page-header-actions"[^>]*>.*Create key/s)
  assert.doesNotMatch(markup, /sticky/)
})

test('a page header draws a back button only when onBack is passed', () => {
  const markup = renderToStaticMarkup(
    h(PageHeader, { variant: 'page', title: 'Swap sw_1', onBack: () => undefined }),
  )
  assert.match(markup, /aria-label="Go back"/)
})

test('the default PageHeader is still the app bar', () => {
  const markup = renderToStaticMarkup(h(PageHeader, { title: 'Activity' }))
  assert.match(markup, /sticky/)
  assert.doesNotMatch(markup, /<h1/)
})

// ── SummaryRows semantics ───────────────────────────────────────────────────

const rows = [
  { label: 'Created', value: '12:00:01', tone: 'muted' as const },
  { label: 'Paid', value: '12:00:09', hint: '+8s' },
]

test('SummaryRows is a dl with a dt/dd pair per row by default', () => {
  const markup = renderToStaticMarkup(h(SummaryRows, { rows }))
  assert.match(markup, /^<dl /)
  assert.equal(markup.match(/<dt /g)?.length, rows.length)
  assert.equal(markup.match(/<dd /g)?.length, rows.length)
})

test('as="ol" renders an ordered log with one li per row', () => {
  const markup = renderToStaticMarkup(h(SummaryRows, { rows, as: 'ol' }))
  assert.match(markup, /^<ol /)
  assert.equal(markup.match(/<li /g)?.length, rows.length)
  assert.doesNotMatch(markup, /<dt|<dd/)
})

test('the visual is unchanged across semantics: leader-line rows, no dividers', () => {
  for (const as of ['dl', 'ol', 'ul'] as const) {
    const markup = renderToStaticMarkup(h(SummaryRows, { rows, as }))
    assert.equal(markup.match(/border-b border-solid/g)?.length, rows.length)
    assert.doesNotMatch(markup, /border-t|divide-/)
  }
})

test('a muted value reads quieter than its label', () => {
  const markup = renderToStaticMarkup(h(SummaryRows, { rows }))
  assert.match(markup, /class="truncate tabular-nums text-caption font-normal text-muted-foreground">12:00:01/)
})

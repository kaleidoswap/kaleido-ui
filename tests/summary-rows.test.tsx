import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { SummaryRows, type SummaryRowItem } from '../src/web/components/summary-rows'

const rows: SummaryRowItem[] = [
  { label: 'You pay', value: '1,005 sats', emphasis: true },
  { label: 'Invoice receives', value: '1,000 sats' },
  { label: 'Fee', value: '5 sats', hint: '0.5% spread' },
  { label: 'Solver', value: '66422c…e3ce', mono: true },
]

test('the deciding number is the only emphasised row', () => {
  const markup = renderToStaticMarkup(createElement(SummaryRows, { rows }))
  assert.equal(markup.match(/data-emphasis="true"/g)?.length, 1)
})

test('rows layer on bg-muted and separate by spacing, never dividers', () => {
  const markup = renderToStaticMarkup(createElement(SummaryRows, { rows }))
  assert.equal(markup.match(/bg-muted\/40/g)?.length, rows.length)
  assert.doesNotMatch(markup, /border-t|divide-/)
})

test('amounts are tabular so a stack of them lines up', () => {
  const markup = renderToStaticMarkup(createElement(SummaryRows, { rows }))
  assert.equal(markup.match(/tabular-nums/g)?.length, rows.length)
})

test('hints and mono values render only where asked for', () => {
  const markup = renderToStaticMarkup(createElement(SummaryRows, { rows }))
  assert.match(markup, /0\.5% spread/)
  assert.equal(markup.match(/font-mono/g)?.length, 1)
})

test('a toned value carries its semantic colour', () => {
  const markup = renderToStaticMarkup(
    createElement(SummaryRows, {
      rows: [{ label: 'Refund opens', value: 'in 90 min', tone: 'warning' }],
    }),
  )
  assert.match(markup, /text-warning/)
})

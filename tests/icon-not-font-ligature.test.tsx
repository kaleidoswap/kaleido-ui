import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ActivityDetailRow } from '../src/web/components/activity-detail-row'
import { StatusBadge } from '../src/web/components/status-badge'

// A `material-symbols-outlined` span renders the icon NAME as text for any
// consumer that has not self-hosted the ~3.8 MB Material Symbols font. Both
// components below needed glyphs that already exist in the inline SVG Icon set,
// so the font dependency bought nothing and cost a broken pill.

test('a status badge draws its icon, it does not spell it', () => {
  for (const [status, leaked] of [
    ['failed', 'error'],
    ['pending', 'schedule'],
    ['completed', 'check_circle'],
  ] as const) {
    const markup = renderToStaticMarkup(createElement(StatusBadge, { status }))
    assert.doesNotMatch(
      markup,
      /material-symbols-outlined/,
      `${status} still renders a font ligature`,
    )
    // The label is real text and must survive; the icon name must not appear.
    assert.doesNotMatch(markup, new RegExp(`>${leaked}<`), `${status} leaked "${leaked}" as text`)
    assert.match(markup, /<svg/, `${status} rendered no icon at all`)
  }
})

test('a status badge still names its state in words', () => {
  // The glyph is decoration; the word is the information.
  assert.match(renderToStaticMarkup(createElement(StatusBadge, { status: 'failed' })), /Failed/)
  assert.match(renderToStaticMarkup(createElement(StatusBadge, { status: 'pending' })), /Pending/)
})

test('a detail row draws its copy affordance', () => {
  const markup = renderToStaticMarkup(
    createElement(ActivityDetailRow, {
      label: 'Pair key',
      value: 'BTC/L-USDT',
      onCopy: () => {},
    }),
  )
  assert.doesNotMatch(markup, /material-symbols-outlined/)
  assert.doesNotMatch(markup, />content_copy</)
  assert.match(markup, /<svg/)
})

test('a detail row with no copy handler renders no button', () => {
  const markup = renderToStaticMarkup(
    createElement(ActivityDetailRow, { label: 'Pair key', value: 'BTC/L-USDT' }),
  )
  assert.doesNotMatch(markup, /<button/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Tag, type TagTone } from '../src/web/components/tag'
import { StatusChip } from '../src/web/components/info-chip'
import * as web from '../src/web/index'

// A Tag names what a thing is ("Revenue share", "Markup"); unlike StatusChip it
// has no dot, because it says nothing about how the thing is doing.

test('a tag is the StatusChip pill without the dot', () => {
  const tag = renderToStaticMarkup(h(Tag, { tone: 'info' }, 'Revenue share'))
  const chip = renderToStaticMarkup(h(StatusChip, { status: 'info', label: 'Info', pulse: false }))
  assert.match(tag, /^<span data-slot="tag" data-tone="info" class="[^"]*rounded-full px-2 py-0.5 text-xxs font-bold leading-4/)
  assert.match(chip, /rounded-full px-2 py-0.5 text-xxs font-bold leading-4/)
  assert.doesNotMatch(tag, /rounded-full bg-|size-1\.5|animate-ping/)
  assert.match(tag, />Revenue share<\/span><\/span>$/)
})

test('every tone is a tint and a per-theme foreground, blue for info and the chip for bitcoin', () => {
  const tones: TagTone[] = ['neutral', 'success', 'warning', 'danger', 'info', 'violet', 'bitcoin']
  for (const tone of tones) {
    const markup = renderToStaticMarkup(h(Tag, { tone }, tone))
    assert.doesNotMatch(markup, /#[0-9a-f]{3,8}\b|rgba?\(/i, tone)
  }
  assert.match(renderToStaticMarkup(h(Tag, { tone: 'info' }, 'x')), /bg-info\/12 text-info-fg/)
  assert.match(renderToStaticMarkup(h(Tag, { tone: 'bitcoin' }, 'x')), /bg-network-bitcoin-chip text-network-bitcoin-fg/)
  assert.match(renderToStaticMarkup(h(Tag, null, 'x')), /data-tone="neutral"/)
  assert.equal(web.Tag, Tag)
})

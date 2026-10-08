import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { cn, SectionLabel, ToneBadge } from '../src/web/index'

// A stock tailwind-merge reads kaleido-ui's custom sizes as text COLOURS, so
// a later colour class dropped them: `cn('text-title', 'text-danger')` came
// back as just `text-danger`, and components lost their font size.

test('cn keeps a kaleido-ui text size next to a text colour', () => {
  for (const size of ['mini', 'xxs', 'tiny', 'caption', 'body', 'subhead', 'title', 'headline', 'display']) {
    assert.equal(cn(`text-${size}`, 'text-danger'), `text-${size} text-danger`)
    assert.equal(cn('text-primary', `text-${size}`), `text-primary text-${size}`)
  }
})

test('cn keeps icon sizes next to colours', () => {
  assert.equal(cn('text-icon-md', 'text-network-lightning'), 'text-icon-md text-network-lightning')
  assert.equal(cn('text-icon-6xl', 'text-brand'), 'text-icon-6xl text-brand')
})

test('cn still resolves conflicts inside one scale', () => {
  assert.equal(cn('text-caption', 'text-title'), 'text-title')
  assert.equal(cn('text-sm', 'text-caption'), 'text-caption')
  assert.equal(cn('text-danger', 'text-danger-fg'), 'text-danger-fg')
  assert.equal(cn('text-icon-sm', 'text-icon-lg'), 'text-icon-lg')
})

test('cn knows the custom shadow, radius and tracking tokens', () => {
  assert.equal(cn('shadow-glow-violet', 'shadow-black/40'), 'shadow-glow-violet shadow-black/40')
  assert.equal(cn('shadow-glow-primary-soft', 'shadow-glow-primary'), 'shadow-glow-primary')
  assert.equal(cn('shadow-lg', 'shadow-popover'), 'shadow-popover')
  assert.equal(cn('rounded-xl', 'rounded-card'), 'rounded-card')
  assert.equal(cn('rounded-t-xl', 'rounded-t-pill'), 'rounded-t-pill')
  assert.equal(cn('tracking-wide', 'tracking-eyebrow'), 'tracking-eyebrow')
})

test('SectionLabel keeps its micro size when given a colour', () => {
  const markup = renderToStaticMarkup(
    createElement(SectionLabel, { className: 'text-danger' }, 'Networks'),
  )
  assert.match(markup, /text-danger/)
  assert.match(markup, /text-xxs|text-mini/)
})

test('ToneBadge keeps its micro size alongside its tone colour', () => {
  const markup = renderToStaticMarkup(createElement(ToneBadge, { tone: 'warning' }, 'Pending'))
  assert.match(markup, /text-xxs|text-mini|text-tiny/)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Icon } from '../src/web/primitives/icon'
import { cn } from '../src/web/utils/cn'

// Stock tailwind-merge reads any `text-<unknown>` as a colour, so a scale size
// and a colour in one `cn` call collided and the size was dropped.

test('a type-scale size and a colour both survive cn', () => {
  assert.equal(cn('text-caption', 'text-muted-foreground'), 'text-caption text-muted-foreground')
  assert.equal(cn('text-mini font-bold', 'text-primary'), 'text-mini font-bold text-primary')
})

test('an icon size and a colour both survive cn', () => {
  assert.equal(cn('text-icon-2xl', 'text-danger'), 'text-icon-2xl text-danger')
  const markup = renderToStaticMarkup(
    createElement(Icon, { name: 'error', className: 'animate-spin text-icon-2xl text-primary' }),
  )
  assert.match(markup, /text-icon-2xl/)
  assert.match(markup, /text-primary/)
})

test('two sizes still resolve to the last one', () => {
  assert.equal(cn('text-caption', 'text-body'), 'text-body')
  assert.equal(cn('text-icon-sm', 'text-icon-lg'), 'text-icon-lg')
  assert.equal(cn('tracking-eyebrow', 'tracking-normal'), 'tracking-normal')
})

test('a gradient class keeps the colour it sits on', () => {
  assert.equal(cn('bg-card bg-gradient-card'), 'bg-card bg-gradient-card')
  assert.equal(cn('bg-secondary', 'bg-gradient-violet'), 'bg-secondary bg-gradient-violet')
  assert.equal(cn('text-white text-gradient-brand'), 'text-white text-gradient-brand')
  assert.equal(cn('border-border border-gradient-brand'), 'border-border border-gradient-brand')
  assert.equal(cn('bg-gradient-card', 'bg-gradient-violet'), 'bg-gradient-violet')
})

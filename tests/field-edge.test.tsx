import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { fieldEdge } from '../src/tokens/app-semantic'
import { Input } from '../src/web/primitives/input'
import { NumberInput } from '../src/web/primitives/number-input'
import { fieldSurface } from '../src/web/utils/field-styles'

// Every field takes its edge from one token, so a different edge is a change
// to `fieldEdge` and nowhere else; and the ring alone marks focus.

const css = readFileSync(join(import.meta.dirname, '..', 'src', 'css', 'kaleido-ui.css'), 'utf8')

test('the field edge is one token, emitted at its two alphas', () => {
  assert.match(css, new RegExp(`--color-field-edge: rgb\\(var\\(--app-${fieldEdge.token}\\) / ${fieldEdge.alpha}\\);`))
  assert.match(css, new RegExp(`--color-field-edge-hover: rgb\\(var\\(--app-${fieldEdge.token}\\) / ${fieldEdge.hoverAlpha}\\);`))
})

test('every field draws the field edge, and focus is the ring without a glow', () => {
  assert.match(fieldSurface, /\bring-field-edge\b/)
  assert.match(fieldSurface, /\bhover:ring-field-edge-hover\b/)
  assert.match(fieldSurface, /focus-visible:ring-primary\/50/)
  assert.doesNotMatch(fieldSurface, /glow/)
  for (const markup of [renderToStaticMarkup(h(Input)), renderToStaticMarkup(h(NumberInput))]) {
    assert.match(markup, /ring-field-edge/)
    assert.doesNotMatch(markup, /ring-secondary\/15/)
  }
})

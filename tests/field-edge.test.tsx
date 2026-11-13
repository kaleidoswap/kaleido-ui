import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
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

test('no focus state adds a glow: focus is the ring alone everywhere', () => {
  const root = join(import.meta.dirname, '..', 'src', 'web')
  const offenders: string[] = []
  for (const file of readdirSync(root, { recursive: true, encoding: 'utf8' })) {
    if (!/\.tsx?$/.test(file)) continue
    const source = readFileSync(join(root, file), 'utf8')
    for (const match of source.matchAll(/\b(?:group-|peer-)?focus(?:-visible|-within)?:shadow-glow[\w-]*/g)) {
      offenders.push(`${file}: ${match[0]}`)
    }
  }
  assert.deepEqual(offenders, [])
})

test('the wallet fields draw the field edge through fieldSurface, not the old violet outline', () => {
  const components = join(import.meta.dirname, '..', 'src', 'web', 'components')
  for (const name of [
    'activity-filter-bar',
    'btc-unified-receive',
    'deposit-asset-selection',
    'deposit-generated-view',
    'deposit-pre-generation',
    'secret-reveal-card',
    'withdraw-amount-input',
  ]) {
    const source = readFileSync(join(components, `${name}.tsx`), 'utf8')
    assert.match(source, /cn\(fieldSurface\b/, `${name} uses fieldSurface`)
    assert.doesNotMatch(source, /ring-secondary\/15/, `${name} still draws ring-secondary/15`)
  }
})

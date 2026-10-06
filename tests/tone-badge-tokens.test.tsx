import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ToneBadge } from '../src/web/components/settings-section-card'
import { colors, lightSemanticColors } from '../src/tokens/colors'

const components = join(import.meta.dirname, '..', 'src', 'web', 'components')

// `border-white/10 bg-white/[0.05] text-white/55` disappeared on the light
// theme (a white card): white on white. Theme tokens resolve per theme.

test('ToneBadge and InfoChip carry no hard-coded white alpha', () => {
  for (const file of ['settings-section-card.tsx', 'info-chip.tsx']) {
    assert.doesNotMatch(readFileSync(join(components, file), 'utf8'), /white\//, file)
  }
})

test('the muted badge is drawn from tokens that differ per theme', () => {
  const markup = renderToStaticMarkup(h(ToneBadge, null, 'Revoked'))
  assert.doesNotMatch(markup, /border/)
  assert.match(markup, /bg-foreground\/\[0\.07\]/)
  assert.match(markup, /text-muted-foreground/)
  // On dark: 58% cool-white text.
  assert.equal(colors.mutedFg, 'rgba(232, 230, 245, 0.58)')
  // On light they are dark ink on the white card, so the badge stays legible.
  assert.equal(lightSemanticColors.mutedFg, '#4F4A75')
  assert.equal(lightSemanticColors.foreground, '#15122A')
})

test('a status is the eyebrow; case="none" sets a value in caption with nothing added', () => {
  const status = renderToStaticMarkup(h(ToneBadge, { tone: 'success' }, 'Active'))
  assert.match(status, /uppercase/)
  assert.match(status, /tracking-eyebrow/)

  const value = renderToStaticMarkup(h(ToneBadge, { tone: 'primary', case: 'none' }, '1,250 sats'))
  assert.match(value, /text-caption/)
  assert.doesNotMatch(value, /uppercase|tracking-/)
  assert.doesNotMatch(value, /(?<![\w-])text-(xs|sm|base|lg)(?![\w-])/)
})

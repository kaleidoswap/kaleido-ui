import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { ThemeToggle } from '../src/web/components/theme-toggle'

test('ThemeToggle is a named switch, checked in dark mode', () => {
  const dark = renderToStaticMarkup(h(ThemeToggle, { mode: 'dark', onModeChange: () => undefined }))
  assert.match(dark, /role="switch"/)
  assert.match(dark, /aria-checked="true"/)
  assert.match(dark, /aria-label="Dark mode"/)
  assert.match(dark, /data-mode="dark"/)

  const light = renderToStaticMarkup(h(ThemeToggle, { mode: 'light', onModeChange: () => undefined }))
  assert.match(light, /aria-checked="false"/)
  assert.match(light, /title="Switch to dark mode"/)
})

test('ThemeToggle draws both glyphs as inline SVG, decorative', () => {
  const markup = renderToStaticMarkup(h(ThemeToggle, { mode: 'dark', onModeChange: () => undefined }))
  assert.equal((markup.match(/<svg/g) ?? []).length, 2)
  assert.equal((markup.match(/aria-hidden="true"/g) ?? []).length >= 2, true)
})

test('an uncontrolled ThemeToggle renders on the server (no document, no storage)', () => {
  const markup = renderToStaticMarkup(h(ThemeToggle, { defaultMode: 'light', storageKey: null }))
  assert.match(markup, /aria-checked="false"/)
})

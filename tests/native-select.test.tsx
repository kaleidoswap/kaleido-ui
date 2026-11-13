import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { FormField } from '../src/web/components/form-field'
import { NativeSelect } from '../src/web/primitives/native-select'
import * as web from '../src/web/index'

// A short list in a dialog (a roll deadline) is the platform's own select,
// dressed as every other field: the same surface and edge, the Select chevron.

const deadlines = ['24 hours', '7 days', '30 days'].map((label) => h('option', { key: label, value: label }, label))

test('a native select wears the field surface and the Select chevron', () => {
  const markup = renderToStaticMarkup(h(NativeSelect, { defaultValue: '7 days', className: 'max-w-56', 'aria-label': 'Deadline' }, deadlines))
  // The caller's class sizes the box; the select fills it.
  assert.match(markup, /^<div data-slot="native-select" class="relative w-full max-w-56">/)
  assert.match(markup, /<select class="[^"]*appearance-none[^"]*ring-field-edge[^"]*" aria-label="Deadline">/)
  assert.match(markup, /<option value="7 days" selected="">7 days<\/option>/)
  // The chevron is decoration and lets the press through to the select.
  assert.match(markup, /<svg[^>]*aria-hidden="true"[^>]*class="[^"]*pointer-events-none/)
})

test('a form field labels the select itself, and it is exported from the package', () => {
  const markup = renderToStaticMarkup(h(FormField, { label: 'Old key stops after', hint: 'Retires in 7 days', id: 'roll' }, h(NativeSelect, null, deadlines)))
  assert.match(markup, /<select [^>]*id="roll" aria-describedby="roll-hint"/)
  assert.equal(web.NativeSelect, NativeSelect)
})

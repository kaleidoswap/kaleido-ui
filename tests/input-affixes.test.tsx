import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, mount } from './helpers/dom'
import { FormField } from '../src/web/components/form-field'
import { Input } from '../src/web/primitives/input'

// A unit inside a field (the markup's "%", a share in "bps") sits beside the
// input, not over it, so typed text never runs under it; and it is read with
// the value.

test('without a prefix or suffix, Input is the bare input it always was', () => {
  const markup = renderToStaticMarkup(h(Input, { className: 'max-w-40', placeholder: 'Name' }))
  assert.match(markup, /^<input [^>]*class="[^"]*ring-field-edge[^"]*max-w-40"/)
  assert.doesNotMatch(markup, /input-field|<div/)
})

test('a suffix sits beside the input in the field box, and is read after the value', () => {
  const markup = renderToStaticMarkup(
    h(FormField, { label: 'Markup', hint: 'Up to your cap', id: 'markup' }, h(Input, { suffix: '%', className: 'max-w-56', inputMode: 'decimal' })),
  )
  // The box carries the surface and the caller's class; the input is bare inside it.
  assert.match(markup, /<div data-slot="input-field" class="[^"]*ring-field-edge[^"]*focus-within:ring-primary\/50[^"]*max-w-56"/)
  assert.match(markup, /<input [^>]*class="h-full min-w-0 flex-1 bg-transparent/)
  const suffixId = /<span id="([^"]+)" data-slot="input-suffix"[^>]*>%<\/span>/.exec(markup)?.[1]
  assert.ok(suffixId, 'the suffix renders after the input')
  assert.ok(markup.indexOf('<input') < markup.indexOf('input-suffix'))
  // FormField's hint is kept, the unit joins it.
  assert.match(markup, new RegExp(`aria-describedby="markup-hint ${suffixId}"`))
  assert.match(markup, /<input [^>]*id="markup"/)
})

test('a prefix comes before the input; the ref is the input; a press on the unit focuses it', async () => {
  const ref = createRef<HTMLInputElement>()
  const { container, unmount } = mount(h(Input, { ref, prefix: '$', suffix: 'bps', 'aria-label': 'Share' }))
  const [prefix, input, suffix] = Array.from(container.querySelector('[data-slot="input-field"]')!.children)
  assert.equal(prefix.getAttribute('data-slot'), 'input-prefix')
  assert.equal(input.tagName, 'INPUT')
  assert.equal(suffix.textContent, 'bps')
  assert.equal(ref.current, input)
  // Spied, not really focused: React DOM loads before the test's jsdom, and
  // its change-event fallback throws when a text input takes focus there.
  let focused = 0
  ;(input as HTMLInputElement).focus = () => {
    focused += 1
  }
  let pressed: Event | undefined
  await interact(() => {
    pressed = new window.MouseEvent('pointerdown', { bubbles: true, cancelable: true })
    suffix.dispatchEvent(pressed)
  })
  assert.equal(focused, 1)
  assert.equal(pressed!.defaultPrevented, true)
  unmount()
})

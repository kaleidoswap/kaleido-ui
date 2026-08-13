import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { SwitchRow } from '../src/web/components/switch-row'
import { Switch } from '../src/web/primitives/switch'

test('a switch row names its own switch', () => {
  // SwitchRow renders the visible label itself, so the control needs the
  // accessible name passed through — a role="switch" with no name is
  // unreachable by screen readers and by name-based test queries.
  const markup = renderToStaticMarkup(
    createElement(SwitchRow, {
      label: 'Swap over Arkade Intents',
      description: 'Pay and receive Lightning from your Arkade balance.',
      checked: false,
      onCheckedChange: () => {},
    }),
  )
  assert.match(markup, /role="switch"[^>]*aria-label="Swap over Arkade Intents"/)
})

test('the switch reports its state and stays a non-submitting button', () => {
  const markup = renderToStaticMarkup(
    createElement(Switch, { checked: true, 'aria-label': 'Delegation' }),
  )
  assert.match(markup, /aria-checked="true"/)
  // Inside a form, a default-type button would submit it on toggle.
  assert.match(markup, /type="button"/)
})

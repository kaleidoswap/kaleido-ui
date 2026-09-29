import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'

import { mount } from './helpers/dom'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../src/web/primitives/dialog'

// A secret shown once — a newly created API key — must not sit beside a
// control that reads as "close": the dialog closes only through an explicit
// "I have stored this key". The corner X is on by default and can be turned off.

const open = (props: Record<string, unknown>) =>
  mount(
    createElement(
      Dialog,
      { open: true },
      createElement(
        DialogContent,
        props,
        createElement(DialogTitle, null, 'API key created'),
        createElement(DialogDescription, null, 'Store it now.'),
      ),
    ),
  )

const closeButton = () =>
  [...document.querySelectorAll('button')].find((button) => button.textContent === 'Close')

test('the corner close is drawn by default', () => {
  const view = open({})
  assert.ok(closeButton(), 'no Close button in the default dialog')
  assert.match(document.body.innerHTML, /API key created/)
  view.unmount()
})

test('showClose={false} renders no close button, and nothing else changes', () => {
  const view = open({ showClose: false })
  assert.equal(closeButton(), undefined)
  assert.equal(document.querySelectorAll('[role="dialog"] button').length, 0)
  assert.match(document.body.innerHTML, /API key created/)
  view.unmount()
})

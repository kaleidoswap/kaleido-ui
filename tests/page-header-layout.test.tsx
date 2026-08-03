import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { PageHeader } from '../src/web/components/page-header'

test('a back button and title share the left header group while the right slot stays separate', () => {
  const markup = renderToStaticMarkup(
    createElement(PageHeader, {
      title: 'Network details',
      onBack: () => undefined,
      backLabel: 'Back to networks',
      right: createElement('button', { type: 'button' }, 'Help'),
    }),
  )

  assert.match(
    markup,
    /data-slot="page-header-leading"[^>]*>.*aria-label="Back to networks".*Network details.*<\/div><div data-slot="page-header-actions"[^>]*>.*Help/s,
  )
  assert.doesNotMatch(markup, /text-center/)
})

test('a title without a back button still uses the left header group', () => {
  const markup = renderToStaticMarkup(
    createElement(PageHeader, {
      title: 'Activity',
      subtitle: 'Recent transfers',
      right: createElement('button', { type: 'button' }, 'Filter'),
    }),
  )

  assert.match(
    markup,
    /data-slot="page-header-leading"[^>]*>.*Activity.*Recent transfers.*<\/div><div data-slot="page-header-actions"[^>]*>.*Filter/s,
  )
  assert.doesNotMatch(markup, /text-center/)
})

test('custom left content never separates a back button from its title', () => {
  const markup = renderToStaticMarkup(
    createElement(PageHeader, {
      left: createElement('span', null, 'Account'),
      title: 'Network details',
      onBack: () => undefined,
    }),
  )

  assert.match(
    markup,
    /Account.*aria-label="Go back".*<\/button><div class="min-w-0 text-left">.*Network details/s,
  )
})

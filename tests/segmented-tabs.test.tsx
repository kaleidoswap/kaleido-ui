import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, key, mount } from './helpers/dom'
import { SegmentedTabs, Tabs, TabsList, TabsTrigger } from '../src/web/primitives/tabs'

// The Tabs bar keeps its look and gains a full-width and a compact form; as
// SegmentedTabs it is a radio group, for a choice that switches no panel.

test('a TabsList with no new props renders the bar it always did', () => {
  const markup = renderToStaticMarkup(
    h(Tabs, { defaultValue: 'a' }, h(TabsList, null, h(TabsTrigger, { value: 'a' }, 'Send'), h(TabsTrigger, { value: 'b' }, 'Receive'))),
  )
  const list = /role="tablist"[^>]*class="([^"]+)"|class="([^"]+)"[^>]*role="tablist"/.exec(markup)!
  const listClass = (list[1] ?? list[2]).split(' ')
  for (const cls of ['inline-flex', 'h-12', 'p-1.5', 'gap-2', 'justify-center']) assert.ok(listClass.includes(cls), cls)
  assert.doesNotMatch(markup, /flex-1|h-10/)
  assert.match(markup, /px-4 py-2/)
})

test('fullWidth shares the row between the tabs; compact is the shorter bar', () => {
  const markup = renderToStaticMarkup(
    h(Tabs, { defaultValue: 'a' }, h(TabsList, { fullWidth: true, size: 'compact' }, h(TabsTrigger, { value: 'a' }, '7D'), h(TabsTrigger, { value: 'b' }, '30D'))),
  )
  assert.match(markup, /class="[^"]*h-10 p-1 flex w-full[^"]*"/)
  assert.equal(markup.match(/px-3 py-1\.5 flex-1/g)?.length, 2)
})

test('SegmentedTabs is a radio group: one Tab stop, arrows move and select and skip a disabled option', async () => {
  function Harness() {
    const [value, setValue] = useState('test')
    return h(SegmentedTabs, {
      'aria-label': 'Environment',
      value,
      onValueChange: setValue,
      options: [
        { value: 'test', label: 'Test' },
        { value: 'staging', label: 'Staging', disabled: true },
        { value: 'live', label: 'Live' },
      ],
    })
  }
  const view = mount(h(Harness))
  const group = view.container.querySelector('[role="radiogroup"]')!
  assert.equal(group.getAttribute('aria-label'), 'Environment')
  assert.match(group.className, /flex w-full/, 'full width by default')
  const radios = [...view.container.querySelectorAll('[role="radio"]')] as HTMLButtonElement[]
  assert.deepEqual(radios.map((r) => r.tabIndex), [0, -1, -1])
  assert.match(radios[0].className, /bg-gradient-primary/)
  assert.doesNotMatch(radios[2].className, /bg-gradient-primary/)
  radios[0].focus()
  await interact(() => void key(radios[0], 'ArrowRight'))
  assert.equal(radios[2].getAttribute('aria-checked'), 'true', 'the disabled option is skipped')
  assert.equal(document.activeElement, radios[2])
  await interact(() => void key(radios[2], 'Home'))
  assert.equal(radios[0].getAttribute('aria-checked'), 'true')
  await interact(() => radios[2].click())
  assert.equal(radios[2].getAttribute('aria-checked'), 'true')
  view.unmount()
})

test('compact and hugging, SegmentedTabs fits a card header', () => {
  const markup = renderToStaticMarkup(
    h(SegmentedTabs, {
      'aria-label': 'Period',
      size: 'compact',
      fullWidth: false,
      value: '30d',
      onValueChange: () => undefined,
      options: ['7d', '30d', '90d'].map((value) => ({ value, label: value.toUpperCase() })),
    }),
  )
  assert.match(markup, /data-size="compact"[^>]*class="[^"]*h-10 p-1 inline-flex/)
  assert.doesNotMatch(markup, /flex-1/)
  assert.match(markup, /aria-checked="true" tabindex="0"[^>]*>30D</)
})

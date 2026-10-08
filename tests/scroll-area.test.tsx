import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { interact, mount } from './helpers/dom'
import { HorizontalScrollArea, ScrollArea, VerticalScrollArea } from '../src/web/primitives/scroll-area'
import { CodeBlock } from '../src/web/components/code-block'
import { Table, TableBody, TableCell, TableRow } from '../src/web/primitives/table'
import { DrawerBody, DrawerSidebar } from '../src/web/primitives/drawer'
import { BottomSheet } from '../src/web/components/bottom-sheet'
import * as ui from '../src/web/index'

// The library's two scrollbars: one engine, drawn on the right edge for
// vertical scrolling and on the bottom edge for horizontal, and every
// component that scrolls builds on one of them.

// jsdom lays nothing out: give each scroller a 100px box over 400px of content.
const size = (axis: 'client' | 'scroll') => ({
  get(this: HTMLElement) {
    if (!this.dataset.scrollAxis) return 0
    return axis === 'client' ? 100 : 400
  },
  configurable: true,
})
for (const prop of ['clientWidth', 'clientHeight'] as const) {
  Object.defineProperty(HTMLElement.prototype, prop, size('client'))
}
for (const prop of ['scrollWidth', 'scrollHeight'] as const) {
  Object.defineProperty(HTMLElement.prototype, prop, size('scroll'))
}

const thumbOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="scrollbar-thumb"]') as HTMLElement | null

test('both scrollbars are exported, and ScrollArea is the vertical one', () => {
  for (const name of ['ScrollArea', 'VerticalScrollArea', 'HorizontalScrollArea']) {
    assert.ok(name in ui, `${name} is not exported`)
  }
  assert.equal(VerticalScrollArea, ScrollArea)
})

test('the vertical scrollbar is a thumb on the right edge, a quarter long, following the scroll', async () => {
  const view = mount(h(ScrollArea, null, h('div', null, 'rows')))
  const track = view.container.querySelector('[data-slot="scrollbar"]')!
  assert.equal(track.getAttribute('data-orientation'), 'vertical')
  assert.match(track.className, /right-0/)
  const thumb = thumbOf(view.container)!
  assert.equal(thumb.style.height, '25px')
  assert.equal(thumb.style.width, 'var(--spacing-scrollbar)')

  const viewport = view.container.querySelector('[data-scroll-axis="y"]') as HTMLElement
  assert.match(viewport.className, /overflow-y-auto/)
  assert.match(viewport.className, /no-scrollbar/)
  Object.defineProperty(viewport, 'scrollTop', { value: 300, configurable: true })
  await interact(() => viewport.dispatchEvent(new Event('scroll')))
  // At the end of the content the thumb sits at the end of the track.
  assert.equal(thumbOf(view.container)!.style.transform, 'translateY(75px)')
  view.unmount()
})

test('the horizontal scrollbar is the same thumb on the bottom edge', async () => {
  const view = mount(h(HorizontalScrollArea, null, h('div', null, 'wide')))
  const track = view.container.querySelector('[data-slot="scrollbar"]')!
  assert.equal(track.getAttribute('data-orientation'), 'horizontal')
  assert.match(track.className, /bottom-0/)
  const thumb = thumbOf(view.container)!
  assert.equal(thumb.style.width, '25px')
  assert.equal(thumb.style.height, 'var(--spacing-scrollbar)')
  assert.match(thumb.className, /bg-scrollbar-thumb/)

  const viewport = view.container.querySelector('[data-scroll-axis="x"]') as HTMLElement
  assert.match(viewport.className, /overflow-x-auto/)
  Object.defineProperty(viewport, 'scrollLeft', { value: 150, configurable: true })
  await interact(() => viewport.dispatchEvent(new Event('scroll')))
  assert.equal(thumbOf(view.container)!.style.transform, 'translateX(37.5px)')

  // Under the pointer it thickens, as the vertical one does.
  await interact(() => track.dispatchEvent(new PointerEvent('pointerover', { bubbles: true })))
  assert.equal(thumbOf(view.container)!.style.height, 'var(--spacing-scrollbar-hover)')
  view.unmount()
})

test('content that fits draws no thumb', () => {
  const markup = renderToStaticMarkup(h(HorizontalScrollArea, null, 'short'))
  assert.doesNotMatch(markup, /scrollbar-thumb/)
})

test('CodeBlock scrolls its pre on the horizontal scrollbar, not the native one', () => {
  const view = mount(h(CodeBlock, { code: 'npm i kaleido-ui' }))
  const pre = view.container.querySelector('pre')!
  assert.equal(pre.getAttribute('data-scroll-axis'), 'x')
  assert.match(pre.className, /no-scrollbar/)
  assert.ok(thumbOf(view.container), 'no overlay thumb')
  view.unmount()
})

test('Table scrolls sideways on the horizontal scrollbar', () => {
  const view = mount(h(Table, null, h(TableBody, null, h(TableRow, null, h(TableCell, null, 'x')))))
  const scroller = view.container.querySelector('[data-slot="table-scroll"]')!
  assert.equal(scroller.getAttribute('data-scroll-axis'), 'x')
  assert.equal(scroller.firstElementChild!.tagName, 'TABLE')
  view.unmount()
})

test('DrawerBody and BottomSheet scroll on the vertical scrollbar', () => {
  const drawer = mount(h(DrawerSidebar, null, h(DrawerBody, { className: 'space-y-2' }, 'items')))
  const body = drawer.container.querySelector('[data-scroll-axis="y"]')!
  // Its className still styles the list, as it did when the body scrolled.
  assert.match(body.className, /space-y-2/)
  assert.match(body.className, /px-4/)
  drawer.unmount()

  const sheet = mount(h(BottomSheet, { open: true, title: 'Sheet' }, 'content'))
  const viewport = sheet.container.querySelector('[data-scroll-axis="y"]')!
  assert.match(viewport.className, /max-h-\[90vh\]/)
  sheet.unmount()
})

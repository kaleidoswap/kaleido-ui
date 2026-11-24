import { mount } from './helpers/dom'

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'

import { BottomNav } from '../src/web/components/bottom-nav'

// jsdom lays nothing out: give each item a fixed slot and record animations.
const SLOT: Record<string, number> = { 'nav-wallet': 0, 'nav-swap': 80, 'nav-activity': 160 }
Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
  configurable: true,
  get(this: HTMLElement) {
    return SLOT[this.getAttribute('data-testid') ?? ''] ?? 0
  },
})
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  get: () => 64,
})
const moves: Keyframe[][] = []
;(HTMLElement.prototype as unknown as { animate: unknown }).animate = function (frames: Keyframe[]) {
  moves.push(frames)
  return {} as Animation
}

const items = [
  { id: 'wallet', label: 'Wallet', testId: 'nav-wallet' },
  { id: 'swap', label: 'Swap', testId: 'nav-swap' },
  { id: 'activity', label: 'Activity', testId: 'nav-activity' },
]

const nav = (activeView: string, navItems = items) =>
  createElement(BottomNav, { activeView, items: navItems, onChange: () => undefined })

test('a nav mounted on the next page slides in from the item the last one showed', () => {
  moves.length = 0
  mount(nav('wallet')).unmount()
  assert.equal(moves.length, 0, 'the first nav has nowhere to come from')

  mount(nav('activity')).unmount()
  assert.equal(moves.length, 1)
  // Starts centred on Wallet (0 + 64 / 2), ends centred on Activity (160 + 64 / 2).
  assert.match(String(moves[0][0].transform), /^translateX\(0px\)/)
  assert.match(String(moves[0].at(-1)!.transform), /^translateX\(160px\)/)
})

test('a nav with different items does not inherit another nav’s position', () => {
  moves.length = 0
  const other = items.slice(0, 2)
  mount(nav('swap', other)).unmount()
  assert.equal(moves.length, 0)
})

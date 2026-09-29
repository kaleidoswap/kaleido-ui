/**
 * A DOM for the tests that need one — a Radix portal, a keydown, a clipboard.
 *
 * Server rendering covers most of this suite, but a Radix Dialog renders its
 * content through a portal that only mounts in a browser, and focus and
 * pointer behaviour cannot be read from static markup. Importing this module
 * installs a jsdom window as the global environment for the importing test
 * file (node:test runs each file in its own process, so it does not leak).
 */
import { JSDOM } from 'jsdom'
import { act, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const globals: Record<string, unknown> = {
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  // Node has its own Event and CustomEvent; jsdom's dispatchEvent rejects them.
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  KeyboardEvent: dom.window.KeyboardEvent,
  MouseEvent: dom.window.MouseEvent,
  PointerEvent: dom.window.PointerEvent ?? dom.window.MouseEvent,
  FocusEvent: dom.window.FocusEvent,
  MutationObserver: dom.window.MutationObserver,
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  IS_REACT_ACT_ENVIRONMENT: true,
}
// Everything else the window has and Node does not (NodeFilter, DOMRect, …).
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (key in globalThis || key.startsWith('_')) continue
  globals[key] = (dom.window as unknown as Record<string, unknown>)[key]
}
for (const [key, value] of Object.entries(globals)) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true })
}

export interface Mounted {
  container: HTMLElement
  root: Root
  unmount: () => void
}

export function mount(element: ReactElement): Mounted {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => root.render(element))
  return {
    container,
    root,
    unmount: () => {
      act(() => root.unmount())
      container.remove()
    },
  }
}

/** Run a state-changing interaction and flush React's work. */
export async function interact(run: () => void | Promise<void>): Promise<void> {
  await act(async () => {
    await run()
  })
}

export const key = (target: Element, name: string) =>
  target.dispatchEvent(new window.KeyboardEvent('keydown', { key: name, bubbles: true }))

export { dom }

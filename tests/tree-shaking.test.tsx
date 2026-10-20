import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import test from 'node:test'
import { build, type Metafile } from 'esbuild'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Icon, createIcon } from '../src/web/primitives/icon'
import { outlinedMap } from '../src/web/icons'
import { Check, Close } from '../src/web/icons/outlined'
import { CheckCircleFilled } from '../src/web/icons/filled'

const root = resolve(import.meta.dirname, '..')

// Bundles a consumer entry the way an app would and reports the bytes a given
// source file or dependency contributed.
async function bundle(source: string) {
  const result = await build({
    stdin: { contents: source, resolveDir: root, loader: 'tsx' },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    metafile: true,
    jsx: 'automatic',
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
  })
  const [output] = Object.values((result.metafile as Metafile).outputs)
  return (fragment: string) =>
    Object.entries(output.inputs)
      .filter(([path]) => path.includes(fragment))
      .reduce((sum, [, input]) => sum + input.bytesInOutput, 0)
}

const consumer = `
  import { createRoot } from 'react-dom/client'
  import { Button } from './src/web/index'
  import { createIcon, Close } from './src/web/icons/public'
  const Icon = createIcon({ close: Close })
  createRoot(document.body).render(<Button><Icon name="close" /></Button>)
`

test('importing one primitive leaves the other components and their Radix packages out', async () => {
  const bytes = await bundle(consumer)
  assert.ok(bytes('src/web/primitives/button.tsx') > 0, 'the used primitive is missing')
  for (const unused of [
    'src/web/primitives/drawer.tsx',
    'src/web/primitives/scroll-area.tsx',
    'src/web/primitives/table.tsx',
    'src/web/primitives/menu-search.tsx',
    'src/web/components/',
    '@radix-ui/react-select',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
  ]) {
    assert.equal(bytes(unused), 0, `${unused} was bundled without being imported`)
  }
})

test('an Icon built with createIcon ships only the glyphs it was given', async () => {
  const bytes = await bundle(consumer)
  const glyphs = bytes('src/web/icons/outlined.tsx')
  assert.ok(glyphs > 0, 'the Close glyph is missing')
  assert.ok(glyphs < 1_000, `outlined glyphs took ${glyphs} bytes for a single icon`)
})

test('primitives that draw their own glyphs do not pull in the whole icon set', async () => {
  const bytes = await bundle(`
    import { createRoot } from 'react-dom/client'
    import { Dialog, DialogContent, Drawer, DrawerContent, Select, SelectTrigger, SelectValue, Table, GlyphButton } from './src/web/index'
    import { Close } from './src/web/icons/public'
    createRoot(document.body).render(<>
      <Dialog open><DialogContent /></Dialog>
      <Drawer open><DrawerContent /></Drawer>
      <Select><SelectTrigger><SelectValue /></SelectTrigger></Select>
      <Table />
      <GlyphButton icon={Close} label="Close" />
    </>)
  `)
  assert.equal(bytes('src/web/icons/index.ts'), 0, 'the name-to-glyph map was bundled')
  const glyphs = bytes('src/web/icons/outlined.tsx')
  assert.ok(glyphs < 5_000, `outlined glyphs took ${glyphs} bytes`)
})

test('the default Icon still draws every name in the set', () => {
  for (const name of Object.keys(outlinedMap) as (keyof typeof outlinedMap)[]) {
    assert.match(renderToStaticMarkup(createElement(Icon, { name })), /^<svg/, name)
  }
  assert.notEqual(
    renderToStaticMarkup(createElement(Icon, { name: 'check_circle', filled: true })),
    renderToStaticMarkup(createElement(Icon, { name: 'check_circle' })),
  )
})

test('createIcon draws its own names, prefers a filled glyph, and draws nothing for others', () => {
  const Small = createIcon({ close: Close, check: Check }, { check: CheckCircleFilled })
  assert.equal(
    renderToStaticMarkup(createElement(Small, { name: 'close', size: 'sm' })),
    renderToStaticMarkup(createElement(Icon, { name: 'close', size: 'sm' })),
  )
  assert.equal(
    renderToStaticMarkup(createElement(Small, { name: 'check', filled: true })),
    renderToStaticMarkup(createElement(Icon, { name: 'check_circle', filled: true })),
  )
  assert.equal(
    renderToStaticMarkup(createElement(Small, { name: 'close', filled: true })),
    renderToStaticMarkup(createElement(Icon, { name: 'close' })),
  )
  // A name outside the map, as from untyped data, renders nothing.
  assert.equal(renderToStaticMarkup(createElement(Small, { name: 'menu' as 'close' })), '')
})

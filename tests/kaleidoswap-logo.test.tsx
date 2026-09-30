import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { brandMark } from '../src/tokens/index'
import {
  KaleidoswapLogo,
  KaleidoswapMark,
  kaleidoswapLogoHorizontalArtwork,
  kaleidoswapLogoVerticalArtwork,
  kaleidoswapMarkArtwork,
  type BrandArtwork,
} from '../src/web/index'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const brandFile = (name: string) => readFileSync(join(ROOT, 'brand', name), 'utf8')

const PAINT: Record<string, string> = {
  '#6F32FF': 'violet',
  '#17B581': 'green',
  '#15E99A': 'mint',
  white: 'text',
}

/** The shipped SVG files are the source; the components must draw the same thing. */
function assertMatchesFile(artwork: BrandArtwork, file: string) {
  const svg = brandFile(file)
  assert.equal(artwork.viewBox, /viewBox="([^"]+)"/.exec(svg)?.[1], `${file} viewBox`)
  const paths = [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"\/>/g)].map((m) => ({
    fill: PAINT[m[2]],
    d: m[1],
  }))
  assert.deepEqual(artwork.paths, paths, `${file} paths`)
}

test('logo artwork matches the SVG files shipped in /brand', () => {
  assertMatchesFile(kaleidoswapMarkArtwork, 'kaleidoswap-pictogram.svg')
  assertMatchesFile(kaleidoswapLogoHorizontalArtwork, 'kaleidoswap-fullogo-horizontal.svg')
  assertMatchesFile(kaleidoswapLogoVerticalArtwork, 'kaleidoswap-fullogo-vertical.svg')
})

test('the on-light SVG variants differ only in the wordmark colour', () => {
  for (const orientation of ['horizontal', 'vertical']) {
    const dark = brandFile(`kaleidoswap-fullogo-${orientation}.svg`)
    const light = brandFile(`kaleidoswap-fullogo-${orientation}-on-light.svg`)
    assert.equal(light, dark.replace(/(<path d="[^"]+" fill=")white("\/>)/g, '$1#12131E$2'))
  }
})

test('KaleidoswapLogo paints the wordmark with currentColor and keeps the brand fills', () => {
  const markup = renderToStaticMarkup(createElement(KaleidoswapLogo, { className: 'h-8 w-auto text-foreground' }))
  assert.equal(markup.match(/fill="currentColor"/g)?.length, 11)
  assert.equal(markup.match(new RegExp(`fill="${brandMark.violet}"`, 'g'))?.length, 2)
  assert.equal(markup.match(new RegExp(`fill="${brandMark.green}"`, 'g'))?.length, 2)
  assert.equal(markup.match(new RegExp(`fill="${brandMark.mint}"`, 'g'))?.length, 1)
  assert.match(markup, /viewBox="0 0 831 208"/)
  assert.match(markup, /class="h-8 w-auto text-foreground"/)
  assert.match(markup, /role="img"/)
  assert.match(markup, /aria-label="KaleidoSwap"/)
  assert.doesNotMatch(markup, /white/)
})

test('KaleidoswapLogo has a vertical lockup', () => {
  const markup = renderToStaticMarkup(createElement(KaleidoswapLogo, { orientation: 'vertical' }))
  assert.match(markup, /viewBox="0 0 1049 648"/)
  assert.match(markup, /data-orientation="vertical"/)
})

test('KaleidoswapMark is the icon only, 32px square unless sized by className', () => {
  const markup = renderToStaticMarkup(createElement(KaleidoswapMark, { className: 'size-14' }))
  assert.match(markup, /viewBox="0 0 412 412"/)
  assert.match(markup, /width="32" height="32"/)
  assert.match(markup, /class="size-14"/)
  assert.equal(markup.match(/<path /g)?.length, 5)
  assert.doesNotMatch(markup, /currentColor/)
})

test('an empty title makes the logo decorative', () => {
  const markup = renderToStaticMarkup(createElement(KaleidoswapMark, { title: '' }))
  assert.match(markup, /aria-hidden="true"/)
  assert.doesNotMatch(markup, /role="img"/)
  assert.doesNotMatch(markup, /aria-label/)
})

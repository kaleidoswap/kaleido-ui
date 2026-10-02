import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'

import { letterSpacing, typeScale } from '../src/tokens/typography'
import { eyebrow } from '../src/web/utils/type-roles'

// kaleido-ui/tokens ships a named type scale, and two thirds of the size
// classes in the components were Tailwind defaults instead: 12 and 14 px text
// beside a consumer's 13 and 15, and no CSS at all for a consumer whose
// Tailwind config uses typeScale in place of the default scale.

const WEB = join(import.meta.dirname, '..', 'src', 'web')

const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sources(path)
    return /\.tsx?$/.test(name) ? [path] : []
  })

/** Source without comments: prose may name the classes it forbids. */
const code = (path: string) =>
  readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`])\/\/.*$/gm, '$1')

const DEFAULT_SIZE = /(?<![\w-])(?:[\w-]+:)*text-(xs|sm|base|lg|[2-9]?xl)(?![\w-])/g

test('no component in src/web uses a Tailwind default text size', () => {
  const offenders: string[] = []
  for (const path of sources(WEB)) {
    for (const match of code(path).matchAll(DEFAULT_SIZE)) {
      offenders.push(`${relative(WEB, path)}: ${match[0]}`)
    }
  }
  assert.deepEqual(offenders, [], 'use the typeScale step for the role: caption, body, subhead, title, …')
})

test('no hand-written letter-spacing', () => {
  const offenders = sources(WEB).filter((path) => /tracking-\[/.test(code(path)))
  assert.deepEqual(offenders.map((path) => relative(WEB, path)), [], 'use tracking-eyebrow or tracking-eyebrow-wide')
})

test('every uppercase letter-spaced label uses the eyebrow tracking token', () => {
  const offenders: string[] = []
  for (const path of sources(WEB)) {
    for (const [, body] of code(path).matchAll(/['"`]([^'"`]*\buppercase\b[^'"`]*)['"`]/g)) {
      const tracking = body.split(/\s+/).filter((token) => /^tracking-/.test(token))
      for (const token of tracking) {
        if (token !== 'tracking-eyebrow' && token !== 'tracking-eyebrow-wide') {
          offenders.push(`${relative(WEB, path)}: ${token} in "${body.trim()}"`)
        }
      }
    }
  }
  assert.deepEqual(offenders, [])
})

test('the shared eyebrow is DESIGN.md’s label token', () => {
  assert.equal(eyebrow, 'text-mini font-bold uppercase tracking-eyebrow')
  assert.deepEqual(typeScale.mini, ['9px', '12px'])
  assert.equal(letterSpacing.eyebrow, '0.18em')
})

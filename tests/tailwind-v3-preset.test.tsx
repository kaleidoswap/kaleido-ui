import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import test from 'node:test'

import postcss from 'postcss'
import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'

import preset from '../src/tailwind/index'

// kaleido-ui is built with Tailwind v4; a consumer on v3 used to get no rule
// for classes v3 does not know — `bg-white/8` on Input rendered every field on
// the browser's white. This compiles the components' own classes with v4 and
// the kaleido-ui theme (what the library is designed against), then with v3
// and the shipped preset, and requires v3 to produce every class v4 does.

const require = createRequire(import.meta.url)
const ROOT = join(import.meta.dirname, '..')
const WEB = join(ROOT, 'src', 'web')
const CSS = join(ROOT, 'src', 'css', 'kaleido-ui.css')

const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sources(path)
    return /\.tsx?$/.test(name) ? [path] : []
  })

/** Class names in compiled CSS, unescaped. */
const classesIn = (css: string): Set<string> => {
  const names = new Set<string>()
  // An escape is either a hex code point (v3 writes `,` as `\2c `, trailing
  // space included) or a backslash and one character (v4 writes `\,`).
  for (const [, raw] of css.matchAll(/\.((?:\\[0-9a-f]{1,6} ?|\\[^\n]|[^\s{},:>+~\[\]().#\\*])+)/gi)) {
    names.add(raw.replace(/\\([0-9a-f]{1,6}) ?/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16))).replace(/\\(.)/g, '$1'))
  }
  return names
}

test('a Tailwind v3 consumer with kaleido-ui/tailwind gets a rule for every class the components use', async () => {
  const scanner = new Scanner({ sources: [{ base: WEB, pattern: '**/*.{ts,tsx}', negated: false }] })
  const candidates = scanner.scan()

  // v4: the library's own build, with its theme.
  const v4 = await compile(`@import "tailwindcss/utilities";\n@import "${CSS.replace(/\\/g, '/')}";`, {
    base: ROOT,
    onDependency: () => undefined,
  })
  const v4Classes = classesIn(v4.build(candidates))

  // Plain CSS classes kaleido-ui/css defines itself reach a v3 consumer by importing it.
  const shipped = classesIn(readFileSync(CSS, 'utf8'))

  // v3 with the preset, over the same sources.
  const tailwind3 = require('tailwindcss3')
  const raw = sources(WEB).map((path) => readFileSync(path, 'utf8')).join('\n')
  const v3Css = await postcss([
    tailwind3({
      presets: [preset],
      content: [{ raw, extension: 'tsx' }],
      plugins: [require('tailwindcss-animate')],
    }),
  ]).process('@tailwind components;\n@tailwind utilities;', { from: undefined })
  const v3Classes = classesIn(v3Css.css)

  const used = [...v4Classes].filter((name) => candidates.includes(name) && !shipped.has(name))
  const missing = used.filter((name) => !v3Classes.has(name)).sort()

  assert.ok(used.length > 500, `only ${used.length} classes compiled — the scan is not seeing the components`)
  assert.deepEqual(missing, [], `${missing.length} classes have no v3 rule with the preset`)
})

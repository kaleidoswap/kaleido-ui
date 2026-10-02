/**
 * Copy the files tsup does not emit into dist: the stylesheets and the native
 * fonts.
 *
 * This was `mkdir -p … && cp …` in package.json, which cmd.exe — the shell npm
 * runs scripts in on Windows — cannot parse, so the build failed there after
 * tsup had finished. Node's fs works on every platform.
 *
 * Run:  npm run build   (the last step)
 */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

mkdirSync(join(ROOT, 'dist/css'), { recursive: true })
copyFileSync(join(ROOT, 'src/css/kaleido-ui.css'), join(ROOT, 'dist/css/kaleido-ui.css'))
copyFileSync(join(ROOT, 'src/css/brand.css'), join(ROOT, 'dist/css/brand.css'))

const fonts = join(ROOT, 'src/native/fonts')
mkdirSync(join(ROOT, 'dist/native/fonts'), { recursive: true })
const ttf = readdirSync(fonts).filter((name) => name.endsWith('.ttf'))
for (const name of ttf) copyFileSync(join(fonts, name), join(ROOT, 'dist/native/fonts', name))

console.log(`✓ copy-assets: kaleido-ui.css, brand.css and ${ttf.length} font file(s) copied to dist.`)

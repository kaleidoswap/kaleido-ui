import { defineConfig, type Alias } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(__dirname, '..')

/**
 * `kaleido-ui` and its subpaths, resolved through package.json's `exports` to
 * the built `dist/`, exactly as an app installing the package resolves them.
 * The showcase never reads `src/`: what it renders is what ships, and a
 * component that is not exported fails this build instead of being drawn.
 * Build the package first (`npm run build`).
 */
const packageAliases = (): Alias[] => {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as {
    name: string
    exports: Record<string, string | { import?: string; default?: string }>
  }
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
  return Object.entries(pkg.exports).map(([subpath, target]) => {
    const file = typeof target === 'string' ? target : target.import ?? target.default
    if (!file) throw new Error(`package.json exports["${subpath}"] has no import target`)
    const specifier = subpath === '.' ? pkg.name : `${pkg.name}/${subpath.slice(2)}`
    if (specifier.endsWith('*')) {
      // `./brand/*`: the wildcard part carries over.
      return {
        find: new RegExp(`^${escape(specifier.slice(0, -1))}(.+)$`),
        replacement: path.join(ROOT, file.slice(0, -1)) + '$1',
      }
    }
    // A query (`?inline`, `?raw`) carries over too.
    return { find: new RegExp(`^${escape(specifier)}(\\?.*)?$`), replacement: path.join(ROOT, file) + '$1' }
  })
}

if (!existsSync(path.join(ROOT, 'dist', 'web', 'index.js'))) {
  throw new Error('The showcase renders the built package: run `npm run build` first.')
}

export default defineConfig({
  root: __dirname,
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: packageAliases(),
  },
  server: {
    port: 5173,
    open: true,
  },
})

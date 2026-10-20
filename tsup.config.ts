import { defineConfig } from 'tsup'

const webEntry = { 'web/index': 'src/web/index.ts', 'web/icons': 'src/web/icons/public.ts' }

const webExternal = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-select',
  '@radix-ui/react-label',
  '@radix-ui/react-slot',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toast',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
]

export default defineConfig([
  // Tokens — zero deps, pure JS
  {
    entry: { 'tokens/index': 'src/tokens/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
  },
  // Tailwind v3 preset — tokens only, no runtime deps. Built twice: the
  // CommonJS build must be `module.exports = preset`, which is what
  // `presets: [require('kaleido-ui/tailwind')]` expects, not `{ default }`.
  {
    entry: { 'tailwind/index': 'src/tailwind/index.ts' },
    format: ['esm'],
    dts: true,
    clean: false,
    outDir: 'dist',
  },
  {
    entry: { 'tailwind/index': 'src/tailwind/index.ts' },
    format: ['cjs'],
    dts: false,
    clean: false,
    outDir: 'dist',
    footer: { js: 'module.exports = module.exports.default;' },
  },
  // Web components — React + Tailwind + Radix. The ESM build keeps one
  // module per source file and package.json marks it side-effect free, so a
  // consumer's bundler drops every component (and its Radix dependency) the
  // app never imports. A single bundled file defeats that: top-level
  // `X.displayName = ...` writes count as side effects and keep everything.
  {
    entry: ['src/web/**/*.ts', 'src/web/**/*.tsx'],
    format: ['esm'],
    dts: false,
    splitting: true,
    clean: false,
    outDir: 'dist/web',
    external: webExternal,
    banner: { js: '"use client";' },
  },
  // Type declarations and the CommonJS bundle, for both web entry points.
  {
    entry: webEntry,
    format: ['esm'],
    dts: { only: true },
    clean: false,
    outDir: 'dist',
  },
  {
    entry: webEntry,
    format: ['cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
    external: webExternal,
    banner: { js: '"use client";' },
  },
  // Native components — React Native + WDK
  {
    entry: { 'native/index': 'src/native/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
    external: [
      'react',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-native',
      'react-native-svg',
      '@tetherto/wdk-uikit-react-native',
    ],
  },
  // Native fonts — Satoshi asset map. Built UNBUNDLED so the `.ttf` imports
  // stay literal `require('./fonts/*.ttf')` calls for the consumer's Metro
  // bundler to resolve into RN asset module ids (esbuild's bundler would
  // otherwise rewrite them to plain path strings, which RN can't load). The
  // .ttf files are copied into dist/native/fonts by the build script.
  {
    entry: { 'native/fonts': 'src/native/fonts.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
    bundle: false,
  },
])

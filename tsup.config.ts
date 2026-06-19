import { defineConfig } from 'tsup'

export default defineConfig([
  // Tokens — zero deps, pure JS
  {
    entry: { 'tokens/index': 'src/tokens/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
  },
  // Web components — React + Tailwind + Radix
  {
    entry: { 'web/index': 'src/web/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    outDir: 'dist',
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
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

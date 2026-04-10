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
  // Tailwind preset — pure JS, no React
  {
    entry: { 'tailwind/index': 'src/tailwind/index.ts' },
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
      '@radix-ui/react-dialog',
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
      'react-native',
      '@tetherto/wdk-uikit-react-native',
    ],
  },
])

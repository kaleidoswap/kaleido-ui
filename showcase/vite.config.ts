import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindConfig from './tailwind.config'

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@kaleido-ui': path.resolve(__dirname, '../src/web'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig as any), autoprefixer()],
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})

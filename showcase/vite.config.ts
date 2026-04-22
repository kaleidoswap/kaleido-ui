import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  root: __dirname,
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@kaleido-ui': path.resolve(__dirname, '../src/web'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})

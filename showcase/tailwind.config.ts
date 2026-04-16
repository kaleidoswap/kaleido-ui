import type { Config } from 'tailwindcss'
import preset from '../src/tailwind/index'

const config: Config = {
  darkMode: ['class'],
  presets: [preset as any],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../src/web/**/*.{ts,tsx}',
  ],
}

export default config

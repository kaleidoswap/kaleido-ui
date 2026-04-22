/**
 * KaleidoSwap Tailwind CSS Preset
 *
 * Add to your tailwind.config.js:
 *   presets: [require('kaleido-ui/tailwind')]
 *
 * And include the library in your content paths:
 *   content: ['./node_modules/kaleido-ui/dist/web/*.js']
 */
import { colors } from '../tokens/colors'
import { typeScale, fontFamily } from '../tokens/typography'
import { radius } from '../tokens/radius'

const preset = {
  darkMode: ['class'] as const,
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        network: colors.network,
        tx: colors.tx,
      },
      fontFamily: {
        sans: fontFamily.display.split(', '),
        display: fontFamily.display.split(', '),
        mono: fontFamily.mono.split(', '),
      },
      fontSize: Object.fromEntries(
        Object.entries(typeScale).map(([key, [size, lh]]) => [
          key,
          [size, { lineHeight: lh }],
        ])
      ),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': 'var(--radius-4xl)',
        card: radius.card,
        panel: radius.panel,
        pill: radius.pill,
        nav: radius.nav,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'stagger-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-slight': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.4s ease-out',
        'stagger-up': 'stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards',
        shimmer: 'shimmer 2s linear infinite',
        'bounce-slight': 'bounce-slight 2s infinite',
      },
    },
  },
  plugins: [] as any[],
}

export default preset

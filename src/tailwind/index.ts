/**
 * KaleidoSwap Tailwind CSS Preset
 *
 * Add to your tailwind.config.js:
 *   presets: [require('@kaleidorg/kaleido-ui/tailwind')]
 *
 * And include the library in your content paths:
 *   content: ['./node_modules/@kaleidorg/kaleido-ui/dist/web/*.js']
 */
import { colors } from '../tokens/colors'
import { typeScale, fontFamily } from '../tokens/typography'
import { radius } from '../tokens/radius'
import { shadow } from '../tokens/shadows'

const preset = {
  darkMode: ['class'] as const,
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: colors.primary,
          foreground: colors.primaryFg,
          dark: colors.primaryDark,
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        network: colors.network,
        tx: colors.tx,
        'background-light': colors.bgLight,
        'background-dark': colors.bgDark,
        'surface-dark': colors.surfaceDark,
        'surface-light': colors.surfaceLight,
        'surface-highlight': colors.surfaceHighlight,
        'surface-border': colors.surfaceBorder,
        'surface-darker': colors.surfaceDarker,
      },
      fontFamily: {
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
        card: radius.card,
        panel: radius.panel,
        pill: radius.pill,
        nav: radius.nav,
      },
      boxShadow: {
        glow: shadow.glow,
        'glow-strong': shadow.glowStrong,
        'glow-subtle': shadow.glowSubtle,
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
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(43, 238, 121, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(43, 238, 121, 0.4)' },
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
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
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

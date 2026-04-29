/**
 * KaleidoSwap Animation Tokens
 */
export const keyframes = {
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
} as const

export const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-out',
  'slide-up': 'slide-up 0.3s ease-out',
  'slide-in-from-bottom': 'slide-in-from-bottom 0.4s ease-out',
  'stagger-up': 'stagger-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards',
  shimmer: 'shimmer 2s linear infinite',
  'bounce-slight': 'bounce-slight 2s infinite',
} as const

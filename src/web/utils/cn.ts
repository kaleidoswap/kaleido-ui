import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import { radius } from '../../tokens/radius'
import { shadow } from '../../tokens/shadows'
import { iconSize, letterSpacing, typeScale } from '../../tokens/typography'

const camelToKebab = (value: string): string =>
  value.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)

/**
 * kaleido-ui's custom scales, as tailwind-merge needs to see them.
 *
 * A stock tailwind-merge only knows Tailwind's default scales, so it reads a
 * kaleido-ui size such as `text-title` or `text-icon-md` as a text COLOUR and
 * drops it whenever a real colour (`text-danger`) comes later in the same
 * merge. Components that combine a size with a colour silently lost their size.
 * Registering the scales puts each class in its proper group.
 *
 * Built from src/tokens so a new token is picked up without touching this
 * file. Uses `classGroups`, which works with tailwind-merge 2 and 3 alike.
 */
const fontSizes = [
  ...Object.keys(typeScale),
  ...Object.keys(iconSize).map((key) => `icon-${key}`),
]

/** Semantic radius aliases. The numeric steps (xl, 2xl, …) are Tailwind's own. */
const radii = Object.keys(radius).filter((key) =>
  ['card', 'panel', 'nav', 'pill'].includes(key),
)

/** Every `--shadow-*` token, plus the per-theme brand glows. */
const shadows = Object.keys(shadow).map(camelToKebab)

const roundedGroups = [
  'rounded',
  'rounded-s',
  'rounded-e',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-ss',
  'rounded-se',
  'rounded-ee',
  'rounded-es',
  'rounded-tl',
  'rounded-tr',
  'rounded-br',
  'rounded-bl',
] as const

/**
 * The gradient classes in kaleido-ui/css are background IMAGES, but a stock
 * tailwind-merge reads `bg-gradient-card` as a background COLOUR, so
 * `cn('bg-card bg-gradient-card')` dropped the fill the gradient sits on.
 * `text-gradient-brand` and `border-gradient-brand` are their own things.
 */
const bgImages = [
  'gradient-brand',
  'gradient-brand-dark',
  'gradient-primary',
  'gradient-violet',
  'gradient-card',
  'gradient-card-hero',
  'gradient-active',
  'gradient-headline',
  'page-radial',
  'page-brand',
  'card-sheen',
]

const twMerge = extendTailwindMerge<'text-gradient' | 'border-gradient'>({
  extend: {
    classGroups: {
      'font-size': [{ text: fontSizes }],
      'bg-image': [{ bg: bgImages }],
      'text-gradient': ['text-gradient-brand'],
      'border-gradient': ['border-gradient-brand'],
      tracking: [{ tracking: Object.keys(letterSpacing).map(camelToKebab) }],
      shadow: [{ shadow: shadows }],
      ...Object.fromEntries(
        roundedGroups.map((group) => [group, [{ [group]: radii }]]),
      ),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

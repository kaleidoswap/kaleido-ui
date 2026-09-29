import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import { iconSize, letterSpacing, typeScale } from '../../tokens/typography'

/**
 * tailwind-merge, taught the token scales.
 *
 * Out of the box it only knows Tailwind's own sizes, so it read `text-caption`
 * or `text-icon-sm` as a text COLOUR — and `cn('text-caption',
 * 'text-muted-foreground')` dropped the size, keeping whichever "colour" came
 * last. Every component that set a scale size and a colour through `cn` lost
 * one of the two.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            ...Object.keys(typeScale),
            ...Object.keys(iconSize).map((key) => `icon-${key}`),
          ],
        },
      ],
      tracking: [{ tracking: Object.keys(letterSpacing) }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

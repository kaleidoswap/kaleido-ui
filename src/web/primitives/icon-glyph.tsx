import type { ComponentType, SVGProps } from 'react'
import { cn } from '../utils/cn'

export type IconGlyphComponent = ComponentType<SVGProps<SVGSVGElement>>

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface IconGlyphProps extends SVGProps<SVGSVGElement> {
  glyph: IconGlyphComponent
  size?: IconSize
  className?: string
}

const sizeClasses: Record<IconSize, string> = {
  xs: 'text-icon-sm',
  sm: 'text-icon-md',
  md: 'text-icon-xl',
  lg: 'text-icon-2xl',
  xl: 'text-icon-4xl',
  '2xl': 'text-icon-5xl',
}

/** Draws one glyph component at the icon scale, without the name lookup. */
export function IconGlyph({ glyph: Glyph, size, className, ...props }: IconGlyphProps) {
  return (
    <Glyph
      width="1em"
      height="1em"
      className={cn('inline-block shrink-0', size && sizeClasses[size], className)}
      {...props}
    />
  )
}

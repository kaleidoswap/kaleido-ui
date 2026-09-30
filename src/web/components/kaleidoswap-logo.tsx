import * as React from 'react'

import { brandMark } from '../../tokens/brand'
import {
  type BrandArtwork,
  type BrandPaint,
  kaleidoswapLogoHorizontalArtwork,
  kaleidoswapLogoVerticalArtwork,
  kaleidoswapMarkArtwork,
} from '../assets/kaleidoswap-brand'

const PAINT: Record<BrandPaint, string> = {
  violet: brandMark.violet,
  green: brandMark.green,
  mint: brandMark.mint,
  // The wordmark follows the surrounding text colour, so it reads on light
  // and dark surfaces alike (`text-foreground` is a good default).
  text: 'currentColor',
}

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'viewBox' | 'children'>

interface BrandSvgProps extends SvgProps {
  /**
   * Accessible name. Defaults to "KaleidoSwap". Pass an empty string when the
   * logo sits next to visible text that already names it: the SVG is then
   * hidden from assistive technology.
   */
  title?: string
}

function BrandSvg({
  artwork,
  title = 'KaleidoSwap',
  className,
  ...props
}: BrandSvgProps & { artwork: BrandArtwork }) {
  const decorative = title === ''
  // Presentation attributes give a 32px-tall default; any sizing class
  // (`size-8`, `h-6 w-auto`) overrides them, since CSS outranks attributes.
  const [, , vbWidth, vbHeight] = artwork.viewBox.split(' ').map(Number)
  return (
    <svg
      viewBox={artwork.viewBox}
      width={Math.round((32 * vbWidth) / vbHeight)}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      className={className}
      {...props}
    >
      {artwork.paths.map((path, index) => (
        <path key={index} d={path.d} fill={PAINT[path.fill]} />
      ))}
    </svg>
  )
}

export interface KaleidoswapMarkProps extends BrandSvgProps {}

/**
 * The KaleidoSwap pictogram (the K mark on its own). Square: size it with a
 * className such as `size-8` (it is 32px by default). The brand fills are
 * the same in both themes, because the mark is decorative paint, not text.
 */
export function KaleidoswapMark(props: KaleidoswapMarkProps) {
  return <BrandSvg artwork={kaleidoswapMarkArtwork} {...props} />
}

export interface KaleidoswapLogoProps extends BrandSvgProps {
  /** `horizontal` (default): mark and wordmark in a row. `vertical`: stacked. */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * The full KaleidoSwap logo: mark plus wordmark. The mark keeps its brand
 * fills; the wordmark letters use `currentColor`, so set the text colour
 * (e.g. `text-foreground`) and it works on light and dark surfaces. Size it
 * by height with `h-* w-auto` (32px tall by default).
 */
export function KaleidoswapLogo({ orientation = 'horizontal', ...props }: KaleidoswapLogoProps) {
  return (
    <BrandSvg
      artwork={
        orientation === 'vertical' ? kaleidoswapLogoVerticalArtwork : kaleidoswapLogoHorizontalArtwork
      }
      data-orientation={orientation}
      {...props}
    />
  )
}

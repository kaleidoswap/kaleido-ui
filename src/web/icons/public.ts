/**
 * KaleidoSwap UI — icon glyphs, one export each.
 *
 * `<Icon name="…">` from the main entry looks names up in the full set, so it
 * ships every glyph. Import the glyphs you draw from here and build an `Icon`
 * over just those to ship only them:
 *
 *   import { createIcon, Close, Check } from 'kaleido-ui/icons'
 *   const Icon = createIcon({ close: Close, check: Check })
 */
export * from './outlined'
export * from './filled'
export { createIcon, type IconProps, type IconName } from '../primitives/icon'
export {
  IconGlyph,
  type IconGlyphComponent,
  type IconGlyphProps,
  type IconSize,
} from '../primitives/icon-glyph'
export { GlyphButton, type GlyphButtonProps } from '../primitives/glyph-button'

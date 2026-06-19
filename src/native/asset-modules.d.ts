/**
 * Ambient declarations for binary asset imports bundled with the native entry.
 *
 * Metro (the consumer's bundler) turns a `require('./x.ttf')` into a numeric
 * asset module id. We type these imports as `number` so the font-asset map is
 * strongly typed without TypeScript needing to resolve the binary itself.
 */
declare module '*.ttf' {
  const asset: number
  export default asset
}

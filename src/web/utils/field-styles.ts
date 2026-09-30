/**
 * The text-field surface, as one class string, so every field in the library
 * is the same one: `Input`, `NumberInput`, the full-width `Select` trigger.
 *
 * A glass card (`glass.card`, DESIGN.md) pressed into the surface: the card at
 * 55% over a blur, the faint violet card light, an inner shadow, and a violet
 * hairline that brightens on hover and glows on focus. It is the field the
 * wallet's own flows use (the send destination, the amount).
 */
export const fieldSurface =
  'rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-inner ring-1 ring-inset ring-secondary/15 transition-all placeholder:text-muted-foreground hover:ring-secondary/35 focus-visible:outline-none focus-visible:ring-primary/50 focus-visible:shadow-glow-primary-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:ring-secondary/15'

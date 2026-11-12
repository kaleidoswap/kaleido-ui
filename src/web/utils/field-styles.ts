/**
 * The text-field surface, as one class string, so every field in the library
 * is the same one: `Input`, `NumberInput`, the full-width `Select` trigger.
 *
 * A glass card (`glass.card`, DESIGN.md) pressed into the surface: the card at
 * 55% over a blur, the faint violet card light, an inner shadow, and the
 * field edge (`fieldEdge` in the tokens) that brightens on hover and turns
 * green on focus. The ring alone marks focus: no glow. It is the field the
 * wallet's own flows use (the send destination, the amount).
 */
export const fieldSurface =
  'rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-inner ring-1 ring-inset ring-field-edge transition-all placeholder:text-muted-foreground hover:ring-field-edge-hover focus-visible:outline-none focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:ring-field-edge'

/**
 * `fieldSurface` for a box that holds a field's input with something beside
 * it (`Input`'s `prefix` and `suffix`): the same surface and edge, with focus
 * and disabled read from the input inside (`focus-within`, `has-[:disabled]`).
 */
export const fieldShell =
  'rounded-xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card shadow-inner ring-1 ring-inset ring-field-edge transition-all hover:ring-field-edge-hover focus-within:ring-primary/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:ring-field-edge'

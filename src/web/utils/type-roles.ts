/**
 * Text roles, as class strings, for the parts of a component that carry one.
 *
 * Every size here is a `typeScale` step (`text-mini`, `text-caption`, …). A
 * Tailwind default size (`text-xs`, `text-sm`, …) is not a step of the scale:
 * it renders 12 or 14 px beside a consumer's 13 or 15, and a consumer whose
 * Tailwind config replaces the default scale with `typeScale` gets no rule for
 * it at all. tests/type-scale.test.tsx fails on one.
 */

/**
 * The eyebrow: the structural micro-label — section titles, column heads,
 * filter headers, tile labels. DESIGN.md's `label` token: Satoshi 700 / 9 px /
 * 0.18em / uppercase. Written once so every eyebrow in the library is the same
 * one; colour is left to the caller (usually `text-muted-foreground`).
 */
export const eyebrow = 'text-mini font-bold uppercase tracking-eyebrow'

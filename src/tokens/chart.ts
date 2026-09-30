/**
 * KaleidoSwap chart tokens — the categorical series palette.
 *
 * Chart series need their own steps: the brand colours (`primary` #15E99A,
 * the network hues) are tuned for text and chips, and at OKLCH L ≈ 0.83 they
 * sit above the lightness band a series colour must stay inside on the dark
 * surface. These are the brand's hues snapped into that band.
 *
 * The ORDER is the colour-blind-safety mechanism, not decoration: series take
 * slots in this order and never cycle, so every adjacent pair (the only pairs
 * that touch in bars, stacks and lines) stays apart under protanopia and
 * deuteranopia. Validated with the dataviz palette checks (OKLab ΔE ×100):
 *
 *   dark  on card #242638 — band 0.48–0.67 ✓, chroma ✓, worst adjacent CVD 13.2,
 *                           normal-vision 19.3, every slot ≥ 3:1 contrast
 *   light on card #FFFFFF — band 0.43–0.77 ✓, chroma ✓, worst adjacent CVD 16.3,
 *                           normal-vision 19.6; slots 5–6 below 3:1 → every
 *                           chart ships a table view as the relief channel
 *
 * Scatter-type charts (where any two marks can sit side by side) are capped at
 * the first three slots, which also pass the all-pairs check in both modes.
 * A seventh series is never a generated hue: fold the tail into "Other".
 */
export const chartSeries = {
  /** green (the brand), violet, orange, blue, yellow, magenta */
  dark: ['#0fae74', '#9085e9', '#d95926', '#3987e5', '#c98500', '#d55181'],
  light: ['#17a877', '#6d5ce0', '#eb6834', '#2a78d6', '#eda100', '#e87ba4'],
} as const

/** How many series a chart may colour before the tail folds into "Other". */
export const chartSeriesLimit = chartSeries.dark.length

/** Series cap for forms where every pair can touch (scatter). */
export const chartScatterSeriesLimit = 3

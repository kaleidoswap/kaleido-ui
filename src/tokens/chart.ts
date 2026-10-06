/**
 * KaleidoSwap chart tokens — the categorical series palette.
 *
 * The first three series are green, violet and azzurro — the brand's three
 * chart colours. A chart that needs more takes warm hues for slots 4–6:
 * yellow, magenta, orange. Yellow and orange never sit side by side — at equal
 * saturation they are hard to tell apart even with full colour vision — so
 * magenta separates them.
 *
 * Chart series need their own steps: the brand colours (`primary` #15E99A,
 * the network hues) are tuned for text and chips, and at OKLCH L ≈ 0.83 they
 * sit above the lightness band a series colour must stay inside on the dark
 * surface. These are the three hues placed inside it.
 *
 * Violet and azzurro are neighbours on the hue wheel and collapse into one
 * another under deuteranopia at equal lightness. What keeps them apart is
 * LIGHTNESS: violet is darker than azzurro in both themes. The order is the
 * colour-blind-safety mechanism — series take slots in order and never cycle.
 *
 * The violet is the chart's own step, between the brand violets: lighter than
 * a deep violet, calmer than `accent-send-fg` (OKLCH C ≈ 0.15–0.17 against
 * its 0.26 on light). It keeps the rule above — L 0.62 vs azzurro 0.66 on
 * dark, 0.52 vs 0.65 on light — but the checks below were run on the earlier
 * violets (#7061db, #4e40a0) and have not been re-run for it.
 *
 * The green is one value in both themes, #17B581 (the light theme's
 * `primary`), and every chart draws it — the TrendChart's primary tone reads
 * `--series-1` too. On dark it sits at L 0.69, just over the band; the dark
 * checks below were run on the earlier #098356.
 *
 * Found by searching OKLCH lightness for these hues and validated with the
 * dataviz palette checks (OKLab ΔE ×100):
 *
 *   dark  on card #242638 — band 0.48–0.67 ✓, chroma ✓, worst adjacent CVD 12.2,
 *                           normal-vision 17.0, every slot ≥ 3:1 contrast
 *   light on card #FFFFFF — band 0.43–0.77 ✓, chroma ✓, worst adjacent CVD 19.2,
 *                           normal-vision 23.9; yellow and orange below 3:1.
 *                           The green is the light theme's `primary`
 *                           (#17B581), so every chart shares the TrendChart's
 *                           green; it too sits under 3:1 on white
 *                           (a yellow that reads as yellow cannot reach 3:1 on
 *                           white) → every chart ships a table view as the
 *                           relief channel
 *
 * A yellow that reads as yellow also cannot be brighter than the dark band
 * allows, so on dark it is a gold (#b3880f): brighter yellows would outshine
 * every other series.
 *
 * Scatter-type charts (where any two marks can sit side by side) are capped at
 * the first three slots, which pass the all-pairs check in both modes (worst
 * CVD 12.2 dark, 19.2 light) and 3:1 contrast. A seventh series is never a
 * generated hue: fold the tail into "Other".
 */
export const chartSeries = {
  /** green, violet, azzurro, then yellow, magenta, orange */
  dark: ['#17b581', '#8374da', '#179fd4', '#b3880f', '#db589e', '#de6907'],
  light: ['#17b581', '#6851c3', '#0f9cd0', '#dea805', '#c34189', '#fe904d'],
} as const

/** How many series a chart may colour before the tail folds into "Other". */
export const chartSeriesLimit = chartSeries.dark.length

/** Series cap for forms where every pair can touch (scatter). */
export const chartScatterSeriesLimit = 3

/**
 * Generates src/css/kaleido-ui.css from src/tokens/.
 * Run via: npm run generate:css
 *
 * Output includes:
 *  - :root / .dark  — CSS custom properties (theme-switchable semantic colors)
 *  - @theme inline  — maps semantic CSS vars to Tailwind v4 utility names
 *  - @theme         — static tokens (network/tx colors, radius, typography, shadows, animations)
 *  - @keyframes     — animation definitions
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { colors, lightSemanticColors } from '../src/tokens/colors.ts'
import {
  appSemanticDark,
  appSemanticLight,
  appSemanticOrder,
  appStatusSubtleAlpha,
} from '../src/tokens/app-semantic.ts'
import { radius } from '../src/tokens/radius.ts'
import { sizing } from '../src/tokens/sizing.ts'
import { layer } from '../src/tokens/layers.ts'
import { shadow } from '../src/tokens/shadows.ts'
import { gradient } from '../src/tokens/gradients.ts'
import {
  brandDepth,
  brandGlowShadows,
  brandTheme,
  halo,
  themedForeground,
  themedForegroundOrder,
} from '../src/tokens/brand.ts'
import { transition } from '../src/tokens/transitions.ts'
import { fontFamily, typeScale, letterSpacing, iconSize, iconBoxSize } from '../src/tokens/typography.ts'
import { keyframes, animation } from '../src/tokens/animations.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../src/css/kaleido-ui.css')
const BRAND_OUTPUT = join(__dirname, '../src/css/brand.css')

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
}

function serializeKeyframes(name: string, frames: Record<string, Record<string, string>>): string {
  const stops = Object.entries(frames)
    .map(([stop, props]) => {
      const propsStr = Object.entries(props)
        .map(([k, v]) => `    ${camelToKebab(k)}: ${v};`)
        .join('\n')
      return `  ${stop} {\n${propsStr}\n  }`
    })
    .join('\n')
  return `@keyframes ${name} {\n${stops}\n}`
}

const keyframesCss = Object.entries(keyframes)
  .map(([name, frames]) => serializeKeyframes(name, frames as Record<string, Record<string, string>>))
  .join('\n\n')

const animationTheme = Object.entries(animation)
  .map(([name, value]) => `  --animate-${name}: ${value};`)
  .join('\n')

const typeScaleTheme = Object.entries(typeScale)
  .map(([key, [size, lh]]) => `  --text-${key}: ${size};\n  --text-${key}--line-height: ${lh};`)
  .join('\n')

const iconSizeTheme = Object.entries(iconSize)
  .map(([key, size]) => `  --text-icon-${key}: ${size};\n  --text-icon-${key}--line-height: 1;`)
  .join('\n')

const iconBoxSizeTheme = Object.entries(iconBoxSize)
  .map(([key, size]) => `  --spacing-icon-${key}: ${size};`)
  .join('\n')

// ── App semantic colors (slate identity) ──────────────────────────────────
// Channel triples ("R G B") declared under the `--app-*` namespace and wrapped
// in rgb() for the Tailwind utility. Opacity modifiers (e.g. bg-status-danger
// over 10%) resolve via Tailwind v4 color-mix(in oklab, C, transparent), which
// is equivalent to straight rgba() alpha (mixing with transparent only scales
// alpha) — so the consuming app's pre-migration rendering is preserved. The raw
// --app-* channels also back manual rgb(var(--app-x) / 0.8) usages in app CSS.
const appChannelVars = (vals: Record<string, string>): string =>
  appSemanticOrder.map((k) => `  --app-${k}: ${vals[k]};`).join('\n')

const appDarkVars = appChannelVars(appSemanticDark)
const appLightVars = appChannelVars(appSemanticLight)

const appThemeInline = appSemanticOrder
  .map((k) => `  --color-${k}: rgb(var(--app-${k}));`)
  .join('\n')

// Fixed-alpha tinted intent surfaces (`bg-status-*-subtle`).
const appStatusSubtle = ['success', 'danger', 'warning', 'info']
  .map(
    (s) =>
      `  --color-status-${s}-subtle: rgb(var(--app-status-${s}) / ${appStatusSubtleAlpha});`
  )
  .join('\n')

// ── Brand layer (src/tokens/brand.ts) ─────────────────────────────────────
// Per-theme foregrounds and depth. Light is the :root default (and forced by
// .light), dark applies under .dark, like the shadcn-style tokens above.
type Theme = 'light' | 'dark'
const brandVars = (theme: Theme): string =>
  [
    ...themedForegroundOrder.map((k) => `  --${k}: ${themedForeground[theme][k]};`),
    `  --gradient-page-brand: ${brandDepth[theme].pageWash};`,
    `  --brand-gradient: ${brandDepth[theme].gradient};`,
    `  --glow-send: ${brandDepth[theme].glowSend};`,
    `  --glow-recv: ${brandDepth[theme].glowRecv};`,
    `  --glow-card: ${brandDepth[theme].glowCard};`,
  ].join('\n')

const brandThemeInline = [
  ...themedForegroundOrder.map((k) => `  --color-${k}: var(--${k});`),
  ...brandGlowShadows.map((k) => `  --shadow-${k}: var(--${k});`),
].join('\n')

const hexToChannels = (hex: string): string => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ')
}

const css = `/* AUTO-GENERATED — do not edit by hand.
 * Source: scripts/generate-css.ts  ←  src/tokens/
 * Regenerate: npm run generate:css
 */

/* ── Material Symbols ──────────────────────────────────────────────────── */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  /*
   * Glyph spans default to baseline alignment with the parent's line-height,
   * which makes Material Symbols render a few pixels above text in flex
   * rows next to <img>-based icons. Force the glyph to render centered
   * within its own box (line-height 1, vertical-align middle, inline-flex
   * items-center) so it sits on the same visual axis as adjacent text and
   * image icons everywhere they're used.
   */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
}
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ── Semantic colors (light mode) — from src/tokens/colors.ts ───────────── */
:root {
  --background:           ${lightSemanticColors.background};
  --foreground:           ${lightSemanticColors.foreground};
  --card:                 ${lightSemanticColors.card};
  --card-foreground:      ${lightSemanticColors.cardFg};
  --popover:              ${lightSemanticColors.popover};
  --popover-foreground:   ${lightSemanticColors.popoverFg};
  --primary:              ${lightSemanticColors.primary};
  --primary-foreground:   ${lightSemanticColors.primaryFg};
  --secondary:            ${lightSemanticColors.secondary};
  --secondary-foreground: ${lightSemanticColors.secondaryFg};
  --muted:                ${lightSemanticColors.muted};
  --muted-foreground:     ${lightSemanticColors.mutedFg};
  --accent:               ${lightSemanticColors.accent};
  --accent-foreground:    ${lightSemanticColors.accentFg};
  --destructive:          ${lightSemanticColors.destructive};
  --border:               ${lightSemanticColors.border};
  --input:                ${lightSemanticColors.input};
  --ring:                 ${lightSemanticColors.ring};
  --chart-1:              ${lightSemanticColors.chart1};
  --chart-2:              ${lightSemanticColors.chart2};
  --chart-3:              ${lightSemanticColors.chart3};
  --chart-4:              ${lightSemanticColors.chart4};
  --chart-5:              ${lightSemanticColors.chart5};
}

/* ── Semantic colors (dark mode) — from src/tokens/colors.ts ───────────── */
.dark {
  --background:           ${colors.background};
  --foreground:           ${colors.foreground};
  --card:                 ${colors.card};
  --card-foreground:      ${colors.cardFg};
  --popover:              ${colors.popover};
  --popover-foreground:   ${colors.popoverFg};
  --primary:              ${colors.primary};
  --primary-foreground:   ${colors.primaryFg};
  --secondary:            ${colors.secondary};
  --secondary-foreground: ${colors.secondaryFg};
  --muted:                ${colors.muted};
  --muted-foreground:     ${colors.mutedFg};
  --accent:               ${colors.accent};
  --accent-foreground:    ${colors.accentFg};
  --destructive:          ${colors.destructive};
  --border:               ${colors.border};
  --input:                ${colors.input};
  --ring:                 ${colors.ring};
  --chart-1:              ${colors.chart1};
  --chart-2:              ${colors.chart2};
  --chart-3:              ${colors.chart3};
  --chart-4:              ${colors.chart4};
  --chart-5:              ${colors.chart5};
}

/* ── App semantic colors (slate identity) — from src/tokens/app-semantic.ts ─
   RGB channels in the --app-* namespace. Dark is the default (:root, .dark);
   light is opt-in (.light) — matching the document-root .dark/.light toggle.
   Surfaced as Tailwind utilities below via @theme inline. ──────────────── */
:root,
.dark {
${appDarkVars}
}

.light {
${appLightVars}
}

/* ── Brand layer — from src/tokens/brand.ts ─────────────────────────────
   Per-theme foregrounds that clear WCAG AA (text-brand, text-danger-fg,
   text-network-lightning-fg, …), the coloured page wash, the brand gradient
   and the accent glows. Purely additive: no existing token changes.
   Light is the default (like --primary / --card above); .dark switches. ── */
:root,
.light {
${brandVars('light')}
}

.dark {
${brandVars('dark')}
}

/* ─────────────────────────────────────────────────────────────────────────
   Tailwind v4 @theme
   @theme inline  — semantic colors: utilities reference CSS vars so dark mode works at runtime.
   @theme         — static tokens: Tailwind owns the variable + generates the utility.
   ───────────────────────────────────────────────────────────────────────── */

@theme inline {
  /* Semantic colors */
  --color-background:           var(--background);
  --color-foreground:           var(--foreground);
  --color-card:                 var(--card);
  --color-card-foreground:      var(--card-foreground);
  --color-popover:              var(--popover);
  --color-popover-foreground:   var(--popover-foreground);
  --color-primary:              var(--primary);
  --color-primary-foreground:   var(--primary-foreground);
  --color-secondary:            var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted:                var(--muted);
  --color-muted-foreground:     var(--muted-foreground);
  --color-accent:               var(--accent);
  --color-accent-foreground:    var(--accent-foreground);
  --color-destructive:          var(--destructive);
  --color-border:               var(--border);
  --color-input:                var(--input);
  --color-ring:                 var(--ring);
  --color-chart-1:              var(--chart-1);
  --color-chart-2:              var(--chart-2);
  --color-chart-3:              var(--chart-3);
  --color-chart-4:              var(--chart-4);
  --color-chart-5:              var(--chart-5);

  /* App semantic colors (slate identity) — channel-backed via the --app-* vars.
     These intentionally override the shadcn-style --color-primary / --color-secondary
     mappings above so the brand utilities (bg-primary, bg-secondary, text-content-x,
     border-border-x, bg-status-x with opacity) resolve to the canonical slate palette. */
${appThemeInline}
${appStatusSubtle}

  /* Brand layer — per-theme foregrounds and glows (see the blocks above) */
${brandThemeInline}
}

@theme {
  /* Network colors */
  --color-network-bitcoin:   ${colors.network.bitcoin};
  --color-network-rgb:       ${colors.network.rgb};
  --color-network-arkade:    ${colors.network.arkade};
  --color-network-spark:     ${colors.network.spark};
  --color-network-lightning: ${colors.network.lightning};
  --color-network-liquid:    ${colors.network.liquid};
  --color-network-taproot:   ${colors.network.taproot};
  --color-network-bitcoin-chip:   ${colors.networkChip.bitcoin};
  --color-network-rgb-chip:       ${colors.networkChip.rgb};
  --color-network-arkade-chip:    ${colors.networkChip.arkade};
  --color-network-spark-chip:     ${colors.networkChip.spark};
  --color-network-lightning-chip: ${colors.networkChip.lightning};
  --color-network-liquid-chip:    ${colors.networkChip.liquid};
  --color-network-taproot-chip:   ${colors.networkChip.taproot};
  --color-network-bitcoin-text:   ${colors.networkText.bitcoin};
  --color-network-rgb-text:       ${colors.networkText.rgb};
  --color-network-arkade-text:    ${colors.networkText.arkade};
  --color-network-spark-text:     ${colors.networkText.spark};
  --color-network-lightning-text: ${colors.networkText.lightning};
  --color-network-liquid-text:    ${colors.networkText.liquid};
  --color-network-taproot-text:   ${colors.networkText.taproot};

  /* Asset icon brand colors */
  --color-asset-eth:  ${colors.assetIcon.eth};
  --color-asset-usdt: ${colors.assetIcon.usdt};
  --color-asset-usdc: ${colors.assetIcon.usdc};

  /* Transaction colors */
  --color-tx-sent:    ${colors.tx.sent};
  --color-tx-receive: ${colors.tx.receive};
  --color-tx-swap:    ${colors.tx.swap};

  /* Intent colors */
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-danger:  ${colors.danger};
  --color-info:    ${colors.info};

  /* Surface elevation — extras with no slate-semantic equivalent.
     (surface-base / surface-elevated / surface-overlay are now the channel-backed
     slate tokens defined in @theme inline above; the legacy translucent washes here
     would otherwise override them by source order.) */
  --color-surface-card:           ${colors.surface.card};
  --color-surface-overlay-strong: ${colors.surface.overlayStrong};
  --color-surface-scrim:          ${colors.surface.scrim};

  /* Text ladder for dark surfaces */
  --color-text-primary:   ${colors.text.primary};
  --color-text-secondary: ${colors.text.secondary};
  --color-text-muted:     ${colors.text.muted};
  --color-text-dimmed:    ${colors.text.dimmed};
  --color-text-disabled:  ${colors.text.disabled};
  --color-text-on-accent: ${colors.text.onAccent};

  /* Scrollbar colors */
  --color-scrollbar-thumb:       ${colors.scrollbar.thumb};
  --color-scrollbar-thumb-hover: ${colors.scrollbar.thumbHover};
  --color-scrollbar-track:       ${colors.scrollbar.track};
  --spacing-scrollbar:           ${sizing.scrollbar};
  --spacing-scrollbar-hover:     ${sizing.scrollbarHover};
  --spacing-scrollbar-thumb-min: ${sizing.scrollbarThumbMin};

  /* Layers */
  --z-header:    ${layer.header};
  --z-popover:   ${layer.popover};
  --z-nav:       ${layer.nav};
  --z-scrollbar: ${layer.scrollbar};
  --z-modal:     ${layer.modal};

  /* Typography */
  --font-sans:    ${fontFamily.display};
  --font-display: ${fontFamily.display};
  --font-mono:    ${fontFamily.mono};
${typeScaleTheme}

  /* Letter spacing — uppercase eyebrow labels */
  --tracking-eyebrow:      ${letterSpacing.eyebrow};
  --tracking-eyebrow-wide: ${letterSpacing.eyebrowWide};

  /* Icon-size scale (text-icon-{xxs..5xl}) — for Material Symbols glyphs */
${iconSizeTheme}

  /* Icon box-size scale (size-icon-{sm,md,lg,nav,control}) — for SVG icons */
${iconBoxSizeTheme}

  /* Border radius */
  --radius-none:  ${radius.none};
  --radius-xs:    ${radius.xs};
  --radius-sm:    ${radius.sm};
  --radius-md:    ${radius.md};
  --radius-lg:    ${radius.lg};
  --radius-xl:    ${radius.xl};
  --radius-2xl:   ${radius['2xl']};
  --radius-3xl:   ${radius['3xl']};
  --radius-4xl:   ${radius['4xl']};
  --radius-full:  ${radius.full};
  --radius-card:  ${radius.card};
  --radius-panel: ${radius.panel};
  --radius-nav:   ${radius.nav};
  --radius-pill:  ${radius.pill};

  /* Shadows */
  --shadow-glow:                 ${shadow.glow};
  --shadow-glow-strong:          ${shadow.glowStrong};
  --shadow-glow-subtle:          ${shadow.glowSubtle};
  --shadow-glow-accent:          ${shadow.glowAccent};
  --shadow-header:               ${shadow.header};
  --shadow-glow-primary-soft:    ${shadow.glowPrimarySoft};
  --shadow-glow-primary:         ${shadow.glowPrimary};
  --shadow-glow-primary-strong:  ${shadow.glowPrimaryStrong};
  --shadow-popover:              ${shadow.popover};
  --shadow-toast:                ${shadow.toast};

  /* Drop-shadows (Tailwind v4 emits drop-shadow-* utilities from --drop-shadow-*) */
  --drop-shadow-glow-primary-soft: ${shadow.glowPrimarySoft};
  --drop-shadow-glow-primary:      ${shadow.glowPrimary};

  /* Gradients (use as background-image: var(--gradient-page)) */
  --gradient-page:        ${gradient.pageRadial};
  --gradient-card-sheen:  ${gradient.cardSheen};
  --gradient-headline:    ${gradient.headline};

  /* Transitions */
  --transition-fast:    ${transition.fast};
  --transition-default: ${transition.default};
  --transition-slow:    ${transition.slow};

  /* Animations */
${animationTheme}
}

/* ── Keyframes — from src/tokens/animations.ts ──────────────────────────── */
${keyframesCss}

/* ── Reusable utilities backed by tokens ───────────────────────────────── */
/* Page-shell radial wash. Usage: <div className="bg-page-radial"> */
.bg-page-radial {
  background-image: var(--gradient-page);
}
/* Receive-panel sheen used by SwapInputCard. */
.bg-card-sheen {
  background-image: var(--gradient-card-sheen);
}
/* Brand headline gradient. Pair with bg-clip-text + text-transparent
   on the consuming element (the HeadlineGradient component does this). */
.bg-gradient-headline {
  background-image: var(--gradient-headline);
}
/* Coloured, per-theme page wash (mint, violet, sky). The static
   bg-page-radial above is the older neutral haze and is unchanged. */
.bg-page-brand {
  background-image: var(--gradient-page-brand);
}
/* Brand gradient text, for large display type only (the dark stops clear
   3:1, not 4.5:1). */
.text-gradient-brand {
  background-image: var(--brand-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
/* Halo backdrop, rendered by <HaloBackdrop />: three heavily blurred blobs
   drifting slowly behind a screen. Colours: --halo-primary / --halo-secondary. */
.kui-halo {
  --halo-primary: ${halo.primary};
  --halo-secondary: ${halo.secondary};
}
.kui-halo-blob {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 9999px;
  filter: blur(${halo.blur});
  will-change: transform;
}
.kui-halo-blob-a {
  width: 55%;
  top: -8%;
  left: -12%;
  background: var(--halo-primary);
  opacity: 0.14;
  animation: kui-halo-drift-a 26s ease-in-out infinite alternate;
}
.kui-halo-blob-b {
  width: 60%;
  top: 28%;
  right: -18%;
  background: var(--halo-secondary);
  opacity: 0.16;
  animation: kui-halo-drift-b 34s ease-in-out infinite alternate;
}
.kui-halo-blob-c {
  width: 45%;
  bottom: -12%;
  left: 12%;
  background: var(--halo-primary);
  opacity: 0.12;
  animation: kui-halo-drift-c 22s ease-in-out infinite alternate;
}
.kui-halo[data-animated='false'] .kui-halo-blob {
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .kui-halo-blob {
    animation: none;
  }
}
@keyframes kui-halo-drift-a {
  from { transform: translate3d(0, 22%, 0) scale(0.92); }
  50% { transform: translate3d(9%, -6%, 0) scale(1.05); }
  to { transform: translate3d(-5%, -30%, 0) scale(1.14); }
}
@keyframes kui-halo-drift-b {
  from { transform: translate3d(0, -28%, 0) scale(1.12); }
  50% { transform: translate3d(-7%, -2%, 0) scale(1); }
  to { transform: translate3d(6%, 20%, 0) scale(0.92); }
}
@keyframes kui-halo-drift-c {
  from { transform: translate3d(0, 18%, 0) scale(1); }
  50% { transform: translate3d(-5%, -5%, 0) scale(1.08); }
  to { transform: translate3d(7%, -26%, 0) scale(0.95); }
}
/* Legacy app scroll region. Prefer the ScrollArea component for visible overlay scrollbars. */
.app-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.app-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hidden horizontal scroller utility used by compact chip rows. */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
`

writeFileSync(OUTPUT, css)
console.log(`✓ Generated ${OUTPUT}`)

// ── Opt-in brand theme — kaleido-ui/css/brand ─────────────────────────────
// Import AFTER kaleido-ui/css. Unlike the brand layer above, these CHANGE
// existing tokens, which is why they live in their own stylesheet.
const brandCss = `/* AUTO-GENERATED — do not edit by hand.
 * Source: scripts/generate-css.ts  ←  src/tokens/brand.ts
 * Regenerate: npm run generate:css
 *
 * kaleido-ui brand theme (opt-in). Import after kaleido-ui/css:
 *   @import "kaleido-ui/css";
 *   @import "kaleido-ui/css/brand";
 *
 * - Light: the primary (#17B581, 2.1 to 2.6:1 on the light ramp) becomes the
 *   AA-safe brand green, so text-primary, links, ghost buttons and rings read.
 * - Dark: danger and info are lifted to clear 4.5:1 on every dark surface.
 * - Both: bg-page-radial draws the coloured brand wash instead of the haze.
 */
:root:not(.dark),
.light {
  --primary: ${brandTheme.lightPrimary};
  --ring: ${brandTheme.lightPrimary};
}

.light {
  --app-primary: ${hexToChannels(brandTheme.lightPrimary)};
  --app-border-strong: ${hexToChannels(brandTheme.lightPrimary)};
}

.dark {
  --color-danger: ${brandTheme.darkDanger};
  --color-info: ${brandTheme.darkInfo};
}

:root {
  --gradient-page: var(--gradient-page-brand);
}
`

writeFileSync(BRAND_OUTPUT, brandCss)
console.log(`✓ Generated ${BRAND_OUTPUT}`)

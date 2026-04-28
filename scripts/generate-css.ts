/**
 * Generates src/css/kaleido-ui.css from src/tokens/.
 * Run via: tsx scripts/generate-css.ts
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { colors } from '../src/tokens/colors.ts'
import { radius } from '../src/tokens/radius.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT = join(__dirname, '../src/css/kaleido-ui.css')

const css = `/* AUTO-GENERATED — do not edit by hand.
 * Source: scripts/generate-css.ts  ←  src/tokens/
 * Regenerate: npm run generate:css
 */

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ── Semantic colors (light mode) ──────────────────────────────────────── */
/* Light-mode values are not yet in the token files; edit here until they are. */
:root {
  --background:           #ffffff;
  --foreground:           #0a0a0a;
  --card:                 #ffffff;
  --card-foreground:      #0a0a0a;
  --popover:              #ffffff;
  --popover-foreground:   #0a0a0a;
  --primary:              #171717;
  --primary-foreground:   #fafafa;
  --secondary:            #f5f5f5;
  --secondary-foreground: #171717;
  --muted:                #f5f5f5;
  --muted-foreground:     #737373;
  --accent:               #f5f5f5;
  --accent-foreground:    #171717;
  --destructive:          #e7000b;
  --border:               #e5e5e5;
  --input:                #e5e5e5;
  --ring:                 #a1a1a1;
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
}

/* ── Border radius — from src/tokens/radius.ts ─────────────────────────── */
:root {
  --radius-none: 0px;
  --radius-xs:   2px;
  --radius-sm:   ${radius.sm};
  --radius-md:   ${radius.md};
  --radius-lg:   ${radius.lg};
  --radius-xl:   ${radius.xl};
  --radius-2xl:  16px;
  --radius-3xl:  24px;
  --radius-4xl:  32px;
  --radius-full: ${radius.full};
  --radius:      var(--radius-lg);
}
`

writeFileSync(OUTPUT, css)
console.log(`✓ Generated ${OUTPUT}`)

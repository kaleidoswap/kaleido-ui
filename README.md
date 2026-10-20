# kaleido-ui

Shared UI library for KaleidoSwap — design tokens, web components (Tailwind + Radix), and React Native components extending [WDK UI Kit](https://docs.wdk.tether.io/ui-kits/react-native-ui-kit).

## Installation

```bash
npm install kaleido-ui
```

## Entry Points

| Import | Description |
|--------|-------------|
| `kaleido-ui` | Web components (Tailwind CSS + Radix UI) |
| `kaleido-ui/icons` | Every icon glyph as its own export, plus `createIcon` to build an `Icon` that ships only the glyphs you pass it |
| `kaleido-ui/tokens` | Platform-agnostic design tokens (zero deps) |
| `kaleido-ui/native` | React Native components (WDK + custom) |
| `kaleido-ui/css` | CSS variables (light + dark), keyframes, utilities, and the Tailwind v4 `@theme` tokens |
| `kaleido-ui/css/brand` | Opt-in brand theme: AA-safe light primary, lifted dark danger/info, coloured page wash (import after `kaleido-ui/css`) |
| `kaleido-ui/tailwind` | Tailwind **v3** preset built from the tokens |
| `kaleido-ui/brand/*.svg` | Logo files: `kaleidoswap-pictogram.svg`, `kaleidoswap-fullogo-{horizontal,vertical}.svg` (white wordmark) and `-on-light.svg` variants |

> **Tailwind v4 and v3 are both supported.** The library is built with v4.
> On v4, `kaleido-ui/css` carries the whole theme as `@theme` blocks — no
> preset. On v3, which ignores `@theme` and only generates the opacity steps in
> its own scale, use the `kaleido-ui/tailwind` preset *and* import
> `kaleido-ui/css` for the variables it points at. Either way, scan the
> package's `dist` so the components' classes are generated.
> `tests/tailwind-v3-preset.test.tsx` compiles the components with both and
> fails if v3 misses a class v4 generates.

## Quick Start — Web (Tailwind v4)

### 1. Import Tailwind + the kaleido-ui theme

```css
/* styles.css */
@import "tailwindcss";
@import "tw-animate-css";   /* Dialog/Select/Toast enter-exit classes */
@import "kaleido-ui/css";

/* Tell Tailwind which files to scan for classes: yours and the components' */
@source "./src/**/*.{ts,tsx}";
@source "../node_modules/kaleido-ui/dist/web";
```

### Tailwind v3

```js
// tailwind.config.js
module.exports = {
  presets: [require('kaleido-ui/tailwind')],
  content: ['./src/**/*.{ts,tsx}', './node_modules/kaleido-ui/dist/web/**/*.js'],
  plugins: [require('tailwindcss-animate')],
}
```

```css
/* index.css — kaleido-ui/css first: the preset's colours are its variables */
@import 'kaleido-ui/css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The preset's colours are the theme's custom properties (opacity modifiers work
through `color-mix`), so light and dark switch at runtime exactly as on v4.

```ts
// main.tsx
import './styles.css'
```

### 2. Use Components

```tsx
import { Button, Card, CardContent, StatusBadge, AssetCard } from 'kaleido-ui'

function App() {
  return (
    <Card>
      <CardContent>
        <AssetCard
          ticker="BTC"
          name="Bitcoin"
          displayBalance="0.00142000"
          networks={['L1', 'LN', 'Spark']}
        />
        <StatusBadge status="completed" />
        <Button variant="cta" size="cta">Swap Now</Button>
      </CardContent>
    </Card>
  )
}
```

## Quick Start — React Native

### 1. Install peer dependencies

```bash
npm install @tetherto/wdk-uikit-react-native react-native
```

### 2. Wrap with theme provider

```tsx
import { KaleidoThemeProvider } from 'kaleido-ui/native'

export default function App() {
  return (
    <KaleidoThemeProvider>
      {/* Your app */}
    </KaleidoThemeProvider>
  )
}
```

### 3. Use Components

```tsx
import {
  Balance,
  AmountInput,
  AssetSelector,
  StatusBadge,
  NetworkBadge,
} from 'kaleido-ui/native'
```

## Quick Start — Tokens Only

Works in any JS runtime (Node.js, React Native, web) with zero dependencies.

```ts
import { colors, typeScale, radius, shadow } from 'kaleido-ui/tokens'

console.log(colors.primary)        // '#15E99A'
console.log(colors.network.bitcoin) // '#F7931A'
console.log(typeScale.body)         // ['16px', '24px']
```

## Web Components

### Primitives

| Component | Description |
|-----------|-------------|
| `Button` | 15 variants (default, destructive, outline, secondary, ghost, link, glow, surface, cta, cta-gradient, danger-subtle, danger-quiet, hyperlink, quiet), 11 sizes |
| `Card` | Compositional: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| `Input` | Form text input with focus ring |
| `Select` | Select (Radix): Select, SelectTrigger, SelectContent, SelectItem, etc. Past four items, the list caps its height, scrolls, and shows a search field |
| `DropdownMenu` | Dropdown menu (Radix): DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, etc. Searchable past four items, like `Select` |
| `Table` | Table, TableHeader, TableBody, TableRow, TableHead, TableCell, etc. `TableHead` takes `sortable`, `sortDirection` (`'asc' \| 'desc' \| 'none'`) and `onSort`, and sets `aria-sort` |
| `Dialog` | Modal dialog (Radix): Dialog, DialogContent, DialogHeader, DialogTitle, etc. |
| `Tabs` | Tab navigation (Radix): Tabs, TabsList, TabsTrigger, TabsContent |
| `Label` | Form label (Radix) |
| `Toast` | Toast notifications (Radix): Toast, ToastProvider, Toaster |
| `Icon` | Inline SVG icon by name, with size variants (xs-2xl). Looking a name up means shipping the whole set; see below |
| `Icons` | Named icon shortcuts (Icons.Send, Icons.Receive, Icons.Swap, etc.) |

#### Icons and bundle size

The ESM build is one module per component and the package declares no side
effects, so a bundler keeps only what the app imports. `<Icon name="…">` is the
exception: any name can come in at runtime, so it carries every glyph (~75 KB
minified). To ship only the glyphs you draw, import them from `kaleido-ui/icons`
and build your own `Icon`. It takes the same props and the names you give it:

```tsx
import { createIcon, Close, Check, CheckCircleFilled } from 'kaleido-ui/icons'

export const Icon = createIcon({ close: Close, check: Check }, { check: CheckCircleFilled })

<Icon name="close" size="sm" />
<Icon name="check" filled />
```

`IconButton icon="close"` looks the name up the same way; `GlyphButton` is the
same button taking the glyph component (`<GlyphButton icon={Close} label="Close" />`),
and `IconGlyph` draws one glyph at the icon scale (`<IconGlyph glyph={Close} size="sm" />`).

### Shared Components

| Component | Description |
|-----------|-------------|
| `StatusBadge` | Status indicator (success, pending, failed, completed, error) |
| `NetworkBadge` | Network/layer badge (L1, LN, RGB20, RGB21, Spark, Arkade) |
| `AssetIcon` | Circular asset icon with CDN + fallback chain |
| `AssetCard` | Asset display with icon, name, networks, balance |
| `TransactionCard` | Transaction row with direction, status, amount |
| `PageHeader` | Sticky header with left/center/right slots |
| `SettingItem` | Settings row with icon, title, description, chevron |
| `SectionLabel` | Uppercase section heading |
| `AlertBanner` | Alert box (error, warning, info, success variants) |
| `ErrorBoundary` | React error boundary with retry UI |
| `KaleidoswapLogo` | Full logo, `orientation="horizontal" \| "vertical"`. Wordmark uses `currentColor`; size with `h-* w-auto` |
| `KaleidoswapMark` | The K pictogram on its own; size with `size-*` |
| `HaloBackdrop` | Decorative drifting brand-colour blobs behind a screen (parent needs `relative isolate`) |
| `TrendChart` | Line/area trend chart with a chart/table switch; pass `view` + `onViewChange` to control the view from the host, or leave them out |
| `WithdrawAmountInput` | Amount card for the withdraw flow; `unitSlot` replaces the unit label with your own control (e.g. a unit picker) inside the card |

### Hooks

| Hook | Description |
|------|-------------|
| `useToast` | Toast state management + `toast()` function |
| `useAssetIcon` | Resolves asset ticker to CDN icon URL |

### Utilities

| Export | Description |
|--------|-------------|
| `cn()` | `clsx` + `tailwind-merge`, configured with kaleido-ui's custom scales (`text-title`, `text-icon-md`, `rounded-card`, `shadow-glow-*`, `tracking-eyebrow`) so they are not mistaken for colours and dropped. Use it instead of a local `twMerge`. |

### Brand utilities (from `kaleido-ui/css`)

Additive, per-theme (light by default, `.dark` switches):

| Utility | Use |
|---------|-----|
| `text-brand`, `text-accent-send-fg`, `text-accent-recv-fg` | Brand / send / receive foregrounds that clear WCAG AA in both themes |
| `text-{success,warning,danger,info}-fg` | Status text (the plain `text-warning` etc. are dark-theme values) |
| `text-network-{bitcoin,lightning,liquid,arkade,spark,rgb,taproot}-fg` | Network-hued text |
| `bg-page-brand` | Coloured page wash (mint, violet, sky) |
| `text-gradient-brand` | Brand gradient text, display sizes only |

## Native Components

### From WDK UI Kit (re-exported, themed)

AmountInput, AssetSelector, NetworkSelector, Balance, CryptoAddressInput, QRCode, TransactionItem, TransactionList, SeedPhrase

### Custom

StatusBadge, NetworkBadge, AlertBanner, SectionLabel

## Design Tokens

| Token | Values |
|-------|--------|
| `colors` | primary (#15E99A, dark theme; `lightSemanticColors` for light), surfaces, text, semantic, network, transaction |
| `typeScale` | mini (10px) through display (38px) |
| `fontFamily` | Satoshi (display), Geist Mono (mono) |
| `fontWeight` | normal (400) through bold (700) |
| `radius` | xs (2px) through full (9999px), plus card, panel, nav, pill |
| `shadow` | glow*, glowPrimary*, glowViolet*, card*, raised, button*, popover, toast |
| `transition` | fast (150ms), default (200ms), slow (300ms) |
| `brandMark` | The logo's three fills (violet, green, mint): paint, never text |
| `themedForeground` | Per-theme AA foregrounds (`brand`, `accent-*-fg`, status and network `-fg`) |
| `brandDepth` | Per-theme page wash, brand gradient and glows |

## Development

```bash
npm install --legacy-peer-deps
npm run build    # Build all entry points
npm run dev      # Watch mode
```

## License

MIT

# @kaleidorg/kaleido-ui

Shared UI library for KaleidoSwap — design tokens, web components (Tailwind + Radix), and React Native components extending [WDK UI Kit](https://docs.wdk.tether.io/ui-kits/react-native-ui-kit).

## Installation

```bash
npm install @kaleidorg/kaleido-ui
```

## Entry Points

| Import | Description |
|--------|-------------|
| `@kaleidorg/kaleido-ui` | Web components (Tailwind CSS + Radix UI) |
| `@kaleidorg/kaleido-ui/tokens` | Platform-agnostic design tokens (zero deps) |
| `@kaleidorg/kaleido-ui/native` | React Native components (WDK + custom) |
| `@kaleidorg/kaleido-ui/tailwind` | Tailwind CSS preset |
| `@kaleidorg/kaleido-ui/css` | CSS custom properties, glass effects, animations |

## Quick Start — Web

### 1. Configure Tailwind

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@kaleidorg/kaleido-ui/dist/web/*.js',
  ],
  presets: [require('@kaleidorg/kaleido-ui/tailwind')],
}
```

### 2. Import CSS

```ts
// main.tsx
import '@kaleidorg/kaleido-ui/css'
```

### 3. Use Components

```tsx
import { Button, Card, CardContent, StatusBadge, AssetCard } from '@kaleidorg/kaleido-ui'

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
import { KaleidoThemeProvider } from '@kaleidorg/kaleido-ui/native'

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
} from '@kaleidorg/kaleido-ui/native'
```

## Quick Start — Tokens Only

Works in any JS runtime (Node.js, React Native, web) with zero dependencies.

```ts
import { colors, typeScale, radius, shadow } from '@kaleidorg/kaleido-ui/tokens'

console.log(colors.primary)        // '#2BEE79'
console.log(colors.network.bitcoin) // '#F7931A'
console.log(typeScale.body)         // ['15px', '22px']
```

## Web Components

### Primitives

| Component | Description |
|-----------|-------------|
| `Button` | 11 variants (default, destructive, outline, secondary, ghost, link, glow, surface, cta, cta-gradient, danger-subtle), 9 sizes |
| `Card` | Compositional: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| `Input` | Form text input with focus ring |
| `Dialog` | Modal dialog (Radix): Dialog, DialogContent, DialogHeader, DialogTitle, etc. |
| `Tabs` | Tab navigation (Radix): Tabs, TabsList, TabsTrigger, TabsContent |
| `Label` | Form label (Radix) |
| `Toast` | Toast notifications (Radix): Toast, ToastProvider, Toaster |
| `Icon` | Material Symbols wrapper with size variants (xs-2xl) |
| `Icons` | Named icon shortcuts (Icons.Send, Icons.Receive, Icons.Swap, etc.) |

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

### Hooks

| Hook | Description |
|------|-------------|
| `useToast` | Toast state management + `toast()` function |
| `useAssetIcon` | Resolves asset ticker to CDN icon URL |

### Utilities

| Export | Description |
|--------|-------------|
| `cn()` | `clsx` + `tailwind-merge` utility |

## Native Components

### From WDK UI Kit (re-exported, themed)

AmountInput, AssetSelector, NetworkSelector, Balance, CryptoAddressInput, QRCode, TransactionItem, TransactionList, SeedPhrase

### Custom

StatusBadge, NetworkBadge, AlertBanner, SectionLabel

## Design Tokens

| Token | Values |
|-------|--------|
| `colors` | primary (#2BEE79), surfaces, text, semantic, network, transaction |
| `typeScale` | xxs (10px) through display (36px) |
| `fontFamily` | Geist Sans, Geist Mono |
| `fontWeight` | normal (400) through bold (700) |
| `radius` | sm (8px) through full (9999px) |
| `shadow` | glow, glowStrong, glowSubtle, glowAccent |
| `transition` | fast (150ms), default (200ms), slow (300ms) |

## Development

```bash
npm install --legacy-peer-deps
npm run build    # Build all entry points
npm run dev      # Watch mode
```

## License

MIT

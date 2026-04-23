---
name: KaleidoSwap
description: KaleidoSwap shared design system — dark-forest, brand-green, Bitcoin-native wallet UI.
version: 0.1.0
colors:
  brand.primary: "#2BEE79"
  brand.primary-contrast: "#051B10"
  surface.bg: "hsl(158 58% 7%)"
  surface.card: "hsl(156 32% 12%)"
  surface.elevated: "hsl(154 26% 17%)"
  border.subtle: "hsl(150 20% 24%)"
  border.primary-ghost: "rgba(43, 238, 121, 0.22)"
  text.primary: "#FFFFFF"
  text.muted: "rgba(255, 255, 255, 0.55)"
  text.on-primary: "#051B10"
  destructive: "hsl(0 62% 50%)"
  success: "#2BEE79"
  network.bitcoin: "#F7931A"
  network.lightning: "#F6C343"
  network.rgb: "#DD352E"
  network.spark: "#FF6D00"
  network.arkade: "#7C3AED"
  tx.sent: "#F94040"
  tx.received: "#2BEE79"
  tx.swap: "#4290FF"
typography:
  display: { family: "Satoshi", weight: 700, size: 32, tracking: -0.02em }
  h1:      { family: "Satoshi", weight: 700, size: 22, tracking: -0.01em }
  body:    { family: "Satoshi", weight: 500, size: 14 }
  label:   { family: "Satoshi", weight: 800, size: 9,  tracking: 0.2em, transform: uppercase }
  mono:    { family: "ui-monospace", weight: 500, size: 12 }
rounded:
  card: 12
  pill: 999
  button: 14
  nav: 20
spacing:
  1: 4
  2: 8
  3: 12
  4: 16
  5: 20
  6: 24
  8: 32
components:
  button.primary:
    bg: "{colors.brand.primary}"
    fg: "{colors.brand.primary-contrast}"
    radius: "{rounded.button}"
    height: 44
    weight: 800
  button.surface:
    bg: "{colors.surface.card}"
    fg: "{colors.text.primary}"
    border: "{colors.border.subtle}"
    radius: "{rounded.button}"
    hover.bg: "{colors.brand.primary}"
    hover.fg: "{colors.brand.primary-contrast}"
  card.asset:
    bg: "{colors.surface.card}"
    border: "{colors.border.subtle}"
    radius: "{rounded.card}"
    padding: 12
  action-tile:
    bg: "{colors.surface.card}"
    border: "{colors.border.subtle}"
    radius: "{rounded.card}"
    icon-size: 20
    tile-size: 44
    hover.bg: "{colors.brand.primary}"
    hover.fg: "{colors.brand.primary-contrast}"
  filter-pill:
    bg: "rgba(255,255,255,0.06)"
    border: "rgba(255,255,255,0.12)"
    radius: "{rounded.card}"
    active.bg: "rgba(255,255,255,0.13)"
    active.border: "rgba(255,255,255,0.25)"
    cluster-icon-size: 11
    cluster-opacity: 0.6
  status-pill:
    radius: "{rounded.pill}"
    bg-alpha: 0.14
    border-alpha: 0.22
    text-alpha: 0.85
  bottom-nav:
    bg: "{colors.surface.card}"
    radius: "{rounded.pill}"
    active.bg: "rgba(43, 238, 121, 0.22)"
    active.border: "{colors.border.primary-ghost}"
    active.fg: "{colors.brand.primary}"
---

# KaleidoSwap Design System

## Overview

KaleidoSwap is a Bitcoin-native wallet that lives across multiple layers: on-chain BTC, Lightning (RLN), RGB assets, Spark, and Arkade. A single user action — "send," "swap," "receive" — can route through any of those rails, and the interface has to make that feel coherent rather than like five different wallets glued together. The design language is deliberately **dark-forest**: a near-black green background, layered surface cards in the same hue family, and a single punchy brand green (`#2BEE79`) that signals "this is the action, this is alive, this worked."

This document is the **single source of truth** for the `kaleido-ui` package and every consumer downstream — most visibly the `rate-extension` browser wallet. It exists because the package ships neutral-gray defaults (`primary: #e5e5e5`, `bg: #0a0a0a` in `src/tokens/colors.ts`) that silently produce unstyled, off-brand output on any component a consumer forgets to re-theme. DESIGN.md replaces those defaults as the normative spec: the tokens below are what the library should render, what the Tailwind preset should expose, and what every PR is measured against.

DESIGN.md is written for two audiences in parallel: humans shipping UI, and coding agents generating it. The YAML front matter is the machine-readable contract (tokens, component bindings); the prose below is the rationale — why a button is 44 px tall, why network icons must stay orange at 11 px, why the page background is not `#000`. When the two disagree, the YAML wins; when a token is missing, add it here first and propagate downstream.

## Colors

The palette is organised into six groups. Each group has a specific job; mixing them is how the system breaks.

### Brand

- **`brand.primary` `#2BEE79`** — *the* KaleidoSwap signal. Reserve it for three things only: primary CTAs (the single most important action on a screen), active states (selected tab, active nav slot, focused input ring), and success confirmations (completed swap, settled payment). Using it on borders of passive surfaces or as a decorative accent dilutes the signal and makes real CTAs disappear.
- **`brand.primary-contrast` `#051B10`** — the near-black green that sits on top of `brand.primary`. Use it for button label text, icons inside primary-filled tiles, and any glyph that needs to punch through the green. Never use it as a surface fill.

### Surface ramp

Three layers, all in the same forest-green hue family, stepping up in lightness:

- **`surface.bg` `hsl(158 58% 7%)`** — the page background. Every full-screen view starts here.
- **`surface.card` `hsl(156 32% 12%)`** — the default card / panel / action-tile fill.
- **`surface.elevated` `hsl(154 26% 17%)`** — a subtle lift for nested panels, dropdowns, and hover states on cards.

The hue drift (158 → 156 → 154) is intentional: it keeps the ramp from feeling computational-gray. Do not collapse these to a single value and do not use raw `#0a0a0a`.

### Borders

- **`border.subtle` `hsl(150 20% 24%)`** — the default hairline. Cards, inputs, filter pills at rest.
- **`border.primary-ghost` `rgba(43, 238, 121, 0.22)`** — brand green at 22% alpha. Used only when a surface is in an active / selected / "this is the section you are in" state.

### Text

- **`text.primary` `#FFFFFF`** — body copy, titles, numeric readouts.
- **`text.muted` `rgba(255,255,255,0.55)`** — secondary labels, helper text, timestamps. Do not go lower than 55% alpha for anything the user is meant to read.
- **`text.on-primary` `#051B10`** — text that sits on top of `brand.primary` fills.

### Destructive & Success

- **`destructive` `hsl(0 62% 50%)`** — delete, cancel, failed. Always paired with a confirmation step.
- **`success` `#2BEE79`** — intentionally identical to `brand.primary`. Success *is* the brand.

### Network tokens (semantic, do not recolor)

Each supported layer has a fixed, non-negotiable brand color that users recognise from outside this app:

- **`network.bitcoin` `#F7931A`** — on-chain BTC, the canonical Bitcoin orange.
- **`network.lightning` `#F6C343`** — Lightning / RLN.
- **`network.rgb` `#DD352E`** — RGB protocol red.
- **`network.spark` `#FF6D00`** — Spark L2.
- **`network.arkade` `#7C3AED`** — Arkade.

These tokens are **semantic**: the orange *means* on-chain Bitcoin. Never substitute a different hue for visual balance, never desaturate them because they clash with the green — the clash is the point, it tells the user which rail they are on.

### Transaction tokens

- **`tx.sent` `#F94040`** — outgoing.
- **`tx.received` `#2BEE79`** — incoming (reuses the brand green).
- **`tx.swap` `#4290FF`** — cross-layer swap, distinct from send/receive.

## Typography

The entire system uses **Satoshi** (variable font, weights 500–800). Satoshi's geometric-but-warm feel reads well at both 32 px display sizes and the 9 px micro-labels this interface leans on heavily.

Five roles:

- **`display` — Satoshi 700 / 32 / tracking -0.02em** — balance numbers, empty-state headlines, the single largest piece of type on any screen.
- **`h1` — Satoshi 700 / 22 / tracking -0.01em** — screen titles, modal headers.
- **`body` — Satoshi 500 / 14** — the default. Everything not otherwise specified renders here.
- **`label` — Satoshi 800 / 9 / tracking 0.2em / uppercase** — the **signature micro-label** of the system. Filter headers ("NETWORKS"), section labels ("RECENT ACTIVITY"), pill captions, table column heads. When you see uppercase 9 px letter-spaced type, you know you are in a KaleidoSwap surface. Use it liberally for structural labels; never use it for content.
- **`mono` — ui-monospace 500 / 12** — addresses, tx hashes, raw amounts where digit alignment matters.

Numeric amounts (balances, prices) render in `display` or `body` weight 700, not `mono` — mono is reserved for identifiers that the user copy-pastes.

## Layout

KaleidoSwap targets a **420 px max content width**: the browser-extension popup is the canonical viewport and everything else (webapp, mobile shell) adopts the same column so layouts translate 1:1.

- **Spacing scale**: tight, in 4 px steps — `1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32`. Most gaps between elements are `2` or `3`. Section-to-section breathing room is `4` or `6`. Do not invent odd values.
- **Horizontal padding**: views pad `16` (spacing `4`) from the viewport edge. Cards inside pad `12` (spacing `3`).
- **Bottom nav**: floats above the content; it is not a sticky footer. Every full-height view must reserve a **88 px bottom inset** (nav height + float gap) so the last row of content is not obscured.
- **Scroll**: only the main column scrolls. Nav, headers, and modals remain fixed.

## Elevation & Depth

Three layers, no more. Elevation is communicated by **surface color**, not by drop shadow.

1. **Base** — `surface.bg`. Page background.
2. **Card** — `surface.card`. Asset rows, action tiles, filter pills, nav.
3. **Elevated** — `surface.elevated`. Dropdowns, hovered cards, nested panels.

Two shadows exist in the entire system:

- **Inner shadow** (`shadow-sm`): a subtle inset on cards to sharpen the edge against `surface.bg`. Always inner, never outer.
- **Primary glow** (`shadow-[0_0_30px_rgba(43,238,121,0.5)]`): **only** on the hover state of a primary button or ActionTile. It is how the brand announces itself. No other component may glow.

Do not add new drop shadows, do not add blur-behind surfaces, do not fake depth with gradients.

## Shapes

The `rounded` token set maps directly to usage — do not pick a radius that is not in the list.

- **`card: 12`** — cards, asset rows, action tiles, the main-action trio (Deposit / Swap / Withdraw), filter pills at rest.
- **`pill: 999`** — status badges, network pills, bottom-nav container, filter options in their active state, any chip that wraps a single short word.
- **`button: 14`** — rectangular buttons (primary, surface, ghost, destructive). Slightly rounder than `card` so buttons read as interactive even without color.
- **`nav: 20`** — the inner active slot of the bottom nav. Softer than `button`, tighter than `pill`, tuned for a 44 px-tall pill-in-pill.

## Components

### Button

**Intended use.** A Button is the single unit of commitment on a screen. `primary` is the CTA ("Confirm swap," "Send"), and only one primary button should ever be visible at a time. `surface` is every secondary action that still needs to feel like a button ("Cancel," "Choose asset"). `ghost` is the flat, chrome-free variant used inside dense lists and dropdown rows.

**Key tokens.**
- `primary`: bg `brand.primary`, fg `brand.primary-contrast`, radius `button` (14), height `44`, weight `800`. Hover adds the primary glow.
- `surface`: bg `surface.card`, fg `text.primary`, border `border.subtle`, radius `button`. Hover swaps to `brand.primary` bg with `brand.primary-contrast` fg — the same fill the primary variant uses at rest.
- `ghost`: transparent bg, fg `text.primary`, no border. Hover reveals `surface.card`.

Leading icon sits left of the label with spacing `2` (8 px); trailing icon, when present, sits right with the same gap. Active / pressed state darkens the fill by ~8%.

**Wrong vs right.**
- Wrong: `<button class="bg-card text-white h-11 rounded-xl">Confirm</button>` — this is a primary action styled as a surface button; the user can't find the CTA.
- Right: use the `primary` variant (`<Button variant="primary">Confirm</Button>`) — green fill, dark text, glow on hover.

### Card (asset)

**Intended use.** The row / tile that represents an asset in a list: logo, ticker, name, amount, fiat equivalent. The workhorse of the wallet screen.

**Key tokens.** bg `surface.card`, border `border.subtle`, radius `card` (12), padding `12`. Internal layout uses spacing scale `2` for label stacks and `3` between logo and text. Hover lifts to `surface.elevated`.

**Wrong vs right.**
- Wrong: two cards stacked with no border and a hard-edged `#000` background — the rows blur together.
- Right: every card sits on `surface.bg`, fills with `surface.card`, and is outlined with `border.subtle`. The hairline separation is what makes a scrollable list legible.

### ActionTile

**Intended use.** The Deposit / Swap / Withdraw trio on the asset-detail screen — and any future equivalent where a small cluster of equally-weighted primary actions needs to sit side-by-side. Each tile has an icon slot on top and a label beneath.

**Key tokens.** bg `surface.card`, border `border.subtle`, radius `card` (12), icon slot `tile-size: 44` px with an icon sized `20` px inside. At rest, the tile reads as a surface card. On hover it fills with `brand.primary` and its icon/label flip to `brand.primary-contrast`, and the primary glow engages. Label text below the tile uses the `label` type token.

**Wrong vs right.**
- Wrong: three tiles with a green icon at rest, no fill change on hover — nothing tells the user the tile is the target. (This is the current state in `rate-extension/src/components/AssetDetail.tsx:833-858`.)
- Right: neutral surface at rest, full green fill + dark icon + glow on hover. The primary-ness is in the interaction, not the resting state.

### FilterPill

**Intended use.** The horizontal filter strip at the top of lists ("Networks," "Assets," "Time range"). Each pill groups an icon cluster and a label; tapping one scopes the list below.

**Key tokens.** bg `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.12)`, radius `card` (12). Active state: bg `rgba(255,255,255,0.13)`, border `rgba(255,255,255,0.25)`. When a pill shows a cluster of sub-icons (e.g. the networks currently included in the filter), each icon is **`cluster-icon-size: 11` px at `cluster-opacity: 0.6`**, maxing out at 4 icons plus a `+N` overflow token. The 11 px size is not a suggestion — shrinking is what keeps the cluster from competing with the pill's own label.

**Wrong vs right.**
- Wrong: a pill with four 20 px-high network icons crammed next to a 9 px label — the icons overwhelm, the filter label is unreadable. (Current `rate-extension/src/components/Dashboard.tsx:34-129`.)
- Right: 11 px icons at 60% opacity form a small, legible cluster-cap; the label reads first, the cluster reads second.

### StatusPill

**Intended use.** Small colored chips indicating the state or rail of something — "Settled on Lightning," "Pending on-chain," "Synced." Used in activity rows and next to balances.

**Key tokens.** Radius `pill` (999). The pill's color is always derived from a semantic token (usually a `network.*` token, sometimes `tx.*` or `destructive`). Given a source color `C`, the pill renders:
- bg: `C` at `bg-alpha: 0.14`
- border: `C` at `border-alpha: 0.22`
- text: `C` at `text-alpha: 0.85`

This tri-alpha pattern keeps every pill tonally consistent regardless of hue, which is why a Bitcoin-orange pill and an RGB-red pill sit peacefully next to each other.

**Wrong vs right.**
- Wrong: solid `#F7931A` fill with white text for a Bitcoin status pill — it screams louder than the primary CTA.
- Right: `#F7931A` at 14%/22%/85% — the pill is legible, on-brand, and visibly a status marker, not an action.

### BottomNav

**Intended use.** The five-slot floating navigation (Wallet / Swap / Activity / Agent / Settings). Always visible on main screens; hidden inside modals and full-screen flows.

**Key tokens.** Container bg `surface.card`, radius `pill` (999), floats `16` px above the viewport bottom. The active slot:
- bg: `rgba(43, 238, 121, 0.22)` (`primary/22%`)
- border: `border.primary-ghost`
- fg (icon + label): `brand.primary`
- inner radius: `nav` (20)

Inactive slots use `text.muted` for both icon and label, and have no background. Tapping a slot animates the active pill (only one active at a time).

**Wrong vs right.**
- Wrong: active tab highlighted only by a brighter icon, no background pill — users can't see which tab is selected in peripheral vision.
- Right: active slot wraps in a `primary/22%` pill with primary-ghost border and primary fg; the pill is the anchor.

### SectionHighlight

**Intended use.** When a screen represents "the currently active section" (e.g. you navigated into "Swap" and the swap hub is the active context), wrap either the whole container or its header in a subtle brand-ghost treatment to echo the nav state inwards.

**Key tokens.** Border `border.primary-ghost` (primary at 22%), background tint `primary/10` (`rgba(43,238,121,0.10)`), radius `card` (12). No glow — SectionHighlight is a passive indicator, not a CTA.

**Wrong vs right.**
- Wrong: full `brand.primary` border on the section container — now the section frame competes with the CTA inside it for attention.
- Right: 22% ghost border + 10% fill — just enough tint to say "you are here," quiet enough that a primary button still wins the eye.

## Do's and Don'ts

- **DO** use `brand.primary` only for CTAs, active states, and success. It is a signal, not a decoration.
- **DON'T** style primary buttons inline with `bg-card` — use the `surface` button variant or ActionTile if the action is secondary, or use the real `primary` variant if it is the CTA.
- **DO** tint every network icon with its semantic color (`network.bitcoin`, `network.lightning`, etc.) even at 11 px in a filter cluster. The color *is* the information.
- **DON'T** recolor network tokens for visual harmony. Bitcoin is orange, RGB is red, they were orange and red before this app existed.
- **DO** use `surface.bg` (`hsl(158 58% 7%)`) as the page background on every full-screen view.
- **DON'T** use raw `#0a0a0a` or `#000` as a background. The whole point of the dark-forest palette is that it is *not* black.
- **DO** keep filter cluster icons at `cluster-icon-size: 11` px and `cluster-opacity: 0.6`. The constraint is what makes the cluster legible.
- **DON'T** introduce new drop shadows. The only shadows in the system are the card inner shadow and the primary-button glow on hover.
- **DO** use the `label` type token (Satoshi 800 / 9 / uppercase / 0.2em tracking) for structural labels — filter headers, section titles, pill captions. It is the typographic fingerprint of the brand.
- **DON'T** invent new radii, spacing steps, or surface colors. If you need something the tokens don't provide, extend DESIGN.md first, then propagate to `kaleido-ui/tailwind` and `kaleido-ui/tokens`.

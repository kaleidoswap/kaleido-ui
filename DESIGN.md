---
name: KaleidoSwap
description: KaleidoSwap shared design system — brand-green, Bitcoin-native wallet UI.
version: 0.1.128   # must equal package.json's version; check-design-doc fails otherwise
# The values below are transcribed from src/tokens/. Those files are the source
# of truth; if the two disagree, this file is the bug. See "Keeping this file
# honest" at the end.
colors:
  brand.primary: "#15E99A"          # dark theme
  brand.primary-light: "#17B581"    # light theme
  brand.primary-contrast: "#051B10"
  surface.bg: "#12131C"             # surface-base
  surface.raised: "#181924"         # muted
  surface.card: "#242638"           # surface-overlay, card + popover
  surface.elevated: "#323448"       # accent
  surface.high: "rgb(66 68 90)"
  border.default: "rgba(255, 255, 255, 0.10)"
  border.subtle: "rgba(255, 255, 255, 0.04)"
  border.strong: "rgba(255, 255, 255, 0.15)"
  border.primary-ghost: "rgba(43, 238, 121, 0.22)"
  text.primary: "#FFFFFF"
  text.muted: "rgba(255, 255, 255, 0.55)"
  text.on-primary: "#051B10"
  destructive: "hsl(0 62% 50%)"
  success: "#15E99A"                # identical to brand.primary
  warning: "#FACC15"
  danger: "#F94040"
  info: "#4290FF"
  network.bitcoin: "#F7931A"
  network.lightning: "#F6C343"
  network.rgb: "#DD352E"
  network.spark: "#FF6D00"
  network.arkade: "#7C3AED"
  network.liquid: "#22e1c9"
  network.taproot: "#D1D6D8"
  tx.sent: "#F94040"
  tx.receive: "#2BEE79"
  tx.swap: "#4290FF"
typography:
  # Sizes are the typeScale keys in src/tokens/typography.ts, which is what the
  # text-* utilities emit. fontWeight tops out at 700 — there is no 800.
  display:  { family: "Satoshi", weight: 700, size: 36, line: 40, tracking: -0.02em }
  headline: { family: "Satoshi", weight: 700, size: 28, line: 34 }
  title:    { family: "Satoshi", weight: 700, size: 20, line: 28, tracking: -0.01em }
  subhead:  { family: "Satoshi", weight: 600, size: 17, line: 24 }
  body:     { family: "Satoshi", weight: 500, size: 15, line: 22 }
  caption:  { family: "Satoshi", weight: 500, size: 13, line: 18 }
  tiny:     { family: "Satoshi", weight: 500, size: 11, line: 16 }
  label:    { family: "Satoshi", weight: 700, size: 9,  line: 12, tracking: 0.18em, transform: uppercase }
  mono:     { family: "Geist Mono", weight: 500, size: 13 }
rounded:
  card: 16        # rounded-2xl — cards, tiles, settings/account rows, dialogs, sheet top edge
  inner: 12       # rounded-xl — rows/inputs/icon tiles nested inside a card, ActionTile trio
  pill: 999       # rounded-full — chips, status pills, filter chips, tab pills, bottom nav
  button: 12      # rounded-xl — rectangular buttons (full-bleed CTAs step up to card/16)
  panel: 24       # rounded-3xl
  nav: 32
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
    radius: "{rounded.inner}"
    icon-size: 20
    tile-size: 44
    hover.bg: "{colors.brand.primary}"
    hover.fg: "{colors.brand.primary-contrast}"
  filter-pill:
    bg: "rgba(255,255,255,0.06)"
    border: "rgba(255,255,255,0.12)"
    radius: "{rounded.pill}"
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

KaleidoSwap is a Bitcoin-native wallet that lives across multiple layers: on-chain BTC, Lightning (RLN), RGB assets, Spark, and Arkade. A single user action — "send," "swap," "receive" — can route through any of those rails, and the interface has to make that feel coherent rather than like five different wallets glued together. The design language is **near-black and brand-green**: a cool, almost neutral
dark ramp for every surface, and a single punchy brand green (`#15E99A`) that
signals "this is the action, this is alive, this worked." It began as a
*dark-forest* palette — green-tinted surfaces in the same hue family as the
accent — and moved off that: at 70% alpha over an animated background the
mid-green cards read muddy against white text. The green is now carried by the
accents alone, which is why the ramp below is blue-slate rather than forest.

This document is the **single source of truth** for the `kaleido-ui` package and every consumer downstream — most visibly the `rate-extension` browser wallet. It exists because the package ships neutral-gray defaults (`primary: #e5e5e5`, `bg: #0a0a0a` in `src/tokens/colors.ts`) that silently produce unstyled, off-brand output on any component a consumer forgets to re-theme. DESIGN.md replaces those defaults as the normative spec: the tokens below are what the library should render, what the Tailwind preset should expose, and what every PR is measured against.

DESIGN.md is written for two audiences in parallel: humans shipping UI, and coding agents generating it. The YAML front matter is the machine-readable contract (tokens, component bindings); the prose below is the rationale — why a button is 44 px tall, why network icons must stay orange at 11 px, why the page background is not `#000`. When the two disagree, the YAML wins; when a token is missing, add it here first and propagate downstream.

## Colors

The palette is organised into six groups. Each group has a specific job; mixing them is how the system breaks.

### Brand

- **`brand.primary` `#15E99A`** (light theme: `#17B581`) — *the* KaleidoSwap signal. Reserve it for three things only: primary CTAs (the single most important action on a screen), active states (selected tab, active nav slot, focused input ring), and success confirmations (completed swap, settled payment). Using it on borders of passive surfaces or as a decorative accent dilutes the signal and makes real CTAs disappear.
- **`brand.primary-contrast` `#051B10`** — the near-black green that sits on top of `brand.primary`. Use it for button label text, icons inside primary-filled tiles, and any glyph that needs to punch through the green. Never use it as a surface fill.

> **`#2BEE79` is not the brand primary.** It was, and it is still in the tokens —
> as `tx.receive`, as `chart1`, and inside `border.primary-ghost`
> (`rgba(43, 238, 121, 0.22)`) and the scrollbar hover. But the CTA/active/success
> green is `#15E99A`. Do not "correct" one to the other; they are different jobs.

### Surface ramp

Five layers, near-black and stepping up in lightness. Under the glass system
(`bg-card/70` over animated backgrounds) the old mid-green surfaces read muddy and
low-contrast against white text, so the ramp moved off the forest hue entirely:
it now sits in a cool blue-slate band (~235°), and the green identity is carried
by the brand accents alone rather than by the surfaces.

- **`surface.bg` `#12131C`** — the page background. Every full-screen view starts here.
- **`surface.raised` `#181924`** — the `muted` token: rows nested inside a card, quiet fills.
- **`surface.card` `#242638`** — the default card / panel / action-tile fill, and `popover`.
- **`surface.elevated` `#323448`** — the `accent` token: nested panels, dropdowns, hover states on cards.
- **`surface.high` `rgb(66 68 90)`** — the topmost step, for a control raised above an elevated surface.

Do not collapse these to a single value, and do not use raw `#0a0a0a` or `#000`:
the ramp is near-black but never black, and its neutrality is what lets the
network colours and the brand green stay legible on top of it.

There is a **second, separate** `surface.*` group in `src/tokens/colors.ts` —
`base`, `card`, `elevated`, `overlay`, `overlayStrong`, `scrim` — which is a set
of translucent white/black overlays for compositing *over* the ramp above, not
replacements for it. Different job, same word; check which one you want.

### Borders

Borders are translucent white, not opaque hues — they composite over whatever
surface they sit on, so one value works at every step of the ramp:

- **`border.default` `rgba(255,255,255,0.10)`** — the default hairline. Cards, inputs, filter pills at rest.
- **`border.subtle` `rgba(255,255,255,0.04)`** — the quietest edge, for a divider that should barely register.
- **`border.strong` `rgba(255,255,255,0.15)`** — an edge that has to be seen: a focused input, a selected pill.
- **`border.primary-ghost` `rgba(43, 238, 121, 0.22)`** — brand green at 22% alpha. Used only when a surface is in an active / selected / "this is the section you are in" state.

### Text

- **`text.primary` `#FFFFFF`** — body copy, titles, numeric readouts.
- **`text.muted` `rgba(255,255,255,0.55)`** — secondary labels, helper text, timestamps. Do not go lower than 55% alpha for anything the user is meant to read.
- **`text.on-primary` `#051B10`** — text that sits on top of `brand.primary` fills.

### Destructive & Success

- **`destructive` `hsl(0 62% 50%)`** — delete, cancel, failed. Always paired with a confirmation step.
- **`success` `#15E99A`** — intentionally identical to `brand.primary`. Success *is* the brand.
- **`warning` `#FACC15`** — a state that needs attention but is not a failure.
- **`danger` `#F94040`** — a failure. `destructive` is the button variant; `danger` is the text/fill token.
- **`info` `#4290FF`** — neutral notice. Also `tx.swap`, because a swap is neither in nor out.

### Network tokens (semantic, do not recolor)

Each supported layer has a fixed, non-negotiable brand color that users recognise from outside this app:

- **`network.bitcoin` `#F7931A`** — on-chain BTC, the canonical Bitcoin orange.
- **`network.lightning` `#F6C343`** — Lightning / RLN.
- **`network.rgb` `#DD352E`** — RGB protocol red.
- **`network.spark` `#FF6D00`** — Spark L2.
- **`network.arkade` `#7C3AED`** — Arkade.
- **`network.liquid` `#22e1c9`** — Liquid.
- **`network.taproot` `#D1D6D8`** — Taproot Assets.

These tokens are **semantic**: the orange *means* on-chain Bitcoin. Never substitute a different hue for visual balance, never desaturate them because they clash with the green — the clash is the point, it tells the user which rail they are on.

### Transaction tokens

- **`tx.sent` `#F94040`** — outgoing.
- **`tx.receive` `#2BEE79`** — incoming. This is the *old* brand green, kept deliberately: see the note under Brand.
- **`tx.swap` `#4290FF`** — cross-layer swap, distinct from send/receive.

## Typography

The entire system uses **Satoshi** (variable font). The weight scale is
`400 / 500 / 600 / 700` — **there is no 800**, so a spec asking for one cannot be
met. Satoshi's geometric-but-warm feel reads well at both 36 px display sizes and
the 9 px micro-labels this interface leans on heavily.

The sizes below are the `typeScale` keys, which is what the `text-*` utilities
emit — `text-display`, `text-body`, `text-mini` and so on:

- **`display` — Satoshi 700 / 36 / 40 / tracking -0.02em** — balance numbers, empty-state headlines, the single largest piece of type on any screen.
- **`headline` — Satoshi 700 / 28 / 34** — section headlines above a card group.
- **`title` — Satoshi 700 / 20 / 28 / tracking -0.01em** — screen titles, modal headers.
- **`subhead` — Satoshi 600 / 17 / 24** — a heading inside a card.
- **`body` — Satoshi 500 / 15 / 22** — the default. Everything not otherwise specified renders here.
- **`caption` — Satoshi 500 / 13 / 18** — helper text under a field.
- **`tiny` — Satoshi 500 / 11 / 16** — timestamps, dense meta rows.
- **`mini` / `label` — Satoshi 700 / 9 / 12 / tracking `eyebrow` 0.18em / uppercase** — the **signature micro-label** of the system. Filter headers ("NETWORKS"), section labels ("RECENT ACTIVITY"), pill captions, table column heads. When you see uppercase 9 px letter-spaced type, you know you are in a KaleidoSwap surface. Use it liberally for structural labels; never use it for content. `eyebrowWide` (0.22em) is the wider variant.
- **`mono` — Geist Mono 500 / 13** — addresses, tx hashes, raw amounts where digit alignment matters.

Numeric amounts (balances, prices) render in `display` or `body` weight 700, not `mono` — mono is reserved for identifiers that the user copy-pastes.

### Which step carries which role

Components set text **only** with these steps — never Tailwind's default sizes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` …), which are not on the scale: they render 12 and 14 px beside a consumer's 13 and 15, and a consumer whose Tailwind config uses `typeScale` in place of the defaults gets no CSS for them. `tests/type-scale.test.tsx` fails on one.

| Role | Step | Examples |
| --- | --- | --- |
| Hero figure | `display` 36 | the amount on a confirmation screen |
| Big figure | `headline` 28 | a comfortable `MetricCard` value, amount inputs, success titles |
| Screen / page title | `title` 20 | `PageHeader variant="page"`, dialog titles, `CardTitle` |
| Heading in a card, large button label | `subhead` 17 | CTA buttons |
| Primary text, card and section titles, values | `body` 15 | `SettingsSectionCard` and `InfoPanel` titles, `Button` |
| Secondary text, descriptions, data cells | `caption` 13 | `InfoPanel` body, `SettingsSectionCard` description, `Table` cells |
| Meta rows, timestamps | `tiny` 11 | `TransactionCard` meta |
| Dense chip text | `xxs` 10 | hints, compact tile descriptions |
| **Eyebrow** — every structural uppercase label | `mini` 9 | section titles, column heads, filter headers, tile labels, status badges |

**The eyebrow is written once**, as `eyebrow` in `src/web/utils/type-roles.ts`: `text-mini font-bold uppercase tracking-eyebrow` — Satoshi 700 / 9 px / 0.18em, the `label` token above. The tokens are authoritative (weight tops out at 700; tracking is 0.18em), and this document matches them. Any uppercase letter-spaced label uses `tracking-eyebrow` (or `tracking-eyebrow-wide`); hand-written `tracking-[…]` values are not allowed.

There are no spacing tokens yet; components use Tailwind's 4 px spacing scale (`p-4` card, `p-3` inner row, `p-2.5` compact tile). Follow those values rather than inventing new ones.

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

The `rounded` token set maps directly to usage — do not pick a radius that is not in the list. The scale is deliberately shallow: a surface is either a **card** (16), something **nested one level inside a card** (12), or a **pill** (999). Everything on one screen must sit on that ladder or the layout stops reading as one family.

- **`card: 16` (`rounded-2xl`)** — every top-level surface: cards, tiles, settings and account rows (`SettingsTile`, `SettingItem`, `AccountSettingsRow` — plain *and* accent variants), activity/transaction cards (`TransactionCard`, `ActivityRow`, the `ActivityList` wrappers), the Activity filter-bar controls (search input, status dropdown, clear button — all `h-11`), dialogs. Bottom sheets use it on their top edge (`rounded-t-2xl`).
- **`inner: 12` (`rounded-xl`)** — surfaces nested one level inside a card: inner rows, inputs, icon tiles, segmented-control options, the Deposit / Swap / Withdraw `ActionTile` trio. Never use `inner` for a card's own outline — nesting is what the smaller radius communicates.
- **`pill: 999` (`rounded-full`)** — status badges, network pills, filter chips (`ActivityNetworkFilters`), tab pills (`ActivityTypeTabs` container and its active pill), bottom-nav container, direction/avatar circles, any chip that wraps a single short word.
- **`button: 12`** — rectangular buttons (primary, surface, ghost, destructive) share the `inner` scale; full-bleed CTA variants step up to `card` (16).
- **`nav: 32`** — the inner active slot of the bottom nav. Softer than `pill`, wider than `panel`, tuned for a 44 px-tall pill-in-pill.

There is no larger step. No component may use `rounded-3xl` — the swap hero card (`SwapInputCard`) sits on `card` (16) like everything else; if a card "feels like it deserves" more, it doesn't — use `card` (16).

## Components

### Button

**Intended use.** A Button is the single unit of commitment on a screen. `primary` is the CTA ("Confirm swap," "Send"), and only one primary button should ever be visible at a time. `surface` is every secondary action that still needs to feel like a button ("Cancel," "Choose asset"). `ghost` is the flat, chrome-free variant used inside dense lists and dropdown rows.

**Key tokens.**
- `primary`: bg `brand.primary`, fg `brand.primary-contrast`, radius `button` (12), height `44`, weight `800`. Hover adds the primary glow.
- `surface`: bg `surface.card`, fg `text.primary`, border `border.subtle`, radius `button`. Hover swaps to `brand.primary` bg with `brand.primary-contrast` fg — the same fill the primary variant uses at rest.
- `ghost`: transparent bg, fg `text.primary`, no border. Hover reveals `surface.card`.

Leading icon sits left of the label with spacing `2` (8 px); trailing icon, when present, sits right with the same gap. Active / pressed state darkens the fill by ~8%.

**Wrong vs right.**
- Wrong: `<button class="bg-card text-white h-11 rounded-xl">Confirm</button>` — this is a primary action styled as a surface button; the user can't find the CTA.
- Right: use the `primary` variant (`<Button variant="primary">Confirm</Button>`) — green fill, dark text, glow on hover.

### Card (asset)

**Intended use.** The row / tile that represents an asset in a list: logo, ticker, name, amount, fiat equivalent. The workhorse of the wallet screen.

**Key tokens.** bg `surface.card`, border `border.subtle`, radius `card` (16), padding `12`. Internal layout uses spacing scale `2` for label stacks and `3` between logo and text. Hover lifts to `surface.elevated`.

**Wrong vs right.**
- Wrong: two cards stacked with no border and a hard-edged `#000` background — the rows blur together.
- Right: every card sits on `surface.bg`, fills with `surface.card`, and is outlined with `border.subtle`. The hairline separation is what makes a scrollable list legible.

### ActionTile

**Intended use.** The Deposit / Swap / Withdraw trio on the asset-detail screen — and any future equivalent where a small cluster of equally-weighted primary actions needs to sit side-by-side. Each tile has an icon slot on top and a label beneath.

**Key tokens.** bg `surface.card`, border `border.subtle`, radius `inner` (12) — the trio sits inside the balance card, so it takes the nested scale — icon slot `tile-size: 44` px with an icon sized `20` px inside. At rest, the tile reads as a surface card. On hover it fills with `brand.primary` and its icon/label flip to `brand.primary-contrast`, and the primary glow engages. Label text below the tile uses the `label` type token.

**Wrong vs right.**
- Wrong: three tiles with a green icon at rest, no fill change on hover — nothing tells the user the tile is the target. (This is the current state in `rate-extension/src/components/AssetDetail.tsx:833-858`.)
- Right: neutral surface at rest, full green fill + dark icon + glow on hover. The primary-ness is in the interaction, not the resting state.

### FilterPill

**Intended use.** The horizontal filter strip at the top of lists ("Networks," "Assets," "Time range"). Each pill groups an icon cluster and a label; tapping one scopes the list below.

**Key tokens.** bg `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.12)`, radius `pill` (999). Active state: bg `rgba(255,255,255,0.13)`, border `rgba(255,255,255,0.25)`. When a pill shows a cluster of sub-icons (e.g. the networks currently included in the filter), each icon is **`cluster-icon-size: 11` px at `cluster-opacity: 0.6`**, maxing out at 4 icons plus a `+N` overflow token. The 11 px size is not a suggestion — shrinking is what keeps the cluster from competing with the pill's own label.

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

**Key tokens.** Border `border.primary-ghost` (primary at 22%), background tint `primary/10` (`rgba(43,238,121,0.10)`), radius `card` (16). No glow — SectionHighlight is a passive indicator, not a CTA.

**Wrong vs right.**
- Wrong: full `brand.primary` border on the section container — now the section frame competes with the CTA inside it for attention.
- Right: 22% ghost border + 10% fill — just enough tint to say "you are here," quiet enough that a primary button still wins the eye.

### Dialog

**Intended use.** A modal decision or a short form over the current screen. `DialogContent` draws a corner X by default, because for an ordinary dialog it is the expected exit.

**`showClose={false}`** — turn the X off where dismissing is not a neutral act. The case it exists for: a secret shown exactly once (a newly created API key). A control that reads as "close" must not sit beside something the user cannot see again; the dialog closes only through an explicit action ("I have stored this key"). Do not turn it off to tidy a layout — a dialog with no visible exit and no explicit action traps the user. Escape and the overlay still close the dialog unless the consumer prevents them (`onEscapeKeyDown`, `onPointerDownOutside`), which a once-only secret should also do.

### Drawer

**Intended use.** The app's left navigation, and nothing else: the desktop app's sidebar, in the form the width calls for. On the desktop it is `DrawerSidebar`, always on screen and folded by its own chevron to an icon rail. Below the desktop breakpoint it is `Drawer` + `DrawerContent`, the same panel over the page, opened from a `DrawerTrigger` in the top bar: a hamburger icon with no visible text while the drawer is closed, whose accessible name says what it opens and the current page ("Open navigation, current page: Activity"). A record opened from a list is a `Dialog`, not a drawer; a phone flow's step is `BottomSheet`.

**Anatomy.** Both forms hold the same parts, so one list is written once and rendered in both: `DrawerBody` (scrolls) → `DrawerSection label` (a group) → `DrawerNavItem icon label active` (a destination; `asChild` for a router link), then `DrawerFooter` (quick actions, the version) held below. The mobile form also needs a `DrawerTitle` (its `header`) and a `DrawerDescription` (visually hidden); Radix Dialog underneath traps focus, and Escape, the overlay and choosing a destination close it.

**It is the desktop app's sidebar.** `surface.base`, a `divider/30` rule on the right edge, `shadow-2xl` at 30% black, a `px-4 py-5` header row with the logo slot and the chevron. Expanded `w-72`; the rail `w-20`, which hides the logo and the group eyebrows, splits groups with a rule, centres the icons and turns labels into tooltips (they stay in the accessibility tree). The mobile form is always expanded, caps at `85vw` so a strip of the page stays visible to tap away, over the `BottomSheet` scrim.

**Items.** `rounded-xl`, `px-4 py-3`, label `body` semibold. Inactive `content.secondary`, hovering to `surface.overlay/80`. The current page is `status.success` on a 10% fill with a 2 px left rule, and carries `aria-current="page"`. Group labels are the shared eyebrow (`label` token) in `content.tertiary`.

**Submenus.** `DrawerNavGroup icon label active` is a row with a submenu — the desktop app's Trade and Liquidity. The row (a button with `aria-expanded`) shows and hides its `DrawerNavItem`s under it, and a chevron on its right turns 90° when open. It opens by itself when one of its pages is current, and is then marked like a current item. Its items become the submenu's rows: indented `pl-4`, `rounded-lg`, `px-4 py-2.5`, label `caption` medium with a 16 px icon, sliding right on hover; the current one is `status.success` on a 10% fill with a 2 px left rule. On the icon rail a submenu cannot open, so the row is a link to `railHref` (usually the group's first page).

**No scrollbar.** `DrawerBody` scrolls by wheel, touch and keyboard but draws no native scrollbar, which on the 80 px rail took the width the icons are centred in.

**Chevron.** `p-3`, `rounded-lg`, a `divider/10` ring that turns `primary/30` on hover, 18 px. On the sidebar it points the way the panel will move (left to fold, right to unfold) and reports `aria-expanded`; on the mobile drawer it points left and closes it.

**Motion.** The sidebar's width changes in 300 ms ease-in-out. The mobile drawer travels in from the left in 300 ms and leaves in 200 ms; the overlay fades. Reduced motion turns all of it off.

**The edge rule.** The single hairline on the panel's right edge is a component-spec border (Coherence Rules below): the panel sits on the page's own surface, so without it the edge is only the shadow. The header has no divider under it; the rail's group rules are the one other line, standing in for the eyebrows it hides.

### Table

**Intended use.** Dense data grids on desk surfaces — the partner and admin panels' swaps, keys and installs tables. Nine columns, many rows, read across. A transaction *feed* on a phone is `ActivityList`, not a table.

**Key tokens.** Cells `caption` (13 px) at `px-4 py-3`: a grid is scanned, not read, and at `body` (15 px) a swaps-width grid scrolls sideways where 13 px still fits. The 16 px inset lines the first column up with a card title padded `p-4` above the table. Column heads are the eyebrow (`label` token) in `muted-foreground`. Row hover is `bg-muted/50`. Every part takes `className`.

**Scrolling.** The table scrolls horizontally inside its own `min-w-0` wrapper and never widens the page or holds a grid column open.

**The divider exception.** Rows divide with a `border` hairline. This is the **one** exception to "separate stacked rows with spacing, not divider lines" (Coherence Rules below): across nine columns an eye cannot follow a row on whitespace alone. It applies to `Table` rows only. It is not a licence for dividers in lists, cards or settings rows.

### TrendChart

**Intended use.** A count over time, readable at a glance: completed and failed swaps per bucket on the partner dashboard. Stacked bars, one per period, one segment per series. Built for up to ~120 periods (a year weekly, ninety days daily) at card width with no horizontal scroll.

**Rules it enforces.**
- **Value axis** — linear from zero, and every label names a value the data reaches. The top label *is* the tallest bar; the axis is never rounded up to a value no bar touches. The scale is stated on the chart: `scaleLabel` + "· linear, from 0" ("Swaps per day · linear, from 0").
- **Time axis** — the first and last periods are always labelled; the rest are spaced to the width.
- **Colour** — from theme custom properties only (`--primary`, `--destructive`, `--chart-2`, `--chart-4`, `--muted-foreground`), so it follows light and dark.
- **Greyscale** — the first series is solid and the others hatched, so the chart is legible with colour removed.
- **Empty** — no points renders the consumer's `empty` node, never an empty frame.
- **No pointer needed** — hovering a period shows its figures; the plot is focusable, ←/→/Home/End move between periods and Escape clears, and the readout is a polite live region.
- **Width** — the SVG is `width="100%"` with a `viewBox` measured from its container; a fixed pixel width would become the column's min-content and force a sideways scroll.

### Charts

**Pick the form by the data's job, before any colour.** A single figure is a `MetricCard` (with a `Sparkline` for its recent trend), not a chart. Then:

| Job | Component |
| --- | --- |
| Change over time, several series | `LineChart` |
| One series over time, where the level matters | `AreaChart` |
| A count per period, split in parts (up to ~120 periods) | `TrendChart` |
| Compare a few series across a few categories | `BarChart` (grouped) |
| Part-to-whole per category | `BarChart layout="stacked"` |
| Many or long-named categories, one series | `BarChart orientation="horizontal"` |
| A ranked or dated list with every value printed | `BarList` |
| Part-to-whole at a glance, ≤ 6 parts | `DonutChart` (close values belong in a bar chart) |
| How two measures relate, ≤ 3 series | `ScatterChart` |
| One ratio against a limit | `Meter` |

**Colour.** **Green, violet and azzurro** are series 1–3; a chart that needs more takes **yellow, magenta, orange** for series 4–6. They are `--series-1…6` from `chartSeries`, a step per theme. The brand colours themselves sit above the lightness band a series colour must stay inside on the dark surface, so these are the hues placed inside it (on dark the yellow is a gold). Violet and azzurro collapse into each other under deuteranopia at equal lightness, so violet is kept darker; yellow and orange are never neighbours, so magenta sits between them. The order is the colour-blind-safety mechanism: every adjacent pair passes CVD separation (worst ΔE 12.2 dark, 19.2 light) and the normal-vision floor. Never cycle past six: fold the tail into "Other" (`DonutChart` does it for you). Scatter charts are capped at three series (the slots that also pass for every pair) and throw on a fourth. One series means one colour for every bar — never a value ramp on nominal categories.

**Marks.** Lines 2 px, round joins; end markers r 4 with a 2 px ring in the card colour; area fills a 10 % wash; bars at most 24 px thick with a 4 px rounded data end and a square baseline end; a 2 px surface gap between touching bars and stacked segments; gridlines solid hairlines on `border` — never dashed. Text never wears a series colour: values, labels and legends stay in text tokens beside a coloured key.

**Every chart has** a value axis linear from zero whose top label is the largest value; a legend for two or more series (none for one — the label names it); a hover layer (a crosshair and every series at that x on line and area charts, the whole category band as the target on bars, the nearest point on a scatter) with the same readout on keyboard focus through ←/→, Home/End and Escape and a polite live region; a **table view** one toggle away, which is also the relief channel for the two light-theme slots below 3:1 on white; and an `empty` node instead of an empty frame.

### MetricCard

**Intended use.** One figure and its label: a balance, a count, a rate. Two sizes, one per surface:

- **`compact`** (default) — the phone tile in the wallet's dense metric rows: `p-2.5`, `rounded-xl`, eyebrow label, value in `body`, icon beside the label.
- **`comfortable`** — the desk tile on panel dashboards: `p-4`, `rounded-2xl` `bg-card`, eyebrow label, value in `headline` (28 px) with `tabular-nums`, `description` in `caption` under it, and the icon at the end of the tile, right of the figure. The figure is the point of the tile, so it is the largest text on it. Do not build a second stat tile from `Card`.

The tile is a `role="group"` named by its label (or `aria-label`), so a failure that replaces the value is announced as belonging to that metric.

### PageHeader

- **`variant="bar"`** (default) — the mobile app bar: sticky, back button, small title, `right` slot.
- **`variant="page"`** — a desk page's header: the page's only `h1` (`title`), a one-line `description` in `caption`, and one `action` at the end of the title row, centred on the title's line and wrapping under it on a phone. No back button unless `onBack` is passed.

### SummaryRows

Label/value rows on `bg-muted/40`, separated by spacing. The markup follows the content: `as="dl"` (default) is a label/value list, a `dt`/`dd` per row; `as="ol"` is an ordered log (a status history); `as="ul"` an unordered one. The visual does not change with `as`. `tone: 'muted'` sets a value quieter than its label (`caption`, normal weight, `muted-foreground`), for the timestamp beside a log event.

### CopyButton

Copying reports what actually happened, everywhere. `useCopyToClipboard()` returns `{ state: 'idle' | 'copied' | 'failed', copy(value), reset() }`: a missing clipboard (an insecure context) or a rejected write is `failed`, never `copied`, and there is no timer — the state changes only on the next copy or `reset()`.

- **`CopyButton value label`** — a 24×24 ghost icon button named "Copy {label}" with `CopyIcon`'s glyph (`variant="bare"`): the copy glyph, the check once copied. A success is announced ("{label} copied to the clipboard"); a failure shows "Copy failed — select it and copy by hand." beside it as an alert. It stops the click's propagation, since it usually sits in a clickable row.
- **`Copyable value label`** — the value (or a shortened `children`) plus its `CopyButton`; the text stays `select-all` and its `title` is the full value, which is also what is copied.
- **`CodeBlock code label language`** — a monospaced `<pre>` that scrolls sideways, with a `CopyButton` top right; `language` is a label, not highlighting.

`ActivityDetailRow`, `SecretRevealCard` and `RecoveryPhraseCard` take `copyValue` to copy themselves this way; `onCopy` still works for existing callers. The destructive toast's copy control uses the hook and no longer shows "Copied" after a failed write. `CopyIcon` alone (`variant="tile"`) is the glyph for a row that is itself the control.

### ToneBadge

A small pill in a semantic tone, drawn from theme tokens only (the `muted` tone is `border-border bg-foreground/5 text-muted-foreground`, which is the old 10 % / 5 % / 55 % white on dark and stays visible on the light theme). `case="upper"` (default) is a status set as the eyebrow; `case="none"` is a value (a payout total) in `caption`, with no uppercase or tracking.

### Popover and DropdownMenu

Two floating surfaces on one look — `bg-popover`, a `border` hairline, `shadow-popover`, the same fade and 0.98 zoom as `Dialog` and `Select` — and two jobs:

- **`Popover`** is a panel anchored to a trigger for content that is *not* a menu: a note, a few buttons, a copy control. Tab walks everything inside in order.
- **`DropdownMenu`** is a real menu (`role="menu"`): `DropdownMenuItem`s (with `destructive` for Revoke / Delete, kept last), `DropdownMenuSeparator`, `DropdownMenuLabel`. The arrow keys move between items.

Both are Radix: Escape and a click outside close them and focus returns to the trigger. Never hand-roll either — `InlineSelector`'s panel predates them and handles neither Escape nor focus return.

### Collapsible

A button that opens and closes a section: `Collapsible` → `CollapsibleTrigger` (with `CollapsibleChevron`, which turns) → `CollapsibleContent`. Controlled or not (`open` / `defaultOpen` / `onOpenChange`); the trigger carries `aria-expanded` and `aria-controls`. It is the base of submenus, expandable lists and filter panels, and `DisclosureCard` is a card-styled Collapsible.

### Avatar

A circle, `sm` 32 px or `lg` 40 px: an image, or a fallback on the violet-to-info gradient (`from-secondary to-info`) with initials or the person glyph. Decorative (`aria-hidden`) unless `alt` is passed with an image that is itself the information.

### FormField

`<FormField label hint error>{control}</FormField>` wires a `Label` to its control (`htmlFor` / `id`, generated when absent), attaches the hint and the error with `aria-describedby`, marks the control `aria-invalid` on error and announces the error as an alert. Do not wire these by hand.

### Segmented control

Mutually exclusive options — a chart / list view toggle — are `FilterChipGroup variant="segmented"`: a radio group with one Tab stop, the arrow keys moving and selecting. An option may be icon-only; it then needs `ariaLabel`, which is also its tooltip. The default `chips` variant (the filter strip) is unchanged.

### Breakpoints

`breakpoint` in the tokens names the widths the `sm:` / `md:` … classes switch at (Tailwind's defaults: `sm` 40rem). `useMediaQuery(query)` is safe on the server and in jsdom (false without `matchMedia`); `useIsNarrow()` is true below `sm`.

### Lists and data

The pieces a data-dense page is assembled from. None of them carries product text; every visible label and accessible name has an English default and a prop to override it.

- **`QueryState`** keeps loading, error and empty apart, so a failed read never looks like an empty list. Loading: skeleton rows inside `role="status"`, named by `loadingLabel`, no visible text. Error: an `InfoPanel` inside `role="alert"`, worded by `classifyError(error) → { title, message, tone, retryable }` (a minimal default is provided), with `errorConsequence` above the message and "Try again" only when `retryable` and `onRetry`. Empty: `EmptyState`.
- **`EmptyState`** — title (required), description, one action, optional glyph; centred. `ActivityList`'s empty state renders through it.
- **`RecordList` / `RecordItem` / `RecordField`** — the stacked form of a table row for narrow screens: the same data, another layout. `identifier` and `status` on the first line, `summary` under the identifier, `RecordField`s (`<dt>`/`<dd>`, `wide` for two columns) in a two-column grid, `actions` bottom right. With `onOpen` the whole item opens it *and* an explicit chevron button does, since a clickable `<li>` is not reachable by keyboard; the button and the actions stop propagation. `selected` sets `aria-current`. Items divide with a `border` hairline — the `Table` divider exception, because this is a table row laid out differently.
- **`FilterBar activeCount onClear`** — the filters of a list. Wide: the controls in a row, "N filters applied" and "Clear all" when any is set. Narrow (`useIsNarrow`): one "Filters" toggle whose name carries the count ("Filters, 2 active"), opening the controls stacked under it (a `Collapsible`), "Clear all" still beside it.
- **`Pager offset limit returned`** — offset paging for an API with no total: a next page only after a full page, "{noun} 51–100" and never "of N", nothing at all when there is one page. `DotPagination` is for carousel steps, not data pages.
- **`DateRangeFilter`** — labelled From / To date inputs, "Clear" (disabled when empty), an optional refresh that spins while `isRefreshing`.
- **`ValueList values singular plural`** — strings in a cell, never truncated: "3 addresses" closed; one monospaced, selectable, copyable value per line open.
- **`EventTimeline`** — an ordered log (`<ol>`): the event, then its duration and timestamp, quieter. Values arrive formatted; the component never picks a locale or a time zone.
- **Checklists** are `SwapStepList connector={false}`: steps are `done`, `pending` (to do) or `unknown` (cannot be checked), each with its own glyph and a spoken status, optional `badges` and an `action`.

## Do's and Don'ts

- **DO** use `brand.primary` only for CTAs, active states, and success. It is a signal, not a decoration.
- **DON'T** style primary buttons inline with `bg-card` — use the `surface` button variant or ActionTile if the action is secondary, or use the real `primary` variant if it is the CTA.
- **DO** tint every network icon with its semantic color (`network.bitcoin`, `network.lightning`, etc.) even at 11 px in a filter cluster. The color *is* the information.
- **DON'T** recolor network tokens for visual harmony. Bitcoin is orange, RGB is red, they were orange and red before this app existed.
- **DO** use `surface.bg` (`#12131C`) as the page background on every full-screen view.
- **DON'T** use raw `#0a0a0a` or `#000` as a background. The ramp is near-black but never black, and that is what keeps the network colours legible on it.
- **DO** keep filter cluster icons at `cluster-icon-size: 11` px and `cluster-opacity: 0.6`. The constraint is what makes the cluster legible.
- **DON'T** introduce new drop shadows. The only shadows in the system are the card inner shadow and the primary-button glow on hover.
- **DO** use the `label` type token (Satoshi 700 / 9 / uppercase / `tracking-eyebrow` 0.18em) for structural labels — filter headers, section titles, pill captions. It is the typographic fingerprint of the brand.
- **DON'T** invent new radii, spacing steps, or surface colors. If you need something the tokens don't provide, extend DESIGN.md first, then propagate to `kaleido-ui/tokens` — `kaleido-ui/css` (Tailwind v4 `@theme`) and `kaleido-ui/tailwind` (the Tailwind v3 preset) are both generated from it. Both Tailwind versions are supported; see README.

## Coherence Rules (for agents & new components)

These rules exist because generated UIs kept drifting: ad-hoc borders, wrong button variants, inconsistent row shapes. Follow them exactly; they override any generic styling instinct.

### Surfaces separate by background layering, never ad-hoc borders

- The layering ladder is `surface.bg` (page) → `bg-card` (card) → `bg-muted/40` (row inside a card). Depth comes from the fill, not an outline.
- **DON'T** add arbitrary border utilities (`border-white/10`, `border-primary/20`, `border-warning/30`, `border-t` dividers…) to new markup. If a surface looks like it needs an edge, it needs a different background layer instead.
- Borders are allowed only where a component spec above explicitly calls for one: inputs, filter pills, status pills, the `border.primary-ghost` active state, `Table` row hairlines, and the `Drawer` edge rule and current-page rule. Nothing else.
- Separate stacked rows with `space-y-*` spacing, not divider lines. The single exception is `Table` (see its section): a dense grid, not a list.

### Rows and toggles use the shipped primitives

- Setting/permission toggle → `SwitchRow` (label, description, Switch). Never hand-roll a flex row around `Switch`.
- Navigation row in Settings → `SettingsTile` / `SettingItem`. Notice/callout → `InfoPanel` (pick a `tone`; don't build colored boxes). Small status chip → `ToneBadge`. Collapsible detail → `DisclosureCard`.
- If the primitive you need doesn't exist, add it HERE (kaleido-ui) first, then consume it — never prototype it inline in the consumer app.

### Button placement & variants

- One `primary` per screen, full-width, pinned at the bottom of the content flow — it is the CTA.
- Paired confirm/cancel: primary (or `destructive`) on the RIGHT, `ghost` cancel on the LEFT, equal widths.
- Row-level actions inside cards are `ghost` `size="sm"`; destructive row actions (Block, Delete) are `destructive` `size="sm"` and always sit rightmost.
- Never express an action as a styled `<div>`/`<button>` with utility classes — use `Button`.

## Transparency (glass) schema

Layered translucency lets the animated background glow breathe through the UI without hurting readability. Every translucent surface maps to exactly one of these roles — don't invent new alpha values.

- `glass.nav` — floating chrome (bottom nav, sticky headers): `bg-card/60 backdrop-blur-xl`
- `glass.card` — in-flow content cards over animated/haloed backgrounds: `bg-card/70`, NO blur (per-element blur on scrolling lists is a perf trap)
- `glass.row` — rows nested inside a card: `bg-muted/40`, no blur
- `glass.pill` — chips, filter pills, selector triggers: `bg-white/8`
- `glass.overlay` — sheets, dialogs, scrims: `bg-background/80 backdrop-blur-lg`

Rules:

- **DON'T** drop text-bearing glass below 60% surface alpha — readability beats atmosphere.
- **DON'T** nest blur inside blur. Inner layers are alpha-only; the outer surface owns the blur.
- **DO** keep security surfaces (sign/confirm prompts, seed reveal) fully opaque `bg-card`. A decision surface never lets the background bleed through.
- **DO** reserve `backdrop-blur` for floating chrome and overlays only — never on in-flow cards or rows.

## Keeping this file honest

Every value in this document is transcribed by hand from `src/tokens/`. That
makes drift possible, and it has happened: this file described `brand.primary` as
`#2BEE79` on an `hsl(160 12% 8%)` forest ramp, with a 9 px label at weight 800
and 0.2em tracking, for several releases after the tokens had moved to `#15E99A`
on a blue-slate ramp with a 700 weight cap and 0.18em tracking. Consumers that
followed the prose instead of the package pinned the wrong palette.

**`src/tokens/` is the source of truth. If the two disagree, this file is the
bug.** Check a value before quoting it:

```bash
node -e "const t=require('./dist/tokens/index.cjs'); console.log(t.colors.primary, t.fontWeight, t.letterSpacing)"
```

When you change a token, change this file in the same commit. When you add one,
add it here — a token nobody documents is a token nobody uses.

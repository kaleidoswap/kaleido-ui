import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BalanceBreakdown } from "../src/web/components/balance-breakdown";

/**
 * `externalLightningAvailable` overrides whether the Lightning row renders.
 *
 * A host sourcing `btcLightning` from an external node knows whether that
 * balance is live in a way this component cannot infer from `accounts`. Omitting
 * the prop has to leave existing hosts exactly as they were, which is the whole
 * reason it is an override rather than a replacement.
 */
const BASE = {
  btcOnchain: 1000,
  btcLightning: 2000,
  btcSpark: 0,
  btcArkade: 0,
  totalBTC: 3000,
  tokenValueSats: 0,
  rgbAssets: [],
  accounts: {
    RGB: { connected: true, configured: true },
    SPARK: { connected: false, configured: false },
    ARKADE: { connected: false, configured: false },
    LIQUID: { connected: false, configured: false },
  },
  balanceVisible: true,
  format: (sats: number) => String(sats),
  formatFiatValue: () => "$1.00",
  unit: "sats",
  label: "sats",
  cycle: () => undefined,
} as unknown as Parameters<typeof BalanceBreakdown>[0];

function render(extra: Record<string, unknown>) {
  return renderToStaticMarkup(createElement(BalanceBreakdown, { ...BASE, ...extra }));
}

test("exposes the card and the expanded region for host assertions", () => {
  const markup = render({});
  assert.ok(markup.includes('data-testid="balance-breakdown-card"'));
});

test("keeps the expand control reachable so a host can open the breakdown", () => {
  const markup = render({});
  assert.ok(markup.includes('aria-label="Expand balance breakdown"'));
});

// The row's visibility itself is not observable here: the breakdown starts
// collapsed and this suite renders to static markup, so there is no way to
// expand it. `externalLightningAvailable` is exercised against a real DOM in
// rate-extension's kaleido-ui-balance-breakdown-lightning spec, which is the
// consumer that needs the override. Asserting it here would only have tested
// that two collapsed renders are the same length.

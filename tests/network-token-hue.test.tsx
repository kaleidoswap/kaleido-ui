import assert from 'node:assert/strict'
import test from 'node:test'

import { colors } from '../src/tokens/colors'

/**
 * `networkChip` and `networkText` are the dark and light tints of each
 * network's base colour, so they must share its hue. `spark` once carried
 * `#284338` / `#D6E5DE` — greens, ~130° away from its `#FF6D00` base — which
 * read as a different network wherever a Spark chip was rendered.
 *
 * Hue is compared on the shortest arc so reds either side of 0° don't trip it.
 */

function toHue(hex: string): number {
  const value = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (delta === 0) return 0
  let hue: number
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  return (hue * 60 + 360) % 360
}

function toLightness(hex: string): number {
  const value = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
  return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2) * 100
}

/** Shortest distance between two hues on the colour wheel, in degrees. */
function hueDistance(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360
  return raw > 180 ? 360 - raw : raw
}

// Greys have no meaningful hue, so taproot is excluded from the hue check.
const HUED_NETWORKS = Object.keys(colors.network).filter((name) => name !== 'taproot')

test('every network chip and text tint keeps its base hue', () => {
  for (const name of HUED_NETWORKS) {
    const base = toHue(colors.network[name as keyof typeof colors.network])

    for (const tier of ['networkChip', 'networkText'] as const) {
      const tint = colors[tier][name as keyof (typeof colors)[typeof tier]]
      const drift = hueDistance(base, toHue(tint))
      assert.ok(
        drift <= 30,
        `${tier}.${name} (${tint}) is ${Math.round(drift)}° from network.${name}'s hue — tints must be the same colour, not a different one`,
      )
    }
  }
})

test('network text tints stay in one lightness band', () => {
  // Every light tint sits in the low-to-mid 60s–70s. An outlier means the value
  // was taken from another palette rather than derived from its own base.
  for (const name of HUED_NETWORKS) {
    const lightness = toLightness(colors.networkText[name as keyof typeof colors.networkText])
    assert.ok(
      lightness >= 55 && lightness <= 80,
      `networkText.${name} lightness ${Math.round(lightness)} is outside the 55–80 band shared by the other networks`,
    )
  }
})

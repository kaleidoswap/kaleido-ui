import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('balance expand control matches the refresh control footprint and uses a legible chevron', () => {
  const source = readFileSync(
    new URL('../src/web/components/balance-breakdown.tsx', import.meta.url),
    'utf8',
  )

  const controls = source.match(/className="flex size-7 items-center justify-center rounded-full/g) ?? []
  assert.equal(controls.length, 2)
  assert.match(source, /name=\{expanded \? 'expand_less' : 'expand_more'\}[\s\S]*size="md"[\s\S]*className="size-7 text-white\/60"/)
})

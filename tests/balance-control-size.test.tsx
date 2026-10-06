import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('balance refresh and expand are the same small surface IconButton, and the chevron names its state', () => {
  const source = readFileSync(
    new URL('../src/web/components/balance-breakdown.tsx', import.meta.url),
    'utf8',
  )

  const controls = source.match(/<IconButton[\s\S]*?variant="surface"[\s\S]*?size="sm"/g) ?? []
  assert.equal(controls.length, 2)
  assert.match(source, /icon=\{expanded \? 'expand_less' : 'expand_more'\}/)
  assert.match(source, /label=\{expanded \? 'Collapse balance breakdown' : 'Expand balance breakdown'\}/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { AccountStatusTabs, type AccountStatusTabItem } from '../src/web/components/account-status-tabs'

const account: AccountStatusTabItem<'SPARK'> = {
  id: 'SPARK',
  label: 'Spark',
  state: 'Ready',
  detail: 'Spark is connected.',
  icon: createElement('span', null, 'S'),
  detailIcon: createElement('span', null, 'Spark detail'),
  dotTone: 'bg-primary',
  title: 'Spark',
  description: 'Native Spark account.',
  capabilityBullets: ['Fast transfers'],
  networkLabel: 'Mainnet',
  networkBannerClassName: 'bg-primary/10',
  details: [
    { label: 'Connection', value: 'Lightspark API' },
    { label: 'Server', value: 'https://api.lightspark.com' },
  ],
}

test('account status tabs expose network chips that open details rather than editing directly', () => {
  const markup = renderToStaticMarkup(
    createElement(AccountStatusTabs, {
      accounts: [account],
      onEdit: () => undefined,
    }),
  )

  assert.match(markup, /aria-label="Open Spark details"/)
  assert.doesNotMatch(markup, /Edit Spark/)
})

test('the built-in details modal supports read-only fields and a primary edit route', () => {
  const source = readFileSync(
    new URL('../src/web/components/account-status-tabs.tsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /details\?: AccountStatusDetail\[\]/)
  assert.match(source, /detailIcon\?: ReactNode/)
  assert.match(source, /account\.detailIcon \?\? account\.icon/)
  assert.match(source, /data-testid={`account-status-protocol-logo-\$\{account\.id\}`}/)
  assert.match(source, /size-16/)
  assert.match(source, /Edit Settings/)
  assert.match(source, /name="settings"/)
  assert.doesNotMatch(source, /Edit \{account\.title\}/)
  assert.match(source, /account\.details\.map/)
  assert.match(source, /data-testid={`account-status-edit-\$\{account\.id\}`}/)
  assert.match(source, /onClick=\{\(\) => onEdit\(account\.id\)\}/)
  assert.match(source, /bg-primary text-primary-foreground/)
  assert.match(source, /setSelectedAccountId\(null\)[\s\S]*onEdit\(id\)/)
})

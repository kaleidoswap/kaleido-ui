import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'

import { mount } from './helpers/dom'
import { ActivityList } from '../src/web/components/activity-list'
import { TransactionCard } from '../src/web/components/transaction-card'

const badge = h('span', { 'data-testid': 'net' }, 'RGB')

test('the transaction card shows its network badge next to the title', () => {
  const view = mount(
    h(TransactionCard, {
      direction: 'inbound',
      status: 'success',
      displayAmount: '5',
      timestamp: 1_700_000_000,
      networkBadge: badge,
    }),
  )
  const title = view.container.querySelector('[data-testid="net"]')?.parentElement
  assert.ok(title?.textContent?.includes('Received'))
  view.unmount()
})

test('the activity list passes each item badge to its collapsed row', () => {
  const view = mount(
    h(ActivityList, {
      items: [
        {
          id: 'a',
          direction: 'outbound',
          status: 'pending',
          displayAmount: '1',
          timestamp: 1_700_000_000,
          networkBadge: badge,
        },
        { id: 'b', direction: 'inbound', status: 'success', displayAmount: '2', timestamp: 1_700_000_000 },
      ],
    }),
  )
  assert.equal(view.container.querySelectorAll('[data-testid="net"]').length, 1)
  view.unmount()
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import * as ui from '../src/web/index'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/web/primitives/table'

const grid = (cellClass?: string) =>
  renderToStaticMarkup(
    h(
      Table,
      null,
      h(TableCaption, null, 'Swaps in the period'),
      h(TableHeader, null, h(TableRow, null, h(TableHead, null, 'Id'), h(TableHead, null, 'Status'))),
      h(
        TableBody,
        null,
        h(TableRow, null, h(TableCell, { className: cellClass }, 'sw_1'), h(TableCell, null, 'completed')),
        h(TableRow, null, h(TableCell, null, 'sw_2'), h(TableCell, null, 'failed')),
      ),
      h(TableFooter, null, h(TableRow, null, h(TableCell, { colSpan: 2 }, '2 swaps'))),
    ),
  )

const classesOf = (markup: string, slot: string) =>
  [...markup.matchAll(new RegExp(`data-slot="${slot}"[^>]*class="([^"]*)"|class="([^"]*)"[^>]*data-slot="${slot}"`, 'g'))].map(
    (m) => (m[1] ?? m[2]).split(/\s+/),
  )

test('every Table part is exported from the package', () => {
  for (const name of [
    'Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHead', 'TableCell', 'TableCaption',
  ]) {
    assert.ok(name in ui, `${name} is not exported`)
  }
})

test('the table scrolls inside its own wrapper instead of widening the page', () => {
  const markup = grid()
  const [wrapper] = classesOf(markup, 'table-scroll')
  assert.ok(wrapper.includes('overflow-x-auto'))
  // min-w-0: a grid or flex column must not be held open at the table's width.
  assert.ok(wrapper.includes('min-w-0'))
  assert.match(markup, /data-slot="table-scroll"[^>]*><table/)
})

test('cells are caption at px-4 py-3; heads are the eyebrow in muted-foreground', () => {
  const markup = grid()
  assert.ok(classesOf(markup, 'table')[0].includes('text-caption'))
  for (const cell of classesOf(markup, 'table-cell')) {
    assert.ok(cell.includes('px-4') && cell.includes('py-3'), cell.join(' '))
  }
  for (const head of classesOf(markup, 'table-head')) {
    for (const token of ['px-4', 'py-3', 'text-mini', 'font-bold', 'uppercase', 'tracking-eyebrow', 'text-muted-foreground']) {
      assert.ok(head.includes(token), `head lacks ${token}: ${head.join(' ')}`)
    }
  }
})

test('rows divide with a border hairline and hover on bg-muted/50', () => {
  const rows = classesOf(grid(), 'table-row')
  assert.ok(rows.length >= 3)
  for (const row of rows) {
    assert.ok(row.includes('border-b') && row.includes('border-border'))
    assert.ok(row.includes('hover:bg-muted/50'))
  }
})

test('no size class in the table is a Tailwind default', () => {
  const markup = grid()
  assert.doesNotMatch(markup, /(?<![\w-])text-(xs|sm|base|lg|[2-9]?xl)(?![\w-])/)
})

test('a consumer class reaches the cell and wins over the default', () => {
  const [first] = classesOf(grid('text-body text-right'), 'table-cell')
  assert.ok(first.includes('text-right'))
  assert.ok(first.includes('text-body'))
})

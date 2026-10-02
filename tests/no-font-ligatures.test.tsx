import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { createElement, Fragment, type ComponentType, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import * as ui from '../src/web/index'
import { ErrorBoundary } from '../src/web/components/error-boundary'

// A Material Symbols ligature is a <span class="material-symbols-outlined">
// whose TEXT is the icon's name. kaleido-ui ships no Material Symbols font, so
// for a consumer that has not self-hosted it the name is what renders: a status
// pill read "error Failed", an empty state read "receipt_long". Nothing throws
// and nothing logs; a label just says the wrong words. Every glyph is drawn by
// the SVG `Icon` primitive instead, and the two tests below keep it that way.

const WEB = join(import.meta.dirname, '..', 'src', 'web')

/** The class as a class token — not the `[&_.material-symbols-outlined]` selector form. */
const LIGATURE = /class="(?:[^"]*\s)?material-symbols-outlined(?:\s[^"]*)?"/

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.(tsx?|css)$/.test(name) ? [path] : []
  })

test('no source file in src/web spells an icon as a font ligature', () => {
  const offenders = sourceFiles(WEB).filter((file) =>
    /material-symbols/i.test(readFileSync(file, 'utf8')),
  )
  assert.deepEqual(
    offenders.map((file) => relative(WEB, file)),
    [],
    'render the glyph with <Icon name="…" /> — add it to src/web/icons if it is missing',
  )
})

const noop = () => undefined
const noopAsync = async () => undefined

const withdrawConfirmation = {
  isConfirming: false,
  isPollingStatus: false,
  setShowConfirmation: noop,
  displayAmount: 1_000,
  selectedAssetId: 'BTC',
  destination: 'bc1qexample',
  networkLabel: 'On-chain',
  estimatedFee: 250,
  feeRate: 'medium',
  addressType: 'bitcoin' as const,
  decodedRgbInvoice: null,
  witnessAmountSat: 0,
  amount: '1000',
  handleConfirmSend: noop,
}

const net = ui.NETWORK_CONFIG.lightning

/**
 * Components that need props to render, in the states that draw their icons —
 * spinners, empty states, success marks. Each entry renders every state listed.
 */
const FIXTURES: Record<string, () => ReactElement[]> = {
  ActivityList: () => [createElement(ui.ActivityList, { items: [] })],
  BalanceBreakdown: () => [
    createElement(ui.BalanceBreakdown, {
      btcOnchain: 1_000,
      btcLightning: 2_000,
      btcSpark: 0,
      btcArkade: 0,
      totalBTC: 3_000,
      rgbAssets: [],
      accounts: { RGB: { connected: true, configured: true } },
      balanceVisible: true,
      format: String,
      formatFiatValue: String,
      unit: 'sats',
      label: 'Balance',
      cycle: noop,
      onRefresh: noop,
      onNavigate: noop,
      tokenValueSats: 500,
    }),
  ],
  BtcUnifiedReceive: () => [
    createElement(ui.BtcUnifiedReceive, {
      btcSelectedAccount: 'RGB',
      accountReceiveResult: {
        qrValue: 'bitcoin:bc1qexample',
        qrLabel: 'Bitcoin',
        addresses: [{ network: 'onchain', label: 'On-chain', value: 'bc1qexample' }],
      },
      invoiceStatus: 'Pending',
      isInvoicePending: true,
      isInvoicePaid: false,
      isInvoiceFailedOrExpired: false,
      amount: '',
      handleAmountChange: noop,
      loading: true,
      copied: null,
      copyToClipboard: noopAsync,
      setAddress: noop,
      setAmount: noop,
      setInvoiceStatus: noop,
      setAccountReceiveResult: noop,
      handleDone: noop,
    }),
  ],
  DepositGeneratedView: () =>
    (['lightning', 'onchain'] as const).map((network) =>
      createElement(ui.DepositGeneratedView, {
        network,
        net: ui.NETWORK_CONFIG[network],
        isBtc: true,
        address: 'lnbc1example',
        addressLabel: 'Invoice',
        recipientId: '',
        arkSubMode: 'ark',
        invoiceStatus: 'Pending',
        isInvoicePending: true,
        isInvoicePaid: false,
        isInvoiceFailedOrExpired: false,
        amount: '1000',
        handleAmountChange: noop,
        loading: true,
        copied: null,
        copyToClipboard: noopAsync,
        getUnitLabel: () => 'sats',
        selectedAsset: null,
        maxDepositAmount: 0,
        setAddress: noop,
        setRecipientId: noop,
        setAmount: noop,
        setInvoiceStatus: noop,
      }),
    ),
  DepositPreGeneration: () =>
    [
      { isAutoGenerate: true, loading: true },
      { isAutoGenerate: false, loading: true },
      { isAutoGenerate: false, loading: false, needsColorableUtxos: true, onOpenCreateUtxos: noop },
    ].map((state) =>
      createElement(ui.DepositPreGeneration, {
        selectedAsset: null,
        isBtc: true,
        network: 'lightning',
        net,
        selectedAccount: 'RGB',
        currentMethod: 'lightning',
        channelsLoading: true,
        showChannelWarning: false,
        showLiquidityWarning: false,
        usePrivacy: false,
        setUsePrivacy: noop,
        amount: '',
        handleAmountChange: noop,
        getUnitLabel: () => 'sats',
        generateInvoice: noopAsync,
        ...state,
      }),
    ),
  DepositSuccessScreen: () => [
    createElement(ui.DepositSuccessScreen, {
      handleDone: noop,
      displayTicker: 'BTC',
      network: 'lightning',
    }),
  ],
  InvoiceStatusBanner: () =>
    [
      [true, false, false],
      [false, true, false],
      [false, false, true],
    ].map(([isInvoicePending, isInvoicePaid, isInvoiceFailedOrExpired]) =>
      createElement(ui.InvoiceStatusBanner, {
        isInvoicePending,
        isInvoicePaid,
        isInvoiceFailedOrExpired,
        invoiceStatus: 'Expired',
      }),
    ),
  NETWORK_CONFIG: () =>
    Object.values(ui.NETWORK_CONFIG).map((entry) => createElement(Fragment, null, entry.icon)),
  NumberInput: () => [createElement(ui.NumberInput, { value: '1', onChange: noop })],
  SettingItem: () => [
    createElement(ui.SettingItem, { icon: 'settings', title: 'Settings', onClick: noop }),
  ],
  TransactionCard: () => [
    createElement(ui.TransactionCard, {
      direction: 'inbound',
      status: 'completed',
      displayAmount: '1,000',
      timestamp: 1_700_000_000,
      onSubAmountInfo: noop,
      subAmount: '1,000 sats',
    } as never),
  ],
  WithdrawConfirmation: () =>
    [
      {},
      { isConfirming: true },
      { isPollingStatus: true },
    ].map((state) => createElement(ui.WithdrawConfirmation, { ...withdrawConfirmation, ...state })),
  WithdrawDestinationInput: () =>
    [false, true].map((isDecoding) =>
      createElement(ui.WithdrawDestinationInput, {
        destination: 'bc1qexample',
        setDestination: noop,
        addressType: 'bitcoin',
        isDecoding,
        isResolvingLnurl: false,
        handlePaste: noop,
        handleReset: noop,
      }),
    ),
  ErrorBoundary: () => {
    // Server rendering never runs getDerivedStateFromError, so draw the
    // default fallback from a boundary already in its error state.
    const boundary = new ErrorBoundary({ children: null })
    boundary.state = { hasError: true, error: new Error('boom') }
    return [boundary.render() as ReactElement]
  },
}

/**
 * Exports that only render inside a root they are parts of (Dialog, Select,
 * Tabs, Toast), or whose required props are data this test has no fixture for.
 * Their source is still covered by the scan above; listing one here is a
 * decision, so a new export is swept by default.
 */
const NOT_RENDERED = new Set([
  'DialogClose', 'DialogContent', 'DialogDescription', 'DialogOverlay', 'DialogPortal', 'DialogTitle', 'DialogTrigger',
  'DrawerClose', 'DrawerContent', 'DrawerDescription', 'DrawerOverlay', 'DrawerPortal', 'DrawerTitle', 'DrawerTrigger',
  'SelectItem', 'SelectLabel', 'SelectTrigger', 'SelectValue',
  'TabsContent', 'TabsList', 'TabsTrigger', 'ActivityTypeTabs',
  'Toast', 'ToastAction', 'ToastViewport',
  'AccountChoiceChip', 'AccountInfoGrid', 'AccountNetworkPicker', 'AccountNetworkSelector', 'AccountStatusTabs',
  'ActivityFilterBar', 'ActivityNetworkFilters', 'AssetCard', 'AssetIcon', 'AssetInfoChip', 'AssetSelector',
  'BottomNav', 'DepositAssetSelection', 'DepositInvoiceGeneration', 'FilterChipGroup', 'FilterDropdown',
  'InlineSelector', 'MethodChoiceChip', 'NetworkBadge', 'NetworkInfoChip', 'NetworkInfoDisclosure',
  'OptionSelector', 'RecoveryPhraseCard', 'StatusBadge', 'SummaryRows', 'SwapBadge', 'SwapInputCard',
  'SwapStepList', 'WalletAssetList', 'WithdrawAmountInput', 'WithdrawRouteSelector', 'TrendChart',
  // Parts of a Radix root, and a field that needs its control; covered by
  // tests/primitives-p1.test.tsx.
  'CollapsibleContent', 'CollapsibleTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuPortal',
  'DropdownMenuTrigger', 'FormField', 'PopoverAnchor', 'PopoverClose', 'PopoverContent', 'PopoverTrigger',
  // Need their data; tests/lists-p3.test.tsx renders them.
  'DateRangeFilter', 'EventTimeline', 'ValueList',
  // Charts need their data; tests/charts.test.tsx renders every one of them.
  'LineChart', 'AreaChart', 'BarChart', 'BarList', 'DonutChart', 'ScatterChart', 'Sparkline',
  'ChartLegend', 'ChartTooltip', 'ChartFrame',
])

const isComponent = (name: string, value: unknown): value is ComponentType<Record<string, unknown>> =>
  /^[A-Z]/.test(name) &&
  (typeof value === 'function' || (typeof value === 'object' && value !== null && '$$typeof' in value))

const render = (element: ReactElement): string => {
  // Some fixtures log a React warning (an SVG attribute spelled in kebab
  // case in the hero animations); it is not what this test is about.
  const error = console.error
  console.error = () => undefined
  try {
    return renderToStaticMarkup(element)
  } finally {
    console.error = error
  }
}

test('no exported component renders a ligature span', () => {
  const rendered: string[] = []
  const unrenderable: string[] = []

  for (const [name, value] of Object.entries(ui)) {
    if (!isComponent(name, value) || NOT_RENDERED.has(name) || name in FIXTURES) continue
    let markup: string
    try {
      markup = render(createElement(value, {}))
    } catch {
      unrenderable.push(name)
      continue
    }
    assert.doesNotMatch(markup, LIGATURE, `${name} renders a font ligature`)
    rendered.push(name)
  }

  for (const [name, fixture] of Object.entries(FIXTURES)) {
    for (const [index, element] of fixture().entries()) {
      const markup = render(element)
      assert.doesNotMatch(markup, LIGATURE, `${name} (state ${index}) renders a font ligature`)
      // Network marks are artwork, some of it an <img>; everything else is an Icon.
      assert.match(markup, /<svg|<img/, `${name} (state ${index}) drew no icon at all`)
    }
    rendered.push(name)
  }

  assert.deepEqual(
    unrenderable,
    [],
    'these exports need props to render: add a fixture above, or list them in NOT_RENDERED',
  )
  assert.ok(rendered.length > 90, `only ${rendered.length} exports were rendered`)
})

test('an unknown icon name draws nothing rather than printing the name', () => {
  const markup = render(
    createElement(ui.SettingItem, { icon: 'not_a_glyph', title: 'Unknown' } as never),
  )
  assert.doesNotMatch(markup, /not_a_glyph/)
})

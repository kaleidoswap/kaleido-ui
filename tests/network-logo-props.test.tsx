import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { protocolIcons } from '../src/web/assets/protocol-icons'
import { AssetCard } from '../src/web/components/asset-card'
import { AssetIcon } from '../src/web/components/asset-icon'
import { AssetSelector } from '../src/web/components/asset-selector'
import { DepositAssetSelection } from '../src/web/components/deposit-asset-selection'
import { QrCode } from '../src/web/components/qr-code'

const attr = (value: string) => value.replace(/&/g, '&amp;')

test('AssetIcon renders no badge without networkLogoSrc', () => {
  const markup = renderToStaticMarkup(createElement(AssetIcon, { ticker: 'USDT', logoUri: '/usdt.png' }))
  assert.doesNotMatch(markup, /data-asset-network-badge/)
})

test('AssetIcon keeps the token artwork and overlays the network mark', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetIcon, { ticker: 'USDT', logoUri: '/usdt.png', networkLogoSrc: '/rgb.webp' }),
  )
  assert.match(markup, /src="\/usdt\.png"/)
  assert.match(markup, /data-asset-network-badge=""[^>]*><img src="\/rgb\.webp"/)
})

test('QrCode draws logoSrc instead of the KaleidoSwap mark', () => {
  const withLogo = renderToStaticMarkup(createElement(QrCode, { value: 'bitcoin:bc1qexample', logoSrc: '/ln.svg' }))
  assert.match(withLogo, /<image href="\/ln\.svg"/)

  const plain = renderToStaticMarkup(createElement(QrCode, { value: 'bitcoin:bc1qexample' }))
  assert.doesNotMatch(plain, /<image /)
  assert.match(plain, /<g transform="translate\(/)
})

test('AssetSelector falls back to the bundled protocol mark for the network badge', () => {
  const markup = renderToStaticMarkup(
    createElement(AssetSelector, {
      label: 'From',
      selectedTicker: 'USDT',
      options: [{ id: 'usdt-rgb', ticker: 'USDT', network: 'RGB20' as const }],
      compact: true,
      onChange: () => undefined,
    }),
  )
  assert.ok(markup.includes(`src="${attr(protocolIcons.RGB20!)}"`))
})

test('AssetCard badges the icon only when the asset is on exactly one network', () => {
  const one = renderToStaticMarkup(createElement(AssetCard, { ticker: 'USDT', networks: ['Spark'] }))
  assert.match(one, /data-asset-network-badge/)

  const two = renderToStaticMarkup(createElement(AssetCard, { ticker: 'USDT', networks: ['Spark', 'LN'] }))
  assert.doesNotMatch(two, /data-asset-network-badge/)
})

test('DepositAssetSelection badges owned assets with their protocol mark', () => {
  const markup = renderToStaticMarkup(
    createElement(DepositAssetSelection, {
      setCurrentView: () => undefined,
      isNewAsset: false,
      newAssetAccount: null,
      newAssetId: '',
      setNewAssetId: () => undefined,
      // A search expands the owned-assets list.
      searchQuery: 'usdt',
      setSearchQuery: () => undefined,
      filteredAssets: [{ asset_id: 'rgb:usdt', ticker: 'USDT', accountId: 'RGB', icon: '/usdt.png' }],
      onSelectAsset: () => undefined,
      handleAddNewAsset: () => undefined,
      handleContinueToGenerate: () => undefined,
      isRgbConnected: true,
      isSparkConnected: false,
      isArkadeConnected: false,
    }),
  )
  assert.match(markup, /src="\/usdt\.png"/)
  assert.ok(markup.includes(`src="${attr(protocolIcons.RGB20!)}"`))
})

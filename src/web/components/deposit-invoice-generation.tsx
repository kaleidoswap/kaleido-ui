import { AssetIcon } from './asset-icon'
import { cn } from '../utils/cn'
import {
  AccountChoiceChip,
  MethodChoiceChip,
  NETWORK_CONFIG,
  type DepositAccountId,
  type DepositNetworkKey,
  type DepositTransferMethod,
} from './deposit-ui-shared'
import { DepositSuccessScreen } from './deposit-success-screen'
import { BtcUnifiedReceive, type BtcUnifiedReceiveResult } from './btc-unified-receive'
import { DepositPreGeneration } from './deposit-pre-generation'
import { DepositGeneratedView } from './deposit-generated-view'
import { ScrollArea } from './scroll-area'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'

export interface DepositInvoiceAsset {
  asset_id?: string
  ticker?: string
  name?: string
  precision?: number
}

export interface DepositGenerationController {
  amount: string
  address: string
  recipientId: string
  loading: boolean
  depositDetected: boolean
  invoiceStatus: string | null
  isInvoicePending: boolean
  isInvoicePaid: boolean
  isInvoiceFailedOrExpired: boolean
  accountReceiveResult: BtcUnifiedReceiveResult | null
  copied: boolean
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  generateInvoice: () => Promise<void>
  copyToClipboard: (text: string) => Promise<void>
  getUnitLabel: () => string
  setAddress: (value: string) => void
  setRecipientId: (value: string) => void
  setAmount: (value: string) => void
  setInvoiceStatus: (value: string | null) => void
  setAccountReceiveResult: (result: null) => void
}

export interface DepositInvoiceGenerationProps {
  handleBack: () => void
  handleDone: () => void
  selectedAsset: DepositInvoiceAsset | null
  selectedAssetId: string
  isNewAsset: boolean
  channelsLoading: boolean
  channels: unknown[]
  network: DepositNetworkKey
  setNetwork: (network: DepositNetworkKey) => void
  isLightningAvailable: boolean
  isRgbConnected: boolean
  isSparkConnected: boolean
  isArkadeConnected: boolean
  isSparkLightning: boolean
  maxDepositAmount: number
  usePrivacy: boolean
  setUsePrivacy: (value: boolean) => void
  walletChoice: 'RGB' | 'SPARK'
  setWalletChoice: (choice: 'RGB' | 'SPARK') => void
  arkSubMode: 'ark' | 'boarding'
  setArkSubMode: (mode: 'ark' | 'boarding') => void
  btcSelectedAccount: DepositAccountId
  gen: DepositGenerationController
  /**
   * RGB on-chain only: when true, the pre-generation step shows a warning
   * banner and swaps the Generate CTA for "Create Colorable UTXOs". Wire
   * `onOpenCreateUtxos` to open your own RGB UTXO creation modal.
   */
  needsColorableUtxos?: boolean
  onOpenCreateUtxos?: () => void
}

type AssetFamily = 'BTC' | 'RGB' | 'SPARK' | 'ARKADE'

const ACCOUNT_TITLES: Record<DepositAccountId, string> = {
  RGB: 'RGB & Lightning',
  SPARK: 'Spark',
  ARKADE: 'Arkade',
}

function getAssetFamily(assetId: string, ticker?: string | null): AssetFamily {
  if (assetId === 'BTC') return 'BTC'
  const normalized = (ticker || '').trim().toUpperCase()
  if (normalized.startsWith('SPARK')) return 'SPARK'
  if (normalized.startsWith('ARK')) return 'ARKADE'
  return 'RGB'
}

function resolveReceiveAccounts({
  assetFamily,
  accounts,
}: {
  assetFamily: AssetFamily
  accounts: Record<DepositAccountId, boolean>
}): DepositAccountId[] {
  if (assetFamily === 'RGB') return accounts.RGB ? ['RGB'] : []
  if (assetFamily === 'SPARK') return accounts.SPARK ? ['SPARK'] : []
  if (assetFamily === 'ARKADE') return accounts.ARKADE ? ['ARKADE'] : []
  return (['RGB', 'SPARK', 'ARKADE'] as DepositAccountId[]).filter((account) => accounts[account])
}

function resolveReceiveMethodOptions({
  account,
  assetFamily,
  accounts,
  isLightningAvailable,
}: {
  account: DepositAccountId
  assetFamily: AssetFamily
  accounts: Record<DepositAccountId, boolean>
  isLightningAvailable: boolean
}) {
  const options: Array<{
    method: DepositTransferMethod
    enabled: boolean
    disabledReason?: string
  }> = []

  if (account === 'RGB') {
    options.push({ method: 'bitcoin_l1', enabled: accounts.RGB })
    if (assetFamily === 'BTC' || assetFamily === 'RGB') {
      options.push({
        method: 'lightning',
        enabled: accounts.RGB && isLightningAvailable,
        disabledReason: isLightningAvailable ? undefined : 'unavailable',
      })
    }
  }
  if (account === 'SPARK') {
    options.push({ method: 'spark', enabled: accounts.SPARK })
  }
  if (account === 'ARKADE') {
    options.push({ method: 'arkade', enabled: accounts.ARKADE })
    if (assetFamily === 'BTC') options.push({ method: 'boarding', enabled: accounts.ARKADE })
  }

  return options
}

export function DepositInvoiceGeneration({
  handleBack,
  handleDone,
  selectedAsset,
  selectedAssetId,
  isNewAsset,
  channelsLoading,
  channels,
  network,
  setNetwork,
  isLightningAvailable,
  isRgbConnected,
  isSparkConnected,
  isArkadeConnected,
  isSparkLightning,
  maxDepositAmount,
  usePrivacy,
  setUsePrivacy,
  walletChoice,
  setWalletChoice,
  arkSubMode,
  setArkSubMode,
  btcSelectedAccount,
  gen,
  needsColorableUtxos,
  onOpenCreateUtxos,
}: DepositInvoiceGenerationProps) {
  const {
    amount,
    address,
    recipientId,
    loading,
    depositDetected,
    invoiceStatus,
    isInvoicePending,
    isInvoicePaid,
    isInvoiceFailedOrExpired,
    accountReceiveResult,
    copied,
    handleAmountChange,
    generateInvoice,
    copyToClipboard,
    getUnitLabel,
    setAddress,
    setRecipientId,
    setAmount,
    setInvoiceStatus,
    setAccountReceiveResult,
  } = gen

  const isBtc = selectedAssetId === 'BTC'
  const assetFamily = getAssetFamily(selectedAssetId, selectedAsset?.ticker)
  const displayTicker = selectedAsset?.ticker ?? (isBtc ? 'BTC' : 'RGB')
  const selectedAccount: DepositAccountId =
    network === 'spark'
      ? 'SPARK'
      : network === 'arkade'
        ? 'ARKADE'
        : network === 'lightning' && isBtc && walletChoice === 'SPARK'
          ? 'SPARK'
          : 'RGB'

  const currentMethod: DepositTransferMethod =
    network === 'spark'
      ? 'spark'
      : network === 'arkade'
        ? arkSubMode === 'boarding'
          ? 'boarding'
          : 'arkade'
        : network === 'lightning'
          ? 'lightning'
          : 'bitcoin_l1'

  const routeAccounts = {
    RGB: isRgbConnected,
    SPARK: isSparkConnected,
    ARKADE: isArkadeConnected,
  }
  const availableAccounts = resolveReceiveAccounts({ assetFamily, accounts: routeAccounts })
  const methodOptions = resolveReceiveMethodOptions({
    account: selectedAccount,
    assetFamily,
    accounts: routeAccounts,
    isLightningAvailable,
  })

  const applyMethodSelection = (account: DepositAccountId, method: DepositTransferMethod) => {
    if (account === 'SPARK') setWalletChoice('SPARK')
    else if (account === 'RGB') setWalletChoice('RGB')

    switch (method) {
      case 'bitcoin_l1':
        setNetwork('onchain')
        setWalletChoice('RGB')
        break
      case 'lightning':
        setNetwork('lightning')
        setWalletChoice(account === 'SPARK' ? 'SPARK' : 'RGB')
        break
      case 'spark':
        setNetwork('spark')
        setWalletChoice('SPARK')
        break
      case 'arkade':
        setNetwork('arkade')
        setArkSubMode('ark')
        break
      case 'boarding':
        setNetwork('arkade')
        setArkSubMode('boarding')
        break
      case 'submarine_swap':
        setNetwork('lightning')
        setWalletChoice('RGB')
        break
    }
  }

  const handleAccountSelect = (account: DepositAccountId) => {
    const nextOptions = resolveReceiveMethodOptions({
      account,
      assetFamily,
      accounts: routeAccounts,
      isLightningAvailable,
    })
      .filter((option) => option.enabled)
      .map((option) => option.method)
    const nextMethod = nextOptions.includes(currentMethod) ? currentMethod : nextOptions[0]
    if (nextMethod) applyMethodSelection(account, nextMethod)
  }

  if (depositDetected) {
    return (
      <DepositSuccessScreen
        handleDone={handleDone}
        displayTicker={displayTicker}
        selectedAsset={selectedAsset}
        network={network}
        arkSubMode={arkSubMode}
      />
    )
  }

  const net = NETWORK_CONFIG[network]
  const isAutoGenerate =
    (network === 'onchain' && isBtc) ||
    network === 'spark' ||
    network === 'arkade' ||
    network === 'lightning'
  const addressLabel =
    network === 'spark'
      ? 'Spark Address'
      : network === 'arkade'
        ? arkSubMode === 'boarding'
          ? 'Boarding Address'
          : 'Arkade Address'
        : network === 'lightning'
          ? 'Lightning Invoice'
          : 'Deposit Address'
  const showChannelWarning =
    selectedAccount === 'RGB' &&
    network === 'lightning' &&
    !channelsLoading &&
    channels.length === 0 &&
    !isSparkConnected
  const showLiquidityWarning =
    !isSparkLightning && network === 'lightning' && maxDepositAmount === 0 && !channelsLoading && !isBtc
  const isNewRgbAsset = isNewAsset && assetFamily === 'RGB'

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background pt-16 font-display text-foreground">
      <div className="absolute left-4 top-4 z-30">
        <Button type="button" variant="ghost" size="icon-xl" onClick={handleBack} aria-label="Go back">
          <Icon name="arrow_back" size="xl" />
        </Button>
      </div>

      {(() => {
        // Suppress the destination/transfer chip rail entirely when the user
        // is creating a new Spark or Arkade asset — the destination is
        // implicit (it's the protocol they just chose on the asset
        // selection step), so the chip row is just visual noise.
        const hideDestinationRail =
          isNewAsset && (network === 'spark' || network === 'arkade')
        if (hideDestinationRail) return null
        return (
          <div className="flex-shrink-0 border-b border-border bg-background px-4 py-2">
            <div className="space-y-2">
              <div>
                <p className="text-xxs font-bold uppercase tracking-widest text-white/35">
                  Destination Account
                </p>
                <div className="mt-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {availableAccounts.map((account) => (
                    <AccountChoiceChip
                      key={account}
                      account={account}
                      active={isBtc ? btcSelectedAccount === account : selectedAccount === account}
                      onClick={() => {
                        if (isBtc) {
                          if (account === 'SPARK') {
                            setWalletChoice('SPARK')
                            setNetwork('spark')
                          } else if (account === 'ARKADE') {
                            setNetwork('arkade')
                            setWalletChoice('RGB')
                          } else {
                            setWalletChoice('RGB')
                            setNetwork('onchain')
                          }
                        } else {
                          handleAccountSelect(account)
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
          {!isBtc && !(isNewAsset && (network === 'spark' || network === 'arkade')) && (
            <div>
              <p className="text-xxs font-bold uppercase tracking-widest text-white/35">
                Transfer Method
              </p>
              <div className="mt-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                {methodOptions.map(({ method, enabled, disabledReason }) => (
                  <MethodChoiceChip
                    key={method}
                    method={method}
                    active={currentMethod === method}
                    enabled={enabled}
                    disabledReason={disabledReason}
                    onClick={() => enabled && applyMethodSelection(selectedAccount, method)}
                  />
                ))}
              </div>
            </div>
          )}
            </div>
          </div>
        )
      })()}

      <ScrollArea className="flex-1" viewportAs="main" viewportClassName="space-y-2.5 px-4 py-2.5">
        {isBtc && accountReceiveResult ? (
          <BtcUnifiedReceive
            btcSelectedAccount={btcSelectedAccount}
            accountReceiveResult={accountReceiveResult}
            invoiceStatus={invoiceStatus}
            isInvoicePending={isInvoicePending}
            isInvoicePaid={isInvoicePaid}
            isInvoiceFailedOrExpired={isInvoiceFailedOrExpired}
            amount={amount}
            handleAmountChange={handleAmountChange}
            loading={loading}
            copied={copied}
            copyToClipboard={copyToClipboard}
            setAddress={setAddress}
            setAmount={setAmount}
            setInvoiceStatus={setInvoiceStatus}
            setAccountReceiveResult={setAccountReceiveResult}
            handleDone={handleDone}
          />
        ) : isBtc && !accountReceiveResult && loading ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <div
              className={cn(
                'flex size-16 items-center justify-center rounded-2xl border',
                NETWORK_CONFIG[
                  btcSelectedAccount === 'SPARK'
                    ? 'spark'
                    : btcSelectedAccount === 'ARKADE'
                      ? 'arkade'
                      : 'onchain'
                ].bg,
                NETWORK_CONFIG[
                  btcSelectedAccount === 'SPARK'
                    ? 'spark'
                    : btcSelectedAccount === 'ARKADE'
                      ? 'arkade'
                      : 'onchain'
                ].border
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined animate-spin text-icon-4xl',
                  NETWORK_CONFIG[
                    btcSelectedAccount === 'SPARK'
                      ? 'spark'
                      : btcSelectedAccount === 'ARKADE'
                        ? 'arkade'
                        : 'onchain'
                  ].text
                )}
              >
                progress_activity
              </span>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-bold text-muted-foreground">Generating addresses...</p>
              <p className="text-xs text-white/30">{ACCOUNT_TITLES[btcSelectedAccount]}</p>
            </div>
          </div>
        ) : !address ? (
          <DepositPreGeneration
            selectedAsset={selectedAsset}
            isBtc={isBtc}
            network={network}
            net={net}
            selectedAccount={selectedAccount}
            currentMethod={currentMethod}
            channelsLoading={channelsLoading}
            showChannelWarning={showChannelWarning}
            showLiquidityWarning={showLiquidityWarning}
            isAutoGenerate={isAutoGenerate}
            loading={loading}
            usePrivacy={usePrivacy}
            setUsePrivacy={setUsePrivacy}
            amount={amount}
            handleAmountChange={handleAmountChange}
            getUnitLabel={getUnitLabel}
            generateInvoice={generateInvoice}
            needsColorableUtxos={needsColorableUtxos}
            onOpenCreateUtxos={onOpenCreateUtxos}
            showReceiveSummary={!isNewRgbAsset}
          />
        ) : (
          <DepositGeneratedView
            network={network}
            net={net}
            isBtc={isBtc}
            address={address}
            addressLabel={addressLabel}
            recipientId={recipientId}
            arkSubMode={arkSubMode}
            invoiceStatus={invoiceStatus}
            isInvoicePending={isInvoicePending}
            isInvoicePaid={isInvoicePaid}
            isInvoiceFailedOrExpired={isInvoiceFailedOrExpired}
            amount={amount}
            handleAmountChange={handleAmountChange}
            loading={loading}
            copied={copied}
            copyToClipboard={copyToClipboard}
            getUnitLabel={getUnitLabel}
            selectedAsset={selectedAsset}
            maxDepositAmount={maxDepositAmount}
            setAddress={setAddress}
            setRecipientId={setRecipientId}
            setAmount={setAmount}
            setInvoiceStatus={setInvoiceStatus}
            handleDone={handleDone}
            showQrNetworkBadge={false}
          />
        )}
      </ScrollArea>
    </div>
  )
}

import type { WithdrawAddressType } from './withdraw-destination-input'

export interface WithdrawInvoiceAsset {
  asset_id: string
  ticker: string
  precision: number
}

export interface WithdrawInvoiceInfoLnInvoice {
  amount?: number | null
  asset_id?: string
  asset_amount?: number | null
  description?: string
}

export interface WithdrawInvoiceInfoRgbInvoice {
  asset_id?: string
  assignment?: { value?: number | null } | null
  recipient_type?: string
}

export interface WithdrawInvoiceInfoProps {
  addressType: WithdrawAddressType
  decodedLnInvoice: WithdrawInvoiceInfoLnInvoice | null
  decodedRgbInvoice: WithdrawInvoiceInfoRgbInvoice | null
  allAssets: WithdrawInvoiceAsset[]
  selectedAssetId: string
  selectedAssetTicker: string | undefined
  assetBalance: number
  maxLightningCapacity: number
}

function getAssetPrecisionForId(allAssets: WithdrawInvoiceAsset[], assetId: string): number {
  return allAssets.find((asset) => asset.asset_id === assetId)?.precision ?? 0
}

function formatRawAmount(amount: number, precision: number): string {
  return (amount / Math.pow(10, precision)).toLocaleString('en-US', {
    maximumFractionDigits: precision,
    minimumFractionDigits: 0,
  })
}

export function WithdrawInvoiceInfo({
  addressType,
  decodedLnInvoice,
  decodedRgbInvoice,
  allAssets,
  selectedAssetId,
  selectedAssetTicker,
  assetBalance,
  maxLightningCapacity,
}: WithdrawInvoiceInfoProps) {
  if (decodedLnInvoice && addressType === 'lightning') {
    return (
      <div className="space-y-3 rounded-2xl border bg-card p-5 shadow-inner">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Lightning Invoice
        </p>
        {decodedLnInvoice.amount != null && decodedLnInvoice.amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-white">
              {decodedLnInvoice.amount.toLocaleString()}{' '}
              {decodedLnInvoice.asset_id ? 'units' : 'sats'}
            </span>
          </div>
        )}
        {decodedLnInvoice.asset_id && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Asset</span>
            <span className="font-mono text-xs text-white">
              {allAssets.find((asset) => asset.asset_id === decodedLnInvoice.asset_id)?.ticker ??
                `${decodedLnInvoice.asset_id.substring(0, 12)}...`}
            </span>
          </div>
        )}
        {decodedLnInvoice.asset_amount != null && decodedLnInvoice.asset_amount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Asset Amount</span>
            <span className="font-bold text-white">
              {decodedLnInvoice.asset_amount.toLocaleString()}
            </span>
          </div>
        )}
        {decodedLnInvoice.description && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Description</span>
            <span className="max-w-[180px] truncate text-right text-white">
              {decodedLnInvoice.description}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Channel Capacity</span>
          <span className="text-white">
            {Math.floor(maxLightningCapacity / 1000).toLocaleString()} sats
          </span>
        </div>
      </div>
    )
  }

  if (decodedRgbInvoice && addressType === 'rgb') {
    return (
      <div className="space-y-3 rounded-2xl border bg-card p-5 shadow-inner">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">RGB Invoice</p>
        {decodedRgbInvoice.asset_id && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Asset</span>
            <span className="font-mono text-xs text-white">
              {allAssets.find((asset) => asset.asset_id === decodedRgbInvoice.asset_id)?.ticker ??
                `${decodedRgbInvoice.asset_id.substring(0, 8)}...${decodedRgbInvoice.asset_id.slice(-8)}`}
            </span>
          </div>
        )}
        {decodedRgbInvoice.assignment?.value != null &&
          decodedRgbInvoice.assignment.value > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Requested Amount</span>
              <span className="font-bold text-white">
                {formatRawAmount(
                  decodedRgbInvoice.assignment.value,
                  getAssetPrecisionForId(allAssets, decodedRgbInvoice.asset_id ?? selectedAssetId)
                )}
              </span>
            </div>
          )}
        {decodedRgbInvoice.recipient_type && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Recipient Type</span>
            <span className="text-white">{decodedRgbInvoice.recipient_type}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Your Balance</span>
          <span className="text-white">
            {formatRawAmount(assetBalance, getAssetPrecisionForId(allAssets, selectedAssetId))}{' '}
            {selectedAssetTicker ?? 'units'}
          </span>
        </div>
      </div>
    )
  }

  if (addressType === 'bitcoin' || addressType === 'arkade') {
    return (
      <div className="rounded-2xl border bg-card p-5 shadow-inner">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {addressType === 'arkade' ? 'Available Arkade Balance' : 'Available Balance'}
          </span>
          <span className="font-bold text-white">
            {formatRawAmount(assetBalance, getAssetPrecisionForId(allAssets, selectedAssetId))}{' '}
            {selectedAssetTicker ?? 'sats'}
          </span>
        </div>
      </div>
    )
  }

  return null
}

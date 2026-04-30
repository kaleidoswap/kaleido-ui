import type { ChangeEvent } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { QrCode } from './qr-code'
import {
  CopyIcon,
  InvoiceStatusBanner,
  NETWORK_CONFIG,
  NetworkInfoDisclosure,
  PaidOverlay,
  type DepositAccountId,
  type DepositNetworkKey,
} from './deposit-ui-shared'

export interface BtcUnifiedReceiveAddress {
  network: DepositNetworkKey
  label: string
  value: string
}

export interface BtcUnifiedReceiveResult {
  qrValue: string
  qrLabel: string
  addresses: BtcUnifiedReceiveAddress[]
}

export interface BtcUnifiedReceiveProps {
  btcSelectedAccount: DepositAccountId
  accountReceiveResult: BtcUnifiedReceiveResult
  invoiceStatus: string | null
  isInvoicePending: boolean
  isInvoicePaid: boolean
  isInvoiceFailedOrExpired: boolean
  amount: string
  handleAmountChange: (event: ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  copied: boolean
  copyToClipboard: (text: string) => Promise<void>
  setAddress: (value: string) => void
  setAmount: (value: string) => void
  setInvoiceStatus: (value: string | null) => void
  setAccountReceiveResult: (result: null) => void
  handleDone: () => void
}

export function BtcUnifiedReceive({
  btcSelectedAccount,
  accountReceiveResult,
  invoiceStatus,
  isInvoicePending,
  isInvoicePaid,
  isInvoiceFailedOrExpired,
  amount,
  handleAmountChange,
  loading,
  copied,
  copyToClipboard,
  setAddress,
  setAmount,
  setInvoiceStatus,
  setAccountReceiveResult,
  handleDone,
}: BtcUnifiedReceiveProps) {
  const accountNetwork =
    btcSelectedAccount === 'SPARK' ? 'spark' : btcSelectedAccount === 'ARKADE' ? 'arkade' : 'onchain'
  const qrNetwork = NETWORK_CONFIG[accountNetwork]

  return (
    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1.5 rounded-xl border border-white/8 bg-white/3 p-2.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/40">
            Amount (optional)
          </label>
        </div>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Any amount (amountless)"
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-1.5 font-mono text-xs font-bold text-white transition-all placeholder:text-white/25 focus:border-primary/40 focus:outline-none"
          inputMode="decimal"
        />
        {amount && loading && (
          <p className="flex items-center gap-1 text-xxs text-yellow-400/70">
            <span className="material-symbols-outlined animate-spin text-[11px]">
              progress_activity
            </span>
            Updating invoice...
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'relative flex flex-col items-center rounded-2xl border-2 bg-white p-2 transition-all',
            qrNetwork.qrBorder,
            qrNetwork.qrGlow
          )}
        >
          <QrCode value={accountReceiveResult.qrValue} size={200} />
          {isInvoicePaid && <PaidOverlay />}
        </div>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest transition-all',
            copied
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-border bg-white/5 text-muted-foreground hover:border-white/20 hover:bg-accent hover:text-white'
          )}
          onClick={(event) => {
            event.stopPropagation()
            void copyToClipboard(accountReceiveResult.qrValue)
          }}
        >
          <Icon name={copied ? 'check' : 'content_copy'} size="xs" />
          {copied ? 'Copied' : `Copy ${accountReceiveResult.qrLabel}`}
        </button>
      </div>

      {invoiceStatus && (
        <InvoiceStatusBanner
          isInvoicePending={isInvoicePending}
          isInvoicePaid={isInvoicePaid}
          isInvoiceFailedOrExpired={isInvoiceFailedOrExpired}
          invoiceStatus={invoiceStatus}
        />
      )}

      <div className="space-y-1.5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
          Available Addresses
        </p>
        {accountReceiveResult.addresses.map((address) => {
          const network = NETWORK_CONFIG[address.network]
          return (
            <div
              key={address.network}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-xl border bg-white/3 px-2.5 py-1.5',
                'transition-all hover:bg-white/6 active:scale-[0.98]',
                network.border
              )}
              style={{ borderLeftWidth: 3, borderLeftColor: network.color }}
              onClick={() => void copyToClipboard(address.value)}
            >
              <div className={cn('flex size-5 flex-shrink-0 items-center justify-center rounded-md', network.bg)}>
                {network.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('text-[9px] font-bold uppercase tracking-widest', network.text)}>
                  {address.label}
                </p>
                <p className="mt-0.5 truncate font-mono text-tiny text-muted-foreground">
                  {address.value.length > 50
                    ? `${address.value.slice(0, 18)}...${address.value.slice(-14)}`
                    : address.value}
                </p>
              </div>
              <CopyIcon copied={copied} />
            </div>
          )
        })}
      </div>

      <NetworkInfoDisclosure
        networks={Array.from(
          new Set(accountReceiveResult.addresses.map((address) => address.network))
        )}
      />

      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            setAddress('')
            setAmount('')
            setInvoiceStatus(null)
            setAccountReceiveResult(null)
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-xs font-bold text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-white active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          New Address
        </button>
        <Button variant="cta" onClick={handleDone}>
          <span className="material-symbols-outlined text-[14px]">check</span>
          Done
        </Button>
      </div>
    </div>
  )
}

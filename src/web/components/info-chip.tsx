import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { AssetIcon } from './asset-icon'
import { NetworkBadge, type NetworkType } from './network-badge'

export type InfoChipStatus = 'success' | 'warning' | 'danger' | 'info'

export interface InfoChipContentProps {
  /** Decorative leading visual. Its meaning must also be present in label/value text. */
  leading?: ReactNode
  /** Always-visible description for the read-only value. */
  label: string
  /** Read-only information. Text values wrap safely by default. */
  value: ReactNode
  status?: InfoChipStatus
  /** Visible status text. Defaults to a readable label for the selected status. */
  statusLabel?: string
  className?: string
  valueClassName?: string
  'data-testid'?: string
  'data-info-kind'?: 'network' | 'asset'
}

export type InfoChipEditAction =
  | {
      onEdit: () => void
      /** Required accessible name for the icon-only edit action. */
      editLabel: string
      editDisabled?: boolean
    }
  | {
      onEdit?: never
      editLabel?: never
      editDisabled?: never
    }

export type InfoChipProps = InfoChipContentProps & InfoChipEditAction

const defaultStatusLabel: Record<InfoChipStatus, string> = {
  success: 'Success',
  warning: 'Warning',
  danger: 'Error',
  info: 'Info',
}

const leadingToneClass: Record<InfoChipStatus, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

const statusToneClass: Record<InfoChipStatus, string> = {
  success: 'border-success/25 bg-success/10 text-success',
  warning: 'border-warning/25 bg-warning/10 text-warning',
  danger: 'border-danger/25 bg-danger/10 text-danger',
  info: 'border-info/25 bg-info/10 text-info',
}

const statusDotClass: Record<InfoChipStatus, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

export function InfoChip({
  leading,
  label,
  value,
  status,
  statusLabel,
  onEdit,
  editLabel,
  editDisabled,
  className,
  valueClassName,
  'data-testid': dataTestId,
  'data-info-kind': dataInfoKind,
}: InfoChipProps) {
  const readableStatus = status ? (statusLabel ?? defaultStatusLabel[status]) : null

  return (
    <div
      data-slot="info-chip"
      data-status={status}
      data-info-kind={dataInfoKind}
      data-testid={dataTestId}
      className={cn(
        'flex w-full max-w-full items-center gap-3 rounded-xl border border-white/10 bg-surface-card px-3 py-2.5',
        className,
      )}
    >
      {leading && (
        <span
          aria-hidden="true"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground [&_svg]:size-icon-lg',
            status && leadingToneClass[status],
          )}
        >
          {leading}
        </span>
      )}

      <dl className="min-w-0 flex-1">
        <dt className="truncate text-xxs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              'min-w-0 max-w-full [overflow-wrap:anywhere] text-sm font-semibold leading-5 text-foreground',
              valueClassName,
            )}
          >
            {value}
          </span>
          {status && (
            <span
              className={cn(
                'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-xxs font-bold leading-4',
                statusToneClass[status],
              )}
            >
              <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', statusDotClass[status])} />
              <span className="truncate">{readableStatus}</span>
            </span>
          )}
        </dd>
      </dl>

      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={onEdit}
          disabled={editDisabled}
          aria-label={editLabel}
          title={editLabel}
          className="shrink-0"
        >
          <Icon name="edit" size="sm" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}

type SpecializedInfoChipProps = Omit<
  InfoChipContentProps,
  'leading' | 'label' | 'value' | 'data-info-kind'
> &
  InfoChipEditAction

export type NetworkInfoChipProps = SpecializedInfoChipProps & {
  network: NetworkType
  label?: string
  value?: ReactNode
  iconBasePath?: string
}

export function NetworkInfoChip({
  network,
  label = 'Network',
  value = network,
  iconBasePath,
  ...infoChipProps
}: NetworkInfoChipProps) {
  return (
    <InfoChip
      {...infoChipProps}
      data-info-kind="network"
      leading={<NetworkBadge network={network} iconBasePath={iconBasePath} size="md" />}
      label={label}
      value={value}
    />
  )
}

export type AssetInfoChipProps = SpecializedInfoChipProps & {
  ticker: string
  label?: string
  value?: ReactNode
  logoUri?: string
  cdnBaseUrl?: string
}

export function AssetInfoChip({
  ticker,
  label = 'Asset',
  value = ticker,
  logoUri,
  cdnBaseUrl,
  ...infoChipProps
}: AssetInfoChipProps) {
  return (
    <InfoChip
      {...infoChipProps}
      data-info-kind="asset"
      leading={<AssetIcon ticker={ticker} logoUri={logoUri} cdnBaseUrl={cdnBaseUrl} size={28} />}
      label={label}
      value={value}
    />
  )
}

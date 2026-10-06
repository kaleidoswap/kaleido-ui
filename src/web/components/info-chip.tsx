import type { ReactNode } from 'react'
import { cn } from '../utils/cn'
import { AssetIcon } from './asset-icon'
import { NetworkBadge, type NetworkType } from './network-badge'
import { eyebrow } from '../utils/type-roles'
import { IconButton } from '../primitives/icon-button'

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
  success: 'bg-success/10 text-success-fg',
  warning: 'bg-warning/10 text-warning-fg',
  danger: 'bg-danger/10 text-danger-fg',
  info: 'bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25',
}

const statusToneClass: Record<InfoChipStatus, string> = {
  success: 'border-success/25 bg-success/10 text-success-fg',
  warning: 'border-warning/25 bg-warning/10 text-warning-fg',
  danger: 'border-danger/25 bg-danger/10 text-danger-fg',
  info: 'border-secondary/30 bg-secondary/15 text-secondary-content',
}

const statusDotClass: Record<InfoChipStatus, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-secondary-content',
}

export interface StatusChipProps {
  status: InfoChipStatus
  /** Defaults to the status name (Success, Warning, Error, Info). */
  label?: string
  className?: string
}

/** The small tinted pill with a dot: the status an InfoChip carries, usable on its own. */
export function StatusChip({ status, label, className }: StatusChipProps) {
  return (
    <span
      data-slot="status-chip"
      data-status={status}
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-xxs font-bold leading-4',
        statusToneClass[status],
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', statusDotClass[status])} />
      <span className="truncate">{label ?? defaultStatusLabel[status]}</span>
    </span>
  )
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
        'flex w-full max-w-full items-center gap-3 rounded-xl border border-border bg-surface-card bg-gradient-card px-3 py-2.5 shadow-raised',
        className,
      )}
    >
      {leading && (
        <span
          aria-hidden="true"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25 [&_svg]:size-icon-lg',
            status && leadingToneClass[status],
          )}
        >
          {leading}
        </span>
      )}

      <dl className="min-w-0 flex-1">
        <dt className={cn('truncate text-muted-foreground', eyebrow)}>
          {label}
        </dt>
        <dd className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              'min-w-0 max-w-full [overflow-wrap:anywhere] text-body font-semibold leading-5 text-foreground',
              valueClassName,
            )}
          >
            {value}
          </span>
          {status && <StatusChip status={status} label={readableStatus ?? undefined} />}
        </dd>
      </dl>

      {onEdit && (
        <IconButton icon="edit" label={editLabel} onClick={onEdit} disabled={editDisabled} />
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

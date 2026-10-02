import type { ReactNode } from 'react'
import { AccountHeaderIcons, type AccountSettingsProtocol } from './account-settings-shared'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'
import { eyebrow } from '../utils/type-roles'

export interface AccountCapabilitiesCardProps {
  accountId: AccountSettingsProtocol
  title: string
  description: string
  status: string
  capabilities: string[]
  accent: 'primary' | 'blue' | 'purple'
  isExpanded: boolean
  onToggle: () => void
  collapsible?: boolean
  children?: ReactNode
}

export function AccountCapabilitiesCard({
  accountId,
  title,
  description,
  status,
  capabilities,
  accent,
  isExpanded,
  onToggle,
  collapsible = true,
  children,
}: AccountCapabilitiesCardProps) {
  const accentClasses =
    accent === 'primary'
      ? 'bg-primary/5 text-brand'
      : accent === 'blue'
        ? 'bg-info/5 text-info-fg'
        : 'bg-network-arkade/5 text-network-arkade-fg'

  return (
    <div className="rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-4 shadow-card transition-all duration-300">
      <div
        className={cn(
          'group flex items-start justify-between gap-3',
          collapsible && 'cursor-pointer'
        )}
        onClick={collapsible ? onToggle : undefined}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <AccountHeaderIcons accountId={accountId} />
          <div className="min-w-0 flex-1">
            <h3 className="text-body font-bold text-foreground transition-colors group-hover:text-secondary-content">{title}</h3>
            <p className="mt-1 text-caption text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-1', eyebrow,
              accentClasses
            )}
          >
            {status}
          </span>
          {collapsible && (
            <div className="mt-1 text-muted-foreground transition-colors group-hover:text-secondary-content">
              <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size="md" />
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-5 duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="mb-6 space-y-2">
            <h4 className={cn('mb-2 text-muted-foreground', eyebrow)}>
              Capabilities
            </h4>
            {capabilities.map((capability) => (
              <div key={capability} className="flex items-center gap-2 text-caption text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-secondary-content" />
                <span>{capability}</span>
              </div>
            ))}
          </div>

          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  )
}

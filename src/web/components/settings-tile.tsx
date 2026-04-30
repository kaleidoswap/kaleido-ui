import type { ReactNode } from 'react'
import { AppIcon } from './app-icon'

export interface SettingsTileProps {
  icon: ReactNode
  title: string
  description?: string
  value?: string
  onClick: () => void
}

export function SettingsTile({ icon, title, description, value, onClick }: SettingsTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-card p-5 text-left transition-all duration-200 hover:bg-accent active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            {icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-bold text-body tracking-wide text-foreground">{title}</span>
            {description && (
              <span className="mt-0.5 text-sm font-medium text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {value && <span className="font-mono text-xs text-muted-foreground">{value}</span>}
          <AppIcon name="chevronRight" className="size-4 text-muted-foreground" />
        </div>
      </div>
    </button>
  )
}

export function SettingsStatusPanel({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
      {label}: <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

export function SettingsActionButton({
  icon,
  children,
  onClick,
}: {
  icon?: ReactNode
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 font-bold text-muted-foreground transition-all hover:bg-accent"
    >
      {icon}
      {children}
    </button>
  )
}

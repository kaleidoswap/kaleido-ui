import type { ReactNode } from 'react'
import { Button } from '../primitives/button'
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
      className="group w-full rounded-2xl bg-card/55 backdrop-blur-xl backdrop-saturate-150 bg-gradient-card p-5 text-left shadow-card-secondary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover-soft active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary-content transition-all group-hover-gradient-violet group-hover:shadow-glow-violet-faint">
            {icon}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="font-bold text-body tracking-wide text-foreground">{title}</span>
            {description && (
              <span className="mt-0.5 text-caption font-medium text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {value && <span className="font-mono text-caption text-muted-foreground">{value}</span>}
          <AppIcon name="chevronRight" className="size-4 text-muted-foreground transition-colors group-hover:text-secondary-content" />
        </div>
      </div>
    </button>
  )
}

export function SettingsStatusPanel({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-secondary/10 px-4 py-3 text-caption text-muted-foreground ring-1 ring-inset ring-secondary/20">
      {label}: <span className="font-semibold text-foreground">{value}</span>
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
    <Button type="button" variant="h2" size="lg" onClick={onClick}>
      {icon}
      {children}
    </Button>
  )
}

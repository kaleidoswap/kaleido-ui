import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

/**
 * `info` is blue (the `info` hue), unlike `StatusChip`'s violet info; `violet`
 * is the brand violet; `bitcoin` is the Bitcoin network chip.
 */
export type TagTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'bitcoin'

export interface TagProps {
  children: ReactNode
  tone?: TagTone
  className?: string
}

// Tints and per-theme foregrounds only, so every tone reads on both themes.
const tagToneClass: Record<TagTone, string> = {
  neutral: 'bg-foreground/[0.07] text-muted-foreground',
  success: 'bg-success/10 text-success-fg',
  warning: 'bg-warning/10 text-warning-fg',
  danger: 'bg-danger/10 text-danger-fg',
  info: 'bg-info/12 text-info-fg',
  violet: 'bg-secondary/15 text-secondary-content',
  bitcoin: 'bg-network-bitcoin-chip text-network-bitcoin-fg',
}

/**
 * A label pill in a tone, with no status dot: what a thing is, not how it
 * is doing ("Revenue share", "Markup"). The `StatusChip` shape and type, its
 * tint as the only edge. For a status use `StatusChip`, which carries the dot.
 */
export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      data-slot="tag"
      data-tone={tone}
      className={cn(
        'inline-flex max-w-full items-center whitespace-nowrap rounded-full px-3 py-1 text-caption font-medium',
        tagToneClass[tone],
        className,
      )}
    >
      <span className="truncate">{children}</span>
    </span>
  )
}

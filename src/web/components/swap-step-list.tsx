import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

/**
 * `done`, `active`, `pending` and `failed` are a flow's steps. `unknown` is a
 * step that cannot be verified from here — a checklist item whose state the
 * app has no way to read — and is never drawn as done or as to-do.
 */
export type SwapStepStatus = 'done' | 'active' | 'pending' | 'failed' | 'unknown'

export interface SwapStepItem {
  id: string
  label: string
  /** One line on what is happening, or the evidence that settled the step. */
  description?: ReactNode
  status: SwapStepStatus
  /** Small labels beside the title: "Required", "Admin only". */
  badges?: ReactNode
  /** What the reader can do about this step: a button, a link. */
  action?: ReactNode
}

export interface SwapStepListProps {
  steps: SwapStepItem[]
  /**
   * The rail between steps. On (default) for a flow whose steps follow one
   * another; off for a checklist, whose items stand alone.
   */
  connector?: boolean
  /** What each status is called for screen readers; the dot is decorative. */
  statusLabels?: Partial<Record<SwapStepStatus, string>>
  className?: string
}

const defaultStatusLabels: Record<SwapStepStatus, string> = {
  done: 'Done',
  active: 'In progress',
  pending: 'To do',
  failed: 'Failed',
  unknown: 'Cannot be checked',
}

// Status is carried by the dot's fill alone — no rings, per DESIGN.md's
// "depth comes from the fill, not an outline".
const dotClass: Record<SwapStepStatus, string> = {
  done: 'bg-primary bg-gradient-primary text-background shadow-glow-primary-soft',
  active: 'bg-secondary bg-gradient-brand text-white shadow-glow-violet',
  pending: 'bg-secondary/15 text-secondary-content ring-1 ring-inset ring-secondary/25',
  failed: 'bg-danger/20 text-danger-fg',
  unknown: 'bg-foreground/8 text-muted-foreground ring-1 ring-inset ring-foreground/10',
}

const labelClass: Record<SwapStepStatus, string> = {
  done: 'text-foreground',
  active: 'text-foreground',
  pending: 'text-muted-foreground',
  failed: 'text-danger-fg',
  unknown: 'text-foreground',
}

/**
 * A vertical, self-describing progress list for multi-step protocol flows —
 * swap legs, recovery runs, onboarding chains — and, with `connector={false}`,
 * a checklist (done / to do / cannot be checked), each item with optional
 * badges and an action.
 *
 * Use this (not the horizontal dot stepper) when each step needs a line of
 * evidence next to it: a txid, "waiting for the counterparty", the reason a
 * step is stuck. Steps carry their own `status`, so the caller maps protocol
 * state to the list rather than the list inferring an index — a flow whose
 * third step fails while the second is still open renders correctly.
 *
 * The status never rests on colour alone: each has its own glyph (a check, a
 * cross, a question mark, or the step number) and a word for screen readers.
 * The connector under each step reads "done" only when that step is done, so
 * the filled rail always stops at the real frontier of the flow.
 */
export function SwapStepList({ steps, connector = true, statusLabels, className }: SwapStepListProps) {
  const labels = { ...defaultStatusLabels, ...statusLabels }
  return (
    // A checklist's items stand alone, so a hairline rule separates them where
    // a flow has its rail.
    <div
      data-slot="swap-step-list"
      className={cn('flex flex-col', !connector && 'divide-y divide-divider/35', className)}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <div
            key={step.id}
            data-slot="swap-step"
            data-status={step.status}
            className={cn('flex gap-3', !connector && 'py-3 first:pt-0 last:pb-0')}
          >
            <div className="flex w-5 shrink-0 flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  'flex size-5 items-center justify-center rounded-full text-xxs font-bold',
                  dotClass[step.status],
                  step.status === 'active' && 'animate-pulse',
                )}
              >
                {step.status === 'done' ? (
                  <Icon name="check" className="text-icon-sm" />
                ) : step.status === 'failed' ? (
                  <Icon name="close" className="text-icon-sm" />
                ) : step.status === 'unknown' ? (
                  <Icon name="help" className="text-icon-sm" />
                ) : (
                  index + 1
                )}
              </span>
              {connector && !isLast && (
                <span
                  aria-hidden
                  className={cn(
                    'mt-1 w-0.5 flex-1',
                    step.status === 'done' ? 'bg-primary/60' : step.status === 'active' ? 'bg-secondary/40' : 'bg-secondary/15',
                  )}
                />
              )}
            </div>
            <div className={cn('min-w-0 flex-1', connector && !isLast ? 'pb-4' : 'pb-0')}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn('text-body font-medium', labelClass[step.status])}>
                  <span className="sr-only">{labels[step.status]}: </span>
                  {step.label}
                </p>
                {step.badges}
              </div>
              {step.description && (
                <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                  {step.description}
                </p>
              )}
              {step.action && <div className="mt-2">{step.action}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

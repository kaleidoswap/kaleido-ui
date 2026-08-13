import type { ReactNode } from 'react'
import { Icon } from '../primitives/icon'
import { cn } from '../utils/cn'

export type SwapStepStatus = 'done' | 'active' | 'pending' | 'failed'

export interface SwapStepItem {
  id: string
  label: string
  /** One line on what is happening, or the evidence that settled the step. */
  description?: ReactNode
  status: SwapStepStatus
}

export interface SwapStepListProps {
  steps: SwapStepItem[]
  className?: string
}

// Status is carried by the dot's fill alone — no rings, per DESIGN.md's
// "depth comes from the fill, not an outline".
const dotClass: Record<SwapStepStatus, string> = {
  done: 'bg-primary text-background',
  active: 'bg-warning/20 text-warning',
  pending: 'bg-muted/40 text-muted-foreground',
  failed: 'bg-danger/20 text-danger',
}

const labelClass: Record<SwapStepStatus, string> = {
  done: 'text-foreground',
  active: 'text-foreground',
  pending: 'text-muted-foreground',
  failed: 'text-danger',
}

/**
 * A vertical, self-describing progress list for multi-step protocol flows —
 * swap legs, recovery runs, onboarding chains.
 *
 * Use this (not the horizontal dot stepper) when each step needs a line of
 * evidence next to it: a txid, "waiting for the counterparty", the reason a
 * step is stuck. Steps carry their own `status`, so the caller maps protocol
 * state to the list rather than the list inferring an index — a flow whose
 * third step fails while the second is still open renders correctly.
 *
 * The connector under each step reads "done" only when that step is done, so
 * the filled rail always stops at the real frontier of the flow.
 */
export function SwapStepList({ steps, className }: SwapStepListProps) {
  return (
    <div data-slot="swap-step-list" className={cn('flex flex-col', className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          <div
            key={step.id}
            data-slot="swap-step"
            data-status={step.status}
            className="flex gap-3"
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
                ) : (
                  index + 1
                )}
              </span>
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    'mt-1 w-0.5 flex-1',
                    step.status === 'done' ? 'bg-primary/60' : 'bg-muted/40',
                  )}
                />
              )}
            </div>
            <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-4')}>
              <p className={cn('text-sm font-medium', labelClass[step.status])}>{step.label}</p>
              {step.description && (
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
